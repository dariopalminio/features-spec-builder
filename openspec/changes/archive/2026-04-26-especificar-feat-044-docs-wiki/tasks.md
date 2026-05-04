## 1. Estructura del skill

- [x] 1.1 Crear directorio `.claude/skills/docs-wiki-builder/`
- [x] 1.2 Crear `.claude/skills/docs-wiki-builder/assets/` y añadir `wiki-index-template.md` con la estructura canónica del índice
- [x] 1.3 Crear `.claude/skills/docs-wiki-builder/SKILL.md` con frontmatter YAML (`name`, `description`, `alwaysApply: false`) y cuerpo de instrucciones

## 2. Lógica de detección de estado inicial

- [x] 2.1 Documentar en SKILL.md el paso de detección: verificar si `docs/` existe y si contiene `index.md`
- [x] 2.2 Documentar el flujo para `docs/` vacío o inexistente: crear directorios canónicos y generar índice directamente
- [x] 2.3 Documentar el flujo para `docs/` existente sin estructura wiki: analizar archivos, proponer movimientos, solicitar confirmación

## 3. Generación de la estructura de directorios

- [x] 3.1 Documentar en SKILL.md la lista completa de directorios a crear: `$SPECS_BASE/specs/projects/`, `$SPECS_BASE/specs/releases/`, `$SPECS_BASE/specs/stories/`, `docs/wiki/constitution/`, `docs/wiki/architecture/`, `docs/wiki/process/`, `docs/wiki/ux/`, `docs/wiki/guides/`, `docs/wiki/how-to/`
- [x] 3.2 Documentar la regla de no-eliminación: el skill nunca elimina archivos sin confirmación explícita del usuario

## 4. Generación del índice docs/index.md

- [x] 4.1 Documentar en SKILL.md el proceso de construcción del índice: listar todos los `.md` en `docs/` y organizarlos por subdirectorio
- [x] 4.2 Documentar la sintaxis de wikilinks `[[slug]]` donde `slug` = nombre de archivo sin extensión
- [x] 4.3 Documentar el frontmatter del índice: `type: wiki`, `slug: index`, `title: "Índice de documentación"`, `date`, `status: IN-PROGRESS`
- [x] 4.4 Documentar el modo `--update`: regenerar solo el índice sin tocar directorios ni contenido

## 5. Validación de wikilinks

- [x] 5.1 Documentar en SKILL.md el proceso de validación: para cada `[[slug]]` en el índice, verificar que existe un archivo con ese nombre en `docs/`
- [x] 5.2 Documentar el marcado `⚠️ nodo pendiente` para wikilinks rotos
- [x] 5.3 Documentar el resumen final de nodos pendientes que el skill muestra al usuario

## 6. Aplicación de frontmatter YAML a nodos

- [x] 6.1 Documentar en SKILL.md las reglas de derivación de frontmatter: `type` desde prefijo de archivo o ubicación en `wiki/` vs `specs/`, `slug` desde nombre de archivo sin extensión, `date` = fecha actual
- [x] 6.2 Documentar la regla de `type`: archivos en `docs/wiki/` → `wiki`; archivos con prefijo `story-*` → `story`; `release-*` → `release`; `project-*` → `project`
- [x] 6.3 Documentar que el frontmatter solo se añade a archivos sin frontmatter previo; los que ya tienen frontmatter se preservan sin modificación

## 7. Flags y modos de invocación

- [x] 7.1 Documentar en SKILL.md el comportamiento sin argumentos: analizar estado, mostrar plan, solicitar confirmación
- [x] 7.2 Documentar el flag `--update`: regenerar índice solamente
- [x] 7.3 Documentar el flag `--dry-run`: mostrar todas las acciones sin ejecutar ninguna

## 8. Verificación

- [x] 8.1 Invocar el skill con `--dry-run` sobre el repositorio actual y verificar que muestra el plan de reorganización sin modificar nada
- [x] 8.2 Invocar el skill con `--update` y verificar que `docs/index.md` se genera/actualiza correctamente con todos los nodos enlazados
- [x] 8.3 Verificar que los wikilinks rotos se marcan con `⚠️ nodo pendiente` en el índice generado
- [x] 8.4 Verificar que los nodos existentes en `docs/` sin frontmatter reciben el bloque YAML con los campos derivados correctamente
