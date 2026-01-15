import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePublicClient, useChainId, useConnections } from "wagmi";
import { getETCswapV2Positions } from "@/lib/portfolio/adapters/etcswap-v2-positions";

/**
 * React Query hook to fetch ETCswap V2 LP positions for connected wallet.
 *
 * Discovers positions by checking all possible token pairs from the registry.
 * Only returns positions with non-zero LP token balances.
 *
 * Automatically refetches every 10 minutes (positions change less frequently than balances).
 * Only runs when client and address are available.
 *
 * @returns React Query result with array of ETCswap V2 positions, loading state, and error
 */
export function useETCswapV2Positions() {
    const client = usePublicClient();
    const chainId = useChainId();
    const connections = useConnections();

    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    return useQuery({
        queryKey: ["portfolio", "etcswap-v2-positions", address, chainId],
        queryFn: async () => {
            if (!client || !address) {
                throw new Error("Client and address are required");
            }

            return await getETCswapV2Positions(client, address, chainId);
        },
        enabled: Boolean(client && address),
        staleTime: 300_000, // 5 minutes (positions change less frequently)
        refetchInterval: 600_000, // 10 minutes
        retry: 2, // Retry failed requests twice
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    });
}
