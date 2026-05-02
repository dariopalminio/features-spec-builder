## Why

The agent file `.claude/agents/ux-designer.agent.md` uses the name `ux-designer`, which doesn't follow the `project-` prefix convention adopted for all role-based agents in this pipeline. Renaming it to `project-ux` aligns it with `project-architect` and `project-pm`.

## What Changes

- Rename `.claude/agents/ux-designer.agent.md` → `.claude/agents/project-ux.agent.md`
- Update frontmatter `name: ux-designer` → `name: project-ux`
- Update `.claude/skills/project-discovery/SKILL.md` — three invocation references to `ux-designer` → `project-ux`
- Update `.claude/agents/project-architect.agent.md` — agent name reference `ux-designer` → `project-ux`
- Update `.claude/agents/project-pm.agent.md` — agent name reference `ux-designer` → `project-ux` (in body reference)
- Update openspec specs (`role-based-agents`, `project-discovery-skill`) — `ux-designer-agent` → `project-ux`
- Update documentation files: `README.md`, `CLAUDE.md`, `docs/specs/project-spec-factory/project.md`

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `role-based-agents`: Requirement referencing `ux-designer-agent` → `project-ux`
- `project-discovery-skill`: Requirement referencing `ux-designer-agent` → `project-ux`

## Impact

- `.claude/agents/ux-designer.agent.md` — renamed + frontmatter
- `.claude/skills/project-discovery/SKILL.md` — agent invocations updated
- `.claude/agents/project-architect.agent.md` — agent name reference updated
- `.claude/agents/project-pm.agent.md` — agent name reference updated (if present in body)
- `openspec/specs/role-based-agents/spec.md` — delta spec
- `openspec/specs/project-discovery-skill/spec.md` — delta spec
- `docs/specs/project-spec-factory/project.md` — agent list
- `README.md`, `CLAUDE.md` — structure diagrams
