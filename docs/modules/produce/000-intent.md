# Classic OS Produce — Intent

## Purpose
Define Produce as the mode-aware production surface for Classic OS, reflecting mining vs staking realities per network.

## Scope
Covers `/produce` and its L2 routes for mining and staking, tied to `ecosystem.produce` truth.

## Non-goals
No execution pipelines, no mining pool management, no staking delegation UI beyond shells.

## Current Status (as implemented)
- Mode source: `ecosystem.produce` from [src/lib/ecosystems/registry.ts](src/lib/ecosystems/registry.ts) (ETC → mine, ETH → stake, else none).
- Routes: `/produce`, `/produce/mining`, `/produce/staking` under [src/app/produce](src/app/produce).
- UI: ModuleHeader + RequirementGate + Panel/EmptyState; observability links use explorer data from the registry.

## Next Step
Keep mode-aware shells honest; do not expose execution until adapters exist. Maintain the ETChash narrative: ASIC-primary focus with GPU support retained.
