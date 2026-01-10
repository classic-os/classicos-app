import type { Chain } from "viem";

/**
 * Network grouping used for UI + capability defaults.
 * (Internal concept — keep it out of user-facing copy.)
 */
export type NetworkFamilyKey = "ETC_POW" | "ETH_POS";
export type NetworkKind = "mainnet" | "testnet" | "l2";

export type Network = {
    chain: Chain;
    family: NetworkFamilyKey;
    kind: NetworkKind;
    parentChainId?: number; // testnet or L2 parent
    shortName: string;
};

export const etcMainnet: Chain = {
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

export const mordorTestnet: Chain = {
    id: 63,
    name: "Mordor Testnet",
    nativeCurrency: { name: "mETC", symbol: "METC", decimals: 18 },
    rpcUrls: {
        default: { http: ["https://rpc.mordor.etccooperative.org"] },
        public: { http: ["https://rpc.mordor.etccooperative.org"] },
    },
    blockExplorers: {
        default: { name: "Blockscout", url: "https://etc-mordor.blockscout.com" },
    },
    testnet: true,
};

export const ethMainnet: Chain = {
    id: 1,
    name: "Ethereum",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        // public endpoint for dev use; replace with your preferred provider later
        default: { http: ["https://cloudflare-eth.com"] },
        public: { http: ["https://cloudflare-eth.com"] },
    },
    blockExplorers: {
        default: { name: "Etherscan", url: "https://etherscan.io" },
    },
};

export const sepoliaTestnet: Chain = {
    id: 11155111,
    name: "Sepolia",
    nativeCurrency: { name: "sETH", symbol: "SETH", decimals: 18 },
    rpcUrls: {
        // placeholder; swap to your preferred provider when ready
        default: { http: ["https://rpc.sepolia.org"] },
        public: { http: ["https://rpc.sepolia.org"] },
    },
    blockExplorers: {
        default: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
    },
    testnet: true,
};

export const NETWORKS: Network[] = [
    {
        chain: etcMainnet,
        family: "ETC_POW",
        kind: "mainnet",
        shortName: "ETC",
    },
    {
        chain: mordorTestnet,
        family: "ETC_POW",
        kind: "testnet",
        parentChainId: etcMainnet.id,
        shortName: "Mordor",
    },
    {
        chain: ethMainnet,
        family: "ETH_POS",
        kind: "mainnet",
        shortName: "ETH",
    },
    {
        chain: sepoliaTestnet,
        family: "ETH_POS",
        kind: "testnet",
        parentChainId: ethMainnet.id,
        shortName: "Sepolia",
    },
];

export const CHAINS = NETWORKS.map((n) => n.chain) as [Chain, ...Chain[]];
export const CHAINS_BY_ID: Record<number, Chain> = Object.fromEntries(
    NETWORKS.map((n) => [n.chain.id, n.chain])
);

export const DEFAULT_ACTIVE_CHAIN_ID = etcMainnet.id;

/**
 * Grouping metadata (UI + defaults). Avoid internal jargon in copy.
 */
export const NETWORK_FAMILIES: Record<
    NetworkFamilyKey,
    { title: string; description: string }
> = {
    ETC_POW: {
        title: "Ethereum Classic (Proof-of-Work)",
        description: "Mining-first network with an emerging on-chain economic stack.",
    },
    ETH_POS: {
        title: "Ethereum (Proof-of-Stake)",
        description: "Liquidity-dense ecosystem with mature protocol surfaces.",
    },
};
