# Classic OS Project Status

## Purpose
Summarize the current implementation state of Classic OS as a complete economic operating system.

## Product Context

Classic OS is a complete product combining:
1. **Mining OS** (custom-built, inspired by HiveOS) - Mining dashboard, payout detection, capital flow pathways
2. **DeFi Automation** (custom-built, inspired by DeFi Saver) - Portfolio observation + Deploy execution layers
3. **Brale Integration** (business partner) - Stablecoin onboarding and fiat access
4. **Multi-EVM Support** (distribution layer) - Cross-chain portfolio and liquidity access

## Current Status (as of January 15, 2026)
- **Navigation:** AppShell + Sidebar render modules Home, Produce, Portfolio, Deploy, Markets via [src/components/layout/NavItems.ts](src/components/layout/NavItems.ts)
- **Portfolio Module:** ✅ Fully operational with read-only observation (Phase 1.1 + 1.2 complete)
  - Native balance display with USD values
  - ERC20 token balances with spot prices
  - ETCswap V2 LP positions with APY estimates
  - Derived token prices from LP pool ratios
  - Price source attribution (CoinGecko vs ETCswap)
  - Activity explorer integration
  - Portfolio aggregation and summary
- **Deploy/Markets:** EmptyState panels (capabilities disabled, planned for Phase 2-3)
- **Produce:** Mining/staking shells per mode (surfaces planned for Phase 4)
- **Capability truth:** `getEcosystem` derives from [src/lib/ecosystems/registry.ts](src/lib/ecosystems/registry.ts)
  - `capabilities.portfolio` = **true** for ETC chains (mainnet + Mordor testnet)
  - `capabilities.deploy/markets/monitoring` = false (not yet enabled)
  - `produce` = mine for ETC-family, stake for ETH-family, none otherwise
- **Workspace state:** `subscribeWorkspace` + `getActiveChainId` in [src/lib/state/workspace.ts](src/lib/state/workspace.ts); pages use `useSyncExternalStore` to react to localStorage + custom events
- **Execution gating:** [RequirementGate](src/components/ui/RequirementGate.tsx) enforces wallet connection and matching chain; blocks execution otherwise
- **UI primitives:** ModuleHeader, Panel, EmptyState, RequirementGate, CapabilityBadge, StatusPill, CopyButton, RefreshButton, PriceChange under [src/components/ui](src/components/ui)
- **Mining fact:** ETChash supports ASIC and GPU miners; ASICs are primary focus due to network lock-in, with GPU support maintained

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

## Completed Development Phases

**Phase 1 (Complete - January 15, 2026):** Portfolio Read-Only
- ✅ Native balance display (ETC/METC) with USD values
- ✅ ERC20 token balance tracking with spot prices
- ✅ ETCswap V2 LP position monitoring with APY estimates
- ✅ **Derived token price system** from LP pool ratios (breakthrough feature)
- ✅ Price source attribution (CoinGecko vs ETCswap V2)
- ✅ Portfolio aggregation and USD value calculations
- ✅ Activity explorer integration
- ✅ 24h price change indicators
- ✅ ETC price sparkline chart (7-day history)
- ✅ Manual refresh controls
- ✅ Testnet indicators throughout UI
- ✅ Enhanced LP position cards with asset composition visualization
- ✅ Copy buttons and explorer links for all addresses

**See:** [032-phase1-completion-report.md](032-phase1-completion-report.md) for complete Phase 1 details

## Current Development Phase

**Phase 1.3 (In Progress):** Portfolio Enhancements
- 🔄 Multi-fiat currency support (EUR, GBP, JPY, CNY, etc.)
- 📋 ETCswap V3 concentrated liquidity positions
- 📋 ETCswap Launchpad emerging markets integration

## Future Development Phases

**Phase 2:** Markets Module
- DEX aggregation (ETCswap V2/V3 swap interface)
- Brale stablecoin integration (minting/redemption)
- Quote aggregation and slippage protection
- Transaction preview and simulation

**Phase 3:** Deploy Module (DeFi Automation)
- Strategy builder (visual no-code interface)
- Position health monitoring with liquidation alerts
- Automated execution engine (stop-loss, take-profit, rebalancing)
- Simulation mode (dry-run strategies)

**Phase 4:** Mining OS
- Payout detection (RPC-based)
- Earnings tracking dashboard
- Mining → strategy recommendations
- Capital flow pathways from Produce to Deploy

**Phase 5:** Full Integration
- Mining → strategies (complete Produce-to-Deploy loop)
- Brale → strategies (fiat onramp integration)
- Multi-chain → ETC (cross-chain migration)
- Complete economic OS operational

## Next Steps

**Immediate (Phase 1.3):**
1. Multi-fiat currency support
2. ETCswap V3 positions
3. ETCswap Launchpad integration

**Near-term (Phase 2):**
- Enable Markets capability with DEX aggregation
- Integrate Brale stablecoin contracts
- Build swap interface

**Mid-term (Phase 3):**
- Enable Deploy capability
- Build strategy builder
- Implement automated execution engine

**Long-term (Phase 4-5):**
- Complete Mining OS integration
- Full capital flow loop operational

See [020-roadmap-sequence.md](020-roadmap-sequence.md) for detailed sequencing.
