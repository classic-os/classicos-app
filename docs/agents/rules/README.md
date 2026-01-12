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

## Rules Immutability Guardrail

**Rules in this folder (`/docs/agents/rules/**`) must NOT be edited by default.**

Changes to rules require:
- An explicit task whose goal is to modify agent rules
- `<role>docs-maintainer</role>` (only docs-maintainer can change rules)
- Clear rationale for why the rule change is necessary
- Summary of behavior impact (what will change for agents after this edit)

**No other role should modify rules.** If a rule seems wrong or outdated:
1. Stop the current task
2. Document the conflict/issue
3. Request a separate task to update the rule (assigned to docs-maintainer)

**No inline rule overrides permitted:**
- Tasks MUST NOT override rules inline (no "temporary exceptions" inside prompts)
- If a rule blocks progress or conflicts arise, STOP and request a dedicated rules-change task using `<role>docs-maintainer</role>`
- Rules exist to prevent drift; inline overrides defeat the purpose

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
