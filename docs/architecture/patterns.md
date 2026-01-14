# Classic OS Architecture Patterns

Comprehensive guide to the architectural patterns, design decisions, and implementation strategies used in Classic OS.

## Table of Contents

1. [Overview](#overview)
2. [Three-Layer Data Pattern](#three-layer-data-pattern)
3. [Capability Registry System](#capability-registry-system)
4. [Network Abstraction](#network-abstraction)
5. [Workspace State Management](#workspace-state-management)
6. [Component Architecture](#component-architecture)
7. [Web3 Integration Patterns](#web3-integration-patterns)
8. [Design Principles](#design-principles)
9. [Anti-Patterns](#anti-patterns)

## Overview

Classic OS is built on Next.js 16 with React 19, using the App Router for routing and server-side rendering. The application provides a unified interface for Ethereum Classic (ETC) economic operations including production (mining/staking), deployment, portfolio management, and markets.

**Core Technologies:**
- **Framework:** Next.js 16.1.1 (App Router)
- **UI Library:** React 19.2.3
- **Language:** TypeScript 5.x (ES2017 target)
- **Web3:** wagmi 3.2.0, viem 2.44.0
- **State Management:** TanStack React Query 5.90.16
- **Styling:** Tailwind CSS 4.x
- **Animation:** Framer Motion 12.24.12

**Architecture Philosophy:**
- **Read-only by default:** No transaction signing unless explicitly required
- **Capability-driven:** Features are gated by network capabilities
- **Honest UX:** Empty states are factual, never speculative
- **Small, focused changes:** One feature per commit
- **RPC-only:** No external APIs (indexers, GraphQL, etc.)

## Three-Layer Data Pattern

The three-layer pattern is the **fundamental architectural constraint** for all data access in Classic OS. This pattern ensures:
- Separation of concerns
- Testability
- Framework independence
- Type safety
- Explicit state handling

### Layer 1: Adapter (Pure Functions)

**Location:** `src/lib/<domain>/adapter.ts`

**Characteristics:**
- Pure functions with no side effects
- No React dependencies
- No state management
- RPC-only blockchain interactions
- Structural types (not concrete viem types)
- Returns data or throws errors

**Example:**
```typescript
// src/lib/balance/adapter.ts
import type { Address } from 'viem'

// Structural type (not concrete PublicClient import)
type RpcClient = {
  getBalance: (args: { address: Address }) => Promise<bigint>
}

export async function getBalance(
  client: RpcClient,
  address: Address,
  chainId: number
): Promise<bigint> {
  if (!address) {
    throw new Error('Address is required')
  }

  try {
    const balance = await client.getBalance({ address })
    return balance
  } catch (error) {
    throw new Error(`Failed to fetch balance: ${error.message}`)
  }
}
```

**Why Structural Types?**
Structural types prevent breaking changes when library versions update. Instead of importing `PublicClient` from viem (which may change between versions), we define only the methods we need.

**Why Pure Functions?**
- Easy to test (no mocking required)
- No hidden dependencies
- Predictable behavior
- Reusable across different contexts

### Layer 2: Hook (React Integration)

**Location:** `src/hooks/use<Feature>.ts`

**Characteristics:**
- Wraps adapters with React lifecycle
- Uses TanStack Query for caching and state management
- Handles prerequisites (wallet connection, client availability)
- Manages loading, error, and success states
- No business logic (delegates to adapter)

**Example:**
```typescript
// src/hooks/useBalance.ts
import { useQuery } from '@tanstack/react-query'
import { usePublicClient, useChainId } from 'wagmi'
import { getBalance } from '@/lib/balance/adapter'
import type { Address } from 'viem'

export function useBalance(address: Address | undefined) {
  const client = usePublicClient()
  const chainId = useChainId()

  return useQuery({
    queryKey: ['balance', address, chainId],
    queryFn: async () => {
      if (!client || !address) {
        throw new Error('Client and address required')
      }
      return getBalance(client, address, chainId)
    },
    enabled: Boolean(client && address),
    staleTime: 30_000, // 30 seconds
    refetchInterval: 60_000, // 1 minute
  })
}
```

**Key Decisions:**
- `enabled: Boolean(client && address)` prevents query from running until prerequisites are met
- `staleTime` and `refetchInterval` balance freshness with performance
- Query key includes all dependencies (address, chainId) for proper caching

**Why TanStack Query?**
- Automatic caching and deduplication
- Built-in loading and error states
- Automatic refetching and background updates
- Optimistic updates (when needed)
- DevTools for debugging

### Layer 3: UI Component (Explicit State Rendering)

**Location:** `src/components/<module>/<Component>.tsx`

**Characteristics:**
- Renders **all** states explicitly:
  - Disconnected (no wallet)
  - Loading
  - Error
  - Empty (no data)
  - Data (success)
- No speculation ("coming soon" placeholders)
- Uses semantic HTML and accessibility attributes
- Styled with Tailwind CSS

**Example:**
```typescript
// src/components/portfolio/BalanceDisplay.tsx
'use client'

import { useBalance } from '@/hooks/useBalance'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Address } from 'viem'

interface BalanceDisplayProps {
  address?: Address
}

export function BalanceDisplay({ address }: BalanceDisplayProps) {
  const { isConnected } = useAccount()
  const { data, isLoading, error } = useBalance(address)

  // State 1: Disconnected
  if (!isConnected || !address) {
    return (
      <EmptyState
        title="No wallet connected"
        description="Connect a wallet to view balance"
      />
    )
  }

  // State 2: Loading
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        <span>Loading balance...</span>
      </div>
    )
  }

  // State 3: Error
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">
          Error loading balance: {error.message}
        </p>
      </div>
    )
  }

  // State 4: Empty (no data, but no error)
  if (data === undefined) {
    return (
      <EmptyState
        title="No balance data"
        description="Unable to retrieve balance information"
      />
    )
  }

  // State 5: Success (data available)
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">Balance</span>
      <span className="text-2xl font-semibold">
        {formatEther(data)} ETC
      </span>
    </div>
  )
}
```

**Why All States Matter:**
- **Disconnected:** Guides user to connect wallet
- **Loading:** Prevents confusion while data loads
- **Error:** Helps debug issues
- **Empty:** Distinguishes "no data" from "loading" or "error"
- **Data:** Shows the successful result

**Anti-Pattern (Don't Do This):**
```typescript
// ❌ Bad: Missing states, speculation
export function BalanceDisplay({ address }) {
  const { data } = useBalance(address)
  return <div>{data ? formatEther(data) : "Your balance will appear soon"}</div>
}
```

## Capability Registry System

The capability registry controls which features are available on each network. This prevents showing features that don't work on certain chains.

### Registry Structure

**Location:** `src/lib/ecosystems/registry.ts`

**Type Definitions:**
```typescript
export type EcosystemCapabilities = {
  produce: "mine" | "stake" | "none"  // Production mode
  deploy: boolean                      // Smart contract deployment
  markets: boolean                     // Asset creation & liquidity
  portfolio: boolean                   // Balance & position tracking
  monitoring: boolean                  // Network health monitoring
  flags?: Record<string, boolean>      // Feature flags
}

export type Ecosystem = {
  id: string
  chainId: number
  family: NetworkFamilyKey             // "ETC_POW" | "ETH_POS"
  kind: NetworkKind                    // "mainnet" | "testnet" | "l2"
  capabilities: EcosystemCapabilities
  observability: {
    blockExplorer?: string
    dashboards?: string[]
    charts?: string[]
  }
  protocols: {
    dexes?: Array<{ name: string; url: string }>
    lending?: Array<{ name: string; url: string }>
    launchpads?: Array<{ name: string; url: string }>
    bridges?: Array<{ name: string; url: string }>
  }
}

export type EcosystemRegistry = Record<number, Ecosystem>
```

**Building the Registry:**
```typescript
import { NETWORKS } from '@/lib/networks/registry'

export const ECOSYSTEMS: EcosystemRegistry = Object.fromEntries(
  NETWORKS.map((network) => {
    const id = ecosystemIdFor(network.chain.id)
    const capabilities = capabilitiesFor(
      network.chain.id,
      network.family,
      network.kind
    )

    const ecosystem: Ecosystem = {
      id,
      chainId: network.chain.id,
      family: network.family,
      kind: network.kind,
      capabilities,
      observability: buildObservability(network),
      protocols: buildProtocols(network),
    }

    return [network.chain.id, ecosystem]
  })
)

function capabilitiesFor(
  chainId: number,
  family: NetworkFamilyKey,
  kind: NetworkKind
): EcosystemCapabilities {
  // Determine production mode based on consensus
  const produce: ProduceMode =
    family === "ETC_POW" ? "mine" :
    family === "ETH_POS" ? "stake" :
    "none"

  return {
    produce,
    deploy: false,        // Turn on when smart contract tools ready
    markets: false,       // Turn on when market creation ready
    portfolio: false,     // Turn on when balance tracking ready
    monitoring: false,    // Turn on when health monitoring ready
    flags: {
      isTestnet: kind === "testnet",
      produceMine: produce === "mine",
      produceStake: produce === "stake",
    },
  }
}
```

### Using Capabilities in Pages

**Pattern:**
```typescript
// src/app/produce/page.tsx
'use client'

import { useMemo, useSyncExternalStore } from 'react'
import { getEcosystem } from '@/lib/ecosystems/registry'
import { subscribeWorkspace, getActiveChainId } from '@/lib/state/workspace'
import { EmptyState } from '@/components/ui/EmptyState'
import { MiningPanel } from '@/components/modules/produce/MiningPanel'
import { StakingPanel } from '@/components/modules/produce/StakingPanel'

export default function ProducePage() {
  const activeChainId = useSyncExternalStore(
    subscribeWorkspace,
    getActiveChainId,
    () => 61  // Default to ETC mainnet for SSR
  )

  const ecosystem = useMemo(
    () => getEcosystem(activeChainId),
    [activeChainId]
  )

  const mode = ecosystem.capabilities.produce

  if (mode === "none") {
    return (
      <EmptyState
        title="Production not available"
        description={`${ecosystem.id} does not support production (mining or staking)`}
      />
    )
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold">Produce</h1>
        <p className="text-gray-600">
          Active: {ecosystem.id} • Mode: {mode}
        </p>
      </header>

      {mode === "mine" && <MiningPanel chainId={activeChainId} />}
      {mode === "stake" && <StakingPanel chainId={activeChainId} />}
    </div>
  )
}
```

**Key Points:**
1. Always check capabilities before rendering features
2. Use `useMemo` to avoid recomputing ecosystem on every render
3. Provide clear messaging when features aren't available
4. Conditional rendering based on capability values

### Incremental Rollout Strategy

Capabilities start as `false` and are turned on incrementally as features are completed:

**Phase 1:** Initial shell
```typescript
{
  produce: "mine",    // Only thing that works
  deploy: false,
  markets: false,
  portfolio: false,
  monitoring: false,
}
```

**Phase 2:** Portfolio added
```typescript
{
  produce: "mine",
  deploy: false,
  markets: false,
  portfolio: true,    // Now enabled
  monitoring: false,
}
```

**Phase 3:** Markets added
```typescript
{
  produce: "mine",
  deploy: false,
  markets: true,      // Now enabled
  portfolio: true,
  monitoring: false,
}
```

This approach ensures:
- No broken features are exposed to users
- Clear progress tracking
- Easy rollback if issues arise
- Honest UX (features only shown when they work)

## Network Abstraction

All network configuration is centralized in a single registry, derived from Viem Chain objects.

### Network Registry

**Location:** `src/lib/networks/registry.ts`

**Structure:**
```typescript
import { type Chain } from 'viem'
import * as chains from 'viem/chains'

export type NetworkFamilyKey = "ETC_POW" | "ETH_POS"
export type NetworkKind = "mainnet" | "testnet" | "l2"

export type Network = {
  chain: Chain              // Viem Chain object (canonical)
  family: NetworkFamilyKey  // Consensus mechanism
  kind: NetworkKind         // Network type
  parentChainId?: number    // For testnets (points to mainnet)
  shortName: string         // Display name ("ETC", "ETH", "Mordor")
}

// Complete network definitions
export const NETWORKS: Network[] = [
  {
    chain: chains.classic,
    family: "ETC_POW",
    kind: "mainnet",
    shortName: "ETC",
  },
  {
    chain: chains.mordor,
    family: "ETC_POW",
    kind: "testnet",
    parentChainId: chains.classic.id,
    shortName: "Mordor",
  },
  {
    chain: chains.mainnet,
    family: "ETH_POS",
    kind: "mainnet",
    shortName: "ETH",
  },
  {
    chain: chains.sepolia,
    family: "ETH_POS",
    kind: "testnet",
    parentChainId: chains.mainnet.id,
    shortName: "Sepolia",
  },
]

// Derived lookups for fast access
export const CHAINS: Chain[] = NETWORKS.map((n) => n.chain)

export const CHAINS_BY_ID: Record<number, Chain> = Object.fromEntries(
  NETWORKS.map((n) => [n.chain.id, n.chain])
)

export const NETWORKS_BY_ID: Record<number, Network> = Object.fromEntries(
  NETWORKS.map((n) => [n.chain.id, n])
)
```

### Network Families

Networks are grouped by consensus mechanism:

**ETC_POW (Proof of Work):**
- Ethereum Classic (mainnet)
- Mordor (testnet)
- Production mode: "mine"

**ETH_POS (Proof of Stake):**
- Ethereum (mainnet)
- Sepolia (testnet)
- Production mode: "stake"

This grouping allows:
- Conditional features based on consensus
- UI differences (mining vs staking)
- Capability derivation

### Wagmi Integration

Wagmi configuration is derived from the network registry:

**Location:** `src/lib/chain/wagmi.ts`

```typescript
import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { NETWORKS, CHAINS } from '@/lib/networks/registry'

export function makeWagmiConfig() {
  // Build transports from network registry
  const transports = Object.fromEntries(
    NETWORKS.map((network) => {
      const rpcUrl = firstHttpRpc(network)
      return [network.chain.id, rpcUrl ? http(rpcUrl) : http("")]
    })
  )

  return createConfig({
    chains: CHAINS as [Chain, ...Chain[]],
    connectors: [
      injected({ shimDisconnect: true })
    ],
    transports,
    ssr: true,  // Enable SSR support
  })
}

function firstHttpRpc(network: Network): string | undefined {
  const defaultRpc = network.chain.rpcUrls.default.http[0]
  const publicRpc = network.chain.rpcUrls.public?.http[0]
  return defaultRpc || publicRpc
}
```

**Why Derive from Registry?**
- Single source of truth
- Adding networks requires updating only `NETWORKS` array
- No configuration drift between network registry and wagmi config
- Type safety from Viem Chain objects

### Network Theming

Each network has visual theming based on family and kind:

**Location:** `src/lib/networks/theme.ts`

```typescript
export type NetworkTheme = {
  accentRgb: string      // "r g b" for CSS rgb() values
  accentGlow: string     // "rgba(r,g,b,a)" for shadows
  label: string          // Human-readable label
}

const ETC_GREEN: NetworkTheme = {
  accentRgb: "0 255 136",
  accentGlow: "rgba(0,255,136,0.35)",
  label: "ETC",
}

const ETH_PURPLE: NetworkTheme = {
  accentRgb: "155 81 224",
  accentGlow: "rgba(155,81,224,0.35)",
  label: "ETH",
}

const TESTNET_YELLOW: NetworkTheme = {
  accentRgb: "255 200 0",
  accentGlow: "rgba(255,200,0,0.35)",
  label: "Testnet",
}

export function themeForChainId(chainId: number | null): NetworkTheme {
  if (!chainId) return ETC_GREEN

  const network = NETWORKS_BY_ID[chainId]
  if (!network) return ETC_GREEN

  // Testnets always get yellow
  if (network.kind === "testnet") return TESTNET_YELLOW

  // Mainnet color by family
  if (network.family === "ETH_POS") return ETH_PURPLE
  if (network.family === "ETC_POW") return ETC_GREEN

  return ETC_GREEN  // Fallback
}
```

**Usage in Components:**
```typescript
const theme = themeForChainId(activeChainId)

return (
  <div
    className="network-indicator"
    style={{
      backgroundColor: `rgb(${theme.accentRgb})`,
      boxShadow: `0 0 14px ${theme.accentGlow}`,
    }}
  >
    {theme.label}
  </div>
)
```

## Workspace State Management

Workspace state (active chain ID, testnet visibility) is persisted in localStorage and synchronized across browser tabs.

### State Structure

**Location:** `src/lib/state/workspace.ts`

**Managed State:**
- `activeChainId` - Currently selected blockchain
- `showTestnets` - Whether to display testnets in network selector

**Storage Keys:**
```typescript
const KEY_ACTIVE = "classicos:activeChainId"
const KEY_SHOW_TESTNETS = "classicos:showTestnets"
const EVENT_NAME = "classicos:workspace"
```

### Implementation

**Getters:**
```typescript
export function getActiveChainId(): number {
  if (typeof window === "undefined") return DEFAULT_ACTIVE_CHAIN_ID

  const stored = window.localStorage.getItem(KEY_ACTIVE)
  return normalizeChainId(stored)
}

export function getShowTestnets(): boolean {
  if (typeof window === "undefined") return false

  const stored = window.localStorage.getItem(KEY_SHOW_TESTNETS)
  return stored === "true"
}

function normalizeChainId(value: string | null): number {
  if (!value) return DEFAULT_ACTIVE_CHAIN_ID

  const parsed = parseInt(value, 10)
  if (isNaN(parsed)) return DEFAULT_ACTIVE_CHAIN_ID

  // Only accept known chain IDs
  return CHAINS_BY_ID[parsed] ? parsed : DEFAULT_ACTIVE_CHAIN_ID
}
```

**Setters:**
```typescript
export function setActiveChainId(chainId: number): void {
  if (typeof window === "undefined") return

  // Validate and fallback to default if unknown
  const safe = CHAINS_BY_ID[chainId] ? chainId : DEFAULT_ACTIVE_CHAIN_ID

  window.localStorage.setItem(KEY_ACTIVE, String(safe))
  emitWorkspaceChange()
}

export function setShowTestnets(enabled: boolean): void {
  if (typeof window === "undefined") return

  window.localStorage.setItem(KEY_SHOW_TESTNETS, String(enabled))
  emitWorkspaceChange()
}

function emitWorkspaceChange(): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(EVENT_NAME))
}
```

**Subscription (Multi-Tab Sync):**
```typescript
export function subscribeWorkspace(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {}

  const handler = () => callback()

  // Listen to storage events (cross-tab changes)
  window.addEventListener("storage", handler)

  // Listen to custom events (same-tab changes)
  window.addEventListener(EVENT_NAME, handler)

  // Return cleanup function
  return () => {
    window.removeEventListener("storage", handler)
    window.removeEventListener(EVENT_NAME, handler)
  }
}
```

### Usage with `useSyncExternalStore`

React 19's `useSyncExternalStore` hook ensures proper SSR hydration and multi-tab sync:

```typescript
import { useSyncExternalStore } from 'react'
import {
  subscribeWorkspace,
  getActiveChainId,
} from '@/lib/state/workspace'

export function useActiveChainId() {
  return useSyncExternalStore(
    subscribeWorkspace,        // Subscribe function
    getActiveChainId,          // Client snapshot
    () => 61                   // Server snapshot (SSR)
  )
}
```

**Why `useSyncExternalStore`?**
- Prevents hydration mismatches
- Automatic re-render on state changes
- Built-in support for SSR
- Tracks external state properly

**Multi-Tab Synchronization:**
1. User changes chain in Tab A
2. `setActiveChainId()` updates localStorage and emits custom event
3. Tab A re-renders (custom event)
4. Tab B receives storage event
5. Tab B re-renders automatically
6. Both tabs now show same chain

## Component Architecture

Components are organized by responsibility and scope.

### Directory Structure

```
src/components/
├── layout/              # Application frame (protected)
│   ├── AppShell.tsx
│   ├── TopBar.tsx
│   ├── Sidebar.tsx
│   ├── FooterStatus.tsx
│   └── NavItems.ts
│
├── primitives/          # Workspace-aware atoms
│   ├── WalletConnector.tsx
│   ├── ActiveNetworkSelector.tsx
│   ├── NetworkStatus.tsx
│   ├── TestnetToggle.tsx
│   └── WorkspaceStatus.tsx
│
├── modules/             # Feature domains
│   ├── portfolio/
│   │   ├── BalancesPanel.tsx
│   │   ├── PositionsPanel.tsx
│   │   └── ActivityPanel.tsx
│   ├── produce/
│   │   ├── MiningPanel.tsx
│   │   └── StakingPanel.tsx
│   ├── deploy/
│   │   ├── SourcesPanel.tsx
│   │   ├── RoutePanel.tsx
│   │   └── HistoryPanel.tsx
│   └── markets/
│       ├── AssetsPanel.tsx
│       ├── LiquidityPanel.tsx
│       └── FormationPanel.tsx
│
├── ui/                  # Generic reusable components
│   ├── Panel.tsx
│   ├── EmptyState.tsx
│   ├── ModuleHeader.tsx
│   ├── CapabilityBadge.tsx
│   ├── RequirementGate.tsx
│   └── StatusPill.tsx
│
└── providers/           # Context providers
    └── Web3Providers.tsx
```

### Layout Layer (Protected)

The layout layer defines the application frame and is protected from casual modification.

**AppShell:**
```typescript
// src/components/layout/AppShell.tsx
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <BackgroundSystem />

      <div className="cos-window grid grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="hidden md:block">
          <Sidebar />
        </aside>

        <div className="flex flex-col">
          <TopBar />
          <main className="flex-1 p-4 md:p-6">{children}</main>
          <footer>
            <FooterStatus />
          </footer>
        </div>
      </div>
    </div>
  )
}
```

**Why Protected?**
Changes to layout affect every page. Small modifications can cascade unpredictably.

### Primitives Layer

Primitives are workspace-aware atoms that combine multiple concerns:

**Example: ActiveNetworkSelector**
```typescript
export function ActiveNetworkSelector() {
  // Workspace state
  const activeChainId = useSyncExternalStore(...)
  const showTestnets = useSyncExternalStore(...)

  // Wagmi state
  const { isConnected } = useAccount()
  const walletChainId = useChainId()
  const { mutateAsync: switchChain } = useSwitchChain()

  // Network data
  const activeChain = useMemo(() => CHAINS_BY_ID[activeChainId], [activeChainId])
  const theme = themeForChainId(activeChainId)

  const handleSelect = async (chainId: number) => {
    // Update workspace
    setActiveChainId(chainId)

    // Switch wallet if connected and on different chain
    if (isConnected && walletChainId !== chainId) {
      try {
        await switchChain({ chainId })
      } catch (error) {
        // User rejected, ignore
      }
    }
  }

  return (
    <button onClick={() => setMenuOpen(true)}>
      <span style={{ color: `rgb(${theme.accentRgb})` }}>
        {activeChain?.name ?? `Chain ${activeChainId}`}
      </span>
    </button>
  )
}
```

**Primitives vs UI Components:**
- **Primitives:** Know about workspace, wagmi, and application state
- **UI Components:** Generic, reusable, no app-specific knowledge

### Modules Layer

Modules are feature-specific components grouped by domain:

**Pattern:**
```
modules/<domain>/
├── <Feature>Panel.tsx     # Main panel component
├── <Detail>Section.tsx    # Sub-sections
└── index.ts               # Barrel export
```

**Example Module:**
```typescript
// src/components/modules/portfolio/BalancesPanel.tsx
'use client'

import { useAccount } from 'wagmi'
import { Panel } from '@/components/ui/Panel'
import { EmptyState } from '@/components/ui/EmptyState'
import { RequirementGate } from '@/components/ui/RequirementGate'
import { BalanceDisplay } from './BalanceDisplay'

export function BalancesPanel() {
  const { address } = useAccount()

  return (
    <Panel
      title="Balances"
      description="Native asset balances"
    >
      <RequirementGate>
        {address ? (
          <BalanceDisplay address={address} />
        ) : (
          <EmptyState
            title="No wallet connected"
            description="Connect a wallet to view balances"
          />
        )}
      </RequirementGate>
    </Panel>
  )
}
```

### UI Layer (Generic Components)

Generic components are reusable across modules:

**Panel:**
```typescript
export function Panel({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="cos-panel rounded-lg border bg-white p-4">
      <header className="mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </header>
      <div>{children}</div>
    </div>
  )
}
```

**EmptyState:**
```typescript
export function EmptyState({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      )}
    </div>
  )
}
```

**RequirementGate:**
```typescript
export function RequirementGate({ children }: { children: React.ReactNode }) {
  const { isConnected, address } = useAccount()
  const walletChainId = useChainId()
  const activeChainId = useSyncExternalStore(...)

  if (!isConnected || !address) {
    return (
      <Panel>
        <EmptyState
          title="Connection required"
          description="Connect a wallet to access this feature"
        />
      </Panel>
    )
  }

  if (walletChainId !== activeChainId) {
    return (
      <Panel>
        <EmptyState
          title="Network mismatch"
          description="Switch your wallet to the active network"
        />
      </Panel>
    )
  }

  return <>{children}</>
}
```

## Web3 Integration Patterns

### Read-Only by Default

All web3 operations are read-only unless explicitly requested:

**Allowed:**
- `usePublicClient()` - RPC client
- `useAccount()` - Wallet address
- `useChainId()` - Current chain
- `useBalance()` - Token balances
- `useReadContract()` - View function calls
- `useConnections()` - Connection status

**Forbidden (without explicit request):**
- `useWriteContract()` - State mutations
- `useSendTransaction()` - ETH transfers
- `useSignMessage()` - Message signing

### wagmi v3 Patterns

wagmi 3.x uses mutation-style APIs:

**Connection:**
```typescript
const { mutate: connect, isPending, error } = useConnect()
const { mutate: disconnect } = useDisconnect()

// Usage
<button
  onClick={() => connect({ connector: injected() })}
  disabled={isPending}
>
  {isPending ? 'Connecting...' : 'Connect'}
</button>
```

**Network Switching:**
```typescript
const { mutateAsync: switchChain, isPending } = useSwitchChain()

// Usage
const handleSwitch = async () => {
  try {
    await switchChain({ chainId: 61 })
  } catch (error) {
    // User rejected
    console.error('Failed to switch:', error)
  }
}
```

### No External APIs

Classic OS uses RPC-only architecture:

**Reasons:**
- Self-contained (no dependencies on external services)
- Simpler architecture
- Lower latency (direct RPC calls)
- No API keys or rate limits
- Full control over data access

**If External APIs Are Needed:**
1. Propose separately with justification
2. Evaluate alternatives (RPC-based solutions)
3. Consider caching and error handling
4. Document dependencies

## Design Principles

### 1. Honest UX

Empty states are factual, never speculative:

**Good:**
- "No portfolio items yet"
- "Connect wallet to view balances"
- "This network does not support mining"

**Bad:**
- "Your portfolio will appear here soon"
- "Coming soon"
- "Check back later"

**Why:** Speculation confuses users. Honesty sets clear expectations.

### 2. Small Diffs

Make small, focused changes:

**Good:**
- One feature per pull request
- One module per commit
- Related changes grouped together

**Bad:**
- Multiple features bundled
- Refactoring + new feature
- "While we're here" improvements

**Why:** Small diffs are easier to review, debug, and revert.

### 3. Capability-First

Always check capabilities before rendering features:

```typescript
const ecosystem = getEcosystem(activeChainId)

if (!ecosystem.capabilities.portfolio) {
  return <EmptyState title="Portfolio not available" />
}

return <PortfolioContent />
```

**Why:** Prevents showing broken features to users.

### 4. Explicit States

Render all component states explicitly:

- Disconnected
- Loading
- Error
- Empty
- Data

**Why:** Clear UX at every stage.

### 5. Read-Only Default

No transaction signing unless explicitly required:

**Why:** Security, simplicity, and prevents accidental state mutations.

## Anti-Patterns

### 1. Skipping Capability Checks

**❌ Bad:**
```typescript
export default function PortfolioPage() {
  return <BalancesPanel />  // Assumes portfolio is available
}
```

**✅ Good:**
```typescript
export default function PortfolioPage() {
  const ecosystem = getEcosystem(activeChainId)

  if (!ecosystem.capabilities.portfolio) {
    return <EmptyState title="Portfolio not available" />
  }

  return <BalancesPanel />
}
```

### 2. Using BigInt Literals

**❌ Bad:**
```typescript
const value = 1000000000000000000n  // Error: ES2017 doesn't support BigInt literals
```

**✅ Good:**
```typescript
const value = BigInt("1000000000000000000")
```

### 3. Concrete viem Types in Adapters

**❌ Bad:**
```typescript
import type { PublicClient } from 'viem'

export async function getBalance(client: PublicClient, address: Address) {
  // Breaks when viem updates PublicClient type
}
```

**✅ Good:**
```typescript
type RpcClient = {
  getBalance: (args: { address: Address }) => Promise<bigint>
}

export async function getBalance(client: RpcClient, address: Address) {
  // Structural type survives viem updates
}
```

### 4. Speculative Empty States

**❌ Bad:**
```typescript
if (!data) {
  return <div>Your data will appear soon</div>
}
```

**✅ Good:**
```typescript
if (!data) {
  return <EmptyState title="No data available" />
}
```

### 5. Bundling Multiple Features

**❌ Bad:**
```
git commit -m "Add portfolio, update sidebar, refactor hooks"
```

**✅ Good:**
```
git commit -m "Portfolio: add balance display"
git commit -m "Refactor: extract useBalance hook"
```

### 6. Modifying Protected Files Without Request

**❌ Bad:**
```typescript
// Modifying AppShell.tsx to add a footer without discussion
```

**✅ Good:**
```
// Ask first: "I need to add a footer to AppShell. Should I proceed?"
```

---

## Summary

Classic OS architecture prioritizes:
- **Simplicity:** Three-layer pattern, RPC-only, no external APIs
- **Honesty:** Factual empty states, capability checks
- **Type Safety:** Structural types, strict TypeScript
- **Maintainability:** Small diffs, clear separation of concerns
- **Security:** Read-only default, no transaction signing

For questions or clarifications, see:
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [.claude/instructions.md](../../.claude/instructions.md)
- [Architecture Decision Records](./decisions/)

---

Last updated: 2026-01-13
