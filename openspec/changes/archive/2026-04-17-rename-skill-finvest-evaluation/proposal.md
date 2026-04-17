## Why

El skill `finvest-evaluation` se llama igual que la rúbrica FINVEST que aplica, lo cual no deja claro que opera exclusivamente sobre **historias de usuario**. Renombrarlo a `story-finvest-evaluation` alinea su nombre con el prefijo `story-` que ya usan los skills hermanos (`story-creation`, `story-split`), haciendo el catálogo de skills más consistente y autodocumentado.

## What Changes

- Renombrar el directorio `.claude/skills/finvest-evaluation/` → `.claude/skills/story-finvest-evaluation/`
- Actualizar todas las referencias al nombre del skill en archivos de configuración, SKILL.md y documentación del proyecto
- Sincronizar el cambio en las copias espejo: `.agents/skills/`, `.github/skills/`, `rovo/`

## Capabilities

### New Capabilities
<!-- Ninguna: es un refactor de nomenclatura, sin nuevas capacidades -->

### Modified Capabilities
<!-- Ninguna: los requisitos del skill no cambian, solo su nombre/ubicación -->

## Impact

- `.claude/skills/finvest-evaluation/SKILL.md` → `.claude/skills/story-finvest-evaluation/SKILL.md`
- `.agents/skills/finvest-evaluation/` (espejo)
- `.github/skills/finvest-evaluation/` (espejo)
- `rovo/` — cualquier referencia al nombre del skill
- `CLAUDE.md` — si menciona el skill por nombre
- Cualquier otro archivo que referencie `finvest-evaluation` como nombre de skill
