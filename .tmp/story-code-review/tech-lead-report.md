---
type: partial-review
agent: tech-lead-reviewer
story: FEAT-068
max-severity: MEDIUM
created: 2026-05-14
---

# Tech-Lead Review — FEAT-068: DoD PLAN en story-analyze

## Hallazgos

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---|---|---|---|---|
| 1 | SKILL.md:39 | Calidad estructural | LOW | Typo en la tabla de estados del ciclo de vida: el estado aparece como `PLANN` (truncado) en lugar de `PLANNING`. La fila reza `Con inconsistencias ERROR-level \| \`PLANN\` \| \`IN‑PROGRESS\``. | Corregir `PLANN` → `PLANNING` para consistencia con el resto del skill. |
| 2 | SKILL.md:146 | Path conventions | MEDIUM | La ruta `$SPECS_BASE/policies/definition-of-done-story.md` es correcta en la estructura actual del proyecto (el archivo existe en `docs/policies/`), pero el skill-preflight solo verifica `specs/projects/`, `specs/releases/` y `specs/stories/` como subdirectorios estándar bajo `$SPECS_BASE`. El directorio `policies/` no está documentado como subdirectorio verificado por preflight. Si `SDDF_ROOT` apunta a una raíz diferente donde `policies/` no existe en ese nivel, el path fallará silenciosamente. La degradación graceful en 1g mitiga el bloqueo pero la documentación del path canónico es inconsistente — otros skills como `story-design` también usan `$SPECS_BASE/policies/` sin haberlo documentado como convención formal en la constitución. | Bajo impacto práctico dado que la degradación graceful está implementada, pero conviene documentar que `$SPECS_BASE/policies/` es una ruta canónica del framework en la constitución o en skill-preflight (Verificación 2). |
| 3 | SKILL.md:155 | Redundancia/claridad | LOW | El paso 1g instruye: "Registrar en el log qué encabezado fue encontrado (ej. `⚠️ Buscando sección PLAN en DoD...`)" pero el ejemplo usa `⚠️` (símbolo de advertencia) para una operación informativa de progreso. El símbolo `⚠️` debería reservarse para condiciones de alerta. Un log de progreso normal debería usar un símbolo neutro como `🔍` o simplemente ninguno. Esta inconsistencia puede confundir al lector del log. | Cambiar el símbolo del mensaje de log informativo de `⚠️` a uno neutro (ej. `🔍` o `ℹ️`). |
| 4 | SKILL.md:395 | Consistencia interna | MEDIUM | El Paso 9a menciona "inconsistencias bloqueantes — TIPO A, B o E" pero el Paso 6 (tabla de clasificación) lista los tipos en el orden A, B, C, D, E. La frase en 9a omite mencionar que C y D son no-bloqueantes. Más importante: el Paso 10 (mensaje de confirmación interactiva en caso de ERROREs) no incluye un mensaje específico sobre DoD-ERRORs (TIPO E) en el bloque de texto del `⛔`, a diferencia del mensaje interno del Paso 9a que sí menciona `DoD PLAN: <$DOD_ERROR_COUNT> criterios ❌`. El usuario interactivo no ve esta distinción. | Añadir en el bloque `⛔` del Paso 10 una línea explícita para DoD-ERRORs, por ejemplo: `DoD PLAN: <N> criterios ❌ — revisar artefactos`. |
| 5 | SKILL.md:467-470 | Alineación con template | MEDIUM | El Template de Fallback interno (al final del skill) NO incluye la fila `Cumplimiento DoD — Fase PLAN` en su tabla de Resumen Ejecutivo ni la sección `## Cumplimiento DoD — Fase PLAN`. El template externo (`analyze-report-template.md`) sí los incluye. Si el template externo no se encuentra, el reporte generado desde el fallback carecerá de la funcionalidad de DoD implementada en AC-1. Esto es una regresión silenciosa: el skill ejecuta Correlación 5 (Paso 6), pero si el fallback se usa, los resultados de DoD nunca aparecen en el output. | Actualizar el Template de Fallback del skill para incluir la fila DoD en el Resumen Ejecutivo y la sección `## Cumplimiento DoD — Fase PLAN` idénticas a las del template externo. |
| 6 | assets/analyze-report-template.md:81 | Alineación con template | LOW | La sección `## Inconsistencias Detectadas` del template tiene el tipo como: `{A: AC sin cobertura / B: tarea sin diseño / C: diseño sin tarea / D: desalineación release}` pero no incluye `E: Criterio DoD PLAN no cumplido` en la enumeración de tipos. El ejemplo `analyze.md` sí lo usa correctamente (línea 98: `Tipo: E: Criterio DoD PLAN no cumplido`), pero el template no orienta al generador sobre el tipo E. | Agregar `/ E: criterio DoD PLAN no cumplido` a la lista de tipos en el campo `Tipo` del template de inconsistencias. |
| 7 | examples/output/analyze.md:27 | Calidad del ejemplo | LOW | La fila DoD en el Resumen Ejecutivo muestra `❌ \| 1/3 criterios ✓` pero el DoD PLAN del proyecto solo tiene 5 criterios definidos (no 3). Aunque el ejemplo usa una historia ficticia con un DoD propio potencialmente diferente, la discrepancia entre los 5 criterios definidos en `definition-of-done-story.md` y los 3 criterios del ejemplo podría confundir. El ejemplo evalúa únicamente 3 de los 5 criterios definidos en el DoD actual sin aclarar que la historia ficticia tiene un DoD simplificado. | Clarificar en un comentario del ejemplo que el DoD ficticio de FEAT-099 tiene 3 criterios (representativo), o actualizar la tabla a 5 criterios para alinear con el DoD real del proyecto. |
| 8 | docs/policies/definition-of-done-story.md:31 | Calidad estructural | LOW | La nueva sección PLAN se llama `### Definition of Done para el estado PLAN` (h3) pero la sección SPECIFYING precedente también es h3 (`### Definition of Done para el estado SPECIFYING`). Sin embargo, la sección IMPLEMENTING usa h3 también. La consistencia de nivel de encabezado es correcta. Sin embargo, hay una diferencia estructural: las secciones SPECIFYING e IMPLEMENTING tienen un sub-encabezado h4 descriptivo (`#### ✅ Criterios de...`) antes de los checkboxes, mientras que la nueva sección PLAN también tiene un h4 (`#### ✅ Criterios de Artefactos de Planning`). Esto es consistente. Sin hallazgo real — observación de consistencia confirmada. | Sin acción requerida — consistencia verificada. |

