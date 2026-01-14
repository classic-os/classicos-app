# ADR 005: Module Structure (Produce, Portfolio, Deploy, Markets)

**Date:** 2026-01-13
**Status:** Accepted

## Decision

Classic OS organizes activity around **economic intent** using four canonical modules:
- **Produce** - Create capital (mining, staking)
- **Portfolio** - Observe balances, positions, and state
- **Deploy** - Allocate capital into strategies
- **Markets** - Create assets and form markets

## Context

Traditional portfolio apps organize by:
- Asset types (tokens, NFTs, etc.)
- Transaction history
- Wallet management

This structure is **passive and reactive**. Users see what they have but not what they can do with it.

Classic OS is a **control plane for capital**, not a passive viewer. The module structure reflects **user intent**:
1. **Produce** capital (don't just receive it)
2. **Observe** what you have
3. **Deploy** it intentionally
4. **Create markets** for it

This maps to economic reality, not technical implementation details.

## Consequences

**For Navigation:**
- Sidebar shows 5 items: Home, Produce, Portfolio, Deploy, Markets
- Each module has a dedicated route and page
- Navigation is stable (new top-level modules require explicit decision)
- Defined in [src/components/layout/NavItems.ts](../../src/components/layout/NavItems.ts)

**For Capabilities:**
- Not all modules are available on all networks
- Capability registry controls which modules render content vs empty states
- Example: `ecosystem.capabilities.produce = "mine"` on ETC, `"stake"` on ETH

**For User Journey:**
- **Produce** → Create capital (for miners/stakers)
- **Portfolio** → See what you have (read-first, execution-aware)
- **Deploy** → Allocate to strategies (intentional capital deployment)
- **Markets** → Trade, provide liquidity, create assets

**For Code Structure:**
```
src/
├── app/
│   ├── page.tsx               # Home
│   ├── produce/page.tsx       # Produce module
│   ├── portfolio/page.tsx     # Portfolio module
│   ├── deploy/page.tsx        # Deploy module
│   └── markets/page.tsx       # Markets module
├── components/
│   └── modules/
│       ├── produce/           # Mining, staking components
│       ├── portfolio/         # Balances, positions, activity
│       ├── deploy/            # Strategy deployment
│       └── markets/           # Asset creation, liquidity
```

**Module Definitions:**

**Produce:**
- Create capital through mining (PoW) or staking (PoS)
- Not available on chains without production mechanisms
- Hardware-aware for miners (ASIC vs GPU)

**Portfolio:**
- Read-first: observe balances, positions, activity
- Execution-aware: understands transaction history
- Network-specific: shows native assets and protocol positions

**Deploy:**
- Allocate capital into strategies (protocols, infrastructure)
- Route capital intentionally (not passive yield maximization)
- Integration point for DeFi protocols

**Markets:**
- Create assets (tokens, liquidity positions)
- Form markets (DEX integration, liquidity provision)
- Economic coordination primitives

**Non-Goals:**
- No "NFTs" tab (assets are assets, regardless of type)
- No generic "DeFi" tab (Deploy is strategy allocation, Markets is asset creation)
- No "staking" as a separate module (it's part of Produce)
- No module proliferation without clear economic intent
