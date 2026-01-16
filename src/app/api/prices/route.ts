import { NextResponse } from "next/server";

/**
 * API Route: GET /api/prices
 *
 * Proxies CoinGecko API requests to avoid CORS issues.
 * CoinGecko's public API doesn't allow direct browser requests,
 * so we need to proxy through our Next.js backend.
 *
 * Implements aggressive caching to avoid rate limits on CoinGecko's free tier.
 *
 * Query params:
 * - ids: Comma-separated list of CoinGecko coin IDs
 * - vs_currencies: Currency to get prices in (default: usd)
 * - include_last_updated_at: Include timestamp (default: true)
 * - include_24hr_change: Include 24h price change percentage (default: false)
 */

// In-memory cache for development/production
const priceCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION_MS = 60 * 1000; // 1 minute

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids");
    const vsCurrencies = searchParams.get("vs_currencies") || "usd";
    const includeLastUpdated = searchParams.get("include_last_updated_at") || "true";
    const include24hrChange = searchParams.get("include_24hr_change") || "false";

    if (!ids) {
        return NextResponse.json(
            { error: "Missing required parameter: ids" },
            { status: 400 }
        );
    }

    // Create cache key (include all parameters)
    const cacheKey = `${ids}-${vsCurrencies}-${includeLastUpdated}-${include24hrChange}`;

    // Check cache first
    const cached = priceCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
        return NextResponse.json(cached.data, {
            headers: {
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
                "X-Cache": "HIT",
            },
        });
    }

    try {
        const coingeckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vsCurrencies}&include_last_updated_at=${includeLastUpdated}&include_24hr_change=${include24hrChange}`;

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
                        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
                        "X-Cache": "STALE",
                    },
                });
            }

            throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Update cache
        priceCache.set(cacheKey, {
            data,
            timestamp: Date.now(),
        });

        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
                "X-Cache": "MISS",
            },
        });
    } catch (error) {
        console.error("Failed to fetch prices from CoinGecko:", error);

        // Return stale cache if available
        if (cached) {
            console.warn("Returning stale cache due to error");
            return NextResponse.json(cached.data, {
                headers: {
                    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
                    "X-Cache": "ERROR-STALE",
                },
            });
        }

        return NextResponse.json(
            { error: "Failed to fetch cryptocurrency prices" },
            { status: 500 }
        );
    }
}
