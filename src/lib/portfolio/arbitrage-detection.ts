/**
 * Arbitrage Opportunity Detection
 *
 * Detects price discrepancies between DEX pools and CoinGecko fair market value (FMV).
 * The pricing hierarchy and arbitrage opportunities:
 *
 * 1. **ETC CEX Price (Source of Truth)**
 *    - ETC/USD from liquid centralized exchanges via CoinGecko
 *    - Most accurate reflection of fair market value
 *
 * 2. **WETC/USC CoinGecko Prices**
 *    - Should equal ETC price (ETC = WETC = USC in 1:1 peg)
 *    - Any deviation indicates CEX ↔ DEX arbitrage opportunity
 *    - Reflects inefficiencies in primary on-chain market vs mature CEX markets
 *
 * 3. **DEX Pool Spot Prices**
 *    - ETCswap V2 WETC/USC pool may differ from V3 WETC/USC pool
 *    - Fragmentation between protocols creates arbitrage opportunities
 *    - Less liquid, younger markets with slower price discovery
 *
 * Classic OS documents these disparities to help users identify and capitalize on
 * arbitrage opportunities across CEX ↔ DEX and between DEX protocols.
 */

import type { Address } from "viem";
import { formatUnits } from "viem";
import type { ETCPriceData } from "@/lib/portfolio/price-adapter";
import type { ETCswapV2Position } from "@/lib/portfolio/adapters/etcswap-v2-positions";
import type { ETCswapV3Position } from "@/lib/portfolio/adapters/etcswap-v3-positions";
import { tickToPrice } from "@/lib/portfolio/v3-math";

/**
 * Known token addresses (case-insensitive)
 */
const KNOWN_TOKENS = {
    WETC: "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a".toLowerCase(),
    USC: "0xDE093684c796204224BC081f937aa059D903c52a".toLowerCase(),
} as const;

/**
 * Arbitrage opportunity detected in a position
 */
export type ArbitrageOpportunity = {
    /** Which token has the pricing discrepancy */
    tokenAddress: Address;
    tokenSymbol: string;

    /** DEX spot price (from pool ratio or V3 tick) */
    dexPrice: number;

    /** CoinGecko fair market value (CEX-based or fiat-backed) */
    fmvPrice: number;

    /** Percentage deviation: ((dexPrice - fmvPrice) / fmvPrice) * 100 */
    deviationPercent: number;

    /** Opportunity type */
    type: "premium" | "discount"; // premium = sell on DEX, buy on CEX; discount = buy on DEX, sell on CEX

    /** Arbitrage mechanism (CEX trading or fiat mint/redeem) */
    mechanism: "cex-trade" | "fiat-backed"; // cex-trade = CEX arbitrage, fiat-backed = mint/redeem via platform

    /** Price source description */
    source: string;
};

/**
 * Get CoinGecko FMV price for a token
 *
 * Uses ETC CEX price as source of truth. WETC and USC should equal ETC price.
 *
 * @param tokenAddress - Token address
 * @param prices - CoinGecko prices
 * @returns FMV price in USD or null if not a known token
 */
function getFMVPrice(tokenAddress: string, prices: ETCPriceData): number | null {
    const normalized = tokenAddress.toLowerCase();

    // ETC is the source of truth from CEX markets
    // WETC should equal ETC (wrapped version)
    if (normalized === KNOWN_TOKENS.WETC) {
        return prices.wetc.price;
    }

    // USC should equal ETC (1:1 stablecoin peg to ETC)
    if (normalized === KNOWN_TOKENS.USC) {
        return prices.usc.price;
    }

    return null;
}

/**
 * Calculate DEX spot price from V2 pool reserves
 *
 * For a token pair, calculates the price of each token in terms of USD
 * using the reserve ratio and the known price of the pair token.
 *
 * @param position - V2 position
 * @param prices - CoinGecko prices
 * @returns Map of token address → DEX spot price in USD
 */
