# Classic OS Scope Boundaries

## Purpose
Define what Classic OS builds, what it integrates, and what remains out of scope.

## In Scope: What Classic OS Builds

### Mining OS (Custom-Built)
- Mining dashboard with real-time earnings tracking
- Payout detection and monitoring (RPC-based)
- Earnings tracking and visualization
- Strategy recommendations for mining income
- Direct pathways from earned ETC to yield opportunities

### DeFi Automation (Custom-Built)
- Unified portfolio dashboard across protocols
- Strategy builder (visual, no-code interface)
- Position health monitoring and liquidation alerts
- Automated execution engine
- Multi-protocol aggregation
- Automated position management (stop-loss, take-profit, rebalancing)

### Multi-EVM Interface (Custom-Built)
- Multi-chain portfolio view (Ethereum, Arbitrum, Base, etc.)
- Cross-chain liquidity bridge interface
- ETC opportunity showcase
- Network switching and workspace state management

## In Scope: What Classic OS Integrates

### Brale (Business Partner)
- Stablecoin smart contracts (mint, redeem)
- ACH fiat on-ramp UI/flow
- Circle USDC bridging interface
- Stablecoin ecosystem management

### DEX Protocols (Adapters)
- DEX aggregation across ETC DeFi protocols
- Liquidity provision interfaces
- Swap execution

### Price Oracles & Data
- Price feeds for strategy calculations
- CEX market integration for cross-chain price discovery

## Explicitly Out of Scope

### We Don't Build
- Mining pool software or rig firmware
- Stablecoin backing/reserves (Brale handles)
- Underlying DeFi protocols (DEXs, lending protocols)
- Governance or DAO voting infrastructure
- Block explorers (we link to existing explorers)

### We Don't Integrate (Currently)
- HiveOS API (we build our own mining dashboard inspired by HiveOS)
- DeFi Saver (we build our own automation inspired by DeFi Saver patterns)
- Mining pools directly (we detect payouts via RPC)

## Current Implementation Status

**Foundation Complete:**
- Navigation shell with module routing
- Capability registry controlling feature availability
- Workspace state management (localStorage + cross-tab sync)
- RequirementGate enforcing wallet connection and chain matching
- Three-layer architecture (Adapter → Hook → UI)
- Read-only by default (no transaction signing without explicit request)

**In Development:**
- Portfolio module (read-only observation layer)
- Protocol adapters for data access
- Brale integration preparation

**Planned:**
- Mining OS payout detection and dashboard
- Strategy builder and execution engine
- Automated position management
- Full Mining → DeFi → Yield integration
