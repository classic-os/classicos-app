# Classic OS Non-goals

## Purpose
Clarify what Classic OS explicitly does not build or pursue to maintain focus on core product.

## We Are NOT Building

### Mining Pool Infrastructure
- Mining pool software or rig firmware
- Pool hashpower management
- Mining pool operations
- Rig monitoring at hardware level

**Why:** We build Mining OS (capital flow dashboard), not mining infrastructure. We detect payouts via RPC, we don't manage pools.

### Stablecoin Infrastructure
- Stablecoin backing/reserves
- Reserve custody or management
- Stablecoin protocol development

**Why:** Brale (business partner) provides stablecoin infrastructure. Classic OS integrates their contracts, ACH flows, and bridging.

### DeFi Protocol Layer
- DEXs, lending protocols, or yield protocols
- Liquidity provision infrastructure
- Protocol governance mechanisms

**Why:** Classic OS is a control plane that aggregates protocols. We don't build the protocols themselves.

### Third-Party Service Integrations
- HiveOS API integration (we build our own mining dashboard inspired by HiveOS)
- DeFi Saver integration (we build our own automation inspired by DeFi Saver patterns)
- Mining pool API integrations (we detect payouts via RPC, not pool APIs)

**Why:** These are inspirations for our custom-built products, not services we wrap or integrate.

## We Are NOT Pursuing (Currently)

### Governance & Voting
- DAO voting interfaces
- Governance proposal systems
- Token voting mechanisms

**Why:** Not part of capital flow focus. May revisit if governance becomes critical to DeFi automation.

### Cross-Chain Bridges (Protocol Level)
- Bridge protocol development
- Cross-chain messaging infrastructure
- Bridge validator operations

**Why:** We integrate existing bridge interfaces, we don't build bridge protocols.

### Exchange Products
- Standalone exchange UI
- Order book trading
- Market making infrastructure

**Why:** Markets module aggregates existing DEXs. We're not building a competing exchange.

## Architecture Non-Goals

### What We Don't Do
- Chain abstraction (users must understand which chain they're on)
- Automatic transaction signing (read-only by default)
- Cross-chain state abstraction (network families are first-class)
- Hidden execution (all transactions require explicit user approval)

**Why:** These align with our architectural principles (ADR 004: Economic Flows Over Abstraction, ADR 006: Read-Only by Default).

## Current Reality Check

**What Exists Now:**
- Module shells with capability gating
- Workspace state management
- Read-only observation patterns
- Architecture foundations (three-layer pattern)

**What's Intentionally Missing:**
- Live data connections (capability flags disabled)
- Transaction execution (read-only enforced)
- External API integrations (building custom products)
- Mining pool connections (will detect payouts via RPC when implemented)

This is by design. Features unlock progressively as we build them, not by integrating external services.
