### Requirement: El skill resuelve el input del archivo de release
El skill SHALL aceptar el archivo de release como nombre corto (con o sin extensión `.md`), o como ruta relativa completa, siguiendo el comportamiento definido en `release-input-resolution`. Si el nombre coincide con más de un archivo en `docs/specs/releases/`, el skill SHALL solicitar al usuario que especifique cuál usar antes de continuar.

#### Scenario: Input como nombre corto con extensión
- **WHEN** el usuario proporciona "release-06-release-and-story-generator.md"
- **THEN** el skill resuelve la ruta a "docs/specs/releases/release-06-release-and-story-generator.md" y continúa

#### Scenario: Input como ruta relativa completa
- **WHEN** el usuario proporciona "docs/specs/releases/release-06-release-and-story-generator.md"
- **THEN** el skill usa esa ruta directamente sin búsqueda adicional

#### Scenario: Nombre corto sin coincidencias
- **WHEN** el término proporcionado no coincide con ningún archivo en "docs/specs/releases/"
- **THEN** el skill muestra "No se encontró el archivo de release: <término>" y termina sin generar ningún archivo

### Requirement: El skill extrae features de la sección ## Features del release
El skill SHALL leer la sección `## Features` del archivo de release y extraer cada entrada de feature (ID, nombre, estado de completado). Solo las features presentes en esa sección serán procesadas.

#### Scenario: Release con múltiples features
- **WHEN** el archivo de release contiene tres o más entradas en la sección `## Features`
- **THEN** el skill identifica cada feature con su ID (ej. `FEAT-029`) y nombre

#### Scenario: Release sin sección ## Features o sin entradas
- **WHEN** el archivo de release no contiene la sección `## Features` o la sección está vacía
- **THEN** el skill muestra "No se encontraron features en el archivo de release indicado"
- **THEN** el skill no genera ningún archivo de historia

### Requirement: El skill genera un archivo de historia por feature
El skill SHALL generar exactamente un archivo `story-[ID]-[nombre-kebab].md` por cada feature extraída del release. Cada archivo generado SHALL seguir exactamente la estructura de `docs/specs/templates/story-gherkin-template.md` con las secciones mínimas obligatorias: frontmatter, `## 📖 Historia` (Como/Quiero/Para), y `## ✅ Criterios de aceptación` con al menos un escenario Gherkin principal y uno alternativo/error.

#### Scenario: Generación exitosa de historia desde feature
- **WHEN** el release contiene "FEAT-029 — Generar stories"
- **THEN** el skill genera "story-FEAT-029-generar-stories.md" en "docs/specs/stories/"
- **THEN** el archivo incluye frontmatter con Título, Versión, Estado y Fecha
- **THEN** el archivo incluye las secciones Como/Quiero/Para inferidas del nombre y descripción de la feature
- **THEN** el archivo incluye al menos un escenario Gherkin principal y uno alternativo/error

#### Scenario: Feature con descripción mínima
- **WHEN** la feature solo tiene ID y nombre (sin descripción adicional)
- **THEN** el skill genera la historia inferiendo el Como/Quiero/Para desde el nombre de la feature
- **THEN** las secciones opcionales se incluyen con placeholder `[Por completar]`

### Requirement: El skill nombra los archivos según el patrón estándar
Los archivos generados SHALL seguir el patrón `story-[ID]-[nombre-kebab].md` donde `[ID]` es el identificador de la feature (ej. `FEAT-029`) y `[nombre-kebab]` es el nombre de la feature convertido a kebab-case (minúsculas, palabras separadas por guiones, sin caracteres especiales ni tildes).

#### Scenario: Nombre de feature con espacios y caracteres especiales
- **WHEN** la feature se llama "Generar stories desde release"
- **THEN** el archivo se nombra "story-FEAT-029-generar-stories-desde-release.md"

### Requirement: El skill guarda los archivos en docs/specs/stories/
Los archivos generados SHALL guardarse en el directorio `docs/specs/stories/`. Si el directorio no existe, el skill MUST crearlo antes de escribir los archivos.

#### Scenario: Directorio de destino no existe
- **WHEN** el directorio "docs/specs/stories/" no existe al momento de ejecutar el skill
- **THEN** el skill crea el directorio
- **THEN** los archivos generados se guardan en él correctamente

### Requirement: El skill solicita confirmación antes de sobreescribir una historia existente
Si ya existe un archivo con el mismo nombre en `docs/specs/stories/`, el skill SHALL informar al usuario y solicitar confirmación explícita antes de sobreescribir. Si el usuario rechaza, el skill SHALL omitir ese archivo y continuar con las demás features.

#### Scenario: Historia existente — usuario confirma sobreescritura
- **WHEN** ya existe "docs/specs/stories/story-FEAT-029-generar-stories.md"
- **THEN** el skill informa que el archivo ya existe y solicita confirmación
- **WHEN** el usuario confirma
- **THEN** el skill sobreescribe el archivo con la historia generada

