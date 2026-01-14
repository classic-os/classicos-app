# Classic OS Product Model

## Purpose
Define Classic OS as the economic operating system for on-chain capital on Ethereum Classic.

## Ecosystem Context

Classic OS is the DeFi layer of a cohesive product suite building the economic infrastructure for Ethereum Classic:

**Product Suite Alignment:**
- **EthereumClassic.com** - Network information and education
- **Classic OS** (this product) - Economic operating system for capital flows
- **ETCswap** - DEX protocols (AMM + CLMM)
- **Classic USD** - ETC-native stablecoin (via Brale partnership)
- **ETCswap Launchpad** - Token launches and secondary markets

**Client Infrastructure:**
- **Fukuii** - First-class enterprise ETC client (only native client with no upstream dependencies)
- **Core-Geth** - Legacy client (maintenance mode, pivoting away from Ethereum Foundation dependencies)

**Value Proposition:**
Classic OS enables the only pathway where global energy sources can be converted into a yield-bearing asset on a single Proof-of-Work chain, maintaining ETC's non-custodial security properties while generating sustainable yields through DeFi.

**Economic Flywheel:**
1. Miners produce ETC (capital creation)
2. Mining OS directs capital into DeFi strategies (capital deployment)
3. Increased DeFi activity generates transaction fees (miner revenue increases)
4. ETC holders earn protocol fees via liquidity provision (capital retention)
5. Higher yields attract more capital (positive feedback loop)

## Product Vision

Classic OS is a complete economic OS combining:

1. **Mining OS** (custom-built, inspired by HiveOS)
   - Mining dashboard with real-time earnings tracking
   - Payout detection and monitoring (RPC-based)
   - Direct pathway from earned ETC to yield opportunities

2. **DeFi Automation** (custom-built, inspired by DeFi Saver)
   - Unified portfolio dashboard across all DeFi positions
   - Strategy builder (leveraged yield, debt shifting, liquidation protection)
   - Automated position management and real-time health monitoring

3. **Stablecoin Integration** (Brale business partner)
   - Fiat on-ramp via ACH integration
   - Circle USDC bridging (1:1 conversion)
   - Stablecoin ecosystem management

4. **Multi-EVM Interface** (distribution layer)
   - EVM liquidity bridge to ETC
   - Cross-chain portfolio view
   - Automated swap paths

## Core Product Surfaces

Classic OS organizes activity by economic intent:

- **Produce** — create capital through mining (Mining OS: earnings dashboard, payout detection, rig monitoring for ETC PoW)
- **Portfolio** — observe capital and positions (Cross-protocol dashboard: balances, DeFi positions, transaction history, P&L tracking)
- **Deploy** — allocate capital into strategies (Strategy builder, automated execution, position management, liquidation protection)
- **Markets** — access liquidity and stablecoins (DEX aggregation, Brale stablecoin integration, fiat on-ramp, cross-chain bridging)

## Current Status (as implemented)
- Foundation: Navigation, shells, and capability gating in place
- Capability registry: [src/lib/ecosystems/registry.ts](src/lib/ecosystems/registry.ts) controls feature availability
- Workspace state: [src/lib/state/workspace.ts](src/lib/state/workspace.ts) manages active chain and testnet visibility
- Architecture: Three-layer pattern (Adapter → Hook → UI) with read-only by default

## Development Phases

**Phase 0 (Complete):** Foundation Architecture
- Product vision, tech stack selection (2025/2026 best practices)
- Modular shell architecture (future-proof, multi-EVM extensible)
- Capability registry, workspace state, three-layer pattern
- Design language and branding
- Agent infrastructure modernization

**Phase 1 (Current):** Portfolio Read-Only - portfolio dashboard, wallet connectivity, protocol adapters

**Phase 2:** Mining OS - payout detection, earnings tracking, mining dashboard UI, strategy recommendations

**Phase 3:** DeFi Automation - strategy builder, position health monitoring, execution engine, automation rules

**Phase 4:** Full Integration - Mining → strategies (full loop), Brale → strategies (fiat → yield), Multi-chain → ETC
