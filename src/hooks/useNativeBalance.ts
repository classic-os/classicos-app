import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePublicClient, useChainId, useConnections } from "wagmi";
import { getNativeBalance } from "@/lib/portfolio/adapters/native-balance";

/**
 * React Query hook to fetch native balance for connected wallet.
 *
 * Automatically refetches every 5 minutes and considers data stale after 2.5 minutes.
 * Only runs when client and address are available.
 *
 * @returns React Query result with balance (bigint), loading state, and error
 */
export function useNativeBalance() {
    const client = usePublicClient();
    const chainId = useChainId();
    const connections = useConnections();

    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    return useQuery({
        queryKey: ["portfolio", "native-balance", address, chainId],
        queryFn: async () => {
            if (!client || !address) {
                throw new Error("Client and address are required");
            }

            return await getNativeBalance(client, address, chainId);
        },
        enabled: Boolean(client && address),
        staleTime: 150_000, // 2.5 minutes
        refetchInterval: 300_000, // 5 minutes
        retry: 2, // Retry failed requests twice
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    });
}
