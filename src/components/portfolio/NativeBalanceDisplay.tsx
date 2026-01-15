"use client";

import { useMemo } from "react";
import { useChainId, useConnections } from "wagmi";
import { formatEther } from "viem";
import { useNativeBalance } from "@/hooks/useNativeBalance";
import { CHAINS_BY_ID } from "@/lib/networks/registry";

export function NativeBalanceDisplay() {
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

    // State 1: Disconnected (no wallet)
    if (!isConnected || !address) {
        return (
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-white/55">
                    Connect wallet to view native balance
                </div>
            </div>
        );
    }

    // State 2: Loading
    if (isLoading) {
        return (
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
                    <div className="text-sm text-white/70">Loading balance...</div>
                </div>
            </div>
        );
    }

    // State 3: Error
    if (error) {
        return (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <div className="text-sm font-medium text-red-400">Failed to load balance</div>
                <div className="mt-1 text-xs text-red-300/70">
                    {error instanceof Error ? error.message : "Unknown error occurred"}
                </div>
            </div>
        );
    }

    // State 4 & 5: Zero balance or Data (treat zero as data, not empty state)
    const formattedBalance = balance !== undefined ? formatEther(balance) : "0";
    const isZero = balance === BigInt(0);

    return (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xs text-white/55">Native Balance</div>
                    <div className="mt-1 text-2xl font-semibold text-white/90">
                        {parseFloat(formattedBalance).toFixed(4)} {nativeSymbol}
                    </div>
                    {isZero && (
                        <div className="mt-1 text-xs text-white/45">
                            No {nativeSymbol} in this wallet
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="rounded-lg bg-white/5 px-2 py-1 text-xs text-white/70">
                        {chain?.name || `Chain ${chainId}`}
                    </div>
                </div>
            </div>
        </div>
    );
}
