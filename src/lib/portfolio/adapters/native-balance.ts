import type { Address } from "viem";

/**
 * Structural type for RPC client that can fetch native balance.
 * Uses structural typing to avoid coupling to concrete viem types.
 */
export type RpcClient = {
    getBalance: (args: { address: Address }) => Promise<bigint>;
};

/**
 * Fetches the native balance (ETC, ETH, etc.) for a given address.
 *
 * Pure function with no side effects. Throws on RPC errors.
 *
 * @param client - RPC client with getBalance method
 * @param address - Wallet address to query
 * @param chainId - Chain ID for context (not used in this adapter, but included for consistency)
 * @returns Native balance in wei (bigint)
 */
export async function getNativeBalance(
    client: RpcClient,
    address: Address,
    chainId: number
): Promise<bigint> {
    if (!client) {
        throw new Error("RPC client is required");
    }

    if (!address) {
        throw new Error("Address is required");
    }

    try {
        const balance = await client.getBalance({ address });
        return balance;
    } catch (error) {
        // Re-throw with additional context
        throw new Error(
            `Failed to fetch native balance for ${address} on chain ${chainId}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}
