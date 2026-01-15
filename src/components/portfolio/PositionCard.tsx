import { useState } from "react";
import { formatUnits } from "viem";
import type { ETCswapV2Position } from "@/lib/portfolio/adapters/etcswap-v2-positions";
import type { ETCswapV3Position } from "@/lib/portfolio/adapters/etcswap-v3-positions";
import type { ETCPriceData } from "@/lib/portfolio/price-adapter";
import type { DerivedPrice } from "@/lib/portfolio/derived-prices";
import type { ExchangeRates } from "@/lib/currencies/exchange-rates";
import type { CurrencyCode } from "@/lib/currencies/registry";
import { TokenLogo } from "@/components/portfolio/TokenLogo";
import { CopyButton } from "@/components/ui/CopyButton";
import { CHAINS_BY_ID } from "@/lib/networks/registry";
import { getTokenInfo } from "@/lib/portfolio/token-registry";
import { formatTokenBalance, formatNumber, formatLPTokenBalance } from "@/lib/utils/format";
import { calculateLPPositionUSDValue } from "@/lib/portfolio/portfolio-value";
import { formatCurrencyValue } from "@/lib/currencies/format";
import { estimateAPY } from "@/lib/portfolio/lp-apy";
import { getTokenPrice } from "@/lib/portfolio/derived-prices";
import { getTokenAmountsFromLiquidity, calculateV3PositionValue, tickToPrice } from "@/lib/portfolio/v3-math";
import { detectArbitrageOpportunities } from "@/lib/portfolio/arbitrage-detection";

type PositionCardProps = {
    position: ETCswapV2Position | ETCswapV3Position;
    chainId: number;
    prices?: ETCPriceData;
    derivedPrices?: Map<string, DerivedPrice>;
    currency: CurrencyCode;
    exchangeRates?: ExchangeRates;
};

/**
 * Render LP token amount with styled scientific notation
 * Grays out the ×10⁻ⁿ part for easier readability
 */
function LPTokenAmount({ value }: { value: string }) {
    const formatted = formatLPTokenBalance(value);

    // Check if it contains scientific notation (×10)
    if (formatted.includes("×10")) {
        const [mantissa, exponent] = formatted.split("×10");
        return (
            <span className="font-mono text-sm font-medium text-white/90">
                {mantissa}<span className="text-white/40">×10{exponent}</span>
            </span>
        );
    }

    // No scientific notation, display as is
    return <span className="font-mono text-sm font-medium text-white/90">{formatted}</span>;
}

/**
 * Position Card Component
 *
 * Displays a single LP position (V2 or V3) with pool details and metrics.
 * Routes to appropriate renderer based on position protocol.
 */
export function PositionCard({ position, chainId, prices, derivedPrices, currency, exchangeRates }: PositionCardProps) {
    // Route to V3-specific renderer if V3 position
    // Note: We immediately delegate to V3PositionCard to avoid hooks issues
    if (position.protocol === "etcswap-v3") {
        return (
            <V3PositionCard
                position={position}
                chainId={chainId}
                prices={prices}
                derivedPrices={derivedPrices}
                currency={currency}
                exchangeRates={exchangeRates}
            />
        );
    }

    // V2 position renderer
    return <V2PositionCard position={position} chainId={chainId} prices={prices} derivedPrices={derivedPrices} currency={currency} exchangeRates={exchangeRates} />;
}

/**
 * V2 Position Card Component
 *
 * Displays an ETCswap V2 AMM liquidity position.
 */
