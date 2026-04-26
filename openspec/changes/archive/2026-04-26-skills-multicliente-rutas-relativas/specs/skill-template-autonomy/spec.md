## MODIFIED Requirements

### Requirement: Referencias actualizadas en SKILL.md y agentes
Todos los archivos `SKILL.md` SHALL referenciar templates usando rutas relativas al directorio del skill (`templates/<template>.md`) en lugar de rutas absolutas con prefijo de cliente (`.claude/skills/<skill>/templates/<template>.md`). Como alternativa para clientes que requieren rutas absolutas explícitas, se acepta el formato con variable de entorno `{{SKILL_ROOT}}/templates/<template>.md`. Ningún SKILL.md SHALL hardcodear un prefijo de cliente (`.claude/`, `.github/`, `.opencode/`, etc.) en rutas a sus templates, ya que eso ata el skill a una plataforma específica.

#### Scenario: SKILL.md referencia template con ruta relativa al skill
- **WHEN** un SKILL.md menciona un template
- **THEN** la ruta es `templates/<nombre>.md` (relativa al directorio del skill activo)

#### Scenario: SKILL.md no hardcodea prefijo de cliente en ruta de template
- **WHEN** se busca el patrón `.claude/skills/<cualquier-skill>/templates/` en un SKILL.md
- **THEN** no hay coincidencias — ninguna referencia a template usa rutas absolutas con prefijo de cliente

#### Scenario: Ningún agente referencia el directorio compartido antiguo
- **WHEN** se hace búsqueda de `docs/specs/templates/` en `.claude/agents/`
- **THEN** no hay resultados en archivos activos
