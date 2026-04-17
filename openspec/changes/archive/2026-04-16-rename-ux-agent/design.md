## Context

The agent `ux-designer.agent.md` has `name: ux-designer` in its frontmatter. All other pipeline agents follow the `project-` prefix convention (`project-architect`, `project-pm`). This rename completes the convention across all three role-based agents.

Skills reference agents by their `name` frontmatter field. Any backtick-quoted `ux-designer` in skill invocation contexts must become `project-ux`. References in Spanish prose (role descriptions like "UX Designer", "diseñador UX") are NOT changed.

The spec note: specs reference `ux-designer-agent` (with the `-agent` suffix, which was never the actual frontmatter name). Both forms need updating.

## Goals / Non-Goals

**Goals:**
- Rename file and update `name` frontmatter to `project-ux`
- Update all agent name invocations in skills and agent cross-references
- Update openspec specs delta for both `role-based-agents` and `project-discovery-skill`
- Update docs/README structure diagrams

**Non-Goals:**
- Changing the agent's behavior, instructions, or tools
- Updating Spanish role descriptions (`UX Designer`, `diseñador UX`)
- Note: `CLAUDE.md` line 50 references `ux-designer` in a generic example (not an agent invocation) — skip it

## Decisions

**Surgical replacement**: Replace `ux-designer` only as an agent identifier (backtick-quoted in invocation contexts, frontmatter `name:`). Skip generic role labels and prose descriptions.

**File rename via git mv**: Preserve git history.

**`ux-designer-agent` vs `ux-designer`**: The old frontmatter name was `ux-designer` (no `-agent` suffix). Specs used `ux-designer-agent`. Both need updating to `project-ux`.

**CLAUDE.md line 50 skip**: The reference is in a generic workflow example ("uno de ux-designer, uno de product-owner") not an actual agent invocation — leave it as-is.

## Risks / Trade-offs

- **Risk**: Missing `ux-designer-agent` form in some files → **Mitigation**: grep for both `ux-designer-agent` and `ux-designer` before editing.
- **Risk**: Final verification grep may flag prose uses → **Mitigation**: review context of any remaining matches, skip non-invocation ones.
