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

### Phase 1: Portfolio Read-Only (Current)
**Goal:** Enable unified portfolio observation across ETC DeFi protocols

**Deliverables:**
- 🔄 Portfolio read-only surfaces (balances, positions, activity)
- 🔄 Protocol adapters for data fetching (RPC + protocol-specific)
- 🔄 Transaction history display
- 🔄 Basic P&L tracking
- 📋 Real-time balance updates
- 📋 Multi-protocol position aggregation

**Success Criteria:**
- Users can connect wallet and view balances/positions across ETC DeFi protocols
- Read-only observation works without transaction signing
- Multi-protocol aggregation displays unified data
- Portfolio serves as foundation for Deploy execution layer

### Phase 2: Mining OS
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

### Phase 3: DeFi Automation
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

### Phase 4: Full Integration
**Goal:** Complete the capital flow loop across all modules

**Deliverables:**
- Mining → strategies (complete Produce-to-Deploy loop)
- Brale → strategies (fiat onramp integration)
- Multi-chain → ETC (cross-chain migration pathways)
- Markets integration (DEX aggregation + Brale stablecoins)

**Success Criteria:**
- Miners deploy earned ETC into strategies automatically
- Fiat users onboard via Brale and deploy into yield
- Multi-chain users migrate capital to ETC seamlessly
- Full economic OS operational: Production → Onboarding → Deployment → Retention

## Near-Term Priorities

1. **Complete Portfolio read-only** (Phase 1)
2. **Enable Markets with DEX aggregation** (Phase 2 prep)
3. **Build Mining OS payout detection** (Phase 2)
4. **Integrate Brale stablecoin contracts** (Phase 2)
5. **Build strategy builder** (Phase 3)

## Non-Goals

What we're NOT building:
- Mining pool software or rig firmware
- Stablecoin backing/reserves (Brale handles)
- Underlying DeFi protocols (we aggregate existing)
- HiveOS API integration (we build custom mining dashboard)
- DeFi Saver integration (we build custom automation)
