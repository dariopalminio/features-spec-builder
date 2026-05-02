## ADDED Requirements

### Requirement: project-flow skill exists and is invocable
El sistema SHALL incluir un skill en `.claude/skills/project-flow/SKILL.md` con frontmatter YAML válido (name: project-flow, description) que sea invocable mediante el comando `/project-flow`.

#### Scenario: Skill is invocable
- **WHEN** el usuario ejecuta `/project-flow`
- **THEN** el sistema MUST cargar y ejecutar `.claude/skills/project-flow/SKILL.md`

### Requirement: project-flow detects completed phases at startup
Al iniciar, el skill SHALL leer el estado de los tres documentos de output (`project-intent.md`, `requirement-spec.md`, `project-plan.md`) y determinar desde qué fase debe comenzar.

#### Scenario: Pipeline virgin (no documents exist)
- **WHEN** ninguno de los tres documentos existe en `docs/specs/projects/`
- **THEN** el skill MUST iniciar desde la Fase 1 (project-begin)

#### Scenario: Pipeline partially complete
- **WHEN** `project-intent.md` tiene `Estado: Ready` pero `requirement-spec.md` no existe
- **THEN** el skill MUST saltar la Fase 1 e iniciar desde la Fase 2 (project-discovery)

#### Scenario: All phases complete
- **WHEN** los tres documentos tienen `Estado: Ready`
- **THEN** el skill MUST informar al usuario que el pipeline está completo y ofrecer rehacer desde el inicio

### Requirement: project-flow executes Phase 1 (Begin Intention)
El skill SHALL ejecutar la lógica de la fase Begin Intention delegando al agente `project-pm`, replicando el comportamiento de `/project-begin`.

#### Scenario: Phase 1 produces project-intent.md
- **WHEN** el agente `project-pm` completa la entrevista de intención
- **THEN** el sistema MUST crear o actualizar `docs/specs/projects/project-intent.md`

### Requirement: project-flow enforces review gate after each phase
Después de completar cada fase, el skill SHALL presentar al usuario el documento generado y solicitar confirmación explícita antes de marcar el documento como `Ready` y avanzar a la siguiente fase.

#### Scenario: User confirms phase completion
- **WHEN** el usuario confirma que el documento de la fase está completo
- **THEN** el skill MUST actualizar el campo `**Estado**: Doing` a `**Estado**: Ready` en el documento y continuar a la siguiente fase

#### Scenario: User requests changes
- **WHEN** el usuario indica que el documento necesita ajustes
- **THEN** el skill MUST ofrecer continuar la entrevista para completar secciones faltantes, sin avanzar a la siguiente fase

### Requirement: project-flow executes Phase 2 (Discovery)
El skill SHALL ejecutar la lógica de la fase Discovery delegando a `project-pm` y luego a `project-architect`, replicando el comportamiento de `/project-discovery`.

#### Scenario: Phase 2 requires Phase 1 to be Ready
- **WHEN** `project-intent.md` tiene `Estado: Ready`
- **THEN** el skill MUST ejecutar la Fase 2 usando ese documento como input

#### Scenario: Phase 2 produces requirement-spec.md
- **WHEN** `project-architect` completa la especificación
- **THEN** el sistema MUST crear o actualizar `docs/specs/projects/project.md`

### Requirement: project-flow executes Phase 3 (Planning)
El skill SHALL ejecutar la lógica de la fase Planning delegando al agente `project-architect`, replicando el comportamiento de `/project-planning`.

#### Scenario: Phase 3 requires Phase 2 to be Ready
- **WHEN** `requirement-spec.md` tiene `Estado: Ready`
- **THEN** el skill MUST ejecutar la Fase 3 usando ese documento como input

#### Scenario: Phase 3 produces project-plan.md
- **WHEN** `project-architect` completa el plan
- **THEN** el sistema MUST crear o actualizar `docs/specs/projects/project-plan.md`

### Requirement: project-flow completes with all documents in Ready state
Al finalizar exitosamente el pipeline completo, el skill SHALL confirmar al usuario que los tres documentos están en `Estado: Ready`.

#### Scenario: Full pipeline completion
- **WHEN** los tres documentos existen con `Estado: Ready`
- **THEN** el skill MUST mostrar un resumen con los paths de los tres documentos y confirmar que el pipeline está completo
