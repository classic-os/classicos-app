// src/lib/ecosystems/registry.ts
//
// Ecosystem Registry (v0.1)
// - Registry-driven capabilities (truthful per-network)
// - Observability surfaces are first-class (explorer, dashboards, charts, indexers)
// - Derives chain identity + explorer from lib/networks/registry.ts (single source of truth)
//
// Pages/modules should call getEcosystem(activeChainId) and render capability-driven UI.

import type { NetworkFamilyKey, NetworkKind } from "../networks/registry";
import { CHAINS_BY_ID, NETWORKS } from "../networks/registry";

export type EcosystemId =
    | "etc-mainnet"
    | "eth-mainnet"
    | "etc-mordor"
    | "eth-sepolia"
    | "unknown";

export type ProduceMode = "mine" | "stake" | "none";

export type EcosystemCapabilities = {
    // entry / production mode
    produce: ProduceMode;

    // core modules
    deploy: boolean;
    markets: boolean;
    portfolio: boolean;
    monitoring: boolean;

    // future-friendly: feature flags for sub-capabilities
    flags?: Record<string, boolean>;
};

export type Link = {
    name: string;
    url?: string;
};

export type ObservabilitySurfaces = {
    blockExplorer?: Link;
    portfolioIndexers?: Link[];
    dashboards?: Link[];
    charts?: Link[];
};

export type ProtocolAdapters = {
    dexes?: Link[];
    lending?: Link[];
    launchpads?: Link[];
    bridges?: Link[];
    oracles?: Link[];
};

export type Ecosystem = {
    id: EcosystemId;
    chainId: number;

    // classification & grouping
    family: NetworkFamilyKey;
    kind: NetworkKind;

    // UI strings
    label: string;
    shortName: string;
    description?: string;

    capabilities: EcosystemCapabilities;
    observability: ObservabilitySurfaces;
    protocols: ProtocolAdapters;
};

export type EcosystemRegistry = Record<number, Ecosystem>;

/**
 * Helper: derive explorer link from your Chain registry.
 */
function explorerLink(chainId: number): Link | undefined {
    const chain = CHAINS_BY_ID[chainId];
    const be = chain?.blockExplorers?.default;
    if (!be) return undefined;
    return { name: be.name, url: be.url };
}

/**
 * Helper: map chainId to a stable EcosystemId for v0.1.
 */
function ecosystemIdFor(chainId: number): EcosystemId {
    switch (chainId) {
        case 61:
            return "etc-mainnet";
        case 1:
            return "eth-mainnet";
        case 63:
            return "etc-mordor";
        case 11155111:
            return "eth-sepolia";
        default:
            return "unknown";
    }
}

/**
 * Capability truth table (v0.1):
 * Keep these honest. If a module is only a shell/empty state, keep it false.
 *
 * You can flip these to true incrementally as adapters/surfaces land.
 */
function capabilitiesFor(chainId: number, family: NetworkFamilyKey, kind: NetworkKind): EcosystemCapabilities {
    const isTestnet = kind === "testnet";

    // Produce mode is derived from the network family (ETC PoW = mine, ETH PoS = stake)
    const produce: ProduceMode =
        family === "ETC_POW" ? "mine" : family === "ETH_POS" ? "stake" : "none";

    return {
        produce,

        // v0.1: default false until adapters/surfaces exist
        deploy: false,
        markets: false,
        portfolio: true, // TEMPORARY: Enabled for Session 1 testing
        monitoring: false,

        flags: {
            isTestnet,
            // explicit for UI copy or iconography
            produceMine: produce === "mine",
            produceStake: produce === "stake",
        },
    };
}

/**
 * Optional: friendly descriptions per ecosystem id.
 * (Purely UI copy; doesn’t affect capability truth.)
 */
function descriptionFor(id: EcosystemId): string | undefined {
    switch (id) {
        case "etc-mainnet":
            return "Ethereum Classic mainnet. Proof-of-Work production with an emerging on-chain economic stack.";
        case "etc-mordor":
            return "Ethereum Classic test environment for transactions, UX validation, and adapter development.";
        case "eth-mainnet":
            return "Ethereum mainnet. Proof-of-Stake production with mature protocol and liquidity surfaces.";
        case "eth-sepolia":
            return "Ethereum test environment for transactions, UX validation, and adapter development.";
        default:
            return "No ecosystem registry entry exists for this network yet.";
    }
}

/**
 * Build registry from NETWORKS so chain identity + grouping stays canonical.
 */
export const ECOSYSTEMS: EcosystemRegistry = Object.fromEntries(
    NETWORKS.map((n) => {
        const id = ecosystemIdFor(n.chain.id);
        const capabilities = capabilitiesFor(n.chain.id, n.family, n.kind);

        const ecosystem: Ecosystem = {
            id,
            chainId: n.chain.id,
            family: n.family,
            kind: n.kind,

            label: n.chain.name,
            shortName: n.shortName,
            description: descriptionFor(id),

            capabilities,
            observability: {
                blockExplorer: explorerLink(n.chain.id),
                dashboards: [],
                charts: [],
                portfolioIndexers: [],
            },
            protocols: {
                dexes: [],
                lending: [],
                launchpads: [],
                bridges: [],
                oracles: [],
            },
        };

        return [n.chain.id, ecosystem] as const;
    })
);

const UNKNOWN_ECOSYSTEM: Ecosystem = {
    id: "unknown",
    chainId: -1,
    family: "ETC_POW",
    kind: "mainnet",
    label: "Unknown Network",
    shortName: "Unknown",
    description: descriptionFor("unknown"),
    capabilities: {
        produce: "none",
        deploy: false,
        markets: false,
        portfolio: false,
        monitoring: false,
        flags: { unknown: true },
    },
    observability: {
        blockExplorer: { name: "Explorer" },
        dashboards: [],
        charts: [],
        portfolioIndexers: [],
    },
    protocols: {
        dexes: [],
        lending: [],
        launchpads: [],
        bridges: [],
        oracles: [],
    },
};

/**
 * Primary accessor: modules/pages should call this and render truthfully.
 */
export function getEcosystem(chainId: number | undefined | null): Ecosystem {
    if (!chainId) return UNKNOWN_ECOSYSTEM;
    return ECOSYSTEMS[chainId] ?? { ...UNKNOWN_ECOSYSTEM, chainId };
}

export function listEcosystems(): Ecosystem[] {
    return Object.values(ECOSYSTEMS);
}

export function getEcosystemCapabilities(chainId: number | undefined | null): EcosystemCapabilities {
    return getEcosystem(chainId).capabilities;
}

export function getProduceMode(chainId: number | undefined | null): ProduceMode {
    return getEcosystemCapabilities(chainId).produce;
}

export function supportsCapability(
    chainId: number | undefined | null,
    key: keyof Omit<EcosystemCapabilities, "produce" | "flags">
): boolean {
    const caps = getEcosystemCapabilities(chainId);
    return Boolean(caps[key]);
}
