## MODIFIED Requirements

### Requirement: project-begin-intention skill exists and is invocable
El sistema SHALL incluir un skill en `.claude/skills/project-begin/SKILL.md` con frontmatter YAML valido (name, description) que sea invocable mediante el comando `/project-begin`.

#### Scenario: Skill is invocable
- **WHEN** el usuario ejecuta `/project-begin`
- **THEN** el sistema MUST cargar y ejecutar `.claude/skills/project-begin/SKILL.md`

### Requirement: project-begin-intention template exists
El directorio `.claude/skills/project-begin/templates/` SHALL contener `project-intent-template.md` como referencia de estructura para el documento de salida.

#### Scenario: Template is accessible to agent
- **WHEN** el `project-pm` necesita la estructura del documento
- **THEN** MUST poder leer `.claude/skills/project-begin/templates/project-intent-template.md`

### Requirement: project-begin-intention produces project-intent.md
El skill `/project-begin` SHALL producir `docs/specs/projects/project-intent.md` como unico documento de salida, en una sola sesion interactiva que combina la captura de intencion inicial y su refinamiento.

#### Scenario: Single session produces final document
- **WHEN** el usuario completa la entrevista guiada por `/project-begin`
- **THEN** el sistema MUST crear `docs/specs/projects/project-intent.md` usando el template `project-begin/templates/project-intent-template.md`

#### Scenario: No intermediate files created
- **WHEN** `/project-begin` completa su ejecucion
- **THEN** el sistema MUST NOT crear archivos intermedios como `initial-prompt.md`

### Requirement: project-begin-intention confirms output with transition feedback
Al finalizar, el skill SHALL aplicar el patron de `transition-feedback`.

#### Scenario: Successful completion
- **WHEN** `project-intent.md` es creado exitosamente
- **THEN** el skill MUST confirmar al usuario con el path del documento y sugerir ejecutar `/project-discovery`
