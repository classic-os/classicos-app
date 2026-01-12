# Classic OS Internal Documentation

This directory contains internal, implementation-oriented documentation for Classic OS contributors.

- **Purpose:** Preserve implementation truth, prevent drift, and give maintainers guardrails.
- **Public docs:** https://classicos.org/docs (not in this repo).

## Structure

- **agents/** — Agent rules (mandatory) and prompt templates for AI coding agents
- **dev/** — Developer guides (patterns, conventions, workflows)
- **architecture/** — System architecture (app shell, routing, gating, state, UI primitives)
- **decisions/** — Architectural Decision Records (ADRs)
- **product/** — Product model, module definitions, user journeys, scope boundaries
- **modules/** — Module-specific planning (portfolio, markets, produce, deploy, home)
- **handoff/** — Project status, milestones, roadmap, definition of done

## Quick Links

### For Agents
- **Start here:** [/AGENTS.md](/AGENTS.md) (setup, validation, guardrails)
- **Agent rules:** [agents/rules/](agents/rules/) (mandatory behavioral constraints)
- **Prompt templates:** [agents/prompts/](agents/prompts/) (task, bugfix, refactor, feature, ui-change)

### For Developers
- **Handoff:** [handoff/000-project-status.md](handoff/000-project-status.md) (current status)
- **Roadmap:** [handoff/020-roadmap-sequence.md](handoff/020-roadmap-sequence.md) (milestone sequence)
- **Product model:** [product/000-product-model.md](product/000-product-model.md) (what we're building)
- **Capability gating:** [architecture/020-capability-gating.md](architecture/020-capability-gating.md) (feature flags)
- **Decisions:** [decisions/000-decision-log.md](decisions/000-decision-log.md) (ADR index)

