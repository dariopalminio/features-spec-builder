## 1. Rename agent file

- [x] 1.1 Run `git mv .claude/agents/ux-designer.agent.md .claude/agents/project-ux.agent.md` to preserve git history
- [x] 1.2 Verify file was renamed: `.claude/agents/project-ux.agent.md` exists

## 2. Update agent frontmatter

- [x] 2.1 Update `name: ux-designer` → `name: project-ux` in `.claude/agents/project-ux.agent.md` frontmatter

## 3. Update skills that invoke the UX agent

- [x] 3.1 In `.claude/skills/project-discovery/SKILL.md`: replace agent invocation references `ux-designer` → `project-ux` (lines 64, 76, 82 — invocations only, not prose role labels)

## 4. Update other agent files

- [x] 4.1 In `.claude/agents/project-architect.agent.md`: replace `ux-designer` agent reference (line 75) → `project-ux`
- [x] 4.2 In `.claude/agents/project-pm.agent.md`: verify no `ux-designer` references exist (already clean)

## 5. Update the ux-designer agent body self-references

- [x] 5.1 In `.claude/agents/project-ux.agent.md`: replace any `ux-designer` agent-name references in the body → `project-ux` (check for backtick-quoted invocation references only)

## 6. Update openspec specs

- [x] 6.1 In `openspec/specs/role-based-agents/spec.md`: replace `ux-designer-agent` → `project-ux` in requirement text and scenarios
- [x] 6.2 In `openspec/specs/project-discovery-skill/spec.md`: replace `ux-designer-agent` → `project-ux`

## 7. Update documentation

- [x] 7.1 In `README.md`: update `ux-designer.agent.md` → `project-ux.agent.md` in structure diagram
- [x] 7.2 In `CLAUDE.md`: update `ux-designer.agent.md` → `project-ux.agent.md` in structure diagram (line 33 only — skip line 50 generic example)
- [x] 7.3 In `docs/specs/project-spec-factory/requirement-spec.md`: update `ux-designer-agent` → `project-ux` in agent list

## 8. Verify

- [x] 8.1 Confirm `.claude/agents/project-ux.agent.md` exists with `name: project-ux`
- [x] 8.2 Confirm no live files outside `openspec/changes/archive/` still reference `ux-designer.agent.md` or `ux-designer`/`ux-designer-agent` in agent-invocation contexts
- [x] 8.3 Confirm skills correctly reference `project-ux` in agent invocations
