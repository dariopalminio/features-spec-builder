## Why

El framework SDDF genera `project-plan.md` con releases planificados, pero no existe ningún mecanismo para convertir automáticamente esos releases en archivos de especificación listos para usar. El desarrollador debe crear cada `release-[ID]-[Nombre].md` manualmente, copiando y ajustando el template, lo que introduce inconsistencias y tiempo no productivo.

## What Changes

- Nuevo skill `releases-from-project-plan` en `.claude/skills/releases-from-project-plan/SKILL.md`
- El skill lee la sección "## Propuesta de Releases" de `docs/specs/projects/project-plan.md` y genera un archivo `release-[ID]-[Nombre].md` por cada release encontrado
- Cada archivo generado sigue exactamente la estructura de `docs/specs/templates/release-spec-template.md`, populando las secciones obligatorias (frontmatter, Descripción, Features, Flujos Críticos) con los datos del plan
- Las secciones opcionales del template se incluyen con placeholder cuando no hay datos disponibles
- Los archivos se guardan en `docs/specs/releases/` (creando el directorio si no existe)
- Si `project-plan.md` no existe o no tiene secciones de release, el skill informa el error sin generar archivos

## Capabilities

### New Capabilities

- `releases-from-project-plan`: Skill que extrae releases de `project-plan.md` y genera especificaciones de release estructuradas en formato `release-spec-template.md`

### Modified Capabilities

<!-- No hay cambios en requisitos de capabilities existentes -->

## Impact

- **Nuevo archivo:** `.claude/skills/releases-from-project-plan/SKILL.md`
- **Directorio de salida:** `docs/specs/releases/` (creado por el skill en runtime)
- **Dependencias de lectura:** `docs/specs/projects/project-plan.md`, `docs/specs/templates/release-spec-template.md`
- **Sin dependencias de código ejecutable:** el skill opera exclusivamente con instrucciones Markdown y el LLM
