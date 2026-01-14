# Classic OS Roadmap Sequence

## Purpose
Define the ordered delivery sequence for building Classic OS as a complete economic operating system.

## Product Vision

Classic OS = Mining OS + DeFi Automation + Brale Integration + Multi-EVM Support

**Four Capital Flows:**
1. **Production** (Mining OS) - Create capital through mining
2. **Onboarding** (Brale) - Enter from fiat or other chains
3. **Deployment** (DeFi Automation) - Allocate into strategies
4. **Retention** (Yield) - Keep capital productive on-chain

## Implementation Sequence

### Phase 0: Foundation Architecture (Complete - 2025)
**Goal:** Establish product vision and build extensible technical foundation

**What We Built:**
- Product concept and vision (Mining OS + DeFi Automation + Brale + Multi-EVM)
- Product-market fit research (HiveOS, DeFi Saver comparative analysis)
- Modern tech stack (Next.js 16, React 19, wagmi 3, viem 2, TypeScript 5)
- Modular shell architecture (future-proof, multi-EVM + non-EVM extensible)
- Capability registry system
- Workspace state management
- Three-layer architecture pattern
- Read-only by default enforcement
- UI primitives library
- Design language and branding
- Agent infrastructure (Claude Code, Copilot)

**Achievements:**
- ✅ First modernized product suite on Ethereum Classic
- ✅ Foundation that supports future growth without major refactoring
- ✅ Multi-EVM chain support operational
- ✅ All four module shells (Produce, Portfolio, Deploy, Markets) scaffolded

**Why This Was Critical:**
- Prevented technical debt by establishing patterns upfront
- Enabled rapid development of features on solid foundation
- Future-proofed architecture for protocol integrations
- Positioned Classic OS as modern, professionally-built product

### Phase 1: Portfolio Read-Only (Current - Q1 2026)
**Goal:** Enable unified portfolio observation across ETC DeFi protocols

**What We're Building:**
- Portfolio module (read-only observation layer of DeFi Automation)
- Protocol adapters for balance/position fetching
- RPC integration for on-chain data
- Multi-protocol aggregation logic
- Transaction history display
- Basic P&L tracking

**Deliverables:**
- Users can connect wallet and view unified portfolio
- Cross-protocol balances and positions displayed
- Transaction history visible with proper formatting
- Basic P&L tracking across protocols
- Real-time balance updates

**Capability Flips:**
- `capabilities.portfolio` → `true` (read-only)

**Why This Phase:**
- Observation before execution (ADR 006: Read-Only by Default)
- Foundation for DeFi Automation system (Portfolio + Deploy)
- No transaction signing required (lower risk, faster delivery)
- Validates three-layer architecture pattern in production
- Enables miners and holders to see capital before deploying

### Phase 2: Mining OS (Q2 2026)
**Goal:** Transform mining into capital inflow source

**What We're Building:**
- RPC-based payout detection (not pool API integration)
- Mining earnings tracking dashboard
- Mining → strategy recommendation engine
- Capital flow pathways (Produce → Deploy)

**Deliverables:**
- Auto-detection of mining payouts
- Real-time earnings dashboard
- Strategy templates optimized for mining income
- Direct pathway from earned ETC to yield opportunities

**Capability Flips:**
- Enhanced `produce` mode for mining visualization
- Mining → Deploy integration enabled

**Why This Second:**
- Miners are first-class users (ADR 002)
- Capital production is start of economic flow
- Differentiates from pure DeFi interfaces
- Validates Mining OS custom product (not HiveOS integration)

### Phase 3: DeFi Automation (Q3 2026)
**Goal:** Enable strategy execution and automated position management

**What We're Building:**
- Visual strategy builder (no-code interface)
- Position health monitoring with liquidation alerts
- Automated execution engine (stop-loss, take-profit, rebalancing)
- Multi-protocol execution batching
- Simulation mode (dry-run before execution)

**Deliverables:**
- Users can build strategies visually
- Automated position management active
- Multi-step strategies execute in single transaction
- Real-time health monitoring prevents liquidations

**Capability Flips:**
- `capabilities.deploy` → `true` (execution enabled)
- `capabilities.markets` → `true` (liquidity access)

**Why This Third:**
- Completes DeFi Automation system (Portfolio observation + Deploy execution)
- Enables capital to become productive
- Validates custom automation (not DeFi Saver integration)
- Requires Portfolio (observation) and Markets (liquidity) first

### Phase 4: Full Integration (Q4 2026)
**Goal:** Complete the capital flow loop with Brale and multi-chain

**What We're Building:**
- Brale stablecoin integration (minting, redemption, ACH onramp)
- Multi-chain portfolio view and bridge interfaces
- Mining → strategies automated pathways
- Fiat → strategies via Brale integration

**Deliverables:**
- Fiat users onboard via Brale ACH
- Multi-chain users migrate capital to ETC
- Miners automatically deploy into strategies
- Complete economic OS: Production → Onboarding → Deployment → Retention

**Capability Flips:**
- Brale integration active (business partner)
- Multi-chain data aggregation enabled
- Full Mining → Deploy automation live

**Why This Last:**
- Requires all other phases complete
- Brale partnership coordination needed
- Multi-chain distribution layer is ETC enhancement, not replacement
- Completes all three user journeys (miner, fiat user, multi-chain user)

## What We Build vs What We Integrate

### We Build (Custom Products)
- **Mining OS**: Payout detection, earnings dashboard, capital flow pathways (inspired by HiveOS)
- **DeFi Automation**: Portfolio + Deploy modules (inspired by DeFi Saver)
- **Multi-EVM Interface**: Cross-chain portfolio, bridge interfaces

### We Integrate (Partners/Protocols)
- **Brale**: Stablecoin contracts, ACH onramp, USDC bridging (business partner)
- **DEX Protocols**: ETCswap and other ETC DEXs (protocol adapters, not bespoke exchange)

### We Don't Build
- Mining pools or rig firmware
- Stablecoin backing/reserves
- Underlying DeFi protocols
- HiveOS/DeFi Saver API integrations

## Success Metrics by Phase

**Phase 1:** Users viewing unified portfolio across ETC DeFi
**Phase 2:** % of mining rewards staying on-chain (not exiting to USD/BTC)
**Phase 3:** TVL in automated strategies, strategy execution volume
**Phase 4:** Fiat onboarding volume (Brale), cross-chain inflows to ETC

## Dependencies

**Phase 1 → Phase 2:**
- Portfolio observation enables Mining → strategy recommendations

**Phase 2 → Phase 3:**
- Mining capital flows validate Deploy execution pathways

**Phase 3 → Phase 4:**
- DeFi Automation must work before adding Brale onboarding
- Strategy execution must be stable before multi-chain integration

## Current Status (January 2026)

**✅ Phase 0 Complete (Foundation Architecture):**
- Product vision and tech stack (2025/2026 best practices)
- Modular shell architecture (multi-EVM + non-EVM extensible)
- Capability registry, workspace state, three-layer pattern
- Read-only by default architecture
- UI primitives library
- Design language and branding
- Agent infrastructure modernization
- First modernized product suite on Ethereum Classic

**🔄 Phase 1 In Progress (Portfolio Read-Only):**
- Portfolio read-only surfaces
- Protocol adapters for data fetching
- Wallet connectivity and balance display

**📋 Next Up:**
- Complete Portfolio read-only, flip `capabilities.portfolio` to true
- Begin Mining OS payout detection (Phase 2)
- Plan Markets DEX aggregation (Phase 2 prep)
- Integrate Brale stablecoin contracts (Phase 2 prep)
