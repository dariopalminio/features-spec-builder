## Why

El nombre `project-begin-intention` es verboso y no sigue la convención de nombres cortos y directos del resto de skills del proyecto. Renombrarlo a `project-begin` mejora la legibilidad y consistencia del sistema.

## What Changes

- Renombrar el directorio `.claude/skills/project-begin-intention/` a `.claude/skills/project-begin/`
- Actualizar cualquier referencia al nombre anterior (`project-begin-intention`) en archivos internos del skill (SKILL.md, templates, etc.)
- Actualizar referencias en `MEMORY.md` u otros archivos de índice que mencionen el nombre del skill
- Actualizar el spec existente `openspec/specs/project-begin-intention-skill/` si corresponde

## Capabilities

### New Capabilities
<!-- None: this is a pure rename refactor with no behavior changes -->

### Modified Capabilities
- `project-begin-intention-skill`: El spec existente necesita reflejar el nuevo nombre del skill (`project-begin`)

## Impact

- Directorio: `.claude/skills/project-begin-intention/` → `.claude/skills/project-begin/`
- Archivos de documentación que referencian el nombre del skill
- Spec `openspec/specs/project-begin-intention-skill/spec.md`
- Sin cambios en comportamiento ni en lógica del skill
