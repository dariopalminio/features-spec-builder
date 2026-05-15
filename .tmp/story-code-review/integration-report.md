---
type: partial-review
agent: integration-reviewer
story: FEAT-068
max-severity: LOW
created: 2026-05-14
---

# Integration Review — FEAT-068: DoD PLAN en story-analyze

## Verificación de Componentes del Diseño

| Componente | Diseño (design.md) | Implementado en | Estado | Hallazgo (si aplica) |
|---|---|---|---|---|
| Sub-paso 1g — Localizar DoD, extraer sección PLAN, registrar criterios o emitir ⚠️ | D1: flexible extraction, primer h3 con PLAN/PLANNING/PLANIFICACIÓN case-insensitive; D6: no-evaluable → ⚠️ | SKILL.md:144-163 (Paso 1, sección 1g) | ✓ | — |
| Correlación 5 — Evaluar cada criterio DoD semánticamente, clasificar ✓/❌/⚠️ | D2: semántica LLM; D3: ❌→ERROR, ⚠️→WARNING, ✓→ninguno; D6: duda → ⚠️ nunca bloquea | SKILL.md:297-317 (Paso 6, Correlación 5) | ✓ | — |
| Fila DoD en Resumen Ejecutivo del template | D5: nueva fila `Cumplimiento DoD — Fase PLAN` con `{dod_status}` y `{dod_n}/{dod_total}` | analyze-report-template.md:26 | ✓ | — |
| Sección "Cumplimiento DoD — Fase PLAN" en template | D5: nueva sección con tabla criterio/estado/severidad/evidencia y comentario de degradación | analyze-report-template.md:96-103 | ✓ | — |
| Completar template en Step 8 con resultados de Correlación 5 | Step 8 debe rellenar fila DoD del Resumen Ejecutivo y sección de tabla por criterio | SKILL.md:366-376 (Paso 8) | ✓ | — |
| Guardia de transición en Step 9 — READY-FOR-IMPLEMENT solo si no hay DoD-ERRORs | D3: ❌ bloquea; TIPO E añadido a la condición de bloqueo | SKILL.md:389-399 (Paso 9) | ✓ | — |
| Línea de resumen DoD en Step 10 — `DoD PLAN: N/Total criterios ✓` | Step 10, confirmación interactiva, mostrar conteo DoD y estado degradado si vacío | SKILL.md:418-440 (Paso 10) | ✓ | — |
| Sección PLAN en definition-of-done-story.md (CR-001) | CR-001 reconoce la ausencia; diseño exige degradación elegante hasta que la sección exista | docs/policies/definition-of-done-story.md:31-39 | ⚠️ | Ver hallazgo INT-001 |
| Fallback chain del template (assets/ → externo → fallback interno) | D5: template como fuente de verdad; Step 7 busca en specs/templates y assets/ | SKILL.md:331-343 (Paso 7). Fallback interno en SKILL.md:444-530 NO tiene fila DoD ni sección DoD | ⚠️ | Ver hallazgo INT-002 |

---

## Análisis de Puntos de Integración — Detalle

### Sub-paso 1g (SKILL.md:144-163)

La implementación coincide exactamente con D1:
- Ruta `$SPECS_BASE/policies/definition-of-done-story.md` (no hardcodeada).
- Búsqueda del primer h3 que contenga `PLAN`, `PLANNING` o `PLANIFICACIÓN` (case-insensitive).
- Log del encabezado encontrado.
- Degradación elegante: si el archivo no existe o la sección no se encuentra, `$DOD_PLAN_CRITERIA = []` y continúa sin detener.
- Extrae checkboxes `- [ ]` y `- [x]` como lista plana de criterios.

### Correlación 5 (SKILL.md:297-317)

La implementación cumple D2 y D3:
- Evaluación semántica contra contenido combinado de los tres artefactos.
- Clasificación ✓/❌/⚠️ con "regla de duda" explícita (ante incertidumbre, `⚠️` en lugar de `❌`).
- Tabla interna `criterio | resultado | severidad | evidencia`.
- `$DOD_ERROR_COUNT` contabiliza solo los `❌`.
- Integración con la tabla de clasificación de severidad (TIPO E: ERROR).

### Paso 8 (SKILL.md:364-376)

