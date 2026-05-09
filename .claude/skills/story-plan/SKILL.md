---
name: story-plan
description: >-
  Orquesta el flujo completo de planning de una historia SDD ejecutando story-design → story-tasking → story-analyze
  en secuencia con un solo comando. Usar siempre que el usuario quiera planificar una historia completa,
  generar design.md + tasks.md + analyze.md en un solo paso, ejecutar el pipeline de planning,
  o necesite el punto de entrada único al flujo de planning antes de implementar.
  Invocar también cuando el usuario mencione "planificar historia", "pipeline de planning",
  "preparar historia para implementar", "story-plan", "orquestar planning" o equivalentes.
alwaysApply: false
invocable: true
---

# Skill: /story-plan

Orquesta el flujo completo de planning de una historia SDD ejecutando los tres sub-skills en secuencia: `story-design → story-tasking → story-analyze`. Su propósito es **reducir la fricción del planning a un solo comando**, con fail-fast, visibilidad de progreso e idempotencia delegada.

## Posicionamiento

```
[story.md: SPECIFIED/DONE]  ← precondición implícita (viene de story-refine)
     ↓
story-plan   → Entry point: orquesta design → tasking → analyze  ← aquí
     │   Al iniciar: story.md → PLANNING/DOING
     ↓
  story-design  → design.md
  story-tasking → tasks.md
  story-analyze → analyze.md + story.md → PLANNED/DONE (si sin ERROREs)
     ↓
[story.md: PLANNED/DONE]   → listo para story-implement
──────────────────────────────────────────────────────────────
story.md     → What: requisitos, criterios de aceptación, comportamiento esperado
design.md    → How: arquitectura, componentes, interfaces, decisiones técnicas
tasks.md     → When: tareas de implementación, orden, seguimiento
analyze.md   → Check: coherencia entre los tres artefactos
```

## Ciclo de vida de estados en este skill

| Evento | status | substatus |
|--------|--------|-----------|
| Inicio del pipeline (siempre, sin condición) | `PLANNING` | `DOING` |
| `story-analyze` finaliza sin ERROREs | `PLANNED` | `DONE` (gestionado por `story-analyze`) |

La transición `PLANNING/DOING` se aplica **incondicionalmente** al iniciar, independientemente del estado previo de la historia. Esto permite re-ejecutar el pipeline sobre historias en cualquier estado.

**Qué hace este skill:**
- Invoca `story-design`, `story-tasking` y `story-analyze` en secuencia
- Implementa fail-fast: un fallo en cualquier paso detiene la cadena
- Delega la idempotencia a cada sub-skill (no implementa su propia lógica de "¿sobreescribir?")
- Muestra el progreso paso a paso con estados en tiempo real
- Presenta un resumen final del estado de los tres pasos

**Qué NO hace este skill:**
- Reimplementar la lógica de `story-design`, `story-tasking` ni `story-analyze`
- Permitir ejecución parcial (solo design + tasking sin analyze)
- Gestionar conflictos de artefactos por cuenta propia

---

## Modos de Ejecución

- **Modo manual** (`/story-plan {story_id}`): interactivo, muestra progreso en tiempo real
- **Modo Agent** (invocado por orquestador de nivel superior): automático, reporta resultado

---

## Paso 0 — Verificar entorno (`skill-preflight`)

Invocar el skill `skill-preflight` antes de cualquier operación.

El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar.

Si retorna `✗ Entorno inválido`, detener la ejecución inmediatamente. No invocar ningún sub-skill.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

## Paso 1 — Resolver Parámetros de Entrada

### 1a. Argumentos aceptados

- `{story_id}` — identificador de la historia (ej. `FEAT-057`)
- `{story_path}` — ruta explícita al directorio de la historia (opcional, sobreescribe la resolución por glob)
- `--skip-analyze` — omitir el paso `story-analyze` (útil si solo se quiere design + tasks)

Si no se proporcionó ningún argumento, preguntar:
```
¿Qué historia deseas planificar?
Proporciona el ID (ej. FEAT-057) o la ruta completa al directorio.
```

### 1b. Resolución del directorio de la historia

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `$SPECS_BASE/specs/stories/{story_id}-*/` — primera coincidencia cuyo nombre comienza con el ID
3. Si no se encuentra ninguno:
   ```
   ❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/stories/

   Verifica el ID o ejecuta /release-generate-stories para generar la historia.
   ```
   Detener la ejecución.

### 1c. Verificar existencia de `story.md`

Verificar que el directorio resuelto contiene `story.md`. Si no existe:
```
❌ No se encontró story.md en: <ruta>

La historia debe existir antes de ejecutar el pipeline de planning.
Sugerencia: ejecuta /release-generate-stories para generar la historia primero.
```
Detener la ejecución **sin invocar ningún sub-skill**.

### 1d. Actualizar frontmatter a PLANNING/DOING

Actualizar el frontmatter de `story.md` estableciendo `status: PLANNING` / `substatus: DOING`.

Esta actualización es **incondicional**: se aplica independientemente del estado previo de la historia. Si los campos `status`/`substatus` no existen, agregarlos.

Mostrar confirmación de inicio:
```
🚀 Iniciando pipeline de planning para: <story_id>
   Directorio: <ruta_directorio>
   Estado: PLANNING/DOING
   Pasos: story-design → story-tasking → story-analyze
```

---

