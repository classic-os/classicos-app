/**
 * Price Adapter
 *
 * Fetches cryptocurrency prices from public APIs.
 * Uses CoinGecko free API (no auth required) for ETC ecosystem price data.
 *
 * Following three-layer pattern:
 * - Adapter (this file): Pure functions for RPC/API calls
 * - Hook: React Query integration with caching
 * - UI: Display formatted price data
 */

export type PriceData = {
    price: number; // USD price
    lastUpdated: number; // Unix timestamp
    change24h?: number; // 24h price change percentage (e.g., 5.2 for +5.2%)
};

export type ETCPriceData = {
    etc: PriceData; // Native ETC
    usc: PriceData; // Classic USD (USC)
    wetc: PriceData; // Wrapped ETC (WETC)
    lastUpdated: number; // Overall timestamp
};

/**
 * Fetches all ETC ecosystem prices in USD from CoinGecko API
 *
 * Uses Next.js API route to avoid CORS issues with direct CoinGecko API calls.
 * The API route proxies requests to CoinGecko and adds caching headers.
 *
 * Fetches three key prices:
 * 1. ETC (ethereum-classic) - Native asset
 * 2. USC (classic-usd) - Stablecoin (1:1 USD peg with arbitrage opportunities)
 * 3. WETC (wrapped-etc-2) - Wrapped ETC for DEX trading
 *
 * @returns Price data for all three assets
 * @throws Error if fetch fails or response is invalid
 */
export async function fetchETCEcosystemPrices(): Promise<ETCPriceData> {
    // Use Next.js API route to avoid CORS issues
    // Request 24h price change data in addition to current prices
    const url =
        "/api/prices?ids=ethereum-classic,classic-usd,wrapped-etc-2&vs_currencies=usd&include_last_updated_at=true&include_24hr_change=true";

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ETC ecosystem prices: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure for all three assets
    if (
        !data ||
        !data["ethereum-classic"] ||
        typeof data["ethereum-classic"].usd !== "number"
    ) {
        throw new Error("Invalid ETC price data response from CoinGecko");
    }

    if (
        !data["classic-usd"] ||
        typeof data["classic-usd"].usd !== "number"
    ) {
        throw new Error("Invalid USC price data response from CoinGecko");
    }

    if (
        !data["wrapped-etc-2"] ||
        typeof data["wrapped-etc-2"].usd !== "number"
    ) {
        throw new Error("Invalid WETC price data response from CoinGecko");
    }

    const now = Date.now() / 1000;

    return {
        etc: {
            price: data["ethereum-classic"].usd,
            lastUpdated: data["ethereum-classic"].last_updated_at || now,
            change24h: data["ethereum-classic"].usd_24h_change,
        },
        usc: {
            price: data["classic-usd"].usd,
            lastUpdated: data["classic-usd"].last_updated_at || now,
            change24h: data["classic-usd"].usd_24h_change,
        },
        wetc: {
            price: data["wrapped-etc-2"].usd,
            lastUpdated: data["wrapped-etc-2"].last_updated_at || now,
            change24h: data["wrapped-etc-2"].usd_24h_change,
        },
        lastUpdated: now,
    };
}

/**
 * Legacy function for backward compatibility.
 * Use fetchETCEcosystemPrices() for new code.
 *
 * @deprecated Use fetchETCEcosystemPrices() instead
 */
export async function fetchETCPrice(): Promise<PriceData> {
    const ecosystem = await fetchETCEcosystemPrices();
    return ecosystem.etc;
}
