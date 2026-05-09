---
name: story-analyze
description: >-
  Analiza la coherencia entre story.md, design.md y tasks.md de una historia antes de implementar.
  Usar siempre que el usuario quiera verificar la alineación de artefactos de una historia, detectar
  inconsistencias entre el diseño y las tareas, auditar la cobertura de criterios de aceptación,
  o necesite el paso de validación previo a story-implement.
  Invocar también cuando el usuario mencione "analizar historia", "coherencia de artefactos",
  "verificar alineación", "auditar historia", "story-analyze", "inconsistencias de diseño",
  "chequear story antes de implementar" o equivalentes.
alwaysApply: false
invocable: true
---

# Skill: /story-analyze

Audita la coherencia entre los tres artefactos del trío SDD de una historia. Su propósito es **detectar desalineaciones antes de codificar**, reduciendo retrabajo en la fase de implementación.

El skill nunca modifica los artefactos que analiza. Solo lee, correlaciona y genera un reporte de coherencia.

## Posicionamiento

```
[story.md: PLANNING/IN‑PROGRESS]  ← seteado por story-plan al inicio del pipeline
     ↓
story.md   → What: requisitos, criterios de aceptación, comportamiento esperado
design.md  → How: arquitectura, componentes, interfaces, decisiones técnicas
tasks.md   → When: tareas de implementación, orden, seguimiento
analyze.md → Check: coherencia entre los tres ← aquí (ejecutar después de story-tasking)
     ↓
[story.md: READY-FOR-IMPLEMENT/DONE]    ← seteado por story-analyze si no hay ERROREs
```

## Ciclo de vida de estados en este skill

| Condición al finalizar | status | substatus |
|------------------------|--------|-----------|
| Sin inconsistencias ERROR-level | `READY-FOR-IMPLEMENT` | `DONE` |
| Con inconsistencias ERROR-level | `PLANNING` | `IN‑PROGRESS` (sin cambio — dejar como está) |

La actualización de estado ocurre tanto en modo manual como en modo Agent (invocado por `story-plan`).

**El análisis detecta:**
- Criterios de aceptación sin cobertura en design.md
- Tareas en tasks.md sin elemento de diseño asociado
- Elementos de diseño sin tarea correspondiente
- Objetivos de la historia desalineados con el release padre

**El análisis NO hace:**
- Modificar ningún artefacto analizado
- Generar diseño, tareas ni historia nuevos
- Corregir inconsistencias automáticamente

---

## Modos de Ejecución

- **Modo manual** (`/story-analyze {story_id}`): interactivo, muestra resumen y pide confirmación
- **Modo Agent** (invocado por orquestador): automático, guarda directamente sin confirmación y reporta al orquestador

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
- `{story_path}` — ruta explícita al directorio de la historia (opcional)
- `--output {path}` — ruta de salida del reporte (opcional)

Si no se proporcionó ningún argumento, preguntar:
```
¿Qué historia quieres analizar?
Proporciona el ID (ej. FEAT-059) o la ruta completa al directorio.
```

### 1b. Resolución del directorio de la historia

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `$SPECS_BASE/specs/stories/{story_id}-*/` — directorio cuyo nombre comienza con el ID
3. Si no se encuentra ninguno: notificar y detener
   ```
   ❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/stories/

   Verifica el ID o ejecuta /release-generate-stories para generar la historia.
   ```

### 1c. Verificación de story.md (obligatoria)

Verificar que el directorio resuelto contiene `story.md`. Si no existe, detener:
```
❌ No se encontró story.md en: <ruta>

Sugerencia: ejecuta /release-generate-stories para generar la historia primero.
```

### 1d. Verificación de design.md (obligatoria)

Verificar que el directorio resuelto contiene `design.md`. Si no existe, detener:
```
❌ No se encontró design.md en: <ruta>

El análisis de coherencia requiere el diseño técnico de la historia.
Sugerencia: ejecuta /story-design {story_id} para generar el diseño primero.
```

### 1e. Verificación de tasks.md (obligatoria)

