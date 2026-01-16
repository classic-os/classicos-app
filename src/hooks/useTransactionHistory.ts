import { useQuery } from "@tanstack/react-query";
import { usePublicClient, useChainId } from "wagmi";
import { useMemo } from "react";
import { useConnections } from "wagmi";
import {
    getTransactionHistory,
    type ActivityTransaction,
} from "@/lib/portfolio/adapters/transaction-history";

/**
 * Hook to fetch transaction history for the connected wallet.
 *
 * Three-layer pattern:
 * - Adapter: getTransactionHistory (pure function)
 * - Hook: useTransactionHistory (React integration with wagmi/tanstack)
 * - UI: ActivityPanel (display component)
 *
 * @param blockCount - Number of recent blocks to scan (default: 50)
 * @returns Query result with transaction history
 */
export function useTransactionHistory(blockCount = 50) {
    const publicClient = usePublicClient();
    const chainId = useChainId();
    const connections = useConnections();

    // Extract address from wagmi connections
    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    return useQuery<ActivityTransaction[], Error>({
        queryKey: ["transaction-history", chainId, address, blockCount],
        queryFn: async () => {
            if (!publicClient) {
                throw new Error("Public client not available");
            }
            if (!address) {
                throw new Error("No wallet connected");
            }

            return getTransactionHistory(
                publicClient,
                address as `0x${string}`,
                chainId,
                blockCount
            );
        },
        enabled: Boolean(publicClient && address),
        staleTime: 30 * 1000, // 30 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 60 * 1000, // Refresh every minute
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    });
}
