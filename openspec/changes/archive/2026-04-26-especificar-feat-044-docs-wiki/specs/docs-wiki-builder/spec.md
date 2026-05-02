## ADDED Requirements

### Requirement: Generar estructura wiki en docs/
El sistema SHALL crear la estructura canónica de directorios wiki en `docs/` cuando el usuario invoca el skill `docs-wiki-builder`.

#### Scenario: Directorio docs/ no existe o está vacío
- **WHEN** el usuario invoca el skill y `docs/` no existe o está vacío
- **THEN** el sistema crea los directorios `docs/specs/projects/`, `docs/specs/releases/`, `docs/specs/stories/`, `docs/wiki/constitution/`, `docs/wiki/architecture/`, `docs/wiki/process/`, `docs/wiki/ux/`, `docs/wiki/guides/`, `docs/wiki/how-to/`
- **THEN** el sistema genera `docs/index.md` con la estructura canónica del índice

#### Scenario: Directorio docs/ existe con contenido no-wiki
- **WHEN** el usuario invoca el skill y `docs/` ya existe con archivos pero sin `index.md` ni subdirectorios estandarizados
- **THEN** el sistema analiza los archivos existentes e infiere su ubicación en la nueva estructura
- **THEN** el sistema muestra un resumen de los movimientos propuestos antes de ejecutar
- **THEN** el sistema solicita confirmación explícita del usuario antes de mover o renombrar cualquier archivo
- **THEN** el sistema no elimina ningún archivo existente sin confirmación explícita

---

### Requirement: Generar índice central docs/index.md
El sistema SHALL generar `docs/index.md` como mapa navegable de toda la documentación usando wikilinks `[[slug]]`.

#### Scenario: Índice generado por primera vez
- **WHEN** el skill genera `docs/index.md` en un directorio vacío o nuevo
- **THEN** el índice incluye una sección por cada subdirectorio principal de `docs/`
- **THEN** cada archivo `.md` en `docs/` está representado en el índice con un wikilink `[[slug]]`
- **THEN** el índice incluye el frontmatter YAML con `type: wiki`, `slug: index`, `title: "Índice de documentación"`, `date`, `status: IN-PROGRESS`

#### Scenario: Índice actualizado con --update
- **WHEN** el usuario invoca el skill con la bandera `--update`
- **THEN** el sistema regenera `docs/index.md` incorporando los archivos nuevos encontrados en `docs/`
- **THEN** el sistema no modifica la estructura de directorios existente
- **THEN** los archivos ya referenciados en el índice previo se mantienen

---

### Requirement: Validar wikilinks y detectar nodos pendientes
El sistema SHALL validar que cada wikilink `[[slug]]` en el índice apunta a un archivo existente en `docs/`.

#### Scenario: Wikilink apunta a archivo existente
- **WHEN** el índice generado contiene `[[slug]]` y existe un archivo cuyo nombre de archivo (sin extensión) coincide con `slug`
- **THEN** el wikilink se incluye en el índice sin ningún marcador adicional

#### Scenario: Wikilink apunta a nodo inexistente
- **WHEN** el índice contiene `[[slug]]` pero no existe ningún archivo con ese slug en `docs/`
- **THEN** el sistema marca el wikilink con `⚠️` en el índice: `[[slug]] ⚠️ nodo pendiente`
- **THEN** el sistema lista todos los nodos pendientes en un resumen al final de la operación
- **THEN** el sistema NO falla ni cancela la operación por nodos pendientes

---

### Requirement: Aplicar frontmatter YAML a nodos de la wiki
El sistema SHALL añadir frontmatter YAML a cada archivo `.md` generado o reorganizado dentro de `docs/` que no tenga encabezado. Si el archivo ya tiene frontmatter, el sistema lo preserva y solo añade los campos faltantes según las reglas de derivación.

#### Scenario: Archivo nuevo generado por el skill
- **WHEN** el skill crea un nuevo archivo `.md` en `docs/`
- **THEN** el archivo incluye frontmatter YAML con los campos: `type`, `slug`, `title`, `date`, `status`, `substatus`, `parent`
- **THEN** `type` = `wiki` para archivos en `docs/wiki/`; `project`, `release`, o `story` según el prefijo para archivos en `docs/specs/`
- **THEN** `slug` = nombre del archivo sin extensión en kebab-case
- **THEN** `date` = fecha actual en formato YYYY-MM-DD

#### Scenario: Archivo existente sin frontmatter
- **WHEN** el skill reorganiza un archivo que no tiene frontmatter YAML
- **THEN** el sistema añade el bloque frontmatter al inicio del archivo usando las reglas de derivación automática
- **THEN** el contenido original del archivo se preserva intacto debajo del bloque YAML

---

### Requirement: Modo de invocación y flags del skill
El sistema SHALL soportar los siguientes modos de invocación:

#### Scenario: Invocación sin argumentos
- **WHEN** el usuario invoca el skill sin argumentos
- **THEN** el skill analiza el estado actual de `docs/` y presenta las acciones que realizará
- **THEN** solicita confirmación antes de ejecutar cualquier cambio

#### Scenario: Invocación con --update
- **WHEN** el usuario invoca el skill con `--update`
- **THEN** el skill solo regenera `docs/index.md` sin tocar la estructura de directorios ni el contenido de archivos existentes

#### Scenario: Invocación con --dry-run
- **WHEN** el usuario invoca el skill con `--dry-run`
- **THEN** el skill muestra todas las acciones que realizaría (crear directorios, mover archivos, generar índice) sin ejecutar ninguna
