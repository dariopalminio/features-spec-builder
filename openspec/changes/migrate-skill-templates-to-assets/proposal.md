## Why

The current `templates/` folder name inside skills diverges from the canonical Agent Skills convention, where static resources are expected under `assets/`. This reduces interoperability with out-of-the-box tooling (validators, context optimizations, and ecosystem automation) and creates avoidable friction for multi-client usage.

## What Changes

- Rename skill-local resource directories from `templates/` to `assets/` across active skills.
- Update all relative and absolute path references in `SKILL.md`, agents, scripts, and documentation that currently point to `templates/` under skill directories.
- Preserve functional parity by keeping file contents and template semantics unchanged, only migrating location and references.
- Add migration acceptance criteria to ensure OpenSpec and community tooling recognize the standardized structure.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `skill-template-autonomy`: Update requirements so each skill stores templates/resources in `assets/` and all references use `assets/<file>` (or `{{SKILL_ROOT}}/assets/<file>` when explicit root is needed).

## Impact

- Affected code and docs:
  - `.claude/skills/**/SKILL.md`
  - `.claude/skills/**/templates/` directories (renamed to `assets/`)
  - Mirrored skill copies in `.agents/skills/` and `.github/skills/` where applicable
  - OpenSpec specs and change artifacts that describe skill template location
- Tooling impact:
  - Better compatibility with ecosystem validators and standard skill loaders that recognize `assets/`.
- No API/runtime behavior changes expected; this is a structural standardization and reference migration.
