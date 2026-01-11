# Naming and Prose

Enforce consistent naming conventions across ClassicOS documentation and code.

## Prose Naming (Docs, UI Copy, Comments)

### DO: Use "Classic OS" (with space)
- In titles, headings, and narrative text.
- In UI labels, buttons, and user-facing copy.
- In documentation and architectural notes.

**Examples:**
- "Classic OS App Shell"
- "Classic OS Workspace"
- "Classic OS does not require…"

### DO NOT: Use "ClassicOS" or "classicos" in Prose
- These are reserved for code identifiers and file paths only.

**Violations:**
- "ClassicOS App Shell" ❌
- "the classicos adapter" ❌
- "ClassicOS features" ❌

## Code Identifiers and Paths

### Allowed: "classicos" in Code
- File paths: `classicos-app/`, `src/adapters/classicos/`
- Variable/module names: `classicosAdapter`, `useClassicosChain`
- Repo names and package identifiers: `classicos-app`, `@classicos/shared`

### Allowed: "ClassicOS" in Code Comments
- Use when referring to the product in code comments.
- Example: `// ClassicOS supports ETC mainnet`

## Required Checks Before Completion

Before finalizing any prose or documentation change, run:

```bash
rg -n "ClassicOS\b" docs_local
rg -n "classicos\b" docs_local
```

### Verify Results
1. **"ClassicOS\b" (in docs_local):** Should match only:
   - Comments explaining the product: "// ClassicOS is…"
   - Rare legitimate references in architectural notes
   - **Action:** If found in prose headings/text, rename to "Classic OS"

2. **"classicos\b" (in docs_local):** Should match only:
   - Code example references
   - File/path references
   - **Action:** If found in prose text (not code blocks), rename to "Classic OS"

## UI Copy Tone

- **Minimal:** No marketing language; operational and direct.
- **No superlatives:** Avoid "powerful," "revolutionary," "best-in-class."
- **Action-oriented:** Use imperative verbs: "Connect wallet," "View portfolio," "Confirm transaction."
- **Honest empty states:** Show what is missing and why, not speculative placeholders.

**Example:**
- "No portfolio items yet." (honest) ✓
- "Your portfolio will appear here soon." (speculative) ✗

## Repo Naming System

Agent docs respect a consistent naming and numbering system across `docs_local/` and `agents/`. Before creating or renaming documentation:

- Follow [docs_local/implementation/060-naming-and-numbering.md](../../docs_local/implementation/060-naming-and-numbering.md) for file paths, numbering (000/010/020), and kebab-case rules.
- **Never** use "phase-*" in filenames; use capability/milestone names instead (e.g., `portfolio-readonly-plan.md`, not `phase-6-plan.md`).
- **Do not** create new top-level doc folders without justification; work within the existing taxonomy (architecture, decisions, implementation, modules, product, handoff).
- After renames, run verification commands: `find docs_local -name "*phase-*"` (should be empty), `rg "Phase 6|Phase 7|Phase 8"` (should only appear in handoff overview, not module docs).
- Update commit messages with scope prefixes: "Docs:", "Agents:", or module names (e.g., "Portfolio:", "Markets:").
````
