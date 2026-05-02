## MODIFIED Requirements

### Requirement: project-begin produces project-intent.md
El skill `/project-begin` SHALL producir `project-intent.md` dentro del directorio del proyecto activo en `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/`, en una sola sesión interactiva. El skill MUST determinar el ID y nombre del proyecto durante la entrevista para construir la ruta de destino antes de escribir el archivo.

#### Scenario: Single session produces final document
- **WHEN** el usuario completa la entrevista guiada por `/project-begin` y confirma el ID `PROJ-01` con nombre `mi-proyecto`
- **THEN** el sistema MUST crear `{SPECS_BASE}/specs/projects/PROJ-01-mi-proyecto/project-intent.md` usando el template `project-begin/templates/project-intent-template.md`

#### Scenario: No intermediate files created
- **WHEN** `/project-begin` completa su ejecución
- **THEN** el sistema MUST NOT crear archivos intermedios ni escribir en `{SPECS_BASE}/specs/project/` (ruta anterior)

### Requirement: project-begin checks WIP conflict before starting
Al inicio, el skill SHALL verificar si existe un proyecto activo buscando en `{SPECS_BASE}/specs/projects/` algún directorio cuyo `project.md` tenga `status: IN_PROGRESS`, aplicando la lógica de `wip-conflict-detection`.

#### Scenario: No WIP conflict
- **WHEN** ningún directorio en `{SPECS_BASE}/specs/projects/` contiene un `project.md` con `status: IN_PROGRESS`
- **THEN** el skill MUST continuar directamente a verificar precondiciones del template

#### Scenario: WIP conflict detected
- **WHEN** existe al menos un directorio en `{SPECS_BASE}/specs/projects/` con `project.md` en `status: IN_PROGRESS`
- **THEN** el skill MUST notificar y ofrecer las opciones definidas en `wip-conflict-detection`
