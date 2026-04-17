## Why

El skill `ps-planning` usa el prefijo `ps-` que es inconsistente con la convención adoptada. Renombrarlo a `project-planning` completa la alineación del pipeline ProjectSpecFactory con el prefijo `project-`, siguiendo el mismo patrón aplicado a `ps-begin-intention` → `project-begin-intention` y `ps-discovery` → `project-discovery`.

## What Changes

- Renombrar directorio `.claude/skills/ps-planning/` → `.claude/skills/project-planning/`
- Renombrar comando `/ps-planning` → `/project-planning`
- Actualizar todas las referencias en los 11 archivos activos afectados

## Capabilities

### New Capabilities
<!-- Ninguna — refactor puro de renombre -->

### Modified Capabilities
- `ps-planning-skill`: Renombrar skill de `ps-planning` a `project-planning` — nombre del comando y path del directorio cambian.

## Impact

- `.claude/skills/ps-planning/` (renombrado)
- `.claude/skills/ps-planning/SKILL.md` (referencias internas actualizadas)
- `.claude/agents/architect.agent.md`
- `.claude/agents/product-manager.agent.md`
- `.claude/skills/project-discovery/SKILL.md`
- `openspec/specs/ps-planning-skill/spec.md` (directorio renombrado)
- `openspec/specs/role-based-agents/spec.md`
- `openspec/specs/transition-feedback/spec.md`
- `docs/specs/project-spec-factory/requirement-spec.md`
- `docs/specs/project-spec-factory/project-plan.md`
- `README.md`
- `gem/README.md`
