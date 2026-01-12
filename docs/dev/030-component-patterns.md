# Classic OS Component Patterns

## Purpose
Outline how shared components are intended to be used to keep UI predictable.

## Scope
Layout components and UI primitives referenced by module pages.

## Non-goals
No new component APIs or visual redesign proposals.

## Current Status (as implemented)
- Layout: AppShell + Sidebar + TopBar + FooterStatus compose the frame (see `src/components/layout/*`). NavItems drives Sidebar links.
- UI primitives: ModuleHeader, Panel, EmptyState, RequirementGate, CapabilityBadge, StatusPill live in [src/components/ui](src/components/ui) and are the default building blocks.
- Usage: Pages assemble primitives; EmptyState conveys honest gaps when `ecosystem.capabilities.*` is false; RequirementGate guards execution surfaces.
- Mining narrative: Produce surfaces acknowledge ETChash reality—ASIC-primary with GPU support—though execution adapters are not yet wired.

## Next Step
Prefer existing primitives before creating new components; if extending, document the intent and keep compatibility with current shell composition.
