## ADDED Requirements

### Requirement: header-aggregator escanea la nueva estructura de directorios por workitem
El skill SHALL buscar archivos Markdown en los patrones `{SPECS_BASE}/specs/projects/*/`, `{SPECS_BASE}/specs/releases/*/` y `{SPECS_BASE}/specs/stories/*/`, cubriendo archivos principales (`project.md`, `release.md`, `story.md`) y artefactos secundarios dentro de cada directorio de workitem.

#### Scenario: Escaneo de archivos en estructura nueva
- **WHEN** el skill ejecuta la agregación de frontmatter
- **THEN** MUST encontrar archivos bajo `{SPECS_BASE}/specs/projects/<ID>/`, `{SPECS_BASE}/specs/releases/<ID>/` y `{SPECS_BASE}/specs/stories/<ID>/`
- **THEN** MUST NOT limitar el escaneo únicamente a `{SPECS_BASE}/specs/project/` (ruta anterior singular)

#### Scenario: Actualización de frontmatter en archivos principales
- **WHEN** el skill actualiza el frontmatter de un `story.md`
- **THEN** MUST preservar los campos obligatorios de la convención: `type`, `id`, `title`, `status`, `parent`, `created`, `updated`
