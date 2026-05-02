## ADDED Requirements

### Requirement: Resolución dinámica de ruta raíz en project-discovery
El skill `project-discovery` SHALL resolver la ruta base de artefactos mediante `SDDF_ROOT` antes de leer `project-intent.md` y escribir `requirement-spec.md`.

#### Scenario: Skill lee y escribe artefactos bajo SDDF_ROOT
- **WHEN** el usuario ejecuta `/project-discovery` con `SDDF_ROOT` definida
- **THEN** el skill lee `project-intent.md` desde `$SPECS_BASE/specs/projects/`
- **THEN** el skill escribe `requirement-spec.md` bajo `$SPECS_BASE/specs/projects/`

#### Scenario: Skill usa docs por defecto sin SDDF_ROOT
- **WHEN** el usuario ejecuta `/project-discovery` sin `SDDF_ROOT` definida
- **THEN** el skill opera sobre `docs/specs/projects/` (comportamiento previo)
