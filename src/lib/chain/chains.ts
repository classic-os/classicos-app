import type { Chain } from "viem";

export const ethereumClassic: Chain = {
    id: 61,
    name: "Ethereum Classic",
    nativeCurrency: { name: "ETC", symbol: "ETC", decimals: 18 },
    rpcUrls: {
        default: { http: ["https://etc.rivet.link"] },
        public: { http: ["https://etc.rivet.link"] },
    },
    blockExplorers: {
        default: { name: "Blockscout", url: "https://etc.blockscout.com" },
    },
};

export const mordor: Chain = {
    id: 63,
    name: "Mordor Testnet",
    nativeCurrency: { name: "METC", symbol: "METC", decimals: 18 },
    rpcUrls: {
        default: { http: ["https://rpc.mordor.etccooperative.org"] },
        public: { http: ["https://rpc.mordor.etccooperative.org"] },
    },
    blockExplorers: {
        default: { name: "Blockscout", url: "https://etc-mordor.blockscout.com" },
    },
    testnet: true,
};

export const CHAIN_IDS = { ETC: 61, MORDOR: 63 } as const;
