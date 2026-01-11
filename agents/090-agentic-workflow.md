# Agentic Workflow (Planning → Implementation)

Standard two-phase process for Classic OS agentic contributions.

## Two-Phase Rule (Default)

### Phase A: Planning / Inventory (Read-Only)
- Inspect repo state: `package.json`, `tsconfig.json`, existing patterns.
- Confirm versions of key dependencies (Next.js, TypeScript, wagmi, viem, ESLint).
- Identify file paths and naming conventions relevant to the request.
- Propose minimal plan in prose (no code changes yet).
- Stop and clarify if prerequisites are unknown.

**Output:** Inventory summary + proposed minimal change (1–2 paragraphs).

### Phase B: Implementation
- Apply only the proposed plan (no scope expansion).
- Keep diffs small and localized to a single module/concern.
- Run lint and build; fix issues in isolation.
- Commit at the natural boundary (one logical change per commit).
- List files changed, why it's safe, and deferred items.

**Output:** "Done" with summary (files, safety, deferrals).

### Stop Between Phases?
- Yes, if the planning phase revealed unknown prerequisites.
- Yes, if clarification is needed on scope or priority.
- No re-planning unless the request changes fundamentally.

## When to Stop and Ask

### Versions Unknown
- Package versions not confirmed in `package.json` (e.g., wagmi v2 vs v3?).
- TypeScript target or lib settings unclear.
- **Action:** Read `package.json` first; do not guess.

### Repo Patterns Conflict
- Proposed pattern contradicts existing code in the module.
- Existing hook/adapter uses a different structure than proposed.
- **Action:** Search for usage; propose pattern alignment before implementing.

### Change Spans Multiple Modules
- Affects AppShell, Sidebar, or shared utilities unexpectedly.
- Requires coordinated changes across multiple top-level features.
- **Action:** Stop; ask for explicit approval to proceed with cross-module changes.

### Violates /agents Rules
- Proposed change breaks a rule in agents/* files.
- Requires adding dependencies, logging secrets, or external APIs.
- **Action:** Stop; report the rule violation and ask for clarification.

### Uncertain of Outcome
- Unclear if implementation will pass lint or build without refactoring.
- Cannot determine if the feature request maps to existing code.
- **Action:** Stop; ask for more specific requirements.

## Commit Discipline

### One Logical Change Per Commit
- Do not bundle infrastructure + feature changes.
- Infrastructure commits (tooling, config) before feature commits.
- One module per commit if possible; multi-module only if logically coupled.

### Commit Message Format
```
<scope>: <description>

- <key change 1>
- <key change 2>

Addresses: <issue / request>
```

### Example
```
hooks: add read-only useBalance hook

- Wraps getBalance adapter with loading/error/refetch states
- Validates wallet connection before querying
- Returns explicit { data, isLoading, error } state

Addresses: /agents phase B task
```

## Definition of Done

- ✓ `npm run lint` passes (no errors, no eslint-disable without reason).
- ✓ `npm run build` succeeds (TypeScript compiles, Next.js builds).
- ✓ Files changed match scope (no accidental modifications).
- ✓ Deferred items listed explicitly (what was not done, why).
- ✓ Commit boundary respected (one logical change, no bundling).
- ✓ Summary provided (files changed, why safe, deferrals).

### If Lint or Build Fails
- Do NOT broaden scope to "fix all issues."
- Propose the smallest fix localized to the changed file.
- Document deferral for larger refactors.

## Classic OS Agentic Defaults

- **Read-only by default:** No transactions, signing, or mutations unless explicitly requested.
- **No external APIs:** RPC-only. Indexers/GraphQL deferred unless approved.
- **Honest UI:** Empty states over speculation; explicit error states.
- **Small diffs:** Localized changes; no drive-by refactors.
- **Verify before implementing:** Two-phase workflow prevents rework.
