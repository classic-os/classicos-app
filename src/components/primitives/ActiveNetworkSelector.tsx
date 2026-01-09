"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

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
// - ETC mainnet selected: green
// - ETH mainnet selected: purple
// - Any testnet selected: yellow
function selectedRowClass(net: Network) {
    if (net.kind === "testnet") {
        return "bg-[rgba(255,200,0,0.12)] text-white";
    }
    if (net.anchor === "ETH_POS") {
        return "bg-[rgba(155,81,224,0.18)] text-white"; // ETH purple
    }
    return "bg-[rgba(0,255,136,0.10)] text-white"; // ETC green
}

function selectedBadgeClass(net: Network) {
    if (net.kind === "testnet") return "text-[rgba(255,200,0,0.9)]";
    if (net.anchor === "ETH_POS") return "text-[rgba(180,130,255,0.95)]";
    return "text-[rgb(var(--accent))]";
}

function dotStyle(net: Network) {
    if (net.kind === "testnet") {
        return {
            backgroundColor: "rgba(255,200,0,0.95)",
            boxShadow: "0 0 14px rgba(255,200,0,0.35)",
        };
    }
    if (net.anchor === "ETH_POS") {
        return {
            backgroundColor: "rgba(155,81,224,0.95)",
            boxShadow: "0 0 14px rgba(155,81,224,0.35)",
        };
    }
    return {
        backgroundColor: "rgba(0,255,136,0.95)",
        boxShadow: "0 0 14px rgba(0,255,136,0.30)",
    };
}

export function ActiveNetworkSelector() {
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState<{ top: number; right: number } | null>(null);

    const { isConnected } = useAccount();
    const walletChainId = useChainId();
    const { switchChain, isPending } = useSwitchChain();

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

        if (isConnected && walletChainId !== chainId && switchChain) {
            try {
                await switchChain({ chainId });
            } catch {
                // keep Active set even if wallet switch fails/rejected
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
                title="Select Active Network"
            >
                <span className="text-white/60">Active</span>
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
                                    Active Network
                                </div>
                                <div className="text-[11px] text-white/50">
                                    Selecting a network will also prompt your wallet to switch.
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
                                        const hasTestnets = (testnetsByParent.get(id) ?? []).length > 0;

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

                                                        {/* OS-like accent dot */}
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
                                                                            Testnet • Chain ID {tid}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        <span
                                                                            className={[
                                                                                "text-[11px]",
                                                                                tsel
                                                                                    ? selectedBadgeClass(t)
                                                                                    : "text-white/35",
                                                                            ].join(" ")}
                                                                        >
                                                                            {tsel ? "Active" : "Select"}
                                                                        </span>

                                                                        {/* OS-like accent dot */}
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
