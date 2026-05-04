## Why

The skill `ps-begin-intention` uses a `ps-` prefix that is inconsistent with the desired naming convention. Renaming it to `project-begin-intention` aligns it with a clearer, more descriptive `project-` prefix that matches the intent of the ProjectSpecFactory pipeline.

## What Changes

- Rename directory `.claude/skills/ps-begin-intention/` → `.claude/skills/project-begin-intention/`
- Rename slash command `/ps-begin-intention` → `/project-begin-intention`
- Update all internal references within `SKILL.md` and any agent/spec files that mention the old name

## Capabilities

### New Capabilities
<!-- None — this is a pure rename refactor -->

### Modified Capabilities
- `ps-begin-intention-skill`: Rename skill from `ps-begin-intention` to `project-begin-intention` — command name and directory path change.

## Impact

- `.claude/skills/ps-begin-intention/` directory (renamed)
- `.claude/skills/ps-begin-intention/SKILL.md` (internal references updated)
- `.claude/agents/product-manager.agent.md` (reference updated)
- `.claude/agents/architect.agent.md` (reference updated)
- `.claude/skills/ps-discovery/SKILL.md` (reference updated)
- `openspec/specs/ps-begin-intention-skill/spec.md` (reference updated)
- `README.md`, `gem/README.md`, `$SPECS_BASE/specs/` files (documentation references updated)
