"use client";

import { useMemo } from "react";
import { useConnections, useChainId } from "wagmi";
import { formatEther } from "viem";
import { CollapsiblePanel } from "@/components/ui/CollapsiblePanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { useExplorerLink } from "@/hooks/useExplorerLink";
import { getEcosystem } from "@/lib/ecosystems/registry";
import { CHAINS_BY_ID } from "@/lib/networks/registry";

export function ActivityPanel() {
    const connections = useConnections();
    const chainId = useChainId();
    const ecosystem = getEcosystem(chainId);
    const chain = CHAINS_BY_ID[chainId];
    const nativeSymbol = chain?.nativeCurrency?.symbol || "ETH";
    const { url: explorerUrl, explorerName } = useExplorerLink();

    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    const { data: transactions, isLoading, error } = useTransactionHistory(50);

    const isConnected = Boolean(address);
    const txCount = transactions?.length || 0;
    const txCountLabel = txCount > 0 ? `${txCount} ${txCount === 1 ? "Transaction" : "Transactions"}` : "Recent Activity";

    // State 1: Disconnected
    if (!isConnected || !address) {
        return (
            <CollapsiblePanel
                title="Activity"
                description={txCountLabel}
                defaultExpanded={true}
            >
                <EmptyState
                    title="Connect wallet to view activity"
                    body="Transaction history will appear here once connected"
                />
            </CollapsiblePanel>
        );
    }

    // State 2: Loading
    if (isLoading) {
        return (
            <CollapsiblePanel
                title="Activity"
                description={txCountLabel}
                defaultExpanded={true}
            >
                <div className="space-y-3">
                    <div className="h-20 w-full animate-pulse rounded-xl bg-white/5" />
                    <div className="h-20 w-full animate-pulse rounded-xl bg-white/5" />
                    <div className="h-20 w-full animate-pulse rounded-xl bg-white/5" />
                </div>
            </CollapsiblePanel>
        );
    }

    // State 3: Error
    if (error) {
        return (
            <CollapsiblePanel
                title="Activity"
                description={txCountLabel}
                defaultExpanded={true}
            >
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                    <div className="text-sm font-medium text-red-400">
                        Failed to load transaction history
                    </div>
                    <div className="mt-1 text-xs text-red-300/70">
                        {error instanceof Error ? error.message : "Unknown error occurred"}
                    </div>
                </div>
            </CollapsiblePanel>
        );
    }

    // State 4: Empty (no transactions in recent blocks)
    if (!transactions || transactions.length === 0) {
        return (
            <CollapsiblePanel
                title="Activity"
                description={txCountLabel}
                defaultExpanded={true}
            >
                <div className="space-y-4">
                    <EmptyState
                        title="No recent activity"
                        body="No transactions found in the last 50 blocks. Your transaction history will appear here."
                    />

                    {explorerUrl && explorerName && (
                        <a
                            href={explorerUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20 hover:bg-black/30"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                                <svg
                                    className="h-5 w-5 text-white/70"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-white/90">
                                    View complete history on {explorerName}
                                </div>
                                <div className="text-xs text-white/55">Opens in new tab</div>
                            </div>
                            <svg
                                className="h-4 w-4 text-white/40"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </a>
                    )}
                </div>
            </CollapsiblePanel>
        );
    }

    // State 5: Data (transactions list)
    return (
        <CollapsiblePanel
            title="Activity"
            description={txCountLabel}
            defaultExpanded={true}
        >
            <div className="space-y-3">
                {transactions.map((tx) => {
                    const blockExplorerTxUrl = ecosystem.observability.blockExplorer?.url
                        ? `${ecosystem.observability.blockExplorer.url}/tx/${tx.hash}`
                        : null;

                    const formattedValue = formatEther(tx.value);
                    const displayValue = parseFloat(formattedValue) > 0 ? formattedValue : "0";
                    const date = new Date(tx.timestamp * 1000);
                    const timeAgo = getTimeAgo(date);

                    return (
                        <div
                            key={tx.hash}
                            className="rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20"
                        >
                            <div className="flex items-start justify-between gap-3">
                                {/* Left: Type icon and details */}
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                            tx.type === "received"
                                                ? "bg-green-500/20"
                                                : tx.type === "sent"
                                                  ? "bg-blue-500/20"
                                                  : "bg-purple-500/20"
                                        }`}
                                    >
                                        {tx.type === "received" && (
                                            <svg
                                                className="h-5 w-5 text-green-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                                />
                                            </svg>
                                        )}
                                        {tx.type === "sent" && (
                                            <svg
                                                className="h-5 w-5 text-blue-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                                />
                                            </svg>
                                        )}
                                        {tx.type === "contract" && (
                                            <svg
                                                className="h-5 w-5 text-purple-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-white/90 capitalize">
                                                {tx.type}
                                            </span>
                                            {tx.status === "failed" && (
                                                <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-xs text-red-400">
                                                    Failed
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-1 text-xs text-white/55">
                                            {timeAgo}
                                        </div>
                                        <div className="mt-1 text-xs font-mono text-white/40">
                                            {shortenHash(tx.hash)}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Value and link */}
                                <div className="flex shrink-0 flex-col items-end gap-2">
                                    {parseFloat(displayValue) > 0 && (
                                        <div className="text-sm font-medium text-white/90">
                                            {parseFloat(displayValue).toFixed(4)} {nativeSymbol}
                                        </div>
                                    )}
                                    {blockExplorerTxUrl && (
                                        <a
                                            href={blockExplorerTxUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-white/50 underline hover:text-white/70"
                                        >
                                            View
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {explorerUrl && explorerName && (
                    <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/70 transition hover:border-white/20 hover:bg-black/30 hover:text-white/90"
                    >
                        <span>View complete history on {explorerName}</span>
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                    </a>
                )}
            </div>
        </CollapsiblePanel>
    );
}

// Helper functions
function shortenHash(hash: string): string {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds}s ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
}
