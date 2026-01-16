import { useQuery } from "@tanstack/react-query";
import { fetchETCEcosystemPrices, type ETCPriceData } from "@/lib/portfolio/price-adapter";

/**
 * Hook to fetch all ETC ecosystem prices (ETC, USC, WETC)
 *
 * Three-layer pattern:
 * - Adapter: fetchETCEcosystemPrices (pure function)
 * - Hook: useETCEcosystemPrices (React integration with TanStack Query)
 * - UI: Portfolio components (display with derived prices)
 *
 * @returns Query result with ETC, USC, and WETC prices
 */
export function useETCEcosystemPrices() {
    return useQuery<ETCPriceData, Error>({
        queryKey: ["etc-ecosystem-prices"],
        queryFn: fetchETCEcosystemPrices,
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 60 * 1000, // Refresh every 1 minute
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    });
}
