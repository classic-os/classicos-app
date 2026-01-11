# Classic OS Non-goals

## Purpose
List what Classic OS will not pursue in the current phases to keep delivery focused and truthful.

## Scope
Covers product, execution, and integration areas excluded from near-term work.

## Non-goals
- No execution automation or auto-compounding.
- No mining pool creation; Produce will not operate pooled hashpower.
- No governance or DAO voting UI.
- No bespoke exchange product; Markets depends on the ETCswap V2 adapter when enabled.
- No speculative protocol integrations beyond those in the registry.

## Current Status (as implemented)
- Modules exist as gated shells with EmptyState panels; deploy/markets/portfolio capabilities are disabled in the registry.
- Produce surfaces exist, reflecting ETChash reality: ASIC-primary with GPU support retained; no live mining orchestration.
- RequirementGate enforces wallet presence and chain match; workspace state sourced from localStorage selectors.

## Next Step
Revisit non-goals only alongside explicit capability flips, adapter readiness, and registry updates; keep documentation and capability truth in lockstep.
