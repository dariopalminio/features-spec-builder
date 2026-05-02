## Why

La validación de entorno (SDDF_ROOT, directorios de specs, templates y config.yaml) está duplicada manualmente en el Paso 0 de más de 20 skills, generando inconsistencias y dificulitando el mantenimiento. Centralizar esta lógica en un único skill de preflight elimina la duplicación y garantiza un contrato de entorno uniforme para todos los skills.

## What Changes

- **Nueva capability** `skill-preflight`: skill orquestador que ejecuta todas las verificaciones de entorno en un único punto de entrada.
- Verifica que `SDDF_ROOT` esté definida y apunte a un directorio válido.
- Confirma que los subdirectorios de specs estándar existen (`docs/specs/projects/`, `docs/specs/releases/`, `docs/specs/stories/`).
- Verifica que los archivos de templates requeridos por el skill invocador estén presentes en `.claude/skills/<skill-name>/assets/`.
- Confirma que `openspec/config.yaml` (o el archivo de configuración del proyecto) está inicializado.
- Cada skill reemplaza su Paso 0 ad-hoc por una única llamada al preflight: `Paso 0: Ejecutar skill-preflight`.

## Capabilities

### New Capabilities

- `skill-preflight`: Protocolo centralizado de verificación de entorno previo a la ejecución de cualquier skill. Recibe como parámetro opcional la lista de templates requeridos por el skill invocador y produce un informe de estado de entorno (OK / WARNING / ERROR) con mensajes accionables.

### Modified Capabilities

- `sddf-root-env-var`: El comportamiento de validación de SDDF_ROOT que actualmente guía a los skills individualmente pasa a ser responsabilidad exclusiva de `skill-preflight`; el spec existente deberá referenciar el nuevo preflight como mecanismo de cumplimiento.

## Impact

- Todos los skills en `.claude/skills/` (~20+) que hoy repiten la lógica de validación en su Paso 0.
- El spec `sddf-root-env-var` debe actualizarse para delegar la validación al nuevo preflight.
- No hay cambios en la API de skills ni en los templates de documentos de salida.
- Sin cambios breaking en workflows de usuario (L1/L2/L3).
