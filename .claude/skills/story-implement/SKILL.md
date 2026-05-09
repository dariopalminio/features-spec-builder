---
name: story-implement
description: >-
  Implementa el código de una historia SDD tarea por tarea siguiendo TDD, generando primero el test
  y luego el código de producción mínimo. Lee story.md, design.md y tasks.md del directorio de la historia,
  actualiza tasks.md en tiempo real y genera implement-report.md al finalizar.
  Usar siempre que el usuario quiera implementar una historia, generar código tarea por tarea,
  ejecutar el ciclo TDD sobre una historia planificada, o completar el flujo SDD después de story-plan.
  Invocar también cuando el usuario mencione "implementar historia", "story-implement",
  "generar código de la historia", "implementar tareas", "codificar historia",
  "programar historia", "TDD historia", "ejecutar story-implement" o equivalentes.
alwaysApply: false
invocable: true
---

# Skill: /story-implement

Implementa una historia SDD tarea por tarea siguiendo TDD. Su propósito es **cerrar el ciclo completo de Spec-Driven Development** transformando los artefactos de planning (`story.md`, `design.md`, `tasks.md`) en código de producción con tests, trazabilidad completa y visibilidad de progreso en tiempo real.

## Posicionamiento

```
[story.md: READY-FOR-IMPLEMENT/DONE]    ← precondición requerida (viene de story-plan/story-analyze)
     ↓
story-implement  → Entry point de la implementación: ejecuta TDD tarea por tarea  ← aquí
     │   Al iniciar: story.md → IMPLEMENTING/IN‑PROGRESS
     │   Al finalizar: story.md → READY-FOR-CODE-REVIEW/DONE + release.md checklist actualizado
     ↓
[story.md: READY-FOR-CODE-REVIEW/DONE]
──────────────────────────────────────────────────────────────────────────────────────
story.md          → What: requisitos, criterios de aceptación, comportamiento esperado
design.md         → How: arquitectura, componentes, interfaces, decisiones técnicas
tasks.md          → When: tareas de implementación, orden, seguimiento
implement-report.md → Done: código generado, estado por tarea, bloqueos documentados ← aquí
story-plan        → Entry point del planning: orquesta design → tasking → analyze
story-implement   → Entry point de la implementación: ejecuta TDD tarea por tarea  ← aquí
```

## Ciclo de vida de estados en este skill

| Evento | status | substatus |
|--------|--------|-----------|
| Precondición requerida para ejecutar | `READY-FOR-IMPLEMENT` | `DONE` |
| Antes de la primera tarea (Paso 2) | `IMPLEMENTING` | `IN‑PROGRESS` |
| Después de generar `implement-report.md` (Paso 4) | `READY-FOR-CODE-REVIEW` | `DONE` |

**Precondición:** `story-implement` solo puede ejecutarse si `story.md` tiene `status: READY-FOR-IMPLEMENT` + `substatus: DONE`. Si la precondición no se cumple, la ejecución se detiene con error descriptivo.

**Qué hace este skill:**
- Lee los tres artefactos de planning como entrada
- Verifica precondiciones antes de implementar (fail-fast ante artefactos faltantes)
- Implementa cada tarea pendiente en orden TDD: test fallido → código mínimo → refactor si aplica
- Detecta tareas con componentes no definidos y las marca como bloqueadas sin detener el pipeline
- Actualiza `tasks.md` en tiempo real al completar o bloquear cada tarea
- Genera `implement-report.md` con trazabilidad completa al finalizar

**Qué NO hace este skill:**
- Reimplementar la lógica de `story-design`, `story-tasking` ni `story-analyze`
- Ejecutar los tests generados (responsabilidad del desarrollador)
- Gestionar dependencias externas ni hacer rollback de código generado
- Corregir inconsistencias entre artefactos (eso es trabajo de `story-analyze`)

---

## Modos de Ejecución

- **Modo manual** (`/story-implement {story_id}`): interactivo, muestra progreso en tiempo real
- **Modo Agent** (invocado por orquestador): automático, reporta resultado al finalizar

---

## Paso 0 — Verificar entorno (`skill-preflight`)

Invocar el skill `skill-preflight` antes de cualquier operación.

El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar.

Si retorna `✗ Entorno inválido`, detener la ejecución inmediatamente. No generar ningún archivo.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

## Paso 1 — Resolver Parámetros de Entrada

### 1a. Argumentos aceptados

