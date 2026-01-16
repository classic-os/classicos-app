/**
 * LP Position APY Calculations
 *
 * Estimates APY for both V2 and V3 LP positions based on:
 * - Trading fees (V2: 0.3%, V3: variable fee tiers)
 * - Pool reserves and liquidity depth
 * - Estimated trading volume (when available)
 * - For V3: Concentration factor (tick range) affects fee accrual
 *
 * Future enhancements:
 * - Integrate with ETCswap subgraph for historical volume data
 * - Track impermanent loss
 * - Add farming/staking rewards
 */

import type { ETCswapV2Position } from "@/lib/portfolio/adapters/etcswap-v2-positions";
import type { ETCswapV3Position } from "@/lib/portfolio/adapters/etcswap-v3-positions";
import type { ETCPriceData } from "@/lib/portfolio/price-adapter";
import { formatUnits } from "viem";
import { getTokenAmountsFromLiquidity, tickToPrice } from "@/lib/portfolio/v3-math";

/**
 * Fee tier for Uniswap V2 (0.3%)
 */
const UNISWAP_V2_FEE_TIER = 0.003;

/**
 * APY estimation result
 */
export type APYEstimate = {
    apy: number; // Annual percentage yield (e.g., 15.5 for 15.5%)
    dailyFees: number; // Estimated daily fees in USD
    method: "volume-based" | "tvl-based" | "unavailable"; // How APY was calculated
    confidence: "high" | "medium" | "low"; // Confidence level
};

/**
 * Calculate pool TVL (Total Value Locked) in USD
 *
 * @param position - LP position
 * @param prices - Price data for ETC, USC, WETC
 * @returns TVL in USD, or null if prices unavailable
 */
function calculatePoolTVL(
    position: ETCswapV2Position,
    prices: ETCPriceData
): number | null {
    const { token0, token1 } = position;

    // Get USD prices for known tokens
    const token0Price = getTokenPrice(token0.address, prices);
    const token1Price = getTokenPrice(token1.address, prices);

    if (token0Price === null || token1Price === null) {
        return null;
    }

    // Calculate total value of reserves
    const token0Value =
        Number(formatUnits(token0.reserve, token0.decimals)) * token0Price;
    const token1Value =
        Number(formatUnits(token1.reserve, token1.decimals)) * token1Price;

    return token0Value + token1Value;
}

/**
 * Get USD price for a token
 *
 * @param tokenAddress - Token address
 * @param prices - Price data
 * @returns Price in USD, or null if unavailable
 */
function getTokenPrice(
    tokenAddress: string,
    prices: ETCPriceData
): number | null {
    const normalized = tokenAddress.toLowerCase();

    // WETC (Wrapped ETC)
    if (normalized === "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a".toLowerCase()) {
        return prices.wetc.price;
    }

    // USC (Classic USD)
    if (normalized === "0xDE093684c796204224BC081f937aa059D903c52a".toLowerCase()) {
        return prices.usc.price;
    }

    // Add more tokens as needed
    // For now, return null for unknown tokens
    return null;
}

/**
 * Estimate APY based on pool TVL and typical volume/TVL ratios
 *
 * Uses industry heuristics:
 * - High volume pairs (stablecoin, major pairs): ~100-200% volume/TVL ratio
 * - Medium volume pairs: ~50-100% volume/TVL ratio
 * - Low volume pairs: ~10-30% volume/TVL ratio
 *
 * @param position - LP position
 * @param prices - Price data
 * @returns APY estimate
 */
export function estimateAPY(
    position: ETCswapV2Position,
    prices: ETCPriceData
): APYEstimate {
    const tvl = calculatePoolTVL(position, prices);

    // If we can't calculate TVL, return unavailable
    if (tvl === null || tvl === 0) {
        return {
            apy: 0,
            dailyFees: 0,
            method: "unavailable",
            confidence: "low",
        };
    }

    // Heuristic: Estimate volume/TVL ratio based on pair type
    const volumeToTVLRatio = estimateVolumeRatio(position);

    // Estimate daily volume
    const estimatedDailyVolume = tvl * volumeToTVLRatio;

    // Calculate daily fees (0.3% of volume)
    const dailyFees = estimatedDailyVolume * UNISWAP_V2_FEE_TIER;

    // Calculate APY: (daily fees / TVL) * 365 * 100
    const apy = (dailyFees / tvl) * 365 * 100;

    return {
        apy,
        dailyFees,
        method: "tvl-based",
        confidence: "medium",
    };
}

