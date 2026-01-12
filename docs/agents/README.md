# Agent Documentation

This directory contains all agent-facing guidance for working in the Classic OS app repository.

## Quick Links

- **Setup & Commands:** [/AGENTS.md](/AGENTS.md) (root-level, authoritative)
- **Copilot Instructions:** [/.github/copilot-instructions.md](/.github/copilot-instructions.md)

## Contents

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

### For Agents
1. Read [/AGENTS.md](/AGENTS.md) first (setup, validation, guardrails)
2. Review all `rules/*.md` files for behavioral constraints
3. Use `prompts/*.xml.md` templates when starting new tasks

### For Humans
- When filing agent tasks, copy a template from `prompts/` and fill in placeholders
- Reference specific rules from `rules/` in your prompts
- Always validate after agent work: `npm run lint && npm run typecheck && npm run build`

## Conventions

- **All rules are mandatory** — agents must follow every constraint
- **Small diffs only** — one module/feature per change
- **Read-only by default** — no transaction signing unless explicitly requested
- **Validate always** — lint, typecheck, build before completion
