import { useQuery } from "@tanstack/react-query";
import { fetchETCPrice, type PriceData } from "@/lib/portfolio/price-adapter";

/**
 * Hook: Fetch ETC Price in USD
 *
 * Fetches current ETC price from CoinGecko API with React Query caching.
 *
 * Cache Strategy:
 * - staleTime: 60 seconds (price can be used for 1 minute without refetch)
 * - gcTime: 5 minutes (cache kept in memory for 5 minutes)
 * - refetchInterval: 60 seconds (auto-refresh every minute)
 *
 * This provides near-real-time price updates without overwhelming the API.
 *
 * @returns React Query result with price data, loading, and error states
 */
export function useETCPrice() {
    return useQuery<PriceData, Error>({
        queryKey: ["etc-price"],
        queryFn: fetchETCPrice,
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 60 * 1000, // Refresh every 1 minute
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    });
}
