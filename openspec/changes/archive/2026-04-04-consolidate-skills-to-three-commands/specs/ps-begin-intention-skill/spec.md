## ADDED Requirements

### Requirement: ps-begin-intention skill exists and is invocable
El sistema SHALL incluir un skill en `.claude/skills/ps-begin-intention/SKILL.md` con frontmatter YAML válido (name, description) que sea invocable mediante el comando `/ps-begin-intention`.

#### Scenario: Skill is invocable
- **WHEN** el usuario ejecuta `/ps-begin-intention`
- **THEN** el sistema MUST cargar y ejecutar `.claude/skills/ps-begin-intention/SKILL.md`

### Requirement: ps-begin-intention produces project-intent.md
El skill `/ps-begin-intention` SHALL producir `docs/specs/project/project-intent.md` como único documento de salida, en una sola sesión interactiva que combina la captura de intención inicial y su refinamiento.

#### Scenario: Single session produces final document
- **WHEN** el usuario completa la entrevista guiada por `/ps-begin-intention`
- **THEN** el sistema MUST crear `docs/specs/project/project-intent.md` usando el template `ps-begin-intention/templates/project-intent-template.md`

#### Scenario: No intermediate files created
- **WHEN** `/ps-begin-intention` completa su ejecución
- **THEN** el sistema MUST NOT crear archivos intermedios como `initial-prompt.md`

### Requirement: ps-begin-intention uses product-manager-agent
El skill `/ps-begin-intention` SHALL delegar la entrevista y la generación del documento al `product-manager-agent`.

#### Scenario: Agent is invoked correctly
- **WHEN** el skill ejecuta el paso de entrevista
- **THEN** el sistema MUST invocar `product-manager-agent` como subagente

### Requirement: ps-begin-intention template exists
El directorio `.claude/skills/ps-begin-intention/templates/` SHALL contener `project-intent-template.md` como referencia de estructura para el documento de salida.

#### Scenario: Template is accessible to agent
- **WHEN** el `product-manager-agent` necesita la estructura del documento
- **THEN** MUST poder leer `.claude/skills/ps-begin-intention/templates/project-intent-template.md`
