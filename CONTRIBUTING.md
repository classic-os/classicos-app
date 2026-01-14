# Contributing to Classic OS

Welcome! Thank you for your interest in contributing to Classic OS. This guide will help you get started.

## Table of Contents

- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Architecture Overview](#architecture-overview)
- [Code Review Process](#code-review-process)
- [Getting Help](#getting-help)

## Development Setup

### Prerequisites

- **Node.js:** 22.x or later
- **Package Manager:** npm (included with Node.js)
- **Git:** For version control

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd etc-suite/products/classicos-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to http://localhost:3000

### Validation Commands

Before committing any changes, run these commands to ensure code quality:

```bash
npm run lint          # ESLint validation
npm run typecheck     # TypeScript type checking
npm run build         # Production build test
```

**All three commands must pass with zero errors before submitting changes.**

## Development Workflow

### 1. Create a Branch

Create a feature branch for your work:

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

Follow the [Architecture Overview](#architecture-overview) and code patterns documented in [docs/architecture/patterns.md](docs/architecture/patterns.md).

**Key principles:**
- Make small, focused changes (one feature per branch)
- Check ecosystem capabilities before adding features
- Follow the three-layer pattern (Adapter → Hook → UI)
- Render honest empty states (no "coming soon" placeholders)

### 3. Test Your Changes

1. **Visual testing:** Use the development server (`npm run dev`) to verify your changes work as expected
2. **Validation:** Run lint, typecheck, and build commands
3. **Manual testing:** Test on different networks (ETC, Mordor, ETH, Sepolia) if applicable

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```
<scope>: <description>

Optional detailed explanation of the changes
```

**Scopes:**
- `Portfolio:` - Portfolio module
- `Produce:` - Production module
- `Deploy:` - Deployment module
- `Markets:` - Markets module
- `Home:` - Homepage
- `Docs:` - Documentation
- `Build:` - Build configuration
- `Tooling:` - Linting, TypeScript, etc.
- `Refactor:` - Code refactoring

**Example:**
```
Portfolio: add balance display component

- Create getBalance adapter in src/lib/balance
- Create useBalance hook
- Add BalanceDisplay component with all states rendered
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with a clear description of your changes.

## Architecture Overview

Classic OS follows a strict architectural pattern to ensure code quality and maintainability.

### Three-Layer Data Pattern

All data access follows this pattern:

1. **Adapter** (`src/lib/`) - Pure functions that interact with blockchain RPC
2. **Hook** (`src/hooks/`) - React hooks that manage lifecycle and caching
3. **UI Component** - React components that render all states explicitly

**Example:**
```typescript
// 1. Adapter (src/lib/balance/adapter.ts)
export async function getBalance(
  client: PublicClient,
  address: `0x${string}`
): Promise<bigint> {
  return await client.getBalance({ address })
}

// 2. Hook (src/hooks/useBalance.ts)
export function useBalance(address: `0x${string}` | undefined) {
  const client = usePublicClient()
  return useQuery({
    queryKey: ['balance', address],
    queryFn: () => getBalance(client, address!),
    enabled: Boolean(address && client),
  })
}

// 3. UI Component
export function BalanceDisplay({ address }: Props) {
  const { data, isLoading, error } = useBalance(address)

  if (!address) return <EmptyState title="No wallet connected" />
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (data === undefined) return <EmptyState title="No data" />

  return <div>Balance: {formatEther(data)} ETC</div>
}
```

### Capability Registry System

Features are gated by network capabilities. Always check capabilities before rendering features:

```typescript
import { getEcosystem } from '@/lib/ecosystems/registry'

const ecosystem = getEcosystem(activeChainId)

if (!ecosystem.capabilities.portfolio) {
  return <EmptyState title="Portfolio not available on this network" />
}
```

### Protected Files

These files are architectural anchors and should not be modified without discussion:

- `src/app/layout.tsx` - Root layout
- `src/components/layout/AppShell.tsx` - Application shell
- `src/components/layout/Sidebar.tsx` and `NavItems.ts` - Navigation
- `src/lib/ecosystems/registry.ts` - Capability registry
- `src/lib/state/workspace.ts` - Workspace state
- `src/lib/networks/registry.ts` - Network definitions
- Configuration files (`package.json`, `tsconfig.json`, `eslint.config.mjs`)

### Naming Conventions

- **In prose/UI/documentation:** "Classic OS" (with space)
- **In code:** `classicos` (lowercase, no space)
- **Components:** PascalCase (e.g., `BalancePanel.tsx`)
- **Utilities:** kebab-case (e.g., `format-balance.ts`)
- **Hooks:** camelCase with "use" prefix (e.g., `useBalance.ts`)

### TypeScript Constraints

**Target: ES2017**

1. **No BigInt literals:** Use `BigInt()` constructor instead of `0n`
   ```typescript
   // ❌ Wrong
   const value = 1000000000000000000n

   // ✅ Correct
   const value = BigInt("1000000000000000000")
   ```

2. **No explicit `any`:** Use `unknown` with type guards
3. **Strict null checks:** Always handle undefined explicitly

### Web3 Patterns

**Default: Read-Only**
- All web3 interactions are RPC-only unless explicitly required
- No transaction signing or balance transfers
- Use hooks like `usePublicClient()`, `useAccount()`, `useBalance()`, `useReadContract()`

**Forbidden without discussion:**
- `useWriteContract()`, `useSendTransaction()`, `useSignMessage()`
- External APIs (indexers, GraphQL endpoints)

## Code Review Process

### What Reviewers Look For

1. **Validation passes:** All three commands (lint, typecheck, build) pass
2. **Small, focused changes:** One feature per pull request
3. **Architecture compliance:** Follows three-layer pattern
4. **Capability checks:** Features check capabilities before rendering
5. **Honest UX:** Empty states are factual, not speculative
6. **Protected files:** No unintended changes to protected files
7. **Naming conventions:** "Classic OS" in prose, `classicos` in code
8. **TypeScript correctness:** No BigInt literals, no explicit `any`
9. **Read-only web3:** No transaction signing unless explicitly required

### Review Timeline

- Most pull requests are reviewed within 2-3 business days
- Simple fixes may be reviewed faster
- Complex features may require more discussion

### Addressing Feedback

- Respond to all comments (even if just to acknowledge)
- Make requested changes in new commits (don't force-push)
- Mark conversations as resolved once addressed
- Request re-review once all feedback is addressed

## Getting Help

### Documentation

- **Architecture patterns:** [docs/architecture/patterns.md](docs/architecture/patterns.md)
- **Architecture decisions:** [docs/architecture/decisions/](docs/architecture/decisions/)
- **AI assistant instructions:** [.claude/instructions.md](.claude/instructions.md) (useful for understanding patterns)

### Questions

- **GitHub Issues:** For bugs, feature requests, or general questions
- **Pull Request Comments:** For questions specific to your changes
- **Code Comments:** For implementation-specific questions

### Common Issues

**Build Errors:**
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

**BigInt Literal Errors:**
Use `BigInt()` constructor instead of `0n` syntax.

**wagmi Version Errors:**
This project uses wagmi v3. Check [.claude/instructions.md](.claude/instructions.md) for v3 patterns.

## Additional Resources

- **Tech Stack:**
  - Next.js 16 (App Router): https://nextjs.org/docs
  - React 19: https://react.dev
  - wagmi 3: https://wagmi.sh
  - viem 2: https://viem.sh
  - TanStack Query: https://tanstack.com/query
  - Tailwind CSS 4: https://tailwindcss.com

- **Project Structure:**
  - `src/app/` - Next.js App Router pages
  - `src/components/` - React components
  - `src/lib/` - Pure function adapters
  - `src/hooks/` - React hooks
  - `docs/` - Documentation

## Thank You!

Your contributions make Classic OS better for everyone. We appreciate your time and effort!

---

For more detailed technical information, see [docs/architecture/patterns.md](docs/architecture/patterns.md)