- `{story_id}` — identificador de la historia (ej. `FEAT-059`)
- `{story_path}` — ruta explícita al directorio de la historia (opcional, sobreescribe la resolución por glob)

Si no se proporcionó ningún argumento, preguntar:
```
¿Qué historia deseas implementar?
Proporciona el ID (ej. FEAT-059) o la ruta completa al directorio.
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

### 1c. Verificar existencia de artefactos de planning

Verificar que el directorio resuelto contiene los tres artefactos requeridos:

**Si falta `story.md`:**
```
❌ No se encontró story.md en: <ruta>

La historia debe existir antes de ejecutar la implementación.
Sugerencia: ejecuta /release-generate-stories para generar la historia primero.
```

**Si falta `design.md`:**
```
❌ No se encontró design.md en: <ruta>

La implementación requiere el diseño técnico de la historia.
Sugerencia: ejecuta /story-plan {story_id} para generar los artefactos de planning.
```

**Si falta `tasks.md`:**
```
❌ No se encontró tasks.md en: <ruta>

La implementación requiere el plan de tareas de la historia.
Sugerencia: ejecuta /story-plan {story_id} para generar los artefactos de planning.
```

Si alguno de los tres artefactos falta, detener la ejecución **sin implementar ninguna tarea**.

### 1d. Verificar precondición de estado

Leer el frontmatter de `story.md` y verificar que `status: READY-FOR-IMPLEMENT` y `substatus: DONE`.

**Si la precondición NO se cumple:**
```
❌ La historia <story_id> no está en estado READY-FOR-IMPLEMENT/DONE.

   Estado actual: status: <valor_actual> / substatus: <valor_actual>

   story-implement requiere que el planning esté completo y sin ERROREs.
   Sugerencia: ejecuta /story-plan {story_id} para completar el planning.
   Si ya ejecutaste story-plan, verifica que story-analyze no reportó ERROREs.
```
Detener la ejecución **sin implementar ninguna tarea**.

**Si `status`/`substatus` no existen en el frontmatter**, tratar como `BACKLOG/TODO` y aplicar el mismo error anterior.

Mostrar confirmación de inicio:
```
🚀 Iniciando implementación para: <story_id>
   Directorio: <ruta_directorio>
   Artefactos: story.md ✓ | design.md ✓ | tasks.md ✓
   Estado: READY-FOR-IMPLEMENT/DONE ✓
```

---

## Paso 2 — Cargar Contexto de Planning

### 2a. Leer story.md y extraer criterios de aceptación

Leer `story.md` del directorio resuelto.

Extraer y registrar internamente:
- `story_id` del frontmatter
- `story_title` (título de la historia)
- **Criterios de aceptación numerados como AC-1, AC-2 … AC-N** — fuente de verdad del comportamiento esperado

Construir la tabla interna de ACs:
```
AC-1: <descripción>
AC-2: <descripción>
...
```

### 2b. Leer design.md y extraer componentes definidos

Leer `design.md` del directorio resuelto.

Extraer y registrar internamente:
- **Componentes afectados**: nombres de componentes de la sección "Componentes Afectados" o equivalente
- **Interfaces definidas**: nombre e información de contrato
- **Rutas de archivos** asociadas a cada componente (si están documentadas)

Construir la lista interna de componentes definidos:
```
[ComponenteA, ComponenteB, InterfazX, ...]
```

### 2c. Leer tasks.md y extraer tareas pendientes

Leer `tasks.md` del directorio resuelto.

Extraer:
- Lista de tareas con patrón `- [ ] T\d+` — tareas pendientes
- Lista de tareas con patrón `- [x] T\d+` — tareas ya completadas (no procesar)
- IDs de tareas (`T001`, `T002`...) y sus descripciones completas
- Agrupaciones por sección `##` como contexto de área técnica

### 2d. Verificar tamaño de la historia

Si el número de tareas pendientes supera 20, mostrar advertencia y pedir confirmación:
```
⚠️ Esta historia tiene <N> tareas pendientes.

Procesar más de 20 tareas en una sesión puede saturar el contexto del LLM y
reducir la calidad de la implementación.

Recomendación: divide la historia con /story-split antes de continuar.

¿Deseas continuar de todas formas? (s/n)
```

Si el usuario responde `n`, detener la ejecución.
Si el usuario responde `s` o si la invocación es en modo Agent, continuar.