function calculateV2SpotPrices(
    position: ETCswapV2Position,
    prices: ETCPriceData
): Map<string, { price: number; source: string }> {
    const { token0, token1 } = position;
    const spotPrices = new Map<string, { price: number; source: string }>();

    // Convert reserves to decimal
    const reserve0 = Number(formatUnits(token0.reserve, token0.decimals));
    const reserve1 = Number(formatUnits(token1.reserve, token1.decimals));

    if (reserve0 === 0 || reserve1 === 0) {
        return spotPrices;
    }

    // Try to calculate spot price using known FMV prices
    const fmv0 = getFMVPrice(token0.address, prices);
    const fmv1 = getFMVPrice(token1.address, prices);

    // If token0 has FMV, derive token1 spot price from pool ratio
    if (fmv0 !== null) {
        const token1SpotPrice = (reserve0 * fmv0) / reserve1;
        spotPrices.set(token1.address.toLowerCase(), {
            price: token1SpotPrice,
            source: `ETCswap V2 ${token0.symbol}/${token1.symbol}`,
        });
    }

    // If token1 has FMV, derive token0 spot price from pool ratio
    if (fmv1 !== null) {
        const token0SpotPrice = (reserve1 * fmv1) / reserve0;
        spotPrices.set(token0.address.toLowerCase(), {
            price: token0SpotPrice,
            source: `ETCswap V2 ${token0.symbol}/${token1.symbol}`,
        });
    }

    return spotPrices;
}

/**
 * Calculate DEX spot price from V3 pool tick
 *
 * V3 uses concentrated liquidity with tick-based pricing.
 * Current tick determines the spot price.
 *
 * Important: tickToPrice() returns price in terms of token decimal units.
 * For tokens with different decimals, we must adjust by the decimal difference.
 *
 * Formula:
 * - Raw price = 1.0001^tick (price of token1 in terms of token0, unadjusted)
 * - Adjusted price = rawPrice * 10^(decimals0 - decimals1)
 *
 * Example: WETC/USC pool where WETC=token0 (18 decimals), USC=token1 (6 decimals)
 * - If tick gives rawPrice = 1.0 (1 WETC = 1 USC in raw units)
 * - Adjusted = 1.0 * 10^(18-6) = 1.0 * 10^12
 * - Meaning: 1 WETC (10^18 wei) = 10^12 USC (10^18 smallest units)
 * - In human terms: 1 WETC = 1,000,000 USC
 *
 * @param position - V3 position
 * @param prices - CoinGecko prices
 * @returns Map of token address → DEX spot price in USD
 */
function calculateV3SpotPrices(
    position: ETCswapV3Position,
    prices: ETCPriceData
): Map<string, { price: number; source: string }> {
    const { token0, token1, currentTick } = position;
    const spotPrices = new Map<string, { price: number; source: string }>();

    // Get raw price from tick (unadjusted for decimals)
    const rawPriceToken1PerToken0 = tickToPrice(currentTick);

    // Adjust for decimal difference between token0 and token1
    // tickToPrice() returns: (smallest_unit_token1) / (smallest_unit_token0)
    // To convert to human-readable: (whole_token1) / (whole_token0)
    // Formula: human_price = raw_price * 10^(decimals0 - decimals1)
    const decimalAdjustment = Math.pow(10, token0.decimals - token1.decimals);
    const priceToken1PerToken0 = rawPriceToken1PerToken0 * decimalAdjustment;

    console.log(
        `[V3 Arbitrage] ${token0.symbol}/${token1.symbol} pool:`,
        `tick=${currentTick},`,
        `rawPrice=${rawPriceToken1PerToken0.toExponential(4)},`,
        `decimals=(${token0.decimals}, ${token1.decimals}),`,
        `adjustment=10^${token0.decimals - token1.decimals}=${decimalAdjustment.toExponential(2)},`,
        `adjustedPrice=${priceToken1PerToken0.toFixed(6)} ${token1.symbol}/${token0.symbol}`
    );

    // Try to calculate spot price using known FMV prices
    const fmv0 = getFMVPrice(token0.address, prices);
    const fmv1 = getFMVPrice(token1.address, prices);

    // If token0 has FMV, derive token1 spot price
    // priceToken1PerToken0 = how many token1 per 1 token0
    // fmv0 = USD price of 1 token0
    // Therefore: token1 USD price = fmv0 / priceToken1PerToken0
    if (fmv0 !== null && priceToken1PerToken0 > 0) {
        const token1SpotPrice = fmv0 / priceToken1PerToken0;
        console.log(
            `[V3 Arbitrage] Deriving ${token1.symbol} USD price:`,
            `fmv0(${token0.symbol})=$${fmv0.toFixed(2)} /`,
            `price(${token1.symbol}/${token0.symbol})=${priceToken1PerToken0.toFixed(6)} =`,
            `$${token1SpotPrice.toFixed(2)}`
        );
        spotPrices.set(token1.address.toLowerCase(), {
            price: token1SpotPrice,
            source: `ETCswap V3 ${token0.symbol}/${token1.symbol}`,
        });
    }

    // If token1 has FMV, derive token0 spot price
    // priceToken1PerToken0 = how many token1 per 1 token0
    // fmv1 = USD price of 1 token1
    // Therefore: token0 USD price = fmv1 * priceToken1PerToken0
    if (fmv1 !== null && priceToken1PerToken0 > 0) {
        const token0SpotPrice = fmv1 * priceToken1PerToken0;
        console.log(
            `[V3 Arbitrage] Deriving ${token0.symbol} USD price:`,
            `fmv1(${token1.symbol})=$${fmv1.toFixed(2)} *`,
            `price(${token1.symbol}/${token0.symbol})=${priceToken1PerToken0.toFixed(6)} =`,
            `$${token0SpotPrice.toFixed(2)}`
        );
        spotPrices.set(token0.address.toLowerCase(), {
            price: token0SpotPrice,
            source: `ETCswap V3 ${token0.symbol}/${token1.symbol}`,
        });
    }

    return spotPrices;
}

