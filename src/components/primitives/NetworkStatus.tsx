"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useChainId, useConnections, useSwitchChain } from "wagmi";

import { CHAINS_BY_ID, DEFAULT_ACTIVE_CHAIN_ID } from "@/lib/networks/registry";
import { getActiveChainId, subscribeWorkspace } from "@/lib/state/workspace";

export function NetworkStatus() {
    const connections = useConnections();
    const walletChainId = useChainId();

    // wagmi v3: `switchChain` is deprecated; use mutate/mutateAsync
    const { mutate: switchChain, isPending } = useSwitchChain();

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

    const connected = CHAINS_BY_ID[walletChainId];
    const active = CHAINS_BY_ID[activeChainId];

    const mismatch = isConnected && walletChainId !== activeChainId;

    return (
        <div className="flex items-center gap-2 text-xs text-white/65">
            <span className="text-white/45">Network</span>

            <span
                className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-white/85"
                title={`Connected: ${connected?.name ?? walletChainId}. Active: ${active?.name ?? activeChainId}.`}
            >
                {active?.name ?? `Chain ${activeChainId}`}
            </span>

            {mismatch ? (
                <button
                    onClick={() => switchChain({ chainId: activeChainId })}
                    disabled={isPending}
                    className="rounded-md border border-[rgba(255,200,0,0.35)] bg-[rgba(255,200,0,0.10)] px-2 py-1 text-[11px] text-white/85 transition hover:bg-[rgba(255,200,0,0.14)] disabled:opacity-60"
                    title={`Wallet is on ${connected?.name ?? walletChainId}. Click to switch to ${active?.name ?? activeChainId}.`}
                >
                    Switch wallet
                </button>
            ) : null}
        </div>
    );
}
