# Classic OS Module Definitions

## Purpose
Define the four canonical modules in Classic OS organized by economic intent.

## Module Overview

Classic OS is structured around capital flows:

### 1. Produce — Capital Production
**Create capital through mining**

Core functionality (Mining OS):
- Mining dashboard with real-time earnings tracking (custom-built)
- Payout detection and monitoring (RPC-based)
- Auto-detection of mining payouts
- Direct pathway from earned ETC to yield opportunities
- Strategy templates optimized for mining income

Routes: `/produce`, `/produce/mining`, `/produce/staking`

**Value:** Transforms mining into a capital inflow source instead of a capital exit vector.

### 2. Portfolio — Capital Observation
**Observe capital and positions**

Core functionality (DeFi Automation - read layer):
- Unified portfolio dashboard across all DeFi positions (custom-built)
- Cross-protocol balances and positions
- Transaction history and P&L tracking
- Real-time health monitoring

Routes: `/portfolio`, `/portfolio/balances`, `/portfolio/positions`, `/portfolio/activity`

**Value:** Complete visibility into capital across all protocols.

### 3. Deploy — Capital Allocation
**Allocate capital into strategies**

Core functionality (DeFi Automation - execution layer):
- Strategy builder (leveraged yield, debt shifting, liquidation protection)
- Automated position management (stop-loss, take-profit, rebalancing)
- Execution engine with simulation
- Multi-protocol aggregation

Routes: `/deploy`, `/deploy/sources`, `/deploy/route`, `/deploy/history`

**Value:** Makes capital productive through accessible DeFi opportunities.

### 4. Markets — Capital Access
**Access liquidity and stablecoins**

Core functionality (DEX aggregation + Brale integration):
- DEX aggregation across ETC DeFi protocols
- Brale stablecoin integration (minting, redemption, trading)
- Fiat on-ramp via ACH (Brale partnership)
- Cross-chain liquidity bridges with real-time rates
- Circle USDC bridging (1:1 conversion)

Routes: `/markets`, `/markets/assets`, `/markets/formation`, `/markets/liquidity`

**Value:** Removes barriers to entry for both retail (fiat) and multi-chain users.

## Current Status (as implemented)
- Home: Workspace status, capability badges, navigation tiles at [src/app/page.tsx](src/app/page.tsx)
- All modules: Shell structures exist with RequirementGate and EmptyState patterns
- Capability truth: Registry-driven at [src/lib/ecosystems/registry.ts](src/lib/ecosystems/registry.ts)
- Architecture: Three-layer pattern (Adapter → Hook → UI) enforced throughout

## Implementation Notes

Modules are enabled progressively as capabilities unlock:
1. Portfolio first (read-only observation)
2. Markets via protocol adapters (DEX + Brale)
3. Deploy with strategy execution
4. Produce with mining payout detection and capital flow pathways
