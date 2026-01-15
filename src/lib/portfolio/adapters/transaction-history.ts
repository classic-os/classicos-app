import type { Address, Block, Transaction, TransactionReceipt } from "viem";

/**
 * Structural type for RPC client that can fetch transaction data.
 * Uses structural typing to avoid coupling to concrete viem types.
 */
export type RpcClient = {
    getBlockNumber: () => Promise<bigint>;
    getBlock: (args: { blockNumber: bigint; includeTransactions: boolean }) => Promise<Block>;
    getTransactionReceipt: (args: { hash: Address }) => Promise<TransactionReceipt | null>;
};

/**
 * Simplified transaction for display purposes.
 * Includes essential information for activity feed.
 */
export type ActivityTransaction = {
    hash: string;
    blockNumber: bigint;
    timestamp: number; // Unix timestamp in seconds
    from: string;
    to: string | null;
    value: bigint; // Native token value in wei
    gasUsed: bigint;
    status: "success" | "failed";
    type: "sent" | "received" | "contract";
};

/**
 * Fetches recent transaction history for a given address.
 *
 * This is a simplified implementation that scans recent blocks for transactions
 * involving the target address. For production, consider using block explorer APIs
 * or indexing services for better performance.
 *
 * @param client - RPC client with block and transaction methods
 * @param address - Wallet address to query
 * @param chainId - Chain ID for context
 * @param blockCount - Number of recent blocks to scan (default: 100)
 * @returns Array of transactions involving the address
 */
export async function getTransactionHistory(
    client: RpcClient,
    address: Address,
    chainId: number,
    blockCount = 100
): Promise<ActivityTransaction[]> {
    if (!client) {
        throw new Error("RPC client is required");
    }

    if (!address) {
        throw new Error("Address is required");
    }

    try {
        const normalizedAddress = address.toLowerCase();
        const transactions: ActivityTransaction[] = [];

        // Get current block number
        const currentBlock = await client.getBlockNumber();
        const startBlock = currentBlock - BigInt(blockCount) + BigInt(1);

        // Scan recent blocks for transactions
        // Note: This is intentionally simple for Phase 1
        // Production optimization: Use block explorer API or indexer
        const blockPromises: Promise<Block>[] = [];

        for (let i = 0; i < blockCount; i++) {
            const blockNum = startBlock + BigInt(i);
            if (blockNum <= currentBlock) {
                blockPromises.push(
                    client.getBlock({
                        blockNumber: blockNum,
                        includeTransactions: true
                    })
                );
            }
        }

        const blocks = await Promise.allSettled(blockPromises);

        // Process blocks and extract relevant transactions
        for (const result of blocks) {
            if (result.status === "fulfilled") {
                const block = result.value;
                const blockTxs = block.transactions as Transaction[];

                if (!blockTxs || blockTxs.length === 0) continue;

                for (const tx of blockTxs) {
                    const fromMatch = tx.from.toLowerCase() === normalizedAddress;
                    const toMatch = tx.to?.toLowerCase() === normalizedAddress;

                    if (fromMatch || toMatch) {
                        // Fetch receipt to get status and gas used
                        let receipt: TransactionReceipt | null = null;
                        try {
                            receipt = await client.getTransactionReceipt({
                                hash: tx.hash as Address
                            });
                        } catch {
                            // If receipt fetch fails, skip this transaction
                            continue;
                        }

                        if (!receipt) continue;

                        // Determine transaction type
                        let type: ActivityTransaction["type"];
                        if (!tx.to) {
                            type = "contract"; // Contract creation
                        } else if (fromMatch && !toMatch) {
                            type = "sent";
                        } else if (toMatch && !fromMatch) {
                            type = "received";
                        } else {
                            type = "contract"; // Self-transfer or contract interaction
                        }

                        transactions.push({
                            hash: tx.hash,
                            blockNumber: tx.blockNumber || BigInt(0),
                            timestamp: Number(block.timestamp),
                            from: tx.from,
                            to: tx.to || null,
                            value: tx.value,
                            gasUsed: receipt.gasUsed,
                            status: receipt.status === "success" ? "success" : "failed",
                            type,
                        });
                    }
                }
            }
        }

        // Sort by block number descending (most recent first)
        transactions.sort((a, b) => {
            if (a.blockNumber > b.blockNumber) return -1;
            if (a.blockNumber < b.blockNumber) return 1;
            return 0;
        });

        return transactions;
    } catch (error) {
        throw new Error(
            `Failed to fetch transaction history for ${address} on chain ${chainId}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}
