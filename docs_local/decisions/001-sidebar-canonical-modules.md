# 001-sidebar-canonical-modules
- Date: 2026-01
- Decision: Sidebar and AppShell must expose only the canonical modules Home, Produce, Portfolio, Deploy, Markets via NavItems.
- Context: Navigation is driven by [src/components/layout/NavItems.ts](src/components/layout/NavItems.ts); keeping a stable set avoids IA drift and mismatched routes.
- Consequences: New top-level modules require an explicit decision; Sidebar and NavItems must be updated together with any route changes.
