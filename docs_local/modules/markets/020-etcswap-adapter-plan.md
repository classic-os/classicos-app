# Classic OS Markets — ETCswap Adapter Plan

## Purpose
Outline how Markets will use ETCswap V2 as an adapter without creating a standalone exchange product.

## Scope
Adapter integration approach, capability flip sequencing, and UX implications for existing shells.

## Non-goals
No bespoke trading UI, no additional protocol integrations beyond ETCswap V2, no commitment to execution timelines.

## Current Status (as implemented)
- Markets capability is off; all Markets pages render EmptyState behind RequirementGate.
- L2 routes exist (assets/formation/liquidity) but have no adapters wired.

## Next Step
- Integrate ETCswap V2 as the adapter for market actions; keep the current shells and panels, surfacing adapter-powered data within them.
- Flip `ecosystem.capabilities.markets` only after adapter wiring is stable; maintain RequirementGate and EmptyState fallbacks until validation is complete.
- Avoid adding a product tab for ETCswap; it remains an adapter invoked from existing Markets surfaces.