/**
 * Estimate volume/TVL ratio based on pair characteristics
 *
 * Heuristics:
 * - USC/WETC (stablecoin pair): High volume ratio
 * - Major pairs with known tokens: Medium volume ratio
 * - Unknown pairs: Low volume ratio
 *
 * @param position - LP position
 * @returns Estimated daily volume / TVL ratio
 */
function estimateVolumeRatio(position: ETCswapV2Position): number {
    const { token0, token1 } = position;
    const token0Addr = token0.address.toLowerCase();
    const token1Addr = token1.address.toLowerCase();

    const USC_ADDR = "0xDE093684c796204224BC081f937aa059D903c52a".toLowerCase();
    const WETC_ADDR = "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a".toLowerCase();

    // USC/WETC pair - high volume (stablecoin pair)
    if (
        (token0Addr === USC_ADDR && token1Addr === WETC_ADDR) ||
        (token0Addr === WETC_ADDR && token1Addr === USC_ADDR)
    ) {
        return 1.5; // 150% daily volume/TVL ratio
    }

    // Pairs with USC or WETC - medium volume
    if (
        token0Addr === USC_ADDR ||
        token1Addr === USC_ADDR ||
        token0Addr === WETC_ADDR ||
        token1Addr === WETC_ADDR
    ) {
        return 0.8; // 80% daily volume/TVL ratio
    }

    // Other pairs - low volume
    return 0.3; // 30% daily volume/TVL ratio
}

/**
 * Calculate user's position value in USD
 *
 * @param position - LP position
 * @param prices - Price data
 * @returns Position value in USD, or null if prices unavailable
 */
export function calculatePositionValueUSD(
    position: ETCswapV2Position,
    prices: ETCPriceData
): number | null {
    const { token0, token1, lpBalance, lpTotalSupply } = position;

    // Get USD prices for tokens
    const token0Price = getTokenPrice(token0.address, prices);
    const token1Price = getTokenPrice(token1.address, prices);

    if (token0Price === null || token1Price === null) {
        return null;
    }

    // Calculate user's share of reserves
    const shareRatio = Number(lpBalance) / Number(lpTotalSupply);

    // Calculate value of user's token holdings
    const token0Amount = Number(formatUnits(token0.reserve, token0.decimals)) * shareRatio;
    const token1Amount = Number(formatUnits(token1.reserve, token1.decimals)) * shareRatio;

    const token0Value = token0Amount * token0Price;
    const token1Value = token1Amount * token1Price;

    return token0Value + token1Value;
}

/**
 * Estimate APY for V3 concentrated liquidity positions
 *
 * V3 APY calculation differs from V2 because:
 * 1. Fee tiers are variable (0.01%, 0.05%, 0.3%, 1%)
 * 2. Liquidity is concentrated in a price range (tick range)
 * 3. Fees only accrue when price is in range
 * 4. Narrower ranges = higher capital efficiency = higher APY (when in range)
 *
 * Formula:
 * - Calculate position's share of active liquidity in current tick
 * - Estimate daily volume based on pool TVL and pair type
 * - Calculate fees: volume * fee_tier * position_share * in_range_probability
 * - APY = (daily_fees / position_value) * 365 * 100
 *
 * @param position - V3 LP position
 * @param prices - Price data
 * @returns APY estimate
 */
