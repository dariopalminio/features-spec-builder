## 1. Rename skill directory

- [x] 1.1 Run `git mv .claude/skills/ps-planning .claude/skills/project-planning` to preserve git history
- [x] 1.2 Verify directory was renamed: `.claude/skills/project-planning/SKILL.md` exists

## 2. Update skill internal files

- [x] 2.1 Update `name:` field in `.claude/skills/project-planning/SKILL.md` frontmatter from `ps-planning` to `project-planning`
- [x] 2.2 Replace all occurrences of `ps-planning` in `.claude/skills/project-planning/SKILL.md` with `project-planning`

## 3. Update agent files

- [x] 3.1 Replace all occurrences of `ps-planning` in `.claude/agents/architect.agent.md` with `project-planning`
- [x] 3.2 Replace all occurrences of `ps-planning` in `.claude/agents/product-manager.agent.md` with `project-planning`

## 4. Update other skill files

- [x] 4.1 Replace all occurrences of `ps-planning` in `.claude/skills/project-discovery/SKILL.md` with `project-planning`

## 5. Update openspec specs

- [x] 5.1 Run `git mv openspec/specs/ps-planning-skill openspec/specs/project-planning-skill` to rename the spec directory
- [x] 5.2 Replace all occurrences of `ps-planning` in `openspec/specs/project-planning-skill/spec.md` with `project-planning`
- [x] 5.3 Replace all occurrences of `ps-planning` in `openspec/specs/role-based-agents/spec.md` with `project-planning`
- [x] 5.4 Replace all occurrences of `ps-planning` in `openspec/specs/transition-feedback/spec.md` with `project-planning`

## 6. Update documentation

- [x] 6.1 Replace all occurrences of `ps-planning` in `README.md` with `project-planning`
- [x] 6.2 Replace all occurrences of `ps-planning` in `gem/README.md` with `project-planning`
- [x] 6.3 Replace all occurrences of `ps-planning` in `docs/specs/project-spec-factory/requirement-spec.md` with `project-planning`
- [x] 6.4 Replace all occurrences of `ps-planning` in `docs/specs/project-spec-factory/project-plan.md` with `project-planning`

## 7. Verify

- [x] 7.1 Run `grep -r "ps-planning" .` excluding `openspec/changes/archive/` and confirm zero results
- [x] 7.2 Confirm `.claude/skills/project-planning/SKILL.md` has valid frontmatter with `name: project-planning`
