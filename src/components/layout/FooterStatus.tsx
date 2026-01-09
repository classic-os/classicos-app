"use client";

import { useSyncExternalStore } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { CHAINS_BY_ID, DEFAULT_ACTIVE_CHAIN_ID } from "@/lib/networks/registry";
import { getActiveChainId, subscribeWorkspace } from "@/lib/state/workspace";

export function FooterStatus() {
    const { isConnected, address } = useAccount();
    const walletChainId = useChainId();
    const { switchChain, isPending } = useSwitchChain();

    const activeChainId = useSyncExternalStore(
        subscribeWorkspace,
        getActiveChainId,
        () => DEFAULT_ACTIVE_CHAIN_ID
    );

    const connectedChain = CHAINS_BY_ID[walletChainId];
    const activeChain = CHAINS_BY_ID[activeChainId];

    const mismatch = isConnected && walletChainId !== activeChainId;
    const shortAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

    return (
        <div className="flex items-center gap-3 text-white/40">
            <div className="flex items-center gap-2">
                <span className="text-white/35">Wallet</span>
                <span className="text-white/65">{isConnected ? shortAddr : "Disconnected"}</span>
            </div>

            <span className="text-white/20">•</span>

            <div className="flex items-center gap-2">
                <span className="text-white/35">Connected</span>
                <span className="text-white/65">
                    {isConnected ? (connectedChain?.name ?? `Chain ${walletChainId}`) : "—"}
                </span>
            </div>

            {mismatch ? (
                <>
                    <span className="text-white/20">•</span>
                    <button
                        onClick={() => switchChain({ chainId: activeChainId })}
                        disabled={isPending}
                        className="rounded-md border border-[rgba(255,200,0,0.35)] bg-[rgba(255,200,0,0.10)] px-2 py-1 text-[11px] text-white/85 transition hover:bg-[rgba(255,200,0,0.14)] disabled:opacity-60"
                        title={`Active: ${activeChain?.name ?? activeChainId}. Click to switch wallet.`}
                    >
                        Wrong network → Switch
                    </button>
                </>
            ) : null}
        </div>
    );
}
