## Why

Los skills SDDF asumen que la estructura de directorios base (`docs/specs/projects/`, `docs/specs/releases/`, `docs/specs/stories/`) y `openspec/config.yaml` ya existen, pero no hay ningún mecanismo que los cree. Esto obliga al desarrollador a crearlos manualmente al onboardear un proyecto nuevo, generando errores silenciosos en `skill-preflight` y en cualquier skill SDDF que los requiera.

## What Changes

- **Nueva skill `sddf-init`**: crea la estructura de directorios SDDF y archivos de configuración base en un proyecto nuevo.
- Genera `docs/specs/projects/`, `docs/specs/releases/`, `docs/specs/stories/` (o bajo `SDDF_ROOT` personalizado).
- Genera `openspec/config.yaml` desde el template existente (solo si no existe).
- Genera `.env.template` documentando la variable `SDDF_ROOT`.
- Garantiza idempotencia: no sobrescribe directorios ni archivos con contenido existente.
- Valida que `SDDF_ROOT`, si está definida, apunta a un directorio existente antes de operar.

## Capabilities

### New Capabilities

- `sddf-init`: Skill de inicialización del entorno SDDF — crea estructura de directorios base, `openspec/config.yaml` y `.env.template`, con soporte para `SDDF_ROOT` personalizado e idempotencia total.

### Modified Capabilities

- `skill-preflight`: El flujo de onboarding ahora establece explícitamente que `sddf-init` es el predecesor de `skill-preflight`. No cambia el comportamiento del preflight, pero su documentación y contexto deben reflejar el flujo `sddf-init → skill-preflight → [skill]`.

## Impact

- Nuevo archivo `.claude/skills/sddf-init/SKILL.md`.
- El flujo de onboarding documentado en `skill-preflight` y en guías del wiki se actualiza para incluir `sddf-init` como paso previo.
- No hay cambios a APIs externas ni dependencias de paquetes.
- Compatible con todos los entornos (Claude Code, OpenCode, Rovo) ya que es un skill puro en Markdown.
