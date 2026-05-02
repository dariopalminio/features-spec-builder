## ADDED Requirements

### Requirement: release-generate-all-stories genera directorios de historia por feature en todos los releases
El skill SHALL iterar sobre todos los directorios en `{SPECS_BASE}/specs/releases/`, leer el `release.md` de cada uno y generar un directorio `<FEAT-ID>-<nombre-kebab>/story.md` por cada feature encontrada, siguiendo el mismo patrón de nomenclatura que `release-generate-stories`.

#### Scenario: Múltiples releases con features
- **WHEN** existen tres directorios de release en `{SPECS_BASE}/specs/releases/` con features definidas
- **THEN** el skill genera los directorios de historia correspondientes en `{SPECS_BASE}/specs/stories/`
- **THEN** cada `story.md` incluye frontmatter con `type: story`, `id` y `parent` del release correspondiente

#### Scenario: Release sin sección de features
- **WHEN** un directorio de release no contiene un `release.md` válido o no tiene features definidas
- **THEN** el skill omite ese release, registra una advertencia y continúa con los demás
