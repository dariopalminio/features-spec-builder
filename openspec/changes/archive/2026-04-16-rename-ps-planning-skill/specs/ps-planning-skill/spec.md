## RENAMED Requirements

### Requirement: ps-planning reads existing document state
FROM: ps-planning reads existing document state
TO: project-planning reads existing document state

### Requirement: ps-planning validates requirement-spec.md is Ready
FROM: ps-planning validates requirement-spec.md is Ready
TO: project-planning validates requirement-spec.md is Ready

### Requirement: ps-planning validates template exists
FROM: ps-planning validates template exists
TO: project-planning validates template exists

### Requirement: ps-planning delegates to architect-agent
FROM: ps-planning delegates to architect-agent
TO: project-planning delegates to architect-agent

### Requirement: ps-planning confirms output with transition feedback
FROM: ps-planning confirms output with transition feedback
TO: project-planning confirms output with transition feedback

## MODIFIED Requirements

### Requirement: project-planning validates template exists
The skill SHALL verify that `.claude/skills/project-planning/templates/project-plan-template.md` exists before delegating to the agent.

#### Scenario: Template present
- **WHEN** the template file exists
- **THEN** the skill proceeds to delegate to architect-agent

#### Scenario: Template absent
- **WHEN** the template file does not exist
- **THEN** the skill displays an error message and halts execution

### Requirement: project-planning confirms output with transition feedback
Al finalizar, el skill SHALL aplicar el patron de `transition-feedback`.

#### Scenario: Successful completion
- **WHEN** `project-plan.md` es creado exitosamente
- **THEN** el skill MUST confirmar al usuario con el path del documento e indicar que el workflow esta completo y el documento esta listo para revision

#### Scenario: Output missing after agent run
- **WHEN** architect-agent completes but `project-plan.md` does not exist
- **THEN** the skill informs the user that something went wrong and suggests re-running `/project-planning`
