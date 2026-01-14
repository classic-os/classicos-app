# Phase 1: Portfolio Read-Only Module - Implementation Plan

## Executive Summary

This plan delivers the Portfolio read-only observation layer for Classic OS, enabling unified portfolio visibility across ETC DeFi protocols without transaction signing. The implementation follows the three-layer architecture pattern (Adapter → Hook → UI) and validates the foundation for future DeFi Automation system (Portfolio + Deploy).

**Estimated Timeline:** 8-12 hours total across 6 development sessions with Claude Code assistance. This assumes AI-assisted development, not manual human implementation.

## Current State Analysis

**Existing Infrastructure:**
- Route structure complete: `/portfolio`, `/portfolio/balances`, `/portfolio/positions`, `/portfolio/activity`
- UI components scaffolded: BalancesPanel, PositionsPanel, ActivityPanel (all showing EmptyState)
- RequirementGate enforces wallet connection and chain matching
- `capabilities.portfolio` currently `false` in registry
- Three-layer architecture pattern established
- Tech stack operational: Next.js 16, React 19, wagmi 3, viem 2, TanStack Query 5

**Target Protocols:**
- ETCswap V2 (Uniswap V2 fork) - DEX liquidity pools
- ETCswap V3 (Uniswap V3 fork) - Concentrated liquidity positions
- Native ETC balances

## Implementation Strategy

**Note:** These timelines assume Claude Code-assisted development, not manual human implementation.

### Phase 1A: Foundation Data Layer (Session 1: 2-3 hours)

**Goal:** Establish basic balance fetching and display patterns

#### 1. Native Balance Display

**Adapter Layer:**
- **File:** `src/lib/portfolio/adapters/native-balance.ts`
- **Purpose:** Pure function to fetch native ETC/ETH balance
- **Pattern:** Use structural typing for RPC client (not concrete viem types)
- **Exports:**
  - `getNativeBalance(client: RpcClient, address: Address, chainId: number): Promise<bigint>`
  - Type: `RpcClient = { getBalance: (args: { address: Address }) => Promise<bigint> }`

**Hook Layer:**
- **File:** `src/hooks/useNativeBalance.ts`
- **Purpose:** React Query wrapper for native balance
- **Dependencies:** `usePublicClient()`, `useChainId()`, `useAccount()`
- **Query Configuration:**
  - Key: `['portfolio', 'native-balance', address, chainId]`
  - Stale time: 30 seconds
  - Refetch interval: 60 seconds
  - Enabled: `Boolean(client && address)`

**UI Layer:**
- **File:** `src/components/portfolio/NativeBalanceDisplay.tsx`
- **Purpose:** Display native balance with all explicit states
- **States to render:**
  1. Disconnected (no wallet)
  2. Loading (spinner + "Loading balance...")
  3. Error (red panel with error message)
  4. Zero balance (show "0 ETC" - not empty state)
  5. Data (formatted balance with symbol)
- **Format:** Use `formatEther()` from viem, display chain native symbol

**Integration Point:**
- **File:** `src/components/portfolio/BalancesPanel.tsx`
- **Modification:** Replace EmptyState with NativeBalanceDisplay component
- **Maintain:** Panel wrapper, RequirementGate enforcement

#### 2. ERC20 Token Balance Infrastructure

**Adapter Layer:**
- **File:** `src/lib/portfolio/adapters/erc20-balance.ts`
- **Purpose:** Pure function to fetch ERC20 token balances
- **Pattern:** Use structural typing for RPC client
- **Exports:**
  - `getERC20Balance(client: RpcClient, tokenAddress: Address, walletAddress: Address): Promise<bigint>`
  - `getERC20Metadata(client: RpcClient, tokenAddress: Address): Promise<{ name: string, symbol: string, decimals: number }>`
  - Type: `RpcClient = { readContract: (...) => Promise<unknown> }`
- **Implementation:** Use `client.readContract()` with ERC20 ABI for `balanceOf`, `name`, `symbol`, `decimals`

