# GitHub Copilot Instructions — Classic OS App

## Source of Truth

**Read `AGENTS.md` first.** This file is a quick reference that points to the complete agent guidance.

## Quick Commands

```bash
npm run lint        # ESLint validation
npm run typecheck   # TypeScript validation
npm run build       # Production build check
```

## Before Committing

```bash
npm run lint && npm run typecheck && npm run build
```

All three must pass. No exceptions.

## Mandatory Reading

All agent activity MUST comply with rules in:
- `agents/000-global-rules.md` — Change control, scope boundaries
- `agents/010-naming-and-prose.md` — Naming ("Classic OS" in prose)
- `agents/020-tooling-and-typescript.md` — TypeScript target ES2017, no BigInt literals
- `agents/030-web3-client-rules.md` — wagmi v3 + viem v2 patterns
- `agents/040-readonly-data-patterns.md` — Adapter → Hook → UI layering
- `agents/050-quality-and-checks.md` — Pre-completion checklist
- `agents/090-agentic-workflow.md` — Two-phase workflow

## Key Constraints

### TypeScript
- **Target: ES2017** — Use `BigInt()` constructor, NOT `0n` literals
- **Strict mode enabled** — Fix all type errors
- **No concrete viem types in adapters** — Use structural interfaces

### Web3
- **Default to read-only** — No transaction signing unless explicitly requested
- **wagmi v3 API** — Mutate-style hooks (`useWriteContract`, NOT `usePrepareWriteContract`)
- **viem v2** — Structural typing recommended over concrete imports

### Naming
- **Prose:** "Classic OS" (with space)
- **Code:** `classicos` (lowercase, no space)
- **Files:** kebab-case, no "phase-*" names

### Scope Control
- **Keep diffs small** — One feature per change
- **No drive-by refactors** — Stay focused on the task
- **No dependency churn** — Don't add packages without justification

### Prohibited Without Request
Do NOT modify these areas unless the task explicitly targets them:
- `src/app/layout.tsx` — Root layout
- `src/components/layout/AppShell.tsx` — Application shell
- `src/components/layout/Sidebar.tsx` and `NavItems.ts` — Navigation
- `src/lib/ecosystems/registry.ts` — Capability truth table
- `src/lib/state/workspace.ts` — Workspace state
- `package.json`, `tsconfig.json`, `eslint.config.mjs` — Tooling config

## Code Patterns

### Adding a Read-Only Feature
1. Create adapter (pure function, no React)
2. Create hook (wraps adapter with React lifecycle)
3. Create UI component (handles all states: disconnected, loading, error, empty, data)
4. Update parent component to wire it in

See `agents/040-readonly-data-patterns.md` for the 3-layer pattern.

### Honest Empty States
- ✓ "No data available" (truthful)
- ✓ "No transactions found" (factual)
- ❌ "Your data will appear soon" (speculative)
- ❌ "Powerful insights coming" (marketing)

### Component Structure
```tsx
"use client"; // if using hooks

interface MyComponentProps {
  // explicit props
}

export function MyComponent({ prop }: MyComponentProps) {
  // hooks
  // state
  // handlers
  // render all states
  return (/* JSX */);
}
```

## Validation Checklist

Before marking work complete:
- [ ] `npm run lint` passes (zero errors/warnings)
- [ ] `npm run typecheck` passes (zero errors)
- [ ] `npm run build` succeeds
- [ ] `git diff` shows only intended changes
- [ ] No `console.log` statements left behind
- [ ] All `agents/*.md` rules followed
- [ ] Naming conventions respected ("Classic OS" in prose)
- [ ] Read-only pattern enforced (no transaction signing unless requested)

## Commit Message Format

```
<scope>: <description>

[optional body]
```

**Scopes:** `Docs:`, `Agents:`, `Portfolio:`, `Markets:`, `Produce:`, `Deploy:`, `Home:`, `Build:`, `Tooling:`, `Refactor:`

**Example:**
```
Portfolio: add activity explorer link

- Create activity links adapter
- Create useActivityExplorerLink hook
- Update ActivityPanel to render link
```

## Common Errors

### "Cannot find module" or "Module not found"
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### BigInt literal error
```
Error: BigInt literals are not available when targeting lower than ES2020
```
**Fix:** Use `BigInt()` constructor instead of `0n` literals.

### wagmi v2 patterns in v3 codebase
**Wrong:** `usePrepareWriteContract`, `usePrepareContractWrite`
**Correct:** `useWriteContract`, `useSimulateContract`

See `agents/030-web3-client-rules.md` for full migration guide.

## Additional Resources

- **Full agent guidance:** `AGENTS.md` at repo root
- **Architecture docs:** `docs_local/architecture/`
- **Module plans:** `docs_local/modules/<module>/`
- **Decisions:** `docs_local/decisions/`
- **Implementation guides:** `docs_local/implementation/`

---

**For comprehensive instructions, see `AGENTS.md` at the repo root.**
