<!-- Referencias -->
[[FEAT-060-orquestacion-del-plan]]

## Why

El workflow de planning de historias SDD requiere ejecutar tres skills en secuencia (`story-design → story-tasking → story-analyze`), y actualmente el desarrollador debe invocarlos manualmente uno por uno, gestionando errores entre pasos. El skill `story-plan` proporciona un punto de entrada único que orquesta los tres pasos con fail-fast, visibilidad de progreso e idempotencia, reduciendo la fricción del flujo de planning a un solo comando.

## What Changes

- **Nuevo skill `/story-plan`**: orquesta `story-design → story-tasking → story-analyze` en secuencia. Si un paso falla, detiene la cadena y muestra el error con instrucciones para resolverlo. Al finalizar presenta un resumen del estado de cada paso.
- **Fail-fast**: un fallo en `story-design` impide que `story-tasking` y `story-analyze` se ejecuten, y ningún artefacto parcial queda sin referencia.
- **Idempotencia**: si `design.md`, `tasks.md` o `analyze.md` ya existen, el skill pregunta antes de sobreescribirlos (delegando la decisión al comportamiento de cada sub-skill).
- **Visibilidad**: el usuario ve el progreso paso a paso con estados `→ ejecutando`, `✓ completado`, `✗ fallido`.
- **Resumen final**: al terminar, muestra el estado de cada paso y — si `story-analyze` detectó inconsistencias — marca el plan como "requiere revisión" sin bloquear el acceso a los artefactos.

## Capabilities

### New Capabilities

- `story-plan-skill`: Skill orquestador que ejecuta el flujo completo de planning (`story-design → story-tasking → story-analyze`) para una historia con un solo comando. Implementa fail-fast, visibilidad de progreso e idempotencia delegada.

### Modified Capabilities

- `story-workflow-mvp`: Se añade `story-plan` como skill de entrada al flujo completo de planning de historias, complementando los skills individuales ya existentes.

## Impact

- **Nuevo directorio**: `.claude/skills/story-plan/` con `SKILL.md`, `assets/` y `examples/`
- **Sin cambios en skills existentes**: `story-design`, `story-tasking` y `story-analyze` no se modifican; `story-plan` los invoca como sub-skills
- **Compatibilidad**: multi-cliente — el skill usa solo instrucciones Markdown sin dependencias de runtime
