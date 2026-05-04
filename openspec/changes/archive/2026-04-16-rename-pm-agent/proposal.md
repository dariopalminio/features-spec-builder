## Why

The agent file `.claude/agents/product-manager.agent.md` uses a generic name (`product-manager`) that doesn't follow the `project-` prefix convention adopted for all role-based agents in this pipeline. Renaming it to `project-pm` aligns it with the naming pattern already applied to `project-architect.agent.md`.

## What Changes

- Rename `.claude/agents/product-manager.agent.md` → `.claude/agents/project-pm.agent.md`
- Update frontmatter `name: product-manager` → `name: project-pm`
- Update all skills that invoke this agent (`project-begin-intention`, `project-discovery`) to use `project-pm`
- Update `ux-designer.agent.md` if it references the PM agent by name
- Update openspec specs (`role-based-agents`) that reference `product-manager-agent`
- Update documentation files that reference the old agent name

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `role-based-agents`: Requirement referencing `product-manager-agent` → `project-pm`

## Impact

- `.claude/agents/product-manager.agent.md` — renamed + frontmatter
- `.claude/skills/project-begin-intention/SKILL.md` — agent invocation updated
- `.claude/skills/project-discovery/SKILL.md` — agent invocation updated
- `.claude/agents/ux-designer.agent.md` — agent name reference updated
- `openspec/specs/role-based-agents/spec.md` — delta spec for requirement rename
- Documentation files: `README.md`, `CLAUDE.md`, `$SPECS_BASE/specs/project-spec-factory/`
