## Context

The skill `ps-begin-intention` is the first step of the ProjectSpecFactory pipeline. Its directory lives at `.claude/skills/ps-begin-intention/` and its command is `/ps-begin-intention`. The `ps-` prefix was an early convention; the rest of the pipeline now favors `project-` as a clearer namespace. This is a pure rename — no behavior changes.

## Goals / Non-Goals

**Goals:**
- Rename the skill directory from `ps-begin-intention` to `project-begin-intention`
- Update all textual references across docs, agents, and specs to use the new name
- Keep the slash command registration consistent (command name derived from directory name)

**Non-Goals:**
- Changing skill behavior or logic
- Renaming other `ps-*` skills (out of scope for this change)
- Modifying templates inside the skill

## Decisions

**Approach: in-place rename via git mv + sed-style text replacement**
- Use `git mv` to rename the directory so git history is preserved.
- Update all 13 files containing the old name with a global string replacement `ps-begin-intention` → `project-begin-intention`.
- Rationale: straightforward rename with no structural changes needed.

## Risks / Trade-offs

- [Risk] Users or scripts that hardcode `/ps-begin-intention` will break → Mitigation: update all known references in the same commit; document in commit message.
- [Risk] `openspec/specs/ps-begin-intention-skill/` directory name also contains the old prefix → Mitigation: rename that directory too as part of this change.
