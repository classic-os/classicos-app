import type { Address } from "viem";
import type { ETCPriceData } from "@/lib/portfolio/price-adapter";
import type { TokenInfo } from "@/lib/portfolio/token-registry";

/**
 * Known token addresses for price derivation
 */
const WETC_ADDRESS = "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a".toLowerCase();
const USC_ADDRESS = "0xDE093684c796204224BC081f937aa059D903c52a".toLowerCase();

/**
 * Calculate USD value for a token amount
 *
 * Uses the ETC ecosystem prices to derive USD values:
 * - ETC: Direct price from CoinGecko
 * - USC: Direct price from CoinGecko (should be ~$1.00)
 * - WETC: Direct price from CoinGecko (should track ETC with DEX arbitrage)
 * - Other tokens: Derived from DEX pairs if available
 *
 * @param tokenAmount - Token amount (raw, not formatted)
 * @param tokenDecimals - Token decimals
 * @param tokenAddress - Token contract address
 * @param prices - ETC ecosystem prices
 * @returns USD value or null if price unavailable
 */
export function calculateTokenUSDValue(
    tokenAmount: bigint,
    tokenDecimals: number,
    tokenAddress: Address,
    prices: ETCPriceData
): number | null {
    if (tokenAmount === BigInt(0)) {
        return 0;
    }

    // Convert token amount to decimal
    const amount = Number(tokenAmount) / Math.pow(10, tokenDecimals);

    // Determine which price to use based on token address
    const normalizedAddress = tokenAddress.toLowerCase();

    if (normalizedAddress === WETC_ADDRESS) {
        return amount * prices.wetc.price;
    }

    if (normalizedAddress === USC_ADDRESS) {
        return amount * prices.usc.price;
    }

    // For other tokens, we'd need DEX pair data to derive prices
    // This will be implemented in Phase 2 with DEX integration
    return null;
}

/**
 * Calculate USD value for native balance (ETC/METC)
 *
 * @param nativeBalance - Native balance in wei
 * @param prices - ETC ecosystem prices
 * @param isTestnet - Whether this is testnet (Mordor)
 * @returns USD value (uses mainnet prices for testnet display)
 */
export function calculateNativeUSDValue(
    nativeBalance: bigint,
    prices: ETCPriceData,
    isTestnet: boolean
): number {
    if (nativeBalance === BigInt(0)) {
        return 0;
    }

    // Convert wei to ETC
    const etcAmount = Number(nativeBalance) / Math.pow(10, 18);

    // Use mainnet ETC price even for testnet (for display purposes)
    return etcAmount * prices.etc.price;
}

/**
 * Calculate USD value for an LP position
 *
 * For LP positions, we calculate the value of the user's share of reserves:
 * - If one token has a known price, we can value that half
 * - If both tokens have known prices, we can value both halves
 *
 * @param token0Address - Token0 address
 * @param token0Decimals - Token0 decimals
 * @param token0Reserve - User's share of token0 reserves
 * @param token1Address - Token1 address
 * @param token1Decimals - Token1 decimals
 * @param token1Reserve - User's share of token1 reserves
 * @param prices - ETC ecosystem prices
 * @returns USD value or null if neither token has known price
 */
export function calculateLPPositionUSDValue(
    token0Address: Address,
    token0Decimals: number,
    token0Reserve: bigint,
    token1Address: Address,
    token1Decimals: number,
    token1Reserve: bigint,
    prices: ETCPriceData
): number | null {
    const token0Value = calculateTokenUSDValue(
        token0Reserve,
        token0Decimals,
        token0Address,
        prices
    );

    const token1Value = calculateTokenUSDValue(
        token1Reserve,
        token1Decimals,
        token1Address,
        prices
    );

    // If we have both values, return sum
    if (token0Value !== null && token1Value !== null) {
        return token0Value + token1Value;
    }

    // If we only have one value, double it (assuming balanced pool)
    if (token0Value !== null) {
        return token0Value * 2;
    }

    if (token1Value !== null) {
        return token1Value * 2;
    }

    // No known prices for either token
    return null;
}

/**
 * Calculate total USD value for an array of token balances
 *
 * @param tokenBalances - Array of token balances with address, amount, decimals
 * @param prices - ETC ecosystem prices
 * @returns Total USD value of all tokens
 */
export function calculateTokensUSDValue(
    tokenBalances: Array<{
        tokenAddress: Address;
        balance: bigint;
        decimals: number;
    }>,
    prices: ETCPriceData
): number {
    let total = 0;

    for (const token of tokenBalances) {
        const value = calculateTokenUSDValue(
            token.balance,
            token.decimals,
            token.tokenAddress,
            prices
        );

        if (value !== null) {
            total += value;
        }
    }

    return total;
}

/**
 * Calculate total USD value for an array of LP positions
 *
 * @param positions - Array of LP positions with reserve data
 * @param lpTotalSupplies - Map of LP token address to total supply
 * @param lpBalances - Map of LP token address to user balance
 * @param prices - ETC ecosystem prices
 * @returns Total USD value of all LP positions
 */
export function calculatePositionsUSDValue(
    positions: ReadonlyArray<{
        readonly lpTokenAddress: Address;
        readonly lpBalance: bigint;
        readonly lpTotalSupply: bigint;
        readonly token0: {
            readonly address: Address;
            readonly decimals: number;
            readonly reserve: bigint;
        };
        readonly token1: {
            readonly address: Address;
            readonly decimals: number;
            readonly reserve: bigint;
        };
    }>,
    prices: ETCPriceData
): number {
    let total = 0;

    for (const position of positions) {
        // Calculate user's share of reserves
        const shareRatio = Number(position.lpBalance) / Number(position.lpTotalSupply);
        const userReserve0 = BigInt(Math.floor(Number(position.token0.reserve) * shareRatio));
        const userReserve1 = BigInt(Math.floor(Number(position.token1.reserve) * shareRatio));

        const value = calculateLPPositionUSDValue(
            position.token0.address,
            position.token0.decimals,
            userReserve0,
            position.token1.address,
            position.token1.decimals,
            userReserve1,
            prices
        );

        if (value !== null) {
            total += value;
        }
    }

    return total;
}

/**
 * Format USD value with appropriate precision
 *
 * @param value - USD value
 * @returns Formatted string (e.g., "$1,234.56")
 */
export function formatUSDValue(value: number): string {
    if (value < 0.01) {
        return "<$0.01";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}
