## ADDED Requirements

### Requirement: project-discovery resuelve el directorio del proyecto activo
El skill `project-discovery` SHALL localizar el proyecto activo buscando en `{SPECS_BASE}/specs/projects/` el directorio cuyo `project.md` tenga `status: IN_PROGRESS`. Toda lectura y escritura de artefactos del proyecto SHALL usar esa ruta como base.

#### Scenario: Proyecto activo encontrado
- **WHEN** existe exactamente un directorio en `{SPECS_BASE}/specs/projects/` con `project.md` en `status: IN_PROGRESS`
- **THEN** el skill MUST usar ese directorio como base para leer `project-intent.md` y escribir `requirement-spec.md`

#### Scenario: Proyecto activo no encontrado
- **WHEN** no existe ningún directorio en `{SPECS_BASE}/specs/projects/` con `status: IN_PROGRESS`
- **THEN** el skill MUST mostrar "No se encontró un proyecto activo en {SPECS_BASE}/specs/projects/" y detener la ejecución

### Requirement: project-discovery escribe requirement-spec.md en el directorio del proyecto
El artefacto `requirement-spec.md` generado por el skill SHALL guardarse en `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/project.md`, no en `{SPECS_BASE}/specs/projects/` (ruta anterior).

#### Scenario: Escritura de requirement-spec.md en la nueva ruta
- **WHEN** el skill completa el proceso de discovery
- **THEN** MUST escribir el archivo en `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/project.md`
- **THEN** MUST NOT escribir en `{SPECS_BASE}/specs/projects/project.md`
