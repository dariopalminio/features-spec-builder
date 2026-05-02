## ADDED Requirements

### Requirement: Leer SDDF_ROOT para la ruta raíz de especificaciones
Los skills del framework SDDF SHALL leer la variable de entorno `SDDF_ROOT` al inicio de su ejecución para determinar el directorio raíz de especificaciones, usando `docs` como valor por defecto cuando la variable no esté definida.

#### Scenario: Variable SDDF_ROOT definida con ruta válida
- **WHEN** el usuario ejecuta un skill con `SDDF_ROOT` definida a una ruta existente (e.g., `SDDF_ROOT=".sdd"`)
- **THEN** el skill usa el valor de `SDDF_ROOT` como directorio raíz (`SPECS_BASE`)
- **THEN** todos los artefactos (proyectos, releases, historias) se leen y escriben bajo `$SPECS_BASE/specs/`

#### Scenario: Variable SDDF_ROOT no definida
- **WHEN** el usuario ejecuta un skill sin `SDDF_ROOT` definida en el entorno
- **THEN** el skill asume `docs` como valor de `SPECS_BASE`
- **THEN** el comportamiento es idéntico al comportamiento previo a esta feature

#### Scenario: Variable SDDF_ROOT definida con ruta inexistente
- **WHEN** el usuario ejecuta un skill con `SDDF_ROOT` apuntando a una ruta que no existe en el sistema de archivos
- **THEN** el skill emite la advertencia: `⚠️  La ruta definida en SDDF_ROOT no existe. Se usará el valor por defecto: docs`
- **THEN** el skill usa `docs` como valor de `SPECS_BASE` y continúa la ejecución normalmente

### Requirement: Construcción de rutas derivadas desde SPECS_BASE
Una vez resuelto `SPECS_BASE`, los skills SHALL construir todas las sub-rutas (proyectos, releases, historias, templates, índices) concatenando `SPECS_BASE` con el path relativo correspondiente, sin usar rutas absolutas hardcodeadas.

#### Scenario: Rutas de proyectos bajo SPECS_BASE
- **WHEN** un skill necesita acceder al directorio de proyectos
- **THEN** usa la ruta `$SPECS_BASE/specs/projects/` en lugar de `docs/specs/projects/`

#### Scenario: Rutas de historias bajo SPECS_BASE
- **WHEN** un skill necesita acceder al directorio de historias de usuario
- **THEN** usa la ruta `$SPECS_BASE/specs/stories/` en lugar de `docs/specs/stories/`

#### Scenario: Rutas de releases bajo SPECS_BASE
- **WHEN** un skill necesita acceder al directorio de releases
- **THEN** usa la ruta `$SPECS_BASE/specs/releases/` en lugar de `docs/specs/releases/`

### Requirement: Documentación de SDDF_ROOT en README
El archivo `README.md` del proyecto SHALL incluir una sección dedicada a la variable de entorno `SDDF_ROOT` que explique su propósito, los valores válidos y cómo definirla.

#### Scenario: README contiene sección SDDF_ROOT
- **WHEN** un usuario consulta el README del proyecto
- **THEN** encuentra una sección que describe `SDDF_ROOT`, su valor por defecto (`docs`) y un ejemplo de uso (e.g., `export SDDF_ROOT=".sdd"`)
