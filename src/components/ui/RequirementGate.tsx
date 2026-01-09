"use client";

import { ReactNode } from "react";
import { useAccount, useChainId } from "wagmi";
import { useSyncExternalStore } from "react";
import { Panel } from "@/components/ui/Panel";
import { CHAINS_BY_ID, DEFAULT_ACTIVE_CHAIN_ID } from "@/lib/networks/registry";
import { getActiveChainId, subscribeWorkspace } from "@/lib/state/workspace";

export function RequirementGate({ children }: { children: ReactNode }) {
    const { isConnected } = useAccount();
    const walletChainId = useChainId();

    const activeChainId = useSyncExternalStore(
        subscribeWorkspace,
        getActiveChainId,
        () => DEFAULT_ACTIVE_CHAIN_ID
    );

    if (!isConnected) {
        return (
            <Panel title="Requirements" description="This module requires an active wallet connection.">
                <div className="text-sm text-white/65">Connect your wallet to proceed.</div>
            </Panel>
        );
    }

    if (walletChainId !== activeChainId) {
        const active = CHAINS_BY_ID[activeChainId];
        return (
            <Panel title="Requirements" description="Wrong network.">
                <div className="text-sm text-white/65">
                    Switch your wallet to{" "}
                    <span className="text-white/85">{active?.name ?? `Chain ${activeChainId}`}</span> to
                    proceed.
                </div>
            </Panel>
        );
    }

    return <>{children}</>;
}
