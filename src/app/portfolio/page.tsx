"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";

import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequirementGate } from "@/components/ui/RequirementGate";

import { BalancesPanel } from "@/components/portfolio/BalancesPanel";
import { PositionsPanel } from "@/components/portfolio/PositionsPanel";
import { ActivityPanel } from "@/components/portfolio/ActivityPanel";

import { getEcosystem } from "@/lib/ecosystems/registry";
import { getActiveChainId, subscribeWorkspace } from "@/lib/state/workspace";

type Ecosystem = ReturnType<typeof getEcosystem>;

function ExternalObservability({ ecosystem }: { ecosystem: Ecosystem }) {
    const explorer = ecosystem.observability.blockExplorer;
    if (!explorer?.url) return null;

    return (
        <Panel title="Observability" description="External network surface">
            <div className="text-sm text-white/70">
                Block explorer:{" "}
                <a className="underline text-white/85" href={explorer.url} target="_blank" rel="noreferrer">
                    {explorer.name}
                </a>
            </div>
        </Panel>
    );
}

export default function PortfolioPage() {
    const activeChainId = useSyncExternalStore(subscribeWorkspace, getActiveChainId, () => getActiveChainId());
    const ecosystem = useMemo(() => getEcosystem(activeChainId), [activeChainId]);

    if (!ecosystem.capabilities.portfolio) {
        return (
            <div className="space-y-6">
                <ModuleHeader
                    title="Portfolio"
                    subtitle={<span suppressHydrationWarning>Active: {ecosystem.shortName}</span>}
                />
                <EmptyState
                    title="Portfolio read-only surfaces in development (Phase 1)"
                    body="Unified DeFi observation across protocols is being built. Portfolio serves as the foundation for Deploy strategy execution."
                />
                <ExternalObservability ecosystem={ecosystem} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ModuleHeader
                title="Portfolio"
                subtitle={<span suppressHydrationWarning>Active: {ecosystem.shortName}</span>}
            />

            <div className="flex gap-3 text-xs">
                <Link href="/portfolio/balances" className="text-white/70 underline hover:text-white">
                    Balances
                </Link>
                <Link href="/portfolio/positions" className="text-white/70 underline hover:text-white">
                    Positions
                </Link>
                <Link href="/portfolio/activity" className="text-white/70 underline hover:text-white">
                    Activity
                </Link>
            </div>

            <RequirementGate>
                <BalancesPanel />
                <PositionsPanel />
                <ActivityPanel />
                <ExternalObservability ecosystem={ecosystem} />
            </RequirementGate>
        </div>
    );
}
