# Classic OS Deploy — Intent

## Purpose
Define Deploy as the execution layer of the DeFi Automation system for allocating capital into strategies.

## Product Vision

Deploy is the **execution layer** of Classic OS's custom-built DeFi Automation system (inspired by DeFi Saver). It enables users to allocate capital into strategies, automate position management, and execute complex multi-protocol operations.

## Core Functionality

### Capital Allocation (DeFi Automation - Execution Layer)
- **Strategy builder** (leveraged yield, debt shifting, liquidation protection)
- **Automated position management** (stop-loss, take-profit, rebalancing)
- **Execution engine** with simulation mode
- **Multi-protocol aggregation** (single-transaction batched operations)
- **Risk-managed position management**

**Value Proposition:** Makes capital productive through accessible DeFi opportunities and removes friction from strategy execution.

## User Journey

```
Observe positions in Portfolio
  ↓
Navigate to Deploy
  ↓
Build strategy (visual, no-code)
  ↓
Simulate execution (preview outcomes)
  ↓
Execute strategy (single transaction)
  ↓
Monitor position health (Portfolio + Deploy)
  ↓
Automated management kicks in (stop-loss, rebalancing)
```

## Technical Implementation

### Routes
- `/deploy` — Main strategy dashboard
- `/deploy/sources` — Capital sources (wallet balance, mining payouts, Brale onramp)
- `/deploy/route` — Strategy builder and execution interface
- `/deploy/history` — Execution history and performance tracking

### Architecture
- Three-layer pattern: Adapter (protocol interactions) → Hook (React + transaction state) → UI (strategy builder)
- RequirementGate enforces wallet connection and chain matching
- Capability-gated: `ecosystem.capabilities.deploy` controls visibility
- Execution-enabled: Transaction signing required (user must approve)

### Capital Sources
1. **Wallet balance** (existing ETC/tokens)
2. **Mining payouts** (from Produce module via RPC detection)
3. **Brale onramp** (fiat → stablecoin, business partner integration)
4. **Cross-chain bridges** (multi-EVM distribution layer)

### Strategy Execution
- Visual strategy composer (no-code interface)
- Multi-step protocol interactions batched into single transaction
- Simulation mode (dry-run before execution)
- Automated execution engine (stop-loss, take-profit triggers)
- Position health monitoring integration with Portfolio

## Relationship to Other Modules

**Deploy works with:**
- **Portfolio**: Observe positions → Build strategies in Deploy
- **Produce**: Mining payouts → Direct deployment via Deploy
- **Markets**: DEX liquidity → Strategy execution through Deploy

Deploy is where capital becomes productive:
- Produce creates capital
- Portfolio observes capital
- **Deploy allocates capital**
- Markets provides liquidity access

## What We Build

### Custom-Built DeFi Automation (Execution Layer)
- Strategy composition engine
- Multi-protocol execution batching
- Position automation rules
- Risk monitoring and liquidation protection
- Simulation engine

### We Don't Integrate
- DeFi Saver API (we build our own automation inspired by their patterns)
- Third-party strategy platforms (we build custom for ETC)

**Inspiration:** DeFi Saver provides UX patterns for strategy automation, but we build our own system optimized for ETC DeFi.

## Current Status

**Implemented:**
- Module shell with routing
- L2 navigation (sources, route, history)
- RequirementGate integration
- EmptyState patterns

**Planned (Phase 2):**
- Capital sources integration (wallet, mining, Brale)
- Basic strategy templates (single-protocol)

**Planned (Phase 3 - DeFi Automation):**
- Visual strategy builder (no-code)
- Multi-protocol execution batching
- Automated position management (stop-loss, take-profit, rebalancing)
- Simulation mode
- Advanced risk monitoring

**Planned (Phase 4 - Integration):**
- Mining → strategies (complete loop from Produce)
- Brale → strategies (fiat → yield pathway)
- Multi-chain → ETC (cross-chain capital deployment)

## Next Steps

Keep Deploy dormant until Portfolio (observation) and Markets (liquidity) capabilities are enabled. Deploy requires:
1. Portfolio data to understand existing positions
2. Markets liquidity to execute strategies
3. Protocol adapters for execution

Enable Deploy in Phase 3 after Portfolio (Phase 1) and Markets (Phase 2) are live.
