"use client";

import { useMemo } from "react";
import { useChainId, useConnections } from "wagmi";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { useETCswapV2Positions } from "@/hooks/useETCswapV2Positions";
import { PositionCard } from "@/components/portfolio/PositionCard";

export function PositionsPanel() {
    const connections = useConnections();
    const chainId = useChainId();
    const { data: positions, isLoading, error } = useETCswapV2Positions();

    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    const isConnected = Boolean(address);

    // State 1: Disconnected
    if (!isConnected || !address) {
        return (
            <Panel title="Positions" description="DeFi protocol positions">
                <div className="text-sm text-white/55">
                    Connect wallet to view positions
                </div>
            </Panel>
        );
    }

    // State 2: Loading
    if (isLoading) {
        return (
            <Panel title="Positions" description="DeFi protocol positions">
                <div className="space-y-3">
                    <div className="h-32 w-full animate-pulse rounded-xl bg-white/5" />
                    <div className="h-32 w-full animate-pulse rounded-xl bg-white/5" />
                </div>
            </Panel>
        );
    }

    // State 3: Error
    if (error) {
        return (
            <Panel title="Positions" description="DeFi protocol positions">
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                    <div className="text-sm font-medium text-red-400">
                        Failed to load positions
                    </div>
                    <div className="mt-1 text-xs text-red-300/70">
                        {error instanceof Error ? error.message : "Unknown error occurred"}
                    </div>
                </div>
            </Panel>
        );
    }

    // State 4: Empty (no positions)
    if (!positions || positions.length === 0) {
        return (
            <Panel title="Positions" description="DeFi protocol positions">
                <EmptyState
                    title="No active positions"
                    body="Liquidity positions from ETCswap and other protocols will appear here."
                />
            </Panel>
        );
    }

    // State 5: Data (positions with balances)
    return (
        <Panel title="Positions" description="DeFi protocol positions">
            <div className="space-y-3">
                {positions.map((position) => (
                    <PositionCard
                        key={position.lpTokenAddress}
                        position={position}
                        chainId={chainId}
                    />
                ))}
            </div>
        </Panel>
    );
}
