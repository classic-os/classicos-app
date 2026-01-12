# Classic OS User Journeys

## Purpose
Outline key internal journeys to align capability sequencing with how users will experience Classic OS.

## Scope
Read-first, DeFi utility, and miner-focused flows using current shells and registry gating.

## Non-goals
No public funnel design, no speculative adapters beyond ETCswap V2, no execution automation promises.

## Current Status (as implemented)
- Routing exists for Home, Produce, Portfolio, Deploy, Markets with RequirementGate enforcing wallet+chain alignment; capability flags keep most surfaces in EmptyState.

## Next Step
Land journeys as capabilities unlock:
- Read-first (Portfolio-first): User selects active chain, views Portfolio shell (balances/positions/activity) in read-only mode until `capabilities.portfolio` is enabled; observability links help validate data.
- DeFi utility (Markets adapter path): User navigates Markets → surfaces stay gated until `capabilities.markets` flips; Markets via ETCswap adapter targets ETCswap V2 adapter as the single path (adapter, not net-new exchange UI).
- Miner journey (Miner → capital bridge): ETChash miner (ASIC-primary, GPU supported) uses Produce to understand mode, then bridge miner rewards into capital deployment when miner → capital bridge surfaces land; RequirementGate keeps execution scoped to active chain.
