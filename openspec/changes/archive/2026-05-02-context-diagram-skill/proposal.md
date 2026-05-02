## Why

El pipeline SDDF carece de una forma de documentar y visualizar la arquitectura de contexto de un sistema. Los developers y arquitectos que usan el framework para especificar proyectos no tienen manera de generar un diagrama C4 Nivel 1 (System Context) a partir de su documentación existente ni de preguntas guiadas, lo que obliga a usar herramientas externas desconectadas del flujo de especificación.

## What Changes

- **Nuevo skill `project-context-diagram`** en `.claude/skills/project-context-diagram/SKILL.md`: skill interactivo que genera un diagrama de contexto C4 Nivel 1 en formato PlantUML, operando en dos modos: `--interactive` (preguntas guiadas al usuario) y `--from-files` (inferencia automática a partir de documentos de specs y código fuente).
- El skill produce el archivo `context-diagram.puml` en el directorio del proyecto activo bajo `$SPECS_BASE/specs/projects/<PROJ-slug>/`.
- El output es texto PlantUML renderizable directamente en Markdown (soportado por GitHub, GitLab y la mayoría de editores modernos).

## Capabilities

### New Capabilities
- `project-context-diagram`: Skill que genera diagramas C4 Nivel 1 (System Context) en PlantUML. Soporta modo interactivo (preguntas sobre actores, sistemas externos y relaciones) y modo automático (inferencia desde `requirement-spec.md`, `project-intent.md`, `README.md` y código fuente). Escribe el resultado en `$SPECS_BASE/specs/projects/<PROJ-slug>/context-diagram.puml`.

### Modified Capabilities
<!-- Sin cambios en capabilities existentes -->

## Impact

- **Archivos nuevos:** `.claude/skills/project-context-diagram/SKILL.md`, `.claude/skills/project-context-diagram/assets/c4-context-template.puml`
- **Sin cambios en código existente:** los skills de especificación de proyecto (project-begin, project-discovery, project-planning) no se modifican; `project-context-diagram` es un skill complementario opcional
- **Pipeline SDDF L3:** `project-context-diagram` se integra como paso opcional después de `/project-planning`, para enriquecer la documentación del proyecto con un diagrama de arquitectura de contexto
