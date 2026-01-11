# Agent Workspace (agents)

This folder defines how agentic tools (Copilot Agent, etc.) should contribute safely.

## Scope rules (must follow)
Agents may:
- Create and update files under `docs_local/` and `agents/`
- Create/update module scaffolding only when explicitly prompted with file scope

Agents must NOT:
- Modify AppShell, Sidebar, registry logic, or shared utilities unless explicitly requested
- Introduce execution logic (transactions, signing) without an explicit spec
- Add new top-level navigation categories

## Workflow requirements
- Use two-phase prompting:
  1) Repo review / alignment (no code changes)
  2) Scoped implementation (only the requested folders/files)
- Keep changes small and commit-scoped by phase.
- After changes: run `npm run lint` (and `npm run build` when applicable).

## Source of truth
- Module availability is defined by `ecosystem.capabilities.*`
- Produce mode is defined by `ecosystem.produce`
- Workspace/active chain is read via `subscribeWorkspace` + `getActiveChainId`
