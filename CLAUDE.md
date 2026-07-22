# CLAUDE.md

<!-- synced: 2026-07-04 -->

Behavioral guidelines to reduce common LLM coding mistakes, plus default project conventions for repos under this directory. A repo's own CLAUDE.md overrides these as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# Project conventions

Default conventions for all repos under this directory unless a repo's own CLAUDE.md overrides them.

## Git workflow
- Small/casual repos: commit directly to main; each commit should build and pass tests.
- Larger repos: feature branches off main, PR before merge (even solo), squash-merge to keep main linear.
- Conventional commit prefixes (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
- Tag releases (`vX.Y.Z`) once a repo has real users/consumers.

## Commit & PR hygiene
- One logical change per commit — no bundling fix + reformat + feature.
- Commit message body explains *why*, not what (the diff already shows what).
- Never commit secrets; gitignore `.env`/local config upfront.
- PR description: what + why, plus a manual test checklist if there's no automated coverage yet.

## Code style & structure
- One linter/formatter per language, automated via pre-commit hook or CI:
  - JS/TS: ESLint + Prettier
  - Python: ruff (lint + format)
  - C#: `dotnet format` + `.editorconfig`
- Naming conventions follow each language's own idiom, not one style forced everywhere.
- No premature abstraction — duplicate 2-3 times before extracting a helper.
- Keep functions/files small and single-purpose.

## Documentation
- Every repo: README with what it does, how to run/build/test it.
- CLAUDE.md documents non-obvious project conventions only, not a restatement of the code.
- Comments only for non-obvious *why*; delete stale docs rather than let them drift.

## Testing
- Tests at minimum for non-trivial logic and regressions.
- Larger repos: CI runs tests + linter on every PR before merge.
- If no automated coverage yet, explicitly note manual test steps in the PR description.

## Dependency & environment hygiene
- Commit lockfiles; pin dependency versions.
- Document required runtime versions (`.nvmrc`, `global.json`, etc.).

## Security basics
- No hardcoded secrets/API keys — env vars or a secrets manager.
- Validate/sanitize input at trust boundaries.
