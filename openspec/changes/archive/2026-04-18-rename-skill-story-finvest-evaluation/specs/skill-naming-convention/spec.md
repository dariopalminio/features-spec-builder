## MODIFIED Requirements

### Requirement: Skill finvest-evaluation
**FROM**: `finvest-evaluation`
**TO**: `story-evaluation`

El skill SHALL ser accesible bajo el nombre `story-evaluation` en todas las ubicaciones del repositorio donde los skills son registrados o referenciados.

#### Scenario: El skill responde al nuevo nombre
- **WHEN** el usuario invoca `/story-evaluation` en Claude Code
- **THEN** el sistema ejecuta el skill de evaluación FINVEST sobre la historia de usuario proporcionada

#### Scenario: No existe directorio con el nombre antiguo
- **WHEN** se lista el contenido de `.claude/skills/`
- **THEN** no existe ningún directorio llamado `story-finvest-evaluation` y sí existe uno llamado `story-evaluation`

#### Scenario: Paridad entre copias espejo
- **WHEN** se lista `.agents/skills/`, `.github/skills/` y `rovo/`
- **THEN** todas las copias reflejan el nombre `story-evaluation` sin rastros del nombre `story-finvest-evaluation`
