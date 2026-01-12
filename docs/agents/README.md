# Agent Documentation

This directory contains all agent-facing guidance for working in the Classic OS app repository.

## Quick Links

- **Setup & Commands:** [/AGENTS.md](/AGENTS.md) (root-level, authoritative)
- **Copilot Instructions:** [/.github/copilot-instructions.md](/.github/copilot-instructions.md)

## Contents

### Roles (`roles/`)
Explicit agent roles with clear authority boundaries:
- **code-executor** — Implement features, fix bugs, refactor code
- **code-reviewer** — Review code, identify risks (read-only)
- **docs-maintainer** — Maintain documentation (docs-only)
- **system-designer** — Design architecture, plan features (planning-only)

See [roles/README.md](roles/README.md) for role selection guide and authority matrix.

### Rules (`rules/`)
Mandatory behavioral constraints for AI coding agents:
- Change control, scope boundaries
- Naming conventions
- TypeScript and tooling requirements
- Web3 patterns (wagmi/viem)
- Read-only data layering
- Quality checks
- Agentic workflow

### Prompts (`prompts/`)
Copy/paste XML-tagged prompt templates for common tasks:
- Task template (general-purpose)
- Bug fixes
- Refactoring
- Feature implementation
- UI changes

## How to Use

### Pick a Role

**One role per task.** Choose based on what you're doing:
- **Implementing code?** → [code-executor](roles/code-executor.md)
- **Reviewing changes?** → [code-reviewer](roles/code-reviewer.md)
- **Updating docs?** → [docs-maintainer](roles/docs-maintainer.md)
- **Designing features?** → [system-designer](roles/system-designer.md)

See [roles/README.md](roles/README.md) for detailed role descriptions and authority matrix.

**Don't mix roles.** If you need to design AND implement, do it in separate tasks:
1. Task 1: `system-designer` → output design doc
2. Task 2: `code-executor` → implement from design
3. Task 3: `docs-maintainer` → document implementation

### For Agents
1. **Pick your role** from [roles/](roles/) based on task type
2. Read [/AGENTS.md](/AGENTS.md) first (setup, validation, guardrails)
3. Review all `rules/*.md` files for behavioral constraints
4. Use `prompts/*.xml.md` templates when starting new tasks

### For Humans
- **Assign a role** when creating tasks (e.g., "As `code-executor`, fix bug X")
- When filing agent tasks, copy a template from `prompts/` and fill in placeholders
- Reference specific rules from `rules/` in your prompts
- Always validate after agent work: `npm run lint && npm run typecheck && npm run build`

## Conventions

- **All rules are mandatory** — agents must follow every constraint
- **Small diffs only** — one module/feature per change
- **Read-only by default** — no transaction signing unless explicitly requested
- **Validate always** — lint, typecheck, build before completion
