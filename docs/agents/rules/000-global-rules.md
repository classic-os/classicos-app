# Global Rules

Core constraints for all agentic edits to ClassicOS.

## Change Control

### Small Diffs Required
- Every change must be localized to a single module, page, or feature.
- No drive-by refactors, folder reorganizations, or "while we're here" improvements.
- If a larger refactor is needed, defer it and document in a separate issue.

### Stay in Scope
- Restrict edits to the folder/files explicitly mentioned in the request.
- Do not expand scope to "modernize the repo" or "improve patterns everywhere."
- Do not create new top-level modules or navigation roots without explicit approval.

### Prohibited Changes
- Do NOT touch AppShell, Sidebar, or registry logic unless explicitly requested.
- Do NOT modify shared utilities or hooks without searching for all usages first.
- Do NOT introduce new external dependencies without justification.

## Execution Logic

### Read-Only by Default
- Adapters, hooks, and utilities must be read-only (RPC calls, no signing, no transactions).
- Do NOT implement execution (transaction signing, wallet interactions, state mutation) unless explicitly requested in the task.
- If a feature requires mutation, propose the change in two phases:
  1. Read-only adapter/hook
  2. Separate implementation request for the execution layer

## Clarification Behavior

### Inventory First
If you encounter unknown prerequisites—file paths, package versions, existing patterns—stop and do a read-only inventory:
- Read `package.json` to verify versions of Next.js, TypeScript, wagmi, viem, ESLint.
- Scan for existing patterns (e.g., search for `WalletConnector`, hook naming, state patterns).
- Check `tsconfig.json` for target and lib settings.
- Do NOT guess; inspect then implement in two passes.

### Uncertainty = Stop
- If you cannot determine the scope, file location, or API behavior, ask for clarification.
- Do not proceed with speculation.

## Security Posture

### No Secrets
- Never log secrets, private keys, or environment values.
- Do NOT introduce console logging without purpose (and remove debug logs before committing).

### No Telemetry
- Do NOT add analytics, tracking, or third-party telemetry without explicit approval.
- Do NOT introduce hidden data collection.

### Dependency Review
- Every new dependency must be justified.
- Do NOT add unreviewed or untrusted third-party packages.
- Prefer built-in or existing ecosystem libraries (wagmi, viem, Next.js, ethers, etc.).

## Scope Boundaries

### What Agents CAN Edit
- Files under `/agents/` (this rulepack).
- Module-specific files (`src/modules/*/`, `src/pages/*`).
- Hook implementations (`src/hooks/`).
- Adapter implementations (`src/adapters/`).
- Type definitions and shared types.
- Component files within a single feature scope.

### What Agents MUST NOT Edit Without Explicit Request
- AppShell (`src/app/AppShell.tsx`).
- Top-level layout or routing logic.
- Sidebar or navigation registry.
- Global state management (outside a specific module).
- Package.json, tsconfig.json, ESLint/Prettier config (unless the request explicitly includes tooling changes).
