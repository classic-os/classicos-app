# ADR 007: Core Product Architecture (Mining OS + DeFi Automation + Brale Integration)

**Date:** 2026-01-13
**Status:** Accepted

## Decision

Classic OS is a **complete product** combining three core components:
1. **Mining OS** (inspired by HiveOS) - Built by Classic OS, not integrated
2. **DeFi Automation** (inspired by DeFi Saver) - Built by Classic OS, not integrated
3. **Stablecoin Integration** (Brale) - Business partner integration

Plus multi-EVM support for distribution.

## Context

Classic OS is NOT just an integration layer or aggregator. It's a complete economic operating system with:

**Built by Classic OS:**
- Mining dashboard, rig monitoring, earnings tracking (Mining OS)
- Strategy builder, position health monitoring, automated execution (DeFi automation)
- Portfolio dashboard across protocols
- Multi-chain interface

**Integrated via Partner:**
- Stablecoin minting/redemption (Brale)
- Fiat on-ramp via ACH (Brale)
- USDC bridging (Brale)

The distinction matters: We're building a Mining OS and DeFi automation product, inspired by HiveOS and DeFi Saver patterns but custom-built for ETC. Brale is the only major external integration (they handle stablecoins, we handle everything else).

## Consequences

### For Product Positioning

**Classic OS =**
```
Mining OS (custom-built)
  +
DeFi Automation (custom-built)
  +
Brale Integration (partner)
  +
Multi-EVM Support (distribution layer)
```

**NOT:**
- HiveOS wrapper (we build our own mining dashboard)
- DeFi Saver clone (we build our own automation)
- Multi-chain aggregator (ETC-first, multi-chain for distribution)

### For Development Scope

**We Build:**
- Mining dashboard UI
- Rig monitoring (detect payouts, track earnings)
- Strategy builder (visual, no-code)
- Position health monitoring
- Automated execution engine
- Multi-protocol aggregation
- Cross-chain portfolio view

**We Integrate (Brale):**
- Stablecoin smart contracts
- ACH on-ramp UI/flow
- USDC bridging interface

**We Don't Build:**
- Mining pool software
- Mining rig firmware
- Stablecoin backing/reserves (Brale)
- Underlying DeFi protocols (DEXs, lending)

### For Code Architecture

**Mining OS Module:**
```
src/
├── components/modules/produce/
│   ├── MiningDashboard.tsx       # Custom-built
│   ├── RigMonitoring.tsx         # Custom-built
│   ├── EarningsTracker.tsx       # Custom-built
│   └── PayoutDetection.tsx       # Custom-built
├── lib/mining/
│   ├── detect-payouts.ts         # Our logic
│   ├── track-earnings.ts         # Our logic
│   └── pool-integration.ts       # RPC-based detection
```

**DeFi Automation Module:**
```
src/
├── components/modules/deploy/
│   ├── StrategyBuilder.tsx       # Custom-built
│   ├── PositionHealth.tsx        # Custom-built
│   ├── AutomationEngine.tsx      # Custom-built
│   └── ExecutionBatcher.tsx      # Custom-built
├── lib/strategies/
│   ├── strategy-composer.ts      # Our logic
│   ├── risk-monitor.ts           # Our logic
│   └── execution-engine.ts       # Our logic
```

**Brale Integration:**
```
src/
├── components/modules/markets/
│   ├── StablecoinMint.tsx        # Brale contract integration
│   ├── FiatOnRamp.tsx            # Brale ACH flow
│   └── USDCBridge.tsx            # Brale bridging
├── lib/stablecoin/
│   ├── brale-adapter.ts          # Adapter to Brale contracts
│   └── brale-types.ts            # Brale contract types
```

### For User Flows

**Miner (Using Our Mining OS):**
```
Open Classic OS
  ↓
Connect wallet
  ↓
Mining OS detects payouts (our detection logic)
  ↓
See earnings dashboard (our UI)
  ↓
Strategy builder suggests: "Deploy 50% into yield" (our automation)
  ↓
Execute strategy (our execution engine)
  ↓
Monitor position health (our monitoring)
```

**Fiat User (Using Brale Integration):**
```
Open Classic OS
  ↓
Click "Add Funds"
  ↓
Brale ACH flow (their UI/integration)
  ↓
USD → ETC Stablecoin (Brale minting)
  ↓
Back to Classic OS
  ↓
Deploy into strategies (our automation)
```

### For Messaging & Branding

**Correct:**
- "Classic OS is a Mining OS + DeFi automation platform for ETC"
- "Inspired by HiveOS and DeFi Saver, built for Ethereum Classic"
- "Integrated with Brale for stablecoin on/off-ramps"

**Incorrect:**
- "Classic OS integrates HiveOS" (we don't, we build our own)
- "Classic OS is a DeFi Saver wrapper" (we build our own automation)
- "Classic OS is just a Brale frontend" (Brale is one integration among many features)

### For Competitive Positioning

**vs HiveOS:**
- HiveOS = Mining rig management (hardware focus)
- Classic OS = Mining OS + on-chain capital deployment (economic focus)
- We solve: "What do I do with mined ETC?" (HiveOS doesn't)

**vs DeFi Saver:**
- DeFi Saver = Ethereum DeFi automation
- Classic OS = ETC-first DeFi automation + Mining OS + Multi-chain
- We solve: ETC-specific capital flows (DeFi Saver doesn't support ETC)

**vs Brale:**
- Brale = Stablecoin infrastructure
- Classic OS = Complete economic OS (mining, DeFi, stablecoins)
- Partnership: Brale provides stablecoin rails, we provide the OS

### For Documentation

**In README.md:**
- Emphasize Classic OS as a complete product
- Note HiveOS/DeFi Saver as *inspiration*, not integration
- Highlight Brale as integration partner (not core Classic OS product)

**In Agent Instructions:**
- Agents should understand they're building features, not wrappers
- Mining OS code is ours to write (not API calls to HiveOS)
- DeFi automation is ours to write (not API calls to DeFi Saver)
- Only Brale requires external integration

## Non-Goals

**We Don't:**
- Integrate HiveOS API (we build our own mining dashboard)
- Fork DeFi Saver code (we build inspired-by automation)
- Build our own stablecoin (we integrate Brale)
- Manage mining pools (we detect payouts, don't create pools)

## Success Metrics

**Product Adoption:**
- Miners using Classic OS for capital deployment (not just rig monitoring)
- DeFi users discovering yield strategies
- Fiat users onboarding via Brale
- Multi-chain users migrating to ETC

**Feature Usage:**
- Mining dashboard active users
- Strategies created/executed
- Brale stablecoin mints/redeems
- Cross-chain bridges to ETC

**Capital Metrics:**
- % of mining rewards staying on-chain
- TVL in automated strategies
- Stablecoin volume (Brale)
- Cross-chain inflows

## Implementation Notes

**Phase 1 (Current):**
- Building foundation: portfolio dashboard, wallet, basic UI
- Brale integration can start (contracts already exist)

**Phase 2 (Mining OS):**
- Build payout detection (RPC-based)
- Build earnings tracking
- Build mining dashboard UI
- Connect to strategy suggestions

**Phase 3 (DeFi Automation):**
- Build strategy builder
- Build position health monitoring
- Build execution engine
- Build automation rules

**Phase 4 (Integration):**
- Mining → strategies (full loop)
- Brale → strategies (fiat → yield)
- Multi-chain → ETC (migration path)

## References

- **HiveOS (inspiration):** https://hiveos.farm
- **DeFi Saver (inspiration):** https://defisaver.com
- **Brale (partner):** https://brale.xyz
- **Product Vision:** [README.md](../../README.md)
