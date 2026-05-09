<!-- Referencias -->
[[FEAT-060-orquestacion-del-plan]]

## ADDED Requirements

### Requirement: story-plan skill provides single-command planning entry point
The system SHALL provide the `story-plan` skill as a pipeline orchestrator that executes the complete planning flow (`story-design → story-tasking → story-analyze`) with a single command.

#### Scenario: story-plan skill is available in the workflow
- **WHEN** the repository is inspected after FEAT-060 is implemented
- **THEN** `.claude/skills/story-plan/SKILL.md` exists and can be invoked as an alternative to running `story-design`, `story-tasking`, and `story-analyze` individually

## MODIFIED Requirements

### Requirement: Core Workflow Skills Exist in Canonical Locations
The system SHALL provide the five story workflow skills at canonical paths under `.claude/skills/`: `story-creation`, `story-split`, `finvest-evaluation`, `story-analyze`, and `story-plan`.

#### Scenario: Core skill directories are present
- **WHEN** the repository is inspected
- **THEN** `.claude/skills/story-creation/`, `.claude/skills/story-split/`, `.claude/skills/finvest-evaluation/`, `.claude/skills/story-analyze/`, and `.claude/skills/story-plan/` exist and each includes a `SKILL.md`
