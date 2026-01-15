"use client";

import { useMemo } from "react";
import { useChainId, useConnections } from "wagmi";
import { formatEther } from "viem";
import { useNativeBalance } from "@/hooks/useNativeBalance";
import { CHAINS_BY_ID } from "@/lib/networks/registry";

/**
 * Compact balance display for TopBar/Header.
 * Shows native balance persistently across all pages (Ledger Live sidebar pattern).
 */
export function TopBarBalance() {
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

    // Don't show anything if wallet not connected
    if (!isConnected || !address) {
        return null;
    }

    // Loading state - show placeholder
    if (isLoading) {
        return (
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5">
                <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
            </div>
        );
    }

    // Error state - show minimal error indicator
    if (error) {
        return (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5">
                <div className="text-xs text-red-400">Balance Error</div>
            </div>
        );
    }

    // Format balance - show 4 decimals max
    const formattedBalance = balance !== undefined ? formatEther(balance) : "0";
    const displayBalance = parseFloat(formattedBalance).toFixed(4);

    return (
        <div
            className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 transition hover:bg-white/8"
            suppressHydrationWarning
        >
            <div className="text-sm font-medium text-white/90">
                {displayBalance} {nativeSymbol}
            </div>
        </div>
    );
}
