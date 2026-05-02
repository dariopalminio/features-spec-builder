## ADDED Requirements

### Requirement: Skill invocation command
The skill SHALL be invocable via the command `/reverse-engineering` (with optional flags `--focus <path>`, `--update`, `--verbose`).

#### Scenario: User invokes skill
- **WHEN** the user runs `/reverse-engineering`
- **THEN** the system SHALL execute the reverse engineering workflow (phases 0–3 as defined in SKILL.md)

#### Scenario: User invokes old command
- **WHEN** the user runs `/requirement-from-code`
- **THEN** the system SHALL NOT find the skill (no alias provided)

### Requirement: Resolución dinámica de ruta raíz en reverse-engineering
El skill `reverse-engineering` SHALL resolver la ruta base de artefactos mediante `SDDF_ROOT` antes de escribir el `requirement-spec.md` resultante del análisis del código fuente.

#### Scenario: Skill escribe requirement-spec.md bajo SDDF_ROOT
- **WHEN** el usuario ejecuta `/reverse-engineering` con `SDDF_ROOT` definida
- **THEN** el skill escribe los artefactos generados bajo `$SPECS_BASE/specs/projects/`

#### Scenario: Skill usa docs por defecto sin SDDF_ROOT
- **WHEN** el usuario ejecuta `/reverse-engineering` sin `SDDF_ROOT` definida
- **THEN** el skill escribe bajo `docs/specs/projects/` (comportamiento previo)

## ADDED Requirements

### Requirement: reverse-engineering escribe artefactos en el directorio del proyecto activo
El skill SHALL escribir los artefactos generados (`requirement-spec.md` y artefactos intermedios) en `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/` en lugar de `{SPECS_BASE}/specs/project/`. Si no existe un proyecto activo, el skill SHALL crear el directorio con el ID y nombre derivados del repositorio analizado.

#### Scenario: Artefactos escritos en directorio de proyecto
- **WHEN** el skill completa el análisis del código fuente
- **THEN** MUST escribir `requirement-spec.md` en `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/requirement-spec.md`
- **THEN** MUST NOT escribir en `{SPECS_BASE}/specs/project/`

#### Scenario: Directorio de proyecto inexistente
- **WHEN** no existe ningún directorio en `{SPECS_BASE}/specs/projects/` al ejecutar el skill
- **THEN** el skill deriva el ID (`PROJ-01`) y nombre desde el nombre del repositorio
- **THEN** crea el directorio `{SPECS_BASE}/specs/projects/PROJ-01-<repo-name>/` antes de escribir los artefactos
