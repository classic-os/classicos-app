"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function WalletConnector() {
    const { address, isConnected } = useAccount();
    const { connect, isPending, error } = useConnect();
    const { disconnect } = useDisconnect();

    const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

    return (
        <div className="flex items-center gap-2">
            {error ? (
                <span className="hidden md:inline text-xs text-[rgb(var(--bad))]">
                    {error.message.slice(0, 64)}
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
