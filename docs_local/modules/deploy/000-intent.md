# Classic OS Deploy — Intent

## Purpose
Define Deploy as the surface for routing capital into strategies once capabilities are enabled.

## Scope
Top route `/deploy` and L2 pages for sources, route, and history; driven by registry capability truth.

## Non-goals
No execution today, no auto-routing, no bridge/onramp commitments beyond future possibilities.

## Current Status (as implemented)
- Capability: `ecosystem.capabilities.deploy` is false; Deploy pages show EmptyState only.
- Routes: `/deploy`, `/deploy/sources`, `/deploy/route`, `/deploy/history` under [src/app/deploy](src/app/deploy).
- Shell: ModuleHeader + L2 links + RequirementGate + Panels/EmptyStates; observability uses explorer link when available.

## Next Step
Keep Deploy dormant until adapters exist; note that future capital sources may include bridges/onramps, but do not commit or expose flows until capability flips.