#### Scenario: Historia existente — usuario rechaza sobreescritura
- **WHEN** ya existe "docs/specs/stories/story-FEAT-029-generar-stories.md"
- **THEN** el skill informa que el archivo ya existe y solicita confirmación
- **WHEN** el usuario rechaza
- **THEN** el skill omite ese archivo y continúa procesando las demás features del release

### Requirement: El skill muestra un resumen de los archivos generados
Al finalizar la ejecución, el skill SHALL mostrar un resumen que incluya la lista de archivos creados, los archivos omitidos (por existir y rechazo del usuario), y cualquier feature que no pudo procesarse.

#### Scenario: Ejecución completa con múltiples features
- **WHEN** el skill procesa un release con tres features y genera tres historias exitosamente
- **THEN** el skill muestra "3 historias generadas en docs/specs/stories/" con los nombres de los archivos creados
- **THEN** el skill sugiere ejecutar `/story-evaluation` para verificar la calidad de las historias generadas

## ADDED Requirements

### Requirement: Resolución dinámica de ruta raíz en release-generate-stories
El skill `release-generate-stories` SHALL resolver la ruta base de artefactos mediante `SDDF_ROOT` antes de leer el archivo de release y escribir las historias de usuario.

#### Scenario: Skill genera historias bajo SDDF_ROOT
- **WHEN** el usuario ejecuta `/release-generate-stories` con `SDDF_ROOT` definida
- **THEN** el skill lee el release desde `$SPECS_BASE/specs/releases/`
- **THEN** el skill escribe las historias generadas bajo `$SPECS_BASE/specs/stories/`

#### Scenario: Skill usa docs por defecto sin SDDF_ROOT
- **WHEN** el usuario ejecuta `/release-generate-stories` sin `SDDF_ROOT` definida
- **THEN** el skill opera sobre `docs/specs/releases/` y `docs/specs/stories/` (comportamiento previo)

## MODIFIED Requirements

### Requirement: El skill resuelve el input del archivo de release
El skill SHALL aceptar el ID de release (ej. `EPIC-01`), el nombre del directorio (con o sin ruta completa), o una búsqueda parcial. Si el término coincide con más de un directorio en `{SPECS_BASE}/specs/releases/`, el skill SHALL solicitar al usuario que especifique cuál usar.

#### Scenario: Input como ID de release
- **WHEN** el usuario proporciona "EPIC-06"
- **THEN** el skill busca el directorio que comienza con "EPIC-06" en `{SPECS_BASE}/specs/releases/` y lee su `release.md`

#### Scenario: Input como nombre de directorio completo
- **WHEN** el usuario proporciona "EPIC-06-release-and-story-generator"
- **THEN** el skill usa `{SPECS_BASE}/specs/releases/EPIC-06-release-and-story-generator/release.md` directamente

#### Scenario: Nombre corto sin coincidencias
- **WHEN** el término no coincide con ningún directorio en `{SPECS_BASE}/specs/releases/`
- **THEN** el skill muestra "No se encontró el release: <término>" y termina sin generar archivos

### Requirement: El skill genera un directorio de historia por feature
El skill SHALL generar exactamente un directorio `<FEAT-ID>-<nombre-kebab>/story.md` por cada feature extraída del release. Cada `story.md` generado SHALL seguir exactamente la estructura del template canónico con frontmatter, `## 📖 Historia` y `## ✅ Criterios de aceptación`.

#### Scenario: Generación exitosa de historia desde feature
- **WHEN** el release contiene "FEAT-029 — Generar stories"
- **THEN** el skill genera el directorio `FEAT-029-generar-stories/` en `{SPECS_BASE}/specs/stories/`
- **THEN** dentro del directorio crea `story.md` con frontmatter, Como/Quiero/Para y escenarios Gherkin
- **THEN** el frontmatter incluye `id: FEAT-029`, `type: story` y el `parent` con el ID del release

#### Scenario: Feature con descripción mínima
- **WHEN** la feature solo tiene ID y nombre
- **THEN** el skill genera la historia infiriendo el Como/Quiero/Para desde el nombre de la feature
- **THEN** las secciones opcionales se incluyen con placeholder `[Por completar]`

### Requirement: El skill nombra los directorios de historia según el patrón estándar
Los directorios generados SHALL seguir el patrón `<FEAT-ID>-<nombre-kebab>/` donde `<FEAT-ID>` es el identificador de la feature y `<nombre-kebab>` es el nombre en kebab-case.

#### Scenario: Nombre de feature con espacios y caracteres especiales
- **WHEN** la feature se llama "Generar stories desde release"
- **THEN** el directorio se llama `FEAT-029-generar-stories-desde-release/`
- **THEN** el archivo principal es `story.md` dentro de ese directorio

### Requirement: El skill guarda los directorios en {SPECS_BASE}/specs/stories/
Los directorios de historia generados SHALL crearse bajo `{SPECS_BASE}/specs/stories/`. Si el directorio contenedor no existe, el skill MUST crearlo.

#### Scenario: Directorio de destino no existe
- **WHEN** el directorio `{SPECS_BASE}/specs/stories/` no existe
- **THEN** el skill lo crea antes de escribir los subdirectorios de historia
