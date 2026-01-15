"use client";

import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { useExplorerLink } from "@/hooks/useExplorerLink";

export function ActivityPanel() {
    const { url, explorerName } = useExplorerLink();

    return (
        <Panel title="Activity" description="Transaction history and events">
            {url && explorerName ? (
                <div className="space-y-4">
                    <p className="text-sm text-white/70">
                        View your complete transaction history and contract interactions
                    </p>

                    <a
                        href={url}
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
                                View on {explorerName}
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

                    <div className="text-xs text-white/50">
                        Activity includes sends, receives, swaps, liquidity operations, and all
                        contract interactions.
                    </div>
                </div>
            ) : (
                <EmptyState
                    title="Connect wallet to view activity"
                    body="Transaction history will appear here once connected"
                />
            )}
        </Panel>
    );
}
