# Web3 Client Rules

Conventions for wagmi, viem, and wallet adapter integrations in Classic OS.

## Wagmi and Viem Versions

### Always Verify Versions First
Before proposing hook or client APIs:
1. Read `package.json` for wagmi and viem versions.
2. Check if wagmi v3+ (hooks API changed significantly).
3. Confirm viem client patterns match the repo's current usage.

### Hook API Changes in Wagmi v3+
- **v2:** `useAccount()` returns account object directly.
- **v3+:** Hook behavior may change; check typings for deprecation marks.
- **Do not assume:** Always inspect the repo for existing usage patterns (e.g., `WalletConnector`).

## Read-Only Patterns (Default)

### Allowed Hooks and Clients
- `usePublicClient()` — read-only RPC client
- `useClient()` — generic client (often read-only)
- `useAccount()` — read wallet connection state
- `useBalance()`, `useChainId()`, `useReadContract()` — data fetching hooks

**All read-only operations are allowed without explicit request.**

### Forbidden by Default (Execution)
- `useContractWrite()`, `useWriteContract()` — transaction writing
- `usePrepareContractWrite()` — transaction preparation
- Wallet signing, switching chains, connecting wallets

**Do NOT implement execution logic unless explicitly requested.**

## Adapter Patterns

### Structural Types Required
- Adapters must use minimal, structural interfaces (not concrete Client types).
- Avoids type-identity conflicts across library versions.

**Example:**
```typescript
// ❌ DO NOT (concrete type causes conflicts)
import { PublicClient } from 'viem';
export function adapterFunction(client: PublicClient) { /* ... */ }

// ✅ DO (structural interface)
interface RpcClient {
  call(args: unknown): Promise<unknown>;
  readContract(args: unknown): Promise<unknown>;
}
export function adapterFunction(client: RpcClient) { /* ... */ }
```

### readContract Results
- Always assume `readContract()` results are `unknown`.
- Validate and guard before using.

**Example:**
```typescript
const result: unknown = await client.readContract(/* ... */);
if (typeof result === 'bigint') {
  return result;
} else {
  throw new Error('Expected bigint');
}
```

## Connection Patterns

### Repo-Standard Pattern First
- Search for existing `WalletConnector` usage or connection logic.
- Use the same pattern for new adapters/features.
- Do not invent new connection patterns.

### Prerequisites
- Ensure wagmi `WagmiConfig` wraps the component tree.
- Verify the active chain ID via `getActiveChainId()` if needed.
- Confirm wallet provider is available before attempting read operations.

## External APIs

### Do NOT Add External Indexers or APIs by Default
- Classic OS is RPC-only (read from chain, no external services).
- If a feature requires external data (e.g., token prices, token list), defer to a separate request with justification.
- Do NOT add GraphQL queries, REST API calls, or off-chain dependencies without approval.
