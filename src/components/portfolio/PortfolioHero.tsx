"use client";

import { useMemo } from "react";
import { useChainId, useConnections } from "wagmi";
import { formatEther } from "viem";
import { useNativeBalance } from "@/hooks/useNativeBalance";
import { CHAINS_BY_ID } from "@/lib/networks/registry";

/**
 * Portfolio Hero Section - Large prominent balance display.
 * Follows DeBank/Trezor pattern: Big balance at top of portfolio page.
 */
export function PortfolioHero() {
    const connections = useConnections();
    const chainId = useChainId();
    const { data: balance, isLoading, error } = useNativeBalance();

    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    const isConnected = Boolean(address);
    const chain = CHAINS_BY_ID[chainId];
    const nativeSymbol = chain?.nativeCurrency?.symbol || "ETH";

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
    const displayBalance = parseFloat(formattedBalance).toFixed(4);
    const isZero = balance === BigInt(0);

    return (
        <div
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 to-black/20 p-8"
            suppressHydrationWarning
        >
            <div className="space-y-4">
                {/* Label */}
                <div className="text-xs font-medium uppercase tracking-wider text-white/45">
                    Total Balance
                </div>

                {/* Main Balance Display */}
                <div className="space-y-2">
                    <div className="text-5xl font-bold text-white/95">
                        {displayBalance} {nativeSymbol}
                    </div>
                    {isZero && (
                        <div className="text-sm text-white/45">
                            No {nativeSymbol} in this wallet
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-4 pt-2">
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
