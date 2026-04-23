## Context

`release-generate-stories` (FEAT-029) ya cubre la generación de stories desde un único archivo de release. Este skill extiende ese flujo con un patrón de orquestación batch: descubre todos los archivos en `docs/specs/releases/`, los procesa en secuencia y consolida el resultado. La arquitectura del SDDF es SKILL.md — sin código ejecutable, solo instrucciones para el agente Claude Code.

El problema de idempotencia es más complejo en batch que en single-file: si 30 historias ya existen y el usuario ejecuta el skill de nuevo, preguntar por cada una sería inutilizable. Se necesita una estrategia de confirmación global.

## Goals / Non-Goals

**Goals:**
- Implementar `.claude/skills/release-generate-all-stories/SKILL.md` que escanea `docs/specs/releases/`, procesa cada archivo en orden alfabético y genera stories usando el mismo flujo de extracción y generación de `release-generate-stories`
- Idempotencia en modo batch: detección anticipada de conflictos con confirmación global única antes de comenzar el procesamiento
- Resumen final con contadores: releases procesados / historias generadas / historias saltadas / releases sin features

**Non-Goals:**
- Reimplementar la lógica de extracción de features o generación de historias (eso ya está en `release-generate-stories`)
- Filtrar releases por estado, fecha o ID
- Evaluación FINVEST de las historias generadas
- Soporte para directorios de release distintos a `docs/specs/releases/`

## Decisions

### Decisión 1: Implementar como SKILL.md (instrucciones Markdown) en lugar de script

**Elegido:** SKILL.md consistente con todos los skills del SDDF.

**Alternativa descartada:** Script que llame al skill anterior programáticamente.

**Rationale:** El SDDF no tiene runtime de scripts; los skills son instrucciones para el agente. Mantener la consistencia arquitectural evita introducir dependencias de runtime.

---

### Decisión 2: Detección anticipada de conflictos con confirmación global única

**Elegido:** Antes de procesar ningún release, el skill escanea qué historias ya existen para los releases descubiertos y, si hay conflictos, presenta una sola pregunta con tres opciones: (a) sobreescribir todo, (b) saltar todos los existentes, (c) decidir uno por uno.

**Alternativa descartada:** Preguntar por cada archivo conflictivo durante el procesamiento (igual que en single-file).

**Rationale:** En batch con 20+ releases y decenas de historias ya generadas, la interrupción por cada conflicto haría el skill inutilizable. La confirmación global upfront es consistente con el patrón UX de herramientas batch (rsync, cp -r, etc.).

---

### Decisión 3: Orden de procesamiento alfabético

**Elegido:** Procesar los archivos de release en orden alfabético por nombre de archivo.

**Alternativa descartada:** Orden por número de release (extraer ID numérico).

**Rationale:** El orden alfabético es el mismo que el orden numérico para los nombres de archivo del SDDF (`release-00-...`, `release-01-...`, `release-06-...`) porque el ID es parte del nombre y tiene padding de dos dígitos. No se necesita lógica adicional de extracción.

---

### Decisión 4: Sin filtrado de releases completados vs pendientes

**Elegido:** Procesar todos los archivos `.md` en `docs/specs/releases/` sin filtrar por estado.

**Alternativa descartada:** Procesar solo releases con `Estado: Ready` o solo features pendientes `[ ]`.

**Rationale:** El skill hermano `release-generate-stories` también procesa todas las features sin distinción de estado. Mantener la consistencia de comportamiento es más predecible para el usuario.

## Risks / Trade-offs

- **Gran número de archivos de release** → puede generar decenas de historias en una sola ejecución. Mitigación: el resumen final da visibilidad completa de lo generado; la confirmación global de idempotencia protege el trabajo existente.
- **Releases con formato heterogéneo** (versiones antiguas sin sección `## Features` estándar) → el skill puede fallar silenciosamente para esos releases. Mitigación: reportar explícitamente en el resumen cada release no procesado con su motivo.
- **Historias duplicadas con el skill de FEAT-029** → si el usuario mezcla invocaciones de single-file y batch, puede haber confusión sobre qué generó qué. Mitigación: la nota de origen en `📎 Notas` de cada historia identifica el release fuente.
