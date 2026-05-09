## 1. Estructura del skill

- [x] 1.1 Crear directorio `.claude/skills/story-plan/` con subdirectorios `assets/` y `examples/input/` y `examples/output/`
- [x] 1.2 Crear `SKILL.md` con frontmatter YAML (`name: story-plan`, `description`, `alwaysApply: false`, `invocable: true`)

## 2. Lógica del skill — Paso 0 y Paso 1

- [x] 2.1 Paso 0: invocar `skill-preflight` y resolver `SPECS_BASE`
- [x] 2.2 Paso 1a: definir argumentos aceptados (`{story_id}`, `{story_path}`, `--skip-analyze`)
- [x] 2.3 Paso 1b: resolver el directorio de la historia (glob `$SPECS_BASE/specs/stories/{story_id}-*/`)
- [x] 2.4 Paso 1c: verificar existencia de `story.md`; detener con error descriptivo si no existe

## 3. Lógica del skill — Orquestación (Pasos 2–4)

- [x] 3.1 Paso 2: invocar `story-design` en modo Agent con el directorio resuelto; capturar estado (✓ / ✗); detener cadena si falla
- [x] 3.2 Paso 3: invocar `story-tasking` en modo Agent con el directorio resuelto; capturar estado (✓ / ✗); detener cadena si falla
- [x] 3.3 Paso 4: invocar `story-analyze` en modo Agent con el directorio resuelto; capturar estado (✓ / ⚠️ inconsistencias / ✗ error); NO detener cadena si detecta inconsistencias

## 4. Lógica del skill — Resumen final (Paso 5)

- [x] 4.1 Paso 5: mostrar resumen tabular con el estado de cada paso (✓ / ⚠️ / ✗ / —)
- [x] 4.2 Si `story-analyze` reportó inconsistencias: añadir sección "⚠️ requiere revisión" con pointer a `analyze.md`
- [x] 4.3 Si todos los pasos completaron sin errores: mostrar mensaje "✅ Planning completo"

## 5. Assets y ejemplos

- [x] 5.1 Crear `assets/README.md` con descripción del skill y posicionamiento en el flujo
- [x] 5.2 Crear `examples/input/story.md` con una historia de ejemplo válida
- [x] 5.3 Crear `examples/output/plan-summary.md` mostrando el resumen final esperado del skill

## 6. Specs OpenSpec

- [x] 6.1 Crear `openspec/changes/feat-060-*/specs/story-plan-skill/spec.md` con los 6 requisitos y 8 escenarios de la nueva capability
- [x] 6.2 Crear `openspec/changes/feat-060-*/specs/story-workflow-mvp/spec.md` con ADDED + MODIFIED para incluir `story-plan` en la lista de skills canónicos

## 7. Verificación

- [x] 7.1 Verificar que el skill aparece como `story-plan` en el sistema de skills de Claude Code
- [x] 7.2 Ejecutar `/story-plan FEAT-060` sobre la historia del mismo FEAT-060 y confirmar que genera `design.md`, `tasks.md` y `analyze.md`
- [x] 7.3 Verificar fail-fast: ejecutar sobre un directorio sin `story.md` y confirmar el error descriptivo
- [x] 7.4 Verificar resumen "requiere revisión": simular que `story-analyze` detecta inconsistencias y confirmar que el plan no bloquea al usuario
