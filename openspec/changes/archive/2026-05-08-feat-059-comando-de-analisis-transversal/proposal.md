<!-- Referencias -->
[[FEAT-059-comando-de-analisis-transversal]]

## Why

El workflow de historias SDD carece de un punto de auditoría entre `story-tasking` y la implementación: los desarrolladores inician el código sin saber si los tres artefactos (story.md, design.md, tasks.md) están alineados, lo que genera retrabajo cuando se descubren inconsistencias durante el sprint. El skill `/story-analyze` cierra esta brecha proporcionando un reporte de coherencia automatizado antes de codificar.

## What Changes

- **Nuevo skill `/story-analyze`**: audita la coherencia entre story.md, design.md y tasks.md de una historia. Genera `analyze.md` con tablas de cobertura de criterios de aceptación, alineación tareas ↔ diseño, cobertura diseño → tareas y verificación de alineación con el release padre.
- **No destructivo**: el skill nunca modifica los artefactos que analiza; solo lee, correlaciona y reporta.
- **Template `analyze-report-template.md`**: nuevo template canónico para el reporte de coherencia ubicado en `assets/analyze-report-template.md` dentro del skill.
- **Posicionamiento en el flujo**: se ejecuta después de `story-tasking` y antes de la implementación, como gate de calidad opcional.

## Capabilities

### New Capabilities

- `story-analyze-skill`: Skill de auditoría de coherencia del trío SDD (story/design/tasks). Verifica cobertura de ACs, alineación tareas ↔ diseño, y alineación con el release padre. Genera `analyze.md` como artefacto de salida de solo lectura.

### Modified Capabilities

- `story-workflow-mvp`: Se añade el paso de análisis (`/story-analyze`) al workflow de historias, posicionado entre `story-tasking` y la fase de implementación como validación opcional pre-código.

## Impact

- **Nuevo directorio**: `.claude/skills/story-analyze/` con `SKILL.md`, `assets/`, `examples/`
- **Sin cambios en artefactos existentes**: story.md, design.md, tasks.md no se modifican
- **Compatibilidad**: multi-cliente (Claude Code, OpenCode, GitHub Copilot, Gemini) — el skill usa solo instrucciones Markdown sin dependencias de runtime
