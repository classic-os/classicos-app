# Classic OS Roadmap Sequence

## Purpose
Document the ordered delivery phases grounded in current implementation and capability truth.

## Scope
Covers the upcoming phases that build on existing shells and registry-defined capabilities.

## Non-goals
No marketing framing; no speculative integrations beyond ETCswap V2 and planned miner capital flows.

## Current Status (as implemented)
- Capability registry sets deploy/markets/portfolio/monitoring to false; produce derives from network family.
- Module shells exist with RequirementGate and EmptyState scaffolds; no execution adapters are live.

## Next Step
Advance through the locked milestones in order:
- Portfolio read-only (v0): Portfolio-first utility (read-only). Keep capability flags honest; enable portfolio surfaces without write paths.
- Markets via ETCswap adapter: Markets via ETCswap V2 adapter (adapter, not product). Expose markets only through this adapter; do not ship bespoke exchange UX.
- Miner → capital bridge: Miner → capital bridge differentiation. Prioritize ASIC-first ETChash flows while retaining GPU support; design bridge from miner rewards to capital deployment.
