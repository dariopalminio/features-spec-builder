## Why

El nombre `ps-project-spec` no refleja claramente lo que hace el skill: combinar discovery de usuarios con especificación de requisitos. El nombre `ps-discovery` es más descriptivo, alineado con la terminología del dominio y consistente con el comando `/ps-discovery` que el usuario espera ejecutar.

## What Changes

- **BREAKING** Renombrar directorio `.claude/skills/ps-project-spec/` → `.claude/skills/ps-discovery/`
- Actualizar frontmatter `name:` en el SKILL.md del skill
- Actualizar referencias internas al template dentro del SKILL.md
- Actualizar `CLAUDE.md`: comando listado como `/ps-discovery`, tabla de documentos y estructura
- Actualizar `ps-planning/SKILL.md`: mensaje de error que referencia `/ps-project-spec` → `/ps-discovery`

**Non-goals:**
- No cambiar el contenido ni la lógica del SKILL.md (solo el nombre y las rutas)
- No cambiar el template `project-template.md` (se mueve con el directorio)
- No cambiar los agentes ni los documentos de salida

## Capabilities

### New Capabilities
- `ps-discovery-skill`: Skill renombrado desde `ps-project-spec-skill` — mismo comportamiento, nuevo nombre e invocación vía `/ps-discovery`

### Modified Capabilities
- `ps-project-spec-skill`: La especificación existente queda obsoleta y es reemplazada por `ps-discovery-skill`

## Impact

- `.claude/skills/` — renombrar directorio `ps-project-spec/` → `ps-discovery/`
- `CLAUDE.md` — actualizar nombre del comando y referencias al skill
- `.claude/skills/ps-planning/SKILL.md` — actualizar mensaje de error con nuevo comando
