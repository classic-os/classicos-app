"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";

import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequirementGate } from "@/components/ui/RequirementGate";

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

export default function PositionsPage() {
    const activeChainId = useSyncExternalStore(subscribeWorkspace, getActiveChainId, () => getActiveChainId());
    const ecosystem = useMemo(() => getEcosystem(activeChainId), [activeChainId]);

    if (!ecosystem.capabilities.portfolio) {
        return (
            <div className="space-y-6">
                <ModuleHeader title="Portfolio" subtitle={`Active: ${ecosystem.shortName}`} />
                <EmptyState
                    title="Portfolio not supported on this network"
                    body="No portfolio or position surfaces are registered for the active network."
                />
                <ExternalObservability ecosystem={ecosystem} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ModuleHeader title="Portfolio" subtitle={`Active: ${ecosystem.shortName}`} />

            <Link href="/portfolio" className="text-xs text-white/70 underline hover:text-white">
                ← Back to Portfolio
            </Link>

            <RequirementGate>
                <Panel title="Positions" description="Deployed capital and exposures">
                    <EmptyState
                        title="No active positions"
                        body="Capital deployed through ClassicOS will appear here as positions."
                        actionLabel="Go to Deploy"
                        actionHref="/deploy"
                    />
                </Panel>
                <ExternalObservability ecosystem={ecosystem} />
            </RequirementGate>
        </div>
    );
}
