# Classic OS AppShell Overview

## Purpose
Document how the Classic OS shell composes providers, navigation, and the main content area so contributors align changes with current structure.

## Scope
Root layout, AppShell, Sidebar, TopBar, footer status, and how pages are wrapped.

## Non-goals
No redesign proposals, no theming changes, and no navigation restructuring beyond what already ships.

## Current Status (as implemented)
- Root layout: [src/app/layout.tsx](src/app/layout.tsx) wraps all pages with `Web3Providers` and [components/layout/AppShell.tsx](src/components/layout/AppShell.tsx).
- Shell frame: AppShell renders background, grid frame, Sidebar (desktop), TopBar, main content, and footer status bar with [components/layout/FooterStatus.tsx](src/components/layout/FooterStatus.tsx).
- Navigation source: Sidebar consumes [components/layout/NavItems.ts](src/components/layout/NavItems.ts) for module links (Home, Produce, Portfolio, Deploy, Markets) and highlights active route.
- Structure: Main column hosts page content; footer shows system status; background is provided by [components/layout/BackgroundSystem.tsx](src/components/layout/BackgroundSystem.tsx).

## Next Step
Keep any shell adjustments minimal and path-referenced; if altering layout or navigation, align with NavItems and avoid changing module URLs without updating routing docs.
