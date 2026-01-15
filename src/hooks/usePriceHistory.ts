import { useQuery } from "@tanstack/react-query";
import { fetchPriceHistory, type PriceHistory } from "@/lib/portfolio/adapters/price-history";

/**
 * Hook to fetch 7-day price history for sparkline charts
 *
 * Three-layer pattern:
 * - Adapter: fetchPriceHistory (pure function)
 * - Hook: usePriceHistory (React integration with TanStack Query)
 * - UI: Sparkline chart component
 *
 * @param coinId - CoinGecko coin ID (e.g., "ethereum-classic")
 * @returns Query result with price history data
 */
export function usePriceHistory(coinId: string) {
    return useQuery<PriceHistory, Error>({
        queryKey: ["price-history", coinId],
        queryFn: () => fetchPriceHistory(coinId),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
        enabled: Boolean(coinId), // Only fetch if coinId provided
    });
}
