# Classic OS Empty States and Gating UX

## Purpose
Explain why Classic OS uses "honest empties" and gating so capabilities stay truthful to the registry and network state.

## Scope
EmptyState usage, RequirementGate behavior, and how capability flags drive visible surfaces.

## Non-goals
No marketing polish, no speculative UX flows, no promises beyond current gating logic.

## Current Status (as implemented)
- Honest empties: Modules render [src/components/ui/EmptyState.tsx](src/components/ui/EmptyState.tsx) when `ecosystem.capabilities.*` is false, signaling absent adapters instead of placeholder features.
- Gating: [src/components/ui/RequirementGate.tsx](src/components/ui/RequirementGate.tsx) requires a connected wallet on the active chain (from `subscribeWorkspace` + `getActiveChainId`) before showing module content.
- Produce mode: Pages branch on `ecosystem.produce` (mine/stake/none) to show mining or staking shells or an empty when unsupported.
- Drift prevention: Empty states plus registry truth prevent UI from implying availability before adapters land.

## Next Step
Keep empty states in place until capability flags flip alongside real adapters; ensure any new surfaces still wrap content with RequirementGate and reference `ecosystem.capabilities.*` and `ecosystem.produce` before rendering execution paths.
