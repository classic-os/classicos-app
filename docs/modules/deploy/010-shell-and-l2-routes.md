# Classic OS Deploy — Shell and L2 Routes

## Purpose
Document Deploy routing and shell composition so capability enablement stays orderly.

## Scope
Top route `/deploy` and L2 `/deploy/sources`, `/deploy/route`, `/deploy/history`, plus shared shell behavior.

## Non-goals
No new L2 routes, no execution wiring, no auto-routing logic.

## Current Status (as implemented)
- Routes: Implemented under [src/app/deploy](src/app/deploy) with pages per L2 route.
- Shell: ModuleHeader, L2 nav links, RequirementGate, Panels/EmptyStates; all empty because deploy capability is off.
- Gating: Pages check `ecosystem.capabilities.deploy`; RequirementGate enforces wallet + chain alignment.

## Next Step
Enable Deploy only alongside real adapters; keep L2 structure and gating intact, and add content incrementally (sources → route preview → history) once capability flips.
