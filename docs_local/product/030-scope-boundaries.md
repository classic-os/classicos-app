# Classic OS Scope Boundaries

## Purpose
Clarify what Classic OS includes now and near term, and what remains explicitly out of scope.

## Scope
Applies to module capabilities, execution behaviors, and integrations referenced by current shells and registry truth.

## Non-goals
No marketing claims, no speculative protocols, and no changes to capability flags without matching adapters.

## Current Status (as implemented)
- Included: Navigation, gating, observability links, and EmptyState shells for Produce/Portfolio/Deploy/Markets; produce mode derived from network family.
- Workspace: Active chain/testnet toggles persisted locally; RequirementGate blocks mismatched or disconnected states.

## Next Step
Maintain the following boundaries until explicitly prioritized:
- No execution automation or auto-routing; all execution paths stay manual and gated.
- No mining pool implementation; Produce remains a shell until miner → capital bridge work lands.
- No governance UI or voting surfaces.
- No bespoke exchange product; Markets will rely on the ETCswap V2 adapter when enabled.
