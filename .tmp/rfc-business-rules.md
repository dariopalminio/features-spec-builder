# Business Rules Catalog
**Generado por**: reverse-engineer-business-analyst
**Fecha**: 2026-04-18

---

## Rules by Type

---

### Validación

- **BR-001**: `[DIRECT]`
  - DADO una historia de usuario presentada para evaluación FINVEST, CUANDO el F_score calculado es menor a 2.5, ENTONCES el sistema decide automáticamente RECHAZAR la historia sin evaluar las dimensiones INVEST y muestra las secciones faltantes del template canónico.
  - **Source**: `.claude/skills/story-finvest-evaluation/SKILL.md:74`, `rovo/story-evaluator-agent.md:126`
  - **Tipo**: Validación

- **BR-002**: `[DIRECT]`
  - DADO una historia de usuario que supera el gateway de formato (F_score ≥ 2.5), CUANDO cualquier dimensión INVEST recibe score = 1, ENTONCES el sistema decide automáticamente RECHAZAR la historia independientemente del score total y marca la dimensión con ⚠️.
  - **Source**: `.claude/skills/story-finvest-evaluation/SKILL.md:89`, `rovo/story-evaluator-agent.md:180`
  - **Tipo**: Validación

- **BR-003**: `[DIRECT]`
  - DADO el componente F1 (Como/Quiero/Para), CUANDO la cláusula `Como` hace referencia a un sistema en lugar de un usuario real, o `Quiero` describe implementación técnica, ENTONCES el score del componente es como máximo 3/5.
  - **Source**: `.claude/skills/story-finvest-evaluation/SKILL.md:115-116`
  - **Tipo**: Validación