function V2PositionCard({ position, chainId, prices, derivedPrices, currency, exchangeRates }: { position: ETCswapV2Position; chainId: number; prices?: ETCPriceData; derivedPrices?: Map<string, DerivedPrice>; currency: CurrencyCode; exchangeRates?: ExchangeRates; }) {
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

    // External pool link - V2 uses /add/ path with token addresses
    // Format: https://v2.etcswap.org/#/add/ETC/0x... (mainnet) or https://v2-mordor.etcswap.org/#/add/ETC/0x... (testnet)
    const baseUrl = chainId === 63
        ? "https://v2-mordor.etcswap.org/#/add"
        : "https://v2.etcswap.org/#/add";

    // Use ETC for native token, otherwise use address
    const token0Param = token0.symbol === "WETC" ? "ETC" : token0.address;
    const token1Param = token1.symbol === "WETC" ? "ETC" : token1.address;

    const poolUrl = `${baseUrl}/${token0Param}/${token1Param}`;

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

    // Detect arbitrage opportunities (1% threshold)
    const [showArbitrageDetails, setShowArbitrageDetails] = useState(false);
    const arbitrageOpportunities = prices ? detectArbitrageOpportunities(position, prices, 1.0) : [];
    const hasArbitrage = arbitrageOpportunities.length > 0;

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
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
                            <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-400">
                                ETCswap V2
                            </span>
                            <span className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 text-xs font-medium text-white/70">
                                0.3%
                            </span>
                            <span className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 text-xs font-medium text-white/70">
                                In Range
                            </span>
                            {hasArbitrage && (
                                <button
                                    onClick={() => setShowArbitrageDetails(!showArbitrageDetails)}
                                    className="rounded border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 text-xs font-medium text-yellow-400 transition hover:bg-yellow-500/20"
                                    title="Click to view arbitrage opportunities"
                                >
                                    Arbitrage {arbitrageOpportunities.length > 1 ? `(${arbitrageOpportunities.length})` : ""}
                                </button>
                            )}
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

            {/* Arbitrage Opportunities (expandable) */}
            {hasArbitrage && showArbitrageDetails && (
                <div className="mb-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs font-medium uppercase tracking-wide text-yellow-400">
                            Arbitrage Opportunities Detected
                        </span>
                        <span className="text-xs text-yellow-400/70">
                            (DEX vs CoinGecko FMV)
                        </span>
                    </div>
                    <div className="space-y-2">
                        {arbitrageOpportunities.map((opp) => (
                            <div
                                key={opp.tokenAddress}
                                className={`rounded-lg border ${
                                    opp.type === "premium"
                                        ? "border-green-500/30 bg-green-500/10"
                                        : "border-red-500/30 bg-red-500/10"
                                } p-2`}
                            >
                                <div className="mb-1 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-white/90">
                                            {opp.tokenSymbol}
                                        </span>
                                        <span
                                            className={`text-xs font-medium ${
                                                opp.type === "premium" ? "text-green-400" : "text-red-400"
                                            }`}
                                        >
                                            {opp.deviationPercent > 0 ? "+" : ""}
                                            {opp.deviationPercent.toFixed(2)}%
                                        </span>
                                    </div>
                                    <div
                                        className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                                            opp.type === "premium"
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-red-500/20 text-red-400"
                                        }`}
                                    >
                                        {opp.type === "premium" ? "Sell DEX, Buy CEX" : "Buy DEX, Sell CEX"}
                                    </div>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <div className="flex items-baseline justify-between text-white/70">
                                        <span>DEX Price ({opp.source})</span>
                                        <span className="font-mono text-white/90">
                                            {formatCurrencyValue(opp.dexPrice, currency, exchangeRates)}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline justify-between text-white/70">
                                        <span>CoinGecko FMV (CEX)</span>
                                        <span className="font-mono text-white/90">
                                            {formatCurrencyValue(opp.fmvPrice, currency, exchangeRates)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 text-xs text-white/50">
                        Price deviations reflect market inefficiencies between DEX and CEX liquidity.
                    </div>
                </div>
            )}

            {/* Your Position (consolidated: value, LP tokens, APY, tokens) */}
            <div className="mb-3 rounded-lg border border-white/10 bg-black/20 p-3">
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
                            ETCswap V2 pool ({poolName}) LP Tokens
                        </div>
                        <div className="flex items-baseline gap-3">
                            <LPTokenAmount value={lpBalanceFormatted} />
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
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/90 transition hover:border-white/30 hover:bg-white/10"
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

/**
 * V3 Position Card Component
 *
 * Full-featured renderer for ETCswap V3 concentrated liquidity positions.
 * V3 positions are NFT-based with liquidity concentrated in a specific tick range.
 */
function V3PositionCard({ position, chainId, prices, derivedPrices, currency, exchangeRates }: { position: ETCswapV3Position; chainId: number; prices?: ETCPriceData; derivedPrices?: Map<string, DerivedPrice>; currency: CurrencyCode; exchangeRates?: ExchangeRates; }) {
    const { token0, token1, feeTier, tickLower, tickUpper, currentTick, liquidity, tokensOwed0, tokensOwed1 } = position;

    // Look up token metadata
    const token0Info = getTokenInfo(token0.address, chainId);
    const token1Info = getTokenInfo(token1.address, chainId);

    // Pool name
    const poolName = `${token0.symbol}/${token1.symbol}`;

    // Fee tier as percentage (feeTier is in basis points: 500 = 0.05%)
    const feePercent = feeTier / 10000;

    // Determine if position is in range
    const inRange = currentTick >= tickLower && currentTick <= tickUpper;

    // Calculate token amounts from liquidity using V3 math
    const { amount0, amount1 } = getTokenAmountsFromLiquidity(
        liquidity,
        currentTick,
        tickLower,
        tickUpper,
        token0.decimals,
        token1.decimals
    );

    // Get token prices
    const token0Price = prices && derivedPrices ? getTokenPrice(token0.address, prices, derivedPrices) : null;
    const token1Price = prices && derivedPrices ? getTokenPrice(token1.address, prices, derivedPrices) : null;

    // Calculate position value
    const positionValueUSD = calculateV3PositionValue(amount0, amount1, token0Price, token1Price);

    // Price range bounds
    const priceLower = tickToPrice(tickLower);
    const priceUpper = tickToPrice(tickUpper);
    const priceCurrent = tickToPrice(currentTick);

    // Detect full range position (tick range approximately -887272 to 887272)
    // Using a threshold of ±800000 to catch "full range" positions
    const isFullRange = tickLower <= -800000 && tickUpper >= 800000;

    // Determine price sources for both tokens (same logic as V2)
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

    // Detect arbitrage opportunities (1% threshold)
    const [showArbitrageDetails, setShowArbitrageDetails] = useState(false);
    const arbitrageOpportunities = prices ? detectArbitrageOpportunities(position, prices, 1.0) : [];
    const hasArbitrage = arbitrageOpportunities.length > 0;

    // External pool link - V3 uses /pools/{tokenId}?chain={classic|mordor} format
    // Format: https://v3.etcswap.org/#/pools/95?chain=classic (mainnet) or https://v3.etcswap.org/#/pools/95?chain=mordor (testnet)
    const chainParam = chainId === 63 ? "mordor" : "classic";
    const poolUrl = `https://v3.etcswap.org/#/pools/${position.tokenId}?chain=${chainParam}`;

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            {/* Header: Token Logos + Pool name + V3 badge + Fee tier */}
            <div className="mb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center -space-x-2">
                            <TokenLogo logoURI={token0Info?.logoURI} symbol={token0.symbol} size="sm" />
                            <TokenLogo logoURI={token1Info?.logoURI} symbol={token1.symbol} size="sm" />
                        </div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-white/90">{poolName}</h3>
                            <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-400">
                                ETCswap V3
                            </span>
                            <span className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 text-xs font-medium text-white/70">
                                {feePercent}%
                            </span>
                            {inRange ? (
                                <span className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 text-xs font-medium text-white/70">
                                    In Range
                                </span>
                            ) : (
                                <span className="rounded border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 text-xs font-medium text-yellow-400">
                                    Out of Range
                                </span>
                            )}
                            {hasArbitrage && (
                                <button
                                    onClick={() => setShowArbitrageDetails(!showArbitrageDetails)}
                                    className="rounded border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 text-xs font-medium text-yellow-400 transition hover:bg-yellow-500/20"
                                    title="Click to view arbitrage opportunities"
                                >
                                    Arbitrage {arbitrageOpportunities.length > 1 ? `(${arbitrageOpportunities.length})` : ""}
                                </button>
                            )}
                        </div>
                    </div>
                    <a
                        href={poolUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-white/55 transition hover:text-white/80"
                        title="View on ETCswap V3"
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

            {/* Arbitrage Opportunities (expandable) */}
            {hasArbitrage && showArbitrageDetails && (
                <div className="mb-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs font-medium uppercase tracking-wide text-yellow-400">
                            Arbitrage Opportunities Detected
                        </span>
                        <span className="text-xs text-yellow-400/70">
                            (DEX vs CoinGecko FMV)
                        </span>
                    </div>
                    <div className="space-y-2">
                        {arbitrageOpportunities.map((opp) => (
                            <div
                                key={opp.tokenAddress}
                                className={`rounded-lg border ${
                                    opp.type === "premium"
                                        ? "border-green-500/30 bg-green-500/10"
                                        : "border-red-500/30 bg-red-500/10"
                                } p-2`}
                            >
                                <div className="mb-1 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-white/90">
                                            {opp.tokenSymbol}
                                        </span>
                                        <span
                                            className={`text-xs font-medium ${
                                                opp.type === "premium" ? "text-green-400" : "text-red-400"
                                            }`}
                                        >
                                            {opp.deviationPercent > 0 ? "+" : ""}
                                            {opp.deviationPercent.toFixed(2)}%
                                        </span>
                                    </div>
                                    <div
                                        className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                                            opp.type === "premium"
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-red-500/20 text-red-400"
                                        }`}
                                    >
                                        {opp.type === "premium" ? "Sell DEX, Buy CEX" : "Buy DEX, Sell CEX"}
                                    </div>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <div className="flex items-baseline justify-between text-white/70">
                                        <span>DEX Price ({opp.source})</span>
                                        <span className="font-mono text-white/90">
                                            {formatCurrencyValue(opp.dexPrice, currency, exchangeRates)}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline justify-between text-white/70">
                                        <span>CoinGecko FMV (CEX)</span>
                                        <span className="font-mono text-white/90">
                                            {formatCurrencyValue(opp.fmvPrice, currency, exchangeRates)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 text-xs text-white/50">
                        Price deviations reflect market inefficiencies between DEX and CEX liquidity.
                    </div>
                </div>
            )}

            {/* Your Position (comprehensive view matching V2) */}
            <div className="mb-3 rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="mb-3 flex items-baseline justify-between">
                    <div className="text-xs text-white/70">Your Position Value</div>
                    {positionValueUSD !== null && (
                        <div className="font-mono text-lg font-semibold text-white/95">
                            {formatCurrencyValue(positionValueUSD, currency, exchangeRates)}
                        </div>
                    )}
                </div>

                {/* NFT Position ID + Manage Button */}
                <div className="mb-3 grid grid-cols-2 gap-4 border-b border-white/10 pb-3">
                    <div>
                        <div className="mb-1 text-xs text-white/55">
                            ETCswap V3 NFT Position
                        </div>
                        <div className="font-mono text-sm font-medium text-white/90">
                            #{position.tokenId.toString()}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-white/40">
                                {position.poolAddress.slice(0, 6)}...{position.poolAddress.slice(-4)}
                            </span>
                            <CopyButton text={position.poolAddress} label="Copy" size="xs" variant="ghost" />
                        </div>
                    </div>

                    {/* Manage Liquidity Button */}
                    <div className="flex items-start justify-end">
                        <a
                            href={poolUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/90 transition hover:border-white/30 hover:bg-white/10"
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

                {/* Token Amounts (left) + Price Range & Asset Composition (right) */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Left: Your Token Amounts */}
                    <div className="space-y-3">
                        <div>
                            <div className="mb-2 text-xs text-white/55">Your Token Amounts</div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs text-white/55">{token0.symbol}</div>
                                    <div className="mt-0.5 font-mono text-sm text-white/90">
                                        {formatNumber(amount0, 6, 2)}
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
                                        {formatNumber(amount1, 6, 2)}
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

                        {/* Uncollected Fees */}
                        {(tokensOwed0 > BigInt(0) || tokensOwed1 > BigInt(0)) && (
                            <div>
                                <div className="mb-2 text-xs text-white/55">Uncollected Fees</div>
                                <div className="space-y-1">
                                    {tokensOwed0 > BigInt(0) && (
                                        <div className="text-xs text-white/70">
                                            <span className="font-mono">{formatTokenBalance(formatUnits(tokensOwed0, token0.decimals))}</span> {token0.symbol}
                                        </div>
                                    )}
                                    {tokensOwed1 > BigInt(0) && (
                                        <div className="text-xs text-white/70">
                                            <span className="font-mono">{formatTokenBalance(formatUnits(tokensOwed1, token1.decimals))}</span> {token1.symbol}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Price Range + Asset Composition */}
                    <div className="space-y-3">
                        {/* Price Range */}
                        <div>
                            <div className="mb-2 text-xs text-white/55">
                                Price Range ({token1.symbol} per {token0.symbol})
                                {isFullRange && (
                                    <span className="ml-2 rounded bg-blue-500/10 px-1.5 py-0.5 text-xs font-medium text-blue-400">
                                        Full Range
                                    </span>
                                )}
                            </div>
                            <div className="space-y-1 text-xs">
                                <div className="flex items-baseline justify-between text-white/70">
                                    <span>Min Price</span>
                                    <span className="font-mono text-white/90">
                                        {isFullRange ? "0" : formatNumber(priceLower, 6, 2)}
                                    </span>
                                </div>
                                <div className="flex items-baseline justify-between text-white/70">
                                    <span>Current Price</span>
                                    <span className="font-mono text-white/90">{formatNumber(priceCurrent, 6, 2)}</span>
                                </div>
                                <div className="flex items-baseline justify-between text-white/70">
                                    <span>Max Price</span>
                                    <span className="font-mono text-white/90">
                                        {isFullRange ? "∞" : formatNumber(priceUpper, 6, 2)}
                                    </span>
                                </div>
                            </div>
                            {!inRange && (
                                <div className="mt-2 text-xs text-yellow-400/70">
                                    ⚠ Position not earning fees (out of range)
                                </div>
                            )}
                        </div>

                        {/* Asset Composition */}
                        {token0Price !== null && token1Price !== null && positionValueUSD !== null && (
                            <div>
                                <div className="mb-2 text-xs text-white/55">Current Asset Composition</div>
                                {(() => {
                                    const token0ValueUSD = amount0 * token0Price;
                                    const token1ValueUSD = amount1 * token1Price;
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
                                            {!inRange && (
                                                <div className="mt-1 text-xs text-yellow-400/70">
                                                    ⚠ Ratio will shift as price moves back into range
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
