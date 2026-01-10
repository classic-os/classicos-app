"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useChainId, useConnections, useSwitchChain } from "wagmi";
import { themeForChainId } from "@/lib/networks/theme";

import {
    CHAINS_BY_ID,
    NETWORKS,
    DEFAULT_ACTIVE_CHAIN_ID,
    type Network,
} from "@/lib/networks/registry";

import {
    getActiveChainId,
    setActiveChainId,
    getShowTestnets,
    subscribeWorkspace,
} from "@/lib/state/workspace";

function splitNetworks(showTestnets: boolean) {
    const mainnets: Network[] = [];
    const testnetsByParent = new Map<number, Network[]>();

    for (const net of NETWORKS) {
        if (net.kind === "mainnet") {
            mainnets.push(net);
        } else if (net.kind === "testnet") {
            if (!showTestnets) continue;
            const parent = net.parentChainId ?? -1;
            const list = testnetsByParent.get(parent) ?? [];
            list.push(net);
            testnetsByParent.set(parent, list);
        } else {
            // L2: treat as selectable for now
            mainnets.push(net);
        }
    }

    return { mainnets, testnetsByParent };
}

// Visual language:
// - Active network uses global --accent
// - Testnets always yellow
function selectedRowClass(net: Network) {
    if (net.kind === "testnet") return "bg-[rgba(255,200,0,0.12)] text-white";
    return "bg-white/[0.05] text-white";
}

function selectedBadgeClass(net: Network) {
    if (net.kind === "testnet") return "text-[rgba(255,200,0,0.9)]";
    return "text-[rgb(var(--accent))]";
}

function dotStyle(net: Network) {
    // Testnets stay yellow (environmental warning)
    if (net.kind === "testnet") {
        return {
            backgroundColor: "rgba(255,200,0,0.95)",
            boxShadow: "0 0 14px rgba(255,200,0,0.35)",
        } as const;
    }

    // Mainnets & L2s: use network family theme (ETH purple, ETC green, etc)
    const t = themeForChainId(net.chain.id);
    const rgb = t.accentRgb;

    return {
        backgroundColor: `rgb(${rgb})`,
        boxShadow: `0 0 14px ${t.accentGlow}`,
    } as const;
}