export function estimateV3APY(
    position: ETCswapV3Position,
    prices: ETCPriceData
): APYEstimate {
    const { token0, token1, liquidity, currentTick, tickLower, tickUpper, feeTier } = position;

    // Calculate token amounts in position
    const { amount0, amount1 } = getTokenAmountsFromLiquidity(
        liquidity,
        currentTick,
        tickLower,
        tickUpper,
        token0.decimals,
        token1.decimals
    );

    // Get USD prices for tokens
    const token0Price = getTokenPrice(token0.address, prices);
    const token1Price = getTokenPrice(token1.address, prices);

    // If we can't get prices, return unavailable
    if (token0Price === null || token1Price === null) {
        return {
            apy: 0,
            dailyFees: 0,
            method: "unavailable",
            confidence: "low",
        };
    }

    // Calculate position value
    const positionValue = amount0 * token0Price + amount1 * token1Price;

    if (positionValue === 0) {
        return {
            apy: 0,
            dailyFees: 0,
            method: "unavailable",
            confidence: "low",
        };
    }

    // Check if position is currently in range
    const inRange = currentTick >= tickLower && currentTick < tickUpper;

    // Calculate tick range width (determines concentration factor)
    const tickRange = tickUpper - tickLower;

    // Calculate concentration factor
    // Full range positions (~887272 ticks) have concentration factor of 1.0
    // Narrower ranges have higher concentration (more capital efficient)
    // Example: 50% of full range = 2x concentration = 2x fees when in range
    const fullRangeTicks = 887272 * 2; // Full range is approximately -887272 to 887272
    const concentrationFactor = Math.min(fullRangeTicks / tickRange, 100); // Cap at 100x

    // Estimate in-range probability based on tick range width
    // Wider ranges = higher probability of staying in range
    // This is a heuristic - ideally we'd use historical data
    let inRangeProbability: number;
    if (tickRange >= fullRangeTicks * 0.8) {
        // Near full range
        inRangeProbability = 0.95;
    } else if (tickRange >= fullRangeTicks * 0.4) {
        // Wide range
        inRangeProbability = 0.80;
    } else if (tickRange >= fullRangeTicks * 0.2) {
        // Medium range
        inRangeProbability = 0.60;
    } else if (tickRange >= fullRangeTicks * 0.1) {
        // Narrow range
        inRangeProbability = 0.40;
    } else {
        // Very narrow range
        inRangeProbability = 0.20;
    }

    // Adjust probability if currently out of range (reduce by 50%)
    if (!inRange) {
        inRangeProbability *= 0.5;
    }

    // Estimate pool TVL and daily volume
    // For V3, we need to estimate the total liquidity in the pool
    // This is simplified - ideally we'd query pool data
    // We use position value as a proxy, scaled by typical LP participation rate
    const estimatedPoolTVL = positionValue / 0.05; // Assume position is ~5% of pool (heuristic)

    // Estimate volume/TVL ratio based on pair type (same as V2)
    const volumeToTVLRatio = estimateV3VolumeRatio(position);

    // Estimate daily volume
    const estimatedDailyVolume = estimatedPoolTVL * volumeToTVLRatio;

    // Convert fee tier from basis points to decimal (e.g., 3000 = 0.3%)
    const feeDecimal = feeTier / 1000000;

    // Calculate daily fees earned by the pool
    const poolDailyFees = estimatedDailyVolume * feeDecimal;

    // Calculate user's share of fees
    // In V3, fees are proportional to liquidity concentration and in-range time
    // User's effective share = (concentration_factor * in_range_probability) / estimated_active_LPs
    const estimatedActiveLPs = 20; // Heuristic: assume ~20 active LPs on average
    const effectiveShare = (concentrationFactor * inRangeProbability) / estimatedActiveLPs;

    // Calculate user's daily fees
    const dailyFees = poolDailyFees * effectiveShare;

    // Calculate APY: (daily fees / position value) * 365 * 100
    const apy = (dailyFees / positionValue) * 365 * 100;

    // Determine confidence level
    let confidence: "high" | "medium" | "low";
    if (inRange && tickRange < fullRangeTicks * 0.3) {
        // In range with narrow position = higher uncertainty
        confidence = "medium";
    } else if (!inRange) {
        // Out of range = high uncertainty
        confidence = "low";
    } else {
        // In range with wider position = more stable
        confidence = "medium";
    }

    return {
        apy: Math.max(0, apy), // Ensure non-negative
        dailyFees: Math.max(0, dailyFees),
        method: "tvl-based",
        confidence,
    };
}

/**
 * Estimate volume/TVL ratio for V3 positions
 *
 * Uses same heuristics as V2 but adjusted for V3 liquidity concentration
 *
 * @param position - V3 LP position
 * @returns Estimated daily volume / TVL ratio
 */
function estimateV3VolumeRatio(position: ETCswapV3Position): number {
    const { token0, token1 } = position;
    const token0Addr = token0.address.toLowerCase();
    const token1Addr = token1.address.toLowerCase();

    const USC_ADDR = "0xDE093684c796204224BC081f937aa059D903c52a".toLowerCase();
    const WETC_ADDR = "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a".toLowerCase();

    // USC/WETC pair - high volume (stablecoin pair)
    if (
        (token0Addr === USC_ADDR && token1Addr === WETC_ADDR) ||
        (token0Addr === WETC_ADDR && token1Addr === USC_ADDR)
    ) {
        return 1.5; // 150% daily volume/TVL ratio
    }

    // Pairs with USC or WETC - medium volume
    if (
        token0Addr === USC_ADDR ||
        token1Addr === USC_ADDR ||
        token0Addr === WETC_ADDR ||
        token1Addr === WETC_ADDR
    ) {
        return 0.8; // 80% daily volume/TVL ratio
    }

    // Other pairs - low volume
    return 0.3; // 30% daily volume/TVL ratio
}
