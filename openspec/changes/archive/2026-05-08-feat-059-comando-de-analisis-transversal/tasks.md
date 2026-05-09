## 1. Estructura del skill

- [ ] 1.1 Crear directorio `.claude/skills/story-analyze/` con subdirectorios `assets/` y `examples/input/` y `examples/output/`
- [ ] 1.2 Crear `SKILL.md` con frontmatter YAML (`name`, `description`, `alwaysApply`, `invocable`) e instrucciones completas de los 10 pasos

## 2. Assets y template

- [ ] 2.1 Crear `assets/README.md` apuntando al template canónico en `$SPECS_BASE/specs/templates/analyze-report-template.md`
- [ ] 2.2 Crear `assets/analyze-report-template.md` con la estructura del reporte de coherencia (frontmatter + tablas de cobertura de ACs, alineación tareas ↔ diseño, cobertura diseño → tareas, alineación release, inconsistencias, recomendaciones)

## 3. Lógica del skill (SKILL.md)

- [ ] 3.1 Paso 0: invocar `skill-preflight` y resolver `SPECS_BASE`
- [ ] 3.2 Paso 1: resolver parámetros — `{story_id}`, `{story_path}`, `--output`; verificar existencia de los tres artefactos (`story.md`, `design.md`, `tasks.md`); mensajes de error con sugerencias al skill correcto si falta alguno
- [ ] 3.3 Pasos 2–4: extraer ACs de story.md, componentes/interfaces de design.md y tareas de tasks.md; construir tablas internas de correlación
- [ ] 3.4 Paso 5: localizar `release.md` del release padre desde el frontmatter `parent:` de story.md; verificar alineación de objetivos; continuar con WARNING si no existe
- [ ] 3.5 Paso 6: correlacionar los cuatro tipos de inconsistencia (A: AC sin cobertura, B: tarea sin diseño, C: diseño sin tarea, D: desalineación release) y clasificar como ERROR o WARNING
- [ ] 3.6 Pasos 7–10: leer template, generar reporte completando el template, guardar `analyze.md`, mostrar resumen interactivo en modo manual

## 4. Ejemplos

- [ ] 4.1 Crear `examples/input/story.md`, `examples/input/design.md`, `examples/input/tasks.md` con una historia de ejemplo coherente
- [ ] 4.2 Crear `examples/output/analyze.md` con el reporte resultante del análisis de los archivos de entrada

## 5. Specs OpenSpec

- [ ] 5.1 Crear `openspec/changes/feat-059-*/specs/story-analyze-skill/spec.md` con los requisitos y escenarios de la nueva capability
- [ ] 5.2 Crear `openspec/changes/feat-059-*/specs/story-workflow-mvp/spec.md` con el MODIFIED del requisito de skills canónicos para incluir `story-analyze`

## 6. Verificación

- [ ] 6.1 Verificar que el skill se lista en el sistema de skills de Claude Code (aparece en `system-reminder` como `story-analyze`)
- [ ] 6.2 Ejecutar `/story-analyze FEAT-059` apuntando a la historia implementada y confirmar que genera `analyze.md` sin errores
- [ ] 6.3 Verificar escenario de artefacto faltante: apuntar a un directorio sin `design.md` y confirmar el mensaje de error con sugerencia de `/story-design`
