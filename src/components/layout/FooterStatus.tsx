"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useConnections, useSwitchChain } from "wagmi";
import { CHAINS_BY_ID, DEFAULT_ACTIVE_CHAIN_ID } from "@/lib/networks/registry";
import { getActiveChainId, subscribeWorkspace } from "@/lib/state/workspace";

function shortAddress(addr?: string) {
    if (!addr) return "";
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function FooterStatus() {
    const connections = useConnections();

    // Get the actual chain ID from the connection (not from wagmi config)
    // This allows us to detect unsupported chains that aren't in wagmi config
    const walletChainId = useMemo(() => {
        return connections?.[0]?.chainId;
    }, [connections]);

    // wagmi v3: `switchChain` is deprecated; use mutate/mutateAsync
    const { mutate: switchChain, isPending } = useSwitchChain();

    const activeChainId = useSyncExternalStore(
        subscribeWorkspace,
        getActiveChainId,
        () => DEFAULT_ACTIVE_CHAIN_ID
    );

    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    const isConnected = Boolean(address);

    const connectedChain = walletChainId ? CHAINS_BY_ID[walletChainId] : undefined;
    const activeChain = CHAINS_BY_ID[activeChainId];

    const mismatch = isConnected && walletChainId && walletChainId !== activeChainId;
    const shortAddr = shortAddress(address);

    return (
        <div className="flex items-center gap-3 text-white/40">
            {/* Wallet */}
            <div className="flex items-center gap-2">
                <span className="text-white/35">Wallet</span>
                <span className="text-white/65">{isConnected ? shortAddr : "Disconnected"}</span>
            </div>

            <span className="text-white/20">•</span>

            {/* Connected */}
            <div className="flex items-center gap-2">
                <span className="text-white/35">Connected</span>
                <span className="text-white/65">
                    {isConnected ? (connectedChain?.name ?? `Chain ${walletChainId}`) : "—"}
                </span>
            </div>

            <span className="text-white/20">•</span>

            {/* Active */}
            <div className="flex items-center gap-2">
                <span className="text-white/35">Active</span>
                <span className="text-white/65">
                    {activeChain?.name ?? `Chain ${activeChainId}`}
                </span>
            </div>

            {/* Mismatch CTA */}
            {mismatch ? (
                <>
                    <span className="text-white/20">•</span>
                    <button
                        onClick={() => switchChain({ chainId: activeChainId })}
                        disabled={isPending}
                        className="rounded-md border border-[rgba(255,200,0,0.35)] bg-[rgba(255,200,0,0.10)] px-2 py-1 text-[11px] text-white/85 transition hover:bg-[rgba(255,200,0,0.14)] disabled:opacity-60"
                        title={`Active: ${activeChain?.name ?? activeChainId}. Click to switch wallet.`}
                    >
                        Network mismatch → Switch
                    </button>
                </>
            ) : null}
        </div>
    );
}
