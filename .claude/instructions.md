# Classic OS Development Instructions

Instructions for AI coding assistants working on Classic OS (classicos-app).

## Product Vision

Classic OS is an **economic operating system for on-chain capital** on Ethereum Classic. At its core, it combines:
- **Mining OS** (inspired by HiveOS) - PoW mining dashboard, rig monitoring, earnings tracking
- **DeFi Portfolio Management** (inspired by DeFi Saver) - Strategy automation, position health, execution
- **Multi-EVM Interface** - Expanded to support Ethereum, Arbitrum, Base, etc.

**Integration Partner:**
- **Brale:** ETC stablecoin minting, ACH fiat on-ramp, USDC bridging (business partner)

**Full Context:** See [README.md](../README.md) for complete product vision.
**Strategic Decisions:** See [docs/architecture/decisions/](../docs/architecture/decisions/) for ADRs.

**Key Principle:** Classic OS is a complete product (mining OS + DeFi automation), not just an integration layer. Brale handles stablecoins, we handle everything else.

## Tech Stack

**Framework & Runtime:**
- Next.js: 16.1.1 (App Router)
- React: 19.2.3
- Node.js: 22.x required
- TypeScript: 5.x (target: ES2017)

**Web3:**
- wagmi: 3.2.0 (note: v3 has breaking changes from v2)
- viem: 2.44.0
- TanStack React Query: 5.90.16

**Styling & UI:**
- Tailwind CSS: 4.x
- Framer Motion: 12.24.12
- lucide-react: 0.562.0 (icons)

**Validation:**
- ESLint: 9.x with eslint-config-next

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Validation (run before committing)
npm run lint           # ESLint check
npm run typecheck      # TypeScript check
npm run build          # Next.js build
```

**All three validation commands must pass before changes can be committed.**

## Core Architecture Patterns

### 1. Three-Layer Data Pattern (Mandatory)

All data access follows a strict three-layer architecture:

**Layer 1: Adapter** (Pure Functions)
- Located in: `src/lib/`
- Pure functions, no React dependencies
- RPC-only (read-only blockchain calls)
- Takes structural interfaces, not concrete viem types
- Returns data or throws errors

```typescript
// Example: src/lib/balance/adapter.ts
import type { PublicClient } from 'viem'

export async function getBalance(
  client: PublicClient,
  address: `0x${string}`,
  chainId: number
): Promise<bigint> {
  return await client.getBalance({ address })
}
```

**Layer 2: Hook** (React Integration)
- Located in: `src/hooks/`
- Wraps adapter with React lifecycle
- Manages loading, error, and prerequisite states
- Uses TanStack Query for caching
- No direct business logic

```typescript
// Example: src/hooks/useBalance.ts
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { getBalance } from '@/lib/balance/adapter'

export function useBalance(address: `0x${string}` | undefined) {
  const client = usePublicClient()

  return useQuery({
    queryKey: ['balance', address],
    queryFn: () => getBalance(client, address!, chainId),
    enabled: Boolean(address && client),
  })
}
```

**Layer 3: UI Component** (Explicit State Rendering)
- Renders all states explicitly:
  - Disconnected (no wallet)
  - Loading
  - Error
  - Empty (no data)
  - Data (success)
- No speculation or "coming soon" placeholders

```typescript
// Example: Component usage
export function BalanceDisplay({ address }: { address?: `0x${string}` }) {
  const { data, isLoading, error } = useBalance(address)

  if (!address) {
    return <EmptyState title="No wallet connected" />
  }

  if (isLoading) {
    return <div>Loading balance...</div>
  }

  if (error) {
    return <div>Error loading balance: {error.message}</div>
  }

  if (data === undefined) {
    return <EmptyState title="No balance data" />
  }

  return <div>Balance: {formatEther(data)} ETC</div>
}
```

### 2. Capability Registry System

Features are gated by network capabilities defined in the ecosystem registry.

**Registry Location:** `src/lib/ecosystems/registry.ts`

**How It Works:**
- Each network (ETC, Mordor, ETH, Sepolia) declares its capabilities
- Capabilities control which features are available:
  - `produce`: "mine" | "stake" | "none"
  - `deploy`: boolean
  - `markets`: boolean
  - `portfolio`: boolean
  - `monitoring`: boolean

**Usage in Pages:**
```typescript
// src/app/produce/page.tsx
import { getEcosystem } from '@/lib/ecosystems/registry'

export default function ProducePage() {
  const activeChainId = useSyncExternalStore(...)
  const ecosystem = useMemo(() => getEcosystem(activeChainId), [activeChainId])

  if (ecosystem.capabilities.produce === "none") {
    return <EmptyState title="Production not available on this network" />
  }

  return (
    <>
      {ecosystem.capabilities.produce === "mine" && <MiningPanel />}
      {ecosystem.capabilities.produce === "stake" && <StakingPanel />}
    </>
  )
}
```

**Important:** Don't assume a feature is available. Always check capabilities first.

### 3. Workspace State Management

Workspace state (active chain ID, testnet visibility) is stored in localStorage and synchronized across browser tabs.

**State Location:** `src/lib/state/workspace.ts`

**Key Functions:**
```typescript
// Getters
getActiveChainId(): number
getShowTestnets(): boolean

