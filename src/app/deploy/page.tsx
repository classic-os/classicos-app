"use client";

import { useMemo, useSyncExternalStore } from "react";

import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequirementGate } from "@/components/ui/RequirementGate";

import { getEcosystem } from "@/lib/ecosystems/registry";
import { getActiveChainId, subscribeWorkspace } from "@/lib/state/workspace";

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
                    title="Deploy not supported on this network"
                    body="No deployment surfaces are registered for the active network."
                />
                {ecosystem.observability.blockExplorer?.url ? (
                    <Panel title="Observability" description="External network surface">
                        <div className="text-sm text-white/70">
                            Block explorer:{" "}
                            <a
                                className="underline text-white/85"
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
            <ModuleHeader title="Deploy" subtitle={`Active: ${ecosystem.shortName}`} />
            <RequirementGate>
                <Panel>
                    <div className="text-sm text-white/70">Deploy surfaces are available for this network.</div>
                </Panel>
            </RequirementGate>
        </div>
    );
}
