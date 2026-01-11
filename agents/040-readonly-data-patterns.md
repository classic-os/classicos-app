# Read-Only Data Patterns

Canonical patterns for adapters, hooks, and UI in Classic OS.

## Three-Layer Pattern: Adapter → Hook → UI

### Adapter (Pure, Read-Only, RPC-Only)
- Pure functions that call RPC (via viem client).
- No React dependencies.
- No caching, no state management.
- Returns raw data or throws.
- Accepts structural `RpcClient` interface (not concrete viem types).

**Example:**
```typescript
export async function getBalance(
  client: { call: (args: unknown) => Promise<unknown> },
  address: string,
  chainId: number,
): Promise<bigint> {
  const balance = await client.call({
    method: 'eth_getBalance',
    params: [address],
  });
  return BigInt(balance as string);
}
```

### Hook (Prerequisites, Loading, Error)
- Wraps adapter with React lifecycle.
- Handles prerequisites (connected wallet, correct chain, valid input).
- Manages loading, error, refetch states.
- May implement caching (e.g., React Query, SWR).
- Returns explicit state object.

**Example:**
```typescript
export function useBalance(address?: string) {
  const account = useAccount();
  const client = usePublicClient();

  return useQuery({
    enabled: account.address && client,
    queryFn: () => getBalance(client!, account.address!, chainId),
    // ...
  });
}
```

### UI (Explicit State Rendering)
- Never speculate about missing data.
- Render explicit states: disconnected, unsupported, loading, error, data.
- Show honest empty states ("No portfolio items yet.").

**Example:**
```typescript
export function BalanceDisplay({ address }: { address?: string }) {
  const { data, isLoading, error } = useBalance(address);

  if (!address) return <div>Disconnected</div>;
  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (data === undefined) return <div>No balance found</div>;
  return <div>{formatBalance(data)}</div>;
}
```

## Empty States and Honest UX

### DO: Honest Empty States
- "No portfolio items yet."
- "Wallet not connected."
- "This chain is not supported."
- "Transaction failed: [reason]."

### DO NOT: Speculative Placeholders
- "Your portfolio will appear here soon."
- "Loading…" when you don't know why.
- Skeleton screens for data that may never load.
- Dummy data to hide empty state.

## Explorer Links

### Generate Explorer Links Only When Base URL Exists
- Check chain metadata for `blockExplorers` configuration.
- Do NOT invent or assume explorer URLs.
- Do NOT add hardcoded Etherscan/Blockscout URLs without verification.

**Example:**
```typescript
export function getExplorerLink(
  chainId: number,
  txHash: string,
): string | null {
  const chain = getChainById(chainId);
  if (!chain?.blockExplorers?.default?.url) {
    return null;
  }
  return `${chain.blockExplorers.default.url}/tx/${txHash}`;
}
```

## No Caching by Default

- Adapters are pure (no caching).
- Hooks may implement caching if explicitly requested.
- Prefer explicit cache invalidation over automatic expiry.
- If caching is added, document TTL and invalidation strategy.

## Error Handling

- Adapters throw on RPC failure (let hook handle retry logic).
- Hooks catch and return error state.
- UI shows error message (not stack trace).
- Log errors only for debugging; remove before commit.
