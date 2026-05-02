## Why

El pipeline de ProjectSpecFactory carece del estado **Specifying**, el cuarto paso entre Discovery y Approval. Sin él, el PM no puede transformar el `discovery.md` en requisitos estructurados (`requirement-spec.md`) que guíen el desarrollo. Se necesita ahora para completar el flujo end-to-end del MVP v1.0.

## What Changes

- **Nuevo template** `project-template.md` en `.claude/skills/ps-specifying/templates/` que define la estructura del documento de especificación de requisitos (funcionales, no-funcionales, usuarios, contexto).
- **Nuevo agente** `specifying-agent.md` (`.claude/agents/`) especializado en entrevistar al usuario sección por sección del template y producir `docs/specs/projects/project.md`.
- **Nuevo skill** `ps-specifying` (`.claude/skills/ps-specifying/SKILL.md`) que orquesta el estado Specifying: valida el `discovery.md`, delega al `specifying-agent` y confirma el output.

## Capabilities

### New Capabilities

- `ps-specifying-skill`: Skill orquestador del estado Specifying que valida precondiciones, delega al agente y confirma el output en `docs/specs/projects/project.md`.
- `specifying-agent`: Agente PM especializado que lee `discovery.md`, extrae headers y comentarios del template en runtime, entrevista al usuario por secciones y produce `requirement-spec.md`.
- `project-template`: Template Markdown con estructura de secciones (descripción general, contexto, usuarios, requisitos funcionales, no funcionales, referencias) que guía la captura de intención del proyecto.

### Modified Capabilities

## Impact

- Nuevo archivo: `.claude/agents/specifying-agent.md`
- Nuevo directorio: `.claude/skills/ps-specifying/` con `SKILL.md` y `templates/project-template.md`
- El template existente en `docs/templates/requirements-spec-template.md` sirve como referencia de estructura pero NO se modifica
- El output del agente se escribe en `docs/specs/projects/project.md`
- No se modifican skills ni agentes existentes
