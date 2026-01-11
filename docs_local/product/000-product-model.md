# Classic OS Product Model

## Purpose
Describe Classic OS as the economic operating system for Ethereum Classic, defining what it is now and how it extends later without over-committing scope.

## Scope
Covers positioning, core modules, capability-driven behavior, and extension principles grounded in the current registry and shells.

## Non-goals
No public marketing copy, no speculative features, and no promises beyond registry-backed capabilities.

## Current Status (as implemented)
- Role: Classic OS operates as an internal console binding network selection, capability gating, and module shells for Ethereum Classic first; other EVM families remain extensible via the registry.
- Modules: Home, Produce, Portfolio, Deploy, Markets exist as shells with gating and EmptyState patterns.
- Capability truth: Registry in [src/lib/ecosystems/registry.ts](src/lib/ecosystems/registry.ts) sets Deploy/Markets/Portfolio/Monitoring to false; produce mode derives from network family (ETC → mine, ETH → stake, else none).
- Workspace state: Active chain and testnet visibility managed via [src/lib/state/workspace.ts](src/lib/state/workspace.ts); pages subscribe with `useSyncExternalStore`.
- Mining fact: ETChash supports ASIC and GPU miners; ASICs are primary (locked to network) while GPUs remain supported.

## Next Step
Evolve capabilities gradually: keep Ethereum Classic first, unlock modules only when adapters exist, and preserve registry truth as the single source for availability and mode.
