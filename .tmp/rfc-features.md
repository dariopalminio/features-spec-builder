# Feature Inventory
**Generado por**: reverse-engineer-product-discovery
**Fecha**: 2026-04-18

## Features by Domain

---

### Pipeline de Especificación de Proyectos

- **FEAT-001**: Captura de Intención de Proyecto `[DIRECT]`
  - **Descripción**: El usuario puede iniciar un proyecto describiendo su idea en lenguaje natural; el sistema conduce una entrevista guiada para capturar la intención del proyecto y produce un documento `project-intent.md`.
  - **Tipo**: Core
  - **Source**: `.claude/skills/project-begin-intention/SKILL.md`, `.claude/agents/project-pm.agent.md`
  - **Ruta/Endpoint asociado**: `docs/specs/project/project-intent.md` (output)

- **FEAT-002**: Discovery de Usuarios y Especificación de Requisitos `[DIRECT]`
  - **Descripción**: El usuario puede iniciar la fase de discovery; el sistema conduce una entrevista para identificar perfiles de usuario, flujos de uso, restricciones y requisitos, produciendo `requirement-spec.md`.
  - **Tipo**: Core
  - **Source**: `.claude/skills/project-discovery/SKILL.md`, `.claude/agents/project-pm.agent.md`, `.claude/agents/project-architect.agent.md`
  - **Ruta/Endpoint asociado**: `docs/specs/project/requirement-spec.md` (output)

- **FEAT-003**: Planificación de Releases y Backlog `[DIRECT]`
  - **Descripción**: El usuario puede generar un plan de proyecto con features atómicas priorizadas, agrupadas en releases incrementales (MVP en Release 1), a partir de `requirement-spec.md`.
  - **Tipo**: Core
  - **Source**: `.claude/skills/project-planning/SKILL.md`, `.claude/agents/project-architect.agent.md`
  - **Ruta/Endpoint asociado**: `docs/specs/project/project-plan.md` (output)

- **FEAT-004**: Control WIP (Work in Progress) `[DIRECT]`
  - **Descripción**: El sistema detecta si existe un documento en estado "Doing" antes de iniciar una nueva fase, y ofrece las opciones de sobrescribir o retomar el proyecto activo, evitando trabajo paralelo no intencional.
  - **Tipo**: Edge case
  - **Source**: `.claude/skills/project-begin-intention/SKILL.md` (paso 1 — Verificar WIP=1)
  - **Ruta/Endpoint asociado**: `docs/specs/project/`

- **FEAT-005**: Retoma de Documentos en Progreso `[DIRECT]`
  - **Descripción**: Si un documento está en estado "Doing", el sistema lee el documento existente, identifica secciones incompletas y las completa sin volver a preguntar ni sobrescribir secciones ya completas.
  - **Tipo**: Edge case
  - **Source**: `.claude/agents/project-pm.agent.md` (Paso 2 flujo de retoma), `.claude/agents/project-architect.agent.md`
  - **Ruta/Endpoint asociado**: `docs/specs/project/`

---

### Escritura y Gestión de Historias de Usuario

- **FEAT-006**: Creación de Historias de Usuario `[DIRECT]`
  - **Descripción**: El usuario puede describir una necesidad o feature en lenguaje natural y el sistema genera una historia de usuario completa en formato Como/Quiero/Para con criterios de aceptación en Gherkin, guardada como archivo `.md`.
  - **Tipo**: Core
  - **Source**: `.claude/skills/story-creation/SKILL.md`
  - **Ruta/Endpoint asociado**: `docs/specs/stories/story-{slug}.md` (output)

- **FEAT-007**: División de Historias de Usuario (Story Splitting) `[DIRECT]`
  - **Descripción**: El usuario puede tomar una historia grande o épica y dividirla en historias más pequeñas e independientes usando 8 patrones de splitting (flujo de trabajo, variaciones de reglas de negocio, variaciones de datos, complejidad de criterios, esfuerzo mayor, dependencias externas, pasos DevOps, TADs).
  - **Tipo**: Core
  - **Source**: `.claude/skills/story-split/SKILL.md`
  - **Ruta/Endpoint asociado**: `docs/specs/stories/story-{slug}.md` (output por cada historia resultante)

- **FEAT-008**: Evaluación de Calidad de Historias (FINVEST) `[DIRECT]`
  - **Descripción**: El usuario puede evaluar la calidad de una historia de usuario aplicando la rúbrica FINVEST (Formato + INVEST) con escala Likert 1–5, obteniendo un score por dimensión, score global y una decisión: APROBADA, REFINAR o RECHAZAR.
  - **Tipo**: Core
  - **Source**: `.claude/skills/story-finvest-evaluation/SKILL.md`
  - **Ruta/Endpoint asociado**: N/A (output en conversación)

