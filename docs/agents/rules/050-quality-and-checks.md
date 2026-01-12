# Quality and Checks

Required validations before declaring a task complete.

## Pre-Completion Checklist

### 1. Lint
```bash
npm run lint
```
- All files must pass ESLint.
- Do NOT use `eslint-disable` comments without justification.
- Fix code, not the rules.

### 2. Build
```bash
npm run build
```
- TypeScript must compile with no errors.
- Next.js build must succeed.
- If build fails, propose the smallest fix localized to the touched module.

### 3. Git Diff
```bash
git diff --stat
```
- Review the full diff before declaring done.
- Verify only intended files are modified.
- No accidental whitespace changes, unrelated refactors, or debug logs.

## Build Failure Response

If `npm run build` fails:
1. **Identify the error** (read compiler output carefully).
2. **Propose the smallest fix** localized to the changed file/module.
3. **Do NOT broaden scope** to "fix all TypeScript issues" or "modernize the repo."
4. **Document the deferral** if the issue is larger than the requested task.

## Output Requirements

Every completion must include:

### Files Changed
```
Modified:
- src/adapters/example.ts
- src/hooks/useExample.ts

Created:
- src/types/example.ts
```

### Why It's Safe
Brief explanation:
- "No API surface changes; internal refactor of getBalance adapter."
- "Hook follows existing useBalance pattern; no new dependencies."
- "Read-only operation; no mutation or side effects."

### What Is Explicitly Deferred
List any out-of-scope improvements or follow-ups:
- "Caching not implemented (deferred to separate request)."
- "Error telemetry not added (deferred; requires approval)."
- "Optimistic UI not implemented (deferred; design review needed)."

## Testing Note

- Unit tests are not required for this phase.
- Manual verification via lint and build is sufficient.
- Add tests only if explicitly requested.

## Commit Message Format

If committing directly:
```
<scope>: <description>

- <key change 1>
- <key change 2>

Addresses: <issue or request>
```

Example:
```
adapters: add read-only RPC adapter for balance

- Pure function adapter for chain balance queries
- No React dependencies, no caching
- Returns bigint balance, throws on RPC failure

Addresses: /agents task #1
```
