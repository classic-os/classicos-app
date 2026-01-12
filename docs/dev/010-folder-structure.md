# Classic OS Folder Structure

## Purpose
Describe where things live so contributors place changes correctly.

## Scope
High-level folders relevant to ClassicOS app and internal docs.

## Non-goals
No reorganization proposals; no exhaustive file-by-file listing.

## Current Status (as implemented)
- Application: `src/` contains app routes (`src/app`), components (`src/components`), lib registries/state (`src/lib`).
- Providers/layout: `src/app/layout.tsx` wraps via AppShell and Web3Providers; shells live under `src/components/layout`.
- Module routes: `src/app/{produce,portfolio,deploy,markets}` with L2 subfolders for each module; Home at `src/app/page.tsx`.
- Shared UI: `src/components/ui` (ModuleHeader, Panel, EmptyState, RequirementGate, CapabilityBadge, StatusPill).
- State/registry: `src/lib/state/workspace.ts`, `src/lib/ecosystems/registry.ts`.
- Internal docs: `docs/` with handoff, product, architecture, dev guides, decisions, modules.
- Agent guidance: `agents/`.

## Next Step
Add new assets only within the appropriate folder; keep docs inside `docs/` and reference existing paths instead of duplicating structure.
