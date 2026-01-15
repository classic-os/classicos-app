"use client";

import { formatEther } from "viem";
import { useChainId } from "wagmi";
import { usePortfolioSummary } from "@/hooks/usePortfolioSummary";
import { useETCEcosystemPrices } from "@/hooks/useETCEcosystemPrices";
import { getEcosystem } from "@/lib/ecosystems/registry";
import { CHAINS_BY_ID } from "@/lib/networks/registry";
import { formatTokenBalance } from "@/lib/utils/format";
import {
    calculateNativeUSDValue,
    calculateTokensUSDValue,
    calculatePositionsUSDValue,
    formatUSDValue,
} from "@/lib/portfolio/portfolio-value";
import { CollapsiblePanel } from "@/components/ui/CollapsiblePanel";
import { PriceChange } from "@/components/ui/PriceChange";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useETCswapV2Positions } from "@/hooks/useETCswapV2Positions";

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
    const { data: prices, isLoading: isPriceLoading } = useETCEcosystemPrices();
    const { data: tokenBalances } = useTokenBalances();
    const { data: positions } = useETCswapV2Positions();
    const ecosystem = getEcosystem(chainId);
    const chain = CHAINS_BY_ID[chainId];
    const nativeSymbol = chain?.nativeCurrency?.symbol || "ETH";
    const isTestnet = ecosystem.kind === "testnet";

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

    // Calculate USD value for native balance
    const nativeUSDValue = prices && summary.native.balance
        ? calculateNativeUSDValue(summary.native.balance, prices, isTestnet)
        : 0;

    // Calculate USD value for tokens (USC, WETC have known prices)
    const tokensUSDValue = prices && tokenBalances
        ? calculateTokensUSDValue(
              tokenBalances.map((tb) => ({
                  tokenAddress: tb.token.address,
                  balance: tb.balance,
                  decimals: tb.token.decimals,
              })),
              prices
          )
        : 0;

    // Calculate USD value for LP positions
    const positionsUSDValue = prices && positions
        ? calculatePositionsUSDValue(positions, prices)
        : 0;

    // Total portfolio value across all asset types
    const totalPortfolioValue = nativeUSDValue + tokensUSDValue + positionsUSDValue;

    const assetCountLabel = `${summary.totalAssets} ${summary.totalAssets === 1 ? "Asset" : "Assets"}`;

    return (
        <CollapsiblePanel
            title="Portfolio Summary"
            description={assetCountLabel}
            defaultExpanded={true}
        >
            {/* Total Portfolio Value Card */}
            {totalPortfolioValue > 0 && (
                <div className="mb-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-white/70">
                        Total Portfolio Value
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        {isPriceLoading ? (
                            <div className="text-sm text-white/50">Loading prices...</div>
                        ) : (
                            <>
                                <div className="font-mono text-2xl font-semibold text-white/95">
                                    {formatUSDValue(totalPortfolioValue)}
                                </div>
                                {prices?.etc.change24h !== undefined && (
                                    <PriceChange change24h={prices.etc.change24h} size="md" />
                                )}
                                {isTestnet && (
                                    <div className="text-xs text-white/50">* Testnet Assets</div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="mt-1 text-xs text-white/50">
                        Based on CoinGecko prices (ETC, USC, WETC)
                    </div>
                </div>
            )}

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
                        <div className="mt-2 flex items-baseline gap-2">
                            <div className="text-sm text-white/50">
                                {isPriceLoading && <span>Loading price...</span>}
                                {!isPriceLoading && nativeUSDValue > 0 && (
                                    <span>{formatUSDValue(nativeUSDValue)}</span>
                                )}
                                {!isPriceLoading && prices && nativeUSDValue === 0 && (
                                    <span>Price unavailable</span>
                                )}
                            </div>
                            {!isPriceLoading && prices?.etc.change24h !== undefined && (
                                <PriceChange change24h={prices.etc.change24h} size="sm" />
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
