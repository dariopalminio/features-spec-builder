<!-- Referencias -->
[[FEAT-049-reading-of-sddf-root]]

## ADDED Requirements

### Requirement: Resolución dinámica de ruta raíz en project-begin
El skill `project-begin` SHALL resolver la ruta base de artefactos mediante `SDDF_ROOT` antes de cualquier operación de lectura o escritura de archivos.

#### Scenario: Skill usa SDDF_ROOT para crear project-intent.md
- **WHEN** el usuario ejecuta `/project-begin` con `SDDF_ROOT` definida
- **THEN** el archivo `project-intent.md` se crea bajo `$SPECS_BASE/specs/projects/` donde `SPECS_BASE` es el valor de `SDDF_ROOT`

#### Scenario: Skill usa docs por defecto sin SDDF_ROOT
- **WHEN** el usuario ejecuta `/project-begin` sin `SDDF_ROOT` definida
- **THEN** el archivo `project-intent.md` se crea bajo `$SPECS_BASE/specs/projects/` (comportamiento previo)
