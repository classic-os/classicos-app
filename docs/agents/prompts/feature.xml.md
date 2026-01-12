# Feature Implementation Template

Use this template for adding new features. Copy the XML block below and fill in placeholders.

---

## Prompt Template (copy this)

```xml
<role>code-executor|system-designer</role>

<task>
  <title>[Brief feature description, 3-7 words]</title>
  <scope>[Module or area where feature lives]</scope>
  <mode>[read-only | full-feature]</mode>
</task>

<context>
  <feature_description>
    [What is the feature? What does it enable users to do?]
  </feature_description>
  <user_value>
    [Why is this valuable? What problem does it solve?]
  </user_value>
  <related_files>
    [List existing files, patterns, or docs to reference]
  </related_files>
  <dependencies>
    [What must exist first? What capabilities are required?]
  </dependencies>
</context>

<constraints>
  <must_follow>
    - Follow all rules in /docs/agents/rules/
    - Read /AGENTS.md for setup and validation commands
    - Keep feature scoped to one module
    - Use existing patterns (adapter → hook → UI)
    - Default to read-only unless transaction execution is explicit goal
  </must_follow>
  <additional>
    [Any feature-specific constraints: no external APIs, use specific libraries, etc.]
  </additional>
</constraints>

<workflow>
  <steps>
    1. [Step 1: e.g., Review existing patterns in module]
    2. [Step 2: e.g., Create adapter for data fetching]
    3. [Step 3: e.g., Create hook wrapping adapter]
    4. [Step 4: e.g., Create or update UI component]
    5. [Step 5: e.g., Wire into page/parent component]
    6. [Step 6: Validate (lint, typecheck, build)]
  </steps>
</workflow>

<acceptance>
  <validation>
    - npm run lint (zero errors/warnings)
    - npm run typecheck (zero errors)
    - npm run build (success)
  </validation>
  <behavior>
    [What works now? What can users see/do?]
  </behavior>
  <states>
    [All UI states handled: disconnected, loading, error, empty, data]
  </states>
  <deliverables>
    [What files created/modified? What commit message?]
  </deliverables>
</acceptance>

<output>
  <format>
    Code changes + summary of feature implementation
  </format>
  <deferred>
    [Optional: what's out of scope? What comes in future iterations?]
  </deferred>
</output>
```

---

## Example Usage

```xml
<role>code-executor</role>

<task>
  <title>Add portfolio balance breakdown by asset</title>
  <scope>Portfolio module: Balances page</scope>
  <mode>read-only</mode>
</task>

<context>
  <feature_description>
    Show a table of token balances for the connected wallet on the current chain.
    Display token symbol, balance (formatted), and USD value (if available).
  </feature_description>
  <user_value>
    Users can see their entire portfolio at a glance without navigating to multiple explorers.
    Enables informed decisions about which assets to deploy or swap.
  </user_value>
  <related_files>
    src/app/portfolio/balances/page.tsx (currently shows placeholder)
    src/lib/balances/ (may not exist yet)
    docs/agents/rules/040-readonly-data-patterns.md (3-layer pattern)
    docs/architecture/portfolio-module.md (if exists)
  </related_files>
  <dependencies>
    - Wallet must be connected (use RequirementGate)
    - Correct chain selected (ETC mainnet or testnet)
    - Ecosystem registry provides token list
  </dependencies>
</context>

<constraints>
  <must_follow>
    - Follow all rules in /docs/agents/rules/
    - Read /AGENTS.md for setup and validation commands
    - Keep feature scoped to one module
    - Use existing patterns (adapter → hook → UI)
    - Default to read-only unless transaction execution is explicit goal
  </must_follow>
  <additional>
    - Read-only (RPC calls only, no signing)
    - No external APIs (no CoinGecko, no indexers)
    - Use viem multicall for batch balance queries
    - Show honest empty state if no tokens found
    - USD value optional (skip if not in registry)
  </additional>
</constraints>

<workflow>
  <steps>
    1. Review ecosystem registry for token list structure
    2. Create adapter: getTokenBalances(address, tokens, client) in src/lib/balances/
    3. Create hook: useTokenBalances() wrapping adapter
    4. Create component: BalanceTable.tsx (symbol, balance, USD columns)
    5. Update src/app/portfolio/balances/page.tsx to render BalanceTable
    6. Validate (lint, typecheck, build)
  </steps>
</workflow>

<acceptance>
  <validation>
    - npm run lint (zero errors/warnings)
    - npm run typecheck (zero errors)
    - npm run build (success)
  </validation>
  <behavior>
    - When wallet disconnected: show RequirementGate
    - When wallet connected + loading: show skeleton
    - When error: show error message
    - When no tokens: show "No tokens found"
    - When tokens exist: show table with symbol, balance, USD
  </behavior>
  <states>
    All UI states handled: disconnected, loading, error, empty, data
  </states>
  <deliverables>
    - src/lib/balances/adapter.ts (new)
    - src/hooks/useTokenBalances.ts (new)
    - src/components/portfolio/BalanceTable.tsx (new)
    - src/app/portfolio/balances/page.tsx (updated)
    - Commit: "Portfolio: add token balance breakdown"
  </deliverables>
</acceptance>

<output>
  <format>
    Code changes + summary: "Implemented read-only token balance table using adapter→hook→UI pattern. Supports ETC mainnet/testnet, multicall batching, honest empty states."
  </format>
  <deferred>
    - USD pricing (requires oracle or external API, out of scope)
    - Historical balance charts (future iteration)
    - Token filtering/search (not needed for v0)
  </deferred>
</output>
```
