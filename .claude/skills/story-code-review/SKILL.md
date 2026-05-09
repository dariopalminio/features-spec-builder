---
name: story-code-review
description: >-
  Ejecuta una revisión multi-agente del código implementado en una historia SDD, lanzando en paralelo
  tres subagentes especializados (Inspector de Código, Guardián de Requisitos, Inspector de Integración)
  y consolidando sus hallazgos en un code-review-report.md. Genera review-status: approved cuando no
  hay hallazgos de severidad HIGH o MEDIUM, y actualiza story.md a READY-FOR-VERIFY/IN-PROGRESS.
  Usar siempre que el usuario quiera revisar el código de una historia implementada, validar que la
  implementación cumple los criterios de aceptación y la arquitectura antes de marcar Done,
  o ejecutar el quality gate posterior a story-implement.
  Invocar también cuando el usuario mencione "revisar código", "code review", "story-code-review",
  "revisión multi-agente", "quality gate post-implement", "validar implementación" o equivalentes.
alwaysApply: false
invocable: true
outputs:
  - $SPECS_BASE/specs/stories/FEAT-NNN/code-review-report.md
  - $SPECS_BASE/specs/stories/FEAT-NNN/fix-directives.md (solo si needs-changes)
  - .tmp/story-code-review/tech-lead-report.md
  - .tmp/story-code-review/product-owner-report.md
  - .tmp/story-code-review/integration-report.md
---

# Skill: /story-code-review

Quality gate formal entre `/story-implement` y la marca final de Done. Lanza tres subagentes revisores en paralelo, consolida sus hallazgos y genera `code-review-report.md` con la decisión final.

## Posicionamiento

```
[story.md: READY-FOR-CODE-REVIEW/DONE]   ← precondición requerida (viene de story-implement)
     ↓
story-code-review  → Quality gate: revisión multi-agente del código  ← aquí
     │   Al iniciar: story.md → CODE-REVIEW/IN-PROGRESS
     │   Al finalizar (approved): story.md → READY-FOR-VERIFY/DONE
     │   Al finalizar (needs-changes): story.md permanece en CODE-REVIEW/DONE
     ↓
[story.md: READY-FOR-VERIFY/DONE]
──────────────────────────────────────────────────────────────────────────────────────
story.md              → What: requisitos, criterios de aceptación, escenarios Gherkin
design.md             → How: arquitectura, componentes, interfaces, decisiones técnicas
implement-report.md   → Done: código generado, archivos, estado por tarea
code-review-report.md → Review: hallazgos por dimensión, decisión final  ← aquí
```

## Ciclo de vida de estados en este skill

| Evento | status | substatus |
|--------|--------|-----------|
| Precondición requerida para ejecutar | `READY-FOR-CODE-REVIEW` | `DONE` |
| Al iniciar la revisión (Paso 1) | `CODE-REVIEW` | `DONE` |
| Finalización aprobada (Paso 6) | `READY-FOR-VERIFY` | `DONE` |
| Finalización con bloqueantes (FEAT-065) | `CODE-REVIEW` | `DONE` |

**Precondición:** `story-code-review` solo puede ejecutarse si `story.md` tiene `status: READY-FOR-CODE-REVIEW` + `substatus: DONE`. Si la precondición no se cumple, la ejecución se detiene con error descriptivo.

**Qué hace este skill:**
- Verifica precondiciones antes de revisar (fail-fast ante artefactos faltantes)
- Limpia `.tmp/story-code-review/` para garantizar idempotencia
- Lanza tres subagentes revisores en paralelo con responsabilidades exclusivas
- Consolida los informes parciales y calcula la severidad máxima
- **Si `approved`**: genera `code-review-report.md`, elimina `fix-directives.md` (si existe) y avanza `story.md` a `READY-FOR-VERIFY/DONE`
- **Si `needs-changes`**: genera `fix-directives.md` con instrucciones de corrección y lista blanca; `story.md` permanece en `CODE-REVIEW/DONE`

**Qué NO hace este skill:**
- Ejecutar ni compilar código (opera sobre Markdown y texto plano únicamente)
- Aplicar automáticamente las correcciones de `fix-directives.md`
- Validar precondiciones de artefactos faltantes con mensajes enriquecidos (FEAT-066)
- Corregir el código implementado

---

## Artefactos requeridos

Los siguientes artefactos deben existir en `$STORY_DIR` para que el skill pueda ejecutarse. Si alguno falta, el skill detiene la ejecución antes de realizar cualquier efecto secundario.

