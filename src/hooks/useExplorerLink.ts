import { useMemo } from "react";
import { useChainId, useConnections } from "wagmi";
import { getAddressExplorerUrl, getExplorerName } from "@/lib/portfolio/adapters/explorer-links";

/**
 * Hook to get explorer link for the connected wallet address.
 *
 * Returns null values if wallet not connected or no explorer configured.
 *
 * @returns Object with url and explorerName (both nullable)
 */
export function useExplorerLink() {
    const connections = useConnections();
    const chainId = useChainId();

    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    const isConnected = Boolean(address);

    if (!isConnected || !address) {
        return {
            url: null,
            explorerName: null,
        };
    }

    return {
        url: getAddressExplorerUrl(address, chainId),
        explorerName: getExplorerName(chainId),
    };
}
