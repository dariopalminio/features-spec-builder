<!-- Referencias -->
[[FEAT-059-comando-de-analisis-transversal]]

## ADDED Requirements

### Requirement: story-analyze skill exists as part of the story workflow
The system SHALL provide the `story-analyze` skill as a coherence audit step in the story SDD workflow, positioned after `story-tasking` and before implementation.

#### Scenario: story-analyze skill is available in the workflow
- **WHEN** the repository is inspected after FEAT-059 is READY-FOR-CODE-REVIEW
- **THEN** `.claude/skills/story-analyze/SKILL.md` exists alongside `story-design` and `story-tasking` skills, completing the four-artifact story workflow

## MODIFIED Requirements

### Requirement: Core Workflow Skills Exist in Canonical Locations
The system SHALL provide the four story workflow skills at canonical paths under `.claude/skills/`: `story-creation`, `story-split`, `finvest-evaluation`, and `story-analyze`.

#### Scenario: Core skill directories are present
- **WHEN** the repository is inspected
- **THEN** `.claude/skills/story-creation/`, `.claude/skills/story-split/`, `.claude/skills/finvest-evaluation/`, and `.claude/skills/story-analyze/` exist and each includes a `SKILL.md`