**ABI Definitions:**
- **File:** `src/lib/portfolio/abis/erc20.ts`
- **Purpose:** Minimal ERC20 ABI for read-only operations
- **Functions needed:**
  - `balanceOf(address): uint256`
  - `decimals(): uint8`
  - `symbol(): string`
  - `name(): string`

**Token List Configuration:**
- **File:** `src/lib/portfolio/tokens/etc-mainnet.ts`
- **Purpose:** Curated list of ETC mainnet tokens
- **Structure:**
  ```typescript
  export type Token = {
    address: Address
    chainId: number
    name: string
    symbol: string
    decimals: number
    logoURI?: string
  }

  export const ETC_MAINNET_TOKENS: Token[] = [
    // Start with top 3-5 tokens from ETCswap
    // Examples: WETC, USDC, USDT (if they exist on ETC)
  ]
  ```
- **Decision Point:** Research which tokens are actively traded on ETCswap V2/V3

**Hook Layer:**
- **File:** `src/hooks/useTokenBalance.ts`
- **Purpose:** React Query wrapper for single token balance
- **Query Configuration:**
  - Key: `['portfolio', 'token-balance', tokenAddress, walletAddress, chainId]`
  - Stale time: 30 seconds
  - Refetch interval: 60 seconds

- **File:** `src/hooks/useTokenBalances.ts`
- **Purpose:** Batch fetch balances for multiple tokens
- **Pattern:** Use `useQueries()` from TanStack Query for parallel fetching
- **Returns:** Array of `{ token: Token, balance: bigint | undefined, isLoading: boolean, error: Error | null }`

**UI Layer:**
- **File:** `src/components/portfolio/TokenBalanceRow.tsx`
- **Purpose:** Single token balance row
- **Display:** Symbol, Name, Balance (formatted), USD value (deferred to Phase 1B)

- **File:** `src/components/portfolio/TokenBalanceList.tsx`
- **Purpose:** List of token balances
- **Features:**
  - Map through token list
  - Show loading skeleton for each token
  - Filter out zero balances (optional toggle)
  - Sort by balance (descending)

**Integration Point:**
- **File:** `src/components/portfolio/BalancesPanel.tsx`
- **Structure:**
  ```
  <Panel title="Balances">
    <NativeBalanceDisplay />
    <Divider />
    <TokenBalanceList tokens={ETC_MAINNET_TOKENS} />
  </Panel>
  ```

#### 3. Validation & Testing

**Validation Steps:**
1. Test with connected wallet (MetaMask/Brave Wallet)
2. Test wallet connection/disconnection flow
3. Test network switching (ETC Mainnet ↔ Mordor)
4. Test RequirementGate states (disconnected, wrong network)
5. Test RPC failures (disconnect internet, check error states)
6. Verify balance updates on refetch interval
7. Test with wallets that have zero balance
8. Test with wallets that have token balances

**Success Criteria:**
- Native balance displays correctly on all supported chains
- Token balances fetch in parallel without blocking
- All 5 UI states render correctly for each balance
- No hydration mismatches (SSR safe)
- No TypeScript errors
- Lint passes
- Build succeeds

### Phase 1B: Activity Surface (Session 2: 30-45 minutes)

**Goal:** Implement explorer-first activity view

#### 4. Explorer Link Construction

**Adapter Layer:**
- **File:** `src/lib/portfolio/adapters/explorer-links.ts`
- **Purpose:** Pure functions to construct explorer URLs
- **Exports:**
  - `getAddressExplorerUrl(address: Address, chainId: number): string | null`
  - `getTransactionExplorerUrl(txHash: string, chainId: number): string | null`
- **Logic:**
  - Look up chain in `CHAINS_BY_ID`
  - Extract `blockExplorers.default.url`
  - Validate address format (0x + 40 hex chars)
  - Return `{baseUrl}/address/{address}` or null
- **No RPC calls:** String manipulation only

**Hook Layer:**
- **File:** `src/hooks/useActivityExplorerLink.ts`
- **Purpose:** Wrap explorer link logic with wallet context
- **Returns:** `{ url: string | null, explorerName: string | null }`
- **Guards:** Return null if wallet not connected

