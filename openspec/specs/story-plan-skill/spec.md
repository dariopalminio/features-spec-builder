# story-plan-skill Specification

## Purpose
Provides the `story-plan` skill as a pipeline orchestrator that executes the complete planning flow (`story-design → story-tasking → story-analyze`) with a single command, offering a single-command planning entry point for a story directory.

## Requirements

### Requirement: story-plan skill exists in canonical location
The system SHALL provide the `story-plan` skill at `.claude/skills/story-plan/SKILL.md` with its `assets/` and `examples/` directories.

#### Scenario: Skill directory is present
- **WHEN** the repository is inspected
- **THEN** `.claude/skills/story-plan/SKILL.md` exists and contains valid YAML frontmatter with `name: story-plan`

### Requirement: Skill requires story.md before orchestrating
The system SHALL verify that `story.md` exists in the target story directory before executing any sub-skill.

#### Scenario: story.md is missing
- **WHEN** `/story-plan` is invoked on a directory that lacks `story.md`
- **THEN** the skill halts immediately with an error message and does not invoke any sub-skill

### Requirement: Skill orchestrates the planning pipeline in sequence
The system SHALL execute `story-design`, then `story-tasking`, then `story-analyze` in sequence, passing the resolved story directory to each sub-skill in Agent mode.

#### Scenario: Full pipeline completes successfully
- **WHEN** story.md is present and all sub-skills execute without errors
- **THEN** `design.md`, `tasks.md`, and `analyze.md` are present in the story directory and the skill displays a final summary with all three steps marked as completed (✓)

#### Scenario: story-design fails, chain stops
- **WHEN** `story-design` fails (e.g., missing template)
- **THEN** the skill halts after the failure, does not invoke `story-tasking` or `story-analyze`, and displays the error with instructions to resolve it alongside the accumulated step status

### Requirement: Skill implements fail-fast with accumulated status
The system SHALL stop the orchestration pipeline at the first failing step and display the status of all steps (completed, failed, not executed) without rolling back already-generated artifacts.

#### Scenario: Failure mid-pipeline shows partial status
- **WHEN** `story-design` succeeds but `story-tasking` fails
- **THEN** the summary shows `story-design` as ✓, `story-tasking` as ✗ with error details, and `story-analyze` as — (not executed)

### Requirement: story-analyze inconsistencies mark plan as requiring review
The system SHALL complete the pipeline even when `story-analyze` detects inconsistencies, and SHALL mark the final summary as "requires review" without removing any generated artifacts.

#### Scenario: Inconsistencies detected without blocking
- **WHEN** `story-design` and `story-tasking` succeed and `story-analyze` detects ERROR-level inconsistencies
- **THEN** the skill completes, all three artifacts remain in the story directory, and the final summary shows `story-analyze` as ⚠️ with a pointer to `analyze.md`

### Requirement: Skill delegates idempotency to each sub-skill
The system SHALL not implement its own overwrite logic; instead, each sub-skill's existing behavior (ask before overwrite) SHALL be preserved when invoked by `story-plan`.

#### Scenario: Re-execution on existing artifacts
- **WHEN** `/story-plan` is executed on a directory that already contains `design.md`
- **THEN** `story-design` prompts the user whether to regenerate or skip, consistent with its standalone behavior
