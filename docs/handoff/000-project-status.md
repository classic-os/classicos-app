# Classic OS Project Status

## Purpose
Summarize the current implementation state of Classic OS as a complete economic operating system.

## Product Context

Classic OS is a complete product combining:
1. **Mining OS** (custom-built, inspired by HiveOS) - Mining dashboard, payout detection, capital flow pathways
2. **DeFi Automation** (custom-built, inspired by DeFi Saver) - Portfolio observation + Deploy execution layers
3. **Brale Integration** (business partner) - Stablecoin onboarding and fiat access
4. **Multi-EVM Support** (distribution layer) - Cross-chain portfolio and liquidity access

## Current Status (as implemented)
- Navigation: AppShell + Sidebar render modules Home, Produce, Portfolio, Deploy, Markets via [src/components/layout/NavItems.ts](src/components/layout/NavItems.ts).
- Module surfaces: Home + module shells exist; Deploy/Markets/Portfolio render EmptyState panels because their capabilities are false; Produce renders mining/staking shells per mode.
- Capability truth: `getEcosystem` derives from [src/lib/ecosystems/registry.ts](src/lib/ecosystems/registry.ts); `capabilities.deploy/markets/portfolio/monitoring` are false for all chains; `produce` = mine for ETC-family, stake for ETH-family, none otherwise.
- Workspace state: `subscribeWorkspace` + `getActiveChainId` in [src/lib/state/workspace.ts](src/lib/state/workspace.ts); pages use `useSyncExternalStore` to react to localStorage + custom events.
- Execution gating: [RequirementGate](src/components/ui/RequirementGate.tsx) enforces wallet connection and matching chain; blocks execution otherwise.
- UI primitives: shells rely on ModuleHeader, Panel, EmptyState, RequirementGate, CapabilityBadge, StatusPill under [src/components/ui](src/components/ui).
- Mining fact: ETChash supports ASIC and GPU miners; ASICs are primary focus due to network lock-in, with GPU support maintained.

## Completed Foundation Work

**Phase 0 - Product Foundation (Complete):**
- ✅ Classic OS concept and product vision defined
- ✅ Product-market fit research (HiveOS, DeFi Saver patterns identified)
- ✅ 2025/2026 best practices: Modern tech stack selected (Next.js 16, React 19, wagmi 3, viem 2)
- ✅ Modular architecture built: Future-proof, multi-EVM + non-EVM extensible
- ✅ Design language and branding guidelines established
- ✅ Long-term product roadmap defined
- ✅ Agent infrastructure modernized (Claude Code, Copilot instructions)
- ✅ First modernized product suite on Ethereum Classic

**Phase 0 - Technical Foundation (Complete):**
- ✅ Navigation shell with modular structure (Home, Produce, Portfolio, Deploy, Markets)
- ✅ Capability registry system (feature gating per network)
- ✅ Workspace state management (localStorage + cross-tab sync)
- ✅ Three-layer architecture pattern (Adapter → Hook → UI)
- ✅ RequirementGate for wallet/chain enforcement
- ✅ Read-only by default architecture
- ✅ Multi-EVM chain support with extensible registry
- ✅ UI primitives (ModuleHeader, Panel, EmptyState, CapabilityBadge, StatusPill)

## Current Development Phase

**Phase 1 (In Progress):** Portfolio Read-Only
- 🔄 Building portfolio dashboard with protocol adapters
- 🔄 Wallet connectivity and balance fetching
- 📋 Transaction history and P&L tracking

## Future Development Phases

**Phase 2:** Mining OS
- Payout detection (RPC-based), earnings tracking dashboard
- Mining → strategy recommendations

**Phase 3:** DeFi Automation
- Strategy builder, position health monitoring, execution engine
- Automated position management

**Phase 4:** Full Integration
- Mining → strategies (complete loop)
- Brale → strategies (fiat → yield)
- Multi-chain → ETC (migration pathway)

## Next Steps

Enable capabilities progressively: Portfolio first (read-only), then Markets (DEX + Brale), then Deploy (execution), then complete Mining OS integration. See [020-roadmap-sequence.md](020-roadmap-sequence.md) for detailed sequencing.
