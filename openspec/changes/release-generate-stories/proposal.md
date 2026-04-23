## Why

El framework SDDF ya automatiza la generación de archivos de release desde `project-plan.md` (FEAT-028), pero el siguiente paso — derivar historias de usuario desde un release — sigue siendo manual. El skill `release-generate-stories` cierra esa brecha para completar el pipeline de generación automatizada: plan → release → stories.

## What Changes

- **Nuevo skill** `release-generate-stories` en `.claude/skills/release-generate-stories/SKILL.md` que lee un archivo de release de `docs/specs/releases/` y genera un archivo `story-[ID]-[Nombre-kebab].md` por cada feature definida en la sección `## Features` del release.
- El skill aplica el mismo patrón de resolución de input de `release-input-resolution`: acepta nombre corto, nombre con extensión o ruta relativa completa.
- Cada historia generada sigue exactamente la estructura de `docs/specs/templates/story-gherkin-template.md`.
- Los archivos se guardan en `docs/specs/stories/`. Si el directorio no existe, el skill lo crea.
- Si ya existe un archivo con el mismo nombre, el skill solicita confirmación antes de sobreescribir (idempotencia guiada).

## Capabilities

### New Capabilities

- `release-generate-stories`: Skill que genera archivos de historia de usuario (`story-[ID]-[nombre-kebab].md`) a partir de la sección `## Features` de un archivo de release, usando `story-gherkin-template.md` como estructura de salida.

### Modified Capabilities

_(ninguna — no se modifican requisitos de specs existentes)_

## Impact

- **Archivos nuevos**: `.claude/skills/release-generate-stories/SKILL.md`
- **Directorio de salida**: `docs/specs/stories/` (ya existe; el skill lo crea si falta)
- **Dependencias funcionales**: reutiliza el patrón de `release-input-resolution` (spec existente) y el template `docs/specs/templates/story-gherkin-template.md` (ya existe)
- **Sin breaking changes**: no modifica skills, agentes ni templates existentes
