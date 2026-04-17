## 1. Rename agent file

- [x] 1.1 Run `git mv .claude/agents/product-manager.agent.md .claude/agents/project-pm.agent.md` to preserve git history
- [x] 1.2 Verify file was renamed: `.claude/agents/project-pm.agent.md` exists

## 2. Update agent frontmatter

- [x] 2.1 Update `name: product-manager` → `name: project-pm` in `.claude/agents/project-pm.agent.md` frontmatter
- [x] 2.2 Update the two `**Generado por**: product-manager` lines (lines 75, 141) in the agent body → `project-pm`

## 3. Update skills that invoke the PM agent

- [x] 3.1 In `.claude/skills/project-begin-intention/SKILL.md`: replace agent invocation references `product-manager` → `project-pm` (lines 4, 48, 50, 64, 72 — invocations only, not prose role labels)
- [x] 3.2 In `.claude/skills/project-discovery/SKILL.md`: replace agent invocation references `product-manager` → `project-pm` (lines 5, 54, 56 — invocations only)

## 4. Update skill templates

- [x] 4.1 In `.claude/skills/project-begin-intention/templates/project-intent-template.md`: update `**Generado por**: product-manager` → `project-pm`

## 5. Update other agent files

- [x] 5.1 In `.claude/agents/project-architect.agent.md`: replace `product-manager` agent reference (line 41) → `project-pm`
- [x] 5.2 In `.claude/agents/ux-designer.agent.md`: replace `product-manager` agent reference (line 30) → `project-pm`

## 6. Update openspec specs

- [x] 6.1 In `openspec/specs/role-based-agents/spec.md`: replace `product-manager-agent` → `project-pm` in requirement text and scenarios
- [x] 6.2 In `openspec/specs/project-begin-intention-skill/spec.md`: replace `product-manager-agent` → `project-pm`
- [x] 6.3 In `openspec/specs/project-discovery-skill/spec.md`: replace `product-manager-agent` → `project-pm`

## 7. Update documentation

- [x] 7.1 In `README.md`: update `product-manager.agent.md` → `project-pm.agent.md` in structure diagram
- [x] 7.2 In `CLAUDE.md`: update `product-manager.agent.md` → `project-pm.agent.md` in structure diagram
- [x] 7.3 In `docs/specs/project-spec-factory/project-intent.md`: update `**Generado por**: product-manager-agent` → `project-pm`
- [x] 7.4 In `docs/specs/project-spec-factory/project-plan.md`: update `product-manager-agent` → `project-pm` (FEAT-003 description)
- [x] 7.5 In `docs/specs/project-spec-factory/requirement-spec.md`: update `product-manager-agent` → `project-pm` in agent list
- [x] 7.6 In `gem/prompts/prompt-ps-begin-intention`: update `**Generado por**: product-manager-agent` → `project-pm`

## 8. Verify

- [x] 8.1 Confirm `.claude/agents/project-pm.agent.md` exists with `name: project-pm`
- [x] 8.2 Confirm no live files outside `openspec/changes/archive/` still reference `product-manager.agent.md` or the old agent name `product-manager` in invocation contexts
- [x] 8.3 Confirm skills correctly reference `project-pm` in agent invocations
