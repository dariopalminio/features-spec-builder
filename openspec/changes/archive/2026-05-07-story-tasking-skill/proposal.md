<!-- Referencias -->
[[FEAT-058-skill-para-tasking]]

## Why

El workflow SDD de SDDF tiene `story.md` (el qué) y `design.md` (el cómo), pero carece de un skill formal para generar `tasks.md` (el cuándo). Sin él, las tareas de implementación se crean ad-hoc, sin trazabilidad con los criterios de aceptación ni con la arquitectura documentada en el diseño.

## What Changes

- **Nuevo skill `story-tasking`** en `.claude/skills/story-tasking/SKILL.md` que lee `story.md` y `design.md` para generar `tasks.md` con tareas atómicas ordenadas por dependencias
- Cada tarea en `tasks.md` recibe ID secuencial (`T001`, `T002`...) y marcador `[P]` si es paralelizable
- El skill valida la existencia de `design.md` antes de ejecutar (fail-fast con sugerencia de `/story-design`)
- El skill valida la existencia de `tasks-template.md` (fail-fast sin fallback si no existe)
- Se crean artefactos de ejemplos (`examples/input/`, `examples/output/`) y `assets/README.md` siguiendo el patrón estructural estándar de skills SDDF

## Capabilities

### New Capabilities

- `story-tasking-skill`: Skill `/story-tasking` que transforma `story.md` + `design.md` en `tasks.md` con tareas concretas, ordenadas por dependencias lógicas y marcadas con `[P]` para paralelismo. Completa el trío story → design → tasks del workflow L1 de SDDF.

### Modified Capabilities

<!-- Sin cambios a capabilities existentes -->

## Impact

- **Archivos nuevos**: `.claude/skills/story-tasking/SKILL.md`, `assets/README.md`, `examples/input/story.md`, `examples/input/design.md`, `examples/output/tasks.md`
- **Template requerido** (ya existe): `docs/specs/templates/tasks-template.md`
- **Skill dependiente**: requiere que `/story-design` se haya ejecutado previamente (design.md presente)
- **Workflow L1 completado**: `/story-creation` → `/story-design` → `/story-tasking`
