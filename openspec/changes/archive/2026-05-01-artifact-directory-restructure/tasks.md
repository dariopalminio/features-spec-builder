## 1. Documentación de la convención

- [x] 1.1 Verificar que `docs/wiki/guides/organization-of-artifacts.md` está completo y actualizado con la nueva estructura de directorios
- [x] 1.2 Actualizar `README.md` con una sección que explique la nueva estructura `projects/`, `releases/`, `stories/` y los nombres canónicos de archivo
- [x] 1.3 Añadir guía de migración en `docs/wiki/guides/` explicando cómo mover artefactos existentes a la nueva estructura

## 2. Templates

- [x] 2.1 Actualizar el template de proyecto (o crear `project.md` canónico) con el frontmatter obligatorio: `type`, `id`, `title`, `status`, `parent: null`, `created`, `updated`
- [x] 2.2 Actualizar el template de release (`release-spec-template.md`) con frontmatter canónico: `type: release`, `id`, `parent`, `created`, `updated`
- [x] 2.3 Actualizar el template de historia (`story-gherkin-template.md`) con frontmatter canónico: `type: story`, `id`, `parent`, `created`, `updated`

## 3. Skill: project-begin

- [x] 3.1 Añadir paso de resolución de ID de proyecto durante la entrevista (derivar `PROJ-NN` del título y confirmar con el usuario)
- [x] 3.2 Actualizar la lógica de creación del directorio: `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/`
- [x] 3.3 Cambiar la ruta de escritura de `project-intent.md` a `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/project-intent.md`
- [x] 3.4 Actualizar la búsqueda de WIP conflict para escanear `{SPECS_BASE}/specs/projects/*/project.md` con `status: IN_PROGRESS`

## 4. Skill: project-discovery

- [x] 4.1 Añadir lógica de resolución del proyecto activo: buscar en `{SPECS_BASE}/specs/projects/` el directorio con `project.md` en `status: IN_PROGRESS`
- [x] 4.2 Actualizar lectura de `project-intent.md` desde el directorio del proyecto activo
- [x] 4.3 Actualizar escritura de `requirement-spec.md` al directorio del proyecto activo

## 5. Skill: project-planning

- [x] 5.1 Añadir lógica de resolución del proyecto activo (igual que project-discovery)
- [x] 5.2 Actualizar lectura de `requirement-spec.md` desde el directorio del proyecto activo
- [x] 5.3 Actualizar escritura de `project-plan.md` al directorio del proyecto activo

## 6. Skill: project-story-mapping

- [x] 6.1 Actualizar lectura de artefactos de proyecto (`project-intent.md`, `requirement-spec.md`) desde el directorio activo
- [x] 6.2 Actualizar escritura de `story-map.md` al directorio del proyecto activo

## 7. Skill: releases-from-project-plan

- [x] 7.1 Actualizar lectura de `project-plan.md` desde `{SPECS_BASE}/specs/projects/<PROJ-ID>/project-plan.md`
- [x] 7.2 Cambiar patrón de nomenclatura de salida: de `release-NN-nombre.md` a directorio `EPIC-NN-nombre/release.md`
- [x] 7.3 Actualizar la lógica de creación de directorios bajo `{SPECS_BASE}/specs/releases/`
- [x] 7.4 Actualizar la verificación de existencia previa (de archivo a directorio)

## 8. Skill: release-generate-stories

- [x] 8.1 Actualizar resolución de input para buscar directorios en `{SPECS_BASE}/specs/releases/` en lugar de archivos planos
- [x] 8.2 Leer `release.md` desde el directorio del release (no archivo plano)
- [x] 8.3 Cambiar patrón de salida: de `story-FEAT-XXX-nombre.md` a directorio `FEAT-XXX-nombre/story.md`
- [x] 8.4 Actualizar el frontmatter generado para incluir `id`, `type: story`, `parent` y `created`/`updated`

## 9. Skill: release-generate-all-stories

- [x] 9.1 Actualizar iteración para recorrer directorios en `{SPECS_BASE}/specs/releases/` (no archivos planos)
- [x] 9.2 Leer `release.md` de cada directorio de release
- [x] 9.3 Aplicar el mismo patrón de salida que `release-generate-stories` (directorio por historia)

## 10. Skill: reverse-engineering

- [x] 10.1 Actualizar lógica de creación de directorio de proyecto: derivar ID desde nombre del repositorio si no existe proyecto activo
- [x] 10.2 Cambiar ruta de escritura de `requirement-spec.md` y artefactos intermedios al directorio del proyecto

## 11. Skill: header-aggregator

- [x] 11.1 Actualizar patrones de escaneo para cubrir `projects/*/`, `releases/*/` y `stories/*/`
- [x] 11.2 Asegurar que la actualización de frontmatter preserva los campos canónicos: `type`, `id`, `title`, `status`, `parent`, `created`, `updated`

## 12. Validación

- [x] 12.1 Ejecutar `/project-begin` y verificar que crea `docs/specs/projects/PROJ-01-nombre/project-intent.md`
- [x] 12.2 Ejecutar `/releases-from-project-plan` y verificar que crea `docs/specs/releases/EPIC-01-nombre/release.md`
- [x] 12.3 Ejecutar `/release-generate-stories` y verificar que crea `docs/specs/stories/FEAT-001-nombre/story.md`
- [x] 12.4 Verificar que todos los skills leen correctamente los artefactos de la nueva estructura
- [x] 12.5 Verificar que `SDDF_ROOT` sigue funcionando con la nueva estructura de directorios
