## Why

El MVP de ProjectSpecFactory (Release 1) permite recorrer el workflow completo end-to-end, pero los skills no tienen memoria de estado entre ejecuciones. Si un usuario interrumpe una fase, retoma días después, o reejecutata un comando sobre un documento ya completo, el sistema no detecta el contexto y puede sobrescribir trabajo o iniciar desde cero. Esto rompe el punto de dolor principal identificado en el discovery: la pérdida de contexto entre sesiones.

## What Changes

- Los tres orchestrators de skills (`ps-begin-intention`, `ps-discovery`, `ps-planning`) detectan automáticamente el `Estado:` del documento de su fase antes de actuar.
- Se define un comportamiento explícito para tres escenarios: documento inexistente (ejecutar normalmente), `Estado: Doing` (retomar), `Estado: Ready` (avisar antes de sobrescribir).
- Se agrega detección de conflicto WIP=1: al ejecutar `/ps-begin-intention` con proyectos en `Doing`, el sistema ofrece sobrescribir o retomar.
- Se formaliza el patrón de feedback al cierre de cada fase: path del documento generado + siguiente comando recomendado.

## Capabilities

### New Capabilities

- `skill-state-detection`: Lógica de detección del campo `Estado:` en los documentos de output al inicio de cada skill, con rama de comportamiento según el valor detectado.
- `project-retake`: Comportamiento de retoma cuando un documento está en `Estado: Doing` — el agente carga el documento existente y continúa desde la sección incompleta.
- `wip-conflict-detection`: Detección de conflicto WIP=1 en el skill `ps-begin-intention` cuando existe un proyecto activo, con prompt de decisión al usuario.
- `transition-feedback`: Patrón de cierre de fase que informa el path del documento generado y el siguiente comando del workflow.

### Modified Capabilities

- `ps-begin-intention-skill`: Añade detección de estado, retoma, WIP conflict detection e idempotencia al skill existente.
- `ps-discovery-skill`: Añade detección de estado, retoma e idempotencia al skill existente.
- `ps-planning-skill`: Añade detección de estado, retoma e idempotencia al skill existente.

## Impact

- Archivos modificados: `.claude/skills/ps-begin-intention/SKILL.md`, `.claude/skills/ps-discovery/SKILL.md`, `.claude/skills/ps-planning/SKILL.md`
- No se modifica ningún agente (product-manager-agent, architect-agent, ux-designer-agent)
- No se modifica ningún template de output
- Compatible con documentos ya generados en sesiones anteriores (lee `Estado:` del frontmatter existente)
- Non-goals: validación automática de placeholders `[...]` (FEAT-014, Release 3), UI de progreso, integración con herramientas externas
