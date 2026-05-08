<!-- Referencias -->
[[FEAT-049-reading-of-sddf-root]]

## ADDED Requirements

### Requirement: Resolución dinámica de ruta raíz en release-generate-stories
El skill `release-generate-stories` SHALL resolver la ruta base de artefactos mediante `SDDF_ROOT` antes de leer el archivo de release y escribir las historias de usuario.

#### Scenario: Skill genera historias bajo SDDF_ROOT
- **WHEN** el usuario ejecuta `/release-generate-stories` con `SDDF_ROOT` definida
- **THEN** el skill lee el release desde `$SPECS_BASE/specs/releases/`
- **THEN** el skill escribe las historias generadas bajo `$SPECS_BASE/specs/stories/`

#### Scenario: Skill usa docs por defecto sin SDDF_ROOT
- **WHEN** el usuario ejecuta `/release-generate-stories` sin `SDDF_ROOT` definida
- **THEN** el skill opera sobre `$SPECS_BASE/specs/releases/` y `$SPECS_BASE/specs/stories/` (comportamiento previo)
