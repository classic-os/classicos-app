"use client";

import { useMemo, useSyncExternalStore } from "react";

import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequirementGate } from "@/components/ui/RequirementGate";

import { getEcosystem } from "@/lib/ecosystems/registry";
import { getActiveChainId, subscribeWorkspace } from "@/lib/state/workspace";

function modeLabel(mode: "mine" | "stake" | "none") {
    if (mode === "mine") return "Mining (Proof-of-Work)";
    if (mode === "stake") return "Staking (Proof-of-Stake)";
    return "—";
}

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
                subtitle={`Active: ${ecosystem.shortName} • Mode: ${modeLabel(mode)}`}
            />

            {mode === "none" ? (
                <EmptyState
                    title="Produce not supported on this network"
                    body="This network does not expose a production mode in the current registry."
                />
            ) : (
                <RequirementGate>
                    <Panel>
                        <EmptyState
                            title="Production workflows not registered"
                            body="This network defines a production mode, but no production adapters are registered yet."
                        />
                    </Panel>
                </RequirementGate>
            )}
        </div>
    );
}
