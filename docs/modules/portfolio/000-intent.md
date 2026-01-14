# Classic OS Portfolio — Intent

## Purpose
Define Portfolio as the read-only observation layer of the DeFi Automation system.

## Product Vision

Portfolio is the **observation layer** of Classic OS's custom-built DeFi Automation system (inspired by DeFi Saver). It provides unified visibility into balances, positions, and activity across all ETC DeFi protocols without any execution capabilities.

## Core Functionality

### Capital Observation (DeFi Automation - Read Layer)
- **Unified portfolio dashboard** across all DeFi positions (custom-built)
- **Cross-protocol balances** and positions
- **Transaction history** and P&L tracking
- **Real-time health monitoring** (position risk, liquidation warnings)
- **Protocol discovery** with risk/yield filtering

**Value Proposition:** Complete visibility into capital across all protocols, enabling informed decisions before execution.

## User Journey

```
Connect wallet
  ↓
View unified portfolio (balances + DeFi positions)
  ↓
See cross-protocol positions aggregated
  ↓
Monitor transaction history and P&L
  ↓
Identify opportunities → Navigate to Deploy for execution
```

## Technical Implementation

### Routes
- `/portfolio` — Main portfolio dashboard
- `/portfolio/balances` — Token balances across protocols
- `/portfolio/positions` — Active DeFi positions (lending, liquidity, etc.)
- `/portfolio/activity` — Transaction history and activity feed

### Architecture
- Three-layer pattern: Adapter (protocol data fetching) → Hook (React Query integration) → UI (dashboard)
- RequirementGate enforces wallet connection and chain matching
- Capability-gated: `ecosystem.capabilities.portfolio` controls visibility
- Read-only: No transaction signing, no state mutations

### Data Sources
- RPC calls for balances
- Protocol-specific adapters for positions (DEX LP, lending collateral, etc.)
- Transaction history from block explorer APIs or RPC logs
- Price feeds from oracles for P&L calculation

## Read-Only Philosophy

Portfolio is **intentionally read-only** (ADR 006):
- No transaction signing
- No balance transfers or swaps
- No position management or rebalancing
- Execution happens in Deploy module

This separation keeps Portfolio focused on observation and Deploy focused on action.

## Relationship to Deploy Module

Portfolio and Deploy work together as the DeFi Automation system:
- **Portfolio** = Observation (what do I have? how is it performing?)
- **Deploy** = Execution (how should I allocate? what strategies should I use?)

Users observe in Portfolio, then navigate to Deploy for execution.

## What We Build

### Custom-Built DeFi Automation (Read Layer)
- Multi-protocol aggregation logic
- Unified position tracking across protocols
- P&L calculation engine
- Real-time health monitoring
- CEX market integration for price discovery

### We Don't Integrate
- DeFi Saver API (we build our own automation inspired by their patterns)
- Third-party portfolio trackers (we build custom for ETC)

**Inspiration:** DeFi Saver provides UX inspiration for position management, but we build our own system optimized for ETC DeFi.

## Current Status

**Implemented:**
- Module shell with routing
- L2 navigation (balances, positions, activity)
- RequirementGate integration
- EmptyState patterns

**Planned (Phase 1 - Current Priority):**
- Balance fetching adapters (RPC + protocol-specific)
- Position tracking across DEX protocols
- Transaction history display
- Basic P&L tracking

**Planned (Phase 3 - DeFi Automation):**
- Advanced health monitoring
- Liquidation risk alerts
- Protocol comparison views
- Deep position analytics

## Next Steps

Enable Portfolio as read-only (v0): Wire up data adapters for balances and positions, flip `capabilities.portfolio` to true, but keep all execution disabled. Write paths remain in Deploy module only.
