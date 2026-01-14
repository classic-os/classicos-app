# GitHub Copilot Instructions - Classic OS

Coding guidelines for GitHub Copilot when working on Classic OS (classicos-app).

## Tech Stack

- Next.js 16.1.1 (App Router), React 19.2.3, TypeScript 5.x (ES2017 target)
- wagmi 3.2.0, viem 2.44.0, TanStack React Query 5.90.16
- Tailwind CSS 4.x, Framer Motion 12.24.12

## Commands

```bash
npm run dev          # Development server
npm run lint         # ESLint (must pass)
npm run typecheck    # TypeScript check (must pass)
npm run build        # Production build (must pass)
```

## Core Patterns

### Three-Layer Architecture

**All data access uses three layers:**

1. **Adapter** (`src/lib/`) - Pure functions, RPC-only, no React
2. **Hook** (`src/hooks/`) - React integration with TanStack Query
3. **UI** - Explicit state rendering (disconnected, loading, error, empty, data)

Example:
```typescript
// Adapter: src/lib/balance/adapter.ts
export async function getBalance(client, address, chainId): Promise<bigint> {
  return await client.getBalance({ address })
}

// Hook: src/hooks/useBalance.ts
export function useBalance(address) {
  return useQuery({
    queryKey: ['balance', address],
    queryFn: () => getBalance(client, address, chainId),
    enabled: Boolean(address && client),
  })
}

// UI: Component
function BalanceDisplay({ address }) {
  const { data, isLoading, error } = useBalance(address)
  if (!address) return <EmptyState title="No wallet connected" />
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>Balance: {formatEther(data)} ETC</div>
}
```

### Capability-Based Features

Features are gated by network capabilities:

```typescript
import { getEcosystem } from '@/lib/ecosystems/registry'

const ecosystem = getEcosystem(activeChainId)

if (!ecosystem.capabilities.portfolio) {
  return <EmptyState title="Portfolio not available on this network" />
}
```

### Workspace State

Active chain and testnet visibility stored in localStorage:

```typescript
import { useSyncExternalStore } from 'react'
import { subscribeWorkspace, getActiveChainId } from '@/lib/state/workspace'

const activeChainId = useSyncExternalStore(
  subscribeWorkspace,
  getActiveChainId,
  () => 61  // SSR default
)
```

## Protected Files

Do NOT modify these without explicit request:

- `src/app/layout.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/NavItems.ts`
- `src/lib/ecosystems/registry.ts`
- `src/lib/state/workspace.ts`
- `src/lib/networks/registry.ts`
- `package.json`, `tsconfig.json`, `eslint.config.mjs`

## TypeScript Rules

1. **No BigInt literals** (ES2017 target):
   ```typescript
   // ❌ Wrong
   const value = 1000000000000000000n

   // ✅ Correct
   const value = BigInt("1000000000000000000")
   ```

2. **No explicit `any`** - Use `unknown` with type guards

3. **Structural types for viem** - Avoid importing concrete PublicClient types in adapters

4. **Strict null checks** - Always handle undefined explicitly

## Web3 Patterns

**Default: Read-Only**
- All web3 calls are RPC-only
- No transaction signing without explicit request
- No balance transfers or state mutations

**Allowed:**
- `usePublicClient()`, `useAccount()`, `useBalance()`, `useReadContract()`
- `useChainId()`, `useConnections()`

**Forbidden (without request):**
- `useWriteContract()`, `useSendTransaction()`, `useSignMessage()`

**wagmi v3 Syntax:**
```typescript
// ✅ Correct (v3 mutations)
const { mutate: connect } = useConnect()
const { mutateAsync: switchChain } = useSwitchChain()

onClick={() => connect({ connector: injected() })}
await switchChain({ chainId: 61 })
```

**No External APIs:**
- No indexers, GraphQL endpoints, or external services
- RPC-only architecture

## Naming Conventions

- **Prose/UI:** "Classic OS" (with space)
- **Code:** `classicos` (lowercase, no space)
- **Files:** PascalCase components, kebab-case utilities, camelCase hooks

## Validation Requirements

Before committing:
```bash
npm run lint && npm run typecheck && npm run build
git diff --stat  # Review changes
```

All three must pass with zero errors.

## Commit Format

```
<scope>: <description>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Scopes:** Portfolio, Produce, Deploy, Markets, Home, Docs, Build, Tooling, Refactor

## Component Structure

```
src/components/
├── layout/       # Protected - Application frame
├── primitives/   # Workspace-aware atoms
├── modules/      # Feature domains (portfolio, produce, deploy, markets)
├── ui/           # Generic reusable components
└── providers/    # Context providers
```

## Key Principles

**Honest Empty States:**
- ✅ "No portfolio items yet"
- ✅ "Connect wallet to view balances"
- ❌ "Your data will appear soon"
- ❌ "Coming soon"

**Small Diffs:**
- One feature per commit
- No drive-by refactors
- Focused, reviewable changes

**Capability-First:**
- Always check ecosystem capabilities before rendering features
- Use `RequirementGate` for wallet-dependent content

## Common Pitfalls to Avoid

❌ **Don't:**
- Use BigInt literals (`0n`, `10n`)
- Skip capability checks
- Modify protected files
- Add external API calls
- Create speculative UI
- Skip validation commands

✅ **Do:**
- Use `BigInt()` constructor
- Check capabilities first
- Ask before touching protected files
- Keep to RPC-only calls
- Render honest empty states
- Run lint + typecheck + build

## When to Stop and Ask

- Unsure which approach to take
- Change spans multiple modules
- Protected file needs modification
- External APIs or new dependencies needed
- Transaction signing required
- Requirements are ambiguous

---

For detailed patterns, see [.claude/instructions.md](../.claude/instructions.md)
