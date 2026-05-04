### Requirement: El skill extrae todos los releases de project-plan.md
El skill SHALL leer `$SPECS_BASE/specs/projects/project-plan.md` y extraer cada bloque de release definido bajo la sección `## Propuesta de Releases`. Por cada bloque `### Release NN — Nombre` encontrado, el skill MUST generar un archivo de especificación de release independiente.

#### Scenario: Plan con múltiples releases
- **WHEN** `project-plan.md` contiene dos o más bloques `### Release NN — Nombre` bajo `## Propuesta de Releases`
- **THEN** el skill genera exactamente un archivo `release-[ID]-[nombre-kebab].md` por cada bloque encontrado

#### Scenario: Plan con un único release
- **WHEN** `project-plan.md` contiene exactamente un bloque `### Release NN — Nombre`
- **THEN** el skill genera exactamente un archivo de release

### Requirement: El skill genera archivos que siguen el template canónico
Cada archivo generado SHALL seguir exactamente la estructura de `$SPECS_BASE/specs/templates/release-spec-template.md`. Las secciones obligatorias (frontmatter con Título/Versión/Estado/Fecha, `## Descripción`, `## Features`, `## Flujos Críticos / Smoke Tests`) MUST estar presentes y pobladas con los datos disponibles en el plan.

#### Scenario: Secciones obligatorias pobladas desde el plan
- **WHEN** el plan contiene objetivo, features y criterios de éxito para un release
- **THEN** el archivo generado incluye esos datos en las secciones correspondientes del template
- **THEN** el archivo pasa la validación del skill `release-format-validation`

#### Scenario: Secciones opcionales con placeholder
- **WHEN** el plan no contiene datos para una sección opcional del template (Requerimiento, Impacto, Dependencias, Riesgos, Notas)
- **THEN** el archivo generado incluye esa sección con un placeholder `[Por completar]`

### Requirement: El skill nombra los archivos según el patrón estándar
Los archivos generados SHALL seguir el patrón `release-[ID]-[nombre-kebab].md` donde `[ID]` es el número de dos dígitos del release y `[nombre-kebab]` es el nombre del release convertido a kebab-case (minúsculas, palabras separadas por guiones, sin caracteres especiales).

#### Scenario: Nombre con espacios y caracteres especiales
- **WHEN** el nombre del release contiene espacios, tildes o signos de puntuación (ej. "Estructura Base y Mecanismo de Templates")
- **THEN** el archivo se nombra con el equivalente kebab-case (ej. `release-00-estructura-base-y-mecanismo-de-templates.md`)

### Requirement: El skill guarda los archivos en docs/specs/releases/
Los archivos generados SHALL guardarse en el directorio `$SPECS_BASE/specs/releases/`. Si el directorio no existe, el skill MUST crearlo antes de escribir los archivos.

#### Scenario: Directorio de destino no existe
- **WHEN** el directorio `$SPECS_BASE/specs/releases/` no existe al momento de ejecutar el skill
- **THEN** el skill crea el directorio
- **THEN** los archivos generados se guardan en él correctamente

#### Scenario: Archivo de destino ya existe
- **WHEN** ya existe un archivo con el mismo nombre en `$SPECS_BASE/specs/releases/`
- **THEN** el skill informa al usuario que el archivo ya existe antes de sobreescribirlo
- **THEN** el skill solicita confirmación antes de proceder con la sobreescritura

### Requirement: El skill maneja correctamente inputs inválidos
El skill SHALL detectar condiciones de error antes de intentar generar archivos y MUST mostrar un mensaje descriptivo sin generar archivos parciales.

#### Scenario: project-plan.md no existe
- **WHEN** el archivo `$SPECS_BASE/specs/projects/project-plan.md` no existe
- **THEN** el skill muestra el mensaje "No se encontró docs/specs/projects/project-plan.md"
- **THEN** el skill no genera ningún archivo de release

#### Scenario: El plan no contiene la sección de releases
- **WHEN** `project-plan.md` existe pero no contiene ningún bloque `### Release` bajo `## Propuesta de Releases`
- **THEN** el skill muestra el mensaje "No se encontraron releases planificados en project-plan.md"
- **THEN** el skill no genera ningún archivo de release

## ADDED Requirements

### Requirement: Resolución dinámica de ruta raíz en releases-from-project-plan
El skill `releases-from-project-plan` SHALL resolver la ruta base de artefactos mediante `SDDF_ROOT` antes de leer el plan de proyecto y escribir los archivos de release.

#### Scenario: Skill genera releases bajo SDDF_ROOT
- **WHEN** el usuario ejecuta `/releases-from-project-plan` con `SDDF_ROOT` definida
- **THEN** el skill lee `project-plan.md` desde `$SPECS_BASE/specs/projects/`
- **THEN** el skill escribe los archivos de release bajo `$SPECS_BASE/specs/releases/`

#### Scenario: Skill usa docs por defecto sin SDDF_ROOT
- **WHEN** el usuario ejecuta `/releases-from-project-plan` sin `SDDF_ROOT` definida
- **THEN** el skill opera sobre `$SPECS_BASE/specs/` (comportamiento previo)

## MODIFIED Requirements

### Requirement: El skill extrae todos los releases de project-plan.md
El skill SHALL leer `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/project-plan.md` del proyecto activo y extraer cada bloque de release definido bajo la sección `## Propuesta de Releases`. Por cada bloque `### Release NN — Nombre` encontrado, el skill MUST generar un directorio de release independiente con su archivo `release.md`.

#### Scenario: Plan con múltiples releases
- **WHEN** `project-plan.md` contiene dos o más bloques `### Release NN — Nombre` bajo `## Propuesta de Releases`
- **THEN** el skill genera exactamente un directorio `EPIC-NN-<nombre-kebab>/release.md` por cada bloque encontrado

#### Scenario: Plan con un único release
- **WHEN** `project-plan.md` contiene exactamente un bloque `### Release NN — Nombre`
- **THEN** el skill genera exactamente un directorio de release con su `release.md`

### Requirement: El skill nombra los directorios de release según el patrón estándar
Los directorios de release generados SHALL seguir el patrón `EPIC-<NN>-<nombre-kebab>/` donde `<NN>` es el número de dos dígitos del release y `<nombre-kebab>` es el nombre del release en kebab-case. El archivo principal SHALL llamarse `release.md`.

#### Scenario: Nombre con espacios y caracteres especiales
- **WHEN** el nombre del release es "Estructura Base y Mecanismo de Templates"
- **THEN** el directorio se llama `EPIC-00-estructura-base-y-mecanismo-de-templates/`
- **THEN** el archivo principal es `EPIC-00-estructura-base-y-mecanismo-de-templates/release.md`

### Requirement: El skill guarda los archivos en {SPECS_BASE}/specs/releases/
Los directorios de release generados SHALL crearse bajo `{SPECS_BASE}/specs/releases/`. Si el directorio contenedor no existe, el skill MUST crearlo antes de escribir.

#### Scenario: Directorio de destino no existe
- **WHEN** el directorio `{SPECS_BASE}/specs/releases/` no existe al momento de ejecutar el skill
- **THEN** el skill crea el directorio
- **THEN** los subdirectorios de release generados se crean dentro de él correctamente

#### Scenario: Directorio de release ya existe
- **WHEN** ya existe un directorio con el mismo nombre en `{SPECS_BASE}/specs/releases/`
- **THEN** el skill informa al usuario que el directorio ya existe antes de sobreescribirlo
- **THEN** el skill solicita confirmación antes de proceder
