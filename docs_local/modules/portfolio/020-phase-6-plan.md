# Classic OS Portfolio — Phase 6 Plan

## Purpose
Define the Phase 6 delivery for Portfolio as a read-only utility without execution paths.

## Scope
Balances, positions, and activity views aligned to registry capability and workspace gating.

## Non-goals
No swaps, staking, or rebalancing from Portfolio; no write paths or executions.

## Current Status (as implemented)
- Capability off: `ecosystem.capabilities.portfolio` is false; all Portfolio pages show EmptyState.
- Shells exist for balances/positions/activity with RequirementGate and observability sections.

## Next Step
- Enable Portfolio capability only after read-only data wiring is ready.
- Deliver read surfaces first (balances/positions/activity) with observability links; keep actions disabled.
- Reuse RequirementGate and keep EmptyState fallbacks until data is live and validated.
