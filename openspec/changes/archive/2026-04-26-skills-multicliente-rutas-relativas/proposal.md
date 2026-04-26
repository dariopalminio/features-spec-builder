## Why

Skills en SDDF actualmente referencian sus templates con rutas absolutas relativas a la raíz del proyecto (`.claude/skills/<skill>/templates/<template>.md`), lo que ata cada skill al cliente LLM específico que monta los skills bajo `.claude/`. Esto impide distribuir los skills en clientes alternativos (OpenCode, GitHub Copilot, Jira Rovo, Gemini Gem) sin modificar manualmente las rutas en cada SKILL.md.

## What Changes

- **8 SKILL.md actualizados**: reemplazar referencias a templates con rutas absolutas `.claude/skills/<skill>/templates/<template>.md` por rutas relativas al directorio del skill `templates/<template>.md`.
- **Fallback de resolución documentado**: los SKILL.md afectados incluirán instrucción de usar `{{SKILL_ROOT}}/templates/<template>.md` como alternativa explícita cuando el cliente no resuelva rutas relativas implícitas.
- **Spec `skill-template-autonomy` actualizado**: el requirement que exige rutas `.claude/skills/<skill>/templates/` cambia para exigir rutas relativas al directorio del skill.
- No hay **BREAKING** changes para usuarios de Claude Code — las rutas relativas funcionan igual en ese cliente.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `skill-template-autonomy`: El requirement "referencias con ruta local `.claude/skills/<skill>/templates/`" cambia a "referencias con ruta relativa al skill `templates/<template>.md`" para garantizar portabilidad multi-cliente.

## Impact

- **Archivos SKILL.md modificados** (8): `project-begin`, `project-discovery`, `project-planning`, `release-format-validation`, `release-generate-stories`, `reverse-engineering`, `story-creation`, `story-split`.
- **Spec afectado**: `openspec/specs/skill-template-autonomy/spec.md` — 2 requirements y sus scenarios actualizados.
- **Sin cambios** en los archivos de template (solo cambia cómo se los referencia).
- **Sin cambios** en `readme-builder` — ya usa `templates/readme-template.md` correctamente.
