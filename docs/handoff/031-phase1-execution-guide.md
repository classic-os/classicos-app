# Phase 1 Portfolio - Execution Guide (Claude Code Optimized)

## Overview

This is the practical execution guide for implementing Phase 1 Portfolio with Claude Code. For detailed technical specifications, see [030-phase1-portfolio-plan.md](030-phase1-portfolio-plan.md).

**Approach:** Build vertically (complete features end-to-end) for immediate validation and incremental progress.

---

## Session 1: Native Balance (1-1.5 hours)

### Objective
Ship first working feature that displays native ETC/ETH balance.

### Build Order
1. **Adapter** → `src/lib/portfolio/adapters/native-balance.ts`
   - Pure function: `getNativeBalance(client, address, chainId)`
   - Structural typing for RPC client

2. **Hook** → `src/hooks/useNativeBalance.ts`
   - React Query wrapper
   - Query key: `['portfolio', 'native-balance', address, chainId]`
   - 60s refetch interval

3. **UI Component** → `src/components/portfolio/NativeBalanceDisplay.tsx`
   - All 5 states: disconnected, loading, error, zero, data
   - Use `formatEther()` from viem

4. **Integration** → Update `src/components/portfolio/BalancesPanel.tsx`
   - Replace EmptyState with NativeBalanceDisplay

5. **Validation**
   - `npm run lint && npm run typecheck && npm run build`
   - Test in browser: connect wallet, check balance displays
   - Test: disconnect wallet, switch networks

### Commit Message
```
feat(portfolio): add native balance display

Implements adapter → hook → UI for native ETC/ETH balance fetching.
BalancesPanel now shows real balance instead of EmptyState.
```

---

## Session 2: ERC20 Tokens (1.5-2 hours)

### Objective
Display ERC20 token balances for curated token list.

### Build Order
1. **Research** → Identify top 3-5 ETC tokens on ETCswap
   - Find contract addresses via block explorer
   - Verify on Blockscout ETC Mainnet

2. **ABI** → `src/lib/portfolio/abis/erc20.ts`
   - Minimal ABI: balanceOf, decimals, symbol, name

3. **Token List** → `src/lib/portfolio/tokens/etc-mainnet.ts`
   - Export `Token` type and `ETC_MAINNET_TOKENS` array
   - Start with 3-5 verified tokens

4. **Adapter** → `src/lib/portfolio/adapters/erc20-balance.ts`
   - `getERC20Balance()` - fetch single token balance
   - `getERC20Metadata()` - fetch token info

5. **Hooks** →
   - `src/hooks/useTokenBalance.ts` - single token
   - `src/hooks/useTokenBalances.ts` - multiple tokens with `useQueries()`

6. **UI Components** →
   - `src/components/portfolio/TokenBalanceRow.tsx` - single token row
   - `src/components/portfolio/TokenBalanceList.tsx` - list with loading states

7. **Integration** → Update BalancesPanel
   - Add divider after native balance
   - Add TokenBalanceList below

8. **Validation**
   - Lint + typecheck + build
   - Test: token balances load in parallel
   - Test: zero balance tokens display correctly

### Commit Message
```
feat(portfolio): add ERC20 token balance display

Implements token list, adapters, and UI for ERC20 balances.
Displays top ETC mainnet tokens with parallel fetching.
```

---

## Session 3: Activity Links (30 minutes)

### Objective
Link to block explorer for transaction history.

### Build Order
1. **Adapter** → `src/lib/portfolio/adapters/explorer-links.ts`
   - `getAddressExplorerUrl()` - string manipulation only
   - Look up explorer URL from `CHAINS_BY_ID`

2. **Hook** → `src/hooks/useActivityExplorerLink.ts`
   - Wrap adapter with wallet context
   - Return `{ url, explorerName }`

3. **Integration** → Update `src/components/portfolio/ActivityPanel.tsx`
   - Replace EmptyState with explorer link UI
   - Show external link button

4. **Validation**
   - Test: links open correct explorer page
   - Test: works on ETC Mainnet and Mordor Testnet

### Commit Message
```
feat(portfolio): add block explorer activity links

ActivityPanel now links to block explorer for full transaction history.
```

---

## Session 4: ETCswap V2 Positions (2-3 hours, includes research)

### Objective
Display liquidity pool positions from ETCswap V2.

### Build Order
1. **Research Phase** (30-45 min)
   - Find ETCswap V2 Factory contract address
   - Find 2-3 popular LP token addresses
   - Test contract calls via block explorer or ethers.js script

2. **ABIs** →
   - `src/lib/portfolio/abis/uniswap-v2-pair.ts` - LP token ABI
   - `src/lib/portfolio/abis/uniswap-v2-factory.ts` - Factory ABI

3. **Adapter** → `src/lib/portfolio/adapters/etcswap-v2-positions.ts`
   - `getLPTokenBalance()` - check LP token balance
   - `getLPTokenMetadata()` - get pool info
   - Start with Option A: check known LP addresses only

4. **Hook** → `src/hooks/useETCswapV2Positions.ts`
   - Query key: `['portfolio', 'etcswap-v2-positions', address, chainId]`
   - 120s refetch interval (slower than balances)

5. **UI Components** →
   - `src/components/portfolio/PositionCard.tsx` - single LP position
   - `src/components/portfolio/PositionsList.tsx` - all positions

6. **Integration** → Update `src/components/portfolio/PositionsPanel.tsx`
   - Replace EmptyState with PositionsList
   - Show EmptyState only if no positions found

7. **Validation**
   - Test with wallet that has LP positions (or use testnet)
   - Test with wallet with zero LP positions
   - Verify pool share calculation accuracy

