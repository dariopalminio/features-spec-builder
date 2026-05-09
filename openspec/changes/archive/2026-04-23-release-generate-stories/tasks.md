## 1. Preparación del skill

- [x] 1.1 Crear el directorio `.claude/skills/release-generate-stories/`
- [x] 1.2 Verificar que existe `$SPECS_BASE/specs/templates/story-template.md` y revisar su estructura actual
- [x] 1.3 Revisar el skill hermano `releases-from-project-plan/SKILL.md` para alinear estructura y estilo del nuevo SKILL.md

## 2. Implementación del SKILL.md

- [x] 2.1 Crear `.claude/skills/release-generate-stories/SKILL.md` con la sección de trigger y descripción del skill
- [x] 2.2 Documentar en SKILL.md el Paso 0: resolución de input (nombre corto / ruta relativa / múltiples coincidencias), siguiendo el patrón `release-input-resolution`
- [x] 2.3 Documentar en SKILL.md el Paso 1: lectura del archivo de release y extracción de features desde la sección `## Features`
- [x] 2.4 Documentar en SKILL.md el Paso 2: generación de cada historia siguiendo `story-template.md`, inferiendo Como/Quiero/Para y escenarios Gherkin desde el nombre/descripción de la feature
- [x] 2.5 Documentar en SKILL.md el Paso 3: nombrado de archivos con el patrón `story-[ID]-[nombre-kebab].md` y guardado en `$SPECS_BASE/specs/stories/`
- [x] 2.6 Documentar en SKILL.md el Paso 4: control de idempotencia — si el archivo ya existe, informar al usuario y solicitar confirmación antes de sobreescribir
- [x] 2.7 Documentar en SKILL.md el Paso 5: resumen final con lista de archivos creados/omitidos y sugerencia de ejecutar `/story-evaluation`

## 3. Manejo de errores

- [x] 3.1 Documentar en SKILL.md el mensaje de error para archivo de release no encontrado: "No se encontró el archivo de release: <nombre>"
- [x] 3.2 Documentar en SKILL.md el mensaje de error para release sin features: "No se encontraron features en el archivo de release indicado"
- [x] 3.3 Verificar que el SKILL.md instruye a no generar archivos parciales cuando ocurre un error de entrada

## 4. Verificación funcional

- [x] 4.1 Ejecutar el skill con `release-06-release-and-story-generator.md` y verificar que genera un archivo por cada feature de la sección `## Features`
- [x] 4.2 Verificar que los archivos generados siguen la estructura de `story-template.md` con frontmatter, Como/Quiero/Para y al menos dos escenarios Gherkin
- [x] 4.3 Verificar que el skill acepta ruta relativa completa como input con el mismo resultado
- [x] 4.4 Verificar que el skill muestra error correcto para archivo inexistente
- [x] 4.5 Verificar que el skill solicita confirmación antes de sobreescribir una historia existente

## 5. Integración con el release activo

- [x] 5.1 Marcar FEAT-029 como completado (`[x]`) en `$SPECS_BASE/specs/releases/release-06-release-and-story-generator.md`
