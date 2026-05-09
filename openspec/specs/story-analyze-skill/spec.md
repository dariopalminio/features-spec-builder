# story-analyze-skill Specification

## Purpose
Defines the requirements and acceptance scenarios for the `story-analyze` skill, which performs a coherence audit across the four story artifacts (story.md, design.md, tasks.md, analyze.md) before implementation begins.

## Requirements

### Requirement: story-analyze skill exists in canonical location
The system SHALL provide the `story-analyze` skill at `.claude/skills/story-analyze/SKILL.md` with its `assets/` and `examples/` directories.

#### Scenario: Skill directory is present
- **WHEN** the repository is inspected
- **THEN** `.claude/skills/story-analyze/SKILL.md` exists and contains valid YAML frontmatter with `name: story-analyze`

### Requirement: Skill requires all three story artifacts before analyzing
The system SHALL verify that story.md, design.md, and tasks.md all exist in the target story directory before performing any analysis.

#### Scenario: design.md is missing
- **WHEN** `/story-analyze` is invoked on a story directory that lacks `design.md`
- **THEN** the skill halts with an error message indicating the missing file and suggests running `/story-design`

#### Scenario: tasks.md is missing
- **WHEN** `/story-analyze` is invoked on a story directory that lacks `tasks.md`
- **THEN** the skill halts with an error message indicating the missing file and suggests running `/story-tasking`

### Requirement: Skill produces a non-destructive coherence report
The system SHALL generate `analyze.md` in the story directory without modifying any of the analyzed artifacts.

#### Scenario: Successful analysis with coherent artifacts
- **WHEN** story.md, design.md, and tasks.md are all present and aligned
- **THEN** the skill writes `analyze.md` reporting no inconsistencies and confirms all ACs are covered in design.md and all tasks have design counterparts

#### Scenario: Inconsistencies detected
- **WHEN** tasks.md contains tasks with no corresponding design element
- **THEN** `analyze.md` lists those tasks as ERROR-level inconsistencies with references to the specific task IDs and recommends updating design.md

### Requirement: Coherence report classifies inconsistencies by severity
The system SHALL classify each detected inconsistency as ERROR (blocking) or WARNING (non-blocking) in the report.

#### Scenario: AC without design coverage is ERROR
- **WHEN** a criterion of acceptance from story.md has no corresponding element in design.md
- **THEN** the report marks it as ERROR and blocks proceeding to implementation

#### Scenario: Design element without task is WARNING
- **WHEN** a component or interface in design.md has no corresponding task in tasks.md
- **THEN** the report marks it as WARNING but does not block implementation

### Requirement: Skill verifies alignment with parent release when available
The system SHALL attempt to locate and read the parent release.md and verify the story objectives are aligned with the release goals.

#### Scenario: Release file found and story is aligned
- **WHEN** the parent EPIC release.md exists and the story objective matches the release goals
- **THEN** the report marks release alignment as verified (✓)

#### Scenario: Release file not found
- **WHEN** the parent EPIC release.md cannot be found under `$SPECS_BASE/specs/releases/`
- **THEN** the skill emits a WARNING and continues without blocking the analysis

### Requirement: story-analyze sets READY-FOR-IMPLEMENT/DONE upon successful completion
The system SHALL update `status: READY-FOR-IMPLEMENT` and `substatus: DONE` in `story.md` frontmatter when `story-analyze` finishes generating `analyze.md` without ERROR-level inconsistencies.

#### Scenario: Status set READY-FOR-IMPLEMENT/DONE on clean analysis
- **WHEN** `story-analyze` completes analysis with zero ERROR-level inconsistencies
- **THEN** `story.md` frontmatter MUST be updated to `status: READY-FOR-IMPLEMENT` and `substatus: DONE` after writing `analyze.md`

#### Scenario: Status set READY-FOR-IMPLEMENT/DONE even with WARNING inconsistencies
- **WHEN** `story-analyze` detects only WARNING-level inconsistencies (non-blocking)
- **THEN** `story.md` frontmatter MUST be updated to `status: READY-FOR-IMPLEMENT` and `substatus: DONE`, and the analyze report notes the warnings

#### Scenario: Status NOT updated when ERROR inconsistencies exist
- **WHEN** `story-analyze` detects one or more ERROR-level inconsistencies
- **THEN** `story.md` frontmatter MUST NOT be updated to `READY-FOR-IMPLEMENT/DONE`; it remains at `PLANNING/IN‑PROGRESS` to signal that the planning requires correction

#### Scenario: Status update in Agent mode (invoked by story-plan)
- **WHEN** `story-analyze` is invoked in Agent mode by `story-plan`
- **THEN** the skill MUST still update `story.md` status to `READY-FOR-IMPLEMENT/DONE` upon successful completion, identical to manual invocation
