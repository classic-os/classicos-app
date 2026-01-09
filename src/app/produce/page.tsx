"use client";

import { useMemo, useSyncExternalStore } from "react";

import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequirementGate } from "@/components/ui/RequirementGate";

import { getEcosystem } from "@/lib/ecosystems/registry";
import { getActiveChainId, subscribeWorkspace } from "@/lib/state/workspace";

export default function ProducePage() {
    const activeChainId = useSyncExternalStore(
        subscribeWorkspace,
        getActiveChainId,
        () => getActiveChainId()
    );

    const ecosystem = useMemo(() => getEcosystem(activeChainId), [activeChainId]);
    const mode = ecosystem.capabilities.produce;

    return (
        <div className="space-y-6">
            <ModuleHeader
                title="Produce"
                subtitle={`Active: ${ecosystem.shortName} • Mode: ${mode === "mine" ? "Mining (PoW)" : mode === "stake" ? "Staking (PoS)" : "Unavailable"
                    }`}
            />

            {mode === "none" ? (
                <EmptyState
                    title="Produce is not available on this network"
                    body="This network has no registered production mode yet."
                />
            ) : (
                <RequirementGate>
                    <Panel>
                        <EmptyState
                            title={mode === "mine" ? "Mining surfaces (coming online)" : "Staking surfaces (coming online)"}
                            body="Phase 1 wires the OS truth layer. Production workflows land incrementally per ecosystem."
                        />
                    </Panel>
                </RequirementGate>
            )}
        </div>
    );
}