Mostrar resumen de carga:
```
📋 Contexto cargado:
   ACs encontrados:        <N>
   Componentes en diseño:  <N>
   Tareas pendientes:      <N>
   Tareas ya completadas:  <N>
```

### 2e. Actualizar frontmatter a IMPLEMENTING/IN‑PROGRESS

Antes de ejecutar la primera tarea, actualizar el frontmatter de `story.md`:
- `status: IMPLEMENTING`
- `substatus: IN‑PROGRESS`

Esta actualización debe ocurrir antes de procesar cualquier tarea del Paso 3.

---

## Paso 3 — Implementar Tareas en Orden TDD

Para cada tarea pendiente (en el orden en que aparecen en `tasks.md`):

### 3a. Pre-check de componentes

Antes de implementar la tarea, verificar si los componentes mencionados en la descripción de la tarea están presentes en la lista de componentes de `design.md`.

Estrategia de matching:
1. Buscar nombres de componentes del diseño en el texto de la descripción de la tarea
2. Si la tarea pertenece a un grupo `##` cuyo nombre coincide con un componente del diseño, considerar implícitamente cubierta
3. Si la descripción de la tarea no menciona ningún componente conocido, considerar implementable (no bloquear por ambigüedad de naming)

### 3b. Si componente no definido → Bloquear tarea

Si la búsqueda detecta que la tarea menciona explícitamente un componente que **no existe** en `design.md`:

Marcar la tarea en `tasks.md` de inmediato:
```
- [~] T001: <descripción>
```

Registrar en la lista interna de bloqueos:
```
T001: Componente "<nombre>" no encontrado en design.md — requiere aclaración
```

Mostrar:
```
[T001] ⚠️ bloqueada — componente "<nombre>" no definido en design.md
```

Continuar con la siguiente tarea sin detener el pipeline.

### 3c. Si tarea es implementable → Ciclo TDD

Mostrar:
```
[T001] → implementando…
```

**Paso TDD-1: Generar test fallido**

Leer el AC correspondiente de la lista interna. Determinar el AC relevante para la tarea buscando referencias a `AC-N` en la descripción de la tarea o inferiendo por el contexto de la sección `##`.

Generar un archivo de test que:
- Importa / referencia los componentes que la tarea debe crear o modificar
- Verifica el comportamiento esperado descrito en el AC correspondiente
- Está escrito en el lenguaje y framework del proyecto (inferir de archivos existentes; si no hay referencia, usar el lenguaje más probable dado el stack en `constitution.md` o en el repo)
- Fallará inicialmente porque el código de producción aún no existe

Mostrar la ruta del test generado:
```
[T001]   📝 test: <ruta/del/test>
```

**Paso TDD-2: Generar código de producción mínimo**

Generar el código de producción mínimo necesario para:
- Satisfacer el test generado en TDD-1
- Respetar el contrato de interfaz definido en `design.md`
- Seguir las convenciones de código de `constitution.md`

No sobre-ingeniería: el código debe hacer pasar el test, nada más.

Mostrar la(s) ruta(s) de los archivos de producción generados:
```
[T001]   💻 código: <ruta/del/archivo>
```

**Paso TDD-3: Refactorizar (si aplica)**

Si el código generado tiene duplicaciones obvias, nombres poco claros, o puede simplificarse sin cambiar el comportamiento, aplicar refactor mínimo. No refactorizar por convención si el código ya es claro.

### 3d. Marcar tarea completada en tasks.md

Inmediatamente al completar los pasos TDD, actualizar `tasks.md`:
```
- [x] T001: <descripción>
```

La actualización es por tarea, no en batch al final.

### 3e. Mostrar progreso

```
[T001] ✓ completado
```

---

## Paso 4 — Generar Reporte Final y Actualizar Estado

Al finalizar el procesamiento de todas las tareas (completadas + bloqueadas), ejecutar los siguientes pasos en orden:

### 4a. Generar `implement-report.md`

Generar `implement-report.md` en el directorio de la historia.

El reporte **no se actualiza incrementalmente**: se genera como artefacto de cierre al finalizar todas las tareas.

### Estructura del reporte

