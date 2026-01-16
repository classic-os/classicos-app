"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchExchangeRates, type ExchangeRates } from "./exchange-rates";

/**
 * Hook for fetching and caching exchange rates
 *
 * Uses TanStack Query for:
 * - Automatic caching (1 hour stale time)
 * - Background refetching
 * - Cross-component data sharing
 *
 * @returns Query result with exchange rates
 */
export function useExchangeRates() {
    return useQuery<ExchangeRates>({
        queryKey: ["exchange-rates"],
        queryFn: fetchExchangeRates,
        staleTime: 60 * 60 * 1000, // 1 hour (rates update daily, but check hourly)
        gcTime: 24 * 60 * 60 * 1000, // 24 hours cache
        refetchOnWindowFocus: false, // Don't refetch on every tab focus
        refetchOnMount: false, // Don't refetch if data is fresh
    });
}