/**
 * Detect arbitrage opportunities in a position
 *
 * Compares DEX spot prices (from pool ratios or ticks) against CoinGecko FMV prices.
 * Only reports deviations >= threshold (default 1%).
 *
 * @param position - LP position (V2 or V3)
 * @param prices - CoinGecko prices
 * @param thresholdPercent - Minimum deviation to report (default: 1%)
 * @returns Array of arbitrage opportunities detected
 */
export function detectArbitrageOpportunities(
    position: ETCswapV2Position | ETCswapV3Position,
    prices: ETCPriceData,
    thresholdPercent: number = 1.0
): ArbitrageOpportunity[] {
    const opportunities: ArbitrageOpportunity[] = [];

    // Calculate DEX spot prices based on position type
    let dexSpotPrices: Map<string, { price: number; source: string }>;

    if (position.protocol === "etcswap-v2") {
        dexSpotPrices = calculateV2SpotPrices(position, prices);
    } else {
        dexSpotPrices = calculateV3SpotPrices(position, prices);
    }

    // Check each token for arbitrage opportunities
    const tokens = [position.token0, position.token1];

    for (const token of tokens) {
        const normalized = token.address.toLowerCase();

        // Get DEX spot price
        const dexData = dexSpotPrices.get(normalized);
        if (!dexData) continue;

        // Get CoinGecko FMV price (CEX-based)
        const fmvPrice = getFMVPrice(normalized, prices);
        if (fmvPrice === null) continue;

        const { price: dexPrice, source } = dexData;

        // Calculate deviation percentage
        const deviationPercent = ((dexPrice - fmvPrice) / fmvPrice) * 100;

        // Only report if deviation exceeds threshold
        if (Math.abs(deviationPercent) >= thresholdPercent) {
            // Determine arbitrage mechanism
            // USC is fiat-backed (mint/redeem via Brale at 1:1 with USD/USDC/USDP)
            // WETC uses CEX trading (buy/sell on centralized exchanges)
            const mechanism = normalized === KNOWN_TOKENS.USC ? "fiat-backed" : "cex-trade";

            opportunities.push({
                tokenAddress: token.address,
                tokenSymbol: token.symbol,
                dexPrice,
                fmvPrice,
                deviationPercent,
                type: deviationPercent > 0 ? "premium" : "discount",
                mechanism,
                source,
            });
        }
    }

    return opportunities;
}

/**
 * Format arbitrage opportunity for display
 *
 * @param opportunity - Arbitrage opportunity
 * @returns Human-readable description
 */
export function formatArbitrageOpportunity(opportunity: ArbitrageOpportunity): string {
    const { tokenSymbol, deviationPercent, type } = opportunity;
    const absDeviation = Math.abs(deviationPercent).toFixed(2);

    if (type === "premium") {
        return `${tokenSymbol} trading ${absDeviation}% above FMV (sell DEX, buy CEX)`;
    } else {
        return `${tokenSymbol} trading ${absDeviation}% below FMV (buy DEX, sell CEX)`;
    }
}
