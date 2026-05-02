## ADDED Requirements

### Requirement: ps-plan skill validates clarifications.md exists
The `/ps-plan` skill SHALL verify that `docs/specs/projects/clarifications.md` exists before proceeding. If absent, it SHALL inform the user and halt.

#### Scenario: clarifications.md present
- **WHEN** `docs/specs/projects/clarifications.md` exists
- **THEN** the skill continues to template verification

#### Scenario: clarifications.md absent
- **WHEN** `docs/specs/projects/clarifications.md` does not exist
- **THEN** the skill displays an error message instructing the user to run `/ps-approval` first and halts execution

### Requirement: ps-plan skill validates template exists
The skill SHALL verify that `.claude/skills/ps-plan/templates/project-plan-template.md` exists before delegating to the agent.

#### Scenario: Template present
- **WHEN** the template file exists
- **THEN** the skill proceeds to delegate to planning-agent

#### Scenario: Template absent
- **WHEN** the template file does not exist
- **THEN** the skill displays an error message and halts execution

### Requirement: ps-plan skill delegates to planning-agent
The skill SHALL invoke the `planning-agent` with an instruction to read all input documents, read the template, and produce `docs/specs/projects/project-plan.md`.

#### Scenario: Delegation to agent
- **WHEN** prerequisites are validated
- **THEN** the skill invokes planning-agent with the full context of input documents and template path

### Requirement: ps-plan skill confirms output after agent completes
After the planning-agent finishes, the skill SHALL verify that `docs/specs/projects/project-plan.md` was created and inform the user.

#### Scenario: Output created successfully
- **WHEN** planning-agent completes and `project-plan.md` exists
- **THEN** the skill displays a success message and prompts the user to review the document and run `/ps-finish` when ready

#### Scenario: Output missing after agent run
- **WHEN** planning-agent completes but `project-plan.md` does not exist
- **THEN** the skill informs the user that something went wrong and suggests re-running `/ps-plan`
