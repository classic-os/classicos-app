# ADR 003: Multi-Chain as Distribution Layer

**Date:** 2026-01-13
**Status:** Accepted

## Decision

Classic OS supports multiple EVM networks (ETH, Sepolia, etc.) as a **distribution and learning layer**, not as replacements for ETC.

## Context

Ethereum Classic has:
- Strong PoW miner base
- Limited dApp ecosystem today
- Fewer users compared to Ethereum mainnet

Other EVM networks have:
- Active users and capital flows
- Proven on-chain primitives (DEXs, lending, NFTs)
- Established workflows and mental models

The expansion to multi-chain support is **pragmatic, not ideological**:
- Attract existing power users and capital to Classic OS
- Surface proven primitives in a familiar context
- Introduce users to ETC-native protocols through workflows they already understand

Multi-chain support serves ETC adoption. It's a path **into** the ETC ecosystem, not away from it.

## Consequences

**For Product:**
- Users can connect wallets on ETH, Sepolia, or other EVM chains
- Portfolio, Deploy, and Markets modules work across supported chains
- ETC-specific features (mining, PoW economics) remain ETC-only
- UI makes clear which features are universal vs ETC-specific

**For Code:**
- Network registry ([src/lib/networks/registry.ts](../../src/lib/networks/registry.ts)) defines all supported chains
- Capability registry distinguishes between PoW (mining) and PoS (staking) networks
- Workspace state tracks active chain but defaults to ETC
- Components check capabilities before rendering features

**For Users:**
- Existing Ethereum users can use Classic OS immediately
- They experience Classic OS workflows on familiar chains first
- Natural migration path: use on ETH → discover ETC features → explore ETC
- PoW mining is exclusive to ETC (structural difference, not arbitrary limitation)

**Non-Goals:**
- Classic OS is not a generic multi-chain portfolio aggregator
- Other chains don't get equal treatment or feature parity
- No chain-agnostic branding or messaging
- ETC remains the anchor; other chains are supporting infrastructure
