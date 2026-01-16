import type { Address } from "viem";

/**
 * ETCswap Protocol Contract Addresses
 *
 * Official contract addresses for ETCswap V2 and V3 on Ethereum Classic.
 * Source: https://github.com/etcswap/.github-private/blob/main/profile/README.md
 */

// Chain IDs
export const ETC_MAINNET_CHAIN_ID = 61;
export const MORDOR_TESTNET_CHAIN_ID = 63;

// ============================================================================
// Common Tokens (Same address on both networks)
// ============================================================================

export const WETC_ADDRESS: Address = "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a";
export const USC_ADDRESS: Address = "0xDE093684c796204224BC081f937aa059D903c52a";

// ============================================================================
// ETCswap V2 Contracts (Uniswap V2 Fork)
// ============================================================================

export type ETCswapV2Contracts = {
    factory: Address;
    router: Address;
    multicall: Address;
    examplePool?: Address; // WETC/USC pool
};

export const ETCSWAP_V2_MAINNET: ETCswapV2Contracts = {
    factory: "0x0307cd3D7DA98A29e6Ed0D2137be386Ec1e4Bc9C",
    router: "0x79Bf07555C34e68C4Ae93642d1007D7f908d60F5",
    multicall: "0xB945786D5dB40E79F1c25D937cCAC57ab3718BA1",
    examplePool: "0x8B48dE7cCE180ad32A51d8aB5ab28B27c4787aaf", // WETC/USC
};

export const ETCSWAP_V2_MORDOR: ETCswapV2Contracts = {
    factory: "0x212eE1B5c8C26ff5B2c4c14CD1C54486Fe23ce70",
    router: "0x582A87594c86b204920f9e337537b5Aa1fefC07C",
    multicall: "0x41Fa0143ea4b4d91B41BF23d0A03ed3172725C4B",
    examplePool: "0x0a73dc518791Fa8436939C8a8a08003EC782A509", // WETC/USC
};

// ============================================================================
// ETCswap V3 Contracts (Uniswap V3 Fork - Same addresses on both networks)
// ============================================================================

export type ETCswapV3Contracts = {
    // Core
    factory: Address;
    universalRouter: Address;
    swapRouter02: Address;
    quoterV2: Address;

    // Position Management
    positionManager: Address;
    positionDescriptor: Address;
    descriptorProxy: Address;
    nftDescriptorLibrary: Address;

    // Periphery
    permit2: Address;
    multicallV3: Address;
    tickLens: Address;
    proxyAdmin: Address;

    // Migration & Staking
    migrator: Address;
    staker: Address;
};

// V3 contracts use same addresses on both ETC Mainnet (61) and Mordor Testnet (63)
export const ETCSWAP_V3_CONTRACTS: ETCswapV3Contracts = {
    // Core
    factory: "0x2624E907BcC04f93C8f29d7C7149a8700Ceb8cDC",
    universalRouter: "0x9b676E761040D60C6939dcf5f582c2A4B51025F1",
    swapRouter02: "0xEd88EDD995b00956097bF90d39C9341BBde324d1",
    quoterV2: "0x4d8c163400CB87Cbe1bae76dBf36A09FED85d39B",

    // Position Management
    positionManager: "0x3CEDe6562D6626A04d7502CC35720901999AB699",
    positionDescriptor: "0xBCA1B20B81429cA4ca39AC38a5374A7F41Db2Ed6",
    descriptorProxy: "0x224c3992F98f75314eE790DFd081017673bd0617",
    nftDescriptorLibrary: "0xa47E8033964FbDa1cEEE77191Fc6188898355c0D",

    // Periphery
    permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    multicallV3: "0x1E4282069e4822D5E6Fb88B2DbDE014f3E0625a9",
    tickLens: "0x23B7Bab45c84fA8f68f813D844E8afD44eE8C315",
    proxyAdmin: "0x4823673F7cA96A42c4E69C8953de89f4857E193D",

    // Migration & Staking
    migrator: "0x19B067263c36FA09d06bec71B1E1236573D56C00",
    staker: "0x12775aAf6bD5Aca04F0cCD5969b391314868A7e9",
};

// V3 Constants
export const ETCSWAP_V3_INIT_CODE_HASH =
    "0x7ea2da342810af3c5a9b47258f990aaac829fe1385a1398feb77d0126a85dbef";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get ETCswap V2 contracts for a given chain ID.
 *
 * @param chainId - Chain ID (61 for mainnet, 63 for Mordor)
 * @returns V2 contract addresses or null if not supported
 */
export function getETCswapV2Contracts(chainId: number): ETCswapV2Contracts | null {
    switch (chainId) {
        case ETC_MAINNET_CHAIN_ID:
            return ETCSWAP_V2_MAINNET;
        case MORDOR_TESTNET_CHAIN_ID:
            return ETCSWAP_V2_MORDOR;
        default:
            return null;
    }
}

/**
 * Get ETCswap V3 contracts for a given chain ID.
 *
 * @param chainId - Chain ID (61 for mainnet, 63 for Mordor)
 * @returns V3 contract addresses or null if not supported
 */
export function getETCswapV3Contracts(chainId: number): ETCswapV3Contracts | null {
    switch (chainId) {
        case ETC_MAINNET_CHAIN_ID:
        case MORDOR_TESTNET_CHAIN_ID:
            return ETCSWAP_V3_CONTRACTS; // Same addresses on both networks
        default:
            return null;
    }
}

/**
 * Check if ETCswap V2 is available on the given chain.
 */
export function isETCswapV2Available(chainId: number): boolean {
    return chainId === ETC_MAINNET_CHAIN_ID || chainId === MORDOR_TESTNET_CHAIN_ID;
}

/**
 * Check if ETCswap V3 is available on the given chain.
 */
export function isETCswapV3Available(chainId: number): boolean {
    return chainId === ETC_MAINNET_CHAIN_ID || chainId === MORDOR_TESTNET_CHAIN_ID;
}

// ============================================================================
// Protocol Metadata
// ============================================================================

export const ETCSWAP_V2_METADATA = {
    name: "ETCswap V2",
    url: {
        mainnet: "https://v2.etcswap.org",
        mordor: "https://v2-mordor.etcswap.org",
    },
    analytics: "https://v2-info.etcswap.org",
    subgraph: "https://v2-graph.etcswap.org/subgraphs/name/etcswap/graphql",
} as const;

export const ETCSWAP_V3_METADATA = {
    name: "ETCswap V3",
    url: "https://v3.etcswap.org",
    analytics: "https://v3-info.etcswap.org",
    subgraph: "https://v3-graph.etcswap.org/subgraphs/name/etcswap/graphql",
} as const;

// ============================================================================
// Other ETC Ecosystem Contracts
// ============================================================================

export const ECO_REWARD_TOKEN: Address = "0xc0364FB5498c17088A5B1d98F6FB3dB2Df9866a9";
