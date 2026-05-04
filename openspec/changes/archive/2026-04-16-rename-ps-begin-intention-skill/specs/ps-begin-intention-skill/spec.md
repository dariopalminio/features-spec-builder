## RENAMED Requirements

### Requirement: ps-begin-intention skill exists and is invocable
FROM: ps-begin-intention skill exists and is invocable
TO: project-begin-intention skill exists and is invocable

### Requirement: ps-begin-intention checks WIP conflict before starting
FROM: ps-begin-intention checks WIP conflict before starting
TO: project-begin-intention checks WIP conflict before starting

### Requirement: ps-begin-intention reads existing document state
FROM: ps-begin-intention reads existing document state
TO: project-begin-intention reads existing document state

### Requirement: ps-begin-intention produces project-intent.md
FROM: ps-begin-intention produces project-intent.md
TO: project-begin-intention produces project-intent.md

### Requirement: ps-begin-intention uses product-manager-agent
FROM: ps-begin-intention uses product-manager-agent
TO: project-begin-intention uses product-manager-agent

### Requirement: ps-begin-intention template exists
FROM: ps-begin-intention template exists
TO: project-begin-intention template exists

### Requirement: ps-begin-intention confirms output with transition feedback
FROM: ps-begin-intention confirms output with transition feedback
TO: project-begin-intention confirms output with transition feedback

## MODIFIED Requirements

### Requirement: project-begin-intention skill exists and is invocable
El sistema SHALL incluir un skill en `.claude/skills/project-begin-intention/SKILL.md` con frontmatter YAML valido (name, description) que sea invocable mediante el comando `/project-begin-intention`.

#### Scenario: Skill is invocable
- **WHEN** el usuario ejecuta `/project-begin-intention`
- **THEN** el sistema MUST cargar y ejecutar `.claude/skills/project-begin-intention/SKILL.md`

### Requirement: project-begin-intention template exists
El directorio `.claude/skills/project-begin-intention/templates/` SHALL contener `project-intent-template.md` como referencia de estructura para el documento de salida.

#### Scenario: Template is accessible to agent
- **WHEN** el `product-manager-agent` necesita la estructura del documento
- **THEN** MUST poder leer `.claude/skills/project-begin-intention/templates/project-intent-template.md`

### Requirement: project-begin-intention produces project-intent.md
El skill `/project-begin-intention` SHALL producir `$SPECS_BASE/specs/projects/project-intent.md` como unico documento de salida, en una sola sesion interactiva que combina la captura de intencion inicial y su refinamiento.

#### Scenario: Single session produces final document
- **WHEN** el usuario completa la entrevista guiada por `/project-begin-intention`
- **THEN** el sistema MUST crear `$SPECS_BASE/specs/projects/project-intent.md` usando el template `project-begin-intention/templates/project-intent-template.md`

#### Scenario: No intermediate files created
- **WHEN** `/project-begin-intention` completa su ejecucion
- **THEN** el sistema MUST NOT crear archivos intermedios como `initial-prompt.md`

### Requirement: project-begin-intention confirms output with transition feedback
Al finalizar, el skill SHALL aplicar el patron de `transition-feedback`.

#### Scenario: Successful completion
- **WHEN** `project-intent.md` es creado exitosamente
- **THEN** el skill MUST confirmar al usuario con el path del documento y sugerir ejecutar `/project-discovery`
