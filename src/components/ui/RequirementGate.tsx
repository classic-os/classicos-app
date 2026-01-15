"use client";

import { ReactNode, useMemo } from "react";
import { useConnections } from "wagmi";
import { Panel } from "@/components/ui/Panel";
import { CHAINS_BY_ID } from "@/lib/networks/registry";

export function RequirementGate({ children }: { children: ReactNode }) {
    const connections = useConnections();

    // Get the actual chain ID from the connection (not from wagmi config)
    // This allows us to detect unsupported chains that aren't in wagmi config
    const walletChainId = useMemo(() => {
        const first = connections?.[0];
        return first?.chainId;
    }, [connections]);

    const isConnected = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" && acct.length > 0;
    }, [connections]);

    if (!isConnected) {
        return (
            <Panel title="Connection" description="A connected wallet is required to access this surface.">
                <div className="text-sm text-white/65">Connect your wallet to continue.</div>
            </Panel>
        );
    }

    // Only warn if wallet is on an unsupported network
    // (The app now auto-syncs to wallet's chain via useSyncActiveChain hook)
    const isUnsupported = !CHAINS_BY_ID[walletChainId];
    if (isUnsupported) {
        return (
            <Panel title="Unsupported network" description="Your wallet is connected to a network that is not supported by Classic OS.">
                <div className="text-sm text-white/65">
                    Connected to:{" "}
                    <span className="text-white/85">Chain {walletChainId}</span>
                </div>
                <div className="mt-2 text-sm text-white/55">
                    Switch your wallet to a supported network:
                </div>
                <div className="mt-3 space-y-1 text-xs text-white/65">
                    <div>• Ethereum Classic (Chain 61)</div>
                    <div>• Ethereum (Chain 1)</div>
                    <div>• Mordor Testnet (Chain 63)</div>
                    <div>• Sepolia Testnet (Chain 11155111)</div>
                </div>
            </Panel>
        );
    }

    return <>{children}</>;
}
