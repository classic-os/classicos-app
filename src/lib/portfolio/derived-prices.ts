/**
 * Derived Token Prices from LP Pools
 *
 * Calculates token prices by analyzing LP pool reserve ratios.
 * For tokens without CoinGecko listings (USDC, USDT, WBTC on testnet),
 * we can derive their USD value from pools paired with known-price tokens
 * (ETC, USC, WETC).
 *
 * Price derivation strategy:
 * 1. Find all pools containing the unknown token
 * 2. Filter for pools where the pair token has a known USD price
 * 3. Calculate price from reserve ratios: price = (pairedReserve * pairedPrice) / unknownReserve
 * 4. Use median price if multiple pools available (prevents manipulation)
 *
 * Example: USDC/WETC pool with reserves:
 * - 1000 USDC (unknown price)
 * - 50 WETC (known: $20/WETC = $1000)
 * - USDC price = ($1000) / 1000 = $1.00
 */

import type { Address } from "viem";
import { formatUnits } from "viem";
import type { ETCPriceData } from "@/lib/portfolio/price-adapter";
import type { ETCswapV2Position } from "@/lib/portfolio/adapters/etcswap-v2-positions";

/**
 * Derived price result
 */
export type DerivedPrice = {
    tokenAddress: Address;
    price: number; // USD price
    derivedFrom: string; // Which pool(s) it was derived from
    confidence: "high" | "medium" | "low"; // Confidence based on liquidity
};

/**
 * Known token addresses on each chain
 */
const KNOWN_TOKEN_ADDRESSES = {
    WETC: "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a".toLowerCase(),
    USC: "0xDE093684c796204224BC081f937aa059D903c52a".toLowerCase(),
} as const;

/**
 * Get USD price for a known token
 */
function getKnownTokenPrice(
    tokenAddress: string,
    prices: ETCPriceData
): number | null {
    const normalized = tokenAddress.toLowerCase();

    if (normalized === KNOWN_TOKEN_ADDRESSES.WETC) {
        return prices.wetc.price;
    }

    if (normalized === KNOWN_TOKEN_ADDRESSES.USC) {
        return prices.usc.price;
    }

    return null;
}

/**
 * Calculate price of unknown token from a single LP pool
 *
 * @param unknownTokenAddress - Address of token to price
 * @param position - LP pool position
 * @param prices - Known token prices
 * @returns Derived price or null if pair token has no known price
 */
function derivePriceFromPool(
    unknownTokenAddress: string,
    position: ETCswapV2Position,
    prices: ETCPriceData
): number | null {
    const { token0, token1 } = position;
    const normalizedUnknown = unknownTokenAddress.toLowerCase();

    // Determine which token is unknown and which is known
    let unknownToken: typeof token0;
    let knownToken: typeof token0;

    if (token0.address.toLowerCase() === normalizedUnknown) {
        unknownToken = token0;
        knownToken = token1;
    } else if (token1.address.toLowerCase() === normalizedUnknown) {
        unknownToken = token1;
        knownToken = token0;
    } else {
        // Unknown token not in this pool
        return null;
    }

    // Get known token's USD price
    const knownPrice = getKnownTokenPrice(knownToken.address, prices);
    if (knownPrice === null || knownPrice === 0) {
        return null;
    }

    // Calculate reserves in human-readable units
    const unknownReserve = Number(formatUnits(unknownToken.reserve, unknownToken.decimals));
    const knownReserve = Number(formatUnits(knownToken.reserve, knownToken.decimals));

    if (unknownReserve === 0) {
        return null;
    }

    // Price calculation: unknownPrice = (knownReserve * knownPrice) / unknownReserve
    const derivedPrice = (knownReserve * knownPrice) / unknownReserve;

    return derivedPrice;
}

/**
 * Calculate median of array
 */
function median(values: number[]): number {
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
        return sorted[mid];
    }
}

/**
 * Derive price for a token from all available LP pools
 *
 * Strategy:
 * 1. Find all pools containing this token
 * 2. Calculate price from each pool where pair has known price
 * 3. Use median price if multiple pools (prevents manipulation)
 * 4. Assign confidence based on number of pools and liquidity
 *
 * @param tokenAddress - Token to price
 * @param allPositions - All LP positions on this chain
 * @param prices - Known token prices
 * @returns Derived price or null if cannot be calculated
 */
