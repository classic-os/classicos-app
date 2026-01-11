# Classic OS Workspace State

## Purpose
Describe how Classic OS tracks active network and workspace toggles so pages react consistently to user state.

## Scope
Workspace selectors, subscription pattern, and how pages consume active chain data.

## Non-goals
No alternative state stores or cross-tab sync redesign; no wallet provider changes.

## Current Status (as implemented)
- State source: [src/lib/state/workspace.ts](src/lib/state/workspace.ts) exposes `subscribeWorkspace`, `getActiveChainId`, `setActiveChainId`, `getShowTestnets`, `setShowTestnets`; persists to localStorage and emits a custom event.
- Consumption: Pages and primitives use `useSyncExternalStore(subscribeWorkspace, getActiveChainId, fallback)` to react to active chain changes (see Home, Produce, Deploy, Markets, Portfolio pages).
- Chain validation: `setActiveChainId` only stores known chain IDs from the network registry; default falls back to `DEFAULT_ACTIVE_CHAIN_ID`.
- UX enforcement: [components/ui/RequirementGate.tsx](src/components/ui/RequirementGate.tsx) compares wallet chain to active chain and blocks mismatches.

## Next Step
If new pages are added, subscribe to workspace via `useSyncExternalStore` with the existing selectors; avoid duplicating state logic outside `src/lib/state/workspace.ts`.
