# Classic OS Produce — Shell and L2 Routes

## Purpose
Document the routing and shell composition for Produce so updates stay aligned with mode gating.

## Scope
Top-level `/produce` and L2 `/produce/mining`, `/produce/staking`, plus shared shell patterns.

## Non-goals
No new L2 routes, no execution wiring, no pool/delegation UX commitments.

## Current Status (as implemented)
- Top route: `/produce` at [src/app/produce/page.tsx](src/app/produce/page.tsx) shows mode label and links to mining or staking when applicable.
- L2 routes: `/produce/mining` and `/produce/staking` in [src/app/produce/mining/page.tsx](src/app/produce/mining/page.tsx) and [src/app/produce/staking/page.tsx](src/app/produce/staking/page.tsx).
- Shell: ModuleHeader, optional breadcrumbs, RequirementGate, Panel + EmptyState; observability section uses explorer link from ecosystem.observability.
- Mode gating: If `ecosystem.produce` = `none`, pages return EmptyState; `mine` shows Mining panel; `stake` shows Staking panel.

## Next Step
Keep L2 limited to mining/staking; any new surfaces must check `ecosystem.produce` first and remain behind RequirementGate until adapters exist.
