## ADDED Requirements

### Requirement: Skill ps-discovery existe y es invocable
El sistema SHALL proveer un skill en `.claude/skills/ps-discovery/SKILL.md` que actúe como orchestrator del estado Discovery del pipeline.

#### Scenario: Skill se encuentra en la ruta esperada
- **WHEN** el usuario ejecuta `/ps-discovery`
- **THEN** Claude Code carga `.claude/skills/ps-discovery/SKILL.md` y lo ejecuta como skill

### Requirement: Verificación de precondición — input existe
Antes de delegar al agente, el skill SHALL verificar que `docs/specs/project-intent.md` existe.

#### Scenario: Input presente
- **WHEN** `docs/specs/project-intent.md` existe
- **THEN** el skill continúa al siguiente paso sin interrumpir al usuario

#### Scenario: Input ausente
- **WHEN** `docs/specs/project-intent.md` no existe
- **THEN** el skill informa al usuario que debe completar la fase Draft primero y detiene la ejecución sin invocar al agente

### Requirement: Verificación de precondición — template existe
El skill SHALL verificar que `.claude/skills/ps-discovery/templates/discovery-template.md` existe antes de delegar.

#### Scenario: Template presente
- **WHEN** el template existe en la ruta esperada
- **THEN** el skill continúa al siguiente paso

#### Scenario: Template ausente
- **WHEN** el template no existe
- **THEN** el skill informa al usuario que el template falta y detiene la ejecución

### Requirement: Delegación al discovery-agent
El skill SHALL invocar al `discovery-agent` con una instrucción explícita que incluya las rutas del input y del template.

#### Scenario: Delegación exitosa
- **WHEN** ambas precondiciones se cumplen
- **THEN** el skill lanza el `discovery-agent` indicando que lea `project-intent.md` y `.claude/skills/ps-discovery/templates/discovery-template.md`, conduzca la entrevista y escriba `docs/specs/discovery.md`

### Requirement: Confirmación del output
Al finalizar el agente, el skill SHALL verificar que `docs/specs/discovery.md` fue generado.

#### Scenario: Output generado correctamente
- **WHEN** `docs/specs/discovery.md` existe tras la ejecución del agente
- **THEN** el skill confirma al usuario con un mensaje de éxito y sugiere continuar con `/ps-specify`

#### Scenario: Output ausente tras ejecución
- **WHEN** `docs/specs/discovery.md` no existe tras la ejecución del agente
- **THEN** el skill informa al usuario que algo salió mal y sugiere re-ejecutar `/ps-discovery`
