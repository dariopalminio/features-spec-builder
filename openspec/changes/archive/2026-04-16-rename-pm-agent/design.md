## Context

The codebase has a `product-manager.agent.md` agent whose `name` frontmatter is `product-manager`. All other role-based agents now follow the `project-` prefix convention (`project-architect`). This rename brings the PM agent into alignment.

Skills that invoke agents do so by the `name` field in agent frontmatter. Any reference to the string `product-manager` in skill invocations or agent cross-references must be updated to `project-pm`.

## Goals / Non-Goals

**Goals:**
- Rename file and update `name` frontmatter
- Update all agent name invocations across skills and agent files
- Update openspec specs delta to reflect new requirement name
- Update docs/README references

**Non-Goals:**
- Changing the agent's behavior, instructions, or tools
- Renaming skill commands or directories
- Updating Spanish role descriptions (`Product Manager`, `PM especializado`)

## Decisions

**Surgical replacement only**: Replace the agent name token `product-manager` only where it appears as an agent identifier (backtick-quoted invocations, frontmatter `name:`, YAML references). Do NOT replace generic role labels like `Product Manager`, `PM`, or Spanish descriptions (`product-manager-agent` in prose descriptions about the role).

**File rename via git mv**: Preserve git history by using `git mv` instead of delete+create.

**`product-manager-agent` → `project-pm`**: The old `name` in frontmatter was `product-manager`; skills reference it as an agent name. After rename, the canonical name becomes `project-pm`.

## Risks / Trade-offs

- **Risk**: A skill or agent file references `product-manager` in a way not caught by grep → **Mitigation**: Final verification grep across all non-archive files.
- **Risk**: `product-manager-agent` vs `product-manager` — the old name had no `-agent` suffix in frontmatter. Specs/docs may use both forms. → **Mitigation**: grep for both `product-manager-agent` and `product-manager` in agent-invocation contexts before editing.
