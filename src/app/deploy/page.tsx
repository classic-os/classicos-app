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
                    title="Deploy adapters not available yet"
                    body="This ecosystem does not have deployment surfaces wired yet. ClassicOS will surface lending, LP, and routing adapters per-network as they’re implemented."
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
            <ModuleHeader title="Deploy" subtitle={`Active: ${ecosystem.shortName}`} />
            <RequirementGate>
                <Panel>
                    <div className="text-sm opacity-80">Deploy adapters are enabled for this ecosystem.</div>
                </Panel>
            </RequirementGate>
        </div>
    );
}
