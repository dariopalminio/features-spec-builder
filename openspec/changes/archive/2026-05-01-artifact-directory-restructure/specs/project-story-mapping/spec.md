## ADDED Requirements

### Requirement: project-story-mapping escribe story-map.md en el directorio del proyecto activo
El skill SHALL localizar el proyecto activo en `{SPECS_BASE}/specs/projects/` y escribir `story-map.md` dentro de ese directorio, no en `{SPECS_BASE}/specs/projects/`.

#### Scenario: Escritura de story-map.md en la nueva ruta
- **WHEN** el skill completa la sesión de story mapping
- **THEN** MUST escribir el archivo en `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/story-map.md`
- **THEN** MUST NOT escribir en `{SPECS_BASE}/specs/projects/story-map.md`

#### Scenario: Lectura de artefactos de proyecto para contexto
- **WHEN** el skill necesita leer `project-intent.md` o `requirement-spec.md` para el mapeo
- **THEN** MUST buscarlos en `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/`
