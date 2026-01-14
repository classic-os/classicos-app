# Classic OS Internal Documentation

This directory contains internal, implementation-oriented documentation for Classic OS contributors.

**Purpose:** Preserve implementation truth, prevent drift, and provide clear guidance for building the complete economic operating system.

## What is Classic OS?

Classic OS is a complete economic operating system combining:
- **Mining OS** (custom-built, inspired by HiveOS) - Mining dashboard, payout detection, capital flow pathways
- **DeFi Automation** (custom-built, inspired by DeFi Saver) - Portfolio observation + Deploy execution
- **Brale Integration** (business partner) - Stablecoin onboarding and fiat access
- **Multi-EVM Support** (distribution layer) - Cross-chain portfolio and liquidity access

## Documentation Structure

### Product Documentation
- **[product/000-product-model.md](product/000-product-model.md)** - Product vision and core surfaces
- **[product/010-module-definitions.md](product/010-module-definitions.md)** - Four canonical modules (Produce, Portfolio, Deploy, Markets)
- **[product/020-user-journeys.md](product/020-user-journeys.md)** - Three primary user journeys
- **[product/030-scope-boundaries.md](product/030-scope-boundaries.md)** - What we build vs integrate
- **[product/040-non-goals.md](product/040-non-goals.md)** - Explicit non-goals

### Architecture Documentation
- **[architecture/patterns.md](architecture/patterns.md)** - Comprehensive patterns deep dive
- **[architecture/000-appshell-overview.md](architecture/000-appshell-overview.md)** - App shell structure
- **[architecture/020-capability-gating.md](architecture/020-capability-gating.md)** - Capability registry system
- **[architecture/030-workspace-state.md](architecture/030-workspace-state.md)** - Workspace state management
- **[architecture/decisions/](architecture/decisions/)** - Architecture Decision Records (ADRs)

### Module-Specific Documentation
- **[modules/produce/000-intent.md](modules/produce/000-intent.md)** - Mining OS (capital production)
- **[modules/portfolio/000-intent.md](modules/portfolio/000-intent.md)** - DeFi Automation (observation layer)
- **[modules/deploy/000-intent.md](modules/deploy/000-intent.md)** - DeFi Automation (execution layer)
- **[modules/markets/000-intent.md](modules/markets/000-intent.md)** - DEX aggregation + Brale integration

### Project Management
- **[handoff/000-project-status.md](handoff/000-project-status.md)** - Current implementation status
- **[handoff/010-milestones.md](handoff/010-milestones.md)** - Implementation milestones by phase
- **[handoff/020-roadmap-sequence.md](handoff/020-roadmap-sequence.md)** - Ordered delivery sequence
- **[handoff/030-definition-of-done.md](handoff/030-definition-of-done.md)** - Quality standards

### Developer Guides
- **[dev/000-repo-conventions.md](dev/000-repo-conventions.md)** - Repository conventions
- **[dev/010-folder-structure.md](dev/010-folder-structure.md)** - Folder structure
- **[dev/020-page-shell-pattern.md](dev/020-page-shell-pattern.md)** - Page shell pattern
- **[dev/030-component-patterns.md](dev/030-component-patterns.md)** - Component patterns

## Quick Start for Contributors

### For AI Coding Assistants
- **Claude Code:** [/.claude/instructions.md](../.claude/instructions.md) (primary)
- **GitHub Copilot:** [/.github/copilot-instructions.md](../.github/copilot-instructions.md) (fallback)
- **Architecture Decisions:** [architecture/decisions/](architecture/decisions/)

### For Human Developers
1. Read [CONTRIBUTING.md](../CONTRIBUTING.md) for setup and workflow
2. Review [product/000-product-model.md](product/000-product-model.md) for product vision
3. Check [handoff/000-project-status.md](handoff/000-project-status.md) for current state
4. Understand [architecture/patterns.md](architecture/patterns.md) for technical patterns

## Key Concepts

**Capital Flows:** Production (mining) → Onboarding (Brale/multi-chain) → Deployment (strategies) → Retention (yield)

**Architecture:** Three-layer pattern (Adapter → Hook → UI), capability gating, read-only by default

**Module Structure:** Produce (create capital), Portfolio (observe capital), Deploy (allocate capital), Markets (access liquidity)

**What We Build:** Mining OS, DeFi Automation, Multi-EVM interface

**What We Integrate:** Brale (business partner), DEX protocols (adapters)

**What We Don't Build:** Mining pools, stablecoin infrastructure, underlying DeFi protocols, HiveOS/DeFi Saver API integrations

