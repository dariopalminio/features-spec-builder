<!-- Referencias -->
[[FEAT-043-header-aggregation]]

## Why

Los archivos de spec del proyecto (project-intent, requirement-spec, project-plan, release-*, story-*) carecen de un frontmatter YAML estandarizado que permita navegarlos, enlazarlos y rastrear su estado sin abrir el contenido completo. Esta inconsistencia impide implementar el patrón LLM Wiki (índice-primero) donde los agentes leen `index.md` para decidir qué nodos abrir en O(índice) en lugar de O(todos-los-archivos).

## What Changes

- **Nuevo skill `/header-aggregation`** que añade o actualiza un bloque YAML frontmatter estandarizado en archivos de spec individuales o en batch (todos los archivos de un directorio)
- El frontmatter incluye campos de tipo, fecha, slug, título, tags, estado, subestado, nodo padre y referencias cruzadas (`related`, `sources`)
- Detección de frontmatter existente: el skill propone una combinación de campos nuevos y existentes, muestra un diff al usuario y solicita confirmación antes de sobreescribir
- Referencias inválidas (nodos que no existen) se marcan como `[pendiente]` en lugar de fallar
- El esquema de campos es compatible con el patrón LLM Wiki para que los agentes puedan leer el índice primero sin procesar el contenido completo

## Capabilities

### New Capabilities

- `header-aggregation`: Skill que aplica frontmatter YAML estandarizado a archivos Markdown de spec. Cubre invocación por archivo único (nombre, ruta relativa o absoluta) y modo batch (directorio). Incluye detección de conflicto, propuesta de merge, validación de referencias y resumen de cambios aplicados.

### Modified Capabilities

<!-- Sin cambios en capabilities existentes -->

## Impact

- Nuevo directorio `.claude/skills/header-aggregation/` con `SKILL.md` y template de frontmatter
- Los archivos en `$SPECS_BASE/specs/projects/`, `$SPECS_BASE/specs/releases/` y `$SPECS_BASE/specs/stories/` serán enriquecidos con YAML frontmatter al invocar el skill
- Compatible con FEAT-044 (directorio docs tipo wiki): el frontmatter generado es el requisito previo para que `index.md` pueda referenciar nodos por slug
- Sin cambios en el pipeline existente de skills — el skill es independiente y no afecta el flujo de ejecución actual
