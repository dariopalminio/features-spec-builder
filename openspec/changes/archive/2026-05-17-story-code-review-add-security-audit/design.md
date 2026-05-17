## Context

`story-code-review` orquesta tres agentes revisores en paralelo (Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer) y consolida sus hallazgos en `code-review-report.md`. El skill `security-audit` ya existe como skill standalone con soporte explícito para invocación desde `story-code-review` (modo integrado vía payload JSON `{repo, changed_files}` y modo `--story <story-dir>` con resolución automática de archivos desde git diff o tasks.md). Los dos skills comparten la misma infraestructura de directorio `.tmp/` pero en subdirectorios separados (`.tmp/story-code-review/` y `.tmp/security-audit/`), por lo que no hay conflictos de idempotencia.

El cambio consiste en lanzar `security-audit` como cuarto participante en el bloque paralelo del Paso 3b, leer su resultado junto con los tres reportes existentes en el Paso 4, e incorporar los hallazgos de seguridad en el reporte final.

## Goals / Non-Goals

**Goals:**
- Añadir `security-audit` como cuarto agente paralelo en el Paso 3b de `story-code-review`
- Acotar el alcance de la auditoría a los archivos modificados por la historia (via `--story <$STORY_DIR>`)
- Incorporar el resultado de seguridad en `code-review-report.md` como sección `## Security Audit`
- Tratar hallazgos FAIL del security audit como bloqueantes (igual que HIGH/MEDIUM de los otros agentes)
- Omitir la auditoría de seguridad en historias de solo documentación (cuando no hay archivos fuente)

**Non-Goals:**
- Modificar el skill `security-audit` ni su interfaz de invocación
- Cambiar la estructura de `.tmp/security-audit/` ni los artefactos que genera
- Añadir un nuevo agente `.md` — `security-audit` se invoca como skill, no como agente
- Modificar el template `code-review-report-template.md` (la sección se añade dinámicamente)

## Decisions

### 1. Modo de invocación: `--story` en lugar de payload JSON integrado

`security-audit` soporta dos modos de invocación programática:
- **Modo integrado** (payload JSON `{repo, changed_files}`): retorna JSON, requiere que el orquestador resuelva previamente la lista de archivos modificados
- **Modo `--story <story-dir>`**: resuelve archivos automáticamente via git diff o tasks.md, retorna Markdown

**Decisión:** usar `--story $STORY_DIR` porque delega la resolución de archivos al skill security-audit (que ya tiene esa lógica) y evita duplicar la lógica de resolución en `story-code-review`. El orquestador no necesita saber qué archivos cambió la historia — ya lo sabe security-audit.

**Alternativa descartada:** payload JSON integrado requeriría que `story-code-review` extraiga y pase la lista de archivos modificados, añadiendo lógica de resolución al orquestador (contra el patrón del skill).

### 2. Resultado leído desde `.tmp/security-audit/audit-report.md`

Tras lanzar `security-audit --story $STORY_DIR`, el consolidador (Paso 4) lee `.tmp/security-audit/audit-report.md`. El campo `status: PASS | FAIL` del reporte determina si hay hallazgos bloqueantes.

**Lógica de bloqueo:** `FAIL` en el audit → tratar como `max-severity: HIGH` para el cálculo de `$REVIEW_STATUS` (equivalente al fail-safe de los otros agentes cuando el archivo falta o tiene frontmatter inválido).

### 3. Condición de skip: `source_files_found: false`

Si security-audit detecta que no hay archivos fuente reconocidos (historia de documentación), escribe `source_files_found: false` en el reporte y sale con código 0. En ese caso, el consolidador registra `security-review: skipped` en `code-review-report.md` y no añade hallazgos de seguridad al cálculo de severidad.

**Criterio de detección:** el archivo `.tmp/security-audit/audit-report.md` no existe O contiene la línea `source_files_found: false` → skip.

### 4. Sección `## Security Audit` en `code-review-report.md`

Se añade dinámicamente durante el Paso 5 (generación del reporte), después de las secciones de los tres revisores existentes. El template `code-review-report-template.md` no se modifica; la sección se inyecta condicionalmente.

**Contenido de la sección:**
- Si ejecutado: resultado del audit (`PASS`/`FAIL`), resumen (evaluated/pass/fail/na), y listado de hallazgos FAIL si los hay
- Si skipped: `⏭️ Security Audit: omitido — no se detectaron archivos fuente modificados`

### 5. Fila en la tabla del resumen final (Paso 7)

La tabla de dimensiones del resumen final (`## Dimensión │ Severidad │ Hallazgos`) añade una fila `🔒 Security Audit` para visibilidad inmediata del resultado de seguridad.

## Risks / Trade-offs

- **Latencia adicional:** `security-audit` es el agente más pesado del grupo (lanza 3 sub-agentes propios). Al estar en paralelo con los otros tres, no añade latencia secuencial, pero puede aumentar el tiempo total si security-audit tarda más que los otros tres. → Mitigación: el skip automático para historias sin archivos fuente evita la penalización en el caso más común de historias de documentación.
- **Falsos positivos de seguridad bloqueando reviews:** el checklist de `security-audit` puede generar FAILs en código legítimo. → Mitigación: el usuario puede ver el detalle en `audit-report.md` y ajustar el checklist si hay falsos positivos recurrentes.
- **Dependencia de git diff:** el modo `--story` resuelve archivos via git diff. Si la historia no tiene commits en la rama, la resolución cae back a tasks.md. → No requiere mitigación adicional: este comportamiento ya está implementado en security-audit.

## Migration Plan

1. Modificar `story-code-review/SKILL.md`:
   - Paso 3b: añadir lanzamiento paralelo de `security-audit`
   - Paso 4a: leer `audit-report.md` de `.tmp/security-audit/`
   - Paso 4b: incluir resultado de seguridad en cálculo de severidad máxima
   - Paso 5b: añadir sección `## Security Audit` al reporte final
   - Paso 7: añadir fila Security Audit a la tabla del resumen
   - `## Dependencias`: añadir `security-audit`
   - `## Salida`: añadir `.tmp/security-audit/audit-report.md` como artefacto temporal
2. Sin cambios en `security-audit/SKILL.md` ni en templates de assets existentes.
3. Sin migración de datos — el cambio solo afecta la ejecución prospectiva del skill.

## Open Questions

- ¿Debe `fix-directives.md` incluir los hallazgos FAIL del security audit con detalle de archivo/línea, o solo una referencia a `audit-report.md`? → Propuesta: incluir en `fix-directives.md` solo los hallazgos FAIL del security audit que tengan archivo:línea identificado; los hallazgos sin ubicación específica referencian `audit-report.md`.
