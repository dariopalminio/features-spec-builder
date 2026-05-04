## ADDED Requirements

### Requirement: project-discovery skill exists and is invocable
El sistema SHALL incluir un skill en `.claude/skills/project-discovery/SKILL.md` con frontmatter YAML valido (name, description) que sea invocable mediante el comando `/project-discovery`.

#### Scenario: Skill is invocable
- **WHEN** el usuario ejecuta `/project-discovery`
- **THEN** el sistema MUST cargar y ejecutar `.claude/skills/project-discovery/SKILL.md`

### Requirement: project-discovery reads existing document state
El skill SHALL leer el campo `**Estado**:` de `$SPECS_BASE/specs/projects/project.md` si existe, aplicando la logica de `skill-state-detection`.

#### Scenario: Document in Doing state
- **WHEN** `requirement-spec.md` existe con `Estado: Doing`
- **THEN** el skill MUST activar el flujo de retoma definido en `project-retake`

#### Scenario: Document in Ready state
- **WHEN** `requirement-spec.md` existe con `Estado: Ready`
- **THEN** el skill MUST informar al usuario y solicitar confirmacion antes de sobrescribir

### Requirement: project-discovery requires project-intent.md as input
El skill `/project-discovery` SHALL verificar que `$SPECS_BASE/specs/projects/project-intent.md` existe y tiene `Estado: Ready` antes de proceder.

#### Scenario: Input present and Ready
- **WHEN** `project-intent.md` existe con `Estado: Ready`
- **THEN** el skill continua al siguiente paso sin interrumpir al usuario

#### Scenario: Input missing or Doing
- **WHEN** `project-intent.md` no existe o tiene `Estado: Doing`
- **THEN** el sistema MUST informar al usuario que debe ejecutar `/project-begin` primero y detener la ejecucion

### Requirement: project-discovery produces requirement-spec.md
El skill `/project-discovery` SHALL producir `$SPECS_BASE/specs/projects/project.md` como unico documento de salida, en una sola sesion que combina discovery de usuarios y especificacion de requisitos.

#### Scenario: Single session produces final document
- **WHEN** el usuario completa la sesion guiada por `/project-discovery`
- **THEN** el sistema MUST crear `$SPECS_BASE/specs/projects/project.md` usando el template `project-discovery/templates/project-template.md`

#### Scenario: No intermediate files created
- **WHEN** `/project-discovery` completa su ejecucion
- **THEN** el sistema MUST NOT crear archivos intermedios como `discovery.md` o `clarifications.md`

### Requirement: project-discovery uses project-architect as primary agent
El skill `/project-discovery` SHALL delegar la especificacion al `project-architect` como agente principal, con soporte del `project-pm` para el discovery y del `project-ux` para flujos de usuario.

#### Scenario: Architect agent produces the spec
- **WHEN** el skill ejecuta la fase de especificacion
- **THEN** el sistema MUST invocar `project-architect` para generar `requirement-spec.md`

### Requirement: project-discovery template exists
El directorio `.claude/skills/project-discovery/templates/` SHALL contener `project-template.md` como referencia de estructura para el documento de salida.

#### Scenario: Template is accessible to agent
- **WHEN** el `project-architect` necesita la estructura del documento
- **THEN** MUST poder leer `.claude/skills/project-discovery/templates/project-template.md`

### Requirement: project-discovery confirms output with transition feedback
Al finalizar, el skill SHALL aplicar el patron de `transition-feedback`.

#### Scenario: Successful completion
- **WHEN** `requirement-spec.md` es creado exitosamente
- **THEN** el skill MUST confirmar al usuario con el path del documento y sugerir ejecutar `/project-planning`

### Requirement: Resolución dinámica de ruta raíz en project-discovery
El skill `project-discovery` SHALL resolver la ruta base de artefactos mediante `SDDF_ROOT` antes de leer `project-intent.md` y escribir `requirement-spec.md`.

#### Scenario: Skill lee y escribe artefactos bajo SDDF_ROOT
- **WHEN** el usuario ejecuta `/project-discovery` con `SDDF_ROOT` definida
- **THEN** el skill lee `project-intent.md` desde `$SPECS_BASE/specs/projects/`
- **THEN** el skill escribe `requirement-spec.md` bajo `$SPECS_BASE/specs/projects/`

#### Scenario: Skill usa docs por defecto sin SDDF_ROOT
- **WHEN** el usuario ejecuta `/project-discovery` sin `SDDF_ROOT` definida
- **THEN** el skill opera sobre `$SPECS_BASE/specs/projects/` (comportamiento previo)

## ADDED Requirements

### Requirement: project-discovery resuelve el directorio del proyecto activo
El skill `project-discovery` SHALL localizar el proyecto activo buscando en `{SPECS_BASE}/specs/projects/` el directorio cuyo `project.md` tenga `status: IN_PROGRESS`. Toda lectura y escritura de artefactos del proyecto SHALL usar esa ruta como base.

#### Scenario: Proyecto activo encontrado
- **WHEN** existe exactamente un directorio en `{SPECS_BASE}/specs/projects/` con `project.md` en `status: IN_PROGRESS`
- **THEN** el skill MUST usar ese directorio como base para leer `project-intent.md` y escribir `requirement-spec.md`

#### Scenario: Proyecto activo no encontrado
- **WHEN** no existe ningún directorio en `{SPECS_BASE}/specs/projects/` con `status: IN_PROGRESS`
- **THEN** el skill MUST mostrar "No se encontró un proyecto activo en {SPECS_BASE}/specs/projects/" y detener la ejecución

### Requirement: project-discovery escribe requirement-spec.md en el directorio del proyecto
El artefacto `requirement-spec.md` generado por el skill SHALL guardarse en `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/project.md`, no en `{SPECS_BASE}/specs/projects/` (ruta anterior).

#### Scenario: Escritura de requirement-spec.md en la nueva ruta
- **WHEN** el skill completa el proceso de discovery
- **THEN** MUST escribir el archivo en `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/project.md`
- **THEN** MUST NOT escribir en `{SPECS_BASE}/specs/projects/project.md`
