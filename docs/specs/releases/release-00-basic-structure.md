### Release 00 — Estructura Base y Mecanismo de Templates

**Objetivo:** Establecer la estructura fundacional del framework: convenciones de directorios, configuración de entornos reproducibles y el mecanismo de extracción dinámica de templates que habilita a todos los agentes a generar preguntas contextuales en runtime sin lógica hardcodeada.

- [ ] FEAT-002 - Extracción Dinámica de Templates

**Ítems de soporte (sin FEAT propio):**
- Estructura inicial de directorios `.claude/skills/`, `.claude/agents/`, `docs/specs/`
- Convenciones CLAUDE.md y AGENTS.md del framework
- Configuración de entorno Docker con imagen `debian:bookworm-slim`
- Soporte multi-runtime inicial: Claude Code (`.claude/`), GitHub Copilot (`.github/`), Codex/Cursor (`.agents/`)

**Criterios de éxito:**
- [ ] Modificar un comentario `<!-- -->` o header `##` en un template produce un cambio observable en las preguntas generadas por el agente sin modificar el SKILL.md del agente.
- [ ] El entorno Docker permite reproducir el entorno de desarrollo sin dependencias locales.


