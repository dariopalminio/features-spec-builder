## Why

Los LLMs y el equipo humano que trabajan con el repositorio SDDF acceden a `docs/` de forma ineficiente: deben leer todos los archivos para entender el estado del proyecto. No existe un índice central ni un esquema de navegación definido, lo que hace que la recuperación de contexto sea O(todos-los-archivos) en lugar de O(índice). FEAT-044 introduce un skill que reorganiza `docs/` como una wiki navegable con índice central y wikilinks internos, implementando el patrón LLM Wiki (Karpathy).

## What Changes

- **Nuevo skill** `.claude/skills/docs-wiki-builder/` que reorganiza el directorio `docs/` en estructura wiki con índice central (`docs/index.md`) y wikilinks `[[slug]]` entre nodos.
- El skill crea la estructura de directorios estándar (`docs/specs/`, `docs/wiki/`) si no existe, y genera `docs/index.md` como mapa de toda la documentación.
- El skill detecta si `docs/` ya tiene contenido y propone un plan de reorganización con confirmación explícita antes de mover o renombrar archivos.
- Los wikilinks rotos (nodos referenciados que aún no existen) se marcan visualmente en el índice (`⚠️ nodo pendiente`) sin bloquear la operación.
- Se añade un template `docs/index-template.md` en `assets/` del skill como referencia de la estructura canónica del índice.

## Capabilities

### New Capabilities
- `docs-wiki-builder`: Skill que genera y mantiene la estructura wiki en `docs/`, crea `docs/index.md` como mapa navegable para LLMs y humanos, valida wikilinks internos y detecta nodos pendientes.

### Modified Capabilities
<!-- ninguna -->

## Impact

- Directorio `.claude/skills/docs-wiki-builder/` (nuevo).
- Archivo `docs/index.md` generado/actualizado en cada invocación del skill.
- Posibles movimientos de archivos en `docs/` (con confirmación del usuario).
- Sin cambios en otros skills ni agentes existentes.
- Compatible con la extensión Foam para visualización de grafo en VS Code.
