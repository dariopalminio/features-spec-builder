## MODIFIED Requirements

### Requirement: ps-planning reads existing document state
El skill SHALL leer el campo `**Estado**:` de `$SPECS_BASE/specs/projects/project-plan.md` si existe, aplicando la lógica de `skill-state-detection`.

#### Scenario: Document in IN‑PROGRESS state
- **WHEN** `project-plan.md` existe con `Estado: IN‑PROGRESS`
- **THEN** el skill MUST activar el flujo de retoma definido en `project-retake`

#### Scenario: Document in Ready state
- **WHEN** `project-plan.md` existe con `Estado: Ready`
- **THEN** el skill MUST informar al usuario y solicitar confirmación antes de sobrescribir

### Requirement: ps-planning validates requirement-spec.md is Ready
El skill SHALL verificar que `$SPECS_BASE/specs/projects/project.md` existe y tiene `Estado: Ready` antes de delegar al agente.

#### Scenario: Input presente y Ready
- **WHEN** `requirement-spec.md` existe con `Estado: Ready`
- **THEN** el skill continúa al siguiente paso

#### Scenario: Input ausente o en IN‑PROGRESS
- **WHEN** `requirement-spec.md` no existe o tiene `Estado: IN‑PROGRESS`
- **THEN** el skill informa al usuario que debe completar la fase Discovery primero y detiene la ejecución

### Requirement: ps-planning confirms output with transition feedback
Al finalizar, el skill SHALL aplicar el patrón de `transition-feedback`.

#### Scenario: Successful completion
- **WHEN** `project-plan.md` es creado exitosamente
- **THEN** el skill MUST confirmar al usuario con el path del documento e indicar que el workflow está completo y el documento está listo para revisión

### Requirement: ps-plan skill validates template exists
The skill SHALL verify that `.claude/skills/ps-planning/templates/project-plan-template.md` exists before delegating to the agent.

#### Scenario: Template present
- **WHEN** the template file exists
- **THEN** the skill proceeds to delegate to architect-agent

#### Scenario: Template absent
- **WHEN** the template file does not exist
- **THEN** the skill displays an error message and halts execution
