import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePublicClient, useChainId, useConnections } from "wagmi";
import { getERC20Balances } from "@/lib/portfolio/adapters/erc20-balances";
import { getTokensForChain } from "@/lib/portfolio/token-registry";

/**
 * React Query hook to fetch ERC20 token balances for connected wallet.
 *
 * Uses individual RPC calls for each token (fallback from multicall due to compatibility).
 * Only returns tokens with non-zero balances.
 *
 * Automatically refetches every 5 minutes and considers data stale after 2.5 minutes.
 * Only runs when client and address are available.
 *
 * @returns React Query result with array of token balances, loading state, and error
 */
export function useTokenBalances() {
    const client = usePublicClient();
    const chainId = useChainId();
    const connections = useConnections();

    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    return useQuery({
        queryKey: ["portfolio", "erc20-balances", address, chainId],
        queryFn: async () => {
            if (!client || !address) {
                throw new Error("Client and address are required");
            }

            // Get token list for current chain
            const tokens = getTokensForChain(chainId);

            if (tokens.length === 0) {
                return [];
            }

            return await getERC20Balances(client, address, tokens);
        },
        enabled: Boolean(client && address),
        staleTime: 150_000, // 2.5 minutes
        refetchInterval: 300_000, // 5 minutes
        retry: 2, // Retry failed requests twice
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    });
}
