## MODIFIED Requirements

### Requirement: Leer SDDF_ROOT para la ruta raíz de especificaciones
Los skills del framework SDDF SHALL leer la variable de entorno `SDDF_ROOT` a través del skill `skill-preflight` al inicio de su ejecución para determinar el directorio raíz de especificaciones, usando `docs` como valor por defecto cuando la variable no esté definida. Los skills individuales NO deben replicar esta lógica de validación; en su lugar DEBEN invocar `skill-preflight` en su Paso 0.

#### Scenario: Variable SDDF_ROOT definida con ruta válida
- **WHEN** el usuario ejecuta un skill con `SDDF_ROOT` definida a una ruta existente (e.g., `SDDF_ROOT=".sdd"`)
- **THEN** `skill-preflight` valida la ruta y la expone como `SPECS_BASE` al skill invocador
- **THEN** todos los artefactos (proyectos, releases, historias) se leen y escriben bajo `$SPECS_BASE/specs/`

#### Scenario: Variable SDDF_ROOT no definida
- **WHEN** el usuario ejecuta un skill sin `SDDF_ROOT` definida en el entorno
- **THEN** `skill-preflight` asume `docs` como valor de `SPECS_BASE` y emite un WARNING
- **THEN** el comportamiento es idéntico al comportamiento previo a esta feature

#### Scenario: Variable SDDF_ROOT definida con ruta inexistente
- **WHEN** el usuario ejecuta un skill con `SDDF_ROOT` apuntando a una ruta que no existe en el sistema de archivos
- **THEN** `skill-preflight` emite `[ERROR] SDDF_ROOT apunta a ruta inexistente` y detiene la ejecución
- **THEN** el skill invocador no continúa hasta que el usuario corrija el entorno