- **BR-004**: `[DIRECT]`
  - DADO el componente F3 (Gherkin), CUANDO los escenarios Gherkin están presentes pero escritos fuera de bloques de código ` ```gherkin `, ENTONCES el score del componente es como máximo 2/5.
  - **Source**: `.claude/skills/story-finvest-evaluation/SKILL.md:134-135`
  - **Tipo**: Validación

- **BR-005**: `[DIRECT]`
  - DADO la dimensión S (Small), CUANDO una historia tiene 6 o más escenarios Gherkin o 11 o más pasos totales, ENTONCES se clasifica como Épica y recibe score S = 1 (dimensión crítica, provoca RECHAZAR automático).
  - **Source**: `.claude/skills/story-finvest-evaluation/SKILL.md:202`, `rovo/story-evaluator-agent.md:168`
  - **Tipo**: Validación

- **BR-006**: `[DIRECT]`
  - DADO el skill `/story-creation`, CUANDO se genera una historia de usuario, ENTONCES debe incluir mínimo 1 escenario principal y 1 escenario alternativo o de error en bloques gherkin antes de ser entregada.
  - **Source**: `.claude/skills/story-creation/SKILL.md:129-131`
  - **Tipo**: Validación

- **BR-007**: `[DIRECT]`
  - DADO el skill `/story-split`, CUANDO una historia resultante del split no entrega valor observable al usuario de forma independiente (falla V — Valiosa), ENTONCES se debe revisar el patrón de splitting porque probablemente se hizo un corte horizontal en lugar de vertical.
  - **Source**: `.claude/skills/story-split/SKILL.md:243-244`
  - **Tipo**: Validación

- **BR-008**: `[DIRECT]`
  - DADO el agente `reverse-engineer-business-analyst`, CUANDO el input de evaluación incluye imágenes adjuntas (wireframes, screenshots u otros archivos binarios de imagen), ENTONCES el sistema las ignora completamente y evalúa únicamente el contenido en texto (Markdown) de la historia de usuario.
  - **Source**: `.claude/skills/story-finvest-evaluation/SKILL.md:18-19`
  - **Tipo**: Validación

- **BR-009**: `[DIRECT]`
  - DADO el agente Rovo evaluador de historias, CUANDO se recibe una solicitud de evaluación, ENTONCES el agente evalúa únicamente issues de tipo Historia, Technical Story o Technical Debt; rechaza cualquier otro tipo de contenido con un mensaje informativo.
  - **Source**: `rovo/story-evaluator-agent.md:22-26`
  - **Tipo**: Validación

---

### Permiso

- **BR-010**: `[DIRECT]`
  - DADO el skill `project-begin-intention` (primer paso del pipeline), CUANDO se detecta que ya existe algún documento con `**Estado**: Doing` en `docs/specs/project/`, ENTONCES el sistema bloquea la ejecución por control WIP=1, notifica el conflicto y ofrece únicamente dos opciones: Sobrescribir o Retomar.
  - **Source**: `.claude/skills/project-begin-intention/SKILL.md:18-26`
  - **Tipo**: Permiso

- **BR-011**: `[DIRECT]`
  - DADO el skill `project-discovery` (segundo paso del pipeline), CUANDO `docs/specs/project/project-intent.md` no existe, ENTONCES el sistema bloquea la ejecución con error e indica que debe completarse primero la fase Begin Intention.
  - **Source**: `.claude/skills/project-discovery/SKILL.md:22-26`
  - **Tipo**: Permiso

- **BR-012**: `[DIRECT]`
  - DADO el skill `project-discovery`, CUANDO `docs/specs/project/project-intent.md` existe pero tiene `**Estado**: Doing`, ENTONCES el sistema bloquea la ejecución porque Begin Intention no está completo.
  - **Source**: `.claude/skills/project-discovery/SKILL.md:27-31`
  - **Tipo**: Permiso

- **BR-013**: `[DIRECT]`
  - DADO el skill `project-planning` (tercer paso del pipeline), CUANDO `docs/specs/project/requirement-spec.md` no existe o tiene `**Estado**: Doing`, ENTONCES el sistema bloquea la ejecución e indica que debe completarse primero la fase Discovery.
  - **Source**: `.claude/skills/project-planning/SKILL.md:18-31`
  - **Tipo**: Permiso

- **BR-014**: `[DIRECT]`
  - DADO el agente `project-pm` en estado Begin Intention, CUANDO `docs/specs/project/project-intent.md` existe con `**Estado**: Ready`, ENTONCES el sistema pregunta al usuario con `AskUserQuestion` si desea sobrescribir el documento antes de continuar.
  - **Source**: `.claude/agents/project-pm.agent.md:45-49`
  - **Tipo**: Permiso

- **BR-015**: `[DIRECT]`
  - DADO el skill `openspec-explore`, CUANDO el usuario solicita implementar algo dentro del modo exploración, ENTONCES el sistema le recuerda que explore mode es solo para pensar — nunca escribe código ni implementa features; debe salir del modo explore y crear una propuesta de cambio primero.
  - **Source**: `.claude/skills/openspec-explore/SKILL.md:5-6`
  - **Tipo**: Permiso

- **BR-016**: `[DIRECT]`
  - DADO el agente Rovo evaluador, CUANDO el usuario no especifica el tipo de issue (Historia / Technical Story / Technical Debt), ENTONCES el sistema pregunta al usuario el tipo antes de evaluar y no procede hasta obtener respuesta.
  - **Source**: `rovo/story-evaluator-agent.md:55-56`
  - **Tipo**: Permiso

- **BR-017**: `[DIRECT]`
  - DADO el skill `project-begin-intention`, CUANDO el template `.agent/skills/project-begin-intention/templates/project-intent-template.md` no existe, ENTONCES el sistema detiene la ejecución con un error explícito y no delega al agente `project-pm`.
  - **Source**: `.claude/skills/project-begin-intention/SKILL.md:40-46`
  - **Tipo**: Permiso

---

### Workflow

- **BR-018**: `[DIRECT]`
  - DADO el pipeline de ProjectSpecFactory, CUANDO el usuario quiere especificar un proyecto, ENTONCES el flujo secuencial obligatorio es: (1) Begin Intention → genera `project-intent.md`, (2) Discovery → genera `requirement-spec.md`, (3) Planning → genera `project-plan.md`; cada paso tiene como precondición que el anterior esté en `Estado: Ready`.
  - **Source**: `.claude/skills/project-begin-intention/SKILL.md`, `.claude/skills/project-discovery/SKILL.md`, `.claude/skills/project-planning/SKILL.md`
  - **Tipo**: Workflow

- **BR-019**: `[DIRECT]`
  - DADO el skill `reverse-engineering`, CUANDO el usuario ejecuta el análisis de ingeniería inversa, ENTONCES el orquestador lanza 4 agentes en paralelo simultáneamente (reverse-engineer-architect, reverse-engineer-product-discovery, reverse-engineer-business-analyst, reverse-engineer-ux-flow-mapper) y solo después de que todos completen invoca secuencialmente al reverse-engineer-synthesizer.
  - **Source**: `.claude/skills/reverse-engineering/SKILL.md:63-113`
  - **Tipo**: Workflow

- **BR-020**: `[DIRECT]`
  - DADO el skill `reverse-engineering` con flag `--update`, CUANDO el documento `docs/specs/project/requirement-spec.md` existe con `**Estado**: Ready`, ENTONCES el sistema informa al usuario que el documento ya está completo y solicita confirmación antes de continuar en modo incremental.
  - **Source**: `.claude/skills/reverse-engineering/SKILL.md:36-40`
  - **Tipo**: Workflow

- **BR-021**: `[INFERRED]`
  - DADO el agente `project-pm` en estado Discovery, CUANDO se retoma un `requirement-spec.md` en `Estado: Doing`, ENTONCES el agente pregunta únicamente por las secciones incompletas (marcadas con placeholders `[...]`) y no sobrescribe secciones ya completadas.
  - **Source**: `.claude/agents/project-pm.agent.md:106-109`
  - **Tipo**: Workflow

- **BR-022**: `[DIRECT]`
  - DADO el skill `openspec-apply-change`, CUANDO el estado del cambio es `state: "all_done"` (todas las tareas completadas), ENTONCES el sistema felicita al usuario y sugiere archivar el cambio con `/opsx:archive`.
  - **Source**: `.claude/skills/openspec-apply-change/SKILL.md:47-50`
  - **Tipo**: Workflow

- **BR-023**: `[DIRECT]`
  - DADO el skill `openspec-archive-change`, CUANDO existen delta specs en `openspec/changes/<name>/specs/`, ENTONCES el sistema compara cada delta spec con el spec principal correspondiente, muestra un resumen combinado de cambios y pregunta al usuario si desea sincronizar antes de archivar.
  - **Source**: `.claude/skills/openspec-archive-change/SKILL.md:54-66`
  - **Tipo**: Workflow

- **BR-024**: `[DIRECT]`
  - DADO el skill `project-discovery`, CUANDO la fase Discovery está activa, ENTONCES el agente `project-pm` conduce primero el discovery de usuarios y entrega un resumen estructurado, y luego el agente `project-architect` usa ese resumen para conducir la entrevista de especificación de requisitos — son dos fases secuenciales dentro de la misma sesión.
  - **Source**: `.claude/skills/project-discovery/SKILL.md:54-84`
  - **Tipo**: Workflow

- **BR-025**: `[INFERRED]`
  - DADO el skill `reverse-engineering`, CUANDO alguno de los archivos intermedios `.tmp/rfc-*.md` no se generó correctamente, ENTONCES el sintetizador continúa con los archivos disponibles, advierte al usuario de los archivos faltantes, y marca las secciones correspondientes como `<!-- PENDING MANUAL REVIEW -->` en el documento final.
  - **Source**: `.claude/skills/reverse-engineering/SKILL.md:121-125`, `.claude/agents/reverse-engineer-synthesizer.agent.md:37-38`
  - **Tipo**: Workflow

---

### Cálculo

- **BR-026**: `[DIRECT]`
  - DADO la evaluación FINVEST de una historia de usuario, CUANDO se ejecuta la Fase 1, ENTONCES el F_score se calcula como: `F_score = (puntaje_historia × 0.4) + (puntaje_criterios × 0.3) + (puntaje_gherkin × 0.3)`, expresado con dos decimales de precisión.
  - **Source**: `.claude/skills/story-finvest-evaluation/SKILL.md:71`
  - **Tipo**: Cálculo

- **BR-027**: `[DIRECT]`
  - DADO que una historia supera el gateway F (F_score ≥ 2.5), CUANDO se completa la Fase 2, ENTONCES el INVEST_Score se calcula como: `INVEST_Score = (I + N + V + E + S + T) / 6`, y el FINVEST_Score como: `FINVEST_Score = (F_score + INVEST_Score) / 2`.
  - **Source**: `.claude/skills/story-finvest-evaluation/SKILL.md:85-87`
  - **Tipo**: Cálculo

- **BR-028**: `[DIRECT]`
  - DADO la dimensión S (Small), CUANDO la historia no tiene escenarios Gherkin explícitos, ENTONCES la estimación del tamaño se basa en la complejidad implícita del texto de la historia (sin señal primaria de escenarios disponible).
  - **Source**: `.claude/skills/story-finvest-evaluation/SKILL.md:204`
  - **Tipo**: Cálculo

---

### Negocio

- **BR-029**: `[DIRECT]`
  - DADO la tabla de decisión FINVEST, CUANDO el FINVEST_Score es 4.0 o superior (y F_score ≥ 2.5 y ninguna dimensión INVEST = 1), ENTONCES la historia es APROBADA para sprint planning; cuando está entre 3.0 y 3.99 es REFINAR; cuando es menor a 3.0 es RECHAZAR.
  - **Source**: `.claude/skills/story-finvest-evaluation/SKILL.md:96-101`
  - **Tipo**: Negocio

- **BR-030**: `[DIRECT]`
  - DADO el pipeline de ProjectSpecFactory, CUANDO el agente genera contenido que no fue explícitamente confirmado por el usuario, ENTONCES debe marcarlo con `[inferido]` para distinguirlo del contenido confirmado y garantizar trazabilidad.
  - **Source**: `.claude/agents/project-pm.agent.md:23`, `.claude/agents/project-architect.agent.md:27`
  - **Tipo**: Negocio

- **BR-031**: `[DIRECT]`
  - DADO el agente `project-architect` en Planning, CUANDO genera el backlog de features, ENTONCES Release 1 debe ser siempre el MVP con un mínimo conjunto de features (tamaño ideal: 3-5) que resuelve el problema central y puede desplegarse a usuarios reales para obtener feedback.
  - **Source**: `.claude/agents/project-architect.agent.md:167-171`
  - **Tipo**: Negocio

- **BR-032**: `[DIRECT]`
  - DADO el agente `project-architect` en Planning, CUANDO prioriza features, ENTONCES el orden de criterios es: (1) Valor de negocio — peso alto, (2) Dependencias bloqueantes — peso alto, (3) Riesgo técnico — peso medio, (4) Esfuerzo estimado — peso bajo.
  - **Source**: `.claude/agents/project-architect.agent.md:155-161`
  - **Tipo**: Negocio

- **BR-033**: `[DIRECT]`
  - DADO el skill `/story-creation`, CUANDO la historia generada supera S = 3 escenarios Gherkin o es demasiado grande para INVEST, ENTONCES el skill sugiere usar `/story-split` para dividirla antes de entregarla.
  - **Source**: `.claude/skills/story-creation/SKILL.md:155-156`
  - **Tipo**: Negocio

- **BR-034**: `[DIRECT]`
  - DADO el skill `/story-split`, CUANDO el patrón de splitting resulta en historias con el mismo `Para` (mismo beneficio), ENTONCES se considera un anti-patrón — cada historia resultante del split debe tener un beneficio diferenciado.
  - **Source**: `.claude/skills/story-split/SKILL.md:308`
  - **Tipo**: Negocio

- **BR-035**: `[DIRECT]`
  - DADO el skill `/story-split`, CUANDO ninguno de los 7 patrones de splitting aplica debido a incógnitas masivas sobre el problema, ENTONCES se producen TADs (Tiny Acts of Discovery) en lugar de historias de usuario; los TADs son experimentos de investigación y no se guardan como archivos de historia.
  - **Source**: `.claude/skills/story-split/SKILL.md:177-188`
  - **Tipo**: Negocio

- **BR-036**: `[DIRECT]`
  - DADO el skill `/story-split`, CUANDO se aplica splitting horizontal (Historia 1: API, Historia 2: UI), ENTONCES se considera un anti-patrón porque ninguna historia entrega valor por sí sola; el corte debe ser siempre vertical (cada historia incluye lo necesario para ser usable).
  - **Source**: `.claude/skills/story-split/SKILL.md:307`
  - **Tipo**: Negocio

- **BR-037**: `[INFERRED]`
  - DADO el agente `project-pm`, CUANDO conduce la entrevista de discovery o especificación, ENTONCES agrupa las preguntas en máximo 3-4 por ronda para no abrumar al usuario, y no repite preguntas por secciones ya completadas.
  - **Source**: `.claude/agents/project-pm.agent.md:55-56`, `.claude/agents/project-pm.agent.md:120-125`
  - **Tipo**: Negocio

- **BR-038**: `[DIRECT]`
  - DADO el agente `reverse-engineer-synthesizer`, CUANDO genera el documento final, ENTONCES el documento mínimo válido debe contener: metadatos completos, al menos 3 features como FR (aunque sean `[SUGGESTED]`), al menos 1 NFR, un árbol ASCII de navegación (si `rfc-navigation.md` existe) y la sección `## Gaps & Next Steps`.
  - **Source**: `.claude/agents/reverse-engineer-synthesizer.agent.md:171-177`
  - **Tipo**: Negocio

