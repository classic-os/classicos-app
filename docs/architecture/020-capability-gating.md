# Classic OS Capability Gating

## Purpose
Explain how Classic OS derives and applies capability truth so modules stay honest to network support.

## Scope
Ecosystem registry, capability flags, produce mode, and gating states as reflected in current pages.

## Non-goals
No speculative capabilities, no promises beyond registry truth, no UI redesign.

## Current Status (as implemented)
- Source of truth: [src/lib/ecosystems/registry.ts](src/lib/ecosystems/registry.ts) builds `ECOSYSTEMS`; capabilities (`deploy`, `markets`, `portfolio`, `monitoring`) are false; `produce` is derived (ETC → `mine`, ETH → `stake`, others `none`).
- Accessors: Pages call `getEcosystem(activeChainId)` and read `ecosystem.capabilities.*` and `ecosystem.produce` to decide what to render.
- States (conceptual):
  - Active: capability true with adapters wired (not yet enabled in registry).
  - Limited: capability false but shell exists; UI shows EmptyState and observability links.
  - Not supported: unknown network or capability absent; shells remain in “honest empty.”
- Produce mode: Pages branch on `ecosystem.produce` to show mining vs staking shells; `none` yields EmptyState.

## Next Step
Before flipping any capability to Active, wire adapters and update the registry; keep pages using `ecosystem.capabilities.*` and `ecosystem.produce` as the gate to avoid drift.
