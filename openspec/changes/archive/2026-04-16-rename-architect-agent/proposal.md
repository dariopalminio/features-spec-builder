## Why

El agente `architect` usa un nombre genérico sin prefijo que es inconsistente con la convención adoptada. Renombrarlo a `project-architect` lo alinea con el prefijo `project-` ya aplicado a los tres skills del pipeline, completando la uniformidad del sistema de nombres.

## What Changes

- Renombrar archivo `.claude/agents/architect.agent.md` → `.claude/agents/project-architect.agent.md`
- Actualizar el campo `name: architect` → `name: project-architect` en el frontmatter
- Actualizar todas las referencias al agente por nombre en skills, otros agentes y specs

## Capabilities

### New Capabilities
<!-- Ninguna — refactor puro de renombre -->

### Modified Capabilities
- `role-based-agents`: Renombrar agente `architect` a `project-architect` — nombre de archivo y campo `name` cambian, junto con todas las invocaciones.

## Impact

Archivos activos afectados:
- `.claude/agents/architect.agent.md` (renombrado + frontmatter)
- `.claude/skills/project-planning/SKILL.md` (invoca `architect`)
- `.claude/skills/project-discovery/SKILL.md` (invoca `architect`)
- `.claude/agents/ux-designer.agent.md` (referencia `architect`)
- `.claude/agents/product-manager.agent.md` (posible referencia)
- `openspec/specs/role-based-agents/spec.md`
- `openspec/specs/project-planning-skill/spec.md`
- `openspec/specs/project-discovery-skill/spec.md`
- `openspec/specs/ps-project-spec-skill/spec.md`
- `docs/specs/project-spec-factory/requirement-spec.md`
- `docs/specs/project-spec-factory/project-plan.md`
- `README.md`
- `gem/prompts/prompt-ps-planning`

**No modificar:** menciones genéricas del rol "Software Architect" o "Arquitecto de Software" en descripciones — solo las invocaciones del agente por nombre.
