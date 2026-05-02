## 1. Scaffolding del skill

- [x] 1.1 Crear el directorio `.claude/skills/project-context-diagram/`
- [x] 1.2 Crear el directorio `.claude/skills/project-context-diagram/assets/`
- [x] 1.3 Crear el directorio `.claude/skills/project-context-diagram/examples/`

## 2. Template C4 PlantUML

- [x] 2.1 Crear `.claude/skills/project-context-diagram/assets/c4-context-template.puml` con la estructura base de un diagrama C4 Nivel 1 usando `!include C4Context.puml` y placeholders para `Person()`, `System()`, `System_Ext()` y `Rel()`

## 3. Implementación de SKILL.md

- [x] 3.1 Redactar el frontmatter de `SKILL.md` (name, description, triggers)
- [x] 3.2 Implementar la lógica de resolución de `SPECS_BASE` (3 escenarios: SDDF_ROOT existe / no definida / ruta inexistente)
- [x] 3.3 Implementar la lectura y validación del template `assets/c4-context-template.puml`
- [x] 3.4 Implementar el Paso 0: detección del modo de operación (`--interactive` default, `--from-files`, ruta de archivo explícita)
- [x] 3.5 Implementar el modo `--interactive`: flujo de preguntas guiadas (nombre del sistema, descripción, actores, sistemas externos, relaciones)
- [x] 3.6 Implementar el modo `--from-files`: lógica de escaneo e inferencia de actores/sistemas desde `README.md`, `$SPECS_BASE/specs/`, `openspec/` y código fuente
- [x] 3.7 Implementar el preview del diagrama generado con solicitud de confirmación antes de escribir (ambos modos)
- [x] 3.8 Implementar el fallback a modo interactivo cuando el documento indicado no existe, con listado de proyectos disponibles
- [x] 3.9 Implementar la escritura del archivo de salida en `$SPECS_BASE/specs/projects/<PROJ-slug>/context-diagram.puml`
- [x] 3.10 Implementar la lógica de sobreescritura: preguntar al usuario si `context-diagram.puml` ya existe

## 4. Casos de prueba (examples)

- [x] 4.1 Crear `examples/test-01-modo-interactivo.md`: flujo completo en modo `--interactive` con sistema, 2 actores y 2 sistemas externos
- [x] 4.2 Crear `examples/test-02-desde-specs.md`: flujo en modo `--from-files` indicando la ruta a un `project.md` existente
- [x] 4.3 Crear `examples/test-03-archivo-no-encontrado.md`: flujo de error cuando el documento indicado no existe, con fallback a modo interactivo

## 5. Registro del skill

- [x] 5.1 Añadir la entrada `"project-context-diagram"` en `skills-lock.json` con `source: "local"`, `sourceType: "local"` y `file: ".claude/skills/project-context-diagram/SKILL.md"`
