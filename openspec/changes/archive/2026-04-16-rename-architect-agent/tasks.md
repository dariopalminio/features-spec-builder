## 1. Rename agent file

- [x] 1.1 Run `git mv .claude/agents/architect.agent.md .claude/agents/project-architect.agent.md` to preserve git history
- [x] 1.2 Verify file was renamed: `.claude/agents/project-architect.agent.md` exists

## 2. Update agent frontmatter

- [x] 2.1 Update `name: architect` → `name: project-architect` in `.claude/agents/project-architect.agent.md` frontmatter
- [x] 2.2 Update `description:` field to reference `project-architect` if it mentions the agent name

## 3. Update skills that invoke the architect agent

- [x] 3.1 In `.claude/skills/project-planning/SKILL.md`: replace invocation references `architect` → `project-architect` (agent name only, not role descriptions)
- [x] 3.2 In `.claude/skills/project-discovery/SKILL.md`: replace invocation references `architect` → `project-architect` (agent name only)

## 4. Update other agent files

- [x] 4.1 In `.claude/agents/ux-designer.agent.md`: replace agent name reference `architect` → `project-architect`
- [x] 4.2 In `.claude/agents/product-manager.agent.md`: replace any agent name reference `architect` → `project-architect` (check for invocation patterns)

## 5. Update openspec specs

- [x] 5.1 In `openspec/specs/role-based-agents/spec.md`: replace `architect-agent` and `architect` agent name references → `project-architect`
- [x] 5.2 In `openspec/specs/project-planning-skill/spec.md`: replace `architect-agent` → `project-architect`
- [x] 5.3 In `openspec/specs/project-discovery-skill/spec.md`: replace `architect-agent` → `project-architect`
- [x] 5.4 In `openspec/specs/ps-project-spec-skill/spec.md`: replace `architect-agent` → `project-architect` (if present)

## 6. Update documentation

- [x] 6.1 In `README.md`: replace agent name references to `architect-agent` or `architect` agent → `project-architect` (skip generic role mentions)
- [x] 6.2 In `docs/specs/project-spec-factory/project.md`: replace agent name references → `project-architect`
- [x] 6.3 In `docs/specs/project-spec-factory/project-plan.md`: replace agent name references → `project-architect`
- [x] 6.4 In `gem/prompts/prompt-ps-planning`: replace agent name references → `project-architect`

## 7. Verify

- [x] 7.1 Confirm `.claude/agents/project-architect.agent.md` exists with `name: project-architect`
- [x] 7.2 Confirm no live files outside `openspec/changes/archive/` still reference the old agent file `architect.agent.md`
- [x] 7.3 Confirm skills correctly reference `project-architect` in invocations
