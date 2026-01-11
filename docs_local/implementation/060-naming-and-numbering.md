# Naming and Numbering Conventions

## Purpose
Establish a single, stable convention for naming docs_local files, folders, decisions, and commit messages so the repo remains organized and discoverable as work evolves.

## Scope
- File paths and filenames under `docs_local/` and `agents/`
- Folder structure and taxonomy
- Decision document naming
- Commit message prefixes
- Does NOT cover code identifiers (see agents/010-naming-and-prose.md for prose/code naming rules)

## Folder Taxonomy (docs_local/*)

```
docs_local/
├── README.md
├── architecture/        # System design, AppShell, routing, state patterns
├── decisions/          # Decision log (decision records)
├── handoff/           # Roadmap overview, milestones, user journeys (high-level)
├── implementation/    # Internal conventions, dev guidance, testing patterns
├── modules/           # Per-module documentation (Home, Portfolio, Produce, Deploy, Markets)
│   ├── portfolio/
│   ├── markets/
│   ├── produce/
│   ├── deploy/
│   └── home/
├── product/          # Product-level context (no redesign; linked to roadmap)
└── README.md
```

## File Numbering Rules

### Increment Pattern: 000, 010, 020, 030, etc.
- Use 10-unit increments to allow insertion of intermediate docs without renumbering.

### Meaning of 000
- **000-** prefix: Foundational intent, scope, or overview for that folder.
- Example: `docs_local/modules/portfolio/000-intent.md` explains what Portfolio is for.
- **One per folder.** If a folder has 000, do not duplicate at another level.

### When to Add 010, 020, 030
- **010:** First implementation-level doc (current state, shells, patterns in use).
- **020:** First plan or proposed change (e.g., phase plans, adapter design).
- **030+:** Subsequent plans, addenda, or specialized variants (e.g., Activity deep-dive plan).
- **Rule:** If docs for a module exceed 5, consider splitting into subfolders rather than long chains beyond 060.

## Filename Rules

### Format: `NNN-kebab-case-description.md`
- Lowercase, hyphens only (no underscores, no spaces).
- Lead with 3-digit number (000, 010, 020, etc.).
- Descriptive, short (2–5 words after number).
- **Examples:** `030-portfolio-activity-explorer-first.md`, `020-deploy-bridge-capital-routing.md`

### Capability / Milestone Names (NO "phase-*")
- Filenames describe **what** (Portfolio read-only, Markets adapter, Miner bridge), not **when** (Phase 6/7/8).
- Use adjectives to clarify scope: `-readonly`, `-explorer-first`, `-etcswap-adapter`.
- **Bad:** `020-phase-7-bridge-notes.md`
- **Good:** `020-deploy-bridge-capital-routing.md`

### Avoid Version Tags in Filenames
- Unless major revisions are expected (e.g., `-v1`, `-v2`), leave versions out of filenames.
- Use document titles or section headers for version clarity: "Portfolio Activity (v0)", "Portfolio Activity (v1)".

## Document Title Rules

### H1 Titles May Include Scope Tags
- Use "(v0)", "(Planning)", "(Implemented)" in **titles** for clarity.
- Example: `# Portfolio Activity — Explorer-First Navigation (Planning)`
- **Do not** put these in filenames; they clutter paths.

### Always Use "Classic OS" in Prose
- Not "ClassicOS" or "classicos" (reserved for code/paths).
- All titles, sections, and narrative text use the space: "Classic OS".

## Decision Doc Rules

### Format: `docs_local/decisions/###-short-kebab-slug.md`
- Example: `002-shell-first-then-utility.md`, `003-portfolio-before-markets-before-mining.md`
- Numbers: Start at 001, increment by 1 (no gaps unless intentional).
- Slug: 2–3 words, core decision statement in kebab-case.

### Frontmatter (Lightweight)
```markdown
# NNN-decision-name
- Date: YYYY-MM
- Decision: One-sentence decision statement
- Context: Why this was chosen
- Consequences: What it unlocks or blocks
```

### Keep Decision Statements Stable
- Once a decision is recorded, do not rename unless the decision changes.
- If context updates, add a follow-up decision with a new number.

## Module Doc Rules

### Folder per Module
```
docs_local/modules/<module>/
├── 000-intent.md              # What this module is for
├── 010-shell-and-l2-routes.md # Current implementation status
├── 020-<capability>-plan.md    # Phase/capability plans, adapters
├── 030-<detail>-*.md           # Specialized deep dives if needed
└── README.md                   # (Optional) folder index
```

### Canonical Filenames (Recommended)
- **000-intent.md:** Module purpose, user journey, non-goals.
- **010-shell-and-l2-routes.md:** Current page structure, routing, empty states.
- **020-<plan>.md:** First substantive plan (e.g., `020-portfolio-readonly-plan.md`).
- Subsequent plans start at 030: `030-portfolio-activity-explorer-first.md`, etc.

## Commit Message Conventions

### Format
```
<scope>: <description>

[optional body for context/links]
```

### Scope Prefixes (Recommended)
- **Docs:** Changes to docs_local/
- **Agents:** Changes to agents/
- **Portfolio:** / **Markets:** / **Produce:** / **Deploy:** / **Home:** — code changes to specific modules
- **Build:** / **Tooling:** — config, eslint, tsconfig, package.json, etc.
- **Refactor:** — code reorganization without behavior change

### Examples
```
Docs: normalize naming system for docs_local and modules

- Remove "phase-*" from filenames
- Add 060-naming-and-numbering.md
- Update decisions/003 with milestone language
```

```
Portfolio: add activity explorer link (Phase 6 v0)

- Create src/lib/activity/links.ts adapter
- Create src/hooks/useActivityExplorerLink.ts hook
- Update ActivityPanel.tsx to render explorer link
- Requires: ecosystem.capabilities.portfolio = true
```

```
Agents: add agentic workflow guidance and defaults

- Create agents/090-agentic-workflow.md
- Document Phase A/B planning and implementation
```

## Verification Commands

### Check for Phase-Named Files (Should Be Empty)
```bash
find docs_local agents -name "*phase-*" -type f
```
Expected: No output (zero files matched).

### Check for Deviations from Naming Convention
```bash
# Files not matching NNN-kebab-case pattern
find docs_local -name "*.md" ! -regex ".*[0-9][0-9][0-9]-[a-z].*\.md"
```

### Verify "Classic OS" Usage in Docs
```bash
# Should show only code examples, not prose
rg -n "ClassicOS\b" docs_local
rg -n "classicos\b" docs_local
```

### Check File Structure Alignment
```bash
# Verify no surprises in folder depth or structure
tree -L 2 docs_local
```

### Stage & Verify Diffs
```bash
git diff --stat
git diff --stat --cached
```

## When to Update This Document

- If a new folder is added to `docs_local/`, document its intent here.
- If numbering patterns evolve (e.g., moving beyond 090 in agents/), update the rules.
- If new decision patterns emerge, add them and consider a new decision (docs_local/decisions/).
- Run `rg` and `find` verification commands after large refactors.