```markdown
---
type: implement-report
id: <FEAT-NNN>
slug: <story_id>-implement-report
title: "Implement Report: <story_title>"
story: <FEAT-NNN>
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

# Reporte de Implementación: <story_title>

## Resumen

| Métrica | Valor |
|---|---|
| Historia | <FEAT-NNN> |
| Total de tareas | <N> |
| Tareas completadas | <N_completadas> |
| Tareas bloqueadas | <N_bloqueadas> |
| Tareas omitidas (ya completadas antes) | <N_previas> |
| Fecha de implementación | <YYYY-MM-DD> |

**Estado:** ✅ Implementación completa / ⚠️ Implementación completada con tareas pendientes de aclaración

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | <descripción> | ✓ completado | `ruta/test.ts`, `ruta/codigo.ts` |
| T002 | <descripción> | ⚠️ requiere aclaración | — |

---

## Tareas Bloqueadas

<!-- Solo si hay tareas en [~] -->

| Tarea | Razón del bloqueo | Acción recomendada |
|---|---|---|
| T002 | Componente "X" no encontrado en design.md | Definir "X" en design.md y re-ejecutar /story-implement |

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.

Pasos recomendados:
1. Ejecutar el suite de tests del proyecto
2. Si algún test falla, revisar el código generado y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
```

### 4b. Actualizar frontmatter a READY-FOR-CODE-REVIEW/DONE

Después de generar `implement-report.md`, actualizar el frontmatter de `story.md`:
- `status: READY-FOR-CODE-REVIEW`
- `substatus: DONE`

### 4c. Actualizar checklist del release padre

Leer el campo `parent` del frontmatter de `story.md` (ej. `EPIC-12-story-sdd-workflow`).

Buscar el archivo `release.md` correspondiente en: `$SPECS_BASE/specs/releases/<parent>-*/release.md`

**Si se encuentra `release.md`:**
- Localizar la línea que contiene el `story_id` (patrón `FEAT-NNN`) en el checklist del release
- Cambiar `- [ ]` por `- [x]` en esa línea
- Registrar: `Release checklist: ✓ actualizado en <ruta>/release.md`

**Si NO se encuentra `release.md` o la historia no está en el checklist:**
- Emitir WARNING en consola: `⚠️ No se pudo actualizar el release checklist: <razón>`
- Agregar en `implement-report.md` una sección de advertencia:
  ```
  ⚠️ Release checklist no actualizado: <razón>
  ```
- Continuar sin bloquear — la transición a `READY-FOR-CODE-REVIEW/DONE` ya fue aplicada

### 4d. Sección "Tareas Bloqueadas"

Incluir esta sección **solo si hay al menos una tarea con estado `- [~]`**. Listar cada tarea bloqueada con su razón de bloqueo y la acción recomendada para desbloquearla.

### 4e. Estado final del reporte

**Si todos los pasos completaron sin bloqueos:**
```
✅ Implementación completa

Todas las tareas han sido implementadas. Ejecuta los tests del proyecto para verificar.
```

**Si hay bloqueos:**
```
⚠️ Implementación completada con tareas pendientes de aclaración

<N> tarea(s) requieren aclaración antes de poder implementarse.
Revisa la sección "Tareas Bloqueadas" en implement-report.md para los detalles.
```

### 4f. Nota sobre los tests

Siempre añadir al reporte:
```
Los tests generados deben ejecutarse manualmente con el runner del proyecto.
```

---

## Resumen Final (mostrar al usuario)

Al terminar, mostrar:

```
─────────────────────────────────────────────────────────────
 Implementación: <story_id> — <story_title>
─────────────────────────────────────────────────────────────
 Tarea  │ Estado                │ Archivos
─────────────────────────────────────────────────────────────
 T001   │ ✓ completado          │ test_foo.ts, foo.ts
 T002   │ ⚠️ requiere aclaración │ —
 T003   │ ✓ completado          │ test_bar.ts, bar.ts
─────────────────────────────────────────────────────────────
 Total: <N> tareas │ <N_x> completadas │ <N_b> bloqueadas
─────────────────────────────────────────────────────────────

📄 Reporte generado: <ruta>/implement-report.md
📋 Estado story.md: READY-FOR-CODE-REVIEW/DONE ✓
📋 Release checklist: <✓ actualizado en <ruta>/release.md | ⚠️ no actualizado — <razón>>

✅ Implementación completa
```

O si hay bloqueos:

```
⚠️ Implementación completada con tareas pendientes de aclaración
   Revisa implement-report.md → sección "Tareas Bloqueadas"
📋 Estado story.md: READY-FOR-CODE-REVIEW/DONE ✓
📋 Release checklist: <✓ actualizado | ⚠️ no actualizado — <razón>>
```
