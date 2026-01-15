import { useMemo } from "react";
import { useConnections } from "wagmi";
import { useNativeBalance } from "@/hooks/useNativeBalance";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useETCswapV2Positions } from "@/hooks/useETCswapV2Positions";

/**
 * Portfolio Summary Data
 *
 * Aggregates all portfolio data sources into a unified summary.
 * Provides counts and key metrics for native balance, tokens, and positions.
 */
export type PortfolioSummary = {
    // Connection state
    isConnected: boolean;
    address: string | undefined;

    // Loading state (true if ANY data source is loading)
    isLoading: boolean;

    // Error state (true if ANY data source has error)
    hasError: boolean;

    // Native balance
    native: {
        hasBalance: boolean;
        balance: bigint | null;
    };

    // ERC20 tokens
    tokens: {
        count: number;
        hasBalances: boolean;
    };

    // LP positions
    positions: {
        count: number;
        hasPositions: boolean;
    };

    // Overall stats
    totalAssets: number; // native (if > 0) + token count + position count
    isEmpty: boolean; // true if no assets at all
};

/**
 * Hook to fetch aggregated portfolio summary.
 *
 * Combines data from:
 * - Native balance (useNativeBalance)
 * - ERC20 tokens (useTokenBalances)
 * - ETCswap V2 positions (useETCswapV2Positions)
 *
 * Returns unified summary with loading and error states.
 *
 * @returns Portfolio summary data
 */
export function usePortfolioSummary(): PortfolioSummary {
    const connections = useConnections();

    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    const isConnected = Boolean(address);

    // Fetch all data sources
    const {
        data: nativeBalance,
        isLoading: isLoadingNative,
        error: nativeError,
    } = useNativeBalance();

    const {
        data: tokenBalances,
        isLoading: isLoadingTokens,
        error: tokensError,
    } = useTokenBalances();

    const {
        data: positions,
        isLoading: isLoadingPositions,
        error: positionsError,
    } = useETCswapV2Positions();

    // Aggregate loading state
    const isLoading = isLoadingNative || isLoadingTokens || isLoadingPositions;

    // Aggregate error state
    const hasError = Boolean(nativeError || tokensError || positionsError);

    // Calculate native balance status
    const hasNativeBalance =
        nativeBalance !== null &&
        nativeBalance !== undefined &&
        nativeBalance > BigInt(0);

    // Calculate token count
    const tokenCount = tokenBalances?.length ?? 0;
    const hasTokenBalances = tokenCount > 0;

    // Calculate position count
    const positionCount = positions?.length ?? 0;
    const hasPositions = positionCount > 0;

    // Calculate total assets
    const nativeAssetCount = hasNativeBalance ? 1 : 0;
    const totalAssets = nativeAssetCount + tokenCount + positionCount;

    // Check if portfolio is completely empty
    const isEmpty = !hasNativeBalance && !hasTokenBalances && !hasPositions;

    return {
        isConnected,
        address,
        isLoading,
        hasError,
        native: {
            hasBalance: hasNativeBalance,
            balance: nativeBalance ?? null,
        },
        tokens: {
            count: tokenCount,
            hasBalances: hasTokenBalances,
        },
        positions: {
            count: positionCount,
            hasPositions,
        },
        totalAssets,
        isEmpty,
    };
}