Verificar que el directorio resuelto contiene `tasks.md`. Si no existe, detener:
```
❌ No se encontró tasks.md en: <ruta>

El análisis de coherencia requiere el plan de tareas de la historia.
Sugerencia: ejecuta /story-tasking {story_id} para generar las tareas primero.
```

### 1f. Resolución de la ruta de salida

1. Ruta explícita `--output {path}` si se proporcionó
2. `{directorio_historia}/analyze.md`

Si `analyze.md` ya existe en la ruta de salida, preguntar al usuario:
```
El archivo analyze.md ya existe en: <ruta>
¿Qué deseas hacer?
  (r) Regenerar — reemplazar el reporte existente
  (n) No modificar — saltar el análisis
```
- `n` / `no modificar`: informar que se saltó y terminar
- `r` / `regenerar`: continuar

---

## Paso 2 — Leer story.md y Extraer Requisitos

Leer `story.md` del directorio resuelto.

Extraer y registrar internamente:
- `story_id` del frontmatter (`id: FEAT-NNN`)
- `story_slug`, `story_title`, `story_parent` (release EPIC del frontmatter)
- **Criterios de aceptación numerados como AC-1, AC-2 … AC-N** — fuente de verdad del comportamiento esperado
- Requisitos no funcionales
- Objetivo de la historia (frase "Para ..." del user story)

Construir la tabla interna de ACs:
```
AC-1: <descripción>
AC-2: <descripción>
...
```

---

## Paso 3 — Leer design.md y Extraer Elementos de Diseño

Leer `design.md` del directorio resuelto.

Extraer y registrar internamente:
- **Componentes afectados**: nombre, acción, ubicación, AC referenciado (buscar `AC-{n}` o `satisface: AC-{n}` en el texto cercano)
- **Interfaces definidas**: nombre, contrato, AC referenciado
- **Decisiones técnicas**: descripción, AC relacionado (si aplica)
- **Flujos clave**: descripción de flujos documentados

Construir la tabla interna de cobertura de ACs en design.md:
```
AC-1: cubierto por [Componente X, Interfaz Y]
AC-2: ❌ sin cobertura detectada
```

Para detectar cobertura buscar:
1. Referencias explícitas `// satisface: AC-{n}` o `AC-{n}` junto a un componente/interfaz
2. Mención del nombre del AC o su concepto clave en la sección de componentes

Si el design.md no tiene anotaciones `satisface: AC-N`, realizar matching semántico: buscar si los conceptos clave del AC aparecen en los componentes y decisiones de diseño.

---

## Paso 4 — Leer tasks.md y Extraer Tareas

Leer `tasks.md` del directorio resuelto.

Extraer y registrar internamente:
- Lista de tareas con ID (`T001`, `T002`...) y descripción
- Agrupaciones (`##` de grupos) como contexto de área técnica
- Tareas de verificación de ACs (buscar menciones de `AC-{n}` en la descripción)

Construir la tabla interna de alineación tarea-diseño:
- Para cada tarea, determinar si existe un componente o interfaz en design.md que justifique la tarea
- Estrategia: buscar menciones de nombres de componentes del diseño en la descripción de la tarea, o si la tarea pertenece a un grupo cuyo nombre coincide con un componente del diseño

---

## Paso 5 — Verificar Alineación con el Release Padre (si existe)

### 5a. Localizar el release padre

Buscar el ID del release en el frontmatter `parent:` de story.md (ej. `EPIC-12-story-sdd-workflow`).

Intentar encontrar `$SPECS_BASE/specs/releases/{parent}-*/release.md`.

Si no existe: emitir advertencia y continuar sin verificación de release:
```
⚠️ No se encontró release.md para: <parent>
   La verificación de alineación con el release se omitirá.
```

### 5b. Leer objetivos del release

Si el release.md existe, extraer:
- Objetivos del release / descripción del épica
- Lista de features incluidas (buscar la feature correspondiente a la historia analizada)
- Restricciones o criterios del release

### 5c. Verificar alineación