**UI Layer:**
- **File:** `src/components/portfolio/ActivityPanel.tsx`
- **Modification:** Replace EmptyState with explorer link UI
- **Structure:**
  ```
  <Panel title="Activity" description="Transaction history">
    {url ? (
      <>
        <p className="text-sm text-white/70">
          View all transactions on the block explorer
        </p>
        <a href={url} target="_blank" rel="noreferrer" className="...">
          {explorerName} Address Page
        </a>
        <p className="text-xs text-white/55 mt-2">
          Activity tracked at {explorerName}. Events include sends, receives,
          contract interactions, and reward accruals.
        </p>
      </>
    ) : (
      <EmptyState title="No activity available" body="..." />
    )}
  </Panel>
  ```

**Integration Points:**
- Main portfolio page: Already includes ActivityPanel
- Activity subpage: `/portfolio/activity/page.tsx` - update with same logic

**Validation:**
- Test explorer links open correctly for all networks
- Test with disconnected wallet
- Verify links match explorer URL patterns (Blockscout for ETC, Etherscan for ETH)

### Phase 1C: Positions Surface (Session 3: 2-3 hours, includes research)

**Goal:** Display DeFi protocol positions (starting with ETCswap V2 LP)

#### 5. ETCswap V2 Liquidity Pool Positions

**Research Phase:**
- **Task:** Identify ETCswap V2 Factory and Router contract addresses on ETC Mainnet
- **Sources:**
  - ETCswap documentation
  - Block explorer (Blockscout) verified contracts
  - ETCswap V2 interface network requests
- **Required Data:**
  - Factory address
  - Router address
  - Common LP token addresses (for initial testing)

**Adapter Layer:**
- **File:** `src/lib/portfolio/adapters/etcswap-v2-positions.ts`
- **Purpose:** Fetch user's LP token balances and pool metadata
- **Exports:**
  - `getLPTokenBalance(client: RpcClient, lpTokenAddress: Address, walletAddress: Address): Promise<bigint>`
  - `getLPTokenMetadata(client: RpcClient, lpTokenAddress: Address): Promise<{ token0: Address, token1: Address, reserves: [bigint, bigint] }>`
  - `getUserLPPositions(client: RpcClient, walletAddress: Address, factoryAddress: Address): Promise<LPPosition[]>`
- **Type:**
  ```typescript
  type LPPosition = {
    lpTokenAddress: Address
    lpBalance: bigint
    token0: { address: Address, symbol: string, reserve: bigint }
    token1: { address: Address, symbol: string, reserve: bigint }
    poolShare: number // percentage
  }
  ```

**ABI Definitions:**
- **File:** `src/lib/portfolio/abis/uniswap-v2-pair.ts`
- **Functions needed:**
  - `getReserves(): (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)`
  - `token0(): address`
  - `token1(): address`
  - `totalSupply(): uint256`
  - `balanceOf(address): uint256`

- **File:** `src/lib/portfolio/abis/uniswap-v2-factory.ts`
- **Functions needed:**
  - `getPair(address tokenA, address tokenB): address`
  - `allPairs(uint256 index): address`
  - `allPairsLength(): uint256`

**Strategy for Position Discovery:**
- **Option A (Simple):** Check balances for known LP token addresses (from token list)
- **Option B (Advanced, deferred):** Query factory for all pairs, then check balances for each
- **Recommendation:** Start with Option A (known pools), defer full discovery to Phase 3

**Hook Layer:**
- **File:** `src/hooks/useETCswapV2Positions.ts`
- **Purpose:** React Query wrapper for LP positions
- **Query Configuration:**
  - Key: `['portfolio', 'etcswap-v2-positions', walletAddress, chainId]`
  - Stale time: 60 seconds (positions change less frequently)
  - Enabled: `Boolean(client && address && chainId === 61)` // ETC mainnet only for Phase 1

