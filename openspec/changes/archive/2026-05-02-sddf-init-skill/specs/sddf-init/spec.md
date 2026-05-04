## ADDED Requirements

### Requirement: Inicializar estructura de directorios SDDF
El skill `sddf-init` SHALL crear los directorios base del framework SDDF bajo la ruta raíz de especificaciones (`SPECS_BASE`). Si los directorios ya existen, no deben ser modificados ni eliminados (idempotencia).

#### Scenario: Inicialización exitosa en proyecto nuevo
- **WHEN** el usuario ejecuta `sddf-init` en un repositorio sin estructura SDDF previa y sin `SDDF_ROOT` definida
- **THEN** se crean los directorios `$SPECS_BASE/specs/projects/`, `$SPECS_BASE/specs/releases/` y `$SPECS_BASE/specs/stories/`
- **THEN** se muestra `✓ Entorno SDDF inicializado correctamente en docs/`

#### Scenario: Inicialización con SDDF_ROOT personalizado
- **WHEN** el usuario ejecuta `sddf-init` con `SDDF_ROOT="custom/specs"` y ese directorio existe
- **THEN** se crean los directorios `custom/specs/projects/`, `custom/specs/releases/` y `custom/specs/stories/`
- **THEN** se muestra `✓ Entorno SDDF inicializado correctamente en custom/specs/`

#### Scenario: Entorno ya inicializado (idempotencia)
- **WHEN** el usuario ejecuta `sddf-init` y los directorios `$SPECS_BASE/specs/projects/`, `$SPECS_BASE/specs/releases/` y `$SPECS_BASE/specs/stories/` ya existen
- **THEN** los directorios existentes no son modificados ni eliminados
- **THEN** se muestra `✓ Entorno ya inicializado — sin cambios necesarios`

### Requirement: Generar openspec/config.yaml mínimo
El skill `sddf-init` SHALL generar el archivo `openspec/config.yaml` con la estructura mínima requerida (`schema: spec-driven` más comentarios del template), únicamente si el archivo no existe previamente.

#### Scenario: config.yaml no existe
- **WHEN** el usuario ejecuta `sddf-init` y `openspec/config.yaml` no existe
- **THEN** se crea `openspec/config.yaml` con `schema: spec-driven` y los comentarios del template estándar

#### Scenario: config.yaml ya existe con contenido
- **WHEN** el usuario ejecuta `sddf-init` y `openspec/config.yaml` ya existe con contenido
- **THEN** `openspec/config.yaml` NO es sobrescrito
- **THEN** se muestra `[INFO] openspec/config.yaml ya existe — se mantiene sin cambios`

### Requirement: Generar .env.template documentando SDDF_ROOT
El skill `sddf-init` SHALL generar el archivo `.env.template` que documente la variable de entorno `SDDF_ROOT`, únicamente si el archivo no existe previamente.

#### Scenario: .env.template no existe
- **WHEN** el usuario ejecuta `sddf-init` y `.env.template` no existe
- **THEN** se crea `.env.template` con la variable `SDDF_ROOT` documentada y comentada

#### Scenario: .env.template ya existe
- **WHEN** el usuario ejecuta `sddf-init` y `.env.template` ya existe
- **THEN** `.env.template` NO es sobrescrito
- **THEN** se muestra `[INFO] .env.template ya existe — se mantiene sin cambios`

### Requirement: Validar SDDF_ROOT antes de operar
El skill `sddf-init` SHALL validar la variable `SDDF_ROOT` antes de crear cualquier directorio o archivo. Si `SDDF_ROOT` está definida pero la ruta no existe, SHALL abortar con un mensaje de error accionable sin crear nada.

#### Scenario: SDDF_ROOT no definida
- **WHEN** `SDDF_ROOT` no está definida en el entorno
- **THEN** el skill usa `docs/` como ruta raíz y continúa la inicialización

#### Scenario: SDDF_ROOT definida y válida
- **WHEN** `SDDF_ROOT` está definida y la ruta existe
- **THEN** el skill usa `SDDF_ROOT` como ruta raíz y continúa la inicialización

#### Scenario: SDDF_ROOT apunta a ruta inexistente
- **WHEN** `SDDF_ROOT` está definida pero la ruta no existe
- **THEN** se muestra `[ERROR] SDDF_ROOT apunta a ruta inexistente: <ruta>`
- **THEN** se muestra la sugerencia `Corrige SDDF_ROOT o elimina la variable para usar docs/ como valor por defecto`
- **THEN** no se crea ningún directorio ni archivo

### Requirement: Reportar resultado distinguiendo artefactos creados de existentes
El skill `sddf-init` SHALL emitir un informe final que distinga claramente entre artefactos recién creados y artefactos que ya existían.

#### Scenario: Informe al finalizar inicialización
- **WHEN** el skill `sddf-init` completa su ejecución (con o sin cambios)
- **THEN** muestra el estado de cada artefacto verificado: `[CREADO]` si fue creado en esta ejecución, `[YA EXISTÍA]` si ya existía previamente
