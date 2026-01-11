# Classic OS Milestones

## Purpose
Track discrete, implementation-grounded milestones tied to the current Classic OS capability matrix.

## Scope
Covers near-term delivery checkpoints across Produce, Portfolio, Markets, Deploy, and workspace/state readiness.

## Non-goals
Does not include public launch narratives or speculative protocol integrations beyond ETCswap V2 adapter and planned miner capital flows.

## Current Status (as implemented)
- Baseline: Navigation, shells, and gating are in place; Deploy/Markets/Portfolio capabilities are disabled in the registry.
- Produce: Mode derived from family (mine for ETC, stake for ETH); mining/staking pages exist but surfaces are empty states.
- Workspace/state: Active chain selection persists via localStorage; RequirementGate blocks when wallet missing or on mismatched chain.
- Observability: Block explorer links flow from the network registry; other observability surfaces are placeholders.

## Next Step
Sequence the next engineering milestones against the roadmap phases:
- Milestone A (Phase 6 lead-in): Deliver Portfolio read-only surfaces wired to registry truth, keeping write paths disabled.
- Milestone B (Phase 7 lead-in): Stand up Markets surfaces behind `capabilities.markets` using the ETCswap V2 adapter (adapter-only, no net-new product surface).
- Milestone C (Phase 8 lead-in): Define miner → capital bridge primitives, centering ASIC-first ETChash with GPU support retained.
