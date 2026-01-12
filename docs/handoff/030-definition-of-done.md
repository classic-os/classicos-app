# Classic OS Definition of Done

## Purpose
Ensure Classic OS deliveries meet minimal implementation fidelity before marking phases complete.

## Scope
Applies to module surfaces (Produce, Portfolio, Deploy, Markets), capability gating, workspace state, and adapter readiness.

## Non-goals
Does not cover external marketing releases or legal/brand reviews.

## Current Status (as implemented)
- Gating: RequirementGate enforces wallet connection and matching chain; workspace state driven by localStorage selectors.
- Capabilities: Registry truth keeps deploy/markets/portfolio/monitoring disabled; produce is derived (ETC → mine, ETH → stake).
- Surfaces: Modules render ModuleHeader + Panel + EmptyState; no live adapters for deployment, markets, or positions.
- Mining context: ETChash supports ASIC and GPU miners; ASIC-focused narratives are primary, GPU remains supported.

## Next Step
Define DoD checklists per phase:
- Include capability flips tied to registry updates and adapter wiring.
- Require workspace state sync (subscribe/getActiveChainId) on all new pages.
- Verify observability links and empty states reflect actual capability coverage before enabling execution.