**UI Layer:**
- **File:** `src/components/portfolio/PositionCard.tsx`
- **Purpose:** Single LP position card
- **Display:**
  - Pool name (e.g., "ETC/USDC")
  - LP token balance
  - Pool share percentage
  - Token reserves (formatted)
  - Link to ETCswap pool page (external)

- **File:** `src/components/portfolio/PositionsList.tsx`
- **Purpose:** List of all positions
- **Features:**
  - Show loading state while fetching
  - Group by protocol (ETCswap V2, ETCswap V3 in future)
  - Show EmptyState if no positions found
  - Total value summary (deferred to Phase 1D if pricing available)

**Integration Point:**
- **File:** `src/components/portfolio/PositionsPanel.tsx`
- **Modification:** Replace EmptyState with PositionsList
- **Structure:**
  ```
  <Panel title="Positions" description="DeFi protocol positions">
    <PositionsList />
  </Panel>
  ```

**Validation:**
- Test with wallet that has ETCswap V2 LP positions
- Test with wallet that has no positions (show EmptyState)
- Verify pool metadata fetches correctly
- Test pool share calculation accuracy
- Verify external links to ETCswap pool pages work

#### 6. ETCswap V3 Positions (Optional, Time Permitting)

**Decision Point:** Determine if ETCswap V3 is active and has significant liquidity

**If proceeding:**
- Similar pattern to V2 but use Uniswap V3 Position NFT pattern
- Query NonfungiblePositionManager contract for user NFTs
- Fetch position metadata (token IDs, liquidity, tick ranges)
- Display concentrated liquidity positions differently from V2

**If deferring:**
- Add note in PositionsPanel: "ETCswap V3 positions coming soon"
- Document in deferred work section

### Phase 1D: Portfolio Aggregation & P&L (Session 4: 1-2 hours)

**Goal:** Unified portfolio view with basic P&L tracking

#### 7. Portfolio Aggregation

**Adapter Layer:**
- **File:** `src/lib/portfolio/adapters/aggregation.ts`
- **Purpose:** Aggregate all balances and positions into unified view
- **Exports:**
  - `aggregatePortfolio(balances: Balance[], positions: Position[]): PortfolioSummary`
- **Type:**
  ```typescript
  type PortfolioSummary = {
    totalAssets: number // count
    nativeBalance: bigint
    tokenBalances: TokenBalance[]
    positions: Position[]
    protocols: string[] // unique list
  }
  ```

**Hook Layer:**
- **File:** `src/hooks/usePortfolioSummary.ts`
- **Purpose:** Combine multiple data sources
- **Dependencies:**
  - `useNativeBalance()`
  - `useTokenBalances()`
  - `useETCswapV2Positions()`
- **Pattern:** Use `useMemo` to aggregate when any dependency updates

**UI Layer:**
- **File:** `src/components/portfolio/PortfolioSummaryCard.tsx`
- **Purpose:** Overview card on main portfolio page
- **Display:**
  - Total assets count
  - Native balance
  - Token count
  - Position count
  - Active protocols list

**Integration Point:**
- **File:** `src/app/portfolio/page.tsx`
- **Modification:** Add PortfolioSummaryCard above existing panels
- **Layout:** Summary card → Balances/Positions/Activity panels

#### 8. Basic P&L Tracking (Price-Free)

**Note:** Phase 1 focuses on quantity tracking without USD pricing

**Adapter Layer:**
- **File:** `src/lib/portfolio/adapters/balance-history.ts`
- **Purpose:** Track balance changes over time (stored in localStorage)
- **Exports:**
  - `saveBalanceSnapshot(address: Address, chainId: number, snapshot: BalanceSnapshot): void`
  - `getBalanceHistory(address: Address, chainId: number): BalanceSnapshot[]`
- **Type:**
  ```typescript
  type BalanceSnapshot = {
    timestamp: number
    nativeBalance: bigint
    tokenBalances: Record<Address, bigint>
  }
  ```
- **Storage Strategy:** localStorage with max 30 days history