// Setters
setActiveChainId(chainId: number): void
setShowTestnets(enabled: boolean): void

// Subscription
subscribeWorkspace(callback: () => void): () => void
```

**Usage in Components:**
```typescript
import { useSyncExternalStore } from 'react'
import { subscribeWorkspace, getActiveChainId } from '@/lib/state/workspace'

const activeChainId = useSyncExternalStore(
  subscribeWorkspace,
  getActiveChainId,
  () => DEFAULT_ACTIVE_CHAIN_ID  // SSR snapshot
)
```

**Multi-Tab Sync:** Changes in one tab automatically sync to others via storage events.

### 4. Network Abstraction

All network configuration comes from a single registry.

**Registry Location:** `src/lib/networks/registry.ts`

**Structure:**
```typescript
export type Network = {
  chain: Chain              // Viem Chain object
  family: NetworkFamilyKey  // "ETC_POW" | "ETH_POS"
  kind: NetworkKind         // "mainnet" | "testnet" | "l2"
  parentChainId?: number    // For testnets
  shortName: string         // "ETC", "Mordor", "ETH"
}

export const NETWORKS: Network[]
export const CHAINS_BY_ID: Record<number, Chain>
```

**Wagmi Integration:**
Wagmi config is derived from the network registry automatically in `src/lib/chain/wagmi.ts`.

## Protected Files

These files are architectural anchors. Do not modify without explicit user request:

- `src/app/layout.tsx` - Root layout with providers
- `src/components/layout/AppShell.tsx` - Application frame
- `src/components/layout/Sidebar.tsx` - Navigation sidebar
- `src/components/layout/NavItems.ts` - Navigation metadata
- `src/lib/ecosystems/registry.ts` - Capability truth table
- `src/lib/state/workspace.ts` - Workspace state management
- `src/lib/networks/registry.ts` - Network definitions
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration

**Why:** Changes to these files cascade unpredictably and affect the entire application architecture.

## Naming Conventions

**Prose (Documentation, UI, Comments):**
- Use "Classic OS" (with space)
- Examples: "Welcome to Classic OS", "Classic OS provides..."

**Code (Files, Variables, Packages):**
- Use `classicos` (lowercase, no space)
- Examples: `classicos-app`, `classicosTheme`, `src/lib/classicos/...`

**Files:**
- Components: PascalCase (e.g., `BalancePanel.tsx`)
- Utilities/libs: kebab-case (e.g., `format-balance.ts`)
- Hooks: camelCase with "use" prefix (e.g., `useBalance.ts`)

**Why:** Consistent naming prevents confusion and merge conflicts.

## TypeScript Constraints

**Target:** ES2017 (configured in tsconfig.json)

**Key Rules:**
1. **No BigInt literals** - Use `BigInt()` constructor instead
   ```typescript
   // ❌ Wrong
   const value = 1000000000000000000n

   // ✅ Correct
   const value = BigInt("1000000000000000000")
   ```

2. **No explicit `any`** - Use `unknown` with type guards
   ```typescript
   // ❌ Wrong
   function process(data: any) { ... }

   // ✅ Correct
   function process(data: unknown) {
     if (typeof data === 'string') {
       // data is string here
     }
   }
   ```

3. **Structural types for viem** - Don't import concrete types at boundaries
   ```typescript
   // ❌ Wrong (brittle)
   import type { PublicClient } from 'viem'
   function adapter(client: PublicClient) { ... }

   // ✅ Correct (structural)
   type RpcClient = {
     getBalance: (args: { address: Address }) => Promise<bigint>
   }
   function adapter(client: RpcClient) { ... }
   ```

4. **Strict null checks** - Always enabled, handle undefined explicitly

**Why:** ES2017 target prevents BigInt literal syntax. Structural types prevent breaking changes when library versions update.

## Web3 Patterns

**Default: Read-Only**
- All web3 interactions are RPC-only unless explicitly requested
- No transaction signing
- No wallet mutations
- No balance transfers

**Allowed Hooks:**
- `usePublicClient()` - Read-only RPC client
- `useAccount()` - Wallet address (no signing)
- `useBalance()` - Read balance
- `useReadContract()` - Call view functions
- `useChainId()` - Current chain
- `useConnections()` - Connection status

**Forbidden (Without Explicit Request):**
- `useWriteContract()` - Signing transactions
- `useSendTransaction()` - Sending ETH
- `useSignMessage()` - Message signing
- Any hook that mutates blockchain state

**Wagmi v3 Pattern:**
wagmi 3.x uses mutation-style APIs (not deprecated callbacks):

```typescript
// ✅ Correct (v3)
const { mutate: connect, isPending } = useConnect()
const { mutate: disconnect } = useDisconnect()
const { mutateAsync: switchChain } = useSwitchChain()

onClick={() => connect({ connector: injected() })}
onClick={() => disconnect()}
await switchChain({ chainId: 61 })

