# Classic OS Module Definitions

## Purpose
Define the canonical modules in Classic OS and what each is responsible for in the current implementation.

## Scope
Home, Produce, Portfolio, Deploy, Markets modules as they exist in the app shell and registry-driven capability model.

## Non-goals
No new modules, no speculative sub-surfaces, no execution promises beyond current gating.

## Current Status (as implemented)
- Home: Workspace status, capability badges, and navigation tiles; lives at [src/app/page.tsx](src/app/page.tsx).
- Produce: Production mode surfaces; routes `/produce`, `/produce/mining`, `/produce/staking`; mode derived from registry; currently EmptyState with RequirementGate.
- Portfolio: Read-only shell for balances/positions/activity at `/portfolio` and subroutes; capability disabled in registry, so EmptyState only.
- Deploy: Capital routing shell at `/deploy` plus `/deploy/sources`, `/deploy/route`, `/deploy/history`; capability disabled, so EmptyState.
- Markets: Market formation shell at `/markets` plus `/markets/assets`, `/markets/formation`, `/markets/liquidity`; capability disabled, so EmptyState.

## Next Step
When enabling a module, first flip capability truth in the registry alongside adapter wiring; keep routing and RequirementGate patterns intact.
