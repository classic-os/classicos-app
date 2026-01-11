"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";

import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequirementGate } from "@/components/ui/RequirementGate";

import { MiningPanel } from "@/components/produce/MiningPanel";
import { StakingPanel } from "@/components/produce/StakingPanel";

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
                    title="No production mode available"
                    body="The active network does not support mining or staking through ClassicOS."
                />
            ) : (
                <>
                    {mode === "mine" && (
                        <div className="flex gap-3 text-xs">
                            <Link href="/produce/mining" className="text-white/70 underline hover:text-white">
                                Mining
                            </Link>
                        </div>
                    )}
                    {mode === "stake" && (
                        <div className="flex gap-3 text-xs">
                            <Link href="/produce/staking" className="text-white/70 underline hover:text-white">
                                Staking
                            </Link>
                        </div>
                    )}

                    <RequirementGate>
                        {mode === "mine" && <MiningPanel />}
                        {mode === "stake" && <StakingPanel />}
                        <ExternalObservability ecosystem={ecosystem} />
                    </RequirementGate>
                </>
            )}
        </div>
    );
}
