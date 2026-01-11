# Classic OS Deploy — Phase 7 Bridge Notes

## Purpose
Capture early guidance for Deploy when capability enablement begins, without committing to specific bridges or onramps.

## Scope
Capital source considerations, routing preview, and history surfaces aligned to Deploy capability.

## Non-goals
No execution launch, no specific bridge/onramp commitments, no auto-routing guarantees.

## Current Status (as implemented)
- Deploy capability is off; all Deploy pages render EmptyState behind RequirementGate.
- L2 surfaces for sources, route, and history exist as shells only.

## Next Step
- When enabling Deploy, allow capital sources to include bridges/onramps if added later, but keep scope adapter-driven and behind capability flags.
- Wire adapters first, then flip `ecosystem.capabilities.deploy`; keep RequirementGate and EmptyState fallbacks until data and executions are validated.