### Commit Message
```
feat(portfolio): add ETCswap V2 LP position display

Displays liquidity pool positions with token reserves and pool share.
Supports known ETCswap V2 pools on ETC Mainnet.
```

---

## Session 5: Portfolio Summary (1 hour)

### Objective
Aggregate all portfolio data into summary card.

### Build Order
1. **Adapter** → `src/lib/portfolio/adapters/aggregation.ts`
   - `aggregatePortfolio()` - pure function to combine data

2. **Hook** → `src/hooks/usePortfolioSummary.ts`
   - Combine: native balance, token balances, LP positions
   - Use `useMemo` for aggregation

3. **UI Component** → `src/components/portfolio/PortfolioSummaryCard.tsx`
   - Total assets count
   - Native balance
   - Token count, position count
   - Active protocols list

4. **Integration** → Update `src/app/portfolio/page.tsx`
   - Add PortfolioSummaryCard above existing panels

5. **Validation**
   - Test: summary updates when underlying data changes
   - Test: all counts accurate

### Commit Message
```
feat(portfolio): add portfolio summary aggregation

Summary card displays total assets, balances, positions across protocols.
```

---

## Session 6: Optimization & Testing (1-1.5 hours)

### Objective
Polish, optimize, and prepare for capability flip.

### Build Order
1. **Real-time Updates**
   - Verify refetch intervals configured correctly
   - Add "Refresh" buttons to panels (optional)

2. **Registry Update** → `src/lib/ecosystems/registry.ts`
   - Add protocol metadata for ETCswap

3. **Comprehensive Testing**
   - Run through full testing checklist (see detailed plan)
   - Test all wallet states
   - Test all network switches
   - Test error scenarios

4. **Documentation** → Update `docs/modules/portfolio/000-intent.md`
   - Document implemented features
   - List supported tokens and protocols

5. **Capability Flip** → `src/lib/ecosystems/registry.ts`
   - Change `portfolio: false` → `portfolio: true` for ETC chains
   - Test: EmptyState no longer shows
   - Test: Full user journey works

### Commit Message
```
feat(portfolio): enable portfolio capability for ETC chains

Portfolio read-only surfaces complete. Capability flipped to true.
Supports native balances, ERC20 tokens, and ETCswap V2 LP positions.
```

---

## Validation Checklist

Run this before each commit:
```bash
npm run lint && npm run typecheck && npm run build
```

Test in browser after each session:
- [ ] Connect wallet → see data
- [ ] Disconnect wallet → see appropriate empty state
- [ ] Switch networks → data updates correctly
- [ ] No console errors
- [ ] No hydration warnings

---

## File Creation Order (All Sessions)

This is the complete list of new files we'll create, in order:

### Session 1
1. `src/lib/portfolio/adapters/native-balance.ts`
2. `src/hooks/useNativeBalance.ts`
3. `src/components/portfolio/NativeBalanceDisplay.tsx`

### Session 2
4. `src/lib/portfolio/abis/erc20.ts`
5. `src/lib/portfolio/tokens/etc-mainnet.ts`
6. `src/lib/portfolio/adapters/erc20-balance.ts`
7. `src/hooks/useTokenBalance.ts`
8. `src/hooks/useTokenBalances.ts`
9. `src/components/portfolio/TokenBalanceRow.tsx`
10. `src/components/portfolio/TokenBalanceList.tsx`

### Session 3
11. `src/lib/portfolio/adapters/explorer-links.ts`
12. `src/hooks/useActivityExplorerLink.ts`

### Session 4
13. `src/lib/portfolio/abis/uniswap-v2-pair.ts`
14. `src/lib/portfolio/abis/uniswap-v2-factory.ts`
15. `src/lib/portfolio/adapters/etcswap-v2-positions.ts`
16. `src/hooks/useETCswapV2Positions.ts`
17. `src/components/portfolio/PositionCard.tsx`
18. `src/components/portfolio/PositionsList.tsx`

### Session 5
19. `src/lib/portfolio/adapters/aggregation.ts`
20. `src/hooks/usePortfolioSummary.ts`
21. `src/components/portfolio/PortfolioSummaryCard.tsx`

**Total: 21 new files + 4 modified files**

Modified files:
- `src/components/portfolio/BalancesPanel.tsx` (Sessions 1, 2)
- `src/components/portfolio/ActivityPanel.tsx` (Session 3)
- `src/components/portfolio/PositionsPanel.tsx` (Session 4)
- `src/app/portfolio/page.tsx` (Session 5)
- `src/lib/ecosystems/registry.ts` (Session 6 - capability flip)

---

## Key Principles

1. **Build vertically, not horizontally**
   - Complete each feature end-to-end before moving to next
   - Immediate validation at each step

2. **Test as you go**
   - Don't wait until the end to test
   - Fix issues immediately while context is fresh

3. **Commit frequently**
   - One commit per completed feature
   - Makes debugging easier if issues arise

4. **Follow the three-layer pattern**
   - Adapter (pure) → Hook (React Query) → UI (explicit states)
   - Never skip layers

5. **Handle all UI states**
   - Disconnected, loading, error, empty, data
   - No "impossible states"

---

## Quick Reference

**Tech Stack:**
- Next.js 16 (App Router)
- React 19
- wagmi 3 (wallet connection)
- viem 2 (Ethereum interactions)
- TanStack Query 5 (data fetching)
- TypeScript 5

**Patterns:**
- Structural typing for RPC clients
- Read-only by default (no transaction signing)
- RequirementGate for wallet/network enforcement
- EmptyState for missing capabilities

**Chain IDs:**
- ETC Mainnet: 61
- Mordor Testnet: 63
- Ethereum Mainnet: 1
- Sepolia Testnet: 11155111
