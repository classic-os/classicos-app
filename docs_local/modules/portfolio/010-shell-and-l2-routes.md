# Classic OS Portfolio — Shell and L2 Routes

## Purpose
Document Portfolio routing and shell composition so additions stay read-first and capability-aligned.

## Scope
Top route `/portfolio` and L2 `/portfolio/balances`, `/portfolio/positions`, `/portfolio/activity` with shared shell behavior.

## Non-goals
No new L2 routes, no execution wiring, no write paths.

## Current Status (as implemented)
- Routes: Implemented under [src/app/portfolio](src/app/portfolio) with pages per L2 route.
- Shell: ModuleHeader + L2 links + RequirementGate + Panels/EmptyStates; all render EmptyState because capability is disabled.
- Gating: Pages use `getEcosystem(activeChainId)` and check `ecosystem.capabilities.portfolio`; RequirementGate enforces wallet + chain alignment.

## Next Step
When enabling Portfolio, keep L2 structure and RequirementGate; add read-only data panels first, leaving mutations out until explicitly approved.
