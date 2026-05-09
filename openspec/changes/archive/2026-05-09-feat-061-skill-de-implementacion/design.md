## Context

El flujo SDD actual cubre hasta `story-analyze` (coherencia de artefactos), pero la fase de implementación no está automatizada. El desarrollador lee `tasks.md` manualmente y genera el código sin guía estructurada ni trazabilidad de progreso.

Estado actual: `story-design`, `story-tasking`, `story-analyze` y `story-plan` existen como skills independientes. `story-implement` es el último eslabón de la cadena, consume los tres artefactos de planning como entrada y produce el código de producción junto con un reporte final.

A diferencia de `story-plan` (que orquesta sub-skills), `story-implement` ejecuta directamente: el LLM es el implementador que lee los artefactos y genera el código tarea por tarea.

## Goals / Non-Goals

**Goals:**
- Leer `story.md`, `design.md` y `tasks.md` y ejecutar cada tarea pendiente en orden TDD
- Detectar antes de implementar cada tarea si sus componentes están definidos en `design.md`; si no, pausar esa tarea sin detener las demás
- Actualizar `tasks.md` en tiempo real conforme cada tarea se completa (`- [ ]` → `- [x]`)
- Generar `implement-report.md` con trazabilidad completa al finalizar

**Non-Goals:**
- Reimplementar la lógica de `story-design`, `story-tasking` ni `story-analyze`
- Ejecutar los tests generados (la validación de que pasan es responsabilidad del desarrollador)
- Gestionar dependencias entre repositorios externos
- Hacer rollback de código generado si una tarea posterior falla

## Decisions

### Decisión: El LLM como implementador directo (no sub-skills)

**Elegida:** `story-implement` actúa como skill ejecutor, no como orquestador. El LLM lee los artefactos de planning y genera el código directamente en la sesión, sin delegar a sub-skills. Cada tarea se procesa en secuencia: (1) leer AC relevante de `story.md` + componente de `design.md`, (2) escribir test fallido, (3) escribir código de producción mínimo, (4) refactorizar si aplica.

Alternativa descartada: crear un sub-skill `story-implement-task` invocado para cada tarea. Añade overhead de contexto sin beneficio real para un flujo lineal; el LLM ya mantiene el contexto de la sesión entre tareas.

Alternativa descartada: ejecutar los tests automáticamente vía Bash. Requiere conocer el runner de tests del proyecto (jest, pytest, go test…) y gestionar errores de entorno, lo que excede el alcance del skill y viola el principio KISS.

### Decisión: Parsing de tareas por convención de formato

**Elegida:** El skill identifica tareas pendientes buscando líneas con el patrón `- [ ] T\d+` en `tasks.md`. Los IDs secuenciales (`T001`, `T002`…) son la convención establecida por `story-tasking`. El skill procesa las tareas en el orden en que aparecen en el archivo.

Alternativa descartada: parsear YAML o JSON para las tareas. La convención Markdown de `tasks.md` es la fuente de verdad del framework; introducir otro formato violaría el principio de templates como fuente de verdad.

### Decisión: Verificación de componentes pre-implementación (pre-check por tarea)

**Elegida:** Antes de implementar cada tarea, el skill verifica si los componentes mencionados en la descripción de la tarea están definidos en `design.md` (sección "Componentes Afectados" o equivalente). Si algún componente no está definido, la tarea se marca como bloqueada y el skill continúa con la siguiente. El bloqueo se registra en `implement-report.md` como "requiere aclaración".

Esta verificación es heurística (búsqueda de nombres de componentes en el documento de diseño), no una validación sintáctica formal. Falsos negativos son aceptables; falsos positivos (marcar como bloqueada una tarea implementable) deben ser raros.

Alternativa descartada: detener toda la cadena ante el primer bloqueo. Rompe el principio de "continuar con las demás tareas" establecido en el AC de la historia, reduciendo el valor del skill.

### Decisión: Actualización incremental de tasks.md

**Elegida:** Tras completar (o bloquear) cada tarea, el skill actualiza inmediatamente el checkbox en `tasks.md`:
- Tarea completada: `- [ ]` → `- [x]`
- Tarea bloqueada: `- [ ]` → `- [~]` (tachado, convención de "bloqueado sin completar")

La actualización es por tarea, no en batch al final, para proveer visibilidad en tiempo real.

Alternativa descartada: usar un archivo separado de tracking. Duplica la fuente de verdad con `tasks.md`; la convención establecida en el framework es que `tasks.md` es el registro de progreso.

### Decisión: implement-report.md como artefacto de cierre

**Elegida:** Al finalizar todas las tareas, el skill genera `implement-report.md` en el directorio de la historia con: tabla de estado por tarea (ID, descripción, estado, archivos generados), lista de tareas bloqueadas con razón, y cualquier desviación del plan original documentada.

El reporte no se actualiza incrementalmente (solo se genera al final) para evitar contenido parcial que pueda confundir al desarrollador durante la sesión.

## Risks / Trade-offs

- **Ambigüedad en la descripción de tareas** → Las tareas en `tasks.md` pueden ser demasiado abstractas para implementar sin contexto adicional. Mitigación: el skill lee `design.md` completo antes de empezar; si una tarea sigue siendo ambigua, se marca como "requiere aclaración" en el reporte.
- **Tamaño del contexto en historias grandes** → Leer `story.md` + `design.md` + `tasks.md` + generar código para muchas tareas puede superar el límite de contexto. Mitigación: el skill advierte si `tasks.md` contiene más de 20 tareas y sugiere dividir la historia con `story-split`.
- **Falsos positivos en la verificación de componentes** → La búsqueda de nombres de componentes en `design.md` puede generar falsos positivos (marca tarea como bloqueada cuando es implementable). Trade-off aceptado: preferimos bloquear y reportar antes que generar código incorrecto.
- **TDD sin ejecución de tests** → El skill genera tests pero no los ejecuta. El desarrollador debe ejecutarlos manualmente. Documentado explícitamente en el reporte final.
