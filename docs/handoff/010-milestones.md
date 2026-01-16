# Classic OS Milestones

## Purpose
Track discrete implementation milestones for building the complete economic operating system.

## Product Context

Classic OS combines:
- **Mining OS** (custom-built) - Capital production
- **DeFi Automation** (custom-built) - Portfolio observation + Deploy execution
- **Brale Integration** (partner) - Stablecoin onboarding
- **Multi-EVM Support** - Distribution layer

## Current Status (as implemented)
- Baseline: Navigation, shells, and gating are in place; Deploy/Markets/Portfolio capabilities are disabled in the registry.
- Produce: Mode derived from family (mine for ETC, stake for ETH); mining/staking pages exist but surfaces are empty states.
- Workspace/state: Active chain selection persists via localStorage; RequirementGate blocks when wallet missing or on mismatched chain.
- Observability: Block explorer links flow from the network registry; other observability surfaces are placeholders.

## Implementation Milestones

### Phase 0: Foundation Architecture (Complete)
**Goal:** Establish product vision and build extensible technical foundation

**Deliverables:**
- ✅ Classic OS concept and product vision defined
- ✅ Product-market fit research (HiveOS, DeFi Saver comparative analysis)
- ✅ 2025/2026 best practices: Tech stack selected (Next.js 16, React 19, wagmi 3, viem 2, TypeScript 5)
- ✅ Modular architecture: Future-proof shell structure, multi-EVM + non-EVM extensible
- ✅ Capability registry system (network-based feature gating)
- ✅ Workspace state management (localStorage + cross-tab sync)
- ✅ Three-layer architecture pattern (Adapter → Hook → UI)
- ✅ RequirementGate for wallet/chain enforcement
- ✅ Read-only by default architecture
- ✅ UI primitives library (ModuleHeader, Panel, EmptyState, CapabilityBadge, StatusPill)
- ✅ Design language and branding guidelines
- ✅ Agent infrastructure (Claude Code, Copilot instructions)
- ✅ First modernized product suite on Ethereum Classic

**Success Criteria:**
- ✅ Modular shell operational with all four surfaces (Produce, Portfolio, Deploy, Markets)
- ✅ Multi-EVM chain switching works
- ✅ Capability gating prevents unauthorized access
- ✅ Development environment follows 2025/2026 best practices
- ✅ Architecture supports future protocol integrations without refactoring

### Phase 1: Portfolio Read-Only (Complete - January 15, 2026)
**Goal:** Enable unified portfolio observation across ETC DeFi protocols

**Deliverables:**
- ✅ Portfolio read-only surfaces (balances, positions, activity)
- ✅ Protocol adapters for data fetching (RPC + ETCswap V2)
- ✅ Activity explorer integration (block explorer links)
- ✅ Portfolio aggregation with USD values
- ✅ Real-time balance updates (60-120s intervals)
- ✅ Multi-protocol position aggregation
- ✅ **Derived token price system** from LP pool ratios (breakthrough)
- ✅ Price source attribution (CoinGecko vs ETCswap)
- ✅ 24h price change indicators
- ✅ ETC price sparkline chart
- ✅ LP position APY estimates
- ✅ Enhanced LP position cards with asset composition visualization
- ✅ Manual refresh controls
- ✅ Testnet indicators

**Success Criteria:**
- ✅ Users can connect wallet and view balances/positions across ETC DeFi protocols
- ✅ Read-only observation works without transaction signing
- ✅ Multi-protocol aggregation displays unified USD-denominated data
- ✅ Portfolio serves as foundation for Deploy execution layer
- ✅ Derived price system enables pricing for all ecosystem tokens
- ✅ Price transparency builds user trust

**See:** [032-phase1-completion-report.md](032-phase1-completion-report.md) for complete details

### Phase 1.3: Portfolio Enhancements (Current)
**Goal:** Complete portfolio observation capabilities

**Deliverables:**
- 🔄 Multi-fiat currency support (EUR, GBP, JPY, CNY, etc.)
- 📋 ETCswap V3 concentrated liquidity positions
- 📋 ETCswap Launchpad emerging markets integration

**Success Criteria:**
- Users can view portfolio in their preferred fiat currency
- ETCswap V3 positions display with tick range visualization
- Launchpad token holdings and vesting schedules visible

### Phase 2: Markets Module
**Goal:** Enable liquidity access and stablecoin onboarding

**Deliverables:**
- DEX aggregation (ETCswap V2/V3 swap interface)
- Brale stablecoin integration (minting/redemption)
- Quote aggregation across DEXs
- Slippage protection and transaction preview
- Multi-route swap optimization

**Success Criteria:**
- Users can swap tokens via ETCswap directly from Classic OS
- Brale stablecoins can be minted and redeemed
- Best prices shown across multiple DEX routes
- Transaction preview shows expected outcomes before signing
- Markets module serves as liquidity layer for Deploy strategies

### Phase 3: Deploy Module (DeFi Automation)
**Goal:** Enable strategy execution and automated position management

**Deliverables:**
- Visual strategy builder (no-code interface)
- Position health monitoring with liquidation alerts
- Automated execution engine (stop-loss, take-profit, rebalancing)
- Multi-protocol execution batching
- Simulation mode (dry-run before execution)

**Success Criteria:**
- Users can build strategies visually without code
- Position health warnings appear before liquidation risk
- Automated rules execute without manual intervention
- Multi-step strategies execute in single transaction
- Deploy builds on Portfolio observation and Markets liquidity layers

### Phase 4: Mining OS
**Goal:** Transform mining into capital inflow source

**Deliverables:**
- RPC-based payout detection for ETC mining
- Earnings tracking and visualization dashboard
- Mining → strategy recommendation engine
- Capital flow pathways from Produce to Deploy

**Success Criteria:**
- Miners see payouts automatically detected
- Earnings dashboard shows real-time mining income
- Strategy suggestions appear based on mining income
- One-click pathway from earned ETC to yield strategies
- Complete Produce → Portfolio → Deploy capital flow

### Phase 5: Full Integration
**Goal:** Complete the capital flow loop across all modules

**Deliverables:**
- Mining → strategies (complete Produce-to-Deploy loop)
- Brale → strategies (fiat onramp integration)
- Multi-chain → ETC (cross-chain migration pathways)
- Cross-module automation and optimization

**Success Criteria:**
- Miners deploy earned ETC into strategies automatically
- Fiat users onboard via Brale and deploy into yield
- Multi-chain users migrate capital to ETC seamlessly
- Full economic OS operational: Production → Onboarding → Deployment → Retention
- All modules work together as unified system

## Near-Term Priorities

1. **Complete Portfolio enhancements** (Phase 1.3)
   - Multi-fiat currency support
   - ETCswap V3 positions
   - ETCswap Launchpad integration

2. **Enable Markets with DEX aggregation** (Phase 2)
   - ETCswap V2/V3 swap interface
   - Brale stablecoin contracts
   - Quote aggregation

3. **Build Deploy module** (Phase 3)
   - Strategy builder
   - Automated execution engine
   - Position health monitoring

4. **Integrate Mining OS** (Phase 4)
   - Payout detection
   - Earnings dashboard
   - Mining → strategy recommendations

5. **Complete full integration** (Phase 5)
   - Cross-module automation
   - Complete capital flow loop

## Non-Goals

What we're NOT building:
- Mining pool software or rig firmware
- Stablecoin backing/reserves (Brale handles)
- Underlying DeFi protocols (we aggregate existing)
- HiveOS API integration (we build custom mining dashboard)
- DeFi Saver integration (we build custom automation)
