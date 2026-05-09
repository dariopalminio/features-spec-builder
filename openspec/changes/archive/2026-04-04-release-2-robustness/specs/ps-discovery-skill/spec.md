## MODIFIED Requirements

### Requirement: Skill ps-discovery existe y es invocable
El sistema SHALL proveer un skill en `.claude/skills/ps-discovery/SKILL.md` que actúe como orchestrator del estado Discovery del pipeline.

#### Scenario: Skill se encuentra en la ruta esperada
- **WHEN** el usuario ejecuta `/ps-discovery`
- **THEN** Claude Code carga `.claude/skills/ps-discovery/SKILL.md` y lo ejecuta como skill

### Requirement: ps-discovery reads existing document state
El skill SHALL leer el campo `**Estado**:` de `$SPECS_BASE/specs/projects/project.md` si existe, aplicando la lógica de `skill-state-detection`.

#### Scenario: Document in IN‑PROGRESS state
- **WHEN** `requirement-spec.md` existe con `Estado: IN‑PROGRESS`
- **THEN** el skill MUST activar el flujo de retoma definido en `project-retake`

#### Scenario: Document in Ready state
- **WHEN** `requirement-spec.md` existe con `Estado: Ready`
- **THEN** el skill MUST informar al usuario y solicitar confirmación antes de sobrescribir

### Requirement: Verificación de precondición — input existe
Antes de delegar al agente, el skill SHALL verificar que `$SPECS_BASE/specs/projects/project-intent.md` existe y tiene `Estado: Ready`.

#### Scenario: Input presente y Ready
- **WHEN** `project-intent.md` existe con `Estado: Ready`
- **THEN** el skill continúa al siguiente paso sin interrumpir al usuario

#### Scenario: Input ausente o en IN‑PROGRESS
- **WHEN** `project-intent.md` no existe o tiene `Estado: IN‑PROGRESS`
- **THEN** el skill informa al usuario que debe completar la fase Begin Intention primero y detiene la ejecución

### Requirement: ps-discovery confirms output with transition feedback
Al finalizar, el skill SHALL aplicar el patrón de `transition-feedback`.

#### Scenario: Successful completion
- **WHEN** `requirement-spec.md` es creado exitosamente
- **THEN** el skill MUST confirmar al usuario con el path del documento y sugerir ejecutar `/ps-planning`