export function deriveTokenPrice(
    tokenAddress: Address,
    allPositions: readonly ETCswapV2Position[],
    prices: ETCPriceData
): DerivedPrice | null {
    const normalized = tokenAddress.toLowerCase();

    // Filter pools containing this token
    const relevantPools = allPositions.filter(
        (pos) =>
            pos.token0.address.toLowerCase() === normalized ||
            pos.token1.address.toLowerCase() === normalized
    );

    if (relevantPools.length === 0) {
        return null;
    }

    // Calculate price from each pool
    const derivedPrices: Array<{ price: number; poolName: string }> = [];

    for (const pool of relevantPools) {
        const price = derivePriceFromPool(normalized, pool, prices);

        if (price !== null && price > 0) {
            const poolName = `${pool.token0.symbol}/${pool.token1.symbol}`;
            derivedPrices.push({ price, poolName });
        }
    }

    if (derivedPrices.length === 0) {
        return null;
    }

    // Use median price if multiple pools available
    const prices_only = derivedPrices.map((dp) => dp.price);
    const finalPrice = median(prices_only);

    // Determine confidence based on number of sources
    let confidence: "high" | "medium" | "low";
    if (derivedPrices.length >= 3) {
        confidence = "high";
    } else if (derivedPrices.length === 2) {
        confidence = "medium";
    } else {
        confidence = "low";
    }

    // Build source description
    const derivedFrom = derivedPrices.map((dp) => dp.poolName).join(", ");

    return {
        tokenAddress,
        price: finalPrice,
        derivedFrom,
        confidence,
    };
}

/**
 * Derive prices for all unknown tokens from available LP pools
 *
 * This function:
 * 1. Takes all LP positions on the chain
 * 2. Extracts unique token addresses
 * 3. Filters out tokens with known prices
 * 4. Derives prices for remaining tokens from pool ratios
 *
 * @param allPositions - All LP positions on this chain
 * @param prices - Known token prices (ETC, USC, WETC)
 * @returns Map of token address → derived price
 */
export function deriveAllTokenPrices(
    allPositions: readonly ETCswapV2Position[],
    prices: ETCPriceData
): Map<string, DerivedPrice> {
    const derivedPrices = new Map<string, DerivedPrice>();

    // Extract all unique token addresses from pools
    const uniqueTokens = new Set<string>();
    for (const position of allPositions) {
        uniqueTokens.add(position.token0.address.toLowerCase());
        uniqueTokens.add(position.token1.address.toLowerCase());
    }

    // Filter out tokens that already have known prices
    const unknownTokens = Array.from(uniqueTokens).filter((addr) => {
        return getKnownTokenPrice(addr, prices) === null;
    });

    // Derive price for each unknown token
    for (const tokenAddr of unknownTokens) {
        const derived = deriveTokenPrice(tokenAddr as Address, allPositions, prices);

        if (derived !== null) {
            derivedPrices.set(tokenAddr, derived);
        }
    }

    return derivedPrices;
}

/**
 * Get price for any token (known or derived)
 *
 * Priority:
 * 1. Known prices from CoinGecko (ETC, USC, WETC)
 * 2. Derived prices from LP pools
 * 3. null if unavailable
 *
 * @param tokenAddress - Token address
 * @param prices - Known token prices
 * @param derivedPrices - Derived prices from LP pools
 * @returns Token price in USD or null
 */
export function getTokenPrice(
    tokenAddress: string,
    prices: ETCPriceData,
    derivedPrices: Map<string, DerivedPrice>
): number | null {
    const normalized = tokenAddress.toLowerCase();

    // Try known prices first
    const knownPrice = getKnownTokenPrice(normalized, prices);
    if (knownPrice !== null) {
        return knownPrice;
    }

    // Try derived prices
    const derived = derivedPrices.get(normalized);
    if (derived) {
        return derived.price;
    }

    return null;
}
