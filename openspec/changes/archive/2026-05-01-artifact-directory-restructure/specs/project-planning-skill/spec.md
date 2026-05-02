## ADDED Requirements

### Requirement: project-planning lee y escribe en el directorio del proyecto activo
El skill `project-planning` SHALL localizar el proyecto activo buscando en `{SPECS_BASE}/specs/projects/` el directorio con `project.md` en `status: IN_PROGRESS`, y usar esa ruta como base para leer `requirement-spec.md` y escribir `project-plan.md`.

#### Scenario: Lectura de requirement-spec.md desde directorio del proyecto
- **WHEN** el skill inicia la fase de planning
- **THEN** MUST leer `requirement-spec.md` desde `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/project.md`
- **THEN** MUST NOT leer desde `{SPECS_BASE}/specs/project/project.md`

#### Scenario: Escritura de project-plan.md en el directorio del proyecto
- **WHEN** el skill completa la generación del plan
- **THEN** MUST escribir `project-plan.md` en `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/project-plan.md`
- **THEN** MUST NOT escribir en `{SPECS_BASE}/specs/project/project-plan.md`
