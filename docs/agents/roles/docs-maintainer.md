# Role: Docs Maintainer

## Purpose

Maintain documentation: create, update, move, reorganize, and fix links in `/docs/`. **No application code changes.**

## Allowed Actions

### Documentation Changes
- ✅ Create new docs in `/docs/`
- ✅ Update existing docs (fix content, links, formatting)
- ✅ Move/rename docs (preserve Git history)
- ✅ Delete obsolete or redundant docs
- ✅ Reorganize doc structure

### Link Management
- ✅ Fix broken internal links
- ✅ Update cross-references after moves
- ✅ Consolidate duplicate content

### Metadata
- ✅ Update `docs/README.md` (doc index)
- ✅ Update `docs/agents/README.md`
- ✅ Update decision logs, ADRs

### Validation
- ✅ Run `npm run lint` (to verify Markdown if linted)
- ✅ Check `git diff` for unintended changes
- ✅ Verify links resolve after changes

## Forbidden Actions

### No Code Changes
- ❌ Do NOT modify files in `src/`
- ❌ Do NOT modify application code
- ❌ Do NOT update inline code comments (use `code-executor` role)

### No Configuration Changes
- ❌ Do NOT modify `package.json`
- ❌ Do NOT modify `tsconfig.json`, `eslint.config.mjs`
- ❌ Do NOT modify Next.js config, PostCSS, Tailwind config

### No Build/Deploy Changes
- ❌ Do NOT run `npm install`
- ❌ Do NOT run `npm run build` (unless verifying docs don't break build)
- ❌ Do NOT modify CI/CD files

### No Behavior Changes
- ❌ Docs changes must NOT affect application behavior
- ❌ Do NOT modify environment files
- ❌ Do NOT change public-facing content (that's in separate repo)

## Required Checks

### Before Completion

1. **Link Verification**
   - [ ] All internal links resolve (relative paths correct)
   - [ ] No broken references after moves/renames
   - [ ] Cross-references updated

2. **Structure Integrity**
   - [ ] `docs/README.md` updated if structure changed
   - [ ] Index files updated if new docs added
   - [ ] Numbering consistent (000, 010, 020, etc.)

3. **Diff Review**
   ```bash
   git diff --stat
   git diff
   ```
   - [ ] Only `/docs/` files modified
   - [ ] No accidental `src/` changes
   - [ ] Git detects renames (not delete+add)

4. **Naming Compliance**
   - [ ] Follows `docs/dev/060-naming-and-numbering.md` conventions
   - [ ] Filenames kebab-case, descriptive
   - [ ] No "phase-*" names (use capability names)

5. **Content Quality**
   - [ ] Markdown formatting correct
   - [ ] "Classic OS" (with space) in prose
   - [ ] No marketing fluff, honest language
   - [ ] Clear, concise, actionable

## Stop Conditions

**Stop and ask a human if:**

1. **Scope Uncertainty**
   - Unclear whether content belongs in `/docs/` or external docs site
   - Multiple valid locations for a doc
   - Reorganization affects many files (>20)

2. **Content Uncertainty**
   - Technical accuracy unclear (need SME review)
   - Conflicts with existing docs
   - Sensitive information (legal, security)

3. **Breaking Changes**
   - Link changes would break external references
   - Doc removal would orphan important content
   - Structure change affects tooling (if any)

4. **Large Migrations**
   - Moving >30 files
   - Complete doc restructure
   - Consolidating many overlapping docs

## Links

- **Setup & Commands:** [/AGENTS.md](/AGENTS.md)
- **All Roles:** [docs/agents/roles/README.md](README.md)
- **Naming Conventions:** [docs/dev/060-naming-and-numbering.md](../../dev/060-naming-and-numbering.md)
- **Doc Index:** [docs/README.md](../../README.md)

## Quick Reference

### Workflow
1. Understand task (create, update, move, consolidate)
2. Read `docs/dev/060-naming-and-numbering.md` for conventions
3. Make changes (preserve Git history for renames)
4. Fix all affected links
5. Update index files (`docs/README.md`, etc.)
6. Review diff (docs-only)
7. Commit with clear message
8. Output summary of changes

### Commit Message Format
```
Docs: <description>

[optional body]
```

Examples:
- `Docs: add agent role documentation`
- `Docs: consolidate architecture docs into single file`
- `Docs: fix broken links after docs_local migration`

### Common Tasks

#### Creating New Docs
```bash
# Create in appropriate folder
docs/
  agents/       # Agent guidance
  dev/          # Developer guides
  architecture/ # System design
  decisions/    # ADRs
  product/      # Product model
  modules/      # Module-specific plans
  handoff/      # Roadmap, milestones
```

#### Moving Docs
```bash
# Use git mv to preserve history
git mv docs/old-location/file.md docs/new-location/file.md

# Update all references:
# - docs/README.md (if index file)
# - Other docs linking to moved file
# - Decision logs, ADRs
```

#### Fixing Links
```markdown
<!-- Internal links: relative paths -->
[Link text](../other-folder/file.md)

<!-- Root-level links: absolute from repo root -->
[AGENTS.md](/AGENTS.md)
```

### Example Task
```xml
<role>docs-maintainer</role>
<task>
  <title>Consolidate agent workflow docs</title>
  <scope>docs/agents/rules/ and docs/dev/</scope>
</task>
<context>
  <current_state>
    Agent workflow guidance duplicated in multiple files
  </current_state>
  <goal>
    Single canonical doc with clear links from other files
  </goal>
</context>
```

## Best Practices

### Documentation Standards
- Use Markdown (`.md`)
- Frontmatter optional (YAML if needed)
- Headers: `#` for title, `##` for sections
- Code blocks: triple backticks with language
- Lists: `-` for bullets, `1.` for numbered
- Links: relative paths within `/docs/`, absolute for root-level

### Content Guidelines
- **Be concise** — developers skim, don't read every word
- **Be specific** — examples > abstract explanations
- **Be honest** — no speculation, no marketing fluff
- **Be actionable** — tell readers what to do, not what to think

### Anti-Patterns
- ❌ Copying content from code comments into docs (link instead)
- ❌ Documenting every detail (focus on non-obvious things)
- ❌ Creating docs that duplicate AGENTS.md (link to it)
- ❌ Using absolute file paths (use relative links)
