"use client";

import { useMemo } from "react";
import { useChainId, useConnections } from "wagmi";
import { formatUnits } from "viem";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { UpdateIndicator } from "@/components/portfolio/UpdateIndicator";
import { TokenLogo } from "@/components/portfolio/TokenLogo";
import { CHAINS_BY_ID } from "@/lib/networks/registry";
import { formatTokenBalance } from "@/lib/utils/format";

/**
 * Token Balances Display Component
 *
 * Displays all ERC20 token balances for connected wallet.
 * Uses individual RPC calls for each token (fallback from multicall due to compatibility).
 * Only shows tokens with non-zero balances.
 */
export function TokenBalancesDisplay() {
    const connections = useConnections();
    const chainId = useChainId();
    const { data: tokenBalances, isLoading, error, dataUpdatedAt, isFetching } =
        useTokenBalances();

    const address = useMemo(() => {
        const first = connections?.[0];
        const acct = first?.accounts?.[0];
        return typeof acct === "string" ? acct : undefined;
    }, [connections]);

    const isConnected = Boolean(address);
    const chain = CHAINS_BY_ID[chainId];

    // State 1: Disconnected
    if (!isConnected || !address) {
        return (
            <div className="text-sm text-white/55">
                Connect wallet to view token balances
            </div>
        );
    }

    // State 2: Loading
    if (isLoading) {
        return (
            <div className="space-y-3">
                <div className="h-16 w-full animate-pulse rounded-lg bg-white/5" />
                <div className="h-16 w-full animate-pulse rounded-lg bg-white/5" />
                <div className="h-16 w-full animate-pulse rounded-lg bg-white/5" />
            </div>
        );
    }

    // State 3: Error
    if (error) {
        return (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <div className="text-sm font-medium text-red-400">
                    Failed to load token balances
                </div>
                <div className="mt-1 text-xs text-red-300/70">
                    {error instanceof Error ? error.message : "Unknown error occurred"}
                </div>
            </div>
        );
    }

    // State 4: Empty (no tokens)
    if (!tokenBalances || tokenBalances.length === 0) {
        return (
            <div className="rounded-xl border border-white/10 bg-black/20 p-6 text-center">
                <div className="text-sm text-white/55">No ERC20 tokens detected</div>
                <div className="mt-1 text-xs text-white/40">
                    This wallet doesn&apos;t hold any ERC20 token balances on {chain?.name || `Chain ${chainId}`}.
                </div>
                <div className="mt-2 text-xs text-white/35">
                    Tokens acquired through swaps or transfers will appear here automatically.
                </div>
            </div>
        );
    }

    // State 5: Data (tokens with balances)
    return (
        <div className="space-y-3">
            {/* Update indicator at top of token list */}
            {dataUpdatedAt && (
                <div className="px-1">
                    <UpdateIndicator dataUpdatedAt={dataUpdatedAt} isFetching={isFetching} />
                </div>
            )}

            {tokenBalances.map((tokenBalance) => {
                const { token, balance } = tokenBalance;
                const formattedBalance = formatUnits(balance, token.decimals);
                const displayBalance = formatTokenBalance(formattedBalance);

                return (
                    <div
                        key={`${token.address}-${token.chainId}`}
                        className="rounded-xl border border-white/10 bg-black/20 p-4"
                    >
                        <div className="flex items-center gap-3">
                            <TokenLogo logoURI={token.logoURI} symbol={token.symbol} size="md" />

                            <div className="min-w-0 flex-1">
                                <div className="flex items-baseline gap-2">
                                    <div className="text-sm font-medium text-white/90">
                                        {token.symbol}
                                    </div>
                                    <div className="truncate text-xs text-white/45">
                                        {token.name}
                                    </div>
                                </div>
                                <div className="mt-0.5 text-xs text-white/40">
                                    {token.address.slice(0, 6)}...{token.address.slice(-4)}
                                </div>
                            </div>

                            <div className="shrink-0 text-right">
                                <div className="text-lg font-semibold text-white/90">
                                    {displayBalance}
                                </div>
                                <div className="text-xs text-white/55">{token.symbol}</div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
