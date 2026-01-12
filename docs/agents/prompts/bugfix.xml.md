# Bug Fix Template

Use this template for fixing bugs. Copy the XML block below and fill in placeholders.

---

## Prompt Template (copy this)

```xml
<task>
  <title>[Brief bug description, 3-7 words]</title>
  <scope>[File or module where bug occurs]</scope>
  <severity>[low | medium | high | critical]</severity>
</task>

<context>
  <bug_description>
    [What's broken? What's the incorrect behavior?]
  </bug_description>
  <reproduction>
    [How to reproduce the bug? Steps, conditions, screenshots]
  </reproduction>
  <expected_behavior>
    [What should happen instead?]
  </expected_behavior>
  <related_files>
    [List files that may be involved or need review]
  </related_files>
</context>

<constraints>
  <must_follow>
    - Follow all rules in /docs/agents/rules/
    - Read /AGENTS.md for setup and validation commands
    - Fix ONLY the bug (no scope creep, no refactoring)
    - Preserve existing behavior except for the bug
  </must_follow>
  <additional>
    [Any bug-specific constraints: backward compatibility, no dependency changes, etc.]
  </additional>
</constraints>

<workflow>
  <steps>
    1. [Step 1: e.g., Read current implementation in file.tsx]
    2. [Step 2: e.g., Identify root cause (type mismatch, missing check, etc.)]
    3. [Step 3: e.g., Apply minimal fix]
    4. [Step 4: Validate (lint, typecheck, build)]
    5. [Step 5: Verify fix resolves reproduction case]
  </steps>
</workflow>

<acceptance>
  <validation>
    - npm run lint (zero errors/warnings)
    - npm run typecheck (zero errors)
    - npm run build (success)
  </validation>
  <behavior>
    [Bug no longer occurs; expected behavior restored]
  </behavior>
  <regression>
    [Confirm no other features broken by the fix]
  </regression>
  <deliverables>
    [What files changed? What commit message?]
  </deliverables>
</acceptance>

<output>
  <format>
    Code changes + explanation of root cause + how fix works
  </format>
  <deferred>
    [Optional: related issues not fixed in this task]
  </deferred>
</output>
```

---

## Example Usage

```xml
<task>
  <title>Fix BigInt literal error in transaction parser</title>
  <scope>src/lib/transactions/parser.ts</scope>
  <severity>high</severity>
</task>

<context>
  <bug_description>
    Build fails with "BigInt literals are not available when targeting lower than ES2020"
    Error occurs in parser.ts line 42: `const gas = 21000n;`
  </bug_description>
  <reproduction>
    1. Run `npm run build`
    2. See TypeScript error in parser.ts
  </reproduction>
  <expected_behavior>
    Build should succeed. BigInt values should use constructor: `BigInt(21000)`
  </expected_behavior>
  <related_files>
    src/lib/transactions/parser.ts
    tsconfig.json (confirms target: ES2017)
    docs/agents/rules/020-tooling-and-typescript.md (BigInt constraint)
  </related_files>
</context>

<constraints>
  <must_follow>
    - Follow all rules in /docs/agents/rules/
    - Read /AGENTS.md for setup and validation commands
    - Fix ONLY the bug (no scope creep, no refactoring)
    - Preserve existing behavior except for the bug
  </must_follow>
  <additional>
    - Do NOT change tsconfig.json target (ES2017 is intentional)
    - Replace all BigInt literals with BigInt() constructor
    - No other parser changes
  </additional>
</constraints>

<workflow>
  <steps>
    1. Read parser.ts and identify all BigInt literals (21000n, 0n, etc.)
    2. Replace each literal with BigInt() constructor
    3. Validate (lint, typecheck, build)
    4. Verify parser logic unchanged (values remain correct)
  </steps>
</workflow>

<acceptance>
  <validation>
    - npm run lint (zero errors/warnings)
    - npm run typecheck (zero errors)
    - npm run build (success)
  </validation>
  <behavior>
    Parser produces same output; no behavior change
  </behavior>
  <regression>
    No other modules affected; parser tests pass (if they exist)
  </regression>
  <deliverables>
    - src/lib/transactions/parser.ts (updated)
    - Commit: "Build: fix BigInt literals in transaction parser"
  </deliverables>
</acceptance>

<output>
  <format>
    Code changes + explanation: "Replaced BigInt literals with BigInt() constructor per ES2017 target"
  </format>
  <deferred>
    None
  </deferred>
</output>
```
