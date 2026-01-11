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

export default function StakingPage() {
    const activeChainId = useSyncExternalStore(subscribeWorkspace, getActiveChainId, () => getActiveChainId());
    const ecosystem = useMemo(() => getEcosystem(activeChainId), [activeChainId]);
    const mode = ecosystem.capabilities.produce;

    if (mode !== "stake") {
        return (
            <div className="space-y-6">
                <ModuleHeader title="Produce" subtitle={`Active: ${ecosystem.shortName}`} />
                <EmptyState
                    title="No production mode available"
                    body="The active network does not support mining or staking through ClassicOS."
                />
                <ExternalObservability ecosystem={ecosystem} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ModuleHeader title="Produce" subtitle={`Active: ${ecosystem.shortName}`} />
            
            <Link href="/produce" className="text-xs text-white/70 underline hover:text-white">
                ← Back to Produce
            </Link>

            <RequirementGate>
                <Panel title="Staking" description="Protocol-native capital creation (PoS)">
                    <EmptyState
                        title="Staking not configured"
                        body="Staking and delegation surfaces will appear here when supported."
                    />
                </Panel>
                <ExternalObservability ecosystem={ecosystem} />
            </RequirementGate>
        </div>
    );
}
