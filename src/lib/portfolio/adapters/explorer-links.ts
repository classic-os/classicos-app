import type { Address } from "viem";
import { CHAINS_BY_ID } from "@/lib/networks/registry";

/**
 * Construct block explorer URL for an address.
 *
 * Pure function with no RPC calls - string manipulation only.
 *
 * @param address - Ethereum address to link to
 * @param chainId - Chain ID to determine explorer
 * @returns Explorer URL or null if no explorer configured
 */
export function getAddressExplorerUrl(
    address: Address,
    chainId: number
): string | null {
    const chain = CHAINS_BY_ID[chainId];
    if (!chain?.blockExplorers?.default?.url) {
        return null;
    }

    const baseUrl = chain.blockExplorers.default.url;
    return `${baseUrl}/address/${address}`;
}

/**
 * Get block explorer name for a chain.
 *
 * @param chainId - Chain ID to look up
 * @returns Explorer name or null if not configured
 */
export function getExplorerName(chainId: number): string | null {
    const chain = CHAINS_BY_ID[chainId];
    return chain?.blockExplorers?.default?.name ?? null;
}

/**
 * Construct block explorer URL for a transaction hash.
 *
 * @param txHash - Transaction hash to link to
 * @param chainId - Chain ID to determine explorer
 * @returns Explorer URL or null if no explorer configured
 */
export function getTransactionExplorerUrl(
    txHash: string,
    chainId: number
): string | null {
    const chain = CHAINS_BY_ID[chainId];
    if (!chain?.blockExplorers?.default?.url) {
        return null;
    }

    const baseUrl = chain.blockExplorers.default.url;
    return `${baseUrl}/tx/${txHash}`;
}
