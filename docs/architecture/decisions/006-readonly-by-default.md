# ADR 006: Read-Only by Default

**Date:** 2026-01-13
**Status:** Accepted

## Decision

All web3 interactions in Classic OS are **read-only by default**. Transaction signing, balance transfers, and state mutations require explicit user intent.

## Context

Many web3 applications immediately request wallet permissions and enable transaction signing. This creates:
- Security risks (unexpected transactions)
- UX friction (constant approval prompts)
- Complexity (managing pending transactions, errors, reverts)

Classic OS prioritizes **observation before action**:
- Most users want to see state before changing it
- Portfolio module is explicitly read-first
- Execution should be intentional, not accidental

Read-only by default means:
- RPC calls only (no signing)
- View functions only (no state mutations)
- Observe balances, positions, activity without execution risk

## Consequences

**For Web3 Integration:**

**Allowed (Read-Only):**
```typescript
// Wagmi hooks
usePublicClient()    // RPC client
useAccount()         // Wallet address
useChainId()         // Current chain
useBalance()         // Token balances
useReadContract()    // View function calls
useConnections()     // Connection status
```

**Forbidden (Without Explicit Request):**
```typescript
// Write operations
useWriteContract()      // State mutations
useSendTransaction()    // ETH transfers
useSignMessage()        // Message signing
```

**For Architecture:**

**Three-Layer Pattern Enforces Read-Only:**
1. **Adapter** - Pure functions, RPC-only, no signing
2. **Hook** - Wraps adapter with React Query, manages loading/error
3. **UI** - Renders explicit states (disconnected, loading, error, empty, data)

**Capability Gates Execution:**
```typescript
// Portfolio module: read-only
if (!ecosystem.capabilities.portfolio) {
  return <EmptyState title="Portfolio not available" />
}

// No execution surfaces in Portfolio v1
```

**For Users:**
- Connect wallet to **observe** state (no signing required)
- View balances, positions, activity without transaction risk
- Execution surfaces (Deploy, Markets) are explicit and separate
- Clear distinction between "view" and "execute" actions

**For Security:**
- No unexpected transactions
- No approval spam
- No transaction error handling until execution is implemented
- Reduced attack surface

**Implementation Notes:**

**Current State (v0.1):**
- All modules are read-only (Portfolio, Produce, Deploy, Markets shells)
- No transaction signing implemented
- No approval flows implemented

**Future Execution (When Needed):**
- Deploy module will add capital allocation (requires signing)
- Markets module will add liquidity provision (requires signing)
- Produce module will add miner reward bridging (requires signing)
- Each execution surface requires explicit user action and clear feedback

**Code Patterns:**
```typescript
// ✅ Allowed: Read-only data access
const { data } = useBalance({ address })
const balance = await publicClient.getBalance({ address })

// ❌ Forbidden: Transaction signing (without explicit feature request)
const { mutate } = useWriteContract()
await walletClient.sendTransaction({ ... })
```

**Non-Goals:**
- Classic OS is not a passive viewer (execution will be added intentionally)
- Read-only doesn't mean "never execute" (it means "observe first, execute intentionally")
- Future execution surfaces must maintain clarity (no hidden transactions)
