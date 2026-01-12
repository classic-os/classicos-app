# Agent Roles

This directory defines explicit roles for AI coding agents working in this repository. Each role has clear authority boundaries, allowed actions, and stop conditions.

## Why Roles?

Agent roles enable "agent teams" by allowing role-switching with well-defined boundaries:
- **One role per task** — Don't mix code execution with design work
- **Clear authority** — Each role knows what it can and cannot do
- **Safe collaboration** — Humans can orchestrate multi-agent workflows by assigning specific roles per task

## Available Roles

| Role | Purpose | Can Modify Code? | Can Modify Docs? |
|------|---------|------------------|------------------|
| [code-executor](code-executor.md) | Implement features, fix bugs, refactor code | ✅ Yes (when tasked) | ❌ No |
| [code-reviewer](code-reviewer.md) | Review code, identify risks, suggest improvements | ❌ No (read-only) | ❌ No (read-only) |
| [docs-maintainer](docs-maintainer.md) | Maintain documentation, fix links, reorganize docs | ❌ No | ✅ Yes |
| [system-designer](system-designer.md) | Design architecture, plan features, create diagrams | ❌ No (planning only) | ❌ No (outputs externally) |

## How to Use Roles

### Starting a Task

1. **Pick ONE role** based on the task type
2. **Reference the role** in your prompt (see prompt templates)
3. **Follow role constraints** strictly

Example prompt structure:
```xml
<role>code-executor</role>
<task>
  <title>Fix BigInt literal error</title>
  ...
</task>
```

### Role Selection Guide

**Use `code-executor` when:**
- Implementing new features
- Fixing bugs in application code
- Refactoring existing code
- Updating configurations or dependencies (if explicitly requested)

**Use `code-reviewer` when:**
- Reviewing pull requests or changes
- Identifying security risks or performance issues
- Suggesting improvements without making changes
- Auditing code for compliance with rules

**Use `docs-maintainer` when:**
- Creating or updating documentation
- Fixing broken links
- Reorganizing doc structure
- Consolidating or archiving docs

**Use `system-designer` when:**
- Planning new features or modules
- Designing architecture or data models
- Exploring technical options
- Creating diagrams or specifications

### Role-Switching

**Never mix roles in a single task.** If you need multiple actions:
1. Complete the current role's work
2. Commit and validate
3. Start a new task with a different role

Example workflow:
```
Task 1: system-designer → Design Portfolio Activity feature → Output: spec doc
Task 2: code-executor → Implement Portfolio Activity → Output: code changes
Task 3: code-reviewer → Review implementation → Output: findings + recommendations
Task 4: docs-maintainer → Document new feature → Output: updated docs
```

## Required Reading (All Roles)

Before starting any task, all roles must read:
- [/AGENTS.md](/AGENTS.md) — Setup, validation, guardrails
- [docs/agents/rules/](../rules/) — Mandatory behavioral constraints
- [docs/agents/prompts/](../prompts/) — Task templates

## Role Authority Matrix

| Action | code-executor | code-reviewer | docs-maintainer | system-designer |
|--------|---------------|---------------|-----------------|-----------------|
| Read code | ✅ | ✅ | ✅ | ✅ |
| Read docs | ✅ | ✅ | ✅ | ✅ |
| Modify code | ✅ (when tasked) | ❌ | ❌ | ❌ |
| Modify docs | ❌ | ❌ | ✅ | ❌ |
| Run commands | ✅ (validation only) | ❌ | ✅ (validation only) | ❌ |
| Create files | ✅ (code/config) | ❌ | ✅ (docs only) | ❌ |
| Delete files | ✅ (with justification) | ❌ | ✅ (docs only) | ❌ |
| Install dependencies | ✅ (if explicit task) | ❌ | ❌ | ❌ |
| Commit changes | ✅ | ❌ | ✅ | ❌ |

## Links

- **Setup:** [/AGENTS.md](/AGENTS.md)
- **Rules:** [docs/agents/rules/](../rules/)
- **Prompts:** [docs/agents/prompts/](../prompts/)
- **Agent Index:** [docs/agents/README.md](../README.md)
