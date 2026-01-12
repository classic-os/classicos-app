# Classic OS Markets — Shell and L2 Routes

## Purpose
Document routing and shell composition for Markets so adapter enablement stays consistent.

## Scope
Top route `/markets` and L2 `/markets/assets`, `/markets/formation`, `/markets/liquidity`, plus shared shell behavior.

## Non-goals
No new L2 routes, no bespoke exchange UX, no speculative protocol wiring.

## Current Status (as implemented)
- Routes: Implemented under [src/app/markets](src/app/markets) with pages per L2 route.
- Shell: ModuleHeader, L2 nav links, RequirementGate, Panels/EmptyStates; capability is off, so all surfaces are empty.
- Gating: Pages use `getEcosystem(activeChainId)` and check `ecosystem.capabilities.markets`; RequirementGate enforces wallet + chain alignment.

## Next Step
When enabling Markets, keep L2 structure and gating; wire the ETCswap V2 adapter as the single entry path before flipping capability.
