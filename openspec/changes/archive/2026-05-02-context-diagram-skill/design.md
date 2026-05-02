## Context

El SDDF dispone de un pipeline completo de especificación de proyectos (L3: project-begin → project-discovery → project-planning) que produce documentos Markdown estructurados, pero no genera ninguna representación visual de la arquitectura. Los diagramas C4 Nivel 1 (System Context) son la herramienta estándar de la industria para comunicar cómo un sistema interactúa con actores externos y sistemas adyacentes, y su ausencia obliga a los equipos a mantener diagramas en herramientas externas desconectadas del flujo de especificación.

El nuevo skill `project-context-diagram` debe integrarse de forma natural con el flujo existente: operar desde el directorio de specs del proyecto activo, respetar la convención `SPECS_BASE`, y producir un artefacto de texto versionable junto al resto de la documentación.

## Goals / Non-Goals

**Goals:**
- Generar un diagrama C4 Nivel 1 en PlantUML versionable como archivo de texto
- Soportar dos modos de operación: interactivo (preguntas al usuario) y automático (inferencia desde archivos)
- Leer `$SPECS_BASE` para ubicar el directorio de proyectos (convención SDDF)
- Producir un archivo `context-diagram.puml` en el directorio del proyecto activo
- Cubrir el Scenario de error con fallback a modo interactivo cuando el documento indicado no existe

**Non-Goals:**
- Diagramas C4 Nivel 2 (contenedores) o Nivel 3 (componentes)
- Renderizado visual automático, exportación a PNG/SVG ni preview en browser
- Sincronización automática del diagrama al modificar specs
- Integración con herramientas de diagramado externas (Lucidchart, Miro, etc.)

## Decisions

### Decisión 1: PlantUML como formato de salida (no Mermaid)

**Elegido:** PlantUML con librería C4 (`!include C4Context.puml`)  
**Rechazado:** Mermaid  
**Rationale:** PlantUML tiene soporte nativo para el modelo C4 a través de la librería oficial `C4-PlantUML` (Simon Brown), lo que permite usar `Person()`, `System()`, `System_Ext()`, `Rel()` con semántica estricta C4. Mermaid no tiene primitivas C4 nativas; requeriría simular el modelo con formas genéricas, perdiendo la semántica. La extensión `.puml` es reconocida por VS Code, GitLab, y la mayoría de pipelines CI. GitHub renderiza Mermaid de forma nativa pero no PlantUML — se acepta como trade-off documentado.

### Decisión 2: Dos modos de operación con flag explícito

**Elegido:** `--interactive` (default) y `--from-files`  
**Rechazado:** Detección automática del modo según contexto  
**Rationale:** La detección automática introduce ambigüedad sobre cuándo el skill hace preguntas vs. cuándo infiere silenciosamente. Un flag explícito hace el comportamiento predecible y documentable. `--interactive` es el default porque es el caso de uso más común y siempre funciona sin dependencias externas.

### Decisión 3: Lectura de template PlantUML desde `assets/c4-context-template.puml`

**Elegido:** Template externo en `assets/`  
**Rechazado:** Template hardcodeado en `SKILL.md`  
**Rationale:** Consistente con el patrón del framework (templates como fuente de verdad extraídos en runtime). Permite evolucionar el template C4 sin modificar la lógica del skill.

### Decisión 4: Ruta de salida `$SPECS_BASE/specs/projects/<PROJ-slug>/context-diagram.puml`

**Elegido:** Colocar el diagrama junto al `project.md` del proyecto activo  
**Rechazado:** Directorio separado `docs/diagrams/`  
**Rationale:** Mantiene la cohesión del artefacto con su workitem padre. El directorio `projects/<PROJ-slug>/` ya agrupa toda la documentación L3 del proyecto; el diagrama de contexto es un artefacto complementario de ese mismo nivel. Facilita la navegación y reduce la dispersión de artefactos.

### Decisión 5: Fallback a modo interactivo cuando el archivo indicado no existe

**Elegido:** Mostrar error + leer directorio de proyectos + continuar con preguntas guiadas  
**Rechazado:** Terminar con error sin recuperación  
**Rationale:** El usuario que indica una ruta incorrecta probablemente quiere generar el diagrama de todos modos. Un fallback informado (muestra el error, lista los proyectos disponibles, continúa con preguntas) mejora la UX sin perder seguridad.

## Risks / Trade-offs

- **[Riesgo] GitHub no renderiza PlantUML nativo** → Mitigación: documentar en el SKILL.md que el archivo requiere la extensión PlantUML de VS Code o un servidor PlantUML para preview. El artefacto es igualmente válido como documentación versionada aunque no se renderice automáticamente en GitHub.
- **[Riesgo] Inferencia en modo `--from-files` puede producir actores/relaciones incorrectos** → Mitigación: el skill siempre muestra un preview del diagrama inferido antes de escribir el archivo y ofrece corrección interactiva antes de confirmar.
- **[Trade-off] Semántica C4 estricta vs. flexibilidad** → Se prioriza semántica estricta (solo Nivel 1) para que el diagrama sea correcto. Niveles superiores se dejan para historias futuras.
