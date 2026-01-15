import type { Address, Abi } from "viem";
import type { TokenInfo } from "@/lib/portfolio/token-registry";

/**
 * ERC20 Token Balance Result
 */
export type TokenBalance = {
    readonly token: TokenInfo;
    readonly balance: bigint;
};

/**
 * Structural type for RPC client with readContract support
 */
export type RpcClient = {
    readContract: (args: {
        address: Address;
        abi: Abi;
        functionName: string;
        args?: readonly unknown[];
    }) => Promise<unknown>;
};

/**
 * Minimal ERC20 ABI for balanceOf function
 */
const ERC20_BALANCE_ABI = [
    {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [{ name: "_owner", type: "address" }],
        outputs: [{ name: "balance", type: "uint256" }],
    },
] as const satisfies Abi;

/**
 * Fetch ERC20 token balances using individual RPC calls.
 *
 * Uses structural typing to avoid coupling to viem's PublicClient.
 * Fetches token balances with individual readContract calls for maximum compatibility.
 *
 * Note: Falls back from multicall due to multicall3 compatibility issues on some chains.
 *
 * @param client - RPC client with readContract support
 * @param address - Wallet address to check balances for
 * @param tokens - List of tokens to fetch balances for
 * @returns Array of token balances (only non-zero balances)
 */
export async function getERC20Balances(
    client: RpcClient,
    address: Address,
    tokens: readonly TokenInfo[]
): Promise<readonly TokenBalance[]> {
    if (!client) {
        throw new Error("RPC client is required");
    }

    if (!address) {
        throw new Error("Address is required");
    }

    if (!tokens || tokens.length === 0) {
        return [];
    }

    try {
        console.log("[ERC20 Balances] Fetching balances for:", {
            walletAddress: address,
            tokenCount: tokens.length,
            tokens: tokens.map((t) => `${t.symbol} (${t.address})`),
        });

        // Fetch balances individually (fallback from multicall due to compatibility)
        const balancePromises = tokens.map(async (token) => {
            try {
                const balance = await client.readContract({
                    address: token.address,
                    abi: ERC20_BALANCE_ABI,
                    functionName: "balanceOf",
                    args: [address],
                });

                return {
                    token,
                    balance: balance as bigint,
                    success: true,
                };
            } catch (error) {
                console.warn(`[ERC20 Balances] Failed to get balance for ${token.symbol}:`, error);
                return {
                    token,
                    balance: BigInt(0),
                    success: false,
                };
            }
        });

        const results = await Promise.all(balancePromises);

        console.log("[ERC20 Balances] Results:", {
            results: results.map((r) => ({
                token: r.token.symbol,
                success: r.success,
                balance: r.balance.toString(),
            })),
        });

        // Filter non-zero balances
        const balances: TokenBalance[] = [];

        for (const result of results) {
            if (result.success && result.balance > BigInt(0)) {
                console.log(`[ERC20 Balances] ${result.token.symbol}: ${result.balance.toString()}`);
                balances.push({
                    token: result.token,
                    balance: result.balance,
                });
            }
        }

        console.log("[ERC20 Balances] Non-zero balances found:", balances.length);

        return balances;
    } catch (error) {
        throw new Error(
            `Failed to fetch ERC20 balances for ${address}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}
