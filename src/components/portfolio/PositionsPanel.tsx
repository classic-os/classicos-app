"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useChainId, useConnections } from "wagmi";
import { EmptyState } from "@/components/ui/EmptyState";
import { useETCswapV2Positions } from "@/hooks/useETCswapV2Positions";
import { useEnhancedPrices } from "@/hooks/useEnhancedPrices";
import { PositionCard } from "@/components/portfolio/PositionCard";
import { UpdateIndicator } from "@/components/portfolio/UpdateIndicator";
import { CollapsiblePanel } from "@/components/ui/CollapsiblePanel";
import { CHAINS_BY_ID } from "@/lib/networks/registry";
import { getCurrency, subscribeWorkspace } from "@/lib/state/workspace";
import { useExchangeRates } from "@/lib/currencies/useExchangeRates";

export function PositionsPanel() {
    const connections = useConnections();
    const chainId = useChainId();
    const { data: positions, isLoading, error, dataUpdatedAt, isFetching } =
        useETCswapV2Positions();
    const { knownPrices: prices, derivedPrices } = useEnhancedPrices();
    const currency = useSyncExternalStore(subscribeWorkspace, getCurrency, getCurrency);
    const { data: exchangeRates } = useExchangeRates();

    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    const isConnected = Boolean(address);
    const chain = CHAINS_BY_ID[chainId];
    const isTestnet = chain?.testnet || false;
    const positionCount = positions?.length || 0;
    const positionCountLabel = positionCount > 0
        ? `${positionCount} ${positionCount === 1 ? "Position" : "Positions"}${isTestnet ? " (Testnet)" : ""}`
        : "Liquidity Positions";

    // State 1: Disconnected
    if (!isConnected || !address) {
        return (
            <CollapsiblePanel
                title="Liquidity Positions"
                description={positionCountLabel}
                defaultExpanded={true}
            >
                <div className="text-sm text-white/55">
                    Connect wallet to view positions
                </div>
            </CollapsiblePanel>
        );
    }

    // State 2: Loading
    if (isLoading) {
        return (
            <CollapsiblePanel
                title="Liquidity Positions"
                description={positionCountLabel}
                defaultExpanded={true}
            >
                <div className="space-y-3">
                    <div className="h-32 w-full animate-pulse rounded-xl bg-white/5" />
                    <div className="h-32 w-full animate-pulse rounded-xl bg-white/5" />
                </div>
            </CollapsiblePanel>
        );
    }

    // State 3: Error
    if (error) {
        return (
            <CollapsiblePanel
                title="Liquidity Positions"
                description={positionCountLabel}
                defaultExpanded={true}
            >
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                    <div className="text-sm font-medium text-red-400">
                        Failed to load positions
                    </div>
                    <div className="mt-1 text-xs text-red-300/70">
                        {error instanceof Error ? error.message : "Unknown error occurred"}
                    </div>
                </div>
            </CollapsiblePanel>
        );
    }

    // State 4: Empty (no positions)
    if (!positions || positions.length === 0) {
        return (
            <CollapsiblePanel
                title="Liquidity Positions"
                description={positionCountLabel}
                defaultExpanded={true}
            >
                <EmptyState
                    title="No active positions"
                    body="You don't have any liquidity provider positions on ETCswap V2 or other supported protocols. LP positions allow you to earn trading fees by providing liquidity to token pairs."
                />
            </CollapsiblePanel>
        );
    }

    // State 5: Data (positions with balances)
    return (
        <CollapsiblePanel
            title="Liquidity Positions"
            description={positionCountLabel}
            defaultExpanded={true}
        >
            <div className="space-y-3">
                {/* Update indicator at top of positions list */}
                {dataUpdatedAt && (
                    <div className="px-1">
                        <UpdateIndicator dataUpdatedAt={dataUpdatedAt} isFetching={isFetching} />
                    </div>
                )}

                {positions.map((position) => (
                    <PositionCard
                        key={position.lpTokenAddress}
                        position={position}
                        chainId={chainId}
                        prices={prices}
                        derivedPrices={derivedPrices}
                        currency={currency}
                        exchangeRates={exchangeRates}
                    />
                ))}
            </div>
        </CollapsiblePanel>
    );
}
