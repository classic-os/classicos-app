# Classic OS Copilot Workflow

## Purpose
Set expectations for AI-assisted changes in the ClassicOS repo to keep diffs safe and scoped.

## Scope
Two-phase prompting, scoping rules, diff sizing, and post-run checks.

## Non-goals
No new automation tooling; no relaxation of scope rules in agents/README.md.

## Current Status (as implemented)
- Two-phase flow: (1) Review/alignment pass with no edits; (2) Scoped implementation only in approved paths (usually `docs_local/` unless explicitly told otherwise).
- Strict scoping: Agents must honor allowed folders and avoid AppShell/registry/state changes unless explicitly requested.
- Small diffs: Prefer minimal, reviewable patches tied to a single concern.
- Post-run checks: Run `git diff` to verify scope; run `npm run lint` (and build when asked) after code edits.

## Next Step
Continue using two-phase prompts and keep changes small; refuse work outside scope, and always close with diff + lint/build verification when code changes occur.
