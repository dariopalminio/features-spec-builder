<!-- Referencias -->
[[FEAT-061-skill-de-implementacion-el-programador-autonomo]]

## Why

El flujo SDD cubre especificación (`story.md`), diseño (`design.md`), planificación (`tasks.md`) y análisis de coherencia (`story-analyze`), pero la fase de implementación sigue siendo completamente manual. El skill `story-implement` cierra ese ciclo automatizando la generación de código tarea por tarea siguiendo TDD, con trazabilidad completa y progreso visible en tiempo real.

## What Changes

- **Nuevo skill `/story-implement`**: lee `story.md`, `design.md` y `tasks.md` para implementar cada tarea en orden, generando primero el test (TDD) y luego el código de producción. Actualiza `tasks.md` en tiempo real (`- [ ]` → `- [x]`) y genera un reporte final de implementación.
- **Fail-fast ante artefactos faltantes**: si `design.md` o `tasks.md` no existen, el skill se detiene e indica que debe ejecutarse `story-plan` primero.
- **Manejo no bloqueante de tareas inconsistentes**: si una tarea referencia un componente no definido en `design.md`, el skill pausa esa tarea, la registra como "requiere aclaración" en el reporte y continúa con las demás.
- **Reporte final de implementación**: al concluir, genera un resumen trazable con cada tarea por su ID (`T001`, `T002`…), el código generado y cualquier desviación del plan original.

## Capabilities

### New Capabilities

- `story-implement-skill`: Skill que automatiza la implementación TDD de una historia SDD. Lee los tres artefactos de planning (`story.md`, `design.md`, `tasks.md`), implementa cada tarea en secuencia siguiendo TDD, actualiza el progreso en `tasks.md` en tiempo real y genera un reporte final de implementación.

### Modified Capabilities

- `story-workflow-mvp`: Se añade `story-implement` como skill de cierre del flujo completo SDD (`story-plan → story-implement`), completando la cadena desde la especificación hasta el código.

## Impact

- **Nuevo directorio**: `.claude/skills/story-implement/` con `SKILL.md`, `assets/` y `examples/`
- **Sin cambios en skills existentes**: `story-plan`, `story-design`, `story-tasking` y `story-analyze` no se modifican; `story-implement` los consume como precondición
- **Compatibilidad**: multi-cliente — el skill usa solo instrucciones Markdown sin dependencias de runtime
- **Artefacto nuevo generado**: `implement-report.md` en el directorio de la historia con el reporte final de implementación
