## Why

The Approval phase of the ProjectSpecFactory pipeline lacks a complete implementation. The existing `ps-approve` skill is a stub with no agent, no template, and no structured interview process. This change adds the full Approval phase, enabling multi-perspective analysis (PM, Architect, UX) of the specification documents before moving to Planning.

## What Changes

- **New**: `clarifications-template.md` — template for the clarifications output document, stored at `.claude/skills/ps-approval/templates/clarifications-template.md`
- **New**: `approval-agent.md` — specialized agent that reads all prior phase documents, analyzes them from three perspectives (PM, Architect, UX), interviews the user to resolve ambiguities, and produces `$SPECS_BASE/specs/projects/clarifications.md`
- **New**: `.claude/skills/ps-approval/SKILL.md` — skill orchestrator that validates `requirement-spec.md` state, delegates to `approval-agent`, and confirms output
- **Deprecated**: `.claude/skills/ps-approve/SKILL.md` — replaced by `ps-approval` (the existing stub is superseded)

## Capabilities

### New Capabilities

- `approval-phase`: Full implementation of the Approval pipeline state — skill orchestrator (`ps-approval`), specialized `approval-agent`, and `clarifications-template.md`. The agent reads `initial-prompt.md`, `project-intent.md`, `discovery.md`, and `requirement-spec.md`, applies PM/Architect/UX analysis lenses, conducts a structured interview, and writes `$SPECS_BASE/specs/projects/clarifications.md`.

### Modified Capabilities

_(none — no existing spec-level behavior changes)_

## Impact

- New files: `.claude/skills/ps-approval/SKILL.md`, `.claude/skills/ps-approval/templates/clarifications-template.md`, `.claude/agents/approval-agent.md`
- The existing `.claude/skills/ps-approve/SKILL.md` stub is superseded (can be removed or left as legacy alias)
- No breaking changes to other pipeline phases
- Output path: `$SPECS_BASE/specs/projects/clarifications.md`
