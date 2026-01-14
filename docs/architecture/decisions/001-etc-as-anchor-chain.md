# ADR 001: ETC as Anchor Chain

**Date:** 2026-01-13
**Status:** Accepted

## Decision

Ethereum Classic (ETC) is the **default and anchor chain** for Classic OS, not merely one option among many EVM networks.

## Context

Classic OS is developed by the operators of EthereumClassic.com and related ETC ecosystem infrastructure. This provides:
- Direct visibility into ETC users, miners, and economic constraints
- Deep understanding of the ETC PoW miner base
- Strategic positioning in the only mature, programmable Proof-of-Work EVM network

While Classic OS supports other EVM chains, ETC is structurally different:
- It's the chain where Classic OS operators have direct ecosystem involvement
- It represents the **only programmable PoW EVM** with significant hashrate
- It's a **capital-producing system** (via mining) whose outputs are currently underutilized

## Consequences

**For Product:**
- ETC is the default selected network on first load
- ETC-specific features (mining integration, PoW economics) are first-class
- Multi-chain support exists to serve ETC adoption, not replace it

**For Code:**
- Network registry ([src/lib/networks/registry.ts](../../src/lib/networks/registry.ts)) lists ETC first
- Workspace state defaults to ETC mainnet (chain ID 61)
- Capability registry treats PoW mining as a primary production mode
- Theme system uses ETC green as the base color

**For Users:**
- New users land on ETC by default
- PoW miners (ETC's native user base) see mining as a first-class feature
- Multi-chain users understand they're using ETC infrastructure extended to other chains

**Non-Goals:**
- Classic OS is not chain-agnostic or neutral
- Other chains are supported for pragmatic reasons (distribution, liquidity, users), not ideological parity
- ETC will always have deeper integration than other networks
