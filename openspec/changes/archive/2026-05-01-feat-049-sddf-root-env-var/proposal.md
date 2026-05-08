<!-- Referencias -->
[[FEAT-049-reading-of-sddf-root]]

## Why

Los skills del framework SDDF tienen hardcodeada la ruta `docs` como directorio raíz de especificaciones, lo que impide que usuarios y equipos personalicen la ubicación de almacenamiento de artefactos sin modificar directamente los archivos del framework. Incorporar la variable de entorno `SDDF_ROOT` elimina esta rigidez y hace el framework adaptable a diferentes estructuras de proyecto sin cambios en el código.

## What Changes

- Todos los skills que acceden a rutas bajo `$SPECS_BASE/specs/` pasan a leer `SDDF_ROOT` con `docs` como fallback.
- Se introduce una convención estándar de lectura de variable: `SPECS_BASE="${SDDF_ROOT:-docs}"` al inicio de cada skill afectado.
- Si `SDDF_ROOT` apunta a una ruta inexistente, el skill emite una advertencia y cae al valor por defecto `docs`.
- El `README.md` se actualiza con una sección dedicada a `SDDF_ROOT` (propósito, valores válidos, cómo definirla).
- Skills afectados: `project-begin`, `project-discovery`, `project-planning`, `story-creation`, `story-split`, `story-evaluation`, `release-generate-all-stories`, `release-generate-stories`, `releases-from-project-plan`, `project-story-mapping`, `reverse-engineering`, `header-aggregation`, y cualquier otro skill que referencie `$SPECS_BASE/specs/`.

## Capabilities

### New Capabilities

- `sddf-root-env-var`: Convención y comportamiento estándar para que los skills del framework lean la variable de entorno `SDDF_ROOT` y usen `docs` como directorio raíz por defecto, permitiendo la configuración dinámica de la ubicación de artefactos.

### Modified Capabilities

- `project-begin-intention-skill`: La ruta base de artefactos pasa de fija (`docs`) a dinámica vía `SDDF_ROOT`.
- `project-discovery-skill`: Idem — rutas de lectura/escritura de specs sujetas a `SDDF_ROOT`.
- `project-planning-skill`: Idem — rutas de planes y releases sujetas a `SDDF_ROOT`.
- `release-generate-stories`: Idem — directorio de salida de historias sujeto a `SDDF_ROOT`.
- `release-generate-all-stories`: Idem.
- `releases-from-project-plan`: Idem — ruta de releases sujeta a `SDDF_ROOT`.
- `reverse-engineering`: Idem — rutas de salida sujetas a `SDDF_ROOT`.

## Impact

- **Skills (`.claude/skills/`)**: Actualización de todos los archivos `SKILL.md` afectados para incluir la lectura de `SDDF_ROOT`.
- **Documentación**: `README.md` y guía de instalación actualizados.
- **Retrocompatibilidad**: Total — sin `SDDF_ROOT` definida, el comportamiento es idéntico al actual.
- **Sin breaking changes**: El cambio es puramente aditivo; no altera la lógica de negocio ni los contratos de los skills.
