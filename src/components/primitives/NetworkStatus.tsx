"use client";

import { useSyncExternalStore } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { CHAINS_BY_ID, DEFAULT_ACTIVE_CHAIN_ID } from "@/lib/networks/registry";
import { getActiveChainId, subscribeWorkspace } from "@/lib/state/workspace";

export function NetworkStatus() {
    const { isConnected } = useAccount();
    const walletChainId = useChainId();
    const { switchChain, isPending } = useSwitchChain();

    const activeChainId = useSyncExternalStore(
        subscribeWorkspace,
        getActiveChainId,
        () => DEFAULT_ACTIVE_CHAIN_ID
    );

    if (!isConnected) {
        return (
            <div className="hidden md:inline-flex items-center rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/70">
                Network: —
            </div>
        );
    }

    const connected = CHAINS_BY_ID[walletChainId];
    const active = CHAINS_BY_ID[activeChainId];
    const wrong = walletChainId !== activeChainId;

    if (!wrong) {
        return (
            <div className="hidden md:inline-flex items-center rounded-lg border border-[rgba(0,255,136,0.25)] bg-[rgba(0,255,136,0.08)] px-3 py-2 text-xs text-white">
                {connected?.name ?? `Chain ${walletChainId}`}
            </div>
        );
    }

    return (
        <button
            onClick={() => switchChain({ chainId: activeChainId })}
            disabled={isPending}
            className="hidden md:inline-flex items-center rounded-lg border border-[rgba(255,200,0,0.35)] bg-[rgba(255,200,0,0.10)] px-3 py-2 text-xs text-white transition hover:bg-[rgba(255,200,0,0.14)] disabled:opacity-60"
            title={`Connected: ${connected?.name ?? walletChainId}. Active: ${active?.name ?? activeChainId}.`}
        >
            Wrong network — Switch
        </button>
    );
}
