## ADDED Requirements

### Requirement: reverse-engineering escribe artefactos en el directorio del proyecto activo
El skill SHALL escribir los artefactos generados (`requirement-spec.md` y artefactos intermedios) en `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/` en lugar de `{SPECS_BASE}/specs/project/`. Si no existe un proyecto activo, el skill SHALL crear el directorio con el ID y nombre derivados del repositorio analizado.

#### Scenario: Artefactos escritos en directorio de proyecto
- **WHEN** el skill completa el análisis del código fuente
- **THEN** MUST escribir `requirement-spec.md` en `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/project.md`
- **THEN** MUST NOT escribir en `{SPECS_BASE}/specs/project/`

#### Scenario: Directorio de proyecto inexistente
- **WHEN** no existe ningún directorio en `{SPECS_BASE}/specs/projects/` al ejecutar el skill
- **THEN** el skill deriva el ID (`PROJ-01`) y nombre desde el nombre del repositorio
- **THEN** crea el directorio `{SPECS_BASE}/specs/projects/PROJ-01-<repo-name>/` antes de escribir los artefactos