| Artefacto | Categoría | Justificación |
|---|---|---|
| `story.md` | **Requerido** | Fuente de criterios de aceptación — sin él, el Product-Owner-Reviewer no puede operar |
| `design.md` | **Requerido** | Fuente de arquitectura esperada — sin él, el Integration-Reviewer no puede operar |
| `implement-report.md` | **Requerido** | Evidencia de implementación — sin él, ningún agente tiene qué revisar |
| `tasks.md` | Opcional | El Tech-Lead-Reviewer puede revisar calidad sin lista de tareas |
| `constitution.md` | Opcional | Mejora la revisión pero no la bloquea si no existe |
| `definition-of-done.md` | Opcional | Mismo caso que `constitution.md` |

> Para actualizar esta lista en el futuro, editar únicamente esta sección sin modificar el cuerpo del Paso 1.

---

## Modos de Ejecución

- **Modo manual** (`/story-code-review {story_id}`): interactivo, muestra progreso de cada agente en tiempo real
- **Modo Agent** (invocado por orquestador): automático, reporta resultado consolidado al finalizar

Flag opcional `--single-agent` disponible para historias muy pequeñas (≤3 archivos modificados): lanza solo el agente Tech-Lead-Reviewer. El flujo por defecto es siempre el equipo de tres agentes.

---

## Paso 0 — Verificar entorno (`skill-preflight`)

Invocar el skill `skill-preflight` antes de cualquier operación.

El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar.

Si retorna `✗ Entorno inválido`, detener la ejecución inmediatamente.

Usar `$SPECS_BASE` para todas las rutas en los pasos siguientes.

---

## Paso 1 — Resolver input y verificar precondiciones

### 1a. Argumentos aceptados

- `{story_id}` — identificador de la historia (ej. `FEAT-064`)
- `{story_path}` — ruta explícita al directorio de la historia (opcional)

Si no se proporcionó ningún argumento, preguntar:
```
¿Qué historia deseas revisar?
Proporciona el ID (ej. FEAT-064) o la ruta completa al directorio.
```

### 1b. Resolución del directorio de la historia

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `$SPECS_BASE/specs/stories/{story_id}-*/` — primera coincidencia cuyo nombre comienza con el ID
3. Si no se encuentra:
   ```
   ❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/stories/
   Verifica el ID o ejecuta /release-generate-stories para generarla.
   ```
   Detener la ejecución.

### 1c. Validar artefactos requeridos (all-at-once)

Comprobar simultáneamente la existencia de los tres artefactos requeridos (ver sección `## Artefactos requeridos`):
- `story.md`
- `design.md`
- `implement-report.md`

Acumular todos los faltantes en una lista. Si la lista no está vacía, emitir **un único** mensaje de error con todos los faltantes y detener la ejecución **sin modificar ningún archivo**:

```
❌ Artefactos requeridos no encontrados en: <$STORY_DIR>/

   Faltantes:
   · <archivo-1>
   · <archivo-2>

Completa los artefactos faltantes y vuelve a ejecutar /story-code-review <story_id>.
```

Si todos los artefactos requeridos están presentes, continuar al paso 1d.

### 1d. Verificar precondición de estado

Leer el frontmatter de `story.md` y verificar `status: READY-FOR-CODE-REVIEW` y `substatus: DONE`.

**Si la precondición NO se cumple:**
```
❌ La historia <story_id> no está en estado READY-FOR-CODE-REVIEW/DONE.

   Estado actual: status: <valor_actual> / substatus: <valor_actual>

   story-code-review requiere que story-implement haya completado exitosamente.
   Sugerencia: ejecuta /story-implement {story_id} para completar la implementación.
```
Detener la ejecución **sin modificar ningún archivo**.

### 1e. Actualizar frontmatter a CODE-REVIEW/DONE

Solo después de que los pasos 1c y 1d han pasado sin error, actualizar el frontmatter de `story.md`:
- `status: CODE-REVIEW`
- `substatus: DONE`

Mostrar confirmación de inicio:
```
🔍 Iniciando revisión de código para: <story_id>
   Directorio: <ruta_directorio>
   Artefactos: story.md ✓ | design.md ✓ | implement-report.md ✓
   Estado: READY-FOR-CODE-REVIEW/DONE ✓
```

---

## Paso 2 — Cargar contexto

### 2a. Leer story.md

Extraer y registrar internamente:
- `story_id` del frontmatter
- `story_title`
- Criterios de aceptación numerados como AC-1, AC-2 … AC-N
- Todos los escenarios Gherkin (Dado/Cuando/Entonces o Given/When/Then)

### 2b. Leer design.md

Extraer y registrar internamente:
- Componentes afectados y sus rutas de archivos
- Interfaces definidas y sus contratos

### 2c. Leer implement-report.md

Extraer y registrar internamente:
- Lista de archivos generados por tarea (tests y código de producción)
- Tareas completadas y bloqueadas

