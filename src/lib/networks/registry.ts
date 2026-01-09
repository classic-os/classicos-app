import type { Chain } from "viem";

export type AnchorKey = "ETC_POW" | "ETH_POS";
export type NetworkKind = "mainnet" | "testnet" | "l2";

export type Network = {
    chain: Chain;
    anchor: AnchorKey;
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
        anchor: "ETC_POW",
        kind: "mainnet",
        shortName: "ETC",
    },
    {
        chain: mordorTestnet,
        anchor: "ETC_POW",
        kind: "testnet",
        parentChainId: etcMainnet.id,
        shortName: "Mordor",
    },
    {
        chain: ethMainnet,
        anchor: "ETH_POS",
        kind: "mainnet",
        shortName: "ETH",
    },
    {
        chain: sepoliaTestnet,
        anchor: "ETH_POS",
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

// Grouping metadata for UI (selector later)
export const ANCHORS: Record<AnchorKey, { title: string; description: string }> = {
    ETC_POW: {
        title: "Ethereum Classic (PoW Anchor)",
        description: "Mining, PoW security, and emerging on-chain economic stack.",
    },
    ETH_POS: {
        title: "Ethereum (PoS Anchor)",
        description: "Liquidity-dense ecosystem with staking and mature protocols.",
    },
};