- **BR-039**: `[DIRECT]`
  - DADO el agente `project-pm` con el principio de PM "Preguntas derivadas del template", CUANDO el template evoluciona o cambia su estructura, ENTONCES el agente debe derivar sus preguntas dinámicamente de los comentarios `<!-- -->` del template en runtime — nunca usa preguntas hardcodeadas.
  - **Source**: `.claude/agents/project-pm.agent.md:26`, `.claude/agents/project-architect.agent.md:26`
  - **Tipo**: Negocio

- **BR-040**: `[DIRECT]`
  - DADO el skill `openspec-propose`, CUANDO el usuario no proporciona una descripción clara de lo que quiere construir, ENTONCES el skill usa `AskUserQuestion` para obtener esta información antes de continuar — no procede sin entender el objetivo del cambio.
  - **Source**: `.claude/skills/openspec-propose/SKILL.md:27-31`
  - **Tipo**: Negocio

- **BR-041**: `[DIRECT]`
  - DADO el agente Rovo evaluador, CUANDO evalúa la dimensión V (Valiosa) de una Technical Story, ENTONCES el valor puede expresarse como habilitador técnico (ej. "permite escalar X", "desbloquea feature Y"); para Technical Debt, el valor puede expresarse como reducción de riesgo, tiempo o costo operacional.
  - **Source**: `rovo/story-evaluator-agent.md:48-53`
  - **Tipo**: Negocio