export function ActiveNetworkSelector() {
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState<{ top: number; right: number } | null>(null);

    const connections = useConnections();
    const walletChainId = useChainId();

    // wagmi v3: `switchChain` is deprecated; use mutateAsync
    const { mutateAsync: switchChainAsync, isPending } = useSwitchChain();

    const isConnected = Boolean(connections?.[0]?.accounts?.[0]);

    const activeChainId = useSyncExternalStore(
        subscribeWorkspace,
        getActiveChainId,
        () => DEFAULT_ACTIVE_CHAIN_ID
    );

    const showTestnets = useSyncExternalStore(
        subscribeWorkspace,
        getShowTestnets,
        () => false
    );

    const activeChain = CHAINS_BY_ID[activeChainId];

    const { mainnets, testnetsByParent } = useMemo(
        () => splitNetworks(showTestnets),
        [showTestnets]
    );

    const openMenu = () => {
        const rect = btnRef.current?.getBoundingClientRect();
        if (rect) {
            setPos({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });
        } else {
            setPos({ top: 56, right: 16 });
        }
        setOpen(true);
    };

    const closeMenu = () => setOpen(false);

    const toggleMenu = () => {
        if (open) closeMenu();
        else openMenu();
    };

    const select = async (chainId: number) => {
        setActiveChainId(chainId);

        // If connected, attempt wallet switch as a convenience.
        // Active selection remains even if user rejects the wallet prompt.
        if (isConnected && walletChainId !== chainId) {
            try {
                await switchChainAsync({ chainId });
            } catch {
                // ignore
            }
        }

        closeMenu();
    };

    return (
        <div className="relative hidden md:block">
            <button
                ref={btnRef}
                onClick={toggleMenu}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-60"
                aria-expanded={open}
                title="Select active network"
            >
                <span className="text-white/60">Network</span>
                <span className="text-white/90">
                    {activeChain?.name ?? `Chain ${activeChainId}`}
                </span>
                <span className="text-white/40">{isPending ? "…" : "▾"}</span>
            </button>

            {open && pos && typeof document !== "undefined"
                ? createPortal(
                    <>
                        <button
                            aria-label="Close"
                            onClick={closeMenu}
                            className="fixed inset-0 z-[9998] cursor-default"
                        />

                        <div
                            className="fixed z-[9999] w-[320px] overflow-hidden rounded-xl border border-white/12 bg-black/90 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur"
                            style={{ top: pos.top, right: pos.right }}
                        >
                            <div className="border-b border-white/10 px-3 py-2">
                                <div className="text-xs font-semibold text-white/85">
                                    Workspace network
                                </div>
                                <div className="text-[11px] text-white/50">
                                    Sets the active network. If a wallet is connected, you&apos;ll be prompted to switch.
                                </div>
                            </div>

                            <div className="p-2">
                                <div className="px-2 pb-1 pt-2 text-[11px] font-semibold text-white/60">
                                    Mainnets
                                </div>

                                <div className="space-y-1">
                                    {mainnets.map((m) => {
                                        const id = m.chain.id;
                                        const selected = activeChainId === id;
                                        const hasTestnets =
                                            (testnetsByParent.get(id) ?? []).length > 0;

                                        return (
                                            <div
                                                key={id}
                                                className="rounded-lg border border-white/10 bg-white/[0.03]"
                                            >
                                                <button
                                                    onClick={() => select(id)}
                                                    disabled={isPending}
                                                    className={[
                                                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs transition disabled:opacity-60",
                                                        selected
                                                            ? selectedRowClass(m)
                                                            : "hover:bg-white/[0.06] text-white/85",
                                                    ].join(" ")}
                                                >
                                                    <div className="min-w-0">
                                                        <div className="truncate font-semibold">{m.chain.name}</div>
                                                        <div className="truncate text-[11px] text-white/50">
                                                            Chain ID {id}
                                                            {hasTestnets && showTestnets ? " • Testnets available" : ""}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={[
                                                                "text-[11px]",
                                                                selected ? selectedBadgeClass(m) : "text-white/40",
                                                            ].join(" ")}
                                                        >
                                                            {selected ? "Active" : "Select"}
                                                        </span>

                                                        <span
                                                            className={[
                                                                "h-2 w-2 rounded-full border border-white/15",
                                                                selected ? "opacity-100" : "opacity-70",
                                                            ].join(" ")}
                                                            style={dotStyle(m)}
                                                            aria-hidden="true"
                                                        />
                                                    </div>
                                                </button>

                                                {showTestnets && hasTestnets ? (
                                                    <div className="border-t border-white/10 p-1">
                                                        {(testnetsByParent.get(id) ?? []).map((t) => {
                                                            const tid = t.chain.id;
                                                            const tsel = activeChainId === tid;

                                                            return (
                                                                <button
                                                                    key={tid}
                                                                    onClick={() => select(tid)}
                                                                    disabled={isPending}
                                                                    className={[
                                                                        "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-xs transition disabled:opacity-60",
                                                                        tsel
                                                                            ? selectedRowClass(t)
                                                                            : "hover:bg-white/[0.06] text-white/80",
                                                                    ].join(" ")}
                                                                >
                                                                    <div className="min-w-0">
                                                                        <div className="truncate">{t.chain.name}</div>
                                                                        <div className="truncate text-[11px] text-white/45">
                                                                            Test environment • Chain ID {tid}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        <span
                                                                            className={[
                                                                                "text-[11px]",
                                                                                tsel ? selectedBadgeClass(t) : "text-white/40",
                                                                            ].join(" ")}
                                                                        >
                                                                            {tsel ? "Active" : "Select"}
                                                                        </span>

                                                                        <span
                                                                            className={[
                                                                                "h-2 w-2 rounded-full border border-white/15",
                                                                                tsel ? "opacity-100" : "opacity-70",
                                                                            ].join(" ")}
                                                                            style={dotStyle(t)}
                                                                            aria-hidden="true"
                                                                        />
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                ) : null}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>,
                    document.body
                )
                : null}
        </div>
    );
}
