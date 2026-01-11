# Classic OS UI Primitives

## Purpose
List the shared primitives used by module shells so UI changes stay consistent and minimal.

## Scope
ModuleHeader, Panel, EmptyState, RequirementGate, CapabilityBadge, StatusPill as implemented.

## Non-goals
No visual redesign, no new primitives, no component API changes beyond current usage.

## Current Status (as implemented)
- ModuleHeader: Title, subtitle, optional chips/right slot in [src/components/ui/ModuleHeader.tsx](src/components/ui/ModuleHeader.tsx).
- Panel: Framed section with optional title/description in [src/components/ui/Panel.tsx](src/components/ui/Panel.tsx).
- EmptyState: Honest empty copy + optional action link in [src/components/ui/EmptyState.tsx](src/components/ui/EmptyState.tsx).
- RequirementGate: Enforces wallet connection and active-chain match before rendering children in [src/components/ui/RequirementGate.tsx](src/components/ui/RequirementGate.tsx).
- CapabilityBadge: Shows capability label + availability flag in [src/components/ui/CapabilityBadge.tsx](src/components/ui/CapabilityBadge.tsx).
- StatusPill: Small label/value pill for status surfaces in [src/components/ui/StatusPill.tsx](src/components/ui/StatusPill.tsx).
- Usage: Module pages compose ModuleHeader + Panel + EmptyState + RequirementGate as the base pattern.

## Next Step
When adding module content, prefer these primitives; extend them only if gaps are documented and aligned with layout/AppShell conventions.