- **BR-042**: `[DIRECT]`
  - DADO el skill `openspec-archive-change`, CUANDO el nombre destino del archivo ya existe en el directorio de archivos (`openspec/changes/archive/YYYY-MM-DD-<name>`), ENTONCES el sistema falla con error y sugiere renombrar el archivo existente o usar una fecha diferente — no sobrescribe archivos existentes.
  - **Source**: `.claude/skills/openspec-archive-change/SKILL.md:75-77`
  - **Tipo**: Negocio

- **BR-043**: `[INFERRED]`
  - DADO el skill `skill-creator`, CUANDO se mejora una skill existente en Claude.ai o Cowork donde la ruta instalada puede ser de solo lectura, ENTONCES se debe copiar la skill a `/tmp/skill-name/` antes de editar y luego empaquetar desde la copia.
  - **Source**: `.claude/skills/skill-creator/SKILL.md:443-446`
  - **Tipo**: Negocio

- **BR-044**: `[SUGGESTED]`
  - DADO el modelo de arquitectura del framework, CUANDO se orquesta un workflow complejo, ENTONCES el skill actúa como el único punto de entrada y coordinador (orquestador plano: Skill → Subagente A, Subagente B, ...) evitando múltiples niveles de delegación entre agentes.
  - **Source**: `CLAUDE.md` (descripción del modelo de un solo nivel de delegación)
  - **Tipo**: Negocio

