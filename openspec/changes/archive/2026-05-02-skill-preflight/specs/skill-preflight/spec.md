## ADDED Requirements

### Requirement: Verificar SDDF_ROOT al inicio de cada skill
El skill `skill-preflight` SHALL verificar que la variable de entorno `SDDF_ROOT` esté definida y apunte a un directorio accesible antes de continuar la ejecución del skill invocador.

#### Scenario: SDDF_ROOT definida y válida
- **WHEN** se invoca `skill-preflight` con `SDDF_ROOT` apuntando a un directorio existente
- **THEN** el preflight emite `[OK]  SDDF_ROOT = <ruta>` y continúa con las siguientes verificaciones

#### Scenario: SDDF_ROOT no definida
- **WHEN** se invoca `skill-preflight` sin `SDDF_ROOT` en el entorno
- **THEN** el preflight emite `[WARNING] SDDF_ROOT no definida → Se usará "docs" como valor por defecto`
- **THEN** el preflight continúa usando `docs` como `SPECS_BASE`

#### Scenario: SDDF_ROOT apunta a ruta inexistente
- **WHEN** se invoca `skill-preflight` con `SDDF_ROOT` apuntando a una ruta que no existe
- **THEN** el preflight emite `[ERROR]  SDDF_ROOT apunta a ruta inexistente: <ruta> → Crear el directorio o corregir la variable`
- **THEN** el preflight detiene la ejecución y solicita al usuario corregir el entorno antes de continuar

### Requirement: Verificar subdirectorios de specs estándar
El skill `skill-preflight` SHALL verificar que existen los subdirectorios de specs estándar del SDDF bajo `SPECS_BASE`.

#### Scenario: Todos los subdirectorios existen
- **WHEN** `$SPECS_BASE/specs/projects/`, `$SPECS_BASE/specs/releases/` y `$SPECS_BASE/specs/stories/` existen bajo `SPECS_BASE`
- **THEN** el preflight emite `[OK]` para cada directorio y continúa

#### Scenario: Algún subdirectorio falta
- **WHEN** uno o más subdirectorios de specs no existen bajo `SPECS_BASE`
- **THEN** el preflight emite `[WARNING] <ruta> no encontrado → Crear el directorio si el skill lo requiere`
- **THEN** el preflight continúa (el skill invocador decide si el directorio faltante es bloqueante)

### Requirement: Verificar templates requeridos por el skill invocador
El skill `skill-preflight` SHALL verificar la existencia de los archivos de templates declarados como requeridos por el skill invocador.

#### Scenario: Todos los templates presentes
- **WHEN** el skill invocador declara una lista de templates y todos existen en `.claude/skills/<skill-name>/assets/`
- **THEN** el preflight emite `[OK]` para cada template y reporta el resultado final como OK

#### Scenario: Algún template faltante
- **WHEN** el skill invocador declara un template que no existe en su directorio `assets/`
- **THEN** el preflight emite `[ERROR]  Template faltante: <ruta> → Verificar que el archivo existe en assets/`
- **THEN** el preflight detiene la ejecución del skill invocador e informa al usuario

### Requirement: Verificar inicialización de config.yaml
El skill `skill-preflight` SHALL verificar que `openspec/config.yaml` existe y no está vacío.

#### Scenario: config.yaml inicializado
- **WHEN** `openspec/config.yaml` existe y tiene contenido válido
- **THEN** el preflight emite `[OK]  openspec/config.yaml inicializado`

#### Scenario: config.yaml ausente o vacío
- **WHEN** `openspec/config.yaml` no existe o está vacío
- **THEN** el preflight emite `[WARNING] openspec/config.yaml no inicializado → Ejecutar /openspec-init-config`
- **THEN** el preflight continúa (es advertencia, no error bloqueante)

### Requirement: Producir informe de estado de entorno
El skill `skill-preflight` SHALL producir un informe de estado con el resultado de todas las verificaciones antes de ceder el control al skill invocador.

#### Scenario: Entorno completamente válido
- **WHEN** todas las verificaciones pasan sin errores
- **THEN** el preflight emite `✓ Entorno OK — listo para continuar` y el skill invocador prosigue su ejecución

#### Scenario: Entorno con errores bloqueantes
- **WHEN** al menos una verificación produce `[ERROR]`
- **THEN** el preflight emite `✗ Entorno inválido — corregir los errores antes de continuar` y detiene la ejecución del skill invocador
