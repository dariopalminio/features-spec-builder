## ADDED Requirements

### Requirement: Resolución dinámica de ruta raíz en releases-from-project-plan
El skill `releases-from-project-plan` SHALL resolver la ruta base de artefactos mediante `SDDF_ROOT` antes de leer el plan de proyecto y escribir los archivos de release.

#### Scenario: Skill genera releases bajo SDDF_ROOT
- **WHEN** el usuario ejecuta `/releases-from-project-plan` con `SDDF_ROOT` definida
- **THEN** el skill lee `project-plan.md` desde `$SPECS_BASE/specs/projects/`
- **THEN** el skill escribe los archivos de release bajo `$SPECS_BASE/specs/releases/`

#### Scenario: Skill usa docs por defecto sin SDDF_ROOT
- **WHEN** el usuario ejecuta `/releases-from-project-plan` sin `SDDF_ROOT` definida
- **THEN** el skill opera sobre `docs/specs/` (comportamiento previo)
