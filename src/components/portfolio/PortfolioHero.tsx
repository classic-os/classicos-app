"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useChainId, useConnections } from "wagmi";
import { formatEther } from "viem";
import { useNativeBalance } from "@/hooks/useNativeBalance";
import { useETCEcosystemPrices } from "@/hooks/useETCEcosystemPrices";
import { usePriceHistory } from "@/hooks/usePriceHistory";
import { TokenLogo } from "@/components/portfolio/TokenLogo";
import { Sparkline } from "@/components/ui/Sparkline";
import { PriceChange } from "@/components/ui/PriceChange";
import { CHAINS_BY_ID } from "@/lib/networks/registry";
import { getEcosystem } from "@/lib/ecosystems/registry";
import { formatTokenBalance } from "@/lib/utils/format";
import { calculateNativeUSDValue } from "@/lib/portfolio/portfolio-value";
import { getCurrency, subscribeWorkspace } from "@/lib/state/workspace";
import { useExchangeRates } from "@/lib/currencies/useExchangeRates";
import { formatCurrencyValue } from "@/lib/currencies/format";

const ETC_LOGO_URL = "https://raw.githubusercontent.com/etcswap/token-list/refs/heads/main/assets/ethereum-classic.png";

/**
 * Portfolio Hero Section - Large prominent balance display.
 * Follows DeBank/Trezor pattern: Big balance at top of portfolio page.
 */
export function PortfolioHero() {
    const connections = useConnections();
    const chainId = useChainId();
    const { data: balance, isLoading, error } = useNativeBalance();
    const { data: prices } = useETCEcosystemPrices();
    const { data: priceHistory } = usePriceHistory("ethereum-classic");
    const currency = useSyncExternalStore(subscribeWorkspace, getCurrency, getCurrency);
    const { data: exchangeRates } = useExchangeRates();

    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    const isConnected = Boolean(address);
    const chain = CHAINS_BY_ID[chainId];
    const ecosystem = getEcosystem(chainId);
    const nativeSymbol = chain?.nativeCurrency?.symbol || "ETH";
    const isTestnet = ecosystem.kind === "testnet";

    // Disconnected state
    if (!isConnected || !address) {
        return (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 to-black/20 p-8">
                <div className="text-center">
                    <div className="text-sm text-white/55">Connect wallet to view portfolio</div>
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 to-black/20 p-8">
                <div className="space-y-3">
                    <div className="text-xs text-white/45">Total Balance</div>
                    <div className="h-12 w-64 animate-pulse rounded-lg bg-white/10" />
                    <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-black/20 p-8">
                <div className="space-y-2">
                    <div className="text-sm font-medium text-red-400">Failed to load balance</div>
                    <div className="text-xs text-red-300/70">
                        {error instanceof Error ? error.message : "Unknown error"}
                    </div>
                </div>
            </div>
        );
    }

    // Format balance
    const formattedBalance = balance !== undefined ? formatEther(balance) : "0";
    const displayBalance = formatTokenBalance(formattedBalance);
    const isZero = balance === BigInt(0);

    // Calculate USD value
    const usdValue = prices && balance
        ? calculateNativeUSDValue(balance, prices, isTestnet)
        : null;

    // Prepare sparkline data
    const sparklineData = priceHistory?.prices.map((p) => p.price) || [];
    const sparklineColor = priceHistory && priceHistory.change >= 0 ? "green" : "red";

    return (
        <div
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 to-black/20 p-8"
            suppressHydrationWarning
        >
            <div className="space-y-6">
                {/* Label */}
                <div className="text-xs font-medium uppercase tracking-wider text-white/45">
                    Total Balance
                </div>

                {/* Main Balance Display with Chart */}
                <div className="flex items-start justify-between gap-6">
                    {/* Left: Balance */}
                    <div className="flex items-center gap-4">
                        <TokenLogo logoURI={ETC_LOGO_URL} symbol={nativeSymbol} size="lg" />
                        <div className="space-y-2">
                            <div className="text-5xl font-bold text-white/95">
                                {displayBalance} {nativeSymbol}
                            </div>
                            {usdValue !== null && usdValue > 0 && (
                                <div className="flex items-baseline gap-2">
                                    <div className="text-lg text-white/70">
                                        {formatCurrencyValue(usdValue, currency, exchangeRates)}
                                    </div>
                                    {prices?.etc.change24h !== undefined && (
                                        <PriceChange change24h={prices.etc.change24h} size="sm" />
                                    )}
                                </div>
                            )}
                            {isZero && (
                                <div className="text-sm text-white/45">
                                    No {nativeSymbol} in this wallet
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Sparkline Chart */}
                    {sparklineData.length > 0 && (
                        <div className="flex-shrink-0">
                            <Sparkline
                                data={sparklineData}
                                width={200}
                                height={80}
                                color={sparklineColor}
                                showGradient={true}
                            />
                            <div className="mt-1 text-right text-xs text-white/50">
                                7 day trend
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-white/5 px-3 py-2">
                        <div className="text-xs text-white/55">Network</div>
                        <div className="text-sm font-medium text-white/90">
                            {chain?.name || `Chain ${chainId}`}
                        </div>
                    </div>
                    <div className="rounded-lg bg-white/5 px-3 py-2">
                        <div className="text-xs text-white/55">Assets</div>
                        <div className="text-sm font-medium text-white/90">1 Native</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
