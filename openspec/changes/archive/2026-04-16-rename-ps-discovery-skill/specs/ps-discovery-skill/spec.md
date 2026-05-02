## RENAMED Requirements

### Requirement: ps-discovery skill exists and is invocable
FROM: ps-discovery skill exists and is invocable
TO: project-discovery skill exists and is invocable

### Requirement: ps-discovery reads existing document state
FROM: ps-discovery reads existing document state
TO: project-discovery reads existing document state

### Requirement: ps-discovery requires project-intent.md as input
FROM: ps-discovery requires project-intent.md as input
TO: project-discovery requires project-intent.md as input

### Requirement: ps-discovery produces requirement-spec.md
FROM: ps-discovery produces requirement-spec.md
TO: project-discovery produces requirement-spec.md

### Requirement: ps-discovery uses architect-agent as primary agent
FROM: ps-discovery uses architect-agent as primary agent
TO: project-discovery uses architect-agent as primary agent

### Requirement: ps-discovery template exists
FROM: ps-discovery template exists
TO: project-discovery template exists

### Requirement: ps-discovery confirms output with transition feedback
FROM: ps-discovery confirms output with transition feedback
TO: project-discovery confirms output with transition feedback

## MODIFIED Requirements

### Requirement: project-discovery skill exists and is invocable
El sistema SHALL incluir un skill en `.claude/skills/project-discovery/SKILL.md` con frontmatter YAML valido (name, description) que sea invocable mediante el comando `/project-discovery`.

#### Scenario: Skill is invocable
- **WHEN** el usuario ejecuta `/project-discovery`
- **THEN** el sistema MUST cargar y ejecutar `.claude/skills/project-discovery/SKILL.md`

### Requirement: project-discovery produces requirement-spec.md
El skill `/project-discovery` SHALL producir `docs/specs/projects/project.md` como unico documento de salida, en una sola sesion que combina discovery de usuarios y especificacion de requisitos.

#### Scenario: Single session produces final document
- **WHEN** el usuario completa la sesion guiada por `/project-discovery`
- **THEN** el sistema MUST crear `docs/specs/projects/project.md` usando el template `project-discovery/templates/project-template.md`

#### Scenario: No intermediate files created
- **WHEN** `/project-discovery` completa su ejecucion
- **THEN** el sistema MUST NOT crear archivos intermedios como `discovery.md` o `clarifications.md`

### Requirement: project-discovery template exists
El directorio `.claude/skills/project-discovery/templates/` SHALL contener `project-template.md` como referencia de estructura para el documento de salida.

#### Scenario: Template is accessible to agent
- **WHEN** el `architect-agent` necesita la estructura del documento
- **THEN** MUST poder leer `.claude/skills/project-discovery/templates/project-template.md`

### Requirement: project-discovery confirms output with transition feedback
Al finalizar, el skill SHALL aplicar el patron de `transition-feedback`.

#### Scenario: Successful completion
- **WHEN** `requirement-spec.md` es creado exitosamente
- **THEN** el skill MUST confirmar al usuario con el path del documento y sugerir ejecutar `/project-planning`
