## Context

El skill `ps-planning` es el tercer y último paso del pipeline ProjectSpecFactory. Su directorio vive en `.claude/skills/ps-planning/` y su comando es `/ps-planning`. Se aplica el mismo patrón de renombre ya ejecutado en los dos skills anteriores. Es un refactor puro sin cambios de comportamiento.

## Goals / Non-Goals

**Goals:**
- Renombrar el directorio del skill de `ps-planning` a `project-planning`
- Actualizar todas las referencias textuales en los 11 archivos activos afectados
- Mantener consistencia del comando con el nombre del directorio (`/project-planning`)

**Non-Goals:**
- Cambiar la lógica o comportamiento del skill
- Modificar los templates internos del skill
- Renombrar archivos en `openspec/changes/archive/` (historia congelada)

## Decisions

**Approach: `git mv` + reemplazo global de cadenas**
- Usar `git mv` para renombrar el directorio y preservar historial git
- Reemplazar globalmente `ps-planning` → `project-planning` en todos los archivos activos
- Renombrar también el directorio `openspec/specs/ps-planning-skill/` → `openspec/specs/project-planning-skill/`

## Risks / Trade-offs

- [Risk] Usuarios o scripts que referencien `/ps-planning` quedarán rotos → Mitigación: actualizar todas las referencias en el mismo commit
- [Risk] Los archivos del archive contienen el nombre antiguo → Mitigación: no modificar archivos bajo `openspec/changes/archive/` (son historia congelada)
