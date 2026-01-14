# Classic OS Markets — Intent

## Purpose
Define Markets as the liquidity access module combining DEX aggregation and Brale stablecoin integration.

## Product Vision

Markets provides access to liquidity and stablecoins through two primary integrations:

1. **DEX Aggregation** (protocol adapters) - Access to ETC DeFi liquidity
2. **Brale Integration** (business partner) - Stablecoin onboarding and fiat access

## Core Functionality

### Capital Access (DEX Aggregation + Brale Integration)
- **DEX aggregation** across ETC DeFi protocols
- **Brale stablecoin integration** (minting, redemption, trading)
- **Fiat on-ramp** via ACH (Brale partnership)
- **Cross-chain liquidity bridges** with real-time rates
- **Circle USDC bridging** (1:1 conversion)

**Value Proposition:** Removes barriers to entry for both retail (fiat) and multi-chain users.

## User Journeys

### Fiat User (Brale Integration)
```
Click "Add Funds"
  ↓
Brale ACH flow (business partner integration)
  ↓
USD → ETC Stablecoin (Brale minting)
  ↓
Use stablecoin in Deploy strategies
```

### Multi-Chain User (DEX + Bridges)
```
Bridge USDC from Ethereum
  ↓
Convert to Brale stablecoin (1:1)
  ↓
Swap for ETC or other tokens via DEX aggregation
  ↓
Deploy into strategies
```

### DeFi User (DEX Aggregation)
```
View available liquidity across DEXs
  ↓
Find best rates via aggregation
  ↓
Execute swaps or add liquidity
  ↓
Manage positions in Portfolio
```

## Technical Implementation

### Routes
- `/markets` — Main markets dashboard
- `/markets/assets` — Token discovery and trading
- `/markets/formation` — Liquidity provision interfaces
- `/markets/liquidity` — Cross-chain bridges and fiat onramps

### Architecture
- Three-layer pattern: Adapter (DEX protocols, Brale contracts) → Hook (React + transaction state) → UI (swap/bridge interfaces)
- RequirementGate enforces wallet connection and chain matching
- Capability-gated: `ecosystem.capabilities.markets` controls visibility
- Execution-enabled: Transaction signing required for swaps, mints, bridges

### Integrations

**DEX Protocols (Adapters):**
- ETCswap and other ETC DEXs
- Aggregation logic for best rates
- Liquidity pool interfaces
- Not a bespoke exchange product - we aggregate existing DEXs

**Brale (Business Partner):**
- Stablecoin smart contracts (mint, redeem)
- ACH fiat on-ramp UI/flow
- Circle USDC bridging interface (1:1 conversion)
- Stablecoin ecosystem management

## What We Build vs What We Integrate

### We Build
- DEX aggregation logic
- Multi-protocol liquidity routing
- Swap execution interface
- Bridge interface (UI layer)

### We Integrate (Brale - Business Partner)
- Stablecoin minting/redemption contracts
- ACH fiat on-ramp flow
- USDC bridging (1:1 conversion)
- Stablecoin backing/reserves

### We Don't Build
- DEX protocols themselves (we aggregate existing)
- Stablecoin infrastructure (Brale handles)
- Cross-chain bridge protocols (we integrate interfaces)
- Standalone exchange product (we aggregate, not compete)

## Relationship to Other Modules

Markets provides liquidity access for:
- **Deploy**: Swap tokens before deploying into strategies
- **Produce**: Convert mining payouts into stablecoins or other assets
- **Portfolio**: Trade positions discovered in portfolio view

Markets is the **on/off ramp**:
- Fiat → ETC (via Brale)
- Multi-chain → ETC (via bridges)
- ETC ↔ Tokens (via DEX aggregation)

## Current Status

**Implemented:**
- Module shell with routing
- L2 navigation (assets, formation, liquidity)
- RequirementGate integration
- EmptyState patterns

**Planned (Phase 2 - Current Focus):**
- DEX protocol adapters (ETCswap integration)
- Basic swap interface
- Liquidity provision UI

**Planned (Brale Integration):**
- Brale stablecoin mint/redeem interface
- ACH fiat on-ramp flow integration
- USDC bridging (1:1 conversion)

**Planned (Multi-Chain):**
- Cross-chain bridge interfaces
- Multi-chain liquidity aggregation
- CEX market integration for price discovery

## Next Steps

Enable Markets capability with DEX aggregation first (Phase 2), then add Brale integration for fiat onboarding. Markets is not a standalone exchange - it's an aggregation and onboarding layer for liquidity access.
