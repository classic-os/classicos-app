import { useEffect, useMemo } from "react";
import { useConnections } from "wagmi";
import { CHAINS_BY_ID } from "@/lib/networks/registry";
import { setActiveChainId, getActiveChainId } from "@/lib/state/workspace";

/**
 * Syncs the active workspace chain to match the connected wallet's chain.
 *
 * When the user switches networks in their wallet or connects a different wallet,
 * the UI automatically updates to match. This ensures the UI always displays data
 * for the network the wallet is actually connected to.
 *
 * Only syncs if:
 * 1. A wallet is connected
 * 2. The wallet is on a supported chain (in CHAINS_BY_ID)
 * 3. The wallet chain differs from the current active chain
 *
 * This prevents the "network mismatch" state where the UI shows one network
 * but the wallet is connected to another.
 */
export function useSyncActiveChain() {
    const connections = useConnections();

    // Get the actual chain ID from the connection (not from wagmi config)
    // This allows us to detect unsupported chains that aren't in wagmi config
    const walletChainId = useMemo(() => {
        return connections?.[0]?.chainId;
    }, [connections]);

    useEffect(() => {
        // Only sync if wallet is connected
        const isConnected = Boolean(connections?.[0]?.accounts?.[0]);
        if (!isConnected) return;

        // Only sync if we have a chain ID
        if (!walletChainId) return;

        // Only sync if wallet is on a supported chain
        const isSupported = Boolean(CHAINS_BY_ID[walletChainId]);
        if (!isSupported) return;

        // Sync active chain to match wallet
        const currentActive = getActiveChainId();
        if (walletChainId !== currentActive) {
            setActiveChainId(walletChainId);
        }
    }, [connections, walletChainId]);
}