- **BR-045**: `[SUGGESTED]`
  - DADO la nomenclatura de archivos de historias de usuario generadas por `/story-creation` o `/story-split`, CUANDO se guarda un archivo, ENTONCES el formato es `story-{slug}.md` donde el slug se deriva del campo `Quiero` de la historia: minúsculas, palabras separadas por guiones, máximo 5 palabras significativas.
  - **Source**: `.claude/skills/story-creation/SKILL.md:164-166`, `.claude/skills/story-split/SKILL.md:254-256`
  - **Tipo**: Negocio

---

## Gaps & Unknowns

- **GAP-001**: No existe código ejecutable con validaciones de datos (validators, schemas, DTOs) — el repositorio es un framework de documentación basado en Markdown. Las únicas "validaciones" son reglas de negocio declaradas en lenguaje natural dentro de los archivos SKILL.md y agent.md.
  - **Pregunta sugerida**: ¿Existe alguna capa de código ejecutable (scripts Python, TypeScript, etc.) donde se implementen validaciones programáticas de los documentos generados?

- **GAP-002**: No se detectaron guards, middlewares ni mecanismos de autenticación/autorización de tipo técnico. Los "permisos" del sistema son controles de flujo de proceso (WIP=1, precondiciones de documentos) no controles de acceso a recursos.
  - **Pregunta sugerida**: ¿Está planificado algún sistema de autenticación o control de acceso por roles para el framework?

