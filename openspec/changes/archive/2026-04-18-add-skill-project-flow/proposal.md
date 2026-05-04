## Why

Actualmente el usuario debe ejecutar tres comandos separados (`/project-begin`, `/project-discovery`, `/project-planning`) y gestionar manualmente el estado de cada documento. Un skill orquestador `/project-flow` elimina esa fricción: conduce al usuario por el pipeline completo en una sola sesión continua, verificando que cada etapa quede en `Estado: Ready` antes de avanzar a la siguiente.

## What Changes

- **Nuevo skill** `.claude/skills/project-flow/SKILL.md`: orquestador que ejecuta las tres fases en secuencia manteniendo interactividad
- Cada fase invoca al skill correspondiente como subagente (o replica su lógica de delegación)
- Después de cada fase, el orquestador verifica el documento de output, presenta un resumen al usuario y solicita confirmación para marcarlo como `DONE` antes de continuar
- El flujo completo termina cuando los tres documentos tienen `Estado: Ready`

## Capabilities

### New Capabilities
- `project-flow-skill`: Skill orquestador que ejecuta `project-begin → project-discovery → project-planning` en secuencia con gates de revisión entre fases

### Modified Capabilities
<!-- Ninguna: los skills existentes no cambian -->

## Impact

- Nuevo directorio: `.claude/skills/project-flow/`
- No modifica los skills existentes (`project-begin`, `project-discovery`, `project-planning`)
- No modifica los agentes ni los templates
- Comportamiento compatible: el usuario puede seguir usando los tres skills por separado
