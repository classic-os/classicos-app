"use client";

import { useMemo, useSyncExternalStore } from "react";

import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequirementGate } from "@/components/ui/RequirementGate";

import { getEcosystem } from "@/lib/ecosystems/registry";
import { getActiveChainId, subscribeWorkspace } from "@/lib/state/workspace";

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
                    title="Markets adapters not available yet"
                    body="This ecosystem does not have market-formation or DEX adapters wired yet. This module will become available per network as liquidity and protocol surfaces come online."
                />
                {ecosystem.observability.blockExplorer?.url ? (
                    <Panel>
                        <div className="text-sm">
                            Explorer:{" "}
                            <a
                                className="underline"
                                href={ecosystem.observability.blockExplorer.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {ecosystem.observability.blockExplorer.name}
                            </a>
                        </div>
                    </Panel>
                ) : null}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ModuleHeader title="Markets" subtitle={`Active: ${ecosystem.shortName}`} />
            <RequirementGate>
                <Panel>
                    <div className="text-sm opacity-80">Markets adapters are enabled for this ecosystem.</div>
                </Panel>
            </RequirementGate>
        </div>
    );
}
