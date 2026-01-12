# Classic OS Repo Conventions

## Purpose
Set guardrails for how we work in the ClassicOS repo to avoid drift and keep changes small.

## Scope
Naming, allowed edit areas, and alignment with capability truth and workspace patterns.

## Non-goals
No stylebike debates, no tooling changes beyond what the repo already uses, no new module proposals.

## Current Status (as implemented)
- Naming: "Classic OS" in prose; `ClassicOS`/`classicos` only for code/paths.
- Edit scope: Application code lives under `src/`; internal docs under `docs/`; agent guidance under `docs/agents/`.
- Capability source: Module availability defined in [src/lib/ecosystems/registry.ts](src/lib/ecosystems/registry.ts); do not diverge docs from registry truth.
- Workspace source: Active chain/testnet toggles in [src/lib/state/workspace.ts](src/lib/state/workspace.ts); pages subscribe via `useSyncExternalStore`.

## Next Step
Before changes, confirm scope (docs vs code), align with registry/workspace truth, and keep diffs minimal and path-referenced.
