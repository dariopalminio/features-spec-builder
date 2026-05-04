## Context

El directorio `docs/` del repositorio SDDF contiene actualmente artefactos de especificación (project-intent.md, requirement-spec.md, project-plan.md, releases, stories) y documentación técnica (docker-dev-container.md, extreme-agile/) sin un índice central ni un esquema de navegación definido. Los LLMs que operan sobre el repositorio deben escanear todos los archivos para construir contexto, lo que es costoso en tokens y tiempo. El patrón LLM Wiki (Karpathy) propone un índice como cursor principal: el LLM lee `index.md` primero y decide qué nodos abrir a continuación.

El skill `docs-wiki-builder` implementa este patrón generando y manteniendo la estructura wiki dentro de `docs/` sin alterar el pipeline SDDF existente.

## Goals / Non-Goals

**Goals:**
- Generar `docs/index.md` como mapa navegable de toda la documentación
- Crear la estructura canónica de directorios (`$SPECS_BASE/specs/`, `docs/wiki/`)
- Validar wikilinks internos y marcar nodos pendientes (`⚠️`)
- Detectar estructura preexistente y proponer reorganización con confirmación
- Integrar el frontmatter YAML (type, slug, title, date, status) en cada nodo

**Non-Goals:**
- No modifica el contenido interno de los archivos existentes (solo mueve/renombra con confirmación)
- No elimina archivos sin confirmación explícita del usuario
- No cambia el pipeline SDDF ni los skills existentes
- No genera diagramas C4 ni documentación técnica — solo estructura el directorio

## Decisions

### D1: Skill autónomo sin subagentes
**Decisión:** El skill opera completamente inline sin delegar a agentes especializados.  
**Rationale:** La operación es determinista (listar archivos → generar índice → validar links) y no requiere razonamiento creativo. Delegar a un subagente añadiría latencia innecesaria.  
**Alternativa considerada:** Delegar al agente `project-architect` para inferir la estructura. Descartado por ser over-engineering para esta tarea.

### D2: Wikilinks `[[slug]]` como sintaxis interna
**Decisión:** Los links internos usan la sintaxis `[[slug]]` (wikilinks estilo Obsidian/Foam) en lugar de rutas Markdown relativas (`[título](./ruta.md)`).  
**Rationale:** Los LLMs pueden parsear `[[slug]]` directamente como referencia a un nodo. Foam los visualiza como grafo en VS Code. La sintaxis es más legible y compacta en el índice.  
**Alternativa considerada:** Rutas Markdown relativas. Más verbosas, menos legibles para LLMs, no compatibles con Foam graph view.

### D3: `docs/index.md` como único punto de entrada
**Decisión:** El índice es un único archivo en la raíz de `docs/` (no un índice por subdirectorio).  
**Rationale:** El patrón Karpathy requiere un único cursor inicial. Un índice por subdirectorio fragmenta el mapa y obliga al LLM a leer múltiples archivos para orientarse.

### D4: Template en `assets/` del skill
**Decisión:** El skill incluye `assets/wiki-index-template.md` como plantilla del índice.  
**Rationale:** Consistente con la convención SDDF de empaquetar templates dentro del skill. Permite evolucionar la plantilla independientemente del skill logic.

### D5: Frontmatter en nodos — delegar a reglas inline
**Decisión:** El skill aplica frontmatter YAML a los nodos usando las mismas reglas inline del esquema canónico (type, slug, title, date, status), sin depender del skill `header-aggregation`. Para eso debe validar primero que el archivo ya tiene frontmatter para evitar conflictos. Los archivos pueden tener el frontmatter preexistente generado por otros skills, si es necesario se fusionan y si no tiene se agrega. 
**Rationale:** Autonomía del skill. Si `header-aggregation` no está instalado, el skill sigue funcionando. Consistente con la decisión tomada en la feature de frontmatter en templates.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| El usuario tiene archivos en `docs/` con paths hardcodeados en otros archivos | El skill solo propone movimientos, no los ejecuta sin confirmación. Avisar explícitamente sobre posibles links rotos externos. |
| Los wikilinks `[[slug]]` no son estándar Markdown y pueden no renderizarse en GitHub | Documentar en el skill que los wikilinks requieren Foam para visualización de grafo; en GitHub se renderizan como texto plano. |
| El índice puede quedar desactualizado si se añaden archivos manualmente | El skill incluye un modo `--update` para regenerar el índice sin reorganizar la estructura existente. |
| Colisión de slugs si dos archivos tienen el mismo nombre en subdirectorios distintos | El slug incluye el subdirectorio como prefijo si hay colisión (ej. `wiki-architecture-principles` vs `specs-project-project-plan`). |
