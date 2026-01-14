# ADR 004: Economic Flows Over Chain Abstraction

**Date:** 2026-01-13
**Status:** Accepted

## Decision

Classic OS is built around **economic flows**, not chain abstraction. Proof-of-Work and Proof-of-Stake are treated as **distinct economic systems**, not interchangeable abstractions.

## Context

Many multi-chain applications treat all blockchains as equivalent:
- Generic "network selector" dropdowns
- Abstract away consensus mechanisms
- Use identical UI for fundamentally different systems

This creates confusion and hides important structural differences:
- PoW mining produces capital through hardware and energy expenditure
- PoS staking locks capital to earn yield
- These are **economically different** activities with different risk profiles, user bases, and capital flows

Classic OS rejects false equivalence. The goal is to make economic mechanics **legible**, not hidden.

## Consequences

**For Product:**
- Produce module explicitly distinguishes "mine" (PoW) vs "stake" (PoS)
- Mining UI is designed for hardware operators (ASICs, GPUs)
- Staking UI is designed for capital allocators (validators, delegators)
- Different networks get different capabilities based on consensus

**For Code:**
- Network families are explicitly modeled: `"ETC_POW"` vs `"ETH_POS"`
- Capability registry sets `produce: "mine"` for PoW chains, `produce: "stake"` for PoS
- Components render different UI based on production mode
- No generic "earn" or "yield" language that collapses the distinction

**For Users:**
- Miners understand they're producing capital (not "earning yield")
- Stakers understand they're locking capital for network security
- No confusion about why mining isn't available on Ethereum (structural reality)
- Economic intent is clear at every step: produce, observe, deploy, trade

**For Architecture:**
```typescript
// Network families are first-class
export type NetworkFamilyKey = "ETC_POW" | "ETH_POS"

// Capability reflects consensus
ecosystem.capabilities.produce =
  family === "ETC_POW" ? "mine" :
  family === "ETH_POS" ? "stake" :
  "none"

// UI adapts to economic reality
{mode === "mine" && <MiningPanel />}
{mode === "stake" && <StakingPanel />}
```

**Non-Goals:**
- No generic "connect to any chain" messaging
- No pretense that all EVM chains are equivalent
- No hiding of consensus mechanism differences
- No abstract "yield farming" language
