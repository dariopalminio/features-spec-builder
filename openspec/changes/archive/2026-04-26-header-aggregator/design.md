## Context

Los archivos de spec del proyecto SDDF (`$SPECS_BASE/specs/projects/`, `$SPECS_BASE/specs/releases/`, `$SPECS_BASE/specs/stories/`) actualmente carecen de un esquema de metadatos uniforme. Algunos tienen frontmatter YAML parcial, otros tienen un bloque de metadatos en texto plano (`**substatus**: IN‑PROGRESS`), y otros ninguno. Esta heterogeneidad impide implementar el patrón LLM Wiki (leer `index.md` → abrir solo los nodos necesarios) porque no hay un campo `slug` ni `type` consistentes que un índice pueda referenciar.

El skill `header-aggregation` actúa como utilitario de mantenimiento: dado un archivo o directorio, aplica un frontmatter YAML estandarizado, detecta conflictos con metadatos preexistentes y solicita confirmación antes de modificar.

## Goals / Non-Goals

**Goals:**
- Definir un esquema de frontmatter YAML canónico compatible con el patrón LLM Wiki
- Skill que aplica el frontmatter a archivos de spec individuales o en batch
- Detección de frontmatter existente con propuesta de merge y confirmación del usuario
- Validación de referencias (`related`, `sources`) con marcado `[pendiente]` en lugar de fallo

**Non-Goals:**
- Modificar el contenido Markdown debajo del frontmatter
- Sincronización automática entre campos de frontmatter y contenido del documento
- Generación del `index.md` de la wiki (eso corresponde a FEAT-044)
- Soporte para formatos distintos de YAML frontmatter (TOML, JSON front matter)

## Decisions

### D1: Esquema de frontmatter — campos obligatorios vs opcionales

El frontmatter define dos niveles:
- **Obligatorios**: `type`, `date`, `slug`, `title`, `status`
- **Opcionales**: `tags`, `substatus`, `parent`, `related`, `sources`

Rationale: los campos obligatorios son suficientes para que el índice LLM funcione (identificar nodo, tipo y estado). Los campos opcionales enriquecen la trazabilidad pero no bloquean la navegación si están ausentes.

```yaml
---
type: project | release | story | wiki
date: YYYY-MM-DD
slug: <kebab-case único en el repositorio>
title: "Título legible del documento"
tags: [spec, release]               # opcional
status: BACKLOG | IN-PROGRESS | COMPLETED
substatus: null | IN‑PROGRESS | READY       # opcional — alineado con Estado: IN‑PROGRESS/Ready del pipeline
parent: <slug del nodo padre>        # opcional
related:                             # opcional
  - <slug de nodo relacionado>
sources:                             # opcional
  - jira: PROJ-123
  - repo: .claude/plans/slug.md
---
```

### D2: Derivación de `slug` y `type` desde el nombre de archivo

El skill deriva automáticamente:
- `slug`: nombre del archivo sin extensión, con guiones (e.g., `story-FEAT-043-header-aggregation`)
- `type`: inferido del prefijo del archivo (`story-*` → `story`, `release-*` → `release`, `project-*` → `project`, resto → `wiki`)
- `status`: mapeado desde el campo `**Estado**` existente si lo hay (`IN‑PROGRESS` → `IN-PROGRESS`, `DONE` → `COMPLETED`, ausente → `BACKLOG`)

Rationale: reduce la carga del usuario al aplicar el skill; los valores derivados siempre pueden ser corregidos manualmente.

### D3: Estrategia de conflicto — merge propuesto con confirmación

Cuando el archivo ya tiene frontmatter YAML:
1. El skill lee los campos existentes
2. Construye un frontmatter propuesto combinando campos existentes + campos nuevos del esquema canónico
3. Muestra el diff (campos añadidos / campos modificados / campos preservados)
4. Pregunta al usuario: Sobrescribir con propuesta / Mantener el existente / Cancelar

Rationale: nunca sobreescribir silenciosamente metadatos existentes; la fusión propuesta preserva información ya capturada mientras añade los campos faltantes del esquema.

### D4: Skill sin template externo

El skill `header-aggregation` no usa un archivo `templates/` separado para el frontmatter — el esquema YAML se define inline en el SKILL.md. Justificación: el esquema es parte de la lógica de negocio del skill (no una plantilla de documento que el LLM rellena), y es suficientemente compacto para estar inline. Esto simplifica la distribución.

## Risks / Trade-offs

- **[Riesgo] Slug no único entre archivos** → El skill advierte sobre colisiones de slug detectadas en el repositorio pero no fuerza unicidad; la responsabilidad final es del usuario.
- **[Riesgo] Campos `related` que apuntan a slugs inexistentes** → Mitigación: el skill valida cada slug referenciado contra los slugs conocidos del repositorio y marca con `[pendiente]` los que no encuentre, evitando referencias rotas silenciosas.
- **[Trade-off] Derivación automática de `type` puede ser incorrecta** → El skill muestra el tipo inferido y permite que el usuario lo corrija antes de escribir. Preferible a un campo vacío.
- **[Trade-off] Frontmatter inline en SKILL.md** → Si el esquema evoluciona, hay que actualizar el SKILL.md. Aceptable dado que cambios de esquema son poco frecuentes y documentados en esta spec.
