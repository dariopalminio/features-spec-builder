## Context

El skill `ps-discovery` es el segundo paso del pipeline ProjectSpecFactory. Su directorio vive en `.claude/skills/ps-discovery/` y su comando es `/ps-discovery`. Se aplica el mismo patrón de renombre ya ejecutado en `ps-begin-intention` → `project-begin-intention`. Es un refactor puro sin cambios de comportamiento.

## Goals / Non-Goals

**Goals:**
- Renombrar el directorio del skill de `ps-discovery` a `project-discovery`
- Actualizar todas las referencias textuales en los 17 archivos afectados
- Mantener consistencia del comando con el nombre del directorio (`/project-discovery`)

**Non-Goals:**
- Cambiar la lógica o comportamiento del skill
- Renombrar otros skills `ps-*` en este change (fuera de scope)
- Modificar los templates internos del skill

## Decisions

**Approach: `git mv` + reemplazo global de cadenas**
- Usar `git mv` para renombrar el directorio y preservar historial git
- Reemplazar globalmente `ps-discovery` → `project-discovery` en todos los archivos afectados
- Renombrar también el directorio `openspec/specs/ps-discovery-skill/` → `openspec/specs/project-discovery-skill/`

## Risks / Trade-offs

- [Risk] Scripts o usuarios que referencien `/ps-discovery` directamente quedarán rotos → Mitigación: actualizar todas las referencias en el mismo commit
- [Risk] Los archivos del archive contienen el nombre antiguo → Mitigación: no modificar archivos bajo `openspec/changes/archive/` (son historia congelada)