### 2d. Localizar políticas del proyecto

Buscar los siguientes archivos en el repositorio:
- `docs/policies/constitution.md` (o ruta alternativa detectada)
- `docs/policies/definition-of-done.md` (o ruta alternativa detectada)

Registrar las rutas resueltas como `$CONSTITUTION_PATH` y `$DOD_PATH`.

Mostrar resumen de carga:
```
📋 Contexto cargado:
   ACs encontrados:          <N>
   Escenarios Gherkin:       <N>
   Archivos implementados:   <N>
   constitution.md:          <ruta>
   definition-of-done.md:    <ruta>
```

---

## Paso 3 — Preparar ejecución paralela

### 3a. Limpiar directorio temporal (idempotencia)

Eliminar el directorio `.tmp/story-code-review/` si existe y recrearlo vacío.

Esto garantiza que ejecuciones repetidas del skill producen el mismo resultado (NF-2).

### 3b. Lanzar tres agentes en paralelo

Lanzar simultáneamente los siguientes subagentes, pasando a cada uno:
- `$STORY_DIR`: ruta del directorio de la historia
- `$CONSTITUTION_PATH`: ruta a constitution.md
- `$DOD_PATH`: ruta a definition-of-done.md

**Agente 1 — Tech-Lead-Reviewer** (`agents/tech-lead-reviewer.agent.md`):
- Revisa calidad, legibilidad, duplicación y seguridad del código fuente
- Output: `.tmp/story-code-review/tech-lead-report.md`

**Agente 2 — Product-Owner-Reviewer** (`agents/product-owner-reviewer.agent.md`):
- Verifica que cada escenario Gherkin tiene correspondencia en el código
- Output: `.tmp/story-code-review/product-owner-report.md`

**Agente 3 — Integration-Reviewer** (`agents/integration-reviewer.agent.md`):
- Valida que los componentes respetan la arquitectura de design.md
- Output: `.tmp/story-code-review/integration-report.md`

Mostrar progreso:
```
⚙️  Agentes lanzados en paralelo...
   🔍 Tech-Lead-Reviewer     → analizando calidad de código
   📋 Product-Owner-Reviewer → verificando cobertura de requisitos
   🏗️  Integration-Reviewer   → validando integración con design.md
```

Esperar a que los tres finalicen antes de continuar.

---

## Paso 4 — Consolidar resultados (árbitro)

### 4a. Leer los tres informes parciales

Leer los archivos de `.tmp/story-code-review/`:
- `tech-lead-report.md`
- `product-owner-report.md`
- `integration-report.md`

**Si algún informe falta o tiene frontmatter inválido:**
Asumir `max-severity: HIGH` para ese agente (fail-safe).

### 4b. Calcular severidad máxima

Para cada informe parcial, leer el campo `max-severity` del frontmatter.

Orden de severidad: `HIGH > MEDIUM > LOW > ninguna`

```
max_severity = máxima severidad entre los tres informes
```

### 4c. Derivar review-status

```
review-status = approved      si max_severity ∈ {LOW, ninguna}
review-status = needs-changes  si max_severity ∈ {HIGH, MEDIUM}
```

