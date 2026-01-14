# ADR 002: PoW Miners as First-Class Users

**Date:** 2026-01-13
**Status:** Accepted

## Decision

Proof-of-Work miners are **first-class users** of Classic OS, not an afterthought or niche feature.

## Context

The most consistent native users of Ethereum Classic today are PoW miners. These miners:
- Secure the network through continuous hashrate
- Earn ETC emissions as capital
- Typically sell rewards immediately via centralized exchanges
- Rarely redeploy earned capital on-chain due to lack of native opportunities

This dynamic represents a **capital leak** from the ETC ecosystem. Miners produce value but have no clear path to redeploy it on-chain.

Classic OS is being built to change this by treating mining as **capital production**, not a terminal action.

## Consequences

**For Product:**
- The "Produce" module exists specifically for mining (not just generic "earn yield")
- Mining surfaces are designed for ASIC operators and GPU miners (hardware reality matters)
- The goal is to make alternatives to immediate exit **legible and accessible**
- No forced behavior - miners choose whether to participate in on-chain strategies

**For Code:**
- Produce module distinguishes between PoW mining and PoS staking
- Capability registry (`ecosystem.capabilities.produce = "mine"`) explicitly models mining
- Mining is not abstracted into generic "staking" or "yield" terminology
- Future integrations (hashrate bridges, miner reward routing) are architectural concerns

**For Users:**
- Miners see their economic activity (capital production) reflected in the interface
- Portfolio module connects mining outputs to deployment strategies
- Markets module provides venues for redeploying mined capital
- The user journey is: Produce (mine) → Portfolio (observe) → Deploy (allocate) → Markets (trade/provide liquidity)

**Non-Goals:**
- Classic OS does not aggregate mining pools or provide mining software
- No forced on-chain participation (miners can still exit to CEXs)
- No financial advice or yield maximization promises
