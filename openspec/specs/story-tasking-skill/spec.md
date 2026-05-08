### Requirement: Generate tasks.md from story.md and design.md
The skill `/story-tasking` SHALL generate a `tasks.md` file in the story directory by reading `story.md` (acceptance criteria) and `design.md` (technical components and decisions) as dual sources. The generated file MUST follow the structure defined in `docs/specs/templates/tasks-template.md` read dynamically at runtime.

#### Scenario: Successful generation
- **WHEN** the user runs `/story-tasking {story_id}` and both `story.md` and `design.md` exist in the story directory and `tasks-template.md` exists
- **THEN** the skill generates `tasks.md` in the story directory with tasks derived from ACs and design components

#### Scenario: Tasks are ordered by logical dependencies
- **WHEN** `tasks.md` is generated
- **THEN** tasks SHALL be ordered: setup/preflight first, base components before dependent ones, tests after implementation, documentation last

#### Scenario: Tasks are grouped under numbered headings
- **WHEN** `tasks.md` is generated
- **THEN** related tasks SHALL be grouped under `##` numbered headings

### Requirement: Task format with sequential IDs and parallel markers
Each task in the generated `tasks.md` SHALL have a checkbox (`- [ ]`), a sequential ID (`T001`, `T002`, ...), an optional `[P]` marker for parallelizable tasks, and a concise description. Completed tasks SHALL use `- [x]`.

#### Scenario: Sequential task format
- **WHEN** a task has dependencies on other tasks in the same group
- **THEN** its line format SHALL be `- [ ] T001 Descripción de tarea`

#### Scenario: Parallelizable task format
- **WHEN** a task has no dependencies on other tasks in the same group
- **THEN** its line format SHALL be `- [ ] T002 [P] Descripción de tarea`

#### Scenario: Completed task format
- **WHEN** a task is marked complete
- **THEN** its line format SHALL be `- [x] T003 Descripción de tarea`

### Requirement: Fail-fast when design.md is missing
The skill SHALL stop execution and display a descriptive error message when `design.md` does not exist in the story directory. The error MUST include a suggestion to run `/story-design` first.

#### Scenario: design.md not found
- **WHEN** the user runs `/story-tasking {story_id}` and `design.md` does not exist
- **THEN** the skill SHALL display an error indicating that `design.md` is required and suggest running `/story-design`
- **THEN** no `tasks.md` file SHALL be created

### Requirement: Fail-fast when tasks-template.md is missing
The skill SHALL stop execution and display a descriptive error message when `docs/specs/templates/tasks-template.md` does not exist. No fallback template SHALL be used.

#### Scenario: tasks-template.md not found
- **WHEN** the user runs `/story-tasking {story_id}` and `tasks-template.md` does not exist at the expected path
- **THEN** the skill SHALL display an error indicating the missing template path
- **THEN** no `tasks.md` file SHALL be created

### Requirement: Preflight verification as Step 0
The skill SHALL invoke `skill-preflight` as its first step before any other operation. If preflight reports an invalid environment, the skill MUST stop immediately without generating any file.

#### Scenario: Preflight passes
- **WHEN** `skill-preflight` reports OK
- **THEN** the skill SHALL continue with parameter resolution and file generation

#### Scenario: Preflight fails
- **WHEN** `skill-preflight` reports an error
- **THEN** the skill SHALL stop immediately without generating any file

### Requirement: Idempotent execution when tasks.md already exists
When `tasks.md` already exists in the story directory, the skill SHALL ask the user whether to overwrite or skip before proceeding.

#### Scenario: tasks.md exists and user chooses to regenerate
- **WHEN** `tasks.md` already exists and the user chooses to overwrite
- **THEN** the skill SHALL regenerate and replace the file

#### Scenario: tasks.md exists and user chooses to skip
- **WHEN** `tasks.md` already exists and the user chooses not to overwrite
- **THEN** the skill SHALL exit without modifying any file
