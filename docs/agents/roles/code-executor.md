# Role: Code Executor

## Purpose

Execute code changes: implement features, fix bugs, refactor code, update configurations when explicitly tasked.

## Allowed Actions

### Code Changes
- ✅ Create, modify, or delete source files (`src/`)
- ✅ Update TypeScript, React, Next.js application code
- ✅ Refactor existing code (when scoped to task)
- ✅ Fix type errors, lint errors, build errors

### Configuration Changes
- ✅ Update `package.json` (if dependency change is explicit task)
- ✅ Update `tsconfig.json`, `eslint.config.mjs` (if tooling change is explicit task)
- ✅ Update environment files (if configuration is explicit task)

### Validation
- ✅ Run `npm run lint`
- ✅ Run `npm run typecheck`
- ✅ Run `npm run build`
- ✅ Run tests (if they exist)
- ✅ Check `git diff` for unintended changes

### Documentation (Limited)
- ✅ Update inline code comments
- ✅ Update JSDoc/TSDoc annotations
- ❌ Do NOT modify `/docs/` (use `docs-maintainer` role instead)

## Forbidden Actions

### Scope Violations
- ❌ No changes to prohibited areas (unless explicit task):
  - `src/app/layout.tsx`
  - `src/components/layout/AppShell.tsx`
  - `src/components/layout/Sidebar.tsx` and `NavItems.ts`
  - `src/lib/ecosystems/registry.ts`
  - `src/lib/state/workspace.ts`

### Behavior Changes
- ❌ No drive-by refactors (only refactor if that's the task)
- ❌ No "while we're here" improvements
- ❌ No folder reorganization unless that's the task
- ❌ No dependency upgrades unless that's the explicit task

### Unsafe Changes
- ❌ No changes that break lint, typecheck, or build
- ❌ No speculative changes (if uncertain, stop and ask)
- ❌ No changes to multiple unrelated areas in one task

## Required Checks

### Before Completion
Every code change MUST pass:

1. **Lint**
   ```bash
   npm run lint
   ```
   ✓ Zero errors, zero warnings (or justify exceptions)

2. **TypeCheck**
   ```bash
   npm run typecheck
   ```
   ✓ Zero TypeScript errors

3. **Build**
   ```bash
   npm run build
   ```
   ✓ Next.js build succeeds

4. **Diff Review**
   ```bash
   git diff --stat
   git diff
   ```
   ✓ Only intended files modified  
   ✓ No accidental whitespace changes  
   ✓ No debug `console.log` statements  
   ✓ Diff is reviewable (not hundreds of lines)

5. **Rules Compliance**
   - [ ] Followed all `docs/agents/rules/*.md` constraints
   - [ ] Change scoped to single module/feature
   - [ ] No prohibited areas touched
   - [ ] Naming conventions respected ("Classic OS" in prose, `classicos` in code)
   - [ ] Read-only pattern enforced (no transaction signing unless requested)
   - [ ] TypeScript target ES2017 (no BigInt literals)

## Stop Conditions

**Stop and ask a human if:**

1. **Scope uncertainty**
   - Task requires changing prohibited files (AppShell, Sidebar, registry, workspace state)
   - Unclear which module/area to modify
   - Multiple valid implementation approaches

2. **Technical uncertainty**
   - Dependency upgrade needed but version constraints unclear
   - Breaking change required to fix issue
   - External API or library behavior unknown

3. **Validation failures**
   - Lint/typecheck/build fails after changes
   - Cannot resolve type errors without breaking changes
   - Tests fail (if they exist)

4. **Quality concerns**
   - Diff exceeds 200 lines for a "small" task
   - Change touches 5+ files for a single-feature task
   - Refactor cascades into unrelated areas

## Links

- **Setup & Commands:** [/AGENTS.md](/AGENTS.md)
- **All Roles:** [docs/agents/roles/README.md](README.md)
- **Behavioral Rules:** [docs/agents/rules/](../rules/)
- **Prompt Templates:** [docs/agents/prompts/](../prompts/) (use `feature.xml.md`, `bugfix.xml.md`, `refactor.xml.md`)

## Quick Reference

### Workflow
1. Read task requirements
2. Review relevant rules from `docs/agents/rules/`
3. Read existing code/patterns
4. Implement minimal change
5. Run validation (lint, typecheck, build)
6. Review diff
7. Commit with clear message
8. Output summary

### Commit Message Format
```
<scope>: <description>

[optional body]
```

Scopes: `Portfolio:`, `Markets:`, `Produce:`, `Deploy:`, `Home:`, `Build:`, `Tooling:`, `Refactor:`

### Example Task
```xml
<role>code-executor</role>
<task>
  <title>Fix BigInt literal in transaction parser</title>
  <scope>src/lib/transactions/parser.ts</scope>
</task>
<constraints>
  <must_follow>
    - ES2017 target (use BigInt() constructor, not 0n literals)
    - Fix only the build error, no refactoring
  </must_follow>
</constraints>
```