- **GAP-003**: El campo `**Estado**` de los documentos (`Doing` / `Ready`) actúa como máquina de estados del pipeline, pero no existe un mecanismo automatizado que lo verifique o actualice — depende de edición manual por el usuario.
  - **Pregunta sugerida**: ¿Existe o está planificado algún mecanismo automatizado para gestionar las transiciones de estado de los documentos?

- **GAP-004**: Las reglas de evaluación FINVEST están definidas de forma idéntica en dos lugares: `.claude/skills/story-finvest-evaluation/SKILL.md` y `rovo/story-evaluator-agent.md`. No hay una fuente única de verdad para el algoritmo.
  - **Pregunta sugerida**: ¿Cuál es la fuente canónica del algoritmo FINVEST? ¿Se mantienen sincronizadas ambas definiciones deliberadamente?

- **GAP-005**: El skill `openspec-propose` requiere la CLI externa `openspec` (con comandos como `openspec new change`, `openspec status --json`, `openspec instructions`), pero no existe documentación de esa CLI en el repositorio.
  - **Pregunta sugerida**: ¿Dónde está documentada la CLI `openspec`? ¿Es un paquete externo o parte de este proyecto?

- **GAP-006**: No se encontraron reglas de negocio para manejo de errores en la generación de documentos cuando fallan múltiples agentes simultáneamente en la Fase 1 del reverse-engineering.
  - **Pregunta sugerida**: ¿Qué sucede si 2 o más agentes de análisis paralelo fallan al mismo tiempo? ¿Existe algún mecanismo de reintento?

- **GAP-007**: El control WIP=1 aplica solo al skill `project-begin-intention`, pero no está claro si aplica también cuando se ejecutan `project-discovery` y `project-planning` en proyectos distintos simultáneamente.
  - **Pregunta sugerida**: ¿El control WIP=1 es por directorio de proyecto o es global para todo el repositorio?

- **GAP-008**: No se encontraron reglas explícitas sobre retención o eliminación de archivos `.tmp/rfc-*.md` generados durante el reverse-engineering — no está claro si se limpian automáticamente o persisten entre ejecuciones.
  - **Pregunta sugerida**: ¿Los archivos `.tmp/rfc-*.md` son sobreescritos en cada ejecución o acumulan versiones? ¿Existe alguna política de limpieza?
