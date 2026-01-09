"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { CHAIN_IDS, ethereumClassic, mordor } from "@/lib/chain/chains";
import { getTestnetsEnabled, setTestnetsEnabled } from "@/lib/state/testnets";

export function NetworkStatus() {
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain, isPending } = useSwitchChain();

    const testnetsEnabled = typeof window === "undefined" ? false : getTestnetsEnabled();

    if (!isConnected) {
        return (
            <div className="hidden md:inline-flex items-center rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/70">
                Network: —
            </div>
        );
    }

    const isETC = chainId === CHAIN_IDS.ETC;
    const isMordor = chainId === CHAIN_IDS.MORDOR;

    if (isETC) {
        return (
            <div className="hidden md:inline-flex items-center rounded-lg border border-[rgba(0,255,136,0.25)] bg-[rgba(0,255,136,0.08)] px-3 py-2 text-xs text-white">
                ETC Mainnet
            </div>
        );
    }

    if (isMordor) {
        if (!testnetsEnabled) {
            return (
                <button
                    onClick={() => {
                        setTestnetsEnabled(true);
                        window.location.reload();
                    }}
                    className="hidden md:inline-flex items-center rounded-lg border border-[rgba(255,200,0,0.35)] bg-[rgba(255,200,0,0.10)] px-3 py-2 text-xs text-white transition hover:bg-[rgba(255,200,0,0.14)]"
                    title="You are on Mordor, but testnets are disabled. Enable testnets to proceed."
                >
                    Testnets disabled — Enable
                </button>
            );
        }

        return (
            <div className="hidden md:inline-flex items-center rounded-lg border border-[rgba(255,200,0,0.35)] bg-[rgba(255,200,0,0.10)] px-3 py-2 text-xs text-white">
                Mordor Testnet
            </div>
        );
    }

    // wrong network
    return (
        <button
            onClick={() => switchChain({ chainId: CHAIN_IDS.ETC })}
            disabled={isPending}
            className="hidden md:inline-flex items-center rounded-lg border border-[rgba(255,200,0,0.35)] bg-[rgba(255,200,0,0.10)] px-3 py-2 text-xs text-white transition hover:bg-[rgba(255,200,0,0.14)] disabled:opacity-60"
            title="Switch to Ethereum Classic to use ClassicOS."
        >
            Wrong network — Switch to ETC
        </button>
    );
}
