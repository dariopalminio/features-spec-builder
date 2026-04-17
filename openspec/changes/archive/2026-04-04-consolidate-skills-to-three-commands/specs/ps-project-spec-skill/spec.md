## ADDED Requirements

### Requirement: ps-project-spec skill exists and is invocable
El sistema SHALL incluir un skill en `.claude/skills/ps-project-spec/SKILL.md` con frontmatter YAML válido (name, description) que sea invocable mediante el comando `/ps-project-spec`.

#### Scenario: Skill is invocable
- **WHEN** el usuario ejecuta `/ps-project-spec`
- **THEN** el sistema MUST cargar y ejecutar `.claude/skills/ps-project-spec/SKILL.md`

### Requirement: ps-project-spec requires project-intent.md as input
El skill `/ps-project-spec` SHALL verificar que `docs/specs/project/project-intent.md` existe antes de proceder.

#### Scenario: Missing prerequisite blocks execution
- **WHEN** el usuario ejecuta `/ps-project-spec` sin que exista `project-intent.md`
- **THEN** el sistema MUST informar al usuario que debe ejecutar `/ps-begin-intention` primero y detener la ejecución

### Requirement: ps-project-spec produces requirement-spec.md
El skill `/ps-project-spec` SHALL producir `docs/specs/project/requirement-spec.md` como único documento de salida, en una sola sesión que combina discovery de usuarios y especificación de requisitos.

#### Scenario: Single session produces final document
- **WHEN** el usuario completa la sesión guiada por `/ps-project-spec`
- **THEN** el sistema MUST crear `docs/specs/project/requirement-spec.md` usando el template `ps-project-spec/templates/requirement-spec-template.md`

#### Scenario: No intermediate files created
- **WHEN** `/ps-project-spec` completa su ejecución
- **THEN** el sistema MUST NOT crear archivos intermedios como `discovery.md` o `clarifications.md`

### Requirement: ps-project-spec uses architect-agent as primary agent
El skill `/ps-project-spec` SHALL delegar la especificación al `architect-agent` como agente principal, con soporte del `product-manager-agent` para el discovery y del `ux-designer-agent` para flujos de usuario.

#### Scenario: Architect agent produces the spec
- **WHEN** el skill ejecuta la fase de especificación
- **THEN** el sistema MUST invocar `architect-agent` para generar `requirement-spec.md`

### Requirement: ps-project-spec template exists
El directorio `.claude/skills/ps-project-spec/templates/` SHALL contener `requirement-spec-template.md` como referencia de estructura para el documento de salida.

#### Scenario: Template is accessible to agent
- **WHEN** el `architect-agent` necesita la estructura del documento
- **THEN** MUST poder leer `.claude/skills/ps-project-spec/templates/requirement-spec-template.md`
