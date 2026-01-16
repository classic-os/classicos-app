import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { CHAINS, NETWORKS } from "@/lib/networks/registry";

function firstHttpRpc(n: (typeof NETWORKS)[number]): string | undefined {
    const urls = n.chain.rpcUrls?.default?.http;
    return Array.isArray(urls) && urls.length > 0 ? urls[0] : undefined;
}

export function makeWagmiConfig() {
    const transports = Object.fromEntries(
        NETWORKS.map((n) => {
            const rpc = firstHttpRpc(n);
            // Disable automatic multicall batching for compatibility
            // Some chains (like Mordor) have multicall3 deployed but with compatibility issues
            return [
                n.chain.id,
                rpc
                    ? http(rpc, {
                          batch: false, // Disable automatic call batching
                      })
                    : http(""),
            ];
        })
    );

    return createConfig({
        chains: CHAINS,
        connectors: [
            injected({
                shimDisconnect: true,
            }),
        ],
        transports,
        ssr: true,
    });
}
