"use client";

import { useMemo } from "react";
import { useChainId, useConnections } from "wagmi";
import { formatUnits } from "viem";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useEnhancedPrices } from "@/hooks/useEnhancedPrices";
import { UpdateIndicator } from "@/components/portfolio/UpdateIndicator";
import { TokenLogo } from "@/components/portfolio/TokenLogo";
import { PriceChange } from "@/components/ui/PriceChange";
import { CopyButton } from "@/components/ui/CopyButton";
import { CHAINS_BY_ID } from "@/lib/networks/registry";
import { formatTokenBalance } from "@/lib/utils/format";
import { formatUSDValue, calculateTokenUSDValue } from "@/lib/portfolio/portfolio-value";
import { CollapsiblePanel } from "@/components/ui/CollapsiblePanel";
import { getTokenPrice } from "@/lib/portfolio/derived-prices";

/**
 * Token Balances Display Component
 *
 * Displays all ERC20 token balances for connected wallet.
 * Uses individual RPC calls for each token (fallback from multicall due to compatibility).
 * Only shows tokens with non-zero balances.
 */
export function TokenBalancesDisplay() {
    const connections = useConnections();
    const chainId = useChainId();
    const { data: tokenBalances, isLoading, error, dataUpdatedAt, isFetching } =
        useTokenBalances();
    const { knownPrices: prices, derivedPrices } = useEnhancedPrices();

    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    const isConnected = Boolean(address);
    const chain = CHAINS_BY_ID[chainId];
    const isTestnet = chain?.testnet || false;

    const tokenCount = tokenBalances?.length || 0;
    const tokenCountLabel = tokenCount > 0
        ? `${tokenCount} ${tokenCount === 1 ? "Token" : "Tokens"}${isTestnet ? " (Testnet)" : ""}`
        : "ERC20 Tokens";

    // State 1: Disconnected
    if (!isConnected || !address) {
        return (
            <CollapsiblePanel
                title="Token Balances"
                description={tokenCountLabel}
                defaultExpanded={true}
            >
                <div className="text-sm text-white/55">
                    Connect wallet to view token balances
                </div>
            </CollapsiblePanel>
        );
    }

    // State 2: Loading
    if (isLoading) {
        return (
            <CollapsiblePanel
                title="Token Balances"
                description={tokenCountLabel}
                defaultExpanded={true}
            >
                <div className="space-y-3">
                    <div className="h-16 w-full animate-pulse rounded-lg bg-white/5" />
                    <div className="h-16 w-full animate-pulse rounded-lg bg-white/5" />
                    <div className="h-16 w-full animate-pulse rounded-lg bg-white/5" />
                </div>
            </CollapsiblePanel>
        );
    }

    // State 3: Error
    if (error) {
        return (
            <CollapsiblePanel
                title="Token Balances"
                description={tokenCountLabel}
                defaultExpanded={true}
            >
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                    <div className="text-sm font-medium text-red-400">
                        Failed to load token balances
                    </div>
                    <div className="mt-1 text-xs text-red-300/70">
                        {error instanceof Error ? error.message : "Unknown error occurred"}
                    </div>
                </div>
            </CollapsiblePanel>
        );
    }

    // State 4: Empty (no tokens)
    if (!tokenBalances || tokenBalances.length === 0) {
        return (
            <CollapsiblePanel
                title="Token Balances"
                description={tokenCountLabel}
                defaultExpanded={true}
            >
                <div className="text-center">
                    <div className="text-sm text-white/55">No ERC20 tokens detected</div>
                    <div className="mt-1 text-xs text-white/40">
                        This wallet doesn&apos;t hold any ERC20 token balances on {chain?.name || `Chain ${chainId}`}.
                    </div>
                    <div className="mt-2 text-xs text-white/35">
                        Tokens acquired through swaps or transfers will appear here automatically.
                    </div>
                </div>
            </CollapsiblePanel>
        );
    }

    // State 5: Data (tokens with balances)
    return (
        <CollapsiblePanel
            title="Token Balances"
            description={tokenCountLabel}
            defaultExpanded={true}
        >
            <div className="space-y-3">
                {/* Update indicator at top of token list */}
                {dataUpdatedAt && (
                    <div className="px-1">
                        <UpdateIndicator dataUpdatedAt={dataUpdatedAt} isFetching={isFetching} />
                    </div>
                )}

                {tokenBalances.map((tokenBalance) => {
                const { token, balance } = tokenBalance;
                const formattedBalance = formatUnits(balance, token.decimals);
                const displayBalance = formatTokenBalance(formattedBalance);

                // Calculate USD value if price data available (including derived prices)
                const usdValue = prices
                    ? calculateTokenUSDValue(balance, token.decimals, token.address, prices, derivedPrices)
                    : null;

                // Get spot price for this token
                const spotPrice = prices ? getTokenPrice(token.address, prices, derivedPrices) : null;

                // Determine price source
                const normalizedAddress = token.address.toLowerCase();
                const uscAddress = "0xDE093684c796204224BC081f937aa059D903c52a".toLowerCase();
                const wetcAddress = "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a".toLowerCase();

                let priceSource: string | null = null;
                if (spotPrice !== null) {
                    if (normalizedAddress === uscAddress || normalizedAddress === wetcAddress) {
                        priceSource = "CoinGecko";
                    } else {
                        const derived = derivedPrices.get(normalizedAddress);
                        if (derived) {
                            priceSource = `ETCswap V2 pool (${derived.derivedFrom})`;
                        }
                    }
                }

                // Get 24h price change for this token (USC or WETC)
                let priceChange: number | undefined;
                if (normalizedAddress === uscAddress) {
                    priceChange = prices?.usc.change24h;
                } else if (normalizedAddress === wetcAddress) {
                    priceChange = prices?.wetc.change24h;
                }

                // Explorer link for this chain (token endpoint for token activity)
                const explorerUrl = chain?.blockExplorers?.default?.url
                    ? `${chain.blockExplorers.default.url}/token/${token.address}`
                    : null;

                return (
                    <div
                        key={`${token.address}-${token.chainId}`}
                        className="rounded-xl border border-white/10 bg-black/20 p-4"
                    >
                        <div className="space-y-3">
                            {/* Header row */}
                            <div className="flex items-center gap-3">
                                <TokenLogo logoURI={token.logoURI} symbol={token.symbol} size="md" />

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-sm font-medium text-white/90">
                                            {token.symbol}
                                        </div>
                                        <div className="truncate text-xs text-white/45">
                                            {token.name}
                                        </div>
                                    </div>
                                    <div className="mt-0.5 flex items-center gap-2">
                                        <span className="text-xs text-white/40">
                                            {token.address.slice(0, 6)}...{token.address.slice(-4)}
                                        </span>
                                        <CopyButton text={token.address} label="Copy" size="xs" variant="ghost" />
                                        {explorerUrl && (
                                            <a
                                                href={explorerUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-white/40 transition hover:text-white/70"
                                                title="View on explorer"
                                            >
                                                <svg
                                                    className="h-3 w-3"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                    />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                    {spotPrice !== null && (
                                        <div className="mt-1 text-xs text-white/50">
                                            {formatUSDValue(spotPrice)} per {token.symbol}
                                        </div>
                                    )}
                                </div>

                                <div className="shrink-0 text-right">
                                    <div className="text-lg font-semibold text-white/90">
                                        {displayBalance}
                                    </div>
                                    <div className="flex items-baseline justify-end gap-1.5 text-xs text-white/55">
                                        <span>{token.symbol}</span>
                                        {usdValue !== null && usdValue > 0 && (
                                            <>
                                                <span className="text-white/30">•</span>
                                                <span>{formatUSDValue(usdValue)}</span>
                                            </>
                                        )}
                                    </div>
                                    {priceChange !== undefined && (
                                        <div className="mt-0.5 flex justify-end">
                                            <PriceChange change24h={priceChange} size="sm" />
                                        </div>
                                    )}
                                    {priceSource && (
                                        <div className="mt-1 text-xs text-white/40 text-right">
                                            {priceSource}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
                })}
            </div>
        </CollapsiblePanel>
    );
}
