## ADDED Requirements

### Requirement: Resolución dinámica de ruta raíz en release-generate-all-stories
El skill `release-generate-all-stories` SHALL resolver la ruta base de artefactos mediante `SDDF_ROOT` antes de iterar sobre todos los releases y generar historias.

#### Scenario: Skill genera historias para todos los releases bajo SDDF_ROOT
- **WHEN** el usuario ejecuta `/release-generate-all-stories` con `SDDF_ROOT` definida
- **THEN** el skill itera sobre releases en `$SPECS_BASE/specs/releases/`
- **THEN** el skill escribe todas las historias generadas bajo `$SPECS_BASE/specs/stories/`

#### Scenario: Skill usa docs por defecto sin SDDF_ROOT
- **WHEN** el usuario ejecuta `/release-generate-all-stories` sin `SDDF_ROOT` definida
- **THEN** el skill opera sobre `$SPECS_BASE/specs/` (comportamiento previo)