- **FEAT-009**: Búsqueda de Historias por Término `[DIRECT]`
  - **Descripción**: El usuario puede invocar los skills de story-creation o story-split con un nombre o término corto, y el sistema busca automáticamente en `docs/specs/stories/` el archivo correspondiente.
  - **Tipo**: Edge case
  - **Source**: `.claude/skills/story-creation/SKILL.md` (Paso 0 — Tipo C), `.claude/skills/story-split/SKILL.md` (Fase 0 — Tipo C)
  - **Ruta/Endpoint asociado**: `docs/specs/stories/`

- **FEAT-010**: Evaluación FINVEST via Agente Rovo (Jira) `[DIRECT]`
  - **Descripción**: El agente Rovo puede ser invocado on-demand o automáticamente desde Jira (cuando un issue cambia a "Selected for Development") para evaluar historias de usuario, Technical Stories y Technical Debt con la rúbrica FINVEST, devolviendo comentarios listos para pegar en la historia.
  - **Tipo**: Edge case
  - **Source**: `rovo/story-evaluator-agent.md`
  - **Ruta/Endpoint asociado**: Integración con Jira (automatización de estado)

---

### Ingeniería Inversa de Repositorios

- **FEAT-011**: Reverse Engineering de Repositorios Existentes `[DIRECT]`
  - **Descripción**: El usuario puede ejecutar el skill de ingeniería inversa sobre cualquier repositorio para generar automáticamente un `requirement-spec.md` a partir del código fuente, sin necesidad de entrevistas manuales.
  - **Tipo**: Core
  - **Source**: `.claude/skills/reverse-engineering/SKILL.md`
  - **Ruta/Endpoint asociado**: `docs/specs/project/requirement-spec.md` (output)

- **FEAT-012**: Análisis de Arquitectura Técnica `[DIRECT]`
  - **Descripción**: El sistema analiza la arquitectura técnica del repositorio (stack, frameworks, dependencias, patrones, puntos de integración) y genera un informe estructurado en `.tmp/rfc-architecture.md`.
  - **Tipo**: Core
  - **Source**: `.claude/agents/reverse-engineer-architect.agent.md`
  - **Ruta/Endpoint asociado**: `.tmp/rfc-architecture.md` (output)

- **FEAT-013**: Extracción de Features desde Perspectiva de Usuario `[DIRECT]`
  - **Descripción**: El sistema analiza UI, rutas, endpoints y textos de interfaz del repositorio para producir un inventario de funcionalidades agrupadas por dominio de negocio en `.tmp/rfc-features.md`.
  - **Tipo**: Core
  - **Source**: `.claude/agents/reverse-engineer-product-discovery.agent.md`
  - **Ruta/Endpoint asociado**: `.tmp/rfc-features.md` (output)

- **FEAT-014**: Extracción de Reglas de Negocio `[DIRECT]`
  - **Descripción**: El sistema identifica reglas de negocio, validaciones, permisos y workflows del código fuente y los convierte a lenguaje natural en formato DADO/CUANDO/ENTONCES.
  - **Tipo**: Core
  - **Source**: `.claude/agents/reverse-engineer-business-analyst.agent.md`
  - **Ruta/Endpoint asociado**: `.tmp/rfc-business-rules.md` (output)

- **FEAT-015**: Reconstrucción de Mapa de Navegación y Flujos UX `[DIRECT]`
  - **Descripción**: El sistema reconstruye el árbol de navegación y los flujos de usuario a partir de la configuración de routing, guards y componentes de navegación del repositorio, generando un árbol ASCII compatible con el template de requisitos.
  - **Tipo**: Core
  - **Source**: `.claude/agents/reverse-engineer-ux-flow-mapper.agent.md`
  - **Ruta/Endpoint asociado**: `.tmp/rfc-navigation.md` (output)

- **FEAT-016**: Síntesis de Documento de Requisitos desde Análisis Automático `[DIRECT]`
  - **Descripción**: El sistema fusiona los outputs de los 4 agentes de análisis en paralelo y genera el documento final `requirement-spec.md` rellenando el template sección por sección, marcando secciones pendientes con `<!-- PENDING MANUAL REVIEW -->`.
  - **Tipo**: Core
  - **Source**: `.claude/agents/reverse-engineer-synthesizer.agent.md`
  - **Ruta/Endpoint asociado**: `docs/specs/project/requirement-spec.md` (output)

