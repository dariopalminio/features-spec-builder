<!-- Referencias -->
[[FEAT-061-skill-de-implementacion-el-programador-autonomo]]

## ADDED Requirements

### Requirement: story-implement skill provides single-command implementation entry point
The system SHALL provide the `story-implement` skill as the code generation step of the SDD workflow, consuming `story.md`, `design.md`, and `tasks.md` to produce code following TDD methodology.

#### Scenario: story-implement skill is available in the workflow
- **WHEN** the repository is inspected after FEAT-061 is READY-FOR-CODE-REVIEW
- **THEN** `.claude/skills/story-implement/SKILL.md` exists and can be invoked after `story-plan` to complete the full SDD cycle from specification to code

## MODIFIED Requirements

### Requirement: Core Workflow Skills Exist in Canonical Locations
The system SHALL provide the six story workflow skills at canonical paths under `.claude/skills/`: `story-creation`, `story-split`, `finvest-evaluation`, `story-analyze`, `story-plan`, and `story-implement`.

#### Scenario: Core skill directories are present
- **WHEN** the repository is inspected
- **THEN** `.claude/skills/story-creation/`, `.claude/skills/story-split/`, `.claude/skills/finvest-evaluation/`, `.claude/skills/story-analyze/`, `.claude/skills/story-plan/`, and `.claude/skills/story-implement/` exist and each includes a `SKILL.md`
