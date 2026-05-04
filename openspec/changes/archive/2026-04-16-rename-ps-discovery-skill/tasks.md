## 1. Rename skill directory

- [x] 1.1 Run `git mv .claude/skills/ps-discovery .claude/skills/project-discovery` to preserve git history
- [x] 1.2 Verify directory was renamed: `.claude/skills/project-discovery/SKILL.md` exists

## 2. Update skill internal files

- [x] 2.1 Update `name:` field in `.claude/skills/project-discovery/SKILL.md` frontmatter from `ps-discovery` to `project-discovery`
- [x] 2.2 Replace all occurrences of `ps-discovery` in `.claude/skills/project-discovery/SKILL.md` with `project-discovery`

## 3. Update agent files

- [x] 3.1 Replace all occurrences of `ps-discovery` in `.claude/agents/product-manager.agent.md` with `project-discovery`
- [x] 3.2 Replace all occurrences of `ps-discovery` in `.claude/agents/architect.agent.md` with `project-discovery`
- [x] 3.3 Replace all occurrences of `ps-discovery` in `.claude/agents/ux-designer.agent.md` with `project-discovery`

## 4. Update other skill files

- [x] 4.1 Replace all occurrences of `ps-discovery` in `.claude/skills/project-begin-intention/SKILL.md` with `project-discovery`
- [x] 4.2 Replace all occurrences of `ps-discovery` in `.claude/skills/ps-planning/SKILL.md` with `project-discovery`

## 5. Update openspec specs

- [x] 5.1 Run `git mv openspec/specs/ps-discovery-skill openspec/specs/project-discovery-skill` to rename the spec directory
- [x] 5.2 Replace all occurrences of `ps-discovery` in `openspec/specs/project-discovery-skill/spec.md` with `project-discovery`
- [x] 5.3 Replace all occurrences of `ps-discovery` in `openspec/specs/transition-feedback/spec.md` with `project-discovery`
- [x] 5.4 Replace all occurrences of `ps-discovery` in `openspec/specs/role-based-agents/spec.md` with `project-discovery`
- [x] 5.5 Replace all occurrences of `ps-discovery` in `openspec/specs/ps-project-spec-skill/spec.md` with `project-discovery`
- [x] 5.6 Replace all occurrences of `ps-discovery` in `openspec/specs/discovery-template/spec.md` with `project-discovery`

## 6. Update documentation

- [x] 6.1 Replace all occurrences of `ps-discovery` in `README.md` with `project-discovery`
- [x] 6.2 Replace all occurrences of `ps-discovery` in `gem/README.md` with `project-discovery`
- [x] 6.3 Replace all occurrences of `ps-discovery` in `$SPECS_BASE/specs/project-spec-factory/project.md` with `project-discovery`
- [x] 6.4 Replace all occurrences of `ps-discovery` in `$SPECS_BASE/specs/project-spec-factory/project-plan.md` with `project-discovery`

## 7. Update gem prompts

- [x] 7.1 Replace all occurrences of `ps-discovery` in `gem/prompts/prompt-ps-planning` with `project-discovery`
- [x] 7.2 Replace all occurrences of `ps-discovery` in `gem/prompts/prompt-ps-begin-intention` with `project-discovery`

## 8. Verify

- [x] 8.1 Run `grep -r "ps-discovery" .` excluding `openspec/changes/archive/` and confirm zero results
- [x] 8.2 Confirm `.claude/skills/project-discovery/SKILL.md` has valid frontmatter with `name: project-discovery`
