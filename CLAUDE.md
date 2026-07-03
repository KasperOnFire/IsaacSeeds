# Development practices

These are default conventions for all repos under this directory unless a repo's own CLAUDE.md overrides them.

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
