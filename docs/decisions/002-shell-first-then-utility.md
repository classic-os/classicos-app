# 002-shell-first-then-utility
- Date: 2026-01
- Decision: Ship shells first (ModuleHeader + Panel + EmptyState + RequirementGate) before enabling utility/adapters.
- Context: Current pages render honest empties because `ecosystem.capabilities.*` are false; this prevents overstating support while adapters are built.
- Consequences: Capability flags in [src/lib/ecosystems/registry.ts](src/lib/ecosystems/registry.ts) must flip only alongside real adapters; shells stay intact to avoid regressions.
