### Requirement: Configuración de ruta base (SPECS_BASE)
El skill SHALL determinar el directorio raíz de especificaciones antes de cualquier operación con archivos, leyendo la variable de entorno `SDDF_ROOT` y usando `$SPECS_BASE` en lugar de `docs` para todas las rutas de artefactos.

#### Scenario: SDDF_ROOT definida y ruta existe
- **WHEN** la variable de entorno `SDDF_ROOT` está definida y la ruta referenciada existe
- **THEN** el skill usa ese valor como `SPECS_BASE`

#### Scenario: SDDF_ROOT no definida
- **WHEN** la variable de entorno `SDDF_ROOT` no está definida
- **THEN** el skill usa `SPECS_BASE=docs`

#### Scenario: SDDF_ROOT definida pero ruta inexistente
- **WHEN** la variable de entorno `SDDF_ROOT` está definida pero la ruta no existe
- **THEN** el skill muestra `⚠️ La ruta definida en SDDF_ROOT no existe. Se usará el valor por defecto: docs` y usa `SPECS_BASE=docs`

### Requirement: Template C4 leído dinámicamente en tiempo de ejecución
El skill SHALL leer el archivo `assets/c4-context-template.puml` al inicio de la ejecución y usarlo como estructura base para el diagrama generado.

#### Scenario: Template encontrado
- **WHEN** el skill inicia y el archivo `assets/c4-context-template.puml` existe
- **THEN** el skill usa el template como estructura base sin hardcodear la sintaxis PlantUML/C4

#### Scenario: Template no encontrado
- **WHEN** el skill inicia y `assets/c4-context-template.puml` no existe
- **THEN** el skill detiene la ejecución con mensaje de error indicando la ruta esperada

### Requirement: Modo interactivo — preguntas guiadas al usuario
El skill SHALL operar en modo interactivo por defecto (`--interactive`), formulando preguntas al usuario para recopilar la información necesaria para construir el diagrama C4 Nivel 1.

#### Scenario: Preguntas obligatorias completadas
- **WHEN** el usuario ejecuta el skill sin argumentos o con `--interactive`
- **THEN** el skill pregunta: nombre del sistema, descripción del sistema, actores (personas/roles) con sus descripciones, sistemas externos con nombre/descripción/protocolo, y relaciones entre actores, el sistema y los sistemas externos

#### Scenario: Preview antes de escribir
- **WHEN** el usuario ha respondido todas las preguntas
- **THEN** el skill muestra el diagrama PlantUML generado y solicita confirmación antes de escribir el archivo

### Requirement: Modo automático — inferencia desde archivos (`--from-files`)
El skill SHALL operar en modo automático cuando se invoca con `--from-files` o cuando se indica la ruta a un documento de especificaciones, infiriendo actores, sistemas externos y relaciones de los archivos del proyecto.

#### Scenario: Inferencia desde documento de specs indicado
- **WHEN** el usuario ejecuta el skill indicando la ruta a un `project.md` o `requirement-spec.md`
- **THEN** el skill lee el documento, extrae actores y sistemas del contenido, y genera el diagrama sin preguntas adicionales al usuario

#### Scenario: Inferencia desde archivos del proyecto
- **WHEN** el usuario ejecuta el skill con `--from-files` sin indicar una ruta específica
- **THEN** el skill escanea `README.md`, `$SPECS_BASE/specs/`, `openspec/` y el código fuente para inferir nombre del sistema, actores y sistemas externos

#### Scenario: Preview antes de escribir en modo automático
- **WHEN** el skill termina de inferir el diagrama en modo `--from-files`
- **THEN** el skill muestra el diagrama PlantUML generado y solicita confirmación o corrección interactiva antes de escribir el archivo

### Requirement: Fallback a modo interactivo cuando el documento indicado no existe
El skill SHALL manejar el error de archivo no encontrado de forma recuperable, sin terminar abruptamente.

#### Scenario: Documento indicado no encontrado
- **WHEN** el usuario indica la ruta a un documento de specs que no existe
- **THEN** el skill muestra el mensaje `❌ No se encontró el archivo de especificaciones indicado`
  Y el skill lista los proyectos disponibles en `$SPECS_BASE/specs/projects/`
  Y el skill ofrece continuar en modo interactivo o seleccionar un proyecto existente

### Requirement: Generación del archivo de salida
El skill SHALL escribir el diagrama generado en `$SPECS_BASE/specs/projects/<PROJ-slug>/context-diagram.puml`, creando el directorio si no existe.

#### Scenario: Directorio de proyecto existe
- **WHEN** el directorio `$SPECS_BASE/specs/projects/<PROJ-slug>/` existe
- **THEN** el skill escribe `context-diagram.puml` en ese directorio

#### Scenario: context-diagram.puml ya existe
- **WHEN** ya existe un archivo `context-diagram.puml` en el directorio destino
- **THEN** el skill pregunta al usuario si desea sobreescribir el archivo existente antes de escribir

#### Scenario: Directorio de proyecto no existe
- **WHEN** el directorio `$SPECS_BASE/specs/projects/<PROJ-slug>/` no existe
- **THEN** el skill muestra error indicando que el proyecto no existe y lista los proyectos disponibles

### Requirement: Diagrama C4 Nivel 1 con sintaxis PlantUML estricta
El archivo `context-diagram.puml` producido SHALL contener un diagrama C4 Nivel 1 (System Context) válido usando la librería `C4-PlantUML`, con los elementos `Person()`, `System()`, `System_Ext()` y `Rel()`.

#### Scenario: Diagrama contiene elementos C4 mínimos
- **WHEN** el skill genera el archivo `context-diagram.puml`
- **THEN** el archivo incluye `!include C4Context.puml`, al menos un `System()`, al menos un `Person()` o `System_Ext()`, y al menos una `Rel()`

#### Scenario: Diagrama no contiene sintaxis de nivel 2 o 3
- **WHEN** el skill genera el archivo
- **THEN** el archivo no contiene elementos `Container()`, `Component()` ni `ContainerDb()` (propios de niveles C4 superiores)
