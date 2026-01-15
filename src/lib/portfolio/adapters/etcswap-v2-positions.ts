import type { Address, Abi } from "viem";
import { UNISWAP_V2_PAIR_ABI } from "@/lib/portfolio/abis/uniswap-v2-pair";
import { getETCswapV2Contracts } from "@/lib/protocols/etcswap-contracts";
import { getTokensForChain, type TokenInfo } from "@/lib/portfolio/token-registry";

/**
 * ETCswap V2 LP Position
 */
export type ETCswapV2Position = {
    readonly protocol: "etcswap-v2";
    readonly lpTokenAddress: Address;
    readonly lpBalance: bigint;
    readonly lpTotalSupply: bigint;
    readonly token0: {
        readonly address: Address;
        readonly symbol: string;
        readonly decimals: number;
        readonly reserve: bigint;
    };
    readonly token1: {
        readonly address: Address;
        readonly symbol: string;
        readonly decimals: number;
        readonly reserve: bigint;
    };
    readonly poolShare: number; // percentage (0-100)
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
 * Token pair for pool discovery
 */
type TokenPair = {
    token0: TokenInfo;
    token1: TokenInfo;
};

/**
 * Generate all possible token pairs from token list.
 * Returns pairs where token0 < token1 (Uniswap V2 convention).
 */
function generateTokenPairs(tokens: readonly TokenInfo[]): TokenPair[] {
    const pairs: TokenPair[] = [];

    for (let i = 0; i < tokens.length; i++) {
        for (let j = i + 1; j < tokens.length; j++) {
            const tokenA = tokens[i];
            const tokenB = tokens[j];

            // Sort tokens (Uniswap V2 uses sorted addresses)
            const [token0, token1] =
                tokenA.address.toLowerCase() < tokenB.address.toLowerCase()
                    ? [tokenA, tokenB]
                    : [tokenB, tokenA];

            pairs.push({ token0, token1 });
        }
    }

    return pairs;
}

/**
 * Compute Uniswap V2 pair address deterministically.
 *
 * Note: This requires the factory address and init code hash.
 * For simplicity, we'll fetch pairs by checking if they exist via RPC.
 */
async function getPairAddress(
    client: RpcClient,
    factoryAddress: Address,
    tokenA: Address,
    tokenB: Address
): Promise<Address | null> {
    try {
        // Uniswap V2 Factory getPair function
        const pairAddress = (await client.readContract({
            address: factoryAddress,
            abi: [
                {
                    type: "function",
                    name: "getPair",
                    stateMutability: "view",
                    inputs: [
                        { name: "tokenA", type: "address" },
                        { name: "tokenB", type: "address" },
                    ],
                    outputs: [{ name: "pair", type: "address" }],
                },
            ] as const,
            functionName: "getPair",
            args: [tokenA, tokenB],
        })) as Address;

        // Check if pair exists (0x0 means no pair)
        if (pairAddress === "0x0000000000000000000000000000000000000000") {
            return null;
        }

        return pairAddress;
    } catch {
        return null;
    }
}

/**
 * Fetch LP position metadata for a specific pair.
 */
async function getPositionMetadata(
    client: RpcClient,
    lpTokenAddress: Address,
    walletAddress: Address,
    token0Info: TokenInfo,
    token1Info: TokenInfo
): Promise<ETCswapV2Position | null> {
    try {
        // Fetch all data in parallel
        const [lpBalance, totalSupply, reserves] = await Promise.all([
            client.readContract({
                address: lpTokenAddress,
                abi: UNISWAP_V2_PAIR_ABI,
                functionName: "balanceOf",
                args: [walletAddress],
            }) as Promise<bigint>,
            client.readContract({
                address: lpTokenAddress,
                abi: UNISWAP_V2_PAIR_ABI,
                functionName: "totalSupply",
            }) as Promise<bigint>,
            client.readContract({
                address: lpTokenAddress,
                abi: UNISWAP_V2_PAIR_ABI,
                functionName: "getReserves",
            }) as Promise<readonly [bigint, bigint, number]>,
        ]);

        // Skip if no balance
        if (lpBalance === BigInt(0)) {
            return null;
        }

        const [reserve0, reserve1] = reserves;

        // Calculate pool share percentage
        const poolShare =
            totalSupply > BigInt(0)
                ? (Number(lpBalance) / Number(totalSupply)) * 100
                : 0;

        return {
            protocol: "etcswap-v2",
            lpTokenAddress,
            lpBalance,
            lpTotalSupply: totalSupply,
            token0: {
                address: token0Info.address,
                symbol: token0Info.symbol,
                decimals: token0Info.decimals,
                reserve: reserve0,
            },
            token1: {
                address: token1Info.address,
                symbol: token1Info.symbol,
                decimals: token1Info.decimals,
                reserve: reserve1,
            },
            poolShare,
        };
    } catch (error) {
        console.warn(
            `[ETCswap V2] Failed to fetch position for ${lpTokenAddress}:`,
            error
        );
        return null;
    }
}

/**
 * Fetch all ETCswap V2 LP positions for a wallet.
 *
 * Strategy: Generate all possible token pairs from registry,
 * check if pools exist, then check for non-zero LP balances.
 *
 * @param client - RPC client with readContract support
 * @param walletAddress - Wallet address to check positions for
 * @param chainId - Chain ID (61 for mainnet, 63 for Mordor)
 * @returns Array of LP positions (only non-zero balances)
 */
export async function getETCswapV2Positions(
    client: RpcClient,
    walletAddress: Address,
    chainId: number
): Promise<readonly ETCswapV2Position[]> {
    // Get ETCswap V2 contracts for this chain
    const contracts = getETCswapV2Contracts(chainId);
    if (!contracts) {
        return [];
    }

    // Get token list for this chain
    const tokens = getTokensForChain(chainId);
    if (tokens.length === 0) {
        return [];
    }

    // Generate all possible token pairs
    const pairs = generateTokenPairs(tokens);

    console.log(`[ETCswap V2] Checking ${pairs.length} potential pools on chain ${chainId}`);

    // Check each pair for pool existence and user balance
    const positionPromises = pairs.map(async ({ token0, token1 }) => {
        // Get pair address from factory
        const pairAddress = await getPairAddress(
            client,
            contracts.factory,
            token0.address,
            token1.address
        );

        if (!pairAddress) {
            return null;
        }

        // Fetch position metadata (returns null if no balance)
        return await getPositionMetadata(
            client,
            pairAddress,
            walletAddress,
            token0,
            token1
        );
    });

    const results = await Promise.all(positionPromises);

    // Filter out nulls and return positions
    const positions = results.filter((pos): pos is ETCswapV2Position => pos !== null);

    console.log(`[ETCswap V2] Found ${positions.length} positions with balances`);

    return positions;
}
