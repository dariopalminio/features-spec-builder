<!-- Referencias -->
[[FEAT-049-reading-of-sddf-root]]

## ADDED Requirements

### Requirement: Resolución dinámica de ruta raíz en project-planning
El skill `project-planning` SHALL resolver la ruta base de artefactos mediante `SDDF_ROOT` antes de leer `requirement-spec.md` y escribir `project-plan.md`.

#### Scenario: Skill opera sobre artefactos bajo SDDF_ROOT
- **WHEN** el usuario ejecuta `/project-planning` con `SDDF_ROOT` definida
- **THEN** el skill lee y escribe artefactos de proyecto bajo `$SPECS_BASE/specs/projects/`

#### Scenario: Skill usa docs por defecto sin SDDF_ROOT
- **WHEN** el usuario ejecuta `/project-planning` sin `SDDF_ROOT` definida
- **THEN** el skill opera sobre `$SPECS_BASE/specs/projects/` (comportamiento previo)
