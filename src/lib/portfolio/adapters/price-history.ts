/**
 * Price History Adapter
 *
 * Fetches historical price data for sparkline charts.
 * Uses CoinGecko market_chart API for 7-day price history.
 *
 * Following three-layer pattern:
 * - Adapter (this file): Pure functions for API calls
 * - Hook: React Query integration with caching
 * - UI: Sparkline chart display
 */

export type PricePoint = {
    timestamp: number; // Unix timestamp in milliseconds
    price: number; // USD price
};

export type PriceHistory = {
    coinId: string; // CoinGecko coin ID (e.g., "ethereum-classic")
    prices: PricePoint[]; // Array of price points
    minPrice: number; // Minimum price in period
    maxPrice: number; // Maximum price in period
    firstPrice: number; // First price in period
    lastPrice: number; // Last price in period
    change: number; // Price change percentage
};

/**
 * Fetches 7-day price history for a coin from CoinGecko
 *
 * Uses the market_chart API endpoint with 7 days of data.
 * Returns price points suitable for sparkline chart display.
 *
 * @param coinId - CoinGecko coin ID (e.g., "ethereum-classic")
 * @returns Price history with sparkline data
 * @throws Error if fetch fails or response is invalid
 */
export async function fetchPriceHistory(coinId: string): Promise<PriceHistory> {
    // Use Next.js API route (we'll need to add this endpoint)
    const url = `/api/price-history?id=${coinId}&days=7`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch price history: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data || !data.prices || !Array.isArray(data.prices)) {
        throw new Error("Invalid price history response");
    }

    // Transform data into PricePoint array
    const prices: PricePoint[] = data.prices.map((point: [number, number]) => ({
        timestamp: point[0],
        price: point[1],
    }));

    if (prices.length === 0) {
        throw new Error("No price data available");
    }

    // Calculate min, max, and change
    const priceValues = prices.map((p) => p.price);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);
    const firstPrice = prices[0].price;
    const lastPrice = prices[prices.length - 1].price;
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;

    return {
        coinId,
        prices,
        minPrice,
        maxPrice,
        firstPrice,
        lastPrice,
        change,
    };
}
