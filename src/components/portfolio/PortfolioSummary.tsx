"use client";

import { formatEther } from "viem";
import { useChainId } from "wagmi";
import { usePortfolioSummary } from "@/hooks/usePortfolioSummary";
import { CHAINS_BY_ID } from "@/lib/networks/registry";

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
    const chain = CHAINS_BY_ID[chainId];
    const nativeSymbol = chain?.nativeCurrency?.symbol || "ETH";

    // State 1: Disconnected
    if (!summary.isConnected) {
        return (
            <div className="rounded-xl border border-white/10 bg-black/20 p-6">
                <div className="text-center text-sm text-white/55">
                    Connect wallet to view portfolio summary
                </div>
            </div>
        );
    }

    // State 2: Loading
    if (summary.isLoading) {
        return (
            <div className="rounded-xl border border-white/10 bg-black/20 p-6">
                <div className="mb-4">
                    <div className="h-6 w-32 animate-pulse rounded bg-white/5" />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="h-20 animate-pulse rounded-lg bg-white/5" />
                    <div className="h-20 animate-pulse rounded-lg bg-white/5" />
                    <div className="h-20 animate-pulse rounded-lg bg-white/5" />
                </div>
            </div>
        );
    }

    // State 3: Error
    if (summary.hasError) {
        return (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
                <div className="text-sm font-medium text-red-400">
                    Failed to load portfolio summary
                </div>
                <div className="mt-1 text-xs text-red-300/70">
                    Some data sources encountered errors
                </div>
            </div>
        );
    }

    // State 4: Empty portfolio
    if (summary.isEmpty) {
        return (
            <div className="rounded-xl border border-white/10 bg-black/20 p-6">
                <div className="text-center">
                    <div className="text-sm font-medium text-white/70">
                        No assets found
                    </div>
                    <div className="mt-1 text-xs text-white/50">
                        Your portfolio is empty. Add funds to get started.
                    </div>
                </div>
            </div>
        );
    }

    // State 5: Data - show summary
    const nativeBalanceFormatted = summary.native.balance
        ? parseFloat(formatEther(summary.native.balance)).toFixed(4)
        : "0.0000";

    return (
        <div className="rounded-xl border border-white/10 bg-black/20 p-6">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white/90">
                    Portfolio Summary
                </h3>
                <div className="rounded-lg bg-white/5 px-3 py-1 text-sm font-medium text-white/70">
                    {summary.totalAssets} {summary.totalAssets === 1 ? "Asset" : "Assets"}
                </div>
            </div>

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
        </div>
    );
}
