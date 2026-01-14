# Classic OS Produce — Intent

## Purpose
Define Produce as the Mining OS module that transforms mining into a capital inflow source.

## Product Vision

Produce is Classic OS's custom-built **Mining OS** (inspired by HiveOS) that converts PoW mining operations into on-chain capital. Miners see their earned ETC not as a commodity to sell, but as productive capital ready to deploy.

## Core Functionality

### Capital Production (Mining OS)
- **Mining dashboard** with real-time earnings tracking (custom-built)
- **Payout detection** and monitoring (RPC-based, not pool API integration)
- **Auto-detection** of mining payouts
- **Direct pathway** from earned ETC to yield opportunities
- **Strategy templates** optimized for mining income

**Value Proposition:** Transforms mining into a capital inflow source instead of a capital exit vector.

## User Journey

```
Connect wallet
  ↓
Mining OS detects payouts (RPC-based detection logic)
  ↓
See earnings dashboard (custom-built UI)
  ↓
Strategy builder suggests: "Deploy 50% into yield"
  ↓
One-click execute strategy
  ↓
Monitor position health
  ↓
Compound earnings automatically
```

## Technical Implementation

### Routes
- `/produce` — Main production dashboard
- `/produce/mining` — ETC mining-specific surfaces
- `/produce/staking` — Multi-chain staking surfaces

### Mode Detection
Mode derived from network family via `ecosystem.produce` in [registry](../../../src/lib/ecosystems/registry.ts):
- ETC family → `mine`
- ETH family → `stake`
- Other → `none`

### Architecture
- Three-layer pattern: Adapter (RPC payout detection) → Hook (React integration) → UI (dashboard)
- RequirementGate enforces wallet connection and chain matching
- Capability-gated: surfaces show EmptyState until `capabilities.produce` is enabled

## What We Build vs What We Don't

### We Build (Mining OS)
- Payout detection via RPC calls to ETC nodes
- Earnings tracking and visualization dashboard
- Mining → capital flow pathways
- Strategy recommendations for mining income

### We Don't Build
- Mining pool software or rig firmware
- Pool hashpower management
- Rig monitoring at hardware level
- Mining pool operations

**Inspiration:** HiveOS provides the UX inspiration, but we build our own Mining OS focused on capital flows, not rig management.

## Client Infrastructure Alignment

Mining OS aligns with Ethereum Classic's client ecosystem:
- **Fukuii** - First-class enterprise ETC client (only native client with no upstream Ethereum Foundation dependencies)
- **Core-Geth** - Legacy client in maintenance mode (network pivoting to native clients)

Classic OS detects payouts via RPC calls to any ETC client, ensuring compatibility across the ecosystem while acknowledging Fukuii as the future of ETC infrastructure for institutional adoption.

## Current Status

**Implemented:**
- Module shell with routing
- Mode-aware navigation (mining vs staking)
- RequirementGate integration
- EmptyState patterns

**Planned (Phase 2):**
- RPC-based payout detection
- Earnings tracking dashboard
- Mining → strategy recommendations
- Capital flow pathways to Deploy module

## Next Steps

Keep mode-aware shells honest; enable capabilities only when Mining OS features are implemented. Focus on ETC PoW mining (ETChash: ASIC-primary with GPU support) as first use case.
