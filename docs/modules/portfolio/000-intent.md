# Classic OS Portfolio — Intent

## Purpose
Position Portfolio as the read-first view into balances, positions, and activity for the active network.

## Scope
Portfolio top route and L2 shells, aligned to registry-driven capability gating.

## Non-goals
No execution, no rebalancing or trading actions, no write paths until capability flips.

## Current Status (as implemented)
- Capability: `ecosystem.capabilities.portfolio` is false, so pages render EmptyState only.
- Routes: `/portfolio` plus `/portfolio/balances`, `/portfolio/positions`, `/portfolio/activity` under [src/app/portfolio](src/app/portfolio).
- Pattern: ModuleHeader, L2 links, RequirementGate, Panel + EmptyState; observability uses explorer link when present.

## Next Step
Keep Portfolio as read-only (v0); enable capability only when read surfaces are wired to data, leaving write paths off.
