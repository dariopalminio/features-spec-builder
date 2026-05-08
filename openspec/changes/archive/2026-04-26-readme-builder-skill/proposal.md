<!-- Referencias -->
[[FEAT-042-readme-builder]]

## Why

Developers using SDDF invest effort producing spec artifacts (project-intent.md, requirement-spec.md, project-plan.md) but still have to write README.md manually, duplicating work and risking drift between docs and code. A `readme-builder` skill closes this gap by generating a ready-to-publish README.md from whatever artifacts are available, making documentation a zero-effort byproduct of spec-driven development.

## What Changes

- **New skill** `.claude/skills/readme-builder/` — invoked via `/readme-builder` to generate a README.md in the project root.
- **New template** `.claude/skills/readme-builder/templates/readme-template.md` — copied from `$SPECS_BASE/specs/templates/readme-template.md`; acts as the sole structural source-of-truth for generated READMEs.
- Skill orchestrates: (1) artifact discovery, (2) template extraction, (3) content generation, (4) write guard (existing README detection + user confirmation), (5) output to `README.md` at project root.
- No breaking changes to existing skills or specs.

## Capabilities

### New Capabilities

- `readme-builder`: Skill that discovers available project artifacts, reads a Markdown template at runtime, fills each section with extracted content, and writes README.md — offering user confirmation when a README already exists and falling back to reverse-engineering when no formal artifacts are found.

### Modified Capabilities

<!-- none -->

## Impact

- New directory `.claude/skills/readme-builder/` with `SKILL.md` and `templates/readme-template.md`.
- Reads (never writes): `$SPECS_BASE/specs/projects/project-intent.md`, `requirement-spec.md`, `project-plan.md`, `AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`. Never write a file other than the README file to be generated.
- Writes: `README.md` in project root (with user confirmation if file exists).
- No dependency on external packages; pure Markdown + Claude Code skill model.
