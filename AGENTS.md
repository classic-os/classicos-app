# Agent Instructions — Classic OS App

This document provides essential context, commands, and boundaries for AI coding agents (GitHub Copilot, etc.) working on the Classic OS application.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Validate changes
npm run lint
npm run typecheck
npm run build
```

## Repository Overview

**Classic OS** is a Next.js application that provides an economic operating system for on-chain capital management.

### Key Directories

```
classicos-app/
├── src/
│   ├── app/              # Next.js 16 App Router pages (/, /produce, /portfolio, /deploy, /markets)
│   ├── components/       # React components (layout, primitives, ui, module-specific)
│   └── lib/              # Core logic (ecosystems, networks, state, chain utilities)
├── docs/
│   ├── agents/           # Agent rules (mandatory) and prompt templates
│   ├── dev/              # Developer guides (patterns, conventions)
│   ├── architecture/     # System architecture docs
│   └── ...               # (product, decisions, modules, handoff)
├── public/               # Static assets
└── AGENTS.md             # This file (you are here)
```

### Technology Stack

- **Framework:** Next.js 16.1.1 (App Router, React 19.2.3)
- **TypeScript:** 5.x (target: ES2017)
- **Web3:** wagmi 3.2.0, viem 2.44.0
- **Styling:** Tailwind CSS 4.x
- **State:** React Query (TanStack Query), localStorage-backed workspace state

## Available Commands

### Development
```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
npm run start        # Start production server (requires build first)
```

### Validation
```bash
npm run lint         # Run ESLint (eslint-config-next)
npm run typecheck    # Run TypeScript compiler checks (no emit)
```

### Testing
**Note:** No test suite currently exists. Validation relies on lint + typecheck + build.

**Smoke check before committing:**
```bash
npm run lint && npm run typecheck && npm run build
```

## Critical Agent Rules

### ALWAYS Follow docs/agents/rules/* Guidance

The `/docs/agents/rules/` directory contains **mandatory** behavioral rules. Read all files:

1. `docs/agents/rules/000-global-rules.md` — Change control, scope boundaries, prohibited actions
2. `docs/agents/rules/010-naming-and-prose.md` — Naming conventions ("Classic OS" in prose, never "ClassicOS")
3. `docs/agents/rules/020-tooling-and-typescript.md` — TypeScript target (ES2017), BigInt handling, lint discipline
4. `docs/agents/rules/030-web3-client-rules.md` — wagmi v3 + viem v2 patterns, read-only by default
5. `docs/agents/rules/040-readonly-data-patterns.md` — Adapter → Hook → UI layering, honest empty states
6. `docs/agents/rules/050-quality-and-checks.md` — Pre-completion checklist (lint, build, git diff)
7. `docs/agents/rules/090-agentic-workflow.md` — Two-phase workflow (planning, then implementation)

**See also:** `/docs/agents/README.md` for agent doc index and `/docs/agents/prompts/` for task templates.

**Key constraint:** All changes must pass lint and build. No exceptions.

### Do NOT Touch Without Explicit Request

- `src/app/layout.tsx` — Root layout (providers, fonts, metadata)
- `src/components/layout/AppShell.tsx` — Application shell frame
- `src/components/layout/Sidebar.tsx` and `NavItems.ts` — Navigation registry
- `src/lib/ecosystems/registry.ts` — Capability truth table (only flip flags when adapters ready)
- `src/lib/state/workspace.ts` — Workspace state (active chain, testnet toggle)
- `package.json`, `tsconfig.json`, `eslint.config.mjs` — Unless tooling changes are the explicit task

### Keep Diffs Small

- One module or feature per change
- No drive-by refactors
- No "while we're here" improvements
- No folder reorganization unless that's the task

### Read-Only by Default

- Adapters, hooks, and utilities must be **read-only** (RPC calls, no signing, no transactions)
- Do NOT implement transaction execution unless explicitly requested
- If a feature requires mutation, propose it in two phases:
  1. Read-only adapter/hook
  2. Separate request for execution layer

### TypeScript Constraints

- **Target: ES2017** — No BigInt literals (`0n`). Use `BigInt()` constructor.
- **Strict mode enabled** — All type errors must be fixed (no `any` unless unavoidable)
- **No concrete viem types in adapters** — Use structural interfaces (see `docs/agents/rules/030-web3-client-rules.md`)

### Naming Conventions

- **Prose:** "Classic OS" (with space) in all documentation, UI copy, comments
- **Code:** `classicos` (lowercase, no space) in file paths, variables, package names
- **Files:** kebab-case, no "phase-*" names (use capability/milestone names)
- **See:** `docs/agents/rules/010-naming-and-prose.md` and `docs/dev/060-naming-and-numbering.md`

## Validation Checklist (Before Completion)

Every change must pass this checklist:

### 1. Lint
```bash
npm run lint
```
✓ Zero errors, zero warnings (or justify any added exceptions)

### 2. TypeCheck
```bash
npm run typecheck
```
✓ Zero TypeScript errors

### 3. Build
```bash
npm run build
```
✓ Next.js build succeeds with no errors

### 4. Review Diff
```bash
git diff --stat
git diff
```
✓ Only intended files modified  
✓ No accidental whitespace changes  
✓ No debug console.log statements  
✓ Diff is reviewable (not hundreds of lines)

### 5. Agent Rules Compliance
- [ ] Followed all `docs/agents/rules/*.md` rules
- [ ] Change is scoped to a single module/feature
- [ ] No prohibited areas touched
- [ ] Naming conventions respected ("Classic OS" in prose)
- [ ] Read-only pattern enforced (no transaction signing unless requested)

## Common Patterns

### Adding a New Page

1. Create route under `src/app/<module>/page.tsx`
2. Use existing primitives: `ModuleHeader`, `Panel`, `EmptyState`, `RequirementGate`
3. Check capability gate: `ecosystem.capabilities.<module>`
4. Wire to `NavItems.ts` only if creating a top-level module (rare; requires approval)

### Creating an Adapter (Read-Only)

1. Pure function in `src/lib/<module>/` or `src/adapters/<module>/`
2. No React dependencies
3. Structural types for viem clients (not `PublicClient` imports)
4. Returns data or throws
5. See `docs/agents/rules/040-readonly-data-patterns.md` for 3-layer pattern

### Creating a Hook

1. Wraps adapter with React lifecycle
2. Handles prerequisites (wallet connected, correct chain)
3. Manages loading, error, refetch states
4. Returns explicit state object: `{ data, isLoading, error }`
5. Use React Query (`useQuery`) for caching if appropriate

### Creating a UI Component

1. Use TypeScript, explicit props interface
2. Render states: disconnected, loading, error, empty, data
3. No speculation ("Your data will appear soon" ❌ / "No data yet" ✓)
4. Use Tailwind classes (no inline styles)
5. Export as named export (not default unless page)

## Environment Variables

**Currently:** No environment variables required for development.

**If API keys are needed in the future:** Document them in `.env.example` and update this section.

## Troubleshooting

### "Module not found" errors
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### TypeScript errors after dependency update
```bash
npm run typecheck
```
Fix all errors before proceeding. Do NOT suppress with `@ts-ignore` unless unavoidable.

### ESLint errors
```bash
npm run lint
```
Fix code, not config. Only add `eslint-disable` comments with justification.

### Build fails
```bash
npm run build
```
Read error carefully. Most common causes:
- Missing `"use client"` directive in Client Components
- Type errors (run `npm run typecheck` first)
- Import path issues (verify relative paths)

## Getting Help

1. **Read docs/agents/rules/*.md** — Most questions answered there
2. **Check docs/** — Architecture, decisions, module plans, dev guides
3. **Search codebase** — Look for existing patterns before inventing new ones
4. **Ask specific questions** — Include file paths, error messages, what you've tried

## Commit Discipline

### Commit Message Format
```
<scope>: <description>

[optional body for context]
```

### Scope Prefixes
- `Docs:` — docs/ changes (any documentation)
- `Agents:` — docs/agents/ rule or prompt updates
- `Portfolio:` / `Markets:` / `Produce:` / `Deploy:` / `Home:` — module code changes
- `Build:` / `Tooling:` — package.json, tsconfig, eslint, etc.
- `Refactor:` — code reorganization (no behavior change)

### Examples
```
Portfolio: add activity explorer link

- Create src/lib/activity/links.ts adapter
- Create src/hooks/useActivityExplorerLink.ts hook
- Update ActivityPanel.tsx to render explorer link
```

```
Docs: normalize milestone naming in handoff docs

- Replace "Phase 6/7/8" with capability names
- Update 010-milestones.md and 020-roadmap-sequence.md
```

## Repository Conventions

- **Prose naming:** "Classic OS" (with space)
- **File naming:** kebab-case, descriptive (no "phase-*")
- **Folder structure:** See `docs/dev/060-naming-and-numbering.md`
- **No external dependencies without justification**
- **RPC-only** — No off-chain indexers or APIs by default
- **Capability-gated** — Respect `ecosystem.capabilities.*` flags

## What Success Looks Like

A successful agent contribution:
- ✓ Passes all validation commands (lint, typecheck, build)
- ✓ Follows all `docs/agents/rules/*.md` rules
- ✓ Keeps diff small and focused
- ✓ Includes clear commit message
- ✓ No accidental changes to prohibited areas
- ✓ Honest empty states (no speculation)
- ✓ Read-only pattern unless execution explicitly requested

## What to Avoid

- ❌ Touching AppShell, Sidebar, registry without request
- ❌ Adding dependencies without justification
- ❌ Using BigInt literals (`0n`) — ES2017 target doesn't support them
- ❌ Marketing language in UI copy ("powerful", "best-in-class", etc.)
- ❌ Speculative placeholders ("Your data will appear soon")
- ❌ Bundling multiple unrelated changes
- ❌ Creating new top-level modules without approval
- ❌ Transaction signing/execution without explicit request
- ❌ External APIs (indexers, GraphQL) without approval

---

**Last Updated:** 2026-01-11

For detailed implementation guidance, see `/docs/agents/` (rules and prompt templates).
For architectural context, see `/docs/architecture/`.
For roadmap and decisions, see `/docs/handoff/` and `/docs/decisions/`.
