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
