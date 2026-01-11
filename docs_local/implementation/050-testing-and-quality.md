# Classic OS Testing and Quality

## Purpose
Define the minimal quality bar for ClassicOS contributions.

## Scope
Linting, build checks, and truth alignment for capability/state-driven features.

## Non-goals
No new test frameworks or CI design; no mandates beyond current project tooling.

## Current Status (as implemented)
- Lint: `npm run lint` passes in the current tree; use it after code changes.
- Build: Run `npm run build` when asked or before shipping feature-complete changes.
- Truth alignment: Verify docs and UI follow capability truth in [src/lib/ecosystems/registry.ts](src/lib/ecosystems/registry.ts) and workspace selectors in [src/lib/state/workspace.ts](src/lib/state/workspace.ts).
- UX gating: RequirementGate and EmptyState should remain in place until capabilities flip with real adapters.

## Next Step
Keep using lint/build before merges; when capabilities change, update registry-driven checks and re-verify gating/empty states instead of bypassing them.
