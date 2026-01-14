# Classic OS

**The economic operating system for on-chain capital on Ethereum Classic.**

Classic OS is a unified control plane that solves the capital flow problem on ETC: attracting capital inflows, enabling productive deployment, and making them sustainable through yield generation and capital retention.

---

## The Problem

Ethereum Classic has complete DeFi infrastructure (DEXs, lending, stablecoins, launchpads) and a unique Proof-of-Work miner base that continuously produces capital. But this capital doesn't stay on-chain because:

1. **Miners have no on-chain deployment options** — they mine ETC and immediately exit to USD/BTC
2. **Multi-chain users don't see opportunity on ETC** — familiar DeFi tools exist on Ethereum/Arbitrum but aren't accessible on ETC
3. **Fiat users can't easily enter ETC** — no simple on/off ramp from traditional finance to ETC stablecoins
4. **Capital has no clear purpose** — holders don't understand what to do with ETC once they own it

The infrastructure exists. The capital inflows exist. What's missing is the **interface that connects them**.

---

## The Solution: Classic OS

Classic OS is four integrated modules that work together to create a complete economic OS:

### 1. Capital Production (Mining OS)
**Inspired by HiveOS, built for ETC capital flows**

Convert PoW mining operations into on-chain capital. Miners see their earned ETC not as a commodity to sell, but as productive capital ready to deploy.

- Mining dashboard with real-time earnings tracking (custom-built)
- Payout detection and monitoring (RPC-based)
- Auto-detection of mining payouts
- Direct pathway from earned ETC to yield opportunities
- Strategy templates optimized for mining income

**Value:** Transforms mining into a capital inflow source instead of a capital exit vector.

### 2. Capital Deployment (Portfolio & Yield OS)
**Inspired by DeFi Saver, built for ETC DeFi**

Unified interface for discovering opportunities and executing strategies across all ETC DeFi protocols. Users manage positions, optimize yields, and automate complex multi-protocol strategies.

- Unified portfolio dashboard across all DeFi positions (custom-built)
- Protocol discovery with risk/yield filtering
- Strategy builder (leveraged yield, debt shifting, liquidation protection)
- Automated position management (stop-loss, take-profit, rebalancing)
- Real-time health monitoring and liquidation alerts
- CEX market integration for cross-chain price discovery

**Value:** Makes capital productive through accessible DeFi opportunities and removes friction from strategy execution.

### 3. Capital Onboarding (Stablecoin & Fiat Ramp)
**Integration with Brale (business partner)**

Direct connection from traditional finance into ETC. Users can enter the ecosystem from fiat via Brale's ACH integration or migrate from other chains via Circle stablecoin bridging.

- Fiat on-ramp: ACH transfers from USD bank accounts to ETC-native stablecoin
- Stablecoin bridging: Convert Circle USDC to Brale ETC stablecoin (1:1)
- Stablecoin ecosystem management (mint, redeem, trade)
- Use stablecoins as base pairs for yield strategies
- Transparent reserve backing and stability mechanics

**Value:** Removes the barrier to entry for both retail (fiat) and multi-chain (bridging) users.

### 4. Capital Distribution (Multi-Chain Interface)
**EVM liquidity bridge to ETC**

Surface ETC as a viable destination to users already active on Ethereum, Arbitrum, Base, and other EVM chains. Show equivalent opportunities, bridge assets efficiently, and demonstrate why ETC is worth exploring.

- Multi-chain portfolio view (assets across EVM chains)
- ETC-specific opportunity showcase
- Cross-chain liquidity bridges with real-time rates
- Educational framework: why ETC DeFi is different
- Automated swap paths (CEX → Bridge → ETC DEX)

**Value:** Converts multi-chain users into ETC-native users by making the transition frictionless.

---

## Core Product Surfaces

Classic OS organizes activity by economic intent:

- **Produce** — create capital through mining
  (Mining OS: earnings dashboard, payout detection, rig monitoring for ETC PoW)

- **Portfolio** — observe capital and positions
  (Cross-protocol dashboard: balances, DeFi positions, transaction history, P&L tracking)

- **Deploy** — allocate capital into strategies
  (Strategy builder, automated execution, position management, liquidation protection)

- **Markets** — access liquidity and stablecoins
  (DEX aggregation, Brale stablecoin integration, fiat on-ramp, cross-chain bridging)

Not all surfaces are active on all networks. Availability depends on consensus type, protocol support, and system readiness.

---

## Integrated DeFi Protocols

Classic OS is built as a **protocol-agnostic control plane**. It surfaces and aggregates protocols deployed on ETC, starting with existing infrastructure and expanding as new protocols launch.

**Currently Deployed:**
- **DEXs:** AMM (Uniswap V2 style) + CLMM (Uniswap V3 style)
- **Stablecoins:** Brale native stablecoin minting/redemption
- **Launchpad:** Token launches and secondary markets

**Planned Integrations:**
- **Lending:** Collateral management, borrowing, yield generation
- **Oracles:** Price feeds and data infrastructure
- **Bridges:** Cross-chain asset movement
- **Yield Protocols:** LP automation, reward aggregation

**Architecture Principle:** Classic OS is the shell. Protocols are the contents. As protocols launch, they integrate through standardized adapters.

---

## Why Classic OS Works

1. **Solves real problems:**
   - Miners want to deploy capital but have no interface ✓
   - Multi-chain users want higher yields and simpler UX ✓
   - Fiat users need on-ramps ✓
   - ETC hodlers seek yield opportunities ✓

2. **Closes the capital loop:**
   - Production (mining) → Onboarding (Brale) → Deployment (DeFi) → Retention (yield)

3. **Network effects:**
   - More users = more TVL = better yields = attracts more users
   - More miners on-chain = more liquidity = better execution

4. **ETC-native:**
   - Optimized for ETC's unique position (PoW + programmability)
   - Leverages miner base as capital source
   - Differentiates from Ethereum-first tools

---

## Project Status

Classic OS is under active development.

Current focus: Building the OS foundation (portfolio dashboard, wallet connectivity, protocol adapters) to support future integrations (HiveOS mining, Brale stablecoin, DeFi Saver automation).

Some modules are intentionally scaffolded while core architecture and safety boundaries are established.

---

## For Contributors

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, workflow, and guidelines.

## For AI Coding Assistants

- **Claude Code:** [.claude/instructions.md](.claude/instructions.md)
- **GitHub Copilot:** [.github/copilot-instructions.md](.github/copilot-instructions.md)

## Architecture Documentation

- **Patterns & Design:** [docs/architecture/patterns.md](docs/architecture/patterns.md)
- **Strategy & Vision:** [docs/architecture/decisions/](docs/architecture/decisions/)

---

## Key Resources

- **Website:** https://classicos.org
- **Chain:** Ethereum Classic (ETC)
- **Docs:** [docs/](docs/)

---

**Classic OS is the bridge between capital production and capital utility on Ethereum Classic.**