Registrar internamente:
- `$REVIEW_STATUS`: `approved` o `needs-changes`
- `$MAX_SEVERITY`: valor calculado
- Hallazgos consolidados por dimensión (tabla con columnas: #, Archivo:Línea, Dimensión, Severidad, Hallazgo, Recomendación)

### 4d. Bifurcación post-árbitro

**Si `$REVIEW_STATUS = needs-changes`:** ejecutar los pasos 4e–4g y después el Paso 5, luego saltar al Paso 7.

**Si `$REVIEW_STATUS = approved`:** ejecutar el Paso 4h, después los Pasos 5–6, luego el Paso 7.

### 4e. [needs-changes] Construir lista blanca de archivos

Iterar los hallazgos consolidados filtrando solo los de `Severidad ∈ {HIGH, MEDIUM}`:

1. Para cada hallazgo bloqueante, extraer la parte de archivo de la columna `Archivo:Línea` (texto antes del primer `:`).
2. Si `Archivo:Línea` está vacío o ausente para un hallazgo, anotar `[archivo no especificado]` para ese hallazgo y excluirlo de la lista blanca sin fallar.
3. Deduplicar las rutas de archivo resultantes.
4. Para cada archivo único, registrar qué número(s) de hallazgo lo referencian: `hallazgo #N, #M`.

Registrar internamente como `$WHITELIST`: lista de `(archivo, [hallazgos])`.

### 4f. [needs-changes] Generar `fix-directives.md`

Leer `assets/fix-directives-template.md` como fuente de verdad de la estructura.

Completar el template con:
- Frontmatter: `story_id`, fecha actual, `$MAX_SEVERITY`
- Sección "Resumen de bloqueantes": título de la historia, severidad máxima, total de hallazgos HIGH/MEDIUM
- Tabla "Instrucciones de corrección": una fila por hallazgo bloqueante con columnas `#`, `Archivo:Línea`, `Dimensión` (del agente que lo detectó), `Severidad`, `Hallazgo` (descripción exacta), `Acción requerida`
- Sección "Lista blanca de archivos permitidos": una línea por archivo de `$WHITELIST` con sus referencias de hallazgo

Guardar en `$STORY_DIR/fix-directives.md`, sobreescribiendo si ya existe.

Mostrar:
```
📋 Fix directives: <ruta>/fix-directives.md
```

### 4g. [needs-changes] Mantener story.md en CODE-REVIEW/DONE

No actualizar el frontmatter de `story.md`. Permanece en el estado actual.

Mostrar:
```
⚠️  Review: needs-changes — story.md permanece en CODE-REVIEW/DONE
→ Revisa: <ruta>/fix-directives.md
```

### 4h. [approved] Limpiar fix-directives.md residual

Si existe `$STORY_DIR/fix-directives.md` (de una revisión anterior con bloqueantes), eliminarlo antes de continuar.

Mostrar (solo si se eliminó):
```
🗑️  fix-directives.md eliminado (revisión anterior superada)
```

---

## Paso 5 — Generar `code-review-report.md`

### 5a. Leer template

Leer `assets/code-review-report-template.md` como fuente de verdad de la estructura del output.

### 5b. Completar y guardar

Completar el template con:
- Frontmatter: `story_id`, `$REVIEW_STATUS`, fecha actual, `$MAX_SEVERITY`
- Sección Resumen: título de la historia, revisores, severidad máxima
- Sección Hallazgos por dimensión: contenido de cada informe parcial
- Sección Decisión final: `$REVIEW_STATUS` con justificación

Guardar en `$STORY_DIR/code-review-report.md`.

Mostrar:
```
📄 Reporte generado: <ruta>/code-review-report.md
```

---

## Paso 6 — Actualizar frontmatter de `story.md`

**Solo si `$REVIEW_STATUS = approved`:**

Actualizar el frontmatter de `story.md`:
- `status: READY-FOR-VERIFY`
- `substatus: DONE`

Mostrar:
```
📋 Estado story.md: READY-FOR-VERIFY/DONE ✓
```

**Si `$REVIEW_STATUS = needs-changes`:** el frontmatter ya permanece en `CODE-REVIEW/DONE` (Paso 4g). No ejecutar este paso.

---

## Paso 7 — Mostrar resumen final

```
─────────────────────────────────────────────────────────────────────
 Code Review: <story_id> — <story_title>
─────────────────────────────────────────────────────────────────────
 Dimensión                  │ Severidad │ Hallazgos
─────────────────────────────────────────────────────────────────────
 Calidad de Código          │ <sev>     │ <N> hallazgos
 Cobertura de Requisitos    │ <sev>     │ <N> escenarios verificados
 Integración y Arquitectura │ <sev>     │ <N> hallazgos
─────────────────────────────────────────────────────────────────────
 Severidad máxima: <max_severity>
 Review status:   <review_status>
─────────────────────────────────────────────────────────────────────

📄 Reporte: <ruta>/code-review-report.md
📋 Estado:  <story_id> → <nuevo_estado>

✅ Revisión aprobada — historia lista para verificación final
```

O si hay bloqueantes:

```
─────────────────────────────────────────────────────────────────────
 Code Review: <story_id> — <story_title>
─────────────────────────────────────────────────────────────────────
 Dimensión                  │ Severidad │ Hallazgos
─────────────────────────────────────────────────────────────────────
 Calidad de Código          │ <sev>     │ <N> hallazgos
 Cobertura de Requisitos    │ <sev>     │ <N> hallazgos
 Integración y Arquitectura │ <sev>     │ <N> hallazgos
─────────────────────────────────────────────────────────────────────
 Severidad máxima: <max_severity>
 Review status:   needs-changes
─────────────────────────────────────────────────────────────────────

📋 Fix directives: <ruta>/fix-directives.md
📄 Reporte:        <ruta>/code-review-report.md
📋 Estado:         <story_id> → CODE-REVIEW/DONE (sin avance)

⚠️  Revisión completada con hallazgos bloqueantes

<N> hallazgo(s) de severidad HIGH o MEDIUM requieren corrección.
Consulta fix-directives.md para las instrucciones de corrección.
Ejecuta /story-code-review {story_id} nuevamente tras corregir los hallazgos.
```
