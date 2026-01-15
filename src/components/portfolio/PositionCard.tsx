import { formatUnits } from "viem";
import type { ETCswapV2Position } from "@/lib/portfolio/adapters/etcswap-v2-positions";
import type { ETCPriceData } from "@/lib/portfolio/price-adapter";
import type { DerivedPrice } from "@/lib/portfolio/derived-prices";
import type { ExchangeRates } from "@/lib/currencies/exchange-rates";
import type { CurrencyCode } from "@/lib/currencies/registry";
import { ProtocolBadge } from "@/components/portfolio/ProtocolBadge";
import { TokenLogo } from "@/components/portfolio/TokenLogo";
import { CopyButton } from "@/components/ui/CopyButton";
import { ETCSWAP_V2_METADATA } from "@/lib/protocols/etcswap-contracts";
import { CHAINS_BY_ID } from "@/lib/networks/registry";
import { getTokenInfo } from "@/lib/portfolio/token-registry";
import { formatTokenBalance, formatNumber } from "@/lib/utils/format";
import { calculateLPPositionUSDValue } from "@/lib/portfolio/portfolio-value";
import { formatCurrencyValue } from "@/lib/currencies/format";
import { estimateAPY } from "@/lib/portfolio/lp-apy";
import { getTokenPrice } from "@/lib/portfolio/derived-prices";

type PositionCardProps = {
    position: ETCswapV2Position;
    chainId: number;
    prices?: ETCPriceData;
    derivedPrices?: Map<string, DerivedPrice>;
    currency: CurrencyCode;
    exchangeRates?: ExchangeRates;
};

/**
 * Position Card Component
 *
 * Displays a single LP position with pool details, reserves, share percentage, and APY estimate.
 * Follows 2025 DeFi Saver pattern with protocol badge and pool metrics.
 */
