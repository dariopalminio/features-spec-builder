## Context

El trío de artefactos SDD (story/design/tasks) puede acumular inconsistencias silenciosas: un criterio de aceptación sin diseño asociado, una tarea que no tiene contrapartida en el diseño, o un objetivo de historia que diverge del release padre. Estas desalineaciones se descubren tardíamente, durante la implementación, y generan retrabajo.

El skill `/story-analyze` es el cuarto artefacto del workflow de historias: actúa como gate de calidad entre `story-tasking` y la implementación. Su único output es `analyze.md` — un reporte de coherencia de solo lectura.

Estado actual del sistema: Los skills `story-design` y `story-tasking` existen y producen `design.md` y `tasks.md` respectivamente, pero no hay ningún paso que verifique la coherencia entre ellos antes de codificar.

## Goals / Non-Goals

**Goals:**
- Verificar que cada criterio de aceptación de story.md tiene cobertura en design.md
- Verificar que cada tarea de tasks.md tiene un elemento de diseño que la justifique
- Verificar que cada componente/interfaz de design.md tiene al menos una tarea correspondiente
- Verificar que los objetivos de la historia están alineados con el release padre (si existe)
- Producir un reporte `analyze.md` con inconsistencias clasificadas por severidad (ERROR / WARNING) y recomendaciones accionables

**Non-Goals:**
- Modificar story.md, design.md ni tasks.md — el skill es estrictamente no destructivo
- Generar automáticamente el diseño o las tareas faltantes
- Requerir anotaciones explícitas `satisface: AC-N` en design.md — el skill aplica matching semántico como fallback

## Decisions

### Decisión: Arquitectura — skill puro sin subagentes

**Elegida:** Skill orquestador directo que lee, correlaciona y escribe sin delegar a subagentes.

La correlación de tres archivos Markdown (story/design/tasks) es una tarea única con inputs bien acotados. No hay análisis paralelos que justifiquen subagentes. Seguir el patrón de `story-design` y `story-tasking` — ambos operan sin subagentes — mantiene la arquitectura simple y consistente.

Alternativa descartada: subagente `story-analyze-agent`. Añadiría complejidad innecesaria sin beneficio real para una operación de lectura secuencial sobre tres archivos.

### Decisión: Detección de cobertura de ACs — dos capas

**Elegida:** (1) referencias explícitas `AC-{n}` / `satisface: AC-{n}` en columnas de tablas del diseño; (2) matching semántico sobre conceptos clave del AC si no hay anotaciones.

Los design.md existentes en el proyecto ya usan la convención `satisface: AC-N` (ver `story-design` SKILL.md, P2). Cuando el diseño sigue esta convención, la detección es exacta. Para diseños anteriores al patrón o generados externamente, el matching semántico proporciona cobertura razonable sin requerir que el usuario retroalimente el diseño antes de poder analizar.

Alternativa descartada: exigir anotaciones obligatorias. Rompería la compatibilidad con historias cuyo design.md fue generado antes de FEAT-059.

### Decisión: Clasificación de inconsistencias — dos severidades

**Elegida:** ERROR (bloqueante) para ACs sin cobertura y tareas sin diseño; WARNING (no bloqueante) para elementos de diseño sin tarea y desalineación de release.

Los ERROREs indican riesgo real de implementar algo incorrecto o incompleto. Los WARNINGs indican trabajo potencialmente olvidado pero no necesariamente crítico (un componente de diseño puede cubrirse implícitamente por varias tareas; el release puede no estar documentado en el repositorio).

### Decisión: Template del reporte — ubicado en assets del skill

**Elegida:** `assets/analyze-report-template.md` dentro del skill, con ruta de fallback estándar `$SPECS_BASE/specs/templates/analyze-report-template.md`.

Sigue el patrón del fallback chain establecido en `story-design` y `story-tasking`: primero ruta externa configurable, luego assets del skill, luego template embebido. El template en assets es suficiente para el MVP; proyectos que necesiten personalización pueden sobrescribirlo en `$SPECS_BASE/specs/templates/`.

## Risks / Trade-offs

- **Matching semántico impreciso** → Mitigación: cuando el skill detecta cobertura por matching semántico (en lugar de anotación explícita), el reporte lo indica con `(inferido)` para que el usuario pueda validar manualmente.
- **Diseños muy largos o sin estructura tabular** → Mitigación: el skill busca referencias `AC-{n}` en todo el contenido del design.md, no solo en tablas. Si la cobertura no puede determinarse, marca el AC como `⚠️ sin detección confiable` en lugar de `❌ sin cobertura`.
- **Release padre no disponible** → Mitigación: la verificación de alineación con el release es opcional; si no existe el release.md, el skill emite un WARNING y continúa sin bloquear.
