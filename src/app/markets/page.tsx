"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";

import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequirementGate } from "@/components/ui/RequirementGate";

import { AssetsPanel } from "@/components/markets/AssetsPanel";
import { FormationPanel } from "@/components/markets/FormationPanel";
import { LiquidityPanel } from "@/components/markets/LiquidityPanel";

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

export default function MarketsPage() {
    const activeChainId = useSyncExternalStore(
        subscribeWorkspace,
        getActiveChainId,
        () => getActiveChainId()
    );

    const ecosystem = useMemo(() => getEcosystem(activeChainId), [activeChainId]);

    if (!ecosystem.capabilities.markets) {
        return (
            <div className="space-y-6">
                <ModuleHeader title="Markets" subtitle={`Active: ${ecosystem.shortName}`} />
                <EmptyState
                    title="Markets module planned for Phase 2-3"
                    body="DEX aggregation, Brale stablecoin integration, and liquidity access surfaces will be built alongside DeFi Automation features."
                />
                <ExternalObservability ecosystem={ecosystem} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ModuleHeader title="Markets" subtitle={`Active: ${ecosystem.shortName}`} />

            <div className="flex gap-3 text-xs">
                <Link href="/markets/assets" className="text-white/70 underline hover:text-white">
                    Assets
                </Link>
                <Link href="/markets/formation" className="text-white/70 underline hover:text-white">
                    Formation
                </Link>
                <Link href="/markets/liquidity" className="text-white/70 underline hover:text-white">
                    Liquidity
                </Link>
            </div>

            <RequirementGate>
                <AssetsPanel />
                <FormationPanel />
                <LiquidityPanel />
                <ExternalObservability ecosystem={ecosystem} />
            </RequirementGate>
        </div>
    );
}