Comparar:
- ¿El objetivo de la historia ("Para ..." del user story) está alineado con los objetivos del release?
- ¿La historia está listada como feature del release?
- ¿Existen restricciones del release que la historia no respeta?

Registrar internamente:
```
Release alineado: ✓ / ❌
  - Historia listada en release: ✓ / ❌
  - Objetivo alineado: ✓ / ❌ [descripción]
  - Restricciones respetadas: ✓ / ❌ [descripción]
```

---

## Paso 6 — Correlacionar y Detectar Inconsistencias

Con los datos de los Pasos 2-5, ejecutar las siguientes correlaciones:

### Correlación 1 — Cobertura de ACs en design.md

Para cada AC de story.md:
- ✓ **Cubierto**: existe al menos un componente, interfaz o decisión en design.md que lo referencia o cubre semánticamente
- ❌ **Sin cobertura**: ningún elemento del diseño cubre este AC

Registrar ACs sin cobertura como inconsistencia **TIPO A**.

### Correlación 2 — Tareas sin diseño asociado

Para cada tarea de tasks.md:
- ✓ **Con diseño**: su descripción o grupo corresponde a un componente/interfaz del diseño
- ❌ **Sin diseño**: no se puede trazar a ningún elemento del diseño

Registrar tareas sin diseño como inconsistencia **TIPO B**.

### Correlación 3 — Elementos de diseño sin tarea

Para cada componente e interfaz de design.md:
- ✓ **Con tarea**: existe al menos una tarea que lo implementa
- ⚠️ **Sin tarea**: ninguna tarea lo implementa

Registrar elementos sin tarea como inconsistencia **TIPO C** (advertencia, no error).

### Correlación 4 — Alineación con release

Si la verificación del release encontró desalineaciones:
- Registrar como inconsistencia **TIPO D**.

### Clasificación de severidad

| Tipo | Descripción | Severidad |
|---|---|---|
| A | AC sin cobertura en design.md | ERROR |
| B | Tarea sin diseño asociado | ERROR |
| C | Elemento de diseño sin tarea | WARNING |
| D | Desalineación con release | WARNING |

---

## Paso 7 — Leer el Template en Tiempo de Ejecución

Intentar localizar el template del reporte en este orden:
1. `$SPECS_BASE/specs/templates/analyze-report-template.md`
2. `assets/analyze-report-template.md` (relativo al directorio del skill)
3. Template de fallback interno (definido al final de este skill)

Informar qué template se está usando:
```
✓ Template: <ruta-del-template>  [externo | assets | fallback interno]
```

---

## Paso 8 — Generar el Reporte

Usar la estructura del template del Paso 7 como base.

Completar el frontmatter del reporte:
```yaml
type: analyze
id: <FEAT-NNN>
slug: {story_id}-analyze-report
title: "Analyze: <título>"
story: <FEAT-NNN>
design: <FEAT-NNN>
tasks: <FEAT-NNN>
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
related:                              
  - <slug-historia>
```

Completar el reporte con los resultados de la correlación del Paso 6:

- **Resumen ejecutivo**: estado general (✓ Coherente / ⚠️ Advertencias / ❌ Inconsistencias)
- **Tabla de cobertura de ACs**: cada AC + estado + elemento de diseño que lo cubre
- **Tabla de alineación tareas ↔ diseño**: cada tarea + estado + justificación
- **Tabla de cobertura diseño → tareas**: cada componente/interfaz + estado
- **Alineación con release**: estado + detalles
- **Inconsistencias detectadas**: lista numerada con tipo, descripción, archivo afectado, sección específica
- **Recomendaciones**: para cada inconsistencia, una acción concreta

**Regla crítica**: el reporte referencia secciones y líneas específicas de los archivos afectados para cada inconsistencia. No se admiten mensajes genéricos del tipo "el diseño no cubre este AC" sin indicar qué sección del diseño debería cubrirlo.

---

## Paso 9 — Guardar el Reporte y Actualizar Estado de la Historia

Guardar el reporte en la ruta resuelta en el Paso 1.

Si el directorio no existe, crearlo.

### 9a. Actualizar frontmatter de story.md

