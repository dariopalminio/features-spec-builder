## Why

El nombre `story-finvest-evaluation` expone detalles de implementación (la rúbrica FINVEST) en el nombre del skill, haciéndolo más largo y específico de lo necesario. Renombrarlo a `story-evaluation` lo alinea con el patrón corto y descriptivo del resto de skills (`story-creation`, `story-split`) y mejora la usabilidad del comando.

## What Changes

- Renombrar el directorio `.claude/skills/story-finvest-evaluation/` a `.claude/skills/story-evaluation/`
- Renombrar el directorio `.github/skills/story-finvest-evaluation/` a `.github/skills/story-evaluation/`
- Renombrar el directorio `.agents/skills/story-finvest-evaluation/` a `.agents/skills/story-evaluation/`
- Actualizar el campo `name` en cada `SKILL.md` afectado
- Actualizar referencias al nombre antiguo en skills, agentes Rovo y README

## Capabilities

### New Capabilities
<!-- Ninguna: es un rename puro sin cambio de comportamiento -->

### Modified Capabilities
<!-- Ninguna: no hay spec de nivel requisitos para este skill -->

## Impact

- Directorios: `.claude/skills/story-finvest-evaluation/` → `.claude/skills/story-evaluation/` (y equivalentes en `.github/skills/` y `.agents/skills/`)
- Archivos internos de cada SKILL.md (campo `name`)
- `README.md`
- `rovo/story-creator-agent.md`, `rovo/story-splitter-agent.md`
- `.claude/skills/story-split/SKILL.md`, `.claude/skills/story-creation/SKILL.md` (si referencian el nombre)
- Sin cambios en lógica ni comportamiento del skill
