"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";

import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequirementGate } from "@/components/ui/RequirementGate";

import { SourcesPanel } from "@/components/deploy/SourcesPanel";
import { RoutePanel } from "@/components/deploy/RoutePanel";
import { HistoryPanel } from "@/components/deploy/HistoryPanel";

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

export default function DeployPage() {
    const activeChainId = useSyncExternalStore(
        subscribeWorkspace,
        getActiveChainId,
        () => getActiveChainId()
    );

    const ecosystem = useMemo(() => getEcosystem(activeChainId), [activeChainId]);

    if (!ecosystem.capabilities.deploy) {
        return (
            <div className="space-y-6">
                <ModuleHeader title="Deploy" subtitle={`Active: ${ecosystem.shortName}`} />
                <EmptyState
                    title="DeFi Automation coming in Phase 3"
                    body="Strategy builder, position health monitoring, and automated execution will be available after Portfolio observation layer is complete."
                />
                <ExternalObservability ecosystem={ecosystem} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ModuleHeader title="Deploy" subtitle={`Active: ${ecosystem.shortName}`} />

            <div className="flex gap-3 text-xs">
                <Link href="/deploy/sources" className="text-white/70 underline hover:text-white">
                    Sources
                </Link>
                <Link href="/deploy/route" className="text-white/70 underline hover:text-white">
                    Route
                </Link>
                <Link href="/deploy/history" className="text-white/70 underline hover:text-white">
                    History
                </Link>
            </div>

            <RequirementGate>
                <SourcesPanel />
                <RoutePanel />
                <HistoryPanel />
                <ExternalObservability ecosystem={ecosystem} />
            </RequirementGate>
        </div>
    );
}
