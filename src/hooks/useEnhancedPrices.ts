import { useMemo } from "react";
import { useETCEcosystemPrices } from "@/hooks/useETCEcosystemPrices";
import { useETCswapV2Positions } from "@/hooks/useETCswapV2Positions";
import { deriveAllTokenPrices, type DerivedPrice } from "@/lib/portfolio/derived-prices";

/**
 * Enhanced price data including both known and derived prices
 */
export type EnhancedPriceData = {
    knownPrices: ReturnType<typeof useETCEcosystemPrices>["data"];
    derivedPrices: Map<string, DerivedPrice>;
    isLoading: boolean;
    error: Error | null;
};

/**
 * Hook to get enhanced token prices
 *
 * Combines:
 * 1. Known prices from CoinGecko (ETC, USC, WETC)
 * 2. Derived prices from LP pool ratios (USDC, USDT, WBTC, etc.)
 *
 * Derived prices are calculated from LP pool reserve ratios where tokens
 * are paired with known-price tokens. This allows pricing of testnet tokens
 * and ecosystem tokens without CoinGecko listings.
 *
 * @returns Enhanced price data with both known and derived prices
 */
export function useEnhancedPrices(): EnhancedPriceData {
    const {
        data: knownPrices,
        isLoading: isPricesLoading,
        error: pricesError,
    } = useETCEcosystemPrices();

    const {
        data: positions,
        isLoading: isPositionsLoading,
        error: positionsError,
    } = useETCswapV2Positions();

    // Derive token prices from LP pools
    const derivedPrices = useMemo(() => {
        if (!knownPrices || !positions || positions.length === 0) {
            return new Map<string, DerivedPrice>();
        }

        return deriveAllTokenPrices(positions, knownPrices);
    }, [knownPrices, positions]);

    return {
        knownPrices: knownPrices || undefined,
        derivedPrices,
        isLoading: isPricesLoading || isPositionsLoading,
        error: pricesError || positionsError,
    };
}
