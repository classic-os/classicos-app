"use client";

import { useSyncExternalStore } from "react";
import { getShowTestnets, setShowTestnets, subscribeWorkspace } from "@/lib/state/workspace";

export function TestnetToggle() {
    const enabled = useSyncExternalStore(subscribeWorkspace, getShowTestnets, () => false);

    const toggle = () => setShowTestnets(!enabled);

    return (
        <button
            onClick={toggle}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-pressed={enabled}
            title={enabled ? "Show test networks" : "Hide test networks"}
        >
            <span className="text-white/60">Testnets</span>
            <span
                className={[
                    "relative h-4 w-8 rounded-full border transition",
                    enabled
                        ? "border-[rgba(0,255,136,0.35)] bg-[rgba(0,255,136,0.20)]"
                        : "border-white/20 bg-black/20",
                ].join(" ")}
            >
                <span
                    className={[
                        "absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full transition",
                        enabled
                            ? "left-4 bg-[rgb(var(--accent))] shadow-[0_0_16px_rgba(0,255,136,0.35)]"
                            : "left-1 bg-white/60",
                    ].join(" ")}
                />
            </span>
        </button>
    );
}