## Resumen

7 hallazgos con acción requerida. max-severity: MEDIUM

### Hallazgos por severidad

- **MEDIUM (2):** Hallazgo 4 (falta de mensaje DoD en Paso 10 para usuario interactivo), Hallazgo 5 (Template de Fallback no incluye sección DoD — regresión silenciosa si se usa el fallback).
- **LOW (5):** Hallazgos 1, 3, 6, 7 (typo, símbolo, template inconsistencia menor, ejemplo), Hallazgo 8 (confirmado consistente, sin acción).

### Hallazgo crítico destacado

El **Hallazgo 5** es el más relevante funcionalmente: el Template de Fallback interno no fue actualizado para incluir la nueva sección DoD. Si un proyecto no tiene el template externo en `$SPECS_BASE/specs/templates/analyze-report-template.md` (situación común en proyectos nuevos donde se usa el fallback), la Correlación 5 se ejecuta y calcula `$DOD_ERROR_COUNT` correctamente, pero el reporte generado no mostrará ninguna sección DoD, haciendo que AC-1 no se cumpla en ese escenario. La degradación no es graceful sino silenciosa — no hay aviso al usuario de que los resultados DoD no se incluyeron.

### Consistencia general evaluada

- Sub-paso 1g correctamente numerado después de 1f: **CORRECTO**
- Correlación 5 correctamente numerada después de Correlación 4: **CORRECTO**
- Tipo E en la tabla de severidad (Paso 6): **CORRECTO** — consistente con los tipos A-D existentes
- Variable `$DOD_PLAN_CRITERIA` definida en 1g y consumida en Paso 6, 8, 9a, 10: **CORRECTO** — el flujo de datos es coherente
- `$DOD_ERROR_COUNT` definido en Correlación 5 y referenciado en Paso 9a: **CORRECTO**
- Degradación graceful (archivo no existe / sección no existe): **CORRECTO** — ambos casos están cubiertos
- Path `$SPECS_BASE/policies/definition-of-done-story.md`: **FUNCIONALMENTE CORRECTO** pero sin cobertura formal en preflight (Hallazgo 2)
- Template externo (`analyze-report-template.md`) alineado con SKILL.md Paso 8: **CORRECTO**
- Ejemplo `analyze.md` muestra escenario ❌ con INC, tabla y Estado general: **CORRECTO** (con observación menor en Hallazgo 7)
