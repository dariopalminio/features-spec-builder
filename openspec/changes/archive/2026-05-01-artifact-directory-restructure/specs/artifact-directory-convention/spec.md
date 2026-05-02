## ADDED Requirements

### Requirement: Cada workitem se almacena en su propio directorio identificado
El sistema SHALL organizar cada workitem (proyecto, release, historia) en un subdirectorio propio dentro de su carpeta de tipo, usando el identificador único del workitem como nombre del directorio.

#### Scenario: Creación de directorio de proyecto
- **WHEN** se crea un nuevo proyecto con ID `PROJ-01` y nombre `mi-proyecto`
- **THEN** el sistema MUST crear el directorio `{SPECS_BASE}/specs/projects/PROJ-01-mi-proyecto/`
- **THEN** el archivo principal SHALL llamarse `project.md`

#### Scenario: Creación de directorio de release
- **WHEN** se crea un nuevo release con ID `EPIC-01` y nombre `features-base`
- **THEN** el sistema MUST crear el directorio `{SPECS_BASE}/specs/releases/EPIC-01-features-base/`
- **THEN** el archivo principal SHALL llamarse `release.md`

#### Scenario: Creación de directorio de historia
- **WHEN** se crea una nueva historia con ID `FEAT-001` y nombre `login-usuario`
- **THEN** el sistema MUST crear el directorio `{SPECS_BASE}/specs/stories/FEAT-001-login-usuario/`
- **THEN** el archivo principal SHALL llamarse `story.md`

### Requirement: La carpeta raíz de proyectos es projects/ (plural)
El sistema SHALL usar `{SPECS_BASE}/specs/projects/` (plural) como carpeta contenedora de todos los proyectos, reemplazando la carpeta anterior `{SPECS_BASE}/specs/projects/` (singular).

#### Scenario: Carpeta de proyectos en plural
- **WHEN** un skill escribe o lee artefactos de proyecto
- **THEN** SHALL usar la ruta `{SPECS_BASE}/specs/projects/` y MUST NOT usar `{SPECS_BASE}/specs/projects/`

### Requirement: El ID del workitem determina el nombre de su directorio
El nombre del directorio de un workitem SHALL seguir el patrón `<PREFIX>-<NN>-<nombre-kebab>`, donde `<PREFIX>` es `PROJ`, `EPIC` o `FEAT` según el tipo, `<NN>` es un número secuencial de dos o más dígitos y `<nombre-kebab>` es el nombre del workitem en kebab-case.

#### Scenario: Derivación del nombre de directorio desde el título
- **WHEN** el usuario crea un proyecto con título "Mi Primer Proyecto" y se le asigna el ID `PROJ-01`
- **THEN** el directorio SHALL llamarse `PROJ-01-mi-primer-proyecto`

### Requirement: Frontmatter obligatorio en archivos principales de workitem
Cada archivo principal de workitem (`project.md`, `release.md`, `story.md`) SHALL incluir un bloque frontmatter YAML con los campos: `type`, `id`, `title`, `status`, `parent`, `created`, `updated`.

#### Scenario: Frontmatter mínimo en project.md
- **WHEN** el skill crea `project.md`
- **THEN** el archivo MUST comenzar con un bloque frontmatter que incluya los campos `type: project`, `id`, `title`, `status`, `parent: null`, `created` y `updated`

#### Scenario: Frontmatter mínimo en release.md
- **WHEN** el skill crea `release.md`
- **THEN** el archivo MUST incluir `type: release`, `parent` con el ID del proyecto padre y los demás campos obligatorios

#### Scenario: Frontmatter mínimo en story.md
- **WHEN** el skill crea `story.md`
- **THEN** el archivo MUST incluir `type: story`, `parent` con el ID del release o proyecto padre y los demás campos obligatorios
