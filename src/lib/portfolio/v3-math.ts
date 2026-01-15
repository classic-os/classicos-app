/**
 * Uniswap V3 / ETCswap V3 Math Utilities
 *
 * Calculations for concentrated liquidity positions:
 * - Token amounts from liquidity and tick range
 * - Price from ticks
 * - Position value estimation
 */

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
 * Calculate sqrt price from tick
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
 * Estimate token amounts in a V3 position
 *
 * Simplified calculation assuming position is in range.
 * For out-of-range positions, all liquidity is in one token.
 *
 * Formula (in range):
 * amount0 = liquidity * (sqrt(price_upper) - sqrt(price_current)) / (sqrt(price_current) * sqrt(price_upper))
 * amount1 = liquidity * (sqrt(price_current) - sqrt(price_lower))
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
    const liquidityNum = typeof liquidity === "string" ? Number(liquidity) : Number(liquidity);

    if (liquidityNum === 0) {
        return { amount0: 0, amount1: 0 };
    }

    // If currentTick is 0 and the position range is far from 0, it's likely a placeholder
    // But if tick 0 is within or near the position range, it's legitimate (price ~ 1:1)
    // Check if 0 is within a reasonable margin of the range
    if (tickCurrent === 0 && (tickLower > 1000 || tickUpper < -1000)) {
        console.warn("[V3 Math] currentTick is 0 but position range is far from 0 (likely placeholder), skipping calculation");
        return { amount0: 0, amount1: 0 };
    }

    // Get sqrt prices from ticks
    const sqrtPriceCurrent = tickToSqrtPrice(tickCurrent);
    const sqrtPriceLower = tickToSqrtPrice(tickLower);
    const sqrtPriceUpper = tickToSqrtPrice(tickUpper);

    let amount0 = 0;
    let amount1 = 0;

    // Uniswap V3 formulas
    // amount0 = L * (1/sqrt(P) - 1/sqrt(Pb))
    // amount1 = L * (sqrt(P) - sqrt(Pa))

    // Position is entirely in token1 (price below range)
    if (tickCurrent < tickLower) {
        amount0 = 0;
        amount1 = liquidityNum * (sqrtPriceUpper - sqrtPriceLower);
    }
    // Position is entirely in token0 (price above range)
    else if (tickCurrent >= tickUpper) {
        amount0 = liquidityNum * (1 / sqrtPriceLower - 1 / sqrtPriceUpper);
        amount1 = 0;
    }
    // Position is in range (has both tokens)
    else {
        amount0 = liquidityNum * (1 / sqrtPriceCurrent - 1 / sqrtPriceUpper);
        amount1 = liquidityNum * (sqrtPriceCurrent - sqrtPriceLower);
    }

    // Adjust for decimals
    const scaledAmount0 = amount0 / Math.pow(10, decimals0);
    const scaledAmount1 = amount1 / Math.pow(10, decimals1);

    console.log(`[V3 Math] Calculated amounts: ${scaledAmount0} token0, ${scaledAmount1} token1 (liquidity: ${liquidityNum}, tick: ${tickCurrent}, range: ${tickLower} to ${tickUpper})`);

    return {
        amount0: scaledAmount0,
        amount1: scaledAmount1,
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
