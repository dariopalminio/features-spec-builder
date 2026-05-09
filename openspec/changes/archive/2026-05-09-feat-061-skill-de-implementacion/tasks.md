## 1. Estructura del skill

- [x] 1.1 Crear directorio `.claude/skills/story-implement/` con subdirectorios `assets/` y `examples/input/` y `examples/output/`
- [x] 1.2 Crear `SKILL.md` con frontmatter YAML (`name: story-implement`, `description`, `alwaysApply: false`, `invocable: true`)

## 2. Lógica del skill — Paso 0 y Paso 1

- [x] 2.1 Paso 0: invocar `skill-preflight` y resolver `SPECS_BASE`
- [x] 2.2 Paso 1a: definir argumentos aceptados (`{story_id}`, `{story_path}`)
- [x] 2.3 Paso 1b: resolver el directorio de la historia (glob `$SPECS_BASE/specs/stories/{story_id}-*/`)
- [x] 2.4 Paso 1c: verificar existencia de `story.md`, `design.md` y `tasks.md`; detener con error descriptivo si alguno falta y sugerir `/story-plan`

## 3. Lógica del skill — Carga de contexto (Paso 2)

- [x] 3.1 Paso 2a: leer `story.md` y extraer criterios de aceptación (AC-1…AC-N)
- [x] 3.2 Paso 2b: leer `design.md` y extraer lista de componentes definidos (nombres de la sección "Componentes Afectados" o equivalente)
- [x] 3.3 Paso 2c: leer `tasks.md` y extraer lista de tareas pendientes (`- [ ] T\d+`)
- [x] 3.4 Paso 2d: si el número de tareas pendientes supera 20, emitir advertencia y sugerir `/story-split` antes de continuar

## 4. Lógica del skill — Implementación TDD por tarea (Paso 3)

- [x] 4.1 Paso 3a: para cada tarea pendiente en orden, verificar si los componentes mencionados en la descripción están presentes en la lista de componentes de `design.md`
- [x] 4.2 Paso 3b: si algún componente no está definido, marcar tarea como `- [~]` en `tasks.md` y registrarla como "requiere aclaración"; continuar con la siguiente tarea
- [x] 4.3 Paso 3c: si la tarea es implementable, generar primero el test (TDD) referenciando el AC correspondiente
- [x] 4.4 Paso 3d: generar el código de producción mínimo para satisfacer el test
- [x] 4.5 Paso 3e: marcar la tarea como `- [x]` en `tasks.md` inmediatamente al completarla
- [x] 4.6 Paso 3f: mostrar progreso en tiempo real (`[T001] → implementando…`, `[T001] ✓ completado`)

## 5. Lógica del skill — Reporte final (Paso 4)

- [x] 5.1 Generar `implement-report.md` en el directorio de la historia con tabla por tarea (ID, descripción, estado, archivos generados)
- [x] 5.2 Añadir sección "Tareas bloqueadas" si hay tareas en `- [~]` con la razón de cada bloqueo
- [x] 5.3 Si todos los pasos completaron sin bloqueos: mostrar `✅ Implementación completa`
- [x] 5.4 Si hay bloqueos: mostrar `⚠️ Implementación completada con tareas pendientes de aclaración`
- [x] 5.5 Añadir nota en el reporte: "Los tests generados deben ejecutarse manualmente con el runner del proyecto"

## 6. Assets y ejemplos

- [x] 6.1 Crear `assets/README.md` con descripción del skill y posicionamiento en el flujo SDD
- [x] 6.2 Crear `examples/input/story.md` con una historia de ejemplo válida
- [x] 6.3 Crear `examples/input/design.md` con el diseño técnico correspondiente
- [x] 6.4 Crear `examples/input/tasks.md` con las tareas de planificación correspondientes
- [x] 6.5 Crear `examples/output/implement-report.md` mostrando el reporte final esperado

## 7. Verificación

- [x] 7.1 Verificar que el skill aparece como `story-implement` en el sistema de skills de Claude Code
- [x] 7.2 Verificar fail-fast: ejecutar sobre un directorio sin `design.md` y confirmar el error descriptivo con sugerencia de `/story-plan`
- [x] 7.3 Verificar TDD: confirmar que al procesar una tarea se genera el test antes que el código de producción
- [x] 7.4 Verificar bloqueo no fatal: simular una tarea con componente no definido y confirmar que el skill continúa con las siguientes tareas
- [x] 7.5 Verificar actualización en tiempo real: confirmar que `tasks.md` se actualiza tarea por tarea y no en batch al final
