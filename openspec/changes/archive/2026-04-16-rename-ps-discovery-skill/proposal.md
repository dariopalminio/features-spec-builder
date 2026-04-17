## Why

El skill `ps-discovery` usa el prefijo `ps-` que es inconsistente con la convención de nombres adoptada. Renombrarlo a `project-discovery` lo alinea con el prefijo `project-` más descriptivo, siguiendo el mismo patrón aplicado a `ps-begin-intention` → `project-begin-intention`.

## What Changes

- Renombrar directorio `.claude/skills/ps-discovery/` → `.claude/skills/project-discovery/`
- Renombrar comando `/ps-discovery` → `/project-discovery`
- Actualizar todas las referencias internas en `SKILL.md` y demás archivos que mencionen el nombre antiguo

## Capabilities

### New Capabilities
<!-- Ninguna — refactor puro de renombre -->

### Modified Capabilities
- `ps-discovery-skill`: Renombrar skill de `ps-discovery` a `project-discovery` — nombre del comando y path del directorio cambian.

## Impact

- `.claude/skills/ps-discovery/` (renombrado)
- `.claude/skills/ps-discovery/SKILL.md` (referencias internas actualizadas)
- `.claude/agents/product-manager.agent.md`
- `.claude/agents/architect.agent.md`
- `.claude/agents/ux-designer.agent.md`
- `.claude/skills/project-begin-intention/SKILL.md`
- `.claude/skills/ps-planning/SKILL.md`
- `openspec/specs/ps-discovery-skill/spec.md` (directorio renombrado)
- `openspec/specs/transition-feedback/spec.md`
- `openspec/specs/role-based-agents/spec.md`
- `openspec/specs/ps-project-spec-skill/spec.md`
- `openspec/specs/discovery-template/spec.md`
- `docs/specs/project-spec-factory/requirement-spec.md`
- `docs/specs/project-spec-factory/project-plan.md`
- `README.md`
- `gem/README.md`
- `gem/prompts/prompt-ps-planning`
- `gem/prompts/prompt-ps-begin-intention`
