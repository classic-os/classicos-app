# Refactor Template

Use this template for code refactoring (no behavior change). Copy the XML block below and fill in placeholders.

---

## Prompt Template (copy this)

```xml
<task>
  <title>[Brief refactor description, 3-7 words]</title>
  <scope>[File, module, or pattern being refactored]</scope>
  <type>[extract | rename | reorganize | deduplicate | simplify]</type>
</task>

<context>
  <current_state>
    [What's the current structure? Why is it suboptimal?]
  </current_state>
  <goal>
    [What's the improved structure? Why is it better?]
  </goal>
  <invariants>
    [What must NOT change? (behavior, public APIs, exports)]
  </invariants>
  <related_files>
    [List files to refactor or that depend on refactored code]
  </related_files>
</context>

<constraints>
  <must_follow>
    - Follow all rules in /docs/agents/rules/
    - Read /AGENTS.md for setup and validation commands
    - NO behavior changes (refactor only)
    - Keep diff reviewable (max 200 lines changed)
    - Preserve all tests (if they exist)
  </must_follow>
  <additional>
    [Any refactor-specific constraints: no new dependencies, preserve imports, etc.]
  </additional>
</constraints>

<workflow>
  <steps>
    1. [Step 1: e.g., Read current implementation]
    2. [Step 2: e.g., Extract duplicated logic into shared function]
    3. [Step 3: e.g., Update call sites to use new function]
    4. [Step 4: Validate behavior unchanged (lint, typecheck, build)]
    5. [Step 5: Verify no regressions]
  </steps>
</workflow>

<acceptance>
  <validation>
    - npm run lint (zero errors/warnings)
    - npm run typecheck (zero errors)
    - npm run build (success)
  </validation>
  <behavior>
    [Identical behavior before and after; no user-facing changes]
  </behavior>
  <code_quality>
    [What improved? Less duplication, clearer structure, etc.]
  </code_quality>
  <deliverables>
    [What files changed? What commit message?]
  </deliverables>
</acceptance>

<output>
  <format>
    Code changes + explanation of refactor rationale
  </format>
  <deferred>
    [Optional: related refactors deferred to later]
  </deferred>
</output>
```

---

## Example Usage

```xml
<task>
  <title>Extract common chain validation logic</title>
  <scope>src/lib/chains/utils.ts and callers</scope>
  <type>extract</type>
</task>

<context>
  <current_state>
    Chain ID validation is duplicated in 5 different hooks:
    - useBalance checks if (chainId !== 61 && chainId !== 63)
    - useTransactions checks if (chainId !== 61 && chainId !== 63)
    - (3 more similar checks)
  </current_state>
  <goal>
    Extract into single utility: isEthereumClassicChain(chainId: number): boolean
    All hooks call the utility instead of duplicating logic
  </goal>
  <invariants>
    - All hooks must still validate chain IDs correctly
    - No behavior change (same validation, cleaner code)
    - All existing imports still work
  </invariants>
  <related_files>
    src/lib/chains/utils.ts
    src/hooks/useBalance.ts
    src/hooks/useTransactions.ts
    (and 3 more hooks)
  </related_files>
</context>

<constraints>
  <must_follow>
    - Follow all rules in /docs/agents/rules/
    - Read /AGENTS.md for setup and validation commands
    - NO behavior changes (refactor only)
    - Keep diff reviewable (max 200 lines changed)
    - Preserve all tests (if they exist)
  </must_follow>
  <additional>
    - No new dependencies
    - Preserve exact validation logic (61 and 63 are valid)
    - Update all call sites atomically (no partial refactor)
  </additional>
</constraints>

<workflow>
  <steps>
    1. Read all 5 hooks to confirm validation logic is identical
    2. Create isEthereumClassicChain() in src/lib/chains/utils.ts
    3. Update all 5 hooks to import and call the utility
    4. Validate (lint, typecheck, build)
    5. Verify no behavior change (same validation results)
  </steps>
</workflow>

<acceptance>
  <validation>
    - npm run lint (zero errors/warnings)
    - npm run typecheck (zero errors)
    - npm run build (success)
  </validation>
  <behavior>
    All hooks validate chain IDs identically to before
    No user-facing changes
  </behavior>
  <code_quality>
    - Reduced duplication (5 copies → 1 function)
    - Easier to update validation logic in future
    - Clearer intent (named function vs inline check)
  </code_quality>
  <deliverables>
    - src/lib/chains/utils.ts (add isEthereumClassicChain)
    - src/hooks/useBalance.ts (updated)
    - src/hooks/useTransactions.ts (updated)
    - (3 more hooks updated)
    - Commit: "Refactor: extract chain validation to shared utility"
  </deliverables>
</acceptance>

<output>
  <format>
    Code changes + explanation: "Extracted duplicated chain ID validation into isEthereumClassicChain() utility. No behavior change."
  </format>
  <deferred>
    None
  </deferred>
</output>
```
