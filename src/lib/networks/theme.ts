import { CHAINS_BY_ID, NETWORKS } from "@/lib/networks/registry";

export type NetworkTheme = {
    accentRgb: string; // "r g b"
    accentGlow: string; // rgba(...)
    label: string; // short label for UI if desired
};

const ETC_GREEN: NetworkTheme = {
    accentRgb: "0 255 136",
    accentGlow: "rgba(0,255,136,0.35)",
    label: "ETC",
};

const ETH_PURPLE: NetworkTheme = {
    accentRgb: "155 81 224",
    accentGlow: "rgba(155,81,224,0.35)",
    label: "ETH",
};

const TESTNET_YELLOW: NetworkTheme = {
    accentRgb: "255 200 0",
    accentGlow: "rgba(255,200,0,0.35)",
    label: "Test",
};

// Known “families” for v0.1. (Theme should not rely on internal taxonomy names.)
const ETC_FAMILY = new Set<number>([
    61, // ETC mainnet
    63, // Mordor
]);

const ETH_FAMILY = new Set<number>([
    1, // ETH mainnet
    11155111, // Sepolia
]);

function getNetworkKind(chainId: number | undefined | null): "mainnet" | "testnet" | "l2" | "unknown" {
    if (!chainId) return "unknown";
    const net = NETWORKS.find((n) => n.chain.id === chainId);
    return net?.kind ?? "unknown";
}

export function themeForChainId(chainId: number | undefined | null): NetworkTheme {
    if (!chainId) return ETC_GREEN;

    const kind = getNetworkKind(chainId);
    if (kind === "testnet") return TESTNET_YELLOW;

    // If explicitly known, use family theme
    if (ETH_FAMILY.has(chainId)) return ETH_PURPLE;
    if (ETC_FAMILY.has(chainId)) return ETC_GREEN;

    // Fallback: try to infer by name for unknown future additions
    const name = CHAINS_BY_ID[chainId]?.name?.toLowerCase() ?? "";
    if (name.includes("ethereum classic")) return ETC_GREEN;
    if (name.includes("ethereum")) return ETH_PURPLE;

    return ETC_GREEN;
}

export function chainName(chainId: number | undefined | null): string {
    if (!chainId) return "Unknown";
    return CHAINS_BY_ID[chainId]?.name ?? `Chain ${chainId}`;
}
