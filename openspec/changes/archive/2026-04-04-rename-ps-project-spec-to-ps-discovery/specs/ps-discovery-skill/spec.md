## ADDED Requirements

### Requirement: ps-discovery skill exists and is invocable
El sistema SHALL incluir un skill en `.claude/skills/ps-discovery/SKILL.md` con frontmatter YAML válido (name, description) que sea invocable mediante el comando `/ps-discovery`.

#### Scenario: Skill is invocable
- **WHEN** el usuario ejecuta `/ps-discovery`
- **THEN** el sistema MUST cargar y ejecutar `.claude/skills/ps-discovery/SKILL.md`

### Requirement: ps-discovery requires project-intent.md as input
El skill `/ps-discovery` SHALL verificar que `docs/specs/project/project-intent.md` existe antes de proceder.

#### Scenario: Missing prerequisite blocks execution
- **WHEN** el usuario ejecuta `/ps-discovery` sin que exista `project-intent.md`
- **THEN** el sistema MUST informar al usuario que debe ejecutar `/ps-begin-intention` primero y detener la ejecución

### Requirement: ps-discovery produces requirement-spec.md
El skill `/ps-discovery` SHALL producir `docs/specs/project/requirement-spec.md` como único documento de salida, en una sola sesión que combina discovery de usuarios y especificación de requisitos.

#### Scenario: Single session produces final document
- **WHEN** el usuario completa la sesión guiada por `/ps-discovery`
- **THEN** el sistema MUST crear `docs/specs/project/requirement-spec.md` usando el template `ps-discovery/templates/requirement-spec-template.md`

#### Scenario: No intermediate files created
- **WHEN** `/ps-discovery` completa su ejecución
- **THEN** el sistema MUST NOT crear archivos intermedios como `discovery.md` o `clarifications.md`

### Requirement: ps-discovery uses architect-agent as primary agent
El skill `/ps-discovery` SHALL delegar la especificación al `architect-agent` como agente principal, con soporte del `product-manager-agent` para el discovery y del `ux-designer-agent` para flujos de usuario.

#### Scenario: Architect agent produces the spec
- **WHEN** el skill ejecuta la fase de especificación
- **THEN** el sistema MUST invocar `architect-agent` para generar `requirement-spec.md`

### Requirement: ps-discovery template exists
El directorio `.claude/skills/ps-discovery/templates/` SHALL contener `requirement-spec-template.md` como referencia de estructura para el documento de salida.

#### Scenario: Template is accessible to agent
- **WHEN** el `architect-agent` necesita la estructura del documento
- **THEN** MUST poder leer `.claude/skills/ps-discovery/templates/requirement-spec-template.md`