**UI Layer:**
- **File:** `src/components/portfolio/BalanceChangeIndicator.tsx`
- **Purpose:** Show if balance increased/decreased since last session
- **Display:**
  - Green arrow up if increased
  - Red arrow down if decreased
  - Percentage change in quantity (not USD)

**Integration Point:**
- Add to NativeBalanceDisplay and TokenBalanceRow components
- Show change indicator next to balance

**Deferred to Phase 3:**
- USD pricing integration
- P&L in dollar terms
- Chart visualizations
- Historical performance tracking

### Phase 1E: Real-Time Updates & Optimization (Session 5: 30-60 minutes)

#### 9. Real-Time Balance Updates

**Strategy:**
- Use TanStack Query's `refetchInterval` for automatic updates
- Configure intervals per data type:
  - Native balance: 60 seconds
  - Token balances: 60 seconds
  - LP positions: 120 seconds (change less frequently)

**Optimization:**
- **Query Deduplication:** TanStack Query handles this automatically
- **Stale-While-Revalidate:** Use `staleTime` to show cached data immediately
- **Background Refetch:** Only refetch when tab is active

**User Controls:**
- Add "Refresh" button to each panel for manual updates
- Show last updated timestamp

#### 10. Multi-Protocol Position Aggregation

**Registry Update:**
- **File:** `src/lib/ecosystems/registry.ts`
- **Modification:** Add protocol information for ETC mainnet
- **Addition:**
  ```typescript
  protocols: {
    dexes: [
      { name: 'ETCswap V2', url: 'https://v2.etcswap.org' },
      { name: 'ETCswap V3', url: 'https://v3.etcswap.org' }
    ]
  }
  ```

**Protocol Badge Component:**
- **File:** `src/components/portfolio/ProtocolBadge.tsx`
- **Purpose:** Visual indicator of which protocol a position belongs to
- **Display:** Protocol name, logo (if available), link to protocol

**Integration:**
- Add protocol badges to position cards
- Group positions by protocol in PositionsList

### Phase 1F: Capability Flip & Launch (Session 6: 1-2 hours testing + deployment)

#### 11. Final Integration & Testing

**Testing Checklist:**
- [ ] All balances display correctly on ETC Mainnet
- [ ] All balances display correctly on Mordor Testnet
- [ ] Token balance fetching works for all configured tokens
- [ ] LP positions display correctly for ETCswap V2
- [ ] Activity panel shows correct explorer links
- [ ] RequirementGate enforces wallet connection
- [ ] RequirementGate enforces network matching
- [ ] All UI states render correctly (disconnected, loading, error, empty, data)
- [ ] Navigation between subpages works
- [ ] Multi-tab synchronization works (workspace state)
- [ ] SSR hydration has no mismatches
- [ ] TypeScript build succeeds with no errors
- [ ] ESLint passes with no errors
- [ ] Performance: Queries don't block UI
- [ ] Performance: Background refetch doesn't cause jank
- [ ] Error recovery: Failed RPC calls show proper error states

**Documentation Updates:**
- Update `docs/modules/portfolio/000-intent.md` with implementation details
- Document token list curation process
- Document ETCswap contract addresses used
- Add troubleshooting guide for common issues

#### 12. Capability Registry Flip

**File:** `src/lib/ecosystems/registry.ts`

**Change:**
```typescript
function capabilitiesFor(chainId: number, family: NetworkFamilyKey, kind: NetworkKind): EcosystemCapabilities {
  const produce: ProduceMode = family === "ETC_POW" ? "mine" : family === "ETH_POS" ? "stake" : "none";

  // Phase 1: Portfolio enabled for ETC chains
  const portfolioEnabled = family === "ETC_POW"; // Enable for ETC mainnet and Mordor testnet

  return {
    produce,
    deploy: false,
    markets: false,
    portfolio: portfolioEnabled, // FLIP TO TRUE
    monitoring: false,
    flags: {
      isTestnet: kind === "testnet",
      produceMine: produce === "mine",
      produceStake: produce === "stake",
    },
  };
}
```