- **FEAT-017**: Análisis con Scope Acotado (--focus) `[DIRECT]`
  - **Descripción**: El usuario puede limitar el análisis de ingeniería inversa a una ruta específica del repositorio usando el flag `--focus <path>`.
  - **Tipo**: Edge case
  - **Source**: `.claude/skills/reverse-engineering/SKILL.md` (Fase 0, parseo de flags)
  - **Ruta/Endpoint asociado**: N/A (parámetro de invocación)

- **FEAT-018**: Modo Incremental de Reverse Engineering (--update) `[DIRECT]`
  - **Descripción**: El usuario puede re-analizar solo las secciones marcadas como pendientes en un documento existente, preservando las secciones ya completadas.
  - **Tipo**: Edge case
  - **Source**: `.claude/skills/reverse-engineering/SKILL.md` (Fase 0, flag --update)
  - **Ruta/Endpoint asociado**: `docs/specs/project/requirement-spec.md`

---

### Integración con OpenSpec

- **FEAT-019**: Propuesta de Cambios con OpenSpec `[DIRECT]`
  - **Descripción**: El usuario puede describir qué quiere construir y el sistema genera automáticamente una propuesta completa con artefactos (proposal.md, design.md, tasks.md) usando el CLI de OpenSpec.
  - **Tipo**: Core
  - **Source**: `.claude/skills/openspec-propose/SKILL.md`, `.claude/commands/opsx/propose.md`
  - **Ruta/Endpoint asociado**: `openspec/changes/<name>/`

- **FEAT-020**: Exploración y Discovery con OpenSpec `[DIRECT]`
  - **Descripción**: El usuario puede entrar en modo exploración para pensar en voz alta sobre ideas, investigar problemas, clarificar requisitos y comparar opciones, con soporte para visualizaciones ASCII y lectura del codebase.
  - **Tipo**: Edge case
  - **Source**: `.claude/skills/openspec-explore/SKILL.md`, `.claude/commands/opsx/explore.md`
  - **Ruta/Endpoint asociado**: `openspec/changes/`

- **FEAT-021**: Implementación de Tareas con OpenSpec `[DIRECT]`
  - **Descripción**: El usuario puede implementar las tareas definidas en un cambio de OpenSpec, con tracking de progreso, pausa ante ambigüedades y actualización de checkboxes de tareas completadas.
  - **Tipo**: Core
  - **Source**: `.claude/skills/openspec-apply-change/SKILL.md`, `.claude/commands/opsx/apply.md`
  - **Ruta/Endpoint asociado**: `openspec/changes/<name>/tasks.md`

