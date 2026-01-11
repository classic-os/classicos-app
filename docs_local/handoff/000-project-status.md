# Classic OS Project Status

## Purpose
Summarize the implemented state of Classic OS so handoffs reflect reality, not intent.

## Scope
Covers navigation, module shells, capability gating, workspace state, and current production modes.

## Non-goals
Does not propose new features, integrations, or timelines. Avoids marketing language.

## Current Status (as implemented)
- Navigation: AppShell + Sidebar render modules Home, Produce, Portfolio, Deploy, Markets via [src/components/layout/NavItems.ts](src/components/layout/NavItems.ts).
- Module surfaces: Home + module shells exist; Deploy/Markets/Portfolio render EmptyState panels because their capabilities are false; Produce renders mining/staking shells per mode.
- Capability truth: `getEcosystem` derives from [src/lib/ecosystems/registry.ts](src/lib/ecosystems/registry.ts); `capabilities.deploy/markets/portfolio/monitoring` are false for all chains; `produce` = mine for ETC-family, stake for ETH-family, none otherwise.
- Workspace state: `subscribeWorkspace` + `getActiveChainId` in [src/lib/state/workspace.ts](src/lib/state/workspace.ts); pages use `useSyncExternalStore` to react to localStorage + custom events.
- Execution gating: [RequirementGate](src/components/ui/RequirementGate.tsx) enforces wallet connection and matching chain; blocks execution otherwise.
- UI primitives: shells rely on ModuleHeader, Panel, EmptyState, RequirementGate, CapabilityBadge, StatusPill under [src/components/ui](src/components/ui).
- Mining fact: ETChash supports ASIC and GPU miners; ASICs are primary focus due to network lock-in, with GPU support maintained.

## Next Step
Align milestones and roadmap (see 010-milestones and 020-roadmap-sequence) to the current capability matrix before enabling any module capabilities.
