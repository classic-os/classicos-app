# Classic OS Home — Current Implementation

## Purpose
Record how the Home page is built so future changes stay aligned with the implemented control-plane pattern.

## Scope
Route `/`, capability badges, status pills, and navigation tiles.

## Non-goals
No execution flows, no module-specific data, no alternate navigation schemes.

## Current Status (as implemented)
- Route: `/` at [src/app/page.tsx](src/app/page.tsx).
- State: Active chain from workspace selectors; ecosystem from `getEcosystem(activeChainId)`; consensus label derived from `ecosystem.produce` (mine → PoW, stake → PoS, none → placeholder).
- UI primitives: Panel + StatusPill for workspace status; Panel + CapabilityBadge for module availability; tiles for module links.
- Gating: Home itself is ungated but reflects gating truth via `ecosystem.capabilities.*`.

## Next Step
When capability flags change, update badge copy if needed but keep the same structure; avoid adding execution widgets to Home.