**Validation After Flip:**
1. Verify EmptyState no longer shows on main portfolio page
2. Verify all subpages show content when wallet connected
3. Verify capability badge shows portfolio as active
4. Test user journey: connect wallet → view balances → view positions → view activity

**Rollback Plan:**
- If critical issues found, set `portfolio: false` and redeploy
- Document issues in GitHub issue tracker
- Fix issues in separate branch
- Re-test before flipping again

## Technical Decisions & Considerations

### 1. Token List Curation

**Decision:** Manual curation vs. automatic discovery

**Recommendation:** Manual curation for Phase 1
- **Rationale:**
  - Higher quality (verified tokens only)
  - Better performance (known list, no discovery overhead)
  - User safety (no scam tokens)
- **Process:**
  - Research top 10 tokens by volume on ETCswap
  - Verify contract addresses on block explorer
  - Add to token list with metadata
- **Future:** Add token discovery in Phase 3 (with user opt-in)

### 2. Data Fetching Strategy

**Decision:** RPC-only vs. Indexer/API

**Chosen:** RPC-only (aligns with ADR 006)
- **Rationale:**
  - Self-contained (no external dependencies)
  - Consistent with architecture principles
  - Lower complexity
  - No API keys or rate limits
- **Trade-offs:**
  - Slower for historical data (acceptable for Phase 1)
  - Limited by RPC node capabilities
  - No advanced filtering/sorting
- **Future:** Consider indexer for historical P&L in Phase 3

### 3. Caching Strategy

**Decision:** TanStack Query caching parameters

**Configuration:**
- **Native Balance:**
  - `staleTime: 30_000` (30 seconds)
  - `refetchInterval: 60_000` (1 minute)
  - `cacheTime: 300_000` (5 minutes)
- **Token Balances:**
  - `staleTime: 30_000`
  - `refetchInterval: 60_000`
  - `cacheTime: 300_000`
- **LP Positions:**
  - `staleTime: 60_000` (1 minute - positions change less frequently)
  - `refetchInterval: 120_000` (2 minutes)
  - `cacheTime: 600_000` (10 minutes)

**Rationale:**
- Balance freshness without excessive RPC calls
- Stale-while-revalidate provides instant UI updates
- Background refetch keeps data current

### 4. Error Handling Strategy

**Pattern:** Explicit error states at every level

**Adapter Level:**
- Throw descriptive errors with context
- Include RPC error details when available
- No silent failures

**Hook Level:**
- TanStack Query captures errors automatically
- Expose via `error` property
- No retry for permanent errors (e.g., invalid address)

**UI Level:**
- Render error state explicitly
- Show user-friendly message
- Provide recovery action (e.g., "Refresh" button)
- Log technical details to console for debugging

### 5. Testing Strategy

**Unit Testing (Deferred to Phase 2):**
- Adapter functions (pure, easy to test)
- Utility functions (address validation, formatting)

**Integration Testing (Manual for Phase 1):**
- Wallet connection flow
- Network switching
- Data fetching and display
- Error scenarios (RPC failures, wrong network, etc.)

**E2E Testing (Deferred to Phase 3):**
- Full user journey
- Multi-tab synchronization
- Performance benchmarks

## Implementation Order

**Total Estimated Time: 8-12 hours across 6 sessions with Claude Code**

### Session 1: Foundation (2-3 hours)
1. Native balance adapter + hook + UI
2. ERC20 infrastructure (adapter, ABI, token list)
3. Token balance display
4. Balances panel integration
5. Initial validation and testing

### Session 2: Activity Surface (30-45 minutes)
6. Explorer link adapter + hook
7. Activity panel implementation
8. Validation

### Session 3: Positions (2-3 hours, includes research)
9. Research ETCswap V2 contract addresses and top tokens
10. LP position adapter + ABI definitions
11. Position card and list UI components
12. Positions panel integration
13. Validation

### Session 4: Aggregation & P&L (1-2 hours)
14. Portfolio summary card
15. Balance history tracking (localStorage)
16. Portfolio aggregation logic
17. Validation

