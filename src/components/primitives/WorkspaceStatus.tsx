"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useConnections, useSwitchChain } from "wagmi";

import { DEFAULT_ACTIVE_CHAIN_ID } from "@/lib/networks/registry";
import { chainName, themeForChainId } from "@/lib/networks/theme";
import { getActiveChainId, subscribeWorkspace } from "@/lib/state/workspace";

function shortAddress(addr?: string) {
    if (!addr) return "";
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function dotStyle(kind: "active" | "connected" | "warn", chainId?: number | null) {
    if (kind === "warn") {
        return {
            backgroundColor: "rgba(255,200,0,0.95)",
            boxShadow: "0 0 14px rgba(255,200,0,0.30)",
        } as const;
    }

    if (kind === "connected") {
        const t = themeForChainId(chainId ?? null);
        const rgb = t.accentRgb;
        return {
            backgroundColor: `rgb(${rgb})`,
            boxShadow: `0 0 14px ${t.accentGlow}`,
        } as const;
    }

    return {
        backgroundColor: "rgb(var(--accent))",
        boxShadow: "0 0 14px rgba(0,255,136,0.25)",
    } as const;
}

export function WorkspaceStatus({
    compact = false,
    showWallet = true,
}: {
    compact?: boolean;
    showWallet?: boolean;
}) {
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
    const mismatch = isConnected && walletChainId && walletChainId !== activeChainId;

    const activeLabel = useMemo(() => chainName(activeChainId), [activeChainId]);
    const connectedLabel = useMemo(() => chainName(walletChainId ?? null), [walletChainId]);

    const walletLabel = isConnected ? shortAddress(address) : "Disconnected";

    return (
        <div
            className={[
                "flex items-center gap-2",
                compact ? "text-[11px]" : "text-xs",
            ].join(" ")}
        >
            {/* Wallet (optional — hide in TopBar to avoid duplicating WalletConnector) */}
            {showWallet ? (
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                    <span className="text-white/45">Wallet</span>
                    <span className="text-white/85">{walletLabel}</span>
                </div>
            ) : null}

            {/* Connected network */}
            <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 md:flex">
                <span className="text-white/45">Connected</span>
                <span className="text-white/85">{isConnected ? connectedLabel : "—"}</span>
                <span
                    className="h-2 w-2 rounded-full border border-white/15"
                    style={dotStyle("connected", walletChainId)}
                    aria-hidden="true"
                />
            </div>

            {/* Active network */}
            <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 lg:flex">
                <span className="text-white/45">Active</span>
                <span className="text-white/85">{activeLabel}</span>
                <span
                    className="h-2 w-2 rounded-full border border-white/15"
                    style={dotStyle("active", activeChainId)}
                    aria-hidden="true"
                />
            </div>

            {/* Mismatch action */}
            {mismatch ? (
                <button
                    onClick={() => switchChain({ chainId: activeChainId })}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-lg border border-[rgba(255,200,0,0.35)] bg-[rgba(255,200,0,0.10)] px-3 py-2 text-[11px] text-white/90 transition hover:bg-[rgba(255,200,0,0.14)] disabled:opacity-60"
                    title={`Connected: ${connectedLabel}. Active: ${activeLabel}. Click to switch wallet.`}
                >
                    <span
                        className="h-2 w-2 rounded-full border border-white/15"
                        style={dotStyle("warn")}
                        aria-hidden="true"
                    />
                    Network mismatch
                    <span className="text-white/70">→</span>
                    <span className="font-semibold">Switch</span>
                </button>
            ) : null}
        </div>
    );
}
