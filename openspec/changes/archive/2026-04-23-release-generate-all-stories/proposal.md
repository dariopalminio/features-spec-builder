## Why

El skill `release-generate-stories` (FEAT-029) genera historias de usuario desde un único archivo de release. Cuando un proyecto tiene múltiples releases, el desarrollador debe invocar el skill repetidamente para cada archivo. El skill `release-generate-all-stories` elimina esa fricción procesando todos los releases del proyecto en una sola invocación.

## What Changes

- **Nuevo skill** `release-generate-all-stories` en `.claude/skills/release-generate-all-stories/SKILL.md` que escanea `docs/specs/releases/`, procesa cada archivo de release en orden alfabético, y genera un archivo `story-[ID]-[nombre-kebab].md` por cada feature usando el mismo flujo que `release-generate-stories`.
- El skill implementa **idempotencia guiada en modo batch**: si detecta que ya existen archivos de historia que serían sobreescritos, solicita una confirmación global al inicio (sobreescribir todos / saltar todos los existentes / decidir uno por uno) para evitar interrupciones repetitivas durante el procesamiento.
- Al finalizar, muestra un resumen con contadores: releases procesados / historias generadas / historias saltadas / releases sin features.

## Capabilities

### New Capabilities

- `release-generate-all-stories`: Skill orquestador que itera sobre todos los archivos `.md` de `docs/specs/releases/` y genera stories para cada uno, delegando en el mismo flujo de extracción y generación de `release-generate-stories`.

### Modified Capabilities

_(ninguna — no se modifican requisitos de specs existentes)_

## Impact

- **Archivos nuevos**: `.claude/skills/release-generate-all-stories/SKILL.md`
- **Dependencias funcionales**: reutiliza el flujo de generación de `release-generate-stories` (FEAT-029); necesita `docs/specs/releases/` con archivos de release y `docs/specs/templates/story-gherkin-template.md`
- **Sin breaking changes**: no modifica el skill `release-generate-stories` ni ningún otro artefacto existente
