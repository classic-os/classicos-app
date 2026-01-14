import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { useChainId, useAccount } from "wagmi";
import { getNativeBalance } from "@/lib/portfolio/adapters/native-balance";

/**
 * React Query hook to fetch native balance for connected wallet.
 *
 * Automatically refetches every 60 seconds and considers data stale after 30 seconds.
 * Only runs when client and address are available.
 *
 * @returns React Query result with balance (bigint), loading state, and error
 */
export function useNativeBalance() {
    const client = usePublicClient();
    const chainId = useChainId();
    const { address } = useAccount();

    return useQuery({
        queryKey: ["portfolio", "native-balance", address, chainId],
        queryFn: async () => {
            if (!client || !address) {
                throw new Error("Client and address are required");
            }

            return await getNativeBalance(client, address, chainId);
        },
        enabled: Boolean(client && address),
        staleTime: 30_000, // 30 seconds
        refetchInterval: 60_000, // 1 minute
        retry: 2, // Retry failed requests twice
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    });
}
