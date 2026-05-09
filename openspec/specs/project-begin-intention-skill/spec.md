## ADDED Requirements

### Requirement: project-begin skill exists and is invocable
El sistema SHALL incluir un skill en `.claude/skills/project-begin/SKILL.md` con frontmatter YAML valido (name, description) que sea invocable mediante el comando `/project-begin`.

#### Scenario: Skill is invocable
- **WHEN** el usuario ejecuta `/project-begin`
- **THEN** el sistema MUST cargar y ejecutar `.claude/skills/project-begin/SKILL.md`

### Requirement: project-begin checks WIP conflict before starting
Al inicio, el skill SHALL verificar si existe un proyecto activo con `Estado: IN‑PROGRESS` antes de comenzar la entrevista, aplicando la logica de `wip-conflict-detection`.

#### Scenario: No WIP conflict
- **WHEN** no existe ningun documento en `$SPECS_BASE/specs/projects/` con `Estado: IN‑PROGRESS`
- **THEN** el skill MUST continuar directamente a verificar precondiciones del template

#### Scenario: WIP conflict detected
- **WHEN** existe al menos un documento con `Estado: IN‑PROGRESS`
- **THEN** el skill MUST notificar y ofrecer las opciones definidas en `wip-conflict-detection`

### Requirement: project-begin reads existing document state
El skill SHALL leer el campo `**Estado**:` de `$SPECS_BASE/specs/projects/project-intent.md` si existe, aplicando la logica de `skill-state-detection`.

#### Scenario: Document in IN‑PROGRESS state
- **WHEN** `project-intent.md` existe con `Estado: IN‑PROGRESS`
- **THEN** el skill MUST activar el flujo de retoma definido en `project-retake`

#### Scenario: Document in Ready state
- **WHEN** `project-intent.md` existe con `Estado: Ready`
- **THEN** el skill MUST informar al usuario y solicitar confirmacion antes de sobrescribir

### Requirement: project-begin produces project-intent.md
El skill `/project-begin` SHALL producir `$SPECS_BASE/specs/projects/project-intent.md` como unico documento de salida, en una sola sesion interactiva que combina la captura de intencion inicial y su refinamiento.

#### Scenario: Single session produces final document
- **WHEN** el usuario completa la entrevista guiada por `/project-begin`
- **THEN** el sistema MUST crear `$SPECS_BASE/specs/projects/project-intent.md` usando el template `project-begin/templates/project-intent-template.md`

#### Scenario: No intermediate files created
- **WHEN** `/project-begin` completa su ejecucion
- **THEN** el sistema MUST NOT crear archivos intermedios como `initial-prompt.md`

### Requirement: project-begin uses project-pm
El skill `/project-begin` SHALL delegar la entrevista y la generacion del documento al `project-pm`.

#### Scenario: Agent is invoked correctly
- **WHEN** el skill ejecuta el paso de entrevista
- **THEN** el sistema MUST invocar `project-pm` como subagente

### Requirement: project-begin template exists
El directorio `.claude/skills/project-begin/templates/` SHALL contener `project-intent-template.md` como referencia de estructura para el documento de salida.

#### Scenario: Template is accessible to agent
- **WHEN** el `project-pm` necesita la estructura del documento
- **THEN** MUST poder leer `.claude/skills/project-begin/templates/project-intent-template.md`

### Requirement: project-begin confirms output with transition feedback
Al finalizar, el skill SHALL aplicar el patron de `transition-feedback`.

#### Scenario: Successful completion
- **WHEN** `project-intent.md` es creado exitosamente
- **THEN** el skill MUST confirmar al usuario con el path del documento y sugerir ejecutar `/project-discovery`

### Requirement: Resolución dinámica de ruta raíz en project-begin
El skill `project-begin` SHALL resolver la ruta base de artefactos mediante `SDDF_ROOT` antes de cualquier operación de lectura o escritura de archivos.

#### Scenario: Skill usa SDDF_ROOT para crear project-intent.md
- **WHEN** el usuario ejecuta `/project-begin` con `SDDF_ROOT` definida
- **THEN** el archivo `project-intent.md` se crea bajo `$SPECS_BASE/specs/projects/` donde `SPECS_BASE` es el valor de `SDDF_ROOT`

#### Scenario: Skill usa docs por defecto sin SDDF_ROOT
- **WHEN** el usuario ejecuta `/project-begin` sin `SDDF_ROOT` definida
- **THEN** el archivo `project-intent.md` se crea bajo `$SPECS_BASE/specs/projects/` (comportamiento previo)

## MODIFIED Requirements

### Requirement: project-begin produces project-intent.md
El skill `/project-begin` SHALL producir `project-intent.md` dentro del directorio del proyecto activo en `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/`, en una sola sesión interactiva. El skill MUST determinar el ID y nombre del proyecto durante la entrevista para construir la ruta de destino antes de escribir el archivo.

#### Scenario: Single session produces final document
- **WHEN** el usuario completa la entrevista guiada por `/project-begin` y confirma el ID `PROJ-01` con nombre `mi-proyecto`
- **THEN** el sistema MUST crear `{SPECS_BASE}/specs/projects/PROJ-01-mi-proyecto/project-intent.md` usando el template `project-begin/templates/project-intent-template.md`

#### Scenario: No intermediate files created
- **WHEN** `/project-begin` completa su ejecución
- **THEN** el sistema MUST NOT crear archivos intermedios ni escribir en `{SPECS_BASE}/specs/projects/` (ruta anterior)

### Requirement: project-begin checks WIP conflict before starting
Al inicio, el skill SHALL verificar si existe un proyecto activo buscando en `{SPECS_BASE}/specs/projects/` algún directorio cuyo `project.md` tenga `status: IN_PROGRESS`, aplicando la lógica de `wip-conflict-detection`.

#### Scenario: No WIP conflict
- **WHEN** ningún directorio en `{SPECS_BASE}/specs/projects/` contiene un `project.md` con `status: IN_PROGRESS`
- **THEN** el skill MUST continuar directamente a verificar precondiciones del template

#### Scenario: WIP conflict detected
- **WHEN** existe al menos un directorio en `{SPECS_BASE}/specs/projects/` con `project.md` en `status: IN_PROGRESS`
- **THEN** el skill MUST notificar y ofrecer las opciones definidas en `wip-conflict-detection`