### Session 5: Optimization (30-60 minutes)
18. Real-time update configuration
19. Protocol registry update
20. Performance testing

### Session 6: Testing & Launch (1-2 hours)
21. Comprehensive testing checklist
22. Documentation updates
23. Capability registry flip
24. Final validation

## Validation Steps

**For Each Major Component:**

1. **Disconnected State:** Verify EmptyState or RequirementGate shows
2. **Loading State:** Verify spinner/skeleton shows during fetch
3. **Error State:** Simulate RPC failure, verify error message displays
4. **Empty State:** Test with wallet that has no balances/positions
5. **Data State:** Test with wallet that has balances/positions
6. **Network Switch:** Change network, verify data updates
7. **Wallet Switch:** Change wallet, verify data updates
8. **SSR:** Verify no hydration errors in browser console
9. **Performance:** Verify no blocking on slow RPC responses

**Final System Validation:**

1. Connect wallet on ETC Mainnet → All balances visible
2. Navigate to Balances subpage → Same data
3. Navigate to Positions subpage → LP positions visible (if any)
4. Navigate to Activity subpage → Explorer link works
5. Switch to Mordor Testnet → Data updates correctly
6. Disconnect wallet → RequirementGate enforces connection
7. Switch wallet to wrong network → Network mismatch error shows
8. Refresh page → Data persists (workspace state)
9. Open second tab → Workspace syncs across tabs
10. Wait 1 minute → Background refetch updates data

## Definition of Done

**Portfolio Module is complete when:**

- [ ] `capabilities.portfolio = true` for ETC chains in registry
- [ ] Native balance displays for connected wallet
- [ ] ERC20 token balances display for configured token list
- [ ] ETCswap V2 LP positions display correctly
- [ ] Activity panel shows working explorer link
- [ ] Portfolio summary card aggregates all data
- [ ] All 5 UI states render correctly for each component
- [ ] RequirementGate enforces wallet connection and network match
- [ ] Real-time updates work (60s interval for balances)
- [ ] Navigation between subpages works
- [ ] Multi-tab workspace synchronization works
- [ ] TypeScript build succeeds with no errors
- [ ] ESLint passes with no errors
- [ ] No SSR hydration mismatches
- [ ] Documentation updated with implementation details
- [ ] Manual testing checklist completed
- [ ] Rollback plan documented

## Deferred Work

**Explicitly NOT in Phase 1:**

1. **USD Pricing:**
   - No price feeds integration
   - No dollar value display
   - No P&L in USD terms
   - **Target:** Phase 3 (Markets integration)

2. **Advanced Position Types:**
   - ETCswap V3 concentrated liquidity
   - Lending protocol positions (if they exist on ETC)
   - Staking positions
   - **Target:** Phase 3 (DeFi Automation)

3. **Historical Data:**
   - Transaction history parsing (on-chain logs)
   - Historical balance charts
   - P&L over time
   - **Target:** Phase 3 (Observability expansion)

4. **Advanced Features:**
   - Balance change notifications
   - Portfolio sharing/export
   - Custom token addition (user-provided)
   - **Target:** Phase 4+ (Nice-to-have)

5. **Performance Optimizations:**
   - Batch RPC calls (multicall contract)
   - WebSocket subscriptions for real-time updates
   - Service worker caching
   - **Target:** Phase 3 (if performance issues arise)

## Critical Files for Implementation

1. **`src/lib/portfolio/adapters/native-balance.ts`** - Core balance fetching logic, establishes adapter pattern for all portfolio data
2. **`src/hooks/useNativeBalance.ts`** - First hook implementation, demonstrates React Query integration pattern
3. **`src/components/portfolio/BalancesPanel.tsx`** - Main integration point, replaces EmptyState with real data
4. **`src/lib/portfolio/tokens/etc-mainnet.ts`** - Token list configuration, critical for ERC20 support
5. **`src/lib/ecosystems/registry.ts`** - Capability flip location, gates all Portfolio features
