/**
 * Uniswap V3 / ETCswap V3 Math Utilities
 *
 * Calculations for concentrated liquidity positions using Q64.96 fixed-point arithmetic.
 *
 * Uniswap V3 uses Q64.96 format for sqrt prices:
 * - sqrtPriceX96 = sqrt(price) * 2^96
 * - This provides high precision for on-chain calculations
 *
 * References:
 * - Uniswap V3 Core: https://github.com/Uniswap/v3-core
 * - Uniswap V3 SDK: https://github.com/Uniswap/v3-sdk
 */

/**
 * Q64.96 constants
 */
const Q96 = BigInt(2) ** BigInt(96);

/**
 * Calculate price from tick
 *
 * In Uniswap V3, price = 1.0001^tick
 * This gives the price of token1 in terms of token0
 *
 * @param tick - Tick value
 * @returns Price as a number
 */
export function tickToPrice(tick: number): number {
    return Math.pow(1.0001, tick);
}

/**
 * Calculate sqrt price (as floating point) from tick
 *
 * sqrtPrice = sqrt(1.0001^tick) = 1.0001^(tick/2)
 *
 * @param tick - Tick value
 * @returns Square root of price
 */
export function tickToSqrtPrice(tick: number): number {
    return Math.pow(1.0001, tick / 2);
}

/**
 * Calculate sqrtPriceX96 (Q64.96 format) from tick
 *
 * This matches the on-chain representation used in Uniswap V3 pools.
 *
 * @param tick - Tick value
 * @returns sqrtPriceX96 as bigint (Q64.96 fixed-point)
 */
export function tickToSqrtPriceX96(tick: number): bigint {
    const sqrtPrice = tickToSqrtPrice(tick);
    // Convert to Q64.96: multiply by 2^96
    return BigInt(Math.floor(sqrtPrice * Number(Q96)));
}

/**
 * Estimate token amounts in a V3 position using Q64.96 fixed-point arithmetic
 *
 * Uses the same formulas as Uniswap V3 SDK:
 * - Position below range (all token1): amount1 = L * (sqrtB - sqrtA) / Q96
 * - Position above range (all token0): amount0 = L * (1/sqrtA - 1/sqrtB)
 * - Position in range (both tokens):
 *   - amount0 = L * (1/sqrtP - 1/sqrtB)
 *   - amount1 = L * (sqrtP - sqrtA) / Q96
 *
 * Where:
 * - L = liquidity
 * - sqrtA = sqrtPriceX96 at tickLower
 * - sqrtB = sqrtPriceX96 at tickUpper
 * - sqrtP = sqrtPriceX96 at currentTick
 *
 * @param liquidity - Liquidity amount (as bigint or string)
 * @param tickCurrent - Current pool tick
 * @param tickLower - Position lower tick
 * @param tickUpper - Position upper tick
 * @param decimals0 - Token0 decimals
 * @param decimals1 - Token1 decimals
 * @returns Object with amount0 and amount1 as numbers
 */
export function getTokenAmountsFromLiquidity(
    liquidity: bigint | string,
    tickCurrent: number,
    tickLower: number,
    tickUpper: number,
    decimals0: number,
    decimals1: number
): { amount0: number; amount1: number } {
    // Convert liquidity to bigint for precise calculations
    const liquidityBigInt = typeof liquidity === "bigint" ? liquidity : BigInt(liquidity);

    if (liquidityBigInt === BigInt(0)) {
        return { amount0: 0, amount1: 0 };
    }

    // Guard for placeholder currentTick = 0
    if (tickCurrent === 0 && (tickLower > 1000 || tickUpper < -1000)) {
        console.warn("[V3 Math] currentTick is 0 but position range is far from 0 (likely placeholder), skipping calculation");
        return { amount0: 0, amount1: 0 };
    }

    // Calculate sqrtPriceX96 for all three ticks using Q64.96 format
    const sqrtPriceCurrentX96 = tickToSqrtPriceX96(tickCurrent);
    const sqrtPriceLowerX96 = tickToSqrtPriceX96(tickLower);
    const sqrtPriceUpperX96 = tickToSqrtPriceX96(tickUpper);

    let amount0BigInt = BigInt(0);
    let amount1BigInt = BigInt(0);

    // Position is entirely in token1 (current price below range)
    if (tickCurrent < tickLower) {
        // amount1 = L * (sqrtB - sqrtA) / Q96
        amount1BigInt = (liquidityBigInt * (sqrtPriceUpperX96 - sqrtPriceLowerX96)) / Q96;
        amount0BigInt = BigInt(0);
    }
    // Position is entirely in token0 (current price above range)
    else if (tickCurrent >= tickUpper) {
        // amount0 = L * (1/sqrtA - 1/sqrtB)
        // Rearranged: amount0 = L * (sqrtB - sqrtA) / (sqrtA * sqrtB)
        // In Q96: amount0 = L * Q96 * (sqrtB - sqrtA) / (sqrtA * sqrtB)
        const numerator = liquidityBigInt * Q96 * (sqrtPriceUpperX96 - sqrtPriceLowerX96);
        const denominator = sqrtPriceLowerX96 * sqrtPriceUpperX96;
        amount0BigInt = numerator / denominator;
        amount1BigInt = BigInt(0);
    }
    // Position is in range (has both tokens)
    else {
        // amount0 = L * (1/sqrtP - 1/sqrtB)
        // Rearranged: amount0 = L * (sqrtB - sqrtP) / (sqrtP * sqrtB)
        // In Q96: amount0 = L * Q96 * (sqrtB - sqrtP) / (sqrtP * sqrtB)
        const numerator0 = liquidityBigInt * Q96 * (sqrtPriceUpperX96 - sqrtPriceCurrentX96);
        const denominator0 = sqrtPriceCurrentX96 * sqrtPriceUpperX96;
        amount0BigInt = numerator0 / denominator0;

        // amount1 = L * (sqrtP - sqrtA) / Q96
        amount1BigInt = (liquidityBigInt * (sqrtPriceCurrentX96 - sqrtPriceLowerX96)) / Q96;
    }

    // Convert bigint amounts to decimal numbers adjusted for token decimals
    const amount0 = Number(amount0BigInt) / Math.pow(10, decimals0);
    const amount1 = Number(amount1BigInt) / Math.pow(10, decimals1);

    console.log(
        `[V3 Math] Q64.96 calculation - amounts: ${amount0.toFixed(6)} token0, ${amount1.toFixed(6)} token1 ` +
        `(liquidity: ${liquidityBigInt.toString()}, tick: ${tickCurrent}, range: ${tickLower} to ${tickUpper})`
    );

    return {
        amount0,
        amount1,
    };
}

/**
 * Calculate USD value of a V3 position
 *
 * @param amount0 - Token0 amount
 * @param amount1 - Token1 amount
 * @param price0USD - Token0 price in USD
 * @param price1USD - Token1 price in USD
 * @returns Total USD value
 */
export function calculateV3PositionValue(
    amount0: number,
    amount1: number,
    price0USD: number | null,
    price1USD: number | null
): number | null {
    if (price0USD === null || price1USD === null) {
        return null;
    }

    return amount0 * price0USD + amount1 * price1USD;
}
