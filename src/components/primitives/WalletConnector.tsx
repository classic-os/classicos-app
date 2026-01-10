"use client";

import { useMemo } from "react";
import { useConnect, useDisconnect, useConnections } from "wagmi";
import { injected } from "wagmi/connectors";

function shortAddress(addr?: string) {
    if (!addr) return "";
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function WalletConnector() {
    const connections = useConnections();

    // wagmi v3: connect/disconnect use mutate-style APIs
    const { mutate: connect, isPending, error } = useConnect();
    const { mutate: disconnect } = useDisconnect();

    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    const isConnected = Boolean(address);
    const short = shortAddress(address);

    return (
        <div className="flex items-center gap-2">
            {error ? (
                <span className="hidden md:inline text-xs text-[rgb(var(--bad))]">
                    {String(error.message).slice(0, 64)}
                </span>
            ) : null}

            {isConnected ? (
                <button
                    onClick={() => disconnect()}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10 hover:text-white"
                    title={address}
                >
                    {short}
                </button>
            ) : (
                <button
                    onClick={() => connect({ connector: injected({ shimDisconnect: true }) })}
                    disabled={isPending}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-60"
                >
                    {isPending ? "Connecting…" : "Connect"}
                </button>
            )}
        </div>
    );
}
