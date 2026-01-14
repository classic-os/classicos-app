# Classic OS Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) documenting significant decisions that shape Classic OS.

## What Gets Documented

Record decisions that:
- Define product positioning and scope
- Establish architectural patterns or constraints
- Determine which networks/protocols to support
- Set sequencing or delivery priorities
- Resolve ambiguity about direction

## Format

Each ADR follows this structure:
- **ID:** Sequential number (001, 002, etc.)
- **Date:** When the decision was made
- **Status:** Proposed | Accepted | Superseded
- **Decision:** Clear statement of what was decided
- **Context:** Why this decision was necessary
- **Consequences:** Implications for the codebase and product

## Active Decisions

- [001: ETC as Anchor Chain](001-etc-as-anchor-chain.md)
- [002: PoW Miners as First-Class Users](002-pow-miners-first-class-users.md)
- [003: Multi-Chain as Distribution Layer](003-multichain-distribution-layer.md)
- [004: Economic Flows Over Chain Abstraction](004-economic-flows-not-abstraction.md)
- [005: Module Structure (Produce, Portfolio, Deploy, Markets)](005-module-structure.md)
- [006: Read-Only by Default](006-readonly-by-default.md)
- [007: Core Product Architecture (Mining OS + DeFi Automation + Brale)](007-core-product-architecture.md)

## Superseded Decisions

None yet.
