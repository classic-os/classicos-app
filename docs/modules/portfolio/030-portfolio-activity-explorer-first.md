# Portfolio Activity — Explorer-First Navigation (Planning)

## Purpose
Activity is a read-only, explorer-first surface that directs users to canonical transaction history via block explorers. Portfolio Activity v0 provides honest empty states and navigation links; it does not parse on-chain logs, classify transactions, or implement custom filtering.

## Scope (Portfolio Activity v0)

### Included
- Route entrypoint at `/portfolio/activity` (already exists as shell)
- Wallet address + active chain access via existing workspace patterns
- Constructor of valid explorer address page links
- UI that surfaces explorer link button and explains scope
- Honest empty states when disconnected, unsupported, or browsing without a wallet

### Explicitly Excluded (Deferred)
- On-chain event log fetching (`eth_getLogs` RPC calls)
- Transaction type classification (sends, receives, contract interactions)
- Timestamp or block data retrieval
- Custom pagination or sorting beyond explorer UI
- Token price or protocol-specific metadata
- Indexer integration or off-chain data services

## Current State (Repo Reality)

### Route Entrypoint
**File:** `src/app/portfolio/activity/page.tsx`
- Already implements: ModuleHeader, capability gating, RequirementGate, ExternalObservability
- Currently renders: Honest empty state ("When you deploy capital, create markets, or receive rewards, events will appear here.")
- Wallet & chain access: via `useSyncExternalStore` (workspace) and wallet connection state

### UI Primitives Already Used
- `ModuleHeader` — title + ecosystem subtitle
- `Panel` — framed sections with title/description
- `EmptyState` — honest placeholder copy
- `RequirementGate` — enforces connected wallet + chain match
- `ExternalObservability` — links block explorer (already present on activity page)

### Explorer Configuration
**Source:** `src/lib/networks/registry.ts`
- Each Chain (etcMainnet, mordorTestnet, ethMainnet, sepoliaTestnet) defines: `blockExplorers.default.url`
- Accessed via `ecosystem.observability.blockExplorer` in `src/lib/ecosystems/registry.ts`
- Pattern: `{base_url}/address/{wallet_address}` (standard across Blockscout and Etherscan)

### Activity Panel Stub
**File:** `src/components/portfolio/ActivityPanel.tsx`
- Currently: Simple wrapper rendering Panel + EmptyState
- Referenced by: `src/app/portfolio/page.tsx` alongside BalancesPanel and PositionsPanel

## Proposed Activity v0 Surface

### Connected Wallet + Portfolio Enabled
```
[Panel: "Activity" | "Recent transactions and events"]
  ├─ Copy: "View all transactions on the block explorer"
  ├─ Button: "[Explorer Name] Address Page"  
  │   → Opens {explorer_base_url}/address/{wallet_address} in new tab
  └─ Secondary: "Activity tracked at {explorer_name}. 
                  Events include sends, receives, contract interactions, 
                  and reward accruals."
```

### Disconnected or Unsupported Network
- `RequirementGate` shows: "Connection required" or "Portfolio not supported on this network"
- `ExternalObservability` always available (block explorer link)

## Read-Only Data Strategy

### Explorer-First Philosophy
Portfolio Activity is **navigation, not data**. The block explorer is the source of truth. Classic OS provides no transaction parsing, filtering, or custom UI—only a direct link to the authoritative external surface.

### Safe Explorer Links (Construct in v0)
- **Address page:** `{base_url}/address/{address}` — supported across all configured explorers
- **Why:** No parameters, standard pattern, works on mainnet and testnet

### NOT Constructed in v0
- Token transfer list (`?tab=transfers`) — requires parsing/filtering logic
- Internal transactions (`?tab=internal`) — Blockscout-specific; Etherscan different
- Pending transactions — requires mempool awareness
- Contract interaction classification — requires ABI decoding

### No RPC Usage
- Zero eth_getLogs or eth_call operations
- Zero block header or timestamp fetching
- Zero indexer queries
- Activity data strictly external (user opens explorer)

## Adapter / Hook / UI Responsibilities

### Adapter: `src/lib/activity/links.ts` (Conceptual)
- **Input:** address (string), chainId (number)
- **Output:** explorer URL (string) or null
- **Behavior:** Validate address format; look up chain in registry; construct URL or return null
- **Constraint:** Pure function; no RPC, no React dependencies

### Hook: `src/hooks/useActivityExplorerLink.ts` (Optional)
- **Responsibility:** Wrap adapter with wallet + chain prerequisites
- **Output:** `{ url: string | null }`
- **Constraint:** Guards on wallet connection; returns null if unavailable

### UI: `src/components/portfolio/ActivityPanel.tsx` (Update Existing)
- **Responsibility:** Render explorer link button if URL available; fallback to EmptyState
- **Constraint:** No data fetching; all state from hook or props

## Risks, Constraints, and Guardrails

### wagmi v3 Considerations
- `useConnections()` is the v3 API for reading wallet connections (not `useAccount()`)
- Pattern already proven in `src/components/primitives/WalletConnector.tsx`
- Activity hook can safely follow same pattern

### viem v2 Considerations
- No viem client needed for Activity v0 (strings only, no RPC)
- No risk of Client type breakage

### TypeScript ES2017 Constraints
- No BigInt literals allowed (no `0n` syntax); safe—Activity uses strings and numbers only
- Address validation may use string length checks (42 characters = 0x + 40 hex)

### Capability Gating
- Activity respects `ecosystem.capabilities.portfolio` (already gated at route level)
- Only renders when portfolio is enabled AND wallet connected AND chain supported
- ExternalObservability always available (does not depend on capability)

## Deferred Work (Explicit)

| Feature | Target Milestone | Why Deferred |
|---------|--------------|-------------|
| Log filtering & event parsing | Markets utility | Requires eth_getLogs + ABI decoding (RPC-heavy) |
| Transaction classification | Protocol adapters | Needs protocol adapters (DEX, lending, staking ABI) |
| Pagination & sorting | Observability expansion | Explorer UI provides it natively |
| Timestamps & block metadata | Observability expansion | Requires block RPC calls or indexer |
| Token price / protocol data | Markets integration | Off-chain service (not RPC-only) |

## Definition of Done (Portfolio Activity v0)

- Route (`/portfolio/activity`) renders explorer link button when connected
- Link format validated: `{explorer_base_url}/address/{valid_address}`
- Tested on: ETC mainnet, Mordor testnet, ETH mainnet, Sepolia testnet
- Lint & build pass
- No modification to AppShell, Sidebar, or registry beyond what's listed
- EmptyState fallbacks in place (disconnected, unsupported)
- No external dependencies added
- Deferred items explicitly documented (this file)
