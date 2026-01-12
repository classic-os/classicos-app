# Classic OS Home — Intent

## Purpose
Position the Home module as the control plane for Classic OS, showing workspace status and available modules without overpromising capability.

## Scope
Covers Home route `/`, its tiles, and capability badge summary based on current registry truth.

## Non-goals
No execution actions, no module-specific logic, no marketing messaging.

## Current Status (as implemented)
- Location: [src/app/page.tsx](src/app/page.tsx).
- Behavior: Reads active chain via `useSyncExternalStore(subscribeWorkspace, getActiveChainId, fallback)` and resolves ecosystem with `getEcosystem`.
- UI: Shows workspace StatusPills (active chain, environment, consensus) and capability badges for Deploy/Markets/Portfolio/Monitoring based on `ecosystem.capabilities.*`.
- Navigation: Tiles link to Produce, Deploy, Markets, Portfolio; Sidebar/NavItems already list the same modules.

## Next Step
Keep Home as the neutral control plane: maintain capability badges as the single-summary view and update copy only when capabilities flip in the registry.
