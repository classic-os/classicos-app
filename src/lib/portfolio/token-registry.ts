import type { Address } from "viem";

/**
 * ERC20 Token Metadata
 */
export type TokenInfo = {
    readonly address: Address;
    readonly symbol: string;
    readonly name: string;
    readonly decimals: number;
    readonly chainId: number;
};

/**
 * Token Registry for Ethereum Classic and Mordor Testnet
 *
 * Source: ETCswap V3 Token List (v0.14.0, June 2025)
 * https://github.com/etcswap/tokens/blob/main/ethereum-classic/all.json
 */

/**
 * Ethereum Classic Mainnet (Chain ID 61) Token Registry
 */
export const ETC_MAINNET_TOKENS: readonly TokenInfo[] = [
    {
        address: "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a",
        symbol: "WETC",
        name: "Wrapped ETC",
        decimals: 18,
        chainId: 61,
    },
    {
        address: "0xDE093684c796204224BC081f937aa059D903c52a",
        symbol: "USC",
        name: "Classic USD",
        decimals: 6,
        chainId: 61,
    },
    {
        address: "0xc0364FB5498c17088A5B1d98F6FB3dB2Df9866a9",
        symbol: "ECO",
        name: "Eco",
        decimals: 18,
        chainId: 61,
    },
    {
        address: "0xAccc4ae3a58E8bC3115E67eE67852044069F154A",
        symbol: "CYPH",
        name: "Cypher by ETCMC",
        decimals: 18,
        chainId: 61,
    },
    {
        address: "0x6c3B413C461c42a88160Ed1B1B31d6f7b02a1C83",
        symbol: "ETCPOW",
        name: "ETCPOW by ETCMC",
        decimals: 18,
        chainId: 61,
    },
    {
        address: "0x271dc2DF1390a7b319CAE1711A454fa416D6A309",
        symbol: "BOB",
        name: "BOB by TMWSTW",
        decimals: 0,
        chainId: 61,
    },
    {
        address: "0x152BAEFdc3b7E60985addF66FaB95e01089ba958",
        symbol: "GREASE",
        name: "GREASE by TMWSTW",
        decimals: 0,
        chainId: 61,
    },
    {
        address: "0x19b4343d272DA48779aB7A9a7436F95F63249871",
        symbol: "INK",
        name: "INK by TMWSTW",
        decimals: 0,
        chainId: 61,
    },
    {
        address: "0xa1Ccb330165cda264f35De7630De084e83d39134",
        symbol: "SLAG",
        name: "SLAG by TMWSTW",
        decimals: 0,
        chainId: 61,
    },
    {
        address: "0xbf72BfEFA79957Fa944431f25e73a6aAEBC81798",
        symbol: "TMWSTW",
        name: "TMWSTW Profits",
        decimals: 0,
        chainId: 61,
    },
    {
        address: "0xbB2D194ABBac8834c833dcCd0ccb266670b0d3de",
        symbol: "WAACC",
        name: "2015 Relic: AyeAyeCoin",
        decimals: 0,
        chainId: 61,
    },
    {
        address: "0x80365F3f6d3C335C3f2b7D72cD7Fa8Eb56c933c9",
        symbol: "BTCC",
        name: "2015 Relic: bitcoin",
        decimals: 8,
        chainId: 61,
    },
] as const;

/**
 * Mordor Testnet (Chain ID 63) Token Registry
 */
export const MORDOR_TESTNET_TOKENS: readonly TokenInfo[] = [
    {
        address: "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a",
        symbol: "WETC",
        name: "Wrapped ETC",
        decimals: 18,
        chainId: 63,
    },
    {
        address: "0xDE093684c796204224BC081f937aa059D903c52a",
        symbol: "USC",
        name: "Classic USD",
        decimals: 6,
        chainId: 63,
    },
    {
        address: "0xD333787e69DbfC47E67C59441e392Eb530b3DC19",
        symbol: "USDC",
        name: "USDC",
        decimals: 6,
        chainId: 63,
    },
    {
        address: "0xfC95e5e3f912823eE531687E2Df137940ef3BA2c",
        symbol: "USDT",
        name: "Tether",
        decimals: 6,
        chainId: 63,
    },
    {
        address: "0xbe147F327704d4F62dCA47172261585D7b12eEEC",
        symbol: "WBTC",
        name: "Wrapped Bitcoin",
        decimals: 8,
        chainId: 63,
    },
] as const;

/**
 * Get tokens for a specific chain
 */
export function getTokensForChain(chainId: number): readonly TokenInfo[] {
    switch (chainId) {
        case 61:
            return ETC_MAINNET_TOKENS;
        case 63:
            return MORDOR_TESTNET_TOKENS;
        default:
            return [];
    }
}

/**
 * Get token info by address and chain
 */
export function getTokenInfo(
    address: Address,
    chainId: number
): TokenInfo | undefined {
    const tokens = getTokensForChain(chainId);
    return tokens.find(
        (token) => token.address.toLowerCase() === address.toLowerCase()
    );
}
