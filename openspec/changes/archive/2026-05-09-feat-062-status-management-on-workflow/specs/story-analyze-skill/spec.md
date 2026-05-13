<!-- Referencias -->
[[FEAT-062-status-management-on-workflow]]

## ADDED Requirements

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
- **THEN** `story.md` frontmatter MUST NOT be updated to `READY-FOR-IMPLEMENT/DONE`; it remains at `PLAN/IN‑PROGRESS` to signal that the planning requires correction

#### Scenario: Status update in Agent mode (invoked by story-plan)
- **WHEN** `story-analyze` is invoked in Agent mode by `story-plan`
- **THEN** the skill MUST still update `story.md` status to `READY-FOR-IMPLEMENT/DONE` upon successful completion, identical to manual invocation
