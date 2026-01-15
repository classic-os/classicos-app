"use client";

import { formatEther } from "viem";
import { useChainId } from "wagmi";
import { usePortfolioSummary } from "@/hooks/usePortfolioSummary";
import { useETCPrice } from "@/hooks/useETCPrice";
import { CHAINS_BY_ID } from "@/lib/networks/registry";
import { formatTokenBalance, formatNumber } from "@/lib/utils/format";
import { CollapsiblePanel } from "@/components/ui/CollapsiblePanel";

/**
 * Portfolio Summary Component
 *
 * Displays aggregated portfolio metrics in a clean summary card.
 * Shows counts and key metrics for native balance, tokens, and positions.
 *
 * Following 2025 DeFi patterns with scannable metric cards.
 */
export function PortfolioSummary() {
    const chainId = useChainId();
    const summary = usePortfolioSummary();
    const { data: priceData, isLoading: isPriceLoading } = useETCPrice();
    const chain = CHAINS_BY_ID[chainId];
    const nativeSymbol = chain?.nativeCurrency?.symbol || "ETH";

    // State 1: Disconnected
    if (!summary.isConnected) {
        return (
            <CollapsiblePanel
                title="Portfolio Summary"
                description="Asset counts and key metrics"
                defaultExpanded={true}
            >
                <div className="text-center text-sm text-white/55">
                    Connect wallet to view portfolio summary
                </div>
            </CollapsiblePanel>
        );
    }

    // State 2: Loading
    if (summary.isLoading) {
        return (
            <CollapsiblePanel
                title="Portfolio Summary"
                description="Asset counts and key metrics"
                defaultExpanded={true}
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="h-20 animate-pulse rounded-lg bg-white/5" />
                    <div className="h-20 animate-pulse rounded-lg bg-white/5" />
                    <div className="h-20 animate-pulse rounded-lg bg-white/5" />
                </div>
            </CollapsiblePanel>
        );
    }

    // State 3: Error
    if (summary.hasError) {
        return (
            <CollapsiblePanel
                title="Portfolio Summary"
                description="Asset counts and key metrics"
                defaultExpanded={true}
            >
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                    <div className="text-sm font-medium text-red-400">
                        Failed to load portfolio summary
                    </div>
                    <div className="mt-1 text-xs text-red-300/70">
                        Some data sources encountered errors
                    </div>
                </div>
            </CollapsiblePanel>
        );
    }

    // State 4: Empty portfolio
    if (summary.isEmpty) {
        return (
            <CollapsiblePanel
                title="Portfolio Summary"
                description="Asset counts and key metrics"
                defaultExpanded={true}
            >
                <div className="text-center">
                    <div className="mb-2 text-sm font-medium text-white/70">
                        No assets detected
                    </div>
                    <div className="text-xs text-white/50">
                        This wallet doesn&apos;t have any {nativeSymbol}, tokens, or liquidity positions on{" "}
                        {chain?.name || `Chain ${chainId}`}.
                    </div>
                    <div className="mt-3 text-xs text-white/45">
                        To get started, transfer {nativeSymbol} to this wallet or acquire tokens through a swap.
                    </div>
                </div>
            </CollapsiblePanel>
        );
    }

    // State 5: Data - show summary
    const nativeBalanceFormatted = summary.native.balance
        ? formatTokenBalance(formatEther(summary.native.balance))
        : "0";

    // Calculate USD value if we have both balance and price
    const nativeBalanceFloat = summary.native.balance
        ? parseFloat(formatEther(summary.native.balance))
        : 0;
    const usdValue =
        priceData && nativeBalanceFloat > 0 ? nativeBalanceFloat * priceData.price : null;

    const assetCountLabel = `${summary.totalAssets} ${summary.totalAssets === 1 ? "Asset" : "Assets"}`;

    return (
        <CollapsiblePanel
            title="Portfolio Summary"
            description={assetCountLabel}
            defaultExpanded={true}
        >
            {/* Metric Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Native Balance Card */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-white/55">
                        Native Balance
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        {summary.native.hasBalance ? (
                            <>
                                <div className="font-mono text-xl font-semibold text-white/90">
                                    {nativeBalanceFormatted}
                                </div>
                                <div className="text-sm text-white/60">{nativeSymbol}</div>
                            </>
                        ) : (
                            <div className="text-sm text-white/50">No balance</div>
                        )}
                    </div>
                    {/* USD Value */}
                    {summary.native.hasBalance && (
                        <div className="mt-2 text-sm text-white/50">
                            {isPriceLoading && <span>Loading price...</span>}
                            {!isPriceLoading && usdValue !== null && (
                                <span>${formatNumber(usdValue, 2, 2)} USD</span>
                            )}
                            {!isPriceLoading && priceData && usdValue === null && (
                                <span>Price unavailable</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Tokens Card */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-white/55">
                        Tokens
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <div className="font-mono text-xl font-semibold text-white/90">
                            {summary.tokens.count}
                        </div>
                        <div className="text-sm text-white/60">
                            {summary.tokens.count === 1 ? "Token" : "Tokens"}
                        </div>
                    </div>
                    {!summary.tokens.hasBalances && (
                        <div className="mt-1 text-xs text-white/50">No token balances</div>
                    )}
                </div>

                {/* Positions Card */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-white/55">
                        LP Positions
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <div className="font-mono text-xl font-semibold text-white/90">
                            {summary.positions.count}
                        </div>
                        <div className="text-sm text-white/60">
                            {summary.positions.count === 1 ? "Position" : "Positions"}
                        </div>
                    </div>
                    {!summary.positions.hasPositions && (
                        <div className="mt-1 text-xs text-white/50">No active positions</div>
                    )}
                </div>
            </div>
        </CollapsiblePanel>
    );
}
