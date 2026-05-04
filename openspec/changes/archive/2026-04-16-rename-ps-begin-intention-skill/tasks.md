## 1. Rename skill directory

- [x] 1.1 Run `git mv .claude/skills/ps-begin-intention .claude/skills/project-begin-intention` to preserve git history
- [x] 1.2 Verify directory was renamed: `.claude/skills/project-begin-intention/SKILL.md` exists

## 2. Update skill internal files

- [x] 2.1 Update `name:` field in `.claude/skills/project-begin-intention/SKILL.md` frontmatter from `ps-begin-intention` to `project-begin-intention`
- [x] 2.2 Replace all occurrences of `ps-begin-intention` in `.claude/skills/project-begin-intention/SKILL.md` with `project-begin-intention`

## 3. Update agent files

- [x] 3.1 Replace all occurrences of `ps-begin-intention` in `.claude/agents/product-manager.agent.md` with `project-begin-intention`
- [x] 3.2 Replace all occurrences of `ps-begin-intention` in `.claude/agents/architect.agent.md` with `project-begin-intention`

## 4. Update other skill files

- [x] 4.1 Replace all occurrences of `ps-begin-intention` in `.claude/skills/ps-discovery/SKILL.md` with `project-begin-intention`

## 5. Update openspec specs

- [x] 5.1 Run `git mv openspec/specs/ps-begin-intention-skill openspec/specs/project-begin-intention-skill` to rename the spec directory
- [x] 5.2 Replace all occurrences of `ps-begin-intention` in `openspec/specs/project-begin-intention-skill/spec.md` with `project-begin-intention`

## 6. Update documentation

- [x] 6.1 Replace all occurrences of `ps-begin-intention` in `README.md` with `project-begin-intention`
- [x] 6.2 Replace all occurrences of `ps-begin-intention` in `gem/README.md` with `project-begin-intention`
- [x] 6.3 Replace all occurrences of `ps-begin-intention` in `$SPECS_BASE/specs/project-spec-factory/project.md` with `project-begin-intention`
- [x] 6.4 Replace all occurrences of `ps-begin-intention` in `$SPECS_BASE/specs/project-spec-factory/project-plan.md` with `project-begin-intention`

## 7. Update openspec change cross-references

- [x] 7.1 Replace all occurrences of `ps-begin-intention` in `openspec/specs/wip-conflict-detection/spec.md` with `project-begin-intention`
- [x] 7.2 Replace all occurrences of `ps-begin-intention` in `openspec/specs/transition-feedback/spec.md` with `project-begin-intention`
- [x] 7.3 Replace all occurrences of `ps-begin-intention` in `openspec/specs/ps-discovery-skill/spec.md` with `project-begin-intention`

## 8. Verify

- [x] 8.1 Run `grep -r "ps-begin-intention" .` and confirm zero results (only change artifact files remain, as expected)
- [x] 8.2 Confirm `.claude/skills/project-begin-intention/SKILL.md` loads correctly (frontmatter valid)
