"use client";

import { ReactNode, useMemo, useSyncExternalStore } from "react";
import { useChainId, useConnections } from "wagmi";
import { Panel } from "@/components/ui/Panel";
import { CHAINS_BY_ID, DEFAULT_ACTIVE_CHAIN_ID } from "@/lib/networks/registry";
import { getActiveChainId, subscribeWorkspace } from "@/lib/state/workspace";

export function RequirementGate({ children }: { children: ReactNode }) {
    const connections = useConnections();
    const walletChainId = useChainId();

    const isConnected = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" && acct.length > 0;
    }, [connections]);

    const activeChainId = useSyncExternalStore(
        subscribeWorkspace,
        getActiveChainId,
        () => DEFAULT_ACTIVE_CHAIN_ID
    );

    if (!isConnected) {
        return (
            <Panel title="Connection" description="A connected wallet is required to access this surface.">
                <div className="text-sm text-white/65">Connect your wallet to continue.</div>
            </Panel>
        );
    }

    if (walletChainId !== activeChainId) {
        const active = CHAINS_BY_ID[activeChainId];
        const connected = CHAINS_BY_ID[walletChainId];

        return (
            <Panel title="Network mismatch" description="Connected network does not match the active network.">
                <div className="text-sm text-white/65">
                    Connected:{" "}
                    <span className="text-white/85">{connected?.name ?? `Chain ${walletChainId}`}</span>
                    <span className="text-white/35"> • </span>
                    Active:{" "}
                    <span className="text-white/85">{active?.name ?? `Chain ${activeChainId}`}</span>
                </div>
                <div className="mt-2 text-sm text-white/55">
                    Switch your wallet to the active network to proceed.
                </div>
            </Panel>
        );
    }

    return <>{children}</>;
}
