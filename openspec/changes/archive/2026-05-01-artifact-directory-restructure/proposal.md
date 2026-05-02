## Why

Los artefactos de especificación del framework SDDF (proyectos, releases e historias) se almacenan actualmente como archivos planos en carpetas compartidas (`docs/specs/project/`, `docs/specs/releases/`, `docs/specs/stories/`), lo que impide agrupar todos los artefactos de un mismo workitem en un único lugar, dificulta la navegación y no escala a múltiples proyectos simultáneos. La nueva estructura organiza cada workitem en su propio directorio con un identificador único, siguiendo la convención definida en `docs/wiki/guides/organization-of-artifacts.md`.

## What Changes

- Cada workitem (proyecto, release, historia) pasa a vivir en su propio subdirectorio identificado: `PROJ-xxx/`, `EPIC-xxx/`, `FEAT-xxx/`.
- Los archivos principales se renombran a nombres canónicos por tipo: `project.md`, `release.md`, `story.md`.
- Los artefactos secundarios de un proyecto (`project-intent.md`, `project-plan.md`, `story-map.md`) se mueven al directorio del proyecto.
- Todos los skills que crean o leen artefactos de spec actualizan sus rutas de escritura y búsqueda.
- El frontmatter de cada archivo principal incorpora o actualiza los campos obligatorios definidos en la guía: `type`, `id`, `title`, `status`, `parent`, `created`, `updated`.

**Estructura anterior:**
```
docs/specs/project/requirement-spec.md
docs/specs/project/project-intent.md
docs/specs/releases/release-01-features-spec-builder.md
docs/specs/stories/story-FEAT-001-project-begin.md
```

**Estructura nueva:**
```
docs/specs/projects/PROJ-01-nombre-project/project.md
docs/specs/projects/PROJ-01-nombre-project/project-intent.md
docs/specs/projects/PROJ-01-nombre-project/project-plan.md
docs/specs/projects/PROJ-01-nombre-project/story-map.md
docs/specs/releases/EPIC-01-nombre-release/release.md
docs/specs/stories/FEAT-001-nombre-story/story.md
```

## Capabilities

### New Capabilities

- `artifact-directory-convention`: Convención de organización de artefactos SDDF — cada workitem en su propio directorio bajo `projects/`, `releases/` o `stories/`, con identificador único como nombre de carpeta y archivo principal canónico (`project.md`, `release.md`, `story.md`).

### Modified Capabilities

- `project-begin-intention-skill`: Rutas de escritura de `project-intent.md` pasan a `docs/specs/projects/<PROJ-ID>/project-intent.md`.
- `project-discovery-skill`: Rutas de lectura/escritura de `requirement-spec.md` pasan al directorio del proyecto activo.
- `project-planning-skill`: Rutas de `project-plan.md` pasan a `docs/specs/projects/<PROJ-ID>/project-plan.md`.
- `project-story-mapping`: Ruta de `story-map.md` pasa a `docs/specs/projects/<PROJ-ID>/story-map.md`.
- `releases-from-project-plan`: Salida pasa de `docs/specs/releases/release-<ID>-<nombre>.md` a `docs/specs/releases/<EPIC-ID>-<nombre>/release.md`.
- `release-generate-stories`: Salida pasa de `docs/specs/stories/story-<ID>-<nombre>.md` a `docs/specs/stories/<FEAT-ID>-<nombre>/story.md`.
- `release-generate-all-stories`: Ídem — salida de historias al nuevo directorio por historia.
- `reverse-engineering`: Rutas de salida de artefactos generados se adaptan a la nueva estructura.
- `header-aggregator`: El scanner de frontmatter actualiza sus patrones de búsqueda para cubrir los nuevos paths `projects/*/`, `releases/*/`, `stories/*/`.

## Impact

- **Skills (`.claude/skills/`)**: Actualización de `SKILL.md` en todos los skills afectados para reflejar las nuevas rutas de lectura y escritura.
- **Templates**: Los templates de proyecto, release e historia actualizan su frontmatter para incluir los campos `id`, `type`, `parent`, `created`, `updated`.
- **Retrocompatibilidad**: Cambio disruptivo — los artefactos existentes deberán migrarse manualmente a la nueva estructura o mediante un script de migración (fuera del scope de este cambio).
- **Documentación**: `README.md` y guías de instalación actualizados con la nueva estructura de directorios.
