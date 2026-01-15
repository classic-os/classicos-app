import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePublicClient, useChainId, useConnections } from "wagmi";
import { getETCswapV3Positions } from "@/lib/portfolio/adapters/etcswap-v3-positions";

/**
 * React Query hook to fetch ETCswap V3 concentrated liquidity positions for connected wallet.
 *
 * Discovers positions by:
 * 1. Querying NonfungiblePositionManager to enumerate NFT positions
 * 2. Fetching position data (liquidity, tick range, fee tier, tokens)
 * 3. Filtering out closed positions (zero liquidity)
 *
 * V3 positions are NFT-based and represent concentrated liquidity in a specific price range.
 * Each position has a tick range [tickLower, tickUpper] and only earns fees when the pool
 * price is within that range.
 *
 * Automatically refetches every 10 minutes (positions change less frequently than balances).
 * Only runs when client and address are available.
 *
 * @returns React Query result with array of ETCswap V3 positions, loading state, and error
 */
export function useETCswapV3Positions() {
    const client = usePublicClient();
    const chainId = useChainId();
    const connections = useConnections();

    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    return useQuery({
        queryKey: ["portfolio", "etcswap-v3-positions", address, chainId],
        queryFn: async () => {
            if (!client || !address) {
                throw new Error("Client and address are required");
            }

            return await getETCswapV3Positions(client, address, chainId);
        },
        enabled: Boolean(client && address),
        staleTime: 300_000, // 5 minutes (positions change less frequently)
        refetchInterval: 600_000, // 10 minutes
        retry: 2, // Retry failed requests twice
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    });
}
