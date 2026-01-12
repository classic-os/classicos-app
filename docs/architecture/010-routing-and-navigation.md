# Classic OS Routing and Navigation

## Purpose
Capture how Classic OS routes are organized so contributors keep navigation and page structure aligned with implemented modules.

## Scope
Top-level and L2 routes for Home, Produce, Portfolio, Deploy, Markets, and how Sidebar/NavItems map to pages.

## Non-goals
No new route proposals or module additions; no public IA redesign.

## Current Status (as implemented)
- Navigation source: [components/layout/NavItems.ts](src/components/layout/NavItems.ts) defines Home `/`, Produce `/produce`, Portfolio `/portfolio`, Deploy `/deploy`, Markets `/markets`.
- Home: `/` at [src/app/page.tsx](src/app/page.tsx).
- Produce: `/produce` plus L2 `/produce/mining`, `/produce/staking` in [src/app/produce/*/page.tsx](src/app/produce).
- Portfolio: `/portfolio` with L2 `/portfolio/balances`, `/portfolio/positions`, `/portfolio/activity` in [src/app/portfolio/*/page.tsx](src/app/portfolio).
- Deploy: `/deploy` with L2 `/deploy/sources`, `/deploy/route`, `/deploy/history` in [src/app/deploy/*/page.tsx](src/app/deploy).
- Markets: `/markets` with L2 `/markets/assets`, `/markets/formation`, `/markets/liquidity` in [src/app/markets/*/page.tsx](src/app/markets).
- Shell integration: Sidebar highlights active routes via pathname checks; AppShell wraps all pages.

## Next Step
Keep route naming stable; when adding capability-backed surfaces, update both NavItems and the corresponding `src/app/<module>` routes in lockstep.
