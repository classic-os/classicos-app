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