- Se instruye completar la fila `Cumplimiento DoD — Fase PLAN` con `{dod_status}` y `{dod_n}/{dod_total}`.
- Se instruye completar la sección "Cumplimiento DoD — Fase PLAN" con la tabla por criterio.
- El comportamiento de degradación (cuando `$DOD_PLAN_CRITERIA` está vacío) está documentado en ambos lugares del paso.

### Paso 9 (SKILL.md:387-399)

- La condición de bloqueo incluye explícitamente TIPO E: `Si hay inconsistencias de tipo ERROR (TIPO A, TIPO B o TIPO E)`.
- El registro adicional `DoD PLAN: <$DOD_ERROR_COUNT> criterios ❌ — transición bloqueada` está presente.
- La lógica es correcta: `DoD-ERRORs → estado permanece PLAN/IN-PROGRESS`.

### Paso 10 (SKILL.md:406-440)

- La línea `DoD PLAN: <N>/<Total> criterios ✓ | ⚠️ no evaluado (sección no encontrada)` está presente en el bloque de confirmación interactiva (SKILL.md:418).
- Cubre ambas variantes: con criterios evaluados y modo degradado.

### analyze-report-template.md

- Fila DoD en Resumen Ejecutivo (línea 26): `| Cumplimiento DoD — Fase PLAN | {dod_status} | {dod_n}/{dod_total} criterios ✓ |` — coincide exactamente con D5.
- Sección final "Cumplimiento DoD — Fase PLAN" (líneas 96-103): tabla con columnas `Criterio DoD | Estado | Severidad | Evidencia` y comentario de degradación — coincide con D5.

### definition-of-done-story.md (CR-001)

El archivo contiene en la línea 31: `### Definition of Done para el estado PLAN`. Esta sección h3 contiene el término "PLAN" y por tanto el sub-paso 1g **encontrará** la sección y cargará los 5 criterios de la sección (líneas 35-39). Esto contradice la asunción de CR-001 (que declaraba que la sección no existía). La situación real es que CR-001 fue resuelto: la sección PLAN está presente en el DoD. El skill funcionará con validación real, no en modo degradado.

---

## Hallazgos

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---|---|---|---|---|
| INT-001 | docs/policies/definition-of-done-story.md:31 | Consistencia con CR-001 | LOW | El design.md documenta en CR-001 que la sección PLAN no existe en el DoD, pero el archivo actual contiene `### Definition of Done para el estado PLAN` (línea 31) con 5 criterios. CR-001 está resuelto de facto. El skill funcionará en modo completo (no degradado) desde el primer uso. El riesgo documentado en CR-001 no aplica. | Actualizar el texto de CR-001 en design.md para reflejar que la sección ya existe, o documentar en el registro de cambios que CR-001 fue cerrado. Acción de documentación, no bloquea ejecución. |
| INT-002 | SKILL.md:444-530 | Coherencia template fallback | LOW | El template de fallback interno (Step 7, usado si no se encuentran ni el template externo ni `assets/`) no incluye la fila DoD en el Resumen Ejecutivo ni la sección "Cumplimiento DoD — Fase PLAN". Si el fallback se activa, el report generado omitirá la nueva funcionalidad de FEAT-068. En condiciones normales, `assets/analyze-report-template.md` existe y se usa, pero si el skill se usa fuera del directorio estándar o el assets/ falta, el fallback produce un output incompleto. | Agregar a la sección "Resumen Ejecutivo" del fallback interno la fila `Cumplimiento DoD — Fase PLAN` y al final del fallback la sección `## Cumplimiento DoD — Fase PLAN`. Alinearlo con `assets/analyze-report-template.md`. |

---

## Resumen

9 componentes verificados.

- 7 componentes: implementados correctamente y alineados con el diseño.
- 2 componentes: desviaciones menores de severidad LOW que no comprometen la funcionalidad principal.

**max-severity: LOW**

Los cinco puntos de integración del diseño (sub-paso 1g, Correlación 5, completar template en Step 8, guardia de transición en Step 9, línea de resumen en Step 10) están todos implementados y alineados con las decisiones de diseño D1, D2, D3, D4 y D5.

La funcionalidad DoD PLAN en story-analyze es operativa. La sección PLAN del DoD ya existe en el archivo fuente, por lo que el skill realizará validación real (no degradada) desde el primer uso. El fallback interno desactualizado (INT-002) es el único riesgo técnico residual, de impacto bajo y acotado a escenarios de uso fuera del directorio estándar.
