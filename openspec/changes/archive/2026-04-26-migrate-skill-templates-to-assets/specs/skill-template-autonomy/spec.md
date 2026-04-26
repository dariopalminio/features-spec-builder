## MODIFIED Requirements

### Requirement: Cada skill contiene sus propios templates
Cada skill en `.claude/skills/` que requiera un template para operar SHALL tener ese template en su propio directorio `.claude/skills/<skill>/assets/`. No SHALL depender de templates en `docs/specs/templates/` para funcionar.

#### Scenario: Skill usa template local
- **WHEN** un skill necesita un template para generar su output
- **THEN** el template existe en `.claude/skills/<skill>/assets/<template>.md`

#### Scenario: Skill no referencia directorio compartido
- **WHEN** se lee el archivo `SKILL.md` de cualquier skill activo
- **THEN** no contiene referencias a rutas bajo `docs/specs/templates/`

### Requirement: Templates duplicados por skill cuando son compartidos
Cuando un mismo template es necesario en múltiples skills, cada skill SHALL tener su propia copia local del template en su directorio `assets/`.

#### Scenario: Mismo template usado por dos skills distintos
- **WHEN** dos skills (`story-creation` y `story-evaluation`) requieren el mismo template `story-gherkin-template.md`
- **THEN** cada uno tiene una copia en `.claude/skills/story-creation/assets/story-gherkin-template.md` y `.claude/skills/story-evaluation/assets/story-gherkin-template.md` respectivamente

### Requirement: Referencias actualizadas en SKILL.md y agentes
Todos los archivos `SKILL.md` SHALL referenciar templates usando rutas relativas al directorio del skill (`assets/<template>.md`) en lugar de rutas absolutas con prefijo de cliente (`.claude/skills/<skill>/assets/<template>.md`). Como alternativa para clientes que requieren rutas absolutas explícitas, se acepta el formato con variable de entorno `{{SKILL_ROOT}}/assets/<template>.md`. Ningún SKILL.md SHALL hardcodear un prefijo de cliente (`.claude/`, `.github/`, `.opencode/`, etc.) en rutas a sus templates, ya que eso ata el skill a una plataforma específica.

#### Scenario: SKILL.md referencia template con ruta relativa al skill
- **WHEN** un SKILL.md menciona un template
- **THEN** la ruta es `assets/<nombre>.md` (relativa al directorio del skill activo)

#### Scenario: SKILL.md no hardcodea prefijo de cliente en ruta de template
- **WHEN** se busca el patrón `.claude/skills/<cualquier-skill>/assets/` en un SKILL.md
- **THEN** no hay coincidencias — ninguna referencia a template usa rutas absolutas con prefijo de cliente

#### Scenario: Ningún agente referencia el directorio compartido antiguo
- **WHEN** se hace búsqueda de `docs/specs/templates/` en `.claude/agents/`
- **THEN** no hay resultados en archivos activos