export function PositionCard({ position, chainId, prices, derivedPrices, currency, exchangeRates }: PositionCardProps) {
    const { token0, token1, lpBalance, lpTotalSupply, poolShare } = position;

    // Look up token metadata from registry for logos
    const token0Info = getTokenInfo(token0.address, chainId);
    const token1Info = getTokenInfo(token1.address, chainId);

    // Format reserves
    const reserve0Formatted = formatUnits(token0.reserve, token0.decimals);
    const reserve1Formatted = formatUnits(token1.reserve, token1.decimals);

    // Format LP balance
    const lpBalanceFormatted = formatUnits(lpBalance, 18); // LP tokens typically 18 decimals

    // Calculate user's share of reserves
    const shareRatio = Number(lpBalance) / Number(lpTotalSupply);
    const userReserve0 = Number(reserve0Formatted) * shareRatio;
    const userReserve1 = Number(reserve1Formatted) * shareRatio;
    const userReserve0BigInt = BigInt(Math.floor(Number(token0.reserve) * shareRatio));
    const userReserve1BigInt = BigInt(Math.floor(Number(token1.reserve) * shareRatio));

    // Pool name
    const poolName = `${token0.symbol}/${token1.symbol}`;

    // External pool link
    const poolUrl =
        chainId === 63
            ? ETCSWAP_V2_METADATA.url.mordor
            : ETCSWAP_V2_METADATA.url.mainnet;

    // Explorer link for LP token (token endpoint for token activity)
    const chain = CHAINS_BY_ID[chainId];
    const explorerUrl = chain?.blockExplorers?.default?.url
        ? `${chain.blockExplorers.default.url}/token/${position.lpTokenAddress}`
        : null;

    // Calculate position value and APY estimate (using derived prices)
    const positionValueUSD = prices
        ? calculateLPPositionUSDValue(
              token0.address,
              token0.decimals,
              userReserve0BigInt,
              token1.address,
              token1.decimals,
              userReserve1BigInt,
              prices,
              derivedPrices
          )
        : null;
    const apyEstimate = prices ? estimateAPY(position, prices) : null;

    // Get spot prices for tokens
    const token0Price = prices && derivedPrices ? getTokenPrice(token0.address, prices, derivedPrices) : null;
    const token1Price = prices && derivedPrices ? getTokenPrice(token1.address, prices, derivedPrices) : null;

    // Determine price sources for both tokens
    const uscAddress = "0xDE093684c796204224BC081f937aa059D903c52a".toLowerCase();
    const wetcAddress = "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a".toLowerCase();

    const getPriceSource = (tokenAddress: string): string | null => {
        const normalized = tokenAddress.toLowerCase();
        if (token0Price === null && token1Price === null) return null;

        if (normalized === uscAddress || normalized === wetcAddress) {
            return "CoinGecko";
        } else {
            const derived = derivedPrices?.get(normalized);
            if (derived) {
                return `ETCswap V2 pool (${derived.derivedFrom})`;
            }
        }
        return null;
    };

    const token0PriceSource = getPriceSource(token0.address);
    const token1PriceSource = getPriceSource(token1.address);

    return (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            {/* Header: Token Logos + Pool name + Protocol badge */}
            <div className="mb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Token pair logos */}
                        <div className="flex items-center -space-x-2">
                            <TokenLogo logoURI={token0Info?.logoURI} symbol={token0.symbol} size="sm" />
                            <TokenLogo logoURI={token1Info?.logoURI} symbol={token1.symbol} size="sm" />
                        </div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-white/90">{poolName}</h3>
                            <ProtocolBadge protocol={position.protocol} size="sm" chainId={chainId} />
                        </div>
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
            </div>

            {/* Your Position (consolidated: value, LP tokens, APY, tokens) */}
            <div className="mb-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                <div className="mb-3 flex items-baseline justify-between">
                    <div className="text-xs text-white/70">Your Position Value</div>
                    {positionValueUSD !== null && (
                        <div className="font-mono text-lg font-semibold text-white/95">
                            {formatCurrencyValue(positionValueUSD, currency, exchangeRates)}
                        </div>
                    )}
                </div>

                {/* LP Token Balance (left) + Manage Button (right) */}
                <div className="mb-3 grid grid-cols-2 gap-4 border-b border-white/10 pb-3">
                    <div>
                        <div className="mb-1 text-xs text-white/55">
                            {position.protocol === "etcswap-v2" ? "ETCswap V2" : position.protocol} pool ({poolName}) LP Tokens
                        </div>
                        <div className="flex items-baseline gap-3">
                            <div className="font-mono text-sm font-medium text-white/90">
                                {formatTokenBalance(lpBalanceFormatted)}
                            </div>
                            {apyEstimate && apyEstimate.method !== "unavailable" && apyEstimate.apy > 0 && (
                                <div className="flex items-center gap-1.5 text-xs">
                                    <span className="text-white/55">Est. APY</span>
                                    <span
                                        className="text-white/40"
                                        title={`Confidence: ${apyEstimate.confidence}\nMethod: ${apyEstimate.method}`}
                                    >
                                        ⓘ
                                    </span>
                                    <span className="font-mono font-medium text-green-400">
                                        {formatNumber(apyEstimate.apy, 2, 0)}%
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-white/40">
                                {position.lpTokenAddress.slice(0, 6)}...{position.lpTokenAddress.slice(-4)}
                            </span>
                            <CopyButton text={position.lpTokenAddress} label="Copy" size="xs" variant="ghost" />
                            {explorerUrl && (
                                <a
                                    href={explorerUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-white/40 transition hover:text-white/70"
                                    title="View on explorer"
                                >
                                    <svg
                                        className="h-3 w-3"
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
                    </div>

                    {/* Manage Liquidity Button */}
                    <div className="flex items-start justify-end">
                        <a
                            href={poolUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-400 transition hover:border-blue-500/50 hover:bg-blue-500/20"
                        >
                            <span>Manage</span>
                            <svg
                                className="h-3.5 w-3.5"
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
                </div>

                {/* Token Amounts (left) + Pool Share & Asset Composition (right) */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Left: Your Token Amounts */}
                    <div className="space-y-3">
                        <div>
                            <div className="mb-2 text-xs text-white/55">Your Token Amounts</div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs text-white/55">{token0.symbol}</div>
                                    <div className="mt-0.5 font-mono text-sm text-white/90">
                                        {formatNumber(userReserve0, 6, 2)}
                                    </div>
                                    {token0Price !== null && (
                                        <div className="mt-1 text-xs text-white/50">
                                            {formatCurrencyValue(token0Price, currency, exchangeRates)} per {token0.symbol}
                                        </div>
                                    )}
                                    {token0PriceSource && (
                                        <div className="mt-1 text-xs text-white/40">
                                            {token0PriceSource}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="text-xs text-white/55">{token1.symbol}</div>
                                    <div className="mt-0.5 font-mono text-sm text-white/90">
                                        {formatNumber(userReserve1, 6, 2)}
                                    </div>
                                    {token1Price !== null && (
                                        <div className="mt-1 text-xs text-white/50">
                                            {formatCurrencyValue(token1Price, currency, exchangeRates)} per {token1.symbol}
                                        </div>
                                    )}
                                    {token1PriceSource && (
                                        <div className="mt-1 text-xs text-white/40">
                                            {token1PriceSource}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Pool Share + Asset Composition */}
                    <div className="space-y-3">
                        {/* Pool Share */}
                        <div>
                            <div className="mb-2 text-xs text-white/55">Pool Share</div>
                            <div className="font-mono text-sm font-medium text-white/90">
                                {formatNumber(poolShare, 4, 0)}%
                            </div>
                            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full bg-blue-400"
                                    style={{ width: `${Math.max(Math.min(poolShare, 100), 0.5)}%` }}
                                />
                            </div>
                            <div className="mt-2 space-y-1 text-xs">
                                <div className="flex items-baseline justify-between text-white/50">
                                    <span>Pool {token0.symbol}</span>
                                    <span className="font-mono">{formatTokenBalance(reserve0Formatted)}</span>
                                </div>
                                <div className="flex items-baseline justify-between text-white/50">
                                    <span>Pool {token1.symbol}</span>
                                    <span className="font-mono">{formatTokenBalance(reserve1Formatted)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Asset Composition */}
                        {token0Price !== null && token1Price !== null && positionValueUSD !== null && (
                            <div>
                                <div className="mb-2 text-xs text-white/55">Current Asset Composition</div>
                                {(() => {
                                    const token0ValueUSD = userReserve0 * token0Price;
                                    const token1ValueUSD = userReserve1 * token1Price;
                                    const total = token0ValueUSD + token1ValueUSD;
                                    const token0Percent = total > 0 ? (token0ValueUSD / total) * 100 : 50;
                                    const token1Percent = total > 0 ? (token1ValueUSD / total) * 100 : 50;

                                    return (
                                        <>
                                            <div className="mb-2 flex items-center gap-2 text-xs">
                                                <span className="text-white/70">{token0.symbol}</span>
                                                <span className="font-mono text-white/90">{formatNumber(token0Percent, 1, 0)}%</span>
                                                <span className="text-white/40">•</span>
                                                <span className="text-white/70">{token1.symbol}</span>
                                                <span className="font-mono text-white/90">{formatNumber(token1Percent, 1, 0)}%</span>
                                            </div>
                                            <div className="flex h-2 overflow-hidden rounded-full">
                                                <div
                                                    className="bg-purple-500"
                                                    style={{ width: `${token0Percent}%` }}
                                                    title={`${token0.symbol}: ${formatNumber(token0Percent, 2, 0)}%`}
                                                />
                                                <div
                                                    className="bg-cyan-500"
                                                    style={{ width: `${token1Percent}%` }}
                                                    title={`${token1.symbol}: ${formatNumber(token1Percent, 2, 0)}%`}
                                                />
                                            </div>
                                            {Math.abs(token0Percent - 50) > 5 && (
                                                <div className="mt-1 text-xs text-yellow-400/70">
                                                    ⚠ Ratio shifted from 50/50 deposit
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
