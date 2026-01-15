"use client";

import { useMemo } from "react";
import { useChainId, useConnections } from "wagmi";
import { formatEther } from "viem";
import { useNativeBalance } from "@/hooks/useNativeBalance";
import { UpdateIndicator } from "@/components/portfolio/UpdateIndicator";
import { TokenLogo } from "@/components/portfolio/TokenLogo";
import { CHAINS_BY_ID } from "@/lib/networks/registry";
import { formatTokenBalance } from "@/lib/utils/format";
import { CollapsiblePanel } from "@/components/ui/CollapsiblePanel";

const ETC_LOGO_URL = "https://raw.githubusercontent.com/etcswap/token-list/refs/heads/main/assets/ethereum-classic.png";

export function NativeBalanceDisplay() {
    const connections = useConnections();
    const chainId = useChainId();
    const { data: balance, isLoading, error, dataUpdatedAt, isFetching } = useNativeBalance();

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
            <CollapsiblePanel
                title="Native Balance"
                description={`${nativeSymbol} on ${chain?.name || `Chain ${chainId}`}`}
                defaultExpanded={true}
            >
                <div className="text-sm text-white/55">
                    Connect wallet to view native balance
                </div>
            </CollapsiblePanel>
        );
    }

    // State 2: Loading
    if (isLoading) {
        return (
            <CollapsiblePanel
                title="Native Balance"
                description={`${nativeSymbol} on ${chain?.name || `Chain ${chainId}`}`}
                defaultExpanded={true}
            >
                <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
                    <div className="text-sm text-white/70">Loading balance...</div>
                </div>
            </CollapsiblePanel>
        );
    }

    // State 3: Error
    if (error) {
        return (
            <CollapsiblePanel
                title="Native Balance"
                description={`${nativeSymbol} on ${chain?.name || `Chain ${chainId}`}`}
                defaultExpanded={true}
            >
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                    <div className="text-sm font-medium text-red-400">Failed to load balance</div>
                    <div className="mt-1 text-xs text-red-300/70">
                        {error instanceof Error ? error.message : "Unknown error occurred"}
                    </div>
                </div>
            </CollapsiblePanel>
        );
    }

    // State 4 & 5: Zero balance or Data (treat zero as data, not empty state)
    const formattedBalance = balance !== undefined ? formatEther(balance) : "0";
    const isZero = balance === BigInt(0);
    const displayBalance = formatTokenBalance(formattedBalance);

    return (
        <CollapsiblePanel
            title="Native Balance"
            description={`${displayBalance} ${nativeSymbol}`}
            defaultExpanded={true}
        >
            <div className="flex items-center gap-3">
                <TokenLogo logoURI={ETC_LOGO_URL} symbol={nativeSymbol} size="lg" />
                <div className="flex-1">
                    <div className="text-2xl font-semibold text-white/90">
                        {displayBalance} {nativeSymbol}
                    </div>
                    {isZero && (
                        <div className="mt-1 text-xs text-white/45">
                            This wallet has no {nativeSymbol}. Transfer {nativeSymbol} to pay for gas fees and transactions.
                        </div>
                    )}
                    {/* Update indicator */}
                    {dataUpdatedAt && (
                        <div className="mt-2">
                            <UpdateIndicator
                                dataUpdatedAt={dataUpdatedAt}
                                isFetching={isFetching}
                            />
                        </div>
                    )}

                    <div className="mt-2 rounded-lg bg-white/5 px-2 py-1 text-xs text-white/70">
                        {chain?.name || `Chain ${chainId}`}
                    </div>
                </div>
            </div>
        </CollapsiblePanel>
    );
}
