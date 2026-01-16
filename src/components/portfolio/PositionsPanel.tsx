"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useChainId, useConnections } from "wagmi";
import { EmptyState } from "@/components/ui/EmptyState";
import { useETCswapV2Positions } from "@/hooks/useETCswapV2Positions";
import { useETCswapV3Positions } from "@/hooks/useETCswapV3Positions";
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

    // Fetch both V2 and V3 positions
    const v2Query = useETCswapV2Positions();
    const v3Query = useETCswapV3Positions();

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

    // Combine V2 and V3 positions
    const v2Positions = v2Query.data || [];
    const v3Positions = v3Query.data || [];
    const allPositions = [...v2Positions, ...v3Positions];

    const isLoading = v2Query.isLoading || v3Query.isLoading;
    const error = v2Query.error || v3Query.error;
    const isFetching = v2Query.isFetching || v3Query.isFetching;
    const dataUpdatedAt = Math.max(v2Query.dataUpdatedAt || 0, v3Query.dataUpdatedAt || 0);

    const positionCount = allPositions.length;
    const v2Count = v2Positions.length;
    const v3Count = v3Positions.length;

    // Build description showing position counts by protocol
    let positionCountLabel = "ETCswap V2 & V3";
    if (positionCount > 0) {
        const parts: string[] = [];
        if (v2Count > 0) parts.push(`V2: ${v2Count}`);
        if (v3Count > 0) parts.push(`V3: ${v3Count}`);
        positionCountLabel = parts.join(", ");
        if (isTestnet) positionCountLabel += " (Testnet)";
    }

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
    if (allPositions.length === 0) {
        return (
            <CollapsiblePanel
                title="Liquidity Positions"
                description={positionCountLabel}
                defaultExpanded={true}
            >
                <EmptyState
                    title="No active positions"
                    body="You don't have any liquidity provider positions on ETCswap V2 or V3. LP positions allow you to earn trading fees by providing liquidity to token pairs."
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

                {allPositions.map((position) => {
                    const key = position.protocol === "etcswap-v2"
                        ? position.lpTokenAddress
                        : `v3-${position.tokenId}`;
                    return (
                        <PositionCard
                            key={key}
                            position={position}
                            chainId={chainId}
                            prices={prices}
                            derivedPrices={derivedPrices}
                            currency={currency}
                            exchangeRates={exchangeRates}
                        />
                    );
                })}
            </div>
        </CollapsiblePanel>
    );
}
