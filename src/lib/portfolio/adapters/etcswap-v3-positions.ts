import type { Address, Abi } from "viem";
import { NONFUNGIBLE_POSITION_MANAGER_ABI } from "@/lib/portfolio/abis/nonfungible-position-manager";
import { getETCswapV3Contracts } from "@/lib/protocols/etcswap-contracts";
import { getTokenInfo } from "@/lib/portfolio/token-registry";

// Minimal Uniswap V3 Pool ABI for slot0() query
const POOL_SLOT0_ABI = [
    {
        inputs: [],
        name: "slot0",
        outputs: [
            { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
            { internalType: "int24", name: "tick", type: "int24" },
            { internalType: "uint16", name: "observationIndex", type: "uint16" },
            { internalType: "uint16", name: "observationCardinality", type: "uint16" },
            { internalType: "uint16", name: "observationCardinalityNext", type: "uint16" },
            { internalType: "uint8", name: "feeProtocol", type: "uint8" },
            { internalType: "bool", name: "unlocked", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;

/**
 * ETCswap V3 Concentrated Liquidity Position
 *
 * V3 positions are NFTs (ERC721) with concentrated liquidity in a specific price range.
 * Unlike V2's fungible LP tokens, V3 positions track liquidity deployed between two ticks.
 */
export type ETCswapV3Position = {
    readonly protocol: "etcswap-v3";
    readonly tokenId: bigint; // NFT token ID
    readonly poolAddress: Address; // Pool contract address
    readonly token0: {
        readonly address: Address;
        readonly symbol: string;
        readonly decimals: number;
    };
    readonly token1: {
        readonly address: Address;
        readonly symbol: string;
        readonly decimals: number;
    };
    readonly feeTier: number; // Fee in basis points (100 = 0.01%, 500 = 0.05%, 3000 = 0.3%, 10000 = 1%)
    readonly tickLower: number; // Lower tick of the range
    readonly tickUpper: number; // Upper tick of the range
    readonly liquidity: bigint; // Liquidity amount
    readonly tokensOwed0: bigint; // Uncollected fees for token0
    readonly tokensOwed1: bigint; // Uncollected fees for token1
    readonly currentTick: number; // Current pool tick (determines if position is in range)
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
 * Get pool address from factory
 *
 * Uses the factory's getPool(token0, token1, fee) function to get the pool address.
 *
 * @param client - RPC client
 * @param factory - Factory contract address
 * @param token0 - Token0 address
 * @param token1 - Token1 address
 * @param fee - Fee tier
 * @returns Pool address or null if pool doesn't exist
 */
async function getPoolAddress(
    client: RpcClient,
    factory: Address,
    token0: Address,
    token1: Address,
    fee: number
): Promise<Address | null> {
    try {
        const poolAddress = await client.readContract({
            address: factory,
            abi: [
                {
                    inputs: [
                        { internalType: "address", name: "tokenA", type: "address" },
                        { internalType: "address", name: "tokenB", type: "address" },
                        { internalType: "uint24", name: "fee", type: "uint24" },
                    ],
                    name: "getPool",
                    outputs: [{ internalType: "address", name: "pool", type: "address" }],
                    stateMutability: "view",
                    type: "function",
                },
            ],
            functionName: "getPool",
            args: [token0, token1, fee],
        });

        return poolAddress as Address;
    } catch (error) {
        console.warn(`[V3 Positions] Failed to get pool address for ${token0}/${token1} fee ${fee}:`, error);
        return null;
    }
}

/**
 * Get V3 positions for a wallet address
 *
 * Discovery strategy:
 * 1. Query NonfungiblePositionManager.balanceOf(wallet) to get position count
 * 2. Scan token IDs (1-100) and check ownership via ownerOf()
 *    - NonfungiblePositionManager doesn't implement ERC721Enumerable
 *    - Scanning is acceptable for testnet and early mainnet usage
 *    - Production TODO: Use Transfer event logs for efficient discovery
 * 3. For each owned tokenId, query positions(tokenId) to get position data
 * 4. Filter out positions with zero liquidity (closed positions)
 *
 * @param client - RPC client with readContract support
 * @param walletAddress - User's wallet address
 * @param chainId - Chain ID (61 = ETC mainnet, 63 = Mordor testnet)
 * @returns Array of V3 positions
 */
export async function getETCswapV3Positions(
    client: RpcClient,
    walletAddress: Address,
    chainId: number
): Promise<readonly ETCswapV3Position[]> {
    const contracts = getETCswapV3Contracts(chainId);
    if (!contracts) {
        return [];
    }

    const positionManager = contracts.positionManager;

    try {
        // Step 1: Get position count to know how many to scan for
        const balanceResult = await client.readContract({
            address: positionManager,
            abi: NONFUNGIBLE_POSITION_MANAGER_ABI,
            functionName: "balanceOf",
            args: [walletAddress],
        });

        const balance = balanceResult as bigint;
        const positionCount = Number(balance);

        console.log(`[V3 Positions] Chain ${chainId}, wallet ${walletAddress}: ${positionCount} positions found via balanceOf`);

        if (positionCount === 0) {
            return [];
        }

        // Step 2: NonfungiblePositionManager doesn't implement ERC721Enumerable
        // We need to scan token IDs and check ownership
        // Strategy: Scan a reasonable range (0-200) and check ownership
        // This is acceptable for testnet and early mainnet usage
        // TODO: Implement event-based discovery for production (scan Transfer events)
        const MAX_SCAN_RANGE = 200;
        const ownershipPromises: Promise<{ tokenId: bigint; owner: Address | null }>[] = [];

        for (let tokenId = 0; tokenId <= MAX_SCAN_RANGE; tokenId++) {
            ownershipPromises.push(
                client.readContract({
                    address: positionManager,
                    abi: [
                        {
                            inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
                            name: "ownerOf",
                            outputs: [{ internalType: "address", name: "", type: "address" }],
                            stateMutability: "view",
                            type: "function",
                        },
                    ],
                    functionName: "ownerOf",
                    args: [BigInt(tokenId)],
                })
                .then((owner) => ({ tokenId: BigInt(tokenId), owner: owner as Address }))
                .catch(() => ({ tokenId: BigInt(tokenId), owner: null })) // Token doesn't exist or error
            );
        }

        const ownershipResults = await Promise.all(ownershipPromises);
        const tokenIds = ownershipResults
            .filter((result) => result.owner?.toLowerCase() === walletAddress.toLowerCase())
            .map((result) => result.tokenId);

        console.log(`[V3 Positions] Found ${tokenIds.length} owned token IDs after scanning:`, tokenIds.map(id => id.toString()));

        // Step 3: Fetch position data for each token ID
        const positionPromises = tokenIds.map((tokenId) =>
            client.readContract({
                address: positionManager,
                abi: NONFUNGIBLE_POSITION_MANAGER_ABI,
                functionName: "positions",
                args: [tokenId],
            })
        );

        const positionsData = await Promise.all(positionPromises);

        // Step 4: Process position data
        const positions: ETCswapV3Position[] = [];

        for (let i = 0; i < tokenIds.length; i++) {
            const tokenId = tokenIds[i];
            const positionData = positionsData[i] as [
                bigint, // nonce
                Address, // operator
                Address, // token0
                Address, // token1
                number, // fee
                number, // tickLower
                number, // tickUpper
                bigint, // liquidity
                bigint, // feeGrowthInside0LastX128
                bigint, // feeGrowthInside1LastX128
                bigint, // tokensOwed0
                bigint // tokensOwed1
            ];

            const [
                _nonce,
                _operator,
                token0Address,
                token1Address,
                fee,
                tickLower,
                tickUpper,
                liquidity,
                _feeGrowthInside0LastX128,
                _feeGrowthInside1LastX128,
                tokensOwed0,
                tokensOwed1,
            ] = positionData;

            // Skip positions with zero liquidity (closed positions)
            if (liquidity === BigInt(0)) {
                console.log(`[V3 Positions] Skipping token ${tokenId} (zero liquidity)`);
                continue;
            }

            console.log(`[V3 Positions] Processing token ${tokenId}:`, {
                token0: token0Address,
                token1: token1Address,
                fee,
                liquidity: liquidity.toString()
            });

            // Get token metadata
            const token0Info = getTokenInfo(token0Address as Address, chainId);
            const token1Info = getTokenInfo(token1Address as Address, chainId);

            if (!token0Info || !token1Info) {
                console.warn(
                    `Unknown tokens in V3 position ${tokenId}: ${token0Address}, ${token1Address}`
                );
                continue;
            }

            // Get pool address from factory
            const poolAddress = await getPoolAddress(
                client,
                contracts.factory,
                token0Address as Address,
                token1Address as Address,
                fee
            );

            if (!poolAddress || poolAddress === "0x0000000000000000000000000000000000000000") {
                console.warn(`[V3 Positions] Pool not found for position ${tokenId}`);
                continue;
            }

            // Query pool's current tick from slot0()
            let currentTick = 0;
            try {
                const slot0Result = await client.readContract({
                    address: poolAddress,
                    abi: POOL_SLOT0_ABI,
                    functionName: "slot0",
                });

                const slot0 = slot0Result as [bigint, number, number, number, number, number, boolean];
                currentTick = slot0[1]; // tick is the second element
                console.log(`[V3 Positions] Pool ${poolAddress} current tick: ${currentTick}`);
            } catch (error) {
                console.warn(`[V3 Positions] Failed to query slot0() for pool ${poolAddress}:`, error);
                // Continue with currentTick = 0, which will be caught by the math function
            }

            positions.push({
                protocol: "etcswap-v3",
                tokenId,
                poolAddress,
                token0: {
                    address: token0Address,
                    symbol: token0Info.symbol,
                    decimals: token0Info.decimals,
                },
                token1: {
                    address: token1Address,
                    symbol: token1Info.symbol,
                    decimals: token1Info.decimals,
                },
                feeTier: fee,
                tickLower,
                tickUpper,
                liquidity,
                tokensOwed0,
                tokensOwed1,
                currentTick,
            });
        }

        console.log(`[V3 Positions] Returning ${positions.length} valid positions`);
        return positions;
    } catch (error) {
        console.error("[V3 Positions] Error fetching ETCswap V3 positions:", error);
        return [];
    }
}