// ❌ Wrong (v2 style, deprecated)
onClick={() => connect({ connector: injected(), onSuccess: ... })}
```

**No External APIs:**
- No indexers (The Graph, Blockscout API, etc.)
- No GraphQL endpoints
- RPC-only architecture
- If external APIs are needed, propose separately with justification

**Why:** Read-only default prevents security issues. RPC-only keeps the app simple and self-contained.

## Component Architecture

**File Organization:**
```
src/components/
├── layout/          # Application frame (protected)
│   ├── AppShell.tsx
│   ├── Sidebar.tsx
│   └── NavItems.ts
├── primitives/      # Workspace-aware atoms
│   ├── WalletConnector.tsx
│   ├── ActiveNetworkSelector.tsx
│   └── WorkspaceStatus.tsx
├── modules/         # Feature domains
│   ├── portfolio/
│   ├── produce/
│   ├── deploy/
│   └── markets/
├── ui/              # Generic reusable components
│   ├── Panel.tsx
│   ├── EmptyState.tsx
│   └── StatusPill.tsx
└── providers/       # Context providers
    └── Web3Providers.tsx
```

**Adding a New Page:**
1. Create page component in `src/app/<route>/page.tsx`
2. Check capabilities before rendering features
3. Use `RequirementGate` for wallet-dependent content
4. Add to `NavItems.ts` if it needs navigation

**Adding a New Adapter:**
1. Create in `src/lib/<domain>/adapter.ts`
2. Make it a pure function
3. Use structural types for viem clients
4. Return data or throw errors

**Adding a New Hook:**
1. Create in `src/hooks/use<Feature>.ts`
2. Wrap adapter with `useQuery`
3. Handle prerequisites (wallet, client, chainId)
4. Return standard query state

**Adding a New UI Component:**
1. Create in appropriate directory (`ui/`, `modules/`, `primitives/`)
2. Render all states explicitly
3. Use Tailwind for styling
4. Use lucide-react for icons

## Validation Requirements

**Before Any Commit:**
```bash
npm run lint       # Must pass with zero errors
npm run typecheck  # Must pass with zero errors
npm run build      # Must succeed
```

**After Changes:**
```bash
git diff --stat    # Review files changed
```

Ensure only intended files were modified (no accidental edits, debug logs, or whitespace changes).

**Why:** No automated test suite exists. Validation = lint + typecheck + build.

## Commit Format

**Structure:**
```
<scope>: <description>

Optional detailed explanation
```

**Scopes:**
- `Portfolio:` - Portfolio module changes
- `Produce:` - Production module changes
- `Deploy:` - Deployment module changes
- `Markets:` - Markets module changes
- `Home:` - Homepage changes
- `Docs:` - Documentation changes
- `Build:` - Build configuration changes
- `Tooling:` - ESLint, TypeScript, or tooling changes
- `Refactor:` - Code refactoring (no functional changes)

**Examples:**
```
Portfolio: add activity explorer link

Produce: implement mining panel for ETC mainnet

Build: update Next.js to 16.1.1
```

**Co-Authorship:**
All commits include:
```
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Common Pitfalls

**❌ Don't:**
- Add features without checking capabilities
- Assume a network supports a feature
- Use BigInt literals (`0n`, `10n`)
- Import concrete viem types in adapters
- Add external API calls without approval
- Modify protected files without explicit request
- Create speculative UI ("Your data will appear soon")
- Skip validation (lint, typecheck, build)
- Make drive-by refactors
- Commit multiple unrelated changes together

**✅ Do:**
- Check capabilities before rendering features
- Use `BigInt()` constructor for large numbers
- Use structural types in adapters
- Keep to RPC-only web3 calls
- Ask before modifying protected files
- Render honest empty states
- Run validation before committing
- Make small, focused changes
- Commit one logical change at a time

## Honest UX Principle

**Empty states must be honest:**
- ✅ "No portfolio items yet"
- ✅ "Connect wallet to view balances"
- ✅ "This network does not support mining"
- ❌ "Your portfolio will appear here soon"
- ❌ "Coming soon"
- ❌ "Check back later"

**Why:** Users prefer clarity over speculation. Honest states prevent confusion.

## Small Diff Principle

**Prefer:**
- One module per change
- One feature per commit
- Focused, reviewable diffs

**Avoid:**
- Bundling multiple features
- Reorganizing files during feature work
- Drive-by refactors ("while we're here...")
- Touching unrelated code

**Why:** Small diffs are easier to review, debug, and revert.

## When to Ask

**Stop and ask the user if:**
- You're unsure which approach to take
- The change spans multiple modules
- A protected file needs modification
- External APIs or new dependencies are needed
- Transaction signing is required
- The change contradicts these instructions
- The requirements are ambiguous

**Don't assume.** It's better to ask than to rework.

## Additional Resources

For deeper architectural understanding, see:
- `docs/architecture/patterns.md` - Detailed pattern explanations
- `docs/architecture/decisions/` - Architecture Decision Records (ADRs)
- `CONTRIBUTING.md` - Human contributor guide

---

Last updated: 2026-01-13
