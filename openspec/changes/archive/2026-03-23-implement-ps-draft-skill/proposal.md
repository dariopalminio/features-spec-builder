## Why

El estado **Draft** del pipeline carece de implementación autónoma: el skill `/ps-draft` actual es un stub de 5 líneas que no valida el estado del input, no conduce una entrevista guiada ni usa un template autónomo dentro del propio skill. Sin esta implementación, el pipeline no puede avanzar de forma asistida desde `initial-prompt.md` hacia `project-intent.md`.

## Non-goals

- No modifica estados anteriores (Funnel) ni posteriores (Discovery)
- No implementa WIP=1 enforcement
- No integra con herramientas externas

## What Changes

- Nuevo skill `/ps-draft` reescrito en `.claude/skills/ps-draft/SKILL.md` con orquestación completa: validación de estado, delegación al agente, confirmación de output
- Nuevo template autónomo `.claude/skills/ps-draft/templates/project-intent-template.md` (adaptado de `docs/templates/project-intent-template.md`)
- Nuevo agente `draft-agent` (`.claude/agents/draft-agent.md`) especializado en la fase Draft: lee `initial-prompt.md`, valida su estado, conduce entrevista por secciones del template y produce `$SPECS_BASE/specs/project-intent.md`
- El agente verifica que `initial-prompt.md` tenga `**substatus**: DONE`; si está `IN‑PROGRESS`, pregunta al usuario si confirma avanzar y actualiza el campo antes de continuar

## Capabilities

### New Capabilities

- `ps-draft-skill`: Skill SKILL.md que orquesta el estado Draft: verifica existencia del template y de `initial-prompt.md`, invoca al `draft-agent`, confirma la generación de `project-intent.md`
- `draft-agent`: Agente PM especializado en Draft; valida el estado de `initial-prompt.md`, hace preguntas al usuario por secciones del template `project-intent-template.md`, infiere contenido faltante y escribe `$SPECS_BASE/specs/project-intent.md`
- `project-intent-template`: Template `.claude/skills/ps-draft/templates/project-intent-template.md` con secciones guiadas por comentarios HTML para la fase Draft

### Modified Capabilities

<!-- Sin cambios a specs existentes -->

## Impact

- `.claude/skills/ps-draft/SKILL.md` — reescrito completamente
- Nuevo: `.claude/agents/draft-agent.md`
- Nuevo: `.claude/skills/ps-draft/templates/project-intent-template.md`
- Nuevo archivo generado (output): `$SPECS_BASE/specs/project-intent.md`
- Lee como input: `$SPECS_BASE/specs/initial-prompt.md` (producido por Funnel)
