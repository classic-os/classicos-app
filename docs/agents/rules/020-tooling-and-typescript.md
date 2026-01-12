# Tooling and TypeScript

Rules for TypeScript, toolchain versioning, and modern 2025/26 JavaScript patterns.

## Toolchain Verification

### Always Verify First
Before proposing API usage, check the actual versions in `package.json`:
- Next.js version (affects API availability)
- TypeScript version (affects language features)
- wagmi version (affects hook API)
- viem version (affects client/adapter interfaces)
- ESLint version and config

**Why:** Default model assumptions about API behavior are outdated. The repo may use specific versions with breaking changes.

### Two-Phase Approach
1. **Read `package.json` first** (no code changes).
2. **Then propose API usage** aligned to verified versions.

## TypeScript Rules

### No Explicit `any`
- Avoid `any` type annotations.
- Use `unknown` with runtime type guards instead.

**Example:**
```typescript
// ❌ DO NOT
const data: any = response.data;

// ✅ DO
const data: unknown = response.data;
if (typeof data === 'string') { /* ... */ }
```

### BigInt Handling

#### DO NOT Use BigInt Literals Without ES2020+ Target
- BigInt literals (`0n`, `10n`) require TypeScript target ES2020+.
- If unsure about tsconfig target, use the BigInt constructor.

**Example:**
```typescript
// ❌ DO NOT (unless ES2020+ confirmed)
const amount = 1000n;

// ✅ DO (safe)
const amount = BigInt(1000);
const zero = BigInt(0);
```

#### Check tsconfig.json
- If `target: "ES2020"` or higher and `lib` includes `"ES2020"`, BigInt literals are safe.
- Otherwise, use `BigInt()` constructor.

### No Structural Assumptions
- Do NOT assume TypeScript `lib` or `target` settings.
- Do NOT rely on undocumented type inference.
- Explicitly type boundaries, especially for library integrations.

## Lint Handling

### Must Pass `npm run lint`
- Every change must pass the configured ESLint rules.
- Do NOT introduce `// eslint-disable` without justification.
- If lint fails, fix the code, not the config.

### Common Lint Failures
- Missing `'use client'` in Client Components.
- Unused variables or imports.
- Unguarded type assertions.

**Fix approach:**
1. Address the actual code issue first.
2. Only add lint rules/config if the code cannot be fixed (rare).

## Output Style

### Structural Typing at Boundaries
- When library types conflict with repo types, prefer structural (duck-typed) interfaces.
- Avoid brittle nominal typing that breaks across library versions.

**Example:**
```typescript
// ❌ DO NOT (brittle—depends on exact Client type)
import { PublicClient } from 'viem';
export function myAdapter(client: PublicClient) { /* ... */ }

// ✅ DO (structural—works across versions)
interface ReadClient {
  call(args: any): Promise<any>;
  readContract(args: any): Promise<any>;
}
export function myAdapter(client: ReadClient) { /* ... */ }
```

### Null/Undefined Handling
- Use optional chaining (`?.`) and nullish coalescing (`??`) where appropriate.
- Avoid unnecessary null checks; leverage TypeScript's strict null checks if enabled.
