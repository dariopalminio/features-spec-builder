## MODIFIED Requirements

### Requirement: ps-begin-intention skill exists and is invocable
El sistema SHALL incluir un skill en `.claude/skills/ps-begin-intention/SKILL.md` con frontmatter YAML válido (name, description) que sea invocable mediante el comando `/ps-begin-intention`.

#### Scenario: Skill is invocable
- **WHEN** el usuario ejecuta `/ps-begin-intention`
- **THEN** el sistema MUST cargar y ejecutar `.claude/skills/ps-begin-intention/SKILL.md`

### Requirement: ps-begin-intention checks WIP conflict before starting
Al inicio, el skill SHALL verificar si existe un proyecto activo con `Estado: IN‑PROGRESS` antes de comenzar la entrevista, aplicando la lógica de `wip-conflict-detection`.

#### Scenario: No WIP conflict
- **WHEN** no existe ningún documento en `$SPECS_BASE/specs/projects/` con `Estado: IN‑PROGRESS`
- **THEN** el skill MUST continuar directamente a verificar precondiciones del template

#### Scenario: WIP conflict detected
- **WHEN** existe al menos un documento con `Estado: IN‑PROGRESS`
- **THEN** el skill MUST notificar y ofrecer las opciones definidas en `wip-conflict-detection`

### Requirement: ps-begin-intention reads existing document state
El skill SHALL leer el campo `**Estado**:` de `$SPECS_BASE/specs/projects/project-intent.md` si existe, aplicando la lógica de `skill-state-detection`.

#### Scenario: Document in IN‑PROGRESS state
- **WHEN** `project-intent.md` existe con `Estado: IN‑PROGRESS`
- **THEN** el skill MUST activar el flujo de retoma definido en `project-retake`

#### Scenario: Document in Ready state
- **WHEN** `project-intent.md` existe con `Estado: Ready`
- **THEN** el skill MUST informar al usuario y solicitar confirmación antes de sobrescribir

### Requirement: ps-begin-intention produces project-intent.md
El skill `/ps-begin-intention` SHALL producir `$SPECS_BASE/specs/projects/project-intent.md` como único documento de salida.

#### Scenario: Single session produces final document
- **WHEN** el usuario completa la entrevista guiada por `/ps-begin-intention`
- **THEN** el sistema MUST crear `$SPECS_BASE/specs/projects/project-intent.md` usando el template `ps-begin-intention/templates/project-intent-template.md`

### Requirement: ps-begin-intention confirms output with transition feedback
Al finalizar, el skill SHALL aplicar el patrón de `transition-feedback`.

#### Scenario: Successful completion
- **WHEN** `project-intent.md` es creado exitosamente
- **THEN** el skill MUST confirmar al usuario con el path del documento y sugerir ejecutar `/ps-discovery`
