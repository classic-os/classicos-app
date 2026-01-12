# Classic OS Page Shell Pattern

## Purpose
Document the standard shell composition so pages stay consistent.

## Scope
Module pages for Home, Produce, Portfolio, Deploy, Markets; how they use headers, panels, gating, and empties.

## Non-goals
No alternative layouts or marketing copy; no new module flows.

## Current Status (as implemented)
- Composition: Pages render ModuleHeader + navigation links (where applicable) + RequirementGate + Panels/EmptyStates.
- Gating: RequirementGate ensures wallet connection and active-chain match from workspace selectors before showing content.
- Capability checks: Pages resolve `ecosystem = getEcosystem(activeChainId)` and branch on `ecosystem.capabilities.*` and `ecosystem.produce`.
- Empty shells: Deploy/Markets/Portfolio show EmptyState because capabilities are false; Produce branches mining/staking vs EmptyState; Home shows capability badges.
- Paths: Implemented in `src/app/<module>/page.tsx` and subroutes for module L2 pages.

## Next Step
When adding functionality, keep the shell intact: check capability first, gate with RequirementGate, then render Panels; avoid bypassing the pattern.
