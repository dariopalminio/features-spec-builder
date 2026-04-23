### Requirement: El skill descubre todos los archivos de release en docs/specs/releases/
El skill SHALL escanear el directorio `docs/specs/releases/` y recopilar todos los archivos con extensión `.md` para procesarlos. Si el directorio no existe o no contiene archivos `.md`, el skill MUST terminar con un mensaje descriptivo sin generar ningún archivo.

#### Scenario: Directorio con múltiples releases
- **WHEN** `docs/specs/releases/` contiene tres o más archivos `.md`
- **THEN** el skill identifica todos los archivos como candidatos a procesar

#### Scenario: Directorio vacío o inexistente
- **WHEN** `docs/specs/releases/` no existe o no contiene archivos `.md`
- **THEN** el skill muestra "No se encontraron archivos de release en docs/specs/releases/"
- **THEN** el skill no genera ningún archivo de historia

### Requirement: El skill procesa los releases en orden alfabético por nombre de archivo
El skill SHALL ordenar los archivos de release por nombre de archivo en orden alfabético antes de procesarlos. Dado que los nombres siguen el patrón `release-NN-nombre.md` con ID de dos dígitos, el orden alfabético equivale al orden numérico del release.

#### Scenario: Procesamiento en orden de release
- **WHEN** existen "release-00-base.md", "release-06-story-gen.md" y "release-02-project.md"
- **THEN** el skill los procesa en el orden: release-00, release-02, release-06

### Requirement: El skill aplica el mismo flujo de generación que release-generate-stories para cada release
Para cada archivo de release descubierto, el skill SHALL aplicar el mismo flujo de extracción de features y generación de historias definido en el skill `release-generate-stories`: leer la sección `## Features`, extraer cada feature con su ID y nombre, generar un archivo `story-[ID]-[nombre-kebab].md` en `docs/specs/stories/` siguiendo la estructura de `story-gherkin-template.md`.

#### Scenario: Release con features definidas
- **WHEN** un archivo de release contiene tres features en su sección `## Features`
- **THEN** el skill genera exactamente tres archivos de historia en `docs/specs/stories/`
- **THEN** cada archivo sigue la estructura de `docs/specs/templates/story-gherkin-template.md`

#### Scenario: Release sin sección Features o sin entradas
- **WHEN** un archivo de release no contiene la sección `## Features` o la sección está vacía
- **THEN** el skill registra ese release como "sin features" en el resumen final
- **THEN** el skill continúa procesando el siguiente release sin interrumpir el batch

### Requirement: El skill detecta conflictos anticipadamente y solicita una confirmación global única
Antes de comenzar el procesamiento, el skill SHALL verificar si ya existen en `docs/specs/stories/` archivos de historia que serían generados por el batch. Si hay al menos un conflicto, el skill MUST presentar una confirmación global con tres opciones: sobreescribir todos los existentes, saltar todos los existentes, o decidir uno por uno durante el procesamiento.

#### Scenario: Conflictos detectados — usuario elige sobreescribir todo
- **WHEN** el skill detecta que 5 de 20 historias a generar ya existen en `docs/specs/stories/`
- **THEN** el skill muestra la lista de conflictos y presenta las tres opciones antes de procesar
- **WHEN** el usuario elige "sobreescribir todos"
- **THEN** el skill sobreescribe todos los archivos existentes sin preguntar de nuevo durante el batch

#### Scenario: Conflictos detectados — usuario elige saltar todos los existentes
- **WHEN** el usuario elige "saltar todos los existentes"
- **THEN** el skill omite los 5 archivos que ya existen y genera solo los 15 nuevos

#### Scenario: Conflictos detectados — usuario elige decidir uno por uno
- **WHEN** el usuario elige "decidir uno por uno"
- **THEN** el skill pregunta individualmente por cada archivo en conflicto durante el procesamiento

#### Scenario: Sin conflictos
- **WHEN** ninguna de las historias a generar ya existe en `docs/specs/stories/`
- **THEN** el skill procede directamente al procesamiento sin mostrar la pantalla de confirmación de idempotencia

### Requirement: El skill muestra un resumen consolidado al finalizar
Al terminar el procesamiento de todos los releases, el skill SHALL mostrar un resumen con los siguientes contadores: número de releases procesados, número total de historias generadas, número de historias saltadas (por conflicto), número de releases sin features detectados. Además SHALL listar los archivos creados y sugerir el siguiente paso.

#### Scenario: Ejecución completa con resultados mixtos
- **WHEN** el skill procesa 6 releases: 5 con features y 1 sin features, generando 20 historias y saltando 3 existentes
- **THEN** el resumen muestra: "6 releases procesados | 20 historias generadas | 3 historias saltadas | 1 release sin features"
- **THEN** el skill lista los archivos creados con sus rutas
- **THEN** el skill sugiere ejecutar `/story-evaluation` para verificar la calidad de las historias generadas
