# UI Change Template

Use this template for UI-only changes (styling, layout, copy). Copy the XML block below and fill in placeholders.

---

## Prompt Template (copy this)

```xml
<task>
  <title>[Brief UI change description, 3-7 words]</title>
  <scope>[Component or page being modified]</scope>
  <type>[styling | layout | copy | accessibility]</type>
</task>

<context>
  <current_state>
    [What does the UI look like now? What's the issue?]
  </current_state>
  <goal>
    [What should the UI look like? What's improved?]
  </goal>
  <design_reference>
    [Link to mockup, screenshot, or design doc if available]
  </design_reference>
  <related_files>
    [List components, pages, or stylesheets to modify]
  </related_files>
</context>

<constraints>
  <must_follow>
    - Follow all rules in /docs/agents/rules/
    - Read /AGENTS.md for setup and validation commands
    - Use Tailwind classes only (no inline styles, no new CSS files)
    - Preserve all functionality (UI only, no logic changes)
    - Respect naming conventions (see naming rules)
  </must_follow>
  <additional>
    [Any UI-specific constraints: mobile responsive, dark mode support, etc.]
  </additional>
</constraints>

<workflow>
  <steps>
    1. [Step 1: e.g., Read current component structure]
    2. [Step 2: e.g., Update Tailwind classes for new layout]
    3. [Step 3: e.g., Update copy text per naming rules]
    4. [Step 4: Validate (lint, typecheck, build)]
    5. [Step 5: Verify responsiveness if applicable]
  </steps>
</workflow>

<acceptance>
  <validation>
    - npm run lint (zero errors/warnings)
    - npm run typecheck (zero errors)
    - npm run build (success)
  </validation>
  <behavior>
    [All functionality unchanged; only visual/text changes]
  </behavior>
  <visual>
    [What's visually different? Layout, spacing, colors, typography]
  </visual>
  <deliverables>
    [What files changed? What commit message?]
  </deliverables>
</acceptance>

<output>
  <format>
    Code changes + before/after description of UI changes
  </format>
  <deferred>
    [Optional: related UI improvements deferred]
  </deferred>
</output>
```

---

## Example Usage

```xml
<task>
  <title>Update empty state copy in Markets module</title>
  <scope>src/app/markets/page.tsx</scope>
  <type>copy</type>
</task>

<context>
  <current_state>
    EmptyState shows: "Markets data will appear here soon"
    This is speculative marketing language (violates honest empty state rule)
  </current_state>
  <goal>
    EmptyState should show: "Market data not available"
    Truthful, no speculation, follows naming conventions
  </goal>
  <design_reference>
    See docs/agents/rules/040-readonly-data-patterns.md for honest empty state guidance
  </design_reference>
  <related_files>
    src/app/markets/page.tsx
    docs/agents/rules/010-naming-and-prose.md (naming rules)
  </related_files>
</context>

<constraints>
  <must_follow>
    - Follow all rules in /docs/agents/rules/
    - Read /AGENTS.md for setup and validation commands
    - Use Tailwind classes only (no inline styles, no new CSS files)
    - Preserve all functionality (UI only, no logic changes)
    - Respect naming conventions (see naming rules)
  </must_follow>
  <additional>
    - Copy must be truthful (no speculation, no marketing fluff)
    - Use "Classic OS" in prose (with space)
    - Keep tone neutral and factual
  </additional>
</constraints>

<workflow>
  <steps>
    1. Read src/app/markets/page.tsx
    2. Locate EmptyState component with speculative copy
    3. Replace with honest, factual text: "Market data not available"
    4. Validate (lint, typecheck, build)
    5. Verify no other copy needs updating
  </steps>
</workflow>

<acceptance>
  <validation>
    - npm run lint (zero errors/warnings)
    - npm run typecheck (zero errors)
    - npm run build (success)
  </validation>
  <behavior>
    All functionality unchanged; only text changes
  </behavior>
  <visual>
    EmptyState now shows honest message instead of speculative marketing
  </visual>
  <deliverables>
    - src/app/markets/page.tsx (updated EmptyState copy)
    - Commit: "Markets: update empty state to honest copy"
  </deliverables>
</acceptance>

<output>
  <format>
    Code changes + explanation: "Replaced speculative 'will appear soon' with factual 'not available' per honest empty state rule"
  </format>
  <deferred>
    None
  </deferred>
</output>
```

---

## Additional Examples

### Styling Example

```xml
<task>
  <title>Increase Portfolio panel spacing for readability</title>
  <scope>src/components/portfolio/BalancePanel.tsx</scope>
  <type>styling</type>
</task>

<context>
  <current_state>
    Panel items are tightly packed (py-2), hard to scan visually
  </current_state>
  <goal>
    Increase vertical spacing (py-4) for better readability
  </goal>
  <design_reference>
    None; internal UX improvement
  </design_reference>
  <related_files>
    src/components/portfolio/BalancePanel.tsx
  </related_files>
</context>

<constraints>
  <must_follow>
    - Follow all rules in /docs/agents/rules/
    - Read /AGENTS.md for setup and validation commands
    - Use Tailwind classes only (no inline styles, no new CSS files)
    - Preserve all functionality (UI only, no logic changes)
    - Respect naming conventions (see naming rules)
  </must_follow>
  <additional>
    - Ensure responsive (mobile + desktop)
    - Don't break existing layout on small screens
  </additional>
</constraints>

<workflow>
  <steps>
    1. Read BalancePanel.tsx
    2. Update py-2 → py-4 on list items
    3. Validate (lint, typecheck, build)
    4. Verify spacing looks good on mobile/desktop
  </steps>
</workflow>

<acceptance>
  <validation>
    - npm run lint (zero errors/warnings)
    - npm run typecheck (zero errors)
    - npm run build (success)
  </validation>
  <behavior>
    All functionality unchanged; only spacing changes
  </behavior>
  <visual>
    Panel items have more breathing room, easier to scan
  </visual>
  <deliverables>
    - src/components/portfolio/BalancePanel.tsx (updated spacing)
    - Commit: "Portfolio: increase panel item spacing"
  </deliverables>
</acceptance>

<output>
  <format>
    Code changes + explanation: "Increased py-2 to py-4 for better visual hierarchy"
  </format>
  <deferred>
    None
  </deferred>
</output>
```
