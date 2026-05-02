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
