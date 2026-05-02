## 1. Preparación y referencia

- [x] 1.1 Revisar `docs/specs/templates/release-spec-template.md` para mapear todas las secciones obligatorias y opcionales que el skill debe poblar
- [x] 1.2 Revisar `.claude/skills/release-format-validation/SKILL.md` para reutilizar el patrón de fases (resolver input → leer template → procesar → escribir output)
- [x] 1.3 Revisar `docs/specs/projects/project-plan.md` para confirmar la estructura exacta de los bloques `### Release NN — Nombre` que el skill debe parsear

## 2. Creación del skill

- [x] 2.1 Crear el directorio `.claude/skills/releases-from-project-plan/`
- [x] 2.2 Crear `.claude/skills/releases-from-project-plan/SKILL.md` con el frontmatter (`name`, `description`) y la estructura de fases del skill
- [x] 2.3 Implementar **Fase 0 — Verificar input**: verificar que `docs/specs/projects/project-plan.md` existe; si no, mostrar "No se encontró docs/specs/projects/project-plan.md" y terminar
- [x] 2.4 Implementar **Fase 1 — Extraer releases**: leer `project-plan.md`, localizar la sección `## Propuesta de Releases` y extraer todos los bloques `### Release NN — Nombre` con sus datos (objetivo, features, criterios de éxito); si no hay bloques, mostrar "No se encontraron releases planificados en project-plan.md" y terminar
- [x] 2.5 Implementar **Fase 2 — Preparar directorio de destino**: verificar si `docs/specs/releases/` existe; si no, crearlo
- [x] 2.6 Implementar **Fase 3 — Generar archivos de release**: para cada release extraído, construir el nombre de archivo `release-[ID]-[nombre-kebab].md` (kebab-case, minúsculas, sin caracteres especiales), verificar si ya existe el archivo y pedir confirmación antes de sobreescribir, y escribir el archivo con el template canónico poblado con los datos del release (secciones opcionales con placeholder `[Por completar]` cuando no hay datos)
- [x] 2.7 Implementar **Fase 4 — Resumen**: mostrar la lista de archivos generados con sus rutas y sugerir ejecutar `/release-format-validation` para validar el formato

## 3. Verificación del skill

- [x] 3.1 Verificar que el SKILL.md generado sigue la misma convención de estructura que los skills existentes (frontmatter, secciones de fases numeradas, instrucciones claras)
- [x] 3.2 Verificar que el skill maneja correctamente el caso `project-plan.md` no encontrado
- [x] 3.3 Verificar que el skill maneja correctamente el caso donde no hay releases en el plan
- [x] 3.4 Verificar que los archivos generados pasan la validación de `release-format-validation` (todas las secciones obligatorias presentes)
- [x] 3.5 Verificar que el slug kebab-case del nombre de archivo es correcto para releases con nombres que contienen tildes, espacios y caracteres especiales
