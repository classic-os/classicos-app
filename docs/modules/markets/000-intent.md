# Classic OS Markets — Intent

## Purpose
Define Markets as the adapter-driven market formation surface, not a bespoke exchange product.

## Scope
Top route `/markets` and L2 shells for assets, formation, and liquidity, gated by registry capability.

## Non-goals
No standalone exchange UI, no speculative protocol integrations beyond planned adapters.

## Current Status (as implemented)
- Capability: `ecosystem.capabilities.markets` is false; Markets pages show EmptyState.
- Routes: `/markets`, `/markets/assets`, `/markets/formation`, `/markets/liquidity` under [src/app/markets](src/app/markets).
- Shell: ModuleHeader + L2 links + RequirementGate + Panels/EmptyStates; observability uses explorer link when available.

## Next Step
Keep Markets positioned for adapter integration only; ETCswap V2 will be used as an adapter when capability flips, not as a new product tab.
