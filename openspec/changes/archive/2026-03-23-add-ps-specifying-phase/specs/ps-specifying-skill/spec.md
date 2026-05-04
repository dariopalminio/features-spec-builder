## ADDED Requirements

### Requirement: Skill ps-specifying orquesta el estado Specifying
El sistema SHALL proveer un skill `ps-specifying` en `.claude/skills/ps-specifying/SKILL.md` que actúa como orquestador del estado Specifying del pipeline de ProjectSpecFactory.

#### Scenario: Archivo discovery.md no existe
- **WHEN** el usuario ejecuta `/ps-specifying` y `$SPECS_BASE/specs/projects/discovery.md` no existe
- **THEN** el skill informa al usuario que debe completar primero la fase Discovery y detiene la ejecución

#### Scenario: Template no existe
- **WHEN** el usuario ejecuta `/ps-specifying` y `.claude/skills/ps-specifying/templates/project-template.md` no existe
- **THEN** el skill informa al usuario que el template requerido no existe y detiene la ejecución

#### Scenario: Precondiciones satisfechas
- **WHEN** el usuario ejecuta `/ps-specifying`, `discovery.md` existe y el template existe
- **THEN** el skill delega la ejecución al `specifying-agent` con instrucciones para leer `discovery.md` y el template, conducir la entrevista y escribir `$SPECS_BASE/specs/projects/project.md`

#### Scenario: Output generado exitosamente
- **WHEN** el `specifying-agent` finaliza su ejecución
- **THEN** el skill verifica que `$SPECS_BASE/specs/projects/project.md` existe y confirma al usuario con el mensaje de éxito y el siguiente paso (`/ps-approve`)

#### Scenario: Output no generado
- **WHEN** el `specifying-agent` finaliza pero `$SPECS_BASE/specs/projects/project.md` no existe
- **THEN** el skill informa al usuario que algo salió mal y sugiere ejecutar `/ps-specifying` nuevamente
