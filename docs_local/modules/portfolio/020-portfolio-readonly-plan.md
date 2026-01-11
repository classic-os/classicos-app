# Classic OS Portfolio — Read-Only Utility Plan

## Purpose
Define the Portfolio read-only delivery as a utility without execution paths.

## Scope
Balances, positions, and activity views aligned to registry capability and workspace gating.

## Non-goals
No swaps, staking, or rebalancing from Portfolio; no write paths or executions.

## Current Status (as implemented)
- Capability off: `ecosystem.capabilities.portfolio` is false; all Portfolio pages show EmptyState.
- Shells exist for balances/positions/activity with RequirementGate and observability sections.

## Roadmap Sequencing
- Portfolio read-only (v0) delivers explorer-first surfaces and honest empty states.
- Markets utility via ETCswap adapter follows after Portfolio foundation.
- Enable Portfolio capability only after read-only data wiring is ready.
- Deliver read surfaces first (balances/positions/activity) with observability links; keep actions disabled.
- Reuse RequirementGate and keep EmptyState fallbacks until data is live and validated.
