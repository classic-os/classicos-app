import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { CHAINS, NETWORKS } from "@/lib/networks/registry";

export function makeWagmiConfig() {
    const transports = Object.fromEntries(
        NETWORKS.map((n) => [n.chain.id, http(n.chain.rpcUrls.default.http[0])])
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
