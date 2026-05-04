## ADDED Requirements

### Requirement: ps-begin-intention detects active WIP project
Al ejecutar `/ps-begin-intention`, el skill SHALL verificar si existe algún documento en `$SPECS_BASE/specs/projects/` con `**substatus**: IN‑PROGRESS` antes de iniciar la entrevista.

#### Scenario: No active project detected
- **WHEN** ningún documento en `$SPECS_BASE/specs/projects/` tiene `Estado: Doing`
- **THEN** el skill MUST continuar con el flujo normal sin interrupciones

#### Scenario: Active project detected
- **WHEN** al menos un documento en `$SPECS_BASE/specs/projects/` tiene `Estado: Doing`
- **THEN** el skill MUST notificar al usuario que existe un proyecto activo e indicar qué documento está en `IN‑PROGRESS`

#### Scenario: User chooses to overwrite
- **WHEN** el skill detecta conflicto WIP y el usuario elige sobrescribir
- **THEN** el skill MUST continuar con el flujo normal, iniciando un nuevo proyecto desde cero

#### Scenario: User chooses to retake
- **WHEN** el skill detecta conflicto WIP y el usuario elige retomar
- **THEN** el skill MUST activar el flujo de retoma del proyecto existente (invocar `project-retake` sobre el documento en `IN‑PROGRESS`)
