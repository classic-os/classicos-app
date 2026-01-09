import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import type { Chain } from "viem";
import { ethereumClassic, mordor } from "@/lib/chain/chains";

type NonEmptyChains = readonly [Chain, ...Chain[]];

export function makeWagmiConfig(testnetsEnabled: boolean) {
    const chains = (testnetsEnabled
        ? [ethereumClassic, mordor]
        : [ethereumClassic]) as NonEmptyChains;

    return createConfig({
        chains,
        connectors: [
            injected({
                shimDisconnect: true,
            }),
        ],
        transports: {
            [ethereumClassic.id]: http(ethereumClassic.rpcUrls.default.http[0]),
            ...(testnetsEnabled
                ? { [mordor.id]: http(mordor.rpcUrls.default.http[0]) }
                : {}),
        },
        ssr: true,
    });
}
