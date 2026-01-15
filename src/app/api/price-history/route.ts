import { NextResponse } from "next/server";

/**
 * API Route: GET /api/price-history
 *
 * Proxies CoinGecko market_chart API requests to avoid CORS issues.
 * Fetches historical price data for sparkline charts.
 *
 * Implements caching to avoid rate limits.
 *
 * Query params:
 * - id: CoinGecko coin ID (required)
 * - days: Number of days of history (default: 7)
 */

// In-memory cache
const historyCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const days = searchParams.get("days") || "7";

    if (!id) {
        return NextResponse.json(
            { error: "Missing required parameter: id" },
            { status: 400 }
        );
    }

    // Create cache key
    const cacheKey = `${id}-${days}`;

    // Check cache first
    const cached = historyCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
        return NextResponse.json(cached.data, {
            headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
                "X-Cache": "HIT",
            },
        });
    }

    try {
        const coingeckoUrl = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`;

        const response = await fetch(coingeckoUrl, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            // If rate limited and we have cached data (even if expired), use it
            if (response.status === 429 && cached) {
                console.warn("CoinGecko rate limit hit, serving stale cache");
                return NextResponse.json(cached.data, {
                    headers: {
                        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
                        "X-Cache": "STALE",
                    },
                });
            }

            throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Update cache
        historyCache.set(cacheKey, {
            data,
            timestamp: Date.now(),
        });

        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
                "X-Cache": "MISS",
            },
        });
    } catch (error) {
        console.error("Failed to fetch price history from CoinGecko:", error);

        // Return stale cache if available
        if (cached) {
            console.warn("Returning stale cache due to error");
            return NextResponse.json(cached.data, {
                headers: {
                    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
                    "X-Cache": "ERROR-STALE",
                },
            });
        }

        return NextResponse.json(
            { error: "Failed to fetch price history" },
            { status: 500 }
        );
    }
}
