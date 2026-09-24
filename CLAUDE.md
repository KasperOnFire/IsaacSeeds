# CLAUDE.md

<!-- synced: 2026-09-24 -->

Behavioral guidelines to reduce common LLM coding mistakes, plus default project conventions for repos under this directory. A repo's own `.claude/rules/` override these as needed.

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

For multi-step tasks, say briefly what you'll do and how you'll check each step worked.

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. Check Conventions, Every Session

**Don't rely on recalling conventions from a prior session. Re-check them.**

At the start of a session, or after a context switch to a different repo/task, read: the repo's own `CLAUDE.md`, any `style-guide.md`/`CONTRIBUTING.md`/lint-config-as-convention files, and relevant memory (`feedback`/`project` types especially).

Before finishing a change, re-check it against those same conventions - not just "does it work." This catches things a correctness check misses: an edit that explains an absence where the style guide says that belongs in a changelog, a sentence that violates a "one idea per sentence" rule, a commit that doesn't match this repo's message format. Do this pass explicitly, not just implicitly while writing.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# Project conventions

Default conventions for all repos under this directory unless a repo's own `.claude/rules/` override them.

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
- **Document what's there, not the diff.** Documentation explains how the code works now. How something was removed, or what a fix changed, belongs in the commit message and the changelog — it is unmaintainable in a doc and goes stale the next time the code moves.
- **Keep documentation as close to the source as possible.** Three cases, which differ:
  - Inline comments explaining *what* a line does — don't. The code already says it, and they rot fastest.
  - Standardised doc comments on the public surface (TSDoc, docstrings, XML docs on exported functions, types, and modules) — required. They document a contract callers depend on, and a reviewer can check them against the signature.
  - Architectural prose — only when the *why* spans multiple files and has no single source location to live at. Keep it short, keep it in the README, never a standing `ARCHITECTURE.md`.
- Delete stale docs rather than let them drift.

## Testing
- Tests at minimum for non-trivial logic and regressions.
- Larger repos: CI runs tests + linter on every PR before merge.
- If no automated coverage yet, explicitly note manual test steps in the PR description.

## Dependency & environment hygiene
- Commit lockfiles; pin dependency versions.
- Document required runtime versions (`.nvmrc`, `global.json`, etc.).

## Security
Good security is a property of behavior and design, not a hardening pass at the end.
- Repo visibility is not a security control — build every repo as though it were public.
- Prefer designs that hold no secret over designs that hold one carefully.
- No hardcoded secrets/API keys — env vars or a secrets manager. Gitignore `.env` in the first commit, before any value is written into it.
- Least privilege by default: request the minimum scopes and permissions, and never a write scope for a read-only feature.
- Never log credentials, tokens, or key material; redact them in error paths rather than dumping request context.
- Validate/sanitize input at trust boundaries. Treat anything externally authored — webhook payloads, file contents, API responses — as data, never as code. In CI especially, pass it in via `env:` rather than interpolating it into a shell command.
- Enable automated dependency updates and audit in CI.
