<!-- Referencias -->
[[FEAT-049-reading-of-sddf-root]]

## ADDED Requirements

### Requirement: Resolución dinámica de ruta raíz en reverse-engineering
El skill `reverse-engineering` SHALL resolver la ruta base de artefactos mediante `SDDF_ROOT` antes de escribir el `requirement-spec.md` resultante del análisis del código fuente.

#### Scenario: Skill escribe requirement-spec.md bajo SDDF_ROOT
- **WHEN** el usuario ejecuta `/reverse-engineering` con `SDDF_ROOT` definida
- **THEN** el skill escribe los artefactos generados bajo `$SPECS_BASE/specs/projects/`

#### Scenario: Skill usa docs por defecto sin SDDF_ROOT
- **WHEN** el usuario ejecuta `/reverse-engineering` sin `SDDF_ROOT` definida
- **THEN** el skill escribe bajo `$SPECS_BASE/specs/projects/` (comportamiento previo)