## Paso 2 — Invocar `story-design` (Modo Agent)

Mostrar:
```
[1/3] → story-design...
```

Invocar el skill `story-design` en modo Agent con los siguientes parámetros:
- Directorio de la historia: la ruta resuelta en el Paso 1
- Modo: Agent (automático, sin confirmación interactiva)

Invocar el skill `story-design` por nombre; el runtime resolverá su ubicación. Pasar el directorio de la historia resuelto como contexto.

**Si `story-design` completa exitosamente:**
- Registrar estado: `✓`
- Mostrar: `[1/3] ✓ story-design — design.md generado`
- Continuar al Paso 3

**Si `story-design` falla:**
- Registrar estado: `✗`
- Mostrar:
  ```
  [1/3] ✗ story-design — FALLO
  
  Error: <descripción del error>
  
  Acción requerida: <instrucción para resolverlo>
  ```
- Registrar pasos no ejecutados: `story-tasking → —`, `story-analyze → —`
- Ir directamente al Paso 5 (resumen final con fallo)

---

## Paso 3 — Invocar `story-tasking` (Modo Agent)

Mostrar:
```
[2/3] → story-tasking...
```

Invocar el skill `story-tasking` en modo Agent con los siguientes parámetros:
- Directorio de la historia: la ruta resuelta en el Paso 1
- Modo: Agent (automático, sin confirmación interactiva)

Invocar el skill `story-tasking` por nombre; el runtime resolverá su ubicación. Pasar el directorio de la historia resuelto como contexto.

**Si `story-tasking` completa exitosamente:**
- Registrar estado: `✓`
- Mostrar: `[2/3] ✓ story-tasking — tasks.md generado`
- Continuar al Paso 4 (o saltar al Paso 5 si se especificó `--skip-analyze`)

**Si `story-tasking` falla:**
- Registrar estado: `✗`
- Mostrar:
  ```
  [2/3] ✗ story-tasking — FALLO
  
  Error: <descripción del error>
  
  Acción requerida: <instrucción para resolverlo>
  ```
- Registrar paso no ejecutado: `story-analyze → —`
- Ir directamente al Paso 5 (resumen final con fallo)

---

## Paso 4 — Invocar `story-analyze` (Modo Agent, no bloqueante)

Si se especificó `--skip-analyze`, saltar este paso y registrar estado: `—` (saltado por flag).

Mostrar:
```
[3/3] → story-analyze...
```

Invocar el skill `story-analyze` en modo Agent con los siguientes parámetros:
- Directorio de la historia: la ruta resuelta en el Paso 1
- Modo: Agent (automático, sin confirmación interactiva)

Invocar el skill `story-analyze` por nombre; el runtime resolverá su ubicación. Pasar el directorio de la historia resuelto como contexto.

**Si `story-analyze` completa sin inconsistencias:**
- Registrar estado: `✓`
- Mostrar: `[3/3] ✓ story-analyze — analyze.md generado, sin inconsistencias`

**Si `story-analyze` detecta inconsistencias (ERRORs o WARNINGs):**
- Registrar estado: `⚠️`
- Mostrar: `[3/3] ⚠️ story-analyze — inconsistencias detectadas (ver analyze.md)`
- **No detener la cadena** — continuar al Paso 5

**Si `story-analyze` falla con error técnico (no puede ejecutarse):**
- Registrar estado: `✗`
- Mostrar: `[3/3] ✗ story-analyze — error técnico`
- Continuar al Paso 5 (el plan no se bloquea por este fallo)

---

## Paso 5 — Resumen Final

Mostrar la tabla de estado acumulada:

```
─────────────────────────────────────────────────────
 Planning: <story_id> — <título de la historia>
─────────────────────────────────────────────────────
 Paso            │ Estado │ Artefacto
─────────────────────────────────────────────────────
 story-design    │   ✓    │ design.md
 story-tasking   │   ✓    │ tasks.md
 story-analyze   │   ✓    │ analyze.md
─────────────────────────────────────────────────────
```

Usar los estados registrados en los pasos anteriores. Leyenda de estados:
- `✓` — completado exitosamente
- `⚠️` — completado con inconsistencias detectadas
- `✗` — fallido
- `—` — no ejecutado (por fail-fast o flag --skip-analyze)

**Si todos los pasos completaron sin errores ni inconsistencias:**
```
✅ Planning completo

Todos los artefactos están listos. La historia puede pasar a implementación.
Estado de story.md: PLANNED/DONE ✓
```

**Si `story-analyze` reportó inconsistencias (⚠️):**
```
⚠️ Planning completado — requiere revisión

Se detectaron inconsistencias entre los artefactos. Revisa antes de implementar:
→ <ruta_directorio>/analyze.md

Estado de story.md: PLANNING/DOING (no actualizado — hay ERROREs pendientes)

Puedes ajustar design.md o tasks.md y re-ejecutar /story-analyze cuando estés listo.
```

**Si algún paso falló (✗):**
```
✗ Pipeline interrumpido en: <nombre_del_paso>

Los artefactos generados antes del fallo están disponibles en: <ruta_directorio>
Estado de story.md: PLANNING/DOING (no completado)
Corrige el problema indicado arriba y re-ejecuta /story-plan <story_id>.

Nota: al re-ejecutar, cada sub-skill preguntará si deseas sobreescribir los artefactos existentes.
```
