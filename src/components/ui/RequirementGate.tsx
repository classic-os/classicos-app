"use client";

import { ReactNode } from "react";
import { useAccount, useChainId } from "wagmi";
import { CHAIN_IDS } from "@/lib/chain/chains";
import { getTestnetsEnabled } from "@/lib/state/testnets";
import { Panel } from "@/components/ui/Panel";

type GateMode = "ETC_ONLY" | "ETC_OR_MORDOR";

export function RequirementGate({
    mode = "ETC_ONLY",
    children,
}: {
    mode?: GateMode;
    children: ReactNode;
}) {
    const { isConnected } = useAccount();
    const chainId = useChainId();

    const testnetsEnabled = typeof window === "undefined" ? false : getTestnetsEnabled();
    const isETC = chainId === CHAIN_IDS.ETC;
    const isMordor = chainId === CHAIN_IDS.MORDOR;

    if (!isConnected) {
        return (
            <Panel title="Requirements" description="This module requires an active wallet connection.">
                <div className="text-sm text-white/65">
                    Connect your wallet to proceed. ClassicOS enforces explicit operational states.
                </div>
            </Panel>
        );
    }

    if (mode === "ETC_ONLY") {
        if (!isETC) {
            return (
                <Panel
                    title="Requirements"
                    description="This module requires Ethereum Classic mainnet."
                >
                    <div className="text-sm text-white/65">
                        You are connected to a non-ETC network. Switch to ETC to proceed.
                    </div>
                </Panel>
            );
        }
    }

    if (mode === "ETC_OR_MORDOR") {
        if (isMordor && !testnetsEnabled) {
            return (
                <Panel title="Requirements" description="Testnets are disabled in this environment.">
                    <div className="text-sm text-white/65">
                        You are on Mordor, but testnets are currently disabled. Enable testnets to proceed.
                    </div>
                </Panel>
            );
        }
        if (!isETC && !isMordor) {
            return (
                <Panel title="Requirements" description="This module requires ETC mainnet or Mordor testnet.">
                    <div className="text-sm text-white/65">
                        Switch to ETC (mainnet) or Mordor (testnet) to proceed.
                    </div>
                </Panel>
            );
        }
    }

    return <>{children}</>;
}
