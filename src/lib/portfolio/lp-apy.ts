/**
 * LP Position APY Calculations
 *
 * Estimates APY for Uniswap V2 style LP positions based on:
 * - Trading fees (0.3% per swap)
 * - Pool reserves and liquidity depth
 * - Estimated trading volume (when available)
 *
 * Future enhancements:
 * - Integrate with ETCswap subgraph for historical volume data
 * - Track impermanent loss
 * - Add farming/staking rewards
 */

import type { ETCswapV2Position } from "@/lib/portfolio/adapters/etcswap-v2-positions";
import type { ETCPriceData } from "@/lib/portfolio/price-adapter";
import { formatUnits } from "viem";

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