Después de guardar `analyze.md`, evaluar si hay inconsistencias de tipo ERROR (TIPO A o TIPO B de la correlación del Paso 6):

**Si no hay ERROREs (solo WARNINGs o todo OK):**
- Actualizar el frontmatter de `story.md`: `status: READY-FOR-IMPLEMENT` / `substatus: DONE`
- Esta actualización ocurre tanto en modo manual como en modo Agent

**Si hay ERROREs (inconsistencias bloqueantes):**
- NO actualizar el frontmatter de `story.md`
- El estado permanece en `PLANNING/IN‑PROGRESS` (o el que tuviera antes)
- Registrar internamente: `Estado story.md: PLANNING/IN‑PROGRESS (no actualizado — hay ERROREs)`

---

## Paso 10 — Confirmación Interactiva (solo modo manual)

Mostrar al usuario:

```
✅ Análisis guardado: <ruta>/analyze.md

📊 Resumen de coherencia:
   Historia: <FEAT-NNN> — <título>

   Cobertura de ACs:     <N>/<Total> criterios cubiertos en design.md
   Alineación tareas:    <N>/<Total> tareas con diseño asociado
   Cobertura de diseño:  <N>/<Total> elementos de diseño con tarea

   Release (<EPIC-NN>):  <alineado ✓ / desalineado ❌ / no verificado ⚠️>

   Inconsistencias:
   · <N> ERROR(ES) — requieren corrección antes de implementar
   · <N> WARNING(S) — revisar pero no bloquean

   Estado story.md: <READY-FOR-IMPLEMENT/DONE ✓ | PLANNING/IN‑PROGRESS — hay ERROREs pendientes>
```

Si hay ERROREs:
```
⛔ Se encontraron <N> inconsistencias bloqueantes.
   Corrige los ERROREs en design.md o tasks.md antes de comenzar la implementación.
   Sugerencias en: <ruta>/analyze.md → sección "Recomendaciones"

   Estado story.md: PLANNING/IN‑PROGRESS (no se actualizó a READY-FOR-IMPLEMENT — hay ERROREs)
```

Si solo hay WARNINGs o está todo OK:
```
✅ Sin inconsistencias bloqueantes. Puedes proceder con la implementación.
   Estado story.md: READY-FOR-IMPLEMENT/DONE ✓
```

---

## Template de Fallback

Usar solo si no se encontró ningún template externo en el Paso 7:

```markdown
---
type: analyze
id: {story_id}
slug: {story_id}-analyze
title: "Analyze: {story_title}"
story: {story_id}
design: {story_id}
tasks: {story_id}
created: {date}
updated: {date}
---

# Reporte de Coherencia: {story_title}

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | {ac_coverage_status} | {ac_coverage_N}/{ac_total} criterios cubiertos |
| Alineación tareas → diseño | {tasks_coverage_status} | {tasks_covered_N}/{tasks_total} tareas con diseño |
| Cobertura diseño → tareas | {design_coverage_status} | {design_covered_N}/{design_total} elementos con tarea |
| Alineación con release {parent} | {release_status} | {release_detail} |

**Estado general:** {overall_status}

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | {ac_1_desc} | ✓ / ❌ | {design_element} |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | {task_desc} | {design_element} | ✓ / ❌ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Ubicación en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| {component} | {section} | {task_id} | ✓ / ⚠️ |

---

## Alineación con Release

**Release padre:** {parent}

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en release | ✓ / ❌ | {detail} |
| Objetivo alineado | ✓ / ❌ | {detail} |
| Restricciones respetadas | ✓ / ❌ | {detail} |

---

## Inconsistencias Detectadas

<!-- Si no hay inconsistencias, escribir: Sin inconsistencias detectadas. -->

### INC-001 [ERROR / WARNING]

- **Tipo:** A / B / C / D
- **Descripción:** {description}
- **Archivo afectado:** {file} — sección "{section}"
- **Acción requerida:** {action}

---

## Recomendaciones

<!-- Para cada inconsistencia, una acción concreta con el archivo y sección a modificar. -->

1. {recommendation_1}
```
