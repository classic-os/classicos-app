# Classic OS Produce — Next Real Work

## Purpose
Outline the concrete next steps for Produce aligned to current mode-aware shells and ETChash realities.

## Scope
Mining/staking readiness, observability, and preparatory work for miner capital flows.

## Non-goals
No execution launches, no mining pool operations, no staking delegation contracts.

## Current Status (as implemented)
- Shells exist for mining and staking; all surfaces render EmptyState due to absent adapters.
- Mode derives from registry truth; RequirementGate enforces wallet + chain match.

## Next Step
- Solidify ETChash narrative: ASIC-primary focus (locked to network) with GPU support retained; reflect this in mining copy when adapters land.
- Add a read-only mining pool directory placeholder (later) without execution to guide pool discovery before routing capital.
- Prepare adapter stubs for mining/staking only after registry capabilities flip; keep RequirementGate and EmptyState intact until then.