- **FEAT-022**: Archivado de Cambios con OpenSpec `[DIRECT]`
  - **Descripción**: El usuario puede archivar un cambio completado, con verificación de estado de artefactos y tareas, sincronización opcional de delta specs con los specs principales, y generación de nombre de archivo con fecha.
  - **Tipo**: Edge case
  - **Source**: `.claude/skills/openspec-archive-change/SKILL.md`, `.claude/commands/opsx/archive.md`
  - **Ruta/Endpoint asociado**: `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

### Creación y Mejora de Skills

- **FEAT-023**: Creación de Nuevas Skills `[DIRECT]`
  - **Descripción**: El usuario puede crear nuevas skills para el framework mediante un proceso iterativo: captura de intención, escritura del SKILL.md, ejecución de casos de prueba, evaluación de resultados (cualitativa y cuantitativa con benchmark), refinamiento y empaquetado.
  - **Tipo**: Core
  - **Source**: `.claude/skills/skill-creator/SKILL.md`
  - **Ruta/Endpoint asociado**: `.claude/skills/<nombre-skill>/SKILL.md` (output)

- **FEAT-024**: Evaluación y Mejora Iterativa de Skills `[DIRECT]`
  - **Descripción**: El usuario puede mejorar una skill existente ejecutando casos de prueba con y sin la skill (baseline), viendo resultados en un viewer HTML, aplicando feedback para refinar la skill y repitiendo el ciclo.
  - **Tipo**: Core
  - **Source**: `.claude/skills/skill-creator/SKILL.md` (sección "Improving the skill")
  - **Ruta/Endpoint asociado**: `<skill-name>-workspace/iteration-<N>/`

- **FEAT-025**: Optimización de Descripciones de Skills `[DIRECT]`
  - **Descripción**: El usuario puede optimizar la descripción de una skill (campo `description` del frontmatter YAML) para mejorar la precisión de triggering, mediante un proceso automatizado con eval queries y loop de optimización.
  - **Tipo**: Edge case
  - **Source**: `.claude/skills/skill-creator/SKILL.md` (sección "Description Optimization")
  - **Ruta/Endpoint asociado**: `.claude/skills/<nombre-skill>/SKILL.md`

- **FEAT-026**: Empaquetado de Skills `[DIRECT]`
  - **Descripción**: El usuario puede empaquetar una skill en un archivo `.skill` para distribuirla e instalarla en otros entornos.
  - **Tipo**: Edge case
  - **Source**: `.claude/skills/skill-creator/SKILL.md` (sección "Package and Present")
  - **Ruta/Endpoint asociado**: `<skill-name>.skill` (output)

---

### Soporte UX en Discovery

- **FEAT-027**: Discovery de Experiencia de Usuario (UX) `[DIRECT]`
  - **Descripción**: Durante la fase de Discovery, el agente UX puede ser invocado para identificar perfiles de usuario detallados, mapear flujos y journeys de usuario, definir criterios de usabilidad medibles, especificar estados de interfaz (vacío, carga, error, éxito) y proponer dirección visual.
  - **Tipo**: Edge case
  - **Source**: `.claude/agents/project-ux.agent.md`
  - **Ruta/Endpoint asociado**: `docs/specs/project/requirement-spec.md` (contribución a secciones UX/UI)

---

## UI Text Signals

Este repositorio es un framework de automatización (sin UI de usuario final renderizable). Los "textos de UI" son mensajes de confirmación, notificación y guía que el sistema muestra al usuario en la interfaz conversacional (CLI/chat).

### Acciones (mensajes de acción)

- "Sobrescribir" → opción de reemplazar documento existente — `.claude/skills/project-begin-intention/SKILL.md:24`
- "Retomar" → opción de continuar documento en progreso — `.claude/skills/project-begin-intention/SKILL.md:25`
- "Save, Submit, Delete, Create, Add, Edit, Login, Register, Logout, Upload, Download, Export, Import" → acciones de UI detectadas como patrones a buscar en repositorios analizados — `.claude/agents/reverse-engineer-product-discovery.agent.md:57`

### Títulos de sección / mensajes de estado

- "Iniciando análisis de ingeniería inversa..." → flujo de reverse engineering — `.claude/skills/reverse-engineering/SKILL.md:46`
- "✅ Especificación generada correctamente." → confirmación de output de reverse engineering — `.claude/skills/reverse-engineering/SKILL.md:148`
- "✅ Documento generado correctamente." → confirmación de output de pipeline — `.claude/skills/project-begin-intention/SKILL.md:76`
- "❌ No se encontró `docs/specs/project/project-intent.md`." → precondición fallida de discovery — `.claude/skills/project-discovery/SKILL.md:23`
- "❌ No se encontró el template requerido..." → precondición de template — `.claude/skills/project-begin-intention/SKILL.md:43`
- "## Implementing: <change-name>" → progreso de implementación OpenSpec — `.claude/skills/openspec-apply-change/SKILL.md:93`
- "## Implementation Complete" → finalización de tareas OpenSpec — `.claude/skills/openspec-apply-change/SKILL.md:104`
- "## Implementation Paused" → pausa por issue en implementación — `.claude/skills/openspec-apply-change/SKILL.md:119`
- "## Archive Complete" → archivado exitoso de cambio — `.claude/skills/openspec-archive-change/SKILL.md:95`
- "📊 Evaluación FINVEST" → reporte de evaluación de historia — `rovo/story-evaluator-agent.md:211`
- "APROBADA ✅ / REFINAR 🔧 / RECHAZAR ❌" → decisiones de evaluación FINVEST — `.claude/skills/story-finvest-evaluation/SKILL.md:98-101`
- "Nota FINVEST: Esta historia está lista para evaluarse con `/story-finvest-evaluation`." → hint post-creación — `.claude/skills/story-creation/SKILL.md:187`

### Labels de formulario / prompts de entrevista

- "¿Cómo llamarías a este proyecto?" → captura de nombre del proyecto — `.claude/skills/project-discovery/templates/requirement-spec-template.md:16`
- "¿Podemos refinar el problema?" → refinamiento del problema — `.claude/skills/project-discovery/templates/requirement-spec-template.md:21`
- "¿Cómo mediríamos el éxito en los primeros 3 meses?" → criterios de éxito — `.claude/skills/project-discovery/templates/requirement-spec-template.md:53`
- "¿Quién? / ¿Qué? / ¿Para qué? / ¿Contexto?" → recolección de contexto para historia — `.claude/skills/story-creation/SKILL.md:97-100`
- "What change do you want to work on?" → entrada de OpenSpec propose — `.claude/skills/openspec-propose/SKILL.md:30`
- "¿Este issue es una Historia, Technical Story o Technical Debt?" → clasificación de issue para evaluación Rovo — `rovo/story-evaluator-agent.md:55`

---

## API Endpoints Detected

Este repositorio no contiene código de backend con endpoints HTTP. Es un framework de automatización basado en archivos Markdown. No se detectaron rutas de Express, FastAPI, Django, Spring ni Rails.

| Método | Path | Handler/Controller | Feature inferida | Confianza |
|--------|------|--------------------|------------------|-----------|
| N/A | `docs/specs/project/project-intent.md` | project-pm agent | Documento de intención | [DIRECT] |
| N/A | `docs/specs/project/requirement-spec.md` | project-architect / reverse-engineer-synthesizer | Especificación de requisitos | [DIRECT] |
| N/A | `docs/specs/project/project-plan.md` | project-architect | Plan de proyecto | [DIRECT] |
| N/A | `docs/specs/stories/story-{slug}.md` | story-creation / story-split | Historia de usuario | [DIRECT] |
| N/A | `.tmp/rfc-architecture.md` | reverse-engineer-architect | Análisis de arquitectura | [DIRECT] |
| N/A | `.tmp/rfc-features.md` | reverse-engineer-product-discovery | Inventario de features | [DIRECT] |
| N/A | `.tmp/rfc-business-rules.md` | reverse-engineer-business-analyst | Reglas de negocio | [DIRECT] |
| N/A | `.tmp/rfc-navigation.md` | reverse-engineer-ux-flow-mapper | Mapa de navegación | [DIRECT] |
| N/A | `openspec/changes/<name>/` | openspec-propose / openspec-apply | Cambio de OpenSpec | [DIRECT] |
| N/A | `openspec/changes/archive/` | openspec-archive-change | Archivo de cambio | [DIRECT] |

---

## Gaps & Unknowns

### Features probables no confirmadas en código

- **Gestión de historial de versiones de documentos** `[SUGGESTED]` — El sistema usa campos `**Versión**` y `**Estado**` en los documentos, pero no hay mecanismo explícito de versionado más allá del control de git. Probable pero no confirmado en código.
- **Exportación/publicación de requisitos** `[SUGGESTED]` — El sistema genera archivos `.md` pero no se encontró mecanismo de exportación a PDF, Word u otros formatos.
- **Dashboard o vista de estado del pipeline** `[SUGGESTED]` — No se detectó ninguna vista agregada del estado de todos los documentos del pipeline (intent → discovery → planning → stories). Solo hay checks individuales por skill.
- **Validación de prerequisitos entre fases** `[DIRECT, parcial]` — El sistema valida que `project-intent.md` esté en estado "Ready" antes de ejecutar discovery, y que `requirement-spec.md` esté "Ready" antes de planning. Sin embargo, no hay validación del estado de `project-plan.md` antes de ejecutar story-creation.
- **Templates distribuidos en múltiples ubicaciones** `[DIRECT]` — Los mismos templates de story-gherkin existen en `.claude/skills/`, `.agents/skills/` y `.github/skills/`. No queda claro cuál es la fuente de verdad en tiempo de ejecución para entornos distintos a Claude Code.
- **Sincronización de delta specs con specs principales** `[DIRECT, parcial]` — El skill de archive menciona `openspec-sync-specs` como skill invocado para sincronización, pero no se encontró ese archivo SKILL.md en el repositorio. Puede ser una dependencia externa al CLI de OpenSpec.
- **Configuración multiagente para Copilot/Codex** `[INFERRED]` — La presencia de `.agents/` (paralelo a `.claude/`) y `.github/` con las mismas skills sugiere soporte para múltiples plataformas (Copilot, Codex, Claude), pero la documentación completa de compatibilidad no está explícita.

### Preguntas sugeridas para el revisor manual

1. ¿Existe algún mecanismo de autenticación o control de acceso en el framework? No se detectó ninguno — parece ser un sistema monousuario por diseño.
2. ¿Cuál es la fuente de verdad cuando los skills existen en `.claude/`, `.agents/`, y `.github/`? ¿Se sincronizan manualmente?
3. ¿El skill `openspec-sync-specs` existe como herramienta externa del CLI de OpenSpec o es un skill pendiente de crear?
4. ¿Hay un skill para la fase de implementación de código (después de la planificación)? El pipeline documentado va hasta `project-plan.md`, pero la visión menciona "generación de tareas, implementación con IA y validación automática".
5. ¿Existe integración con sistemas de gestión de proyectos más allá de Jira (via Rovo)? Por ejemplo: GitHub Issues, Linear, Notion.
6. ¿Hay un mecanismo para agregar o customizar templates de stories sin modificar los skills existentes?
