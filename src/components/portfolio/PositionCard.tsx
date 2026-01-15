import { formatUnits } from "viem";
import type { ETCswapV2Position } from "@/lib/portfolio/adapters/etcswap-v2-positions";
import { ProtocolBadge } from "@/components/portfolio/ProtocolBadge";
import { ETCSWAP_V2_METADATA } from "@/lib/protocols/etcswap-contracts";
import { formatTokenBalance, formatNumber } from "@/lib/utils/format";

type PositionCardProps = {
    position: ETCswapV2Position;
    chainId: number;
};

/**
 * Position Card Component
 *
 * Displays a single LP position with pool details, reserves, and share percentage.
 * Follows 2025 DeFi Saver pattern with protocol badge and pool metrics.
 */
export function PositionCard({ position, chainId }: PositionCardProps) {
    const { token0, token1, lpBalance, lpTotalSupply, poolShare } = position;

    // Format reserves
    const reserve0Formatted = formatUnits(token0.reserve, token0.decimals);
    const reserve1Formatted = formatUnits(token1.reserve, token1.decimals);

    // Format LP balance
    const lpBalanceFormatted = formatUnits(lpBalance, 18); // LP tokens typically 18 decimals

    // Calculate user's share of reserves
    const shareRatio = Number(lpBalance) / Number(lpTotalSupply);
    const userReserve0 = Number(reserve0Formatted) * shareRatio;
    const userReserve1 = Number(reserve1Formatted) * shareRatio;

    // Pool name
    const poolName = `${token0.symbol}/${token1.symbol}`;

    // External pool link
    const poolUrl =
        chainId === 63
            ? ETCSWAP_V2_METADATA.url.mordor
            : ETCSWAP_V2_METADATA.url.mainnet;

    return (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            {/* Header: Protocol badge + Pool name */}
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ProtocolBadge protocol={position.protocol} size="sm" chainId={chainId} />
                    <h3 className="text-sm font-medium text-white/90">{poolName}</h3>
                </div>
                <a
                    href={poolUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-white/55 transition hover:text-white/80"
                    title={`View on ETCswap`}
                >
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
            </div>

            {/* Pool share indicator */}
            <div className="mb-3">
                <div className="mb-1 flex items-baseline justify-between text-xs">
                    <span className="text-white/55">Pool Share</span>
                    <span className="font-medium text-white/90">
                        {formatNumber(poolShare, 4, 0)}%
                    </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                        className="h-full rounded-full bg-blue-500/50"
                        style={{ width: `${Math.min(poolShare, 100)}%` }}
                    />
                </div>
            </div>

            {/* LP Token Balance */}
            <div className="mb-3 rounded-lg bg-white/5 p-2.5">
                <div className="text-xs text-white/55">LP Tokens</div>
                <div className="mt-0.5 font-mono text-sm text-white/90">
                    {formatTokenBalance(lpBalanceFormatted)}
                </div>
            </div>

            {/* User's Share of Reserves (Position Value) */}
            <div className="mb-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-2.5">
                <div className="mb-1 text-xs text-white/70">Your Position Value</div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <div className="text-xs text-white/55">{token0.symbol}</div>
                        <div className="mt-0.5 font-mono text-sm text-white/90">
                            {formatNumber(userReserve0, 6, 2)}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-white/55">{token1.symbol}</div>
                        <div className="mt-0.5 font-mono text-sm text-white/90">
                            {formatNumber(userReserve1, 6, 2)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Pool Reserves */}
            <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white/5 p-2.5">
                    <div className="text-xs text-white/55">Pool {token0.symbol}</div>
                    <div className="mt-0.5 font-mono text-sm text-white/90">
                        {formatTokenBalance(reserve0Formatted)}
                    </div>
                </div>
                <div className="rounded-lg bg-white/5 p-2.5">
                    <div className="text-xs text-white/55">Pool {token1.symbol}</div>
                    <div className="mt-0.5 font-mono text-sm text-white/90">
                        {formatTokenBalance(reserve1Formatted)}
                    </div>
                </div>
            </div>

            {/* LP Token Address */}
            <div className="mt-2 text-xs text-white/40">
                LP: {position.lpTokenAddress.slice(0, 6)}...{position.lpTokenAddress.slice(-4)}
            </div>
        </div>
    );
}
