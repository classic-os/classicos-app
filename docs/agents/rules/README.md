# Agent Workspace

This folder defines operational constraints for AI-assisted edits to the ClassicOS app. These are not product documentation—they are behavioral rules that Copilot and other agents must follow.

## What /agents is

A rulepack for reproducible, safe, repo-aligned code changes. Use these rules to:
- Prevent drift from repo conventions
- Enforce naming and typing disciplines
- Clarify scope boundaries
- Validate quality before completion

## How to use

Every Copilot prompt should include:
```
Follow agents/<filename> strictly.
```

For example:
```
Follow docs/agents/rules/000-global-rules.md, docs/agents/rules/010-naming-and-prose.md, and docs/agents/rules/020-tooling-and-typescript.md strictly.
```

## Agent Files Index

| File | Purpose |
|------|---------|
| [000-global-rules.md](000-global-rules.md) | Change control, scope boundaries, security posture |
| [010-naming-and-prose.md](010-naming-and-prose.md) | Classic OS naming conventions, repo-wide checks |
| [020-tooling-and-typescript.md](020-tooling-and-typescript.md) | TypeScript, BigInt, lint, toolchain verification |
| [030-web3-client-rules.md](030-web3-client-rules.md) | Wagmi/viem patterns, read-only hooks, adapters |
| [040-readonly-data-patterns.md](040-readonly-data-patterns.md) | Adapter → Hook → UI pattern, empty states, explorer links |
| [050-quality-and-checks.md](050-quality-and-checks.md) | Lint, build, diff checks; completion checklist |
| [090-agentic-workflow.md](090-agentic-workflow.md) | Two-phase planning/implementation, stop conditions, commit discipline |

## Default Posture

- **Prefer smallest safe change.** No refactoring, no unrelated improvements.
- **Stop when uncertain.** If scope, versions, or dependencies are unknown, do a read-only inventory first.
- **No speculation.** Always verify file paths, API versions, and config before implementing.

## Workflow

1. Understand the request (read agents files).
2. Inventory repo state (read package.json, tsconfig.json, existing patterns).
3. Propose minimal scoped change.
4. Implement and validate: lint, build, diff.
5. Output summary: files changed, why it's safe, what is deferred.

## Default Invocation (Recommended)

For any non-trivial work, start the Copilot prompt with:

Follow all agents/* rules strictly.

Then specify:
- the scope (module, phase, or file set)
- whether this is planning-only or implementation
- the desired commit boundary

If rules conflict with existing code, STOP and report the conflict before making changes.
