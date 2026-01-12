# Task Template

Use this template for general-purpose agent tasks. Copy the XML block below and fill in placeholders.

---

## Prompt Template (copy this)

```xml
<role>code-executor|code-reviewer|docs-maintainer|system-designer</role>

<task>
  <title>[Brief task name, 3-7 words]</title>
  <scope>[Specific module, file, or area affected]</scope>
</task>

<context>
  <current_state>
    [What exists now? What's the problem or gap?]
  </current_state>
  <goal>
    [What should exist after this task? What behavior changes?]
  </goal>
  <related_files>
    [List relevant files, folders, or docs to review]
  </related_files>
</context>

<constraints>
  <must_follow>
    - Follow all rules in /docs/agents/rules/
    - Read /AGENTS.md for setup and validation commands
    - Keep diff small and focused (one feature/fix)
    - No changes to prohibited areas (AppShell, Sidebar, registry, workspace state) unless explicit
  </must_follow>
  <additional>
    [Any task-specific constraints: dependency limits, no external APIs, etc.]
  </additional>
</constraints>

<workflow>
  <steps>
    1. [Step 1: e.g., Read existing adapter pattern in src/lib/...]
    2. [Step 2: e.g., Create new adapter following 3-layer pattern]
    3. [Step 3: e.g., Wire into UI component]
    4. [Step 4: Validate (lint, typecheck, build)]
  </steps>
</workflow>

<acceptance>
  <validation>
    - npm run lint (zero errors/warnings)
    - npm run typecheck (zero errors)
    - npm run build (success)
  </validation>
  <behavior>
    [What should work? What should be visible/testable?]
  </behavior>
  <deliverables>
    [What files created/modified? What commit message?]
  </deliverables>
</acceptance>

<output>
  <format>
    [Code changes + brief summary of what was done]
  </format>
  <deferred>
    [Optional: what's out of scope for this task?]
  </deferred>
</output>
```

---

## Example Usage

```xml
<role>code-executor</role>

<task>
  <title>Add block explorer link to Portfolio Activity</title>
  <scope>Portfolio module: Activity panel</scope>
</task>

<context>
  <current_state>
    Activity panel shows placeholder text "Activity explorer coming soon"
  </current_state>
  <goal>
    Show clickable block explorer link when wallet connected and activity exists
  </goal>
  <related_files>
    src/app/portfolio/activity/page.tsx
    src/lib/activity/ (if exists)
    docs/agents/rules/040-readonly-data-patterns.md
  </related_files>
</context>

<constraints>
  <must_follow>
    - Follow all rules in /docs/agents/rules/
    - Read /AGENTS.md for setup and validation commands
    - Keep diff small and focused (one feature/fix)
    - No changes to prohibited areas (AppShell, Sidebar, registry, workspace state) unless explicit
  </must_follow>
  <additional>
    - Read-only only (no transaction signing)
    - Use existing block explorer from ecosystem registry
    - Show honest empty state if no activity
  </additional>
</constraints>

<workflow>
  <steps>
    1. Read existing pattern in src/lib/ for explorer links
    2. Create adapter function that builds explorer URL for address
    3. Create hook that wraps adapter with wallet state
    4. Update ActivityPanel.tsx to render link when address exists
    5. Validate (lint, typecheck, build)
  </steps>
</workflow>

<acceptance>
  <validation>
    - npm run lint (zero errors/warnings)
    - npm run typecheck (zero errors)
    - npm run build (success)
  </validation>
  <behavior>
    - When wallet disconnected: show RequirementGate or empty state
    - When wallet connected: show "View on [Explorer]" link
    - Link opens in new tab to correct explorer
  </behavior>
  <deliverables>
    - src/lib/activity/links.ts (new adapter)
    - src/hooks/useActivityExplorerLink.ts (new hook)
    - src/app/portfolio/activity/page.tsx (updated)
    - Commit: "Portfolio: add activity explorer link"
  </deliverables>
</acceptance>

<output>
  <format>
    Code changes + brief summary of what was done
  </format>
  <deferred>
    None (task is scoped to read-only link only)
  </deferred>
</output>
```
