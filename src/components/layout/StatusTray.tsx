"use client";

import { useSyncExternalStore } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { CHAINS_BY_ID, DEFAULT_ACTIVE_CHAIN_ID } from "@/lib/networks/registry";
import { getActiveChainId, subscribeWorkspace } from "@/lib/state/workspace";

export function StatusTray() {
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
        <div className="fixed bottom-4 right-4 z-[9997] hidden md:block">
            <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-black/55 px-3 py-2 text-xs text-white/80 shadow-[0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur">
                {/* Wallet */}
                <div className="flex items-center gap-2">
                    <span className="text-white/50">Wallet</span>
                    <span className="text-white/85">
                        {isConnected ? shortAddr : "Disconnected"}
                    </span>
                </div>

                <div className="h-4 w-px bg-white/10" />

                {/* Network */}
                <div className="flex items-center gap-2">
                    <span className="text-white/50">Connected</span>
                    <span className="text-white/85">
                        {isConnected
                            ? connectedChain?.name ?? `Chain ${walletChainId}`
                            : "—"}
                    </span>
                </div>

                {/* Mismatch */}
                {mismatch ? (
                    <>
                        <div className="h-4 w-px bg-white/10" />
                        <button
                            onClick={() => switchChain({ chainId: activeChainId })}
                            disabled={isPending}
                            className="rounded-lg border border-[rgba(255,200,0,0.35)] bg-[rgba(255,200,0,0.10)] px-2 py-1 text-[11px] text-white transition hover:bg-[rgba(255,200,0,0.14)] disabled:opacity-60"
                            title={`Active: ${activeChain?.name ?? activeChainId}. Click to switch wallet.`}
                        >
                            Wrong network → Switch
                        </button>
                    </>
                ) : null}
            </div>
        </div>
    );
}
