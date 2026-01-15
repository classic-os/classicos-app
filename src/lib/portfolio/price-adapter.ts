/**
 * Price Adapter
 *
 * Fetches cryptocurrency prices from public APIs.
 * Uses CoinGecko free API (no auth required) for ETC price data.
 *
 * Following three-layer pattern:
 * - Adapter (this file): Pure functions for RPC/API calls
 * - Hook: React Query integration with caching
 * - UI: Display formatted price data
 */

export type PriceData = {
    price: number; // USD price
    lastUpdated: number; // Unix timestamp
};

/**
 * Fetches ETC price in USD from CoinGecko public API
 *
 * @returns Price data with current USD price and timestamp
 * @throws Error if fetch fails or response is invalid
 */
export async function fetchETCPrice(): Promise<PriceData> {
    const url =
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum-classic&vs_currencies=usd&include_last_updated_at=true";

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ETC price: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (
        !data ||
        !data["ethereum-classic"] ||
        typeof data["ethereum-classic"].usd !== "number"
    ) {
        throw new Error("Invalid price data response from CoinGecko");
    }

    return {
        price: data["ethereum-classic"].usd,
        lastUpdated: data["ethereum-classic"].last_updated_at || Date.now() / 1000,
    };
}
