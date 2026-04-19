# Navigation & UX Flow Map
**Generado por**: reverse-engineer-ux-flow-mapper
**Fecha**: 2026-04-18

## Contexto del repositorio

Este repositorio no es una aplicación web ni un backend con endpoints HTTP. Es un **framework CLI multiagente** (Agile SDDF) que opera dentro del entorno de Claude Code. La "navegación" es el sistema de invocación de skills y el pipeline secuencial de estados que el usuario recorre para especificar un proyecto de software. No existen URLs, rutas HTTP, ni guards de autenticación web.

El modelo de interacción es: el usuario invoca un **skill** por nombre (ej. `/project-begin-intention`), el skill orquesta uno o más **agentes** subagentes, y el resultado es un **documento Markdown** en `docs/specs/project/`. El control de acceso a cada estado no es por roles/auth sino por **precondiciones de documento** (el estado `Estado: Ready` de los documentos de entrada actúa como gate).

---

## Navigation Tree (ASCII)

```
AGILE SDDF — Sistema de Invocación de Skills
│
├── PIPELINE: ProjectSpecFactory  [FLUJO PRINCIPAL]
│   │
│   ├── [Estado 1] project-begin-intention  [INFERRED]
│   │   ├── Precondición: ninguna (entry point del pipeline)
│   │   ├── Guard WIP: detecta si existe doc en Estado: Doing  [DIRECT]
│   │   ├── Agente delegado: project-pm
│   │   └── Output: docs/specs/project/project-intent.md
│   │       └── [Bifurcación] Estado del output:
│   │           ├── No existe → Crear (flujo normal)
│   │           ├── Estado: Doing → Retomar (flujo de retoma)
│   │           └── Estado: Ready → Confirmar sobrescritura
│   │
│   ├── [Estado 2] project-discovery  [INFERRED]
│   │   ├── Precondición: project-intent.md con Estado: Ready  [DIRECT]
│   │   ├── Fase Discovery: agente project-pm  (+ apoyo project-ux)
│   │   ├── Fase Specifying: agente project-architect  (+ apoyo project-ux)
│   │   └── Output: docs/specs/project/requirement-spec.md
│   │       └── [Bifurcación] Estado del output:
│   │           ├── No existe → Crear
│   │           ├── Estado: Doing → Retomar
│   │           └── Estado: Ready → Confirmar sobrescritura
│   │
│   └── [Estado 3] project-planning  [INFERRED]
│       ├── Precondición: requirement-spec.md con Estado: Ready  [DIRECT]
│       ├── Agente delegado: project-architect
│       └── Output: docs/specs/project/project-plan.md
│           └── [Bifurcación] Estado del output:
│               ├── No existe → Crear
│               ├── Estado: Doing → Retomar
│               └── Estado: Ready → Confirmar sobrescritura
│
├── PIPELINE: Story Management  [FLUJO SECUNDARIO]
│   │
│   ├── story-creation  [INFERRED]
│   │   ├── Input: texto libre | ruta de archivo | término de búsqueda
│   │   └── Output: docs/specs/stories/story-{slug}.md
│   │
│   ├── story-split  [INFERRED]
│   │   ├── Input: historia grande | ruta de archivo | término de búsqueda
│   │   └── Output: N × docs/specs/stories/story-{slug}.md
│   │
│   └── story-finvest-evaluation  [INFERRED]
│       ├── Input: texto de historia de usuario
│       └── Output: reporte FINVEST en conversación (APROBADA / REFINAR / RECHAZAR)
│
├── PIPELINE: OpenSpec Change Management  [FLUJO ALTERNATIVO]
│   │
│   ├── openspec-explore  [INFERRED]
│   │   ├── Modo: thinking partner (solo lectura, sin implementación)
│   │   └── Output: artefactos OpenSpec opcionales
│   │
│   ├── openspec-propose  [INFERRED]
│   │   ├── Input: descripción de cambio o nombre kebab-case
│   │   └── Output: openspec/changes/<name>/{proposal.md, design.md, tasks.md}
│   │
│   ├── openspec-apply-change  [INFERRED]
│   │   ├── Precondición: change con artefactos requeridos en estado done
│   │   ├── Input: nombre del change (opcional, se infiere del contexto)
│   │   └── Output: implementación de tareas + checkboxes actualizados
│   │
│   └── openspec-archive-change  [INFERRED]
│       ├── Precondición: change activo (no archivado)
│       ├── Input: nombre del change
│       └── Output: openspec/changes/archive/YYYY-MM-DD-<name>/
│
├── PIPELINE: Reverse Engineering  [FLUJO ALTERNATIVO]
│   │
│   └── reverse-engineering  [INFERRED]
│       ├── Flags: --focus <path> | --update | --verbose
│       ├── Fase 1 — Análisis paralelo (4 agentes simultáneos):
│       │   ├── reverse-engineer-architect       → .tmp/rfc-architecture.md
│       │   ├── reverse-engineer-product-discovery → .tmp/rfc-features.md
│       │   ├── reverse-engineer-business-analyst → .tmp/rfc-business-rules.md
│       │   └── reverse-engineer-ux-flow-mapper  → .tmp/rfc-navigation.md
│       ├── Fase 2 — Síntesis:
│       │   └── reverse-engineer-synthesizer → docs/specs/project/requirement-spec.md
│       └── Output: docs/specs/project/requirement-spec.md
│
└── PIPELINE: Skill Creator  [FLUJO DE MANTENIMIENTO]
    │
    └── skill-creator  [INFERRED]
        ├── Captura de intención → Entrevista → Draft SKILL.md
        ├── Ejecución de evals (con/sin skill, en paralelo)
        ├── Grading + Benchmark + Eval viewer
        ├── Iteración (feedback → mejora → re-eval)
        ├── Description optimization (run_loop.py)
        └── Output: <skill-name>/SKILL.md + .skill package
```

---

## Routes Inventory

> Nota: En este framework las "rutas" son skills (puntos de entrada) y agentes (subprocesadores). No hay URLs. La columna "Auth" se interpreta como "Precondición de documento" que actúa de gate. La columna "Roles" indica el agente responsable.

| Skill / Agente | Precondición de entrada | Agente(s) responsable(s) | Tipo | Confianza |
|----------------|------------------------|--------------------------|------|-----------|
| `/project-begin-intention` | Ninguna (entry point) | project-pm | skill orquestador | [DIRECT] |
| `/project-discovery` | project-intent.md en Estado: Ready | project-pm + project-architect (+ project-ux) | skill orquestador | [DIRECT] |
| `/project-planning` | requirement-spec.md en Estado: Ready | project-architect | skill orquestador | [DIRECT] |
| `/story-creation` | Ninguna | — (skill autónomo) | skill terminal | [DIRECT] |
| `/story-split` | Ninguna | — (skill autónomo) | skill terminal | [DIRECT] |
| `/story-finvest-evaluation` | Ninguna | — (skill autónomo) | skill terminal | [DIRECT] |
| `/opsx:explore` | Ninguna | — (modo conversacional) | skill conversacional | [DIRECT] |
| `/opsx:propose` | Ninguna | — (skill autónomo) | skill orquestador | [DIRECT] |
| `/opsx:apply` | Change con artefactos requeridos done | — (skill autónomo) | skill orquestador | [DIRECT] |
| `/opsx:archive` | Change activo existente | — (skill autónomo) | skill terminal | [DIRECT] |
| `/reverse-engineering` | Ninguna (--update requiere req-spec existente) | 4 agentes paralelos + synthesizer | skill orquestador | [DIRECT] |
| `/skill-creator` | Ninguna | grader, comparator, analyzer (subagentes) | skill orquestador | [DIRECT] |
| `project-pm` (agente) | Invocado por project-begin-intention o project-discovery | — | agente subprocesador | [DIRECT] |
| `project-architect` (agente) | Invocado por project-discovery o project-planning | — | agente subprocesador | [DIRECT] |
| `project-ux` (agente) | Invocado opcionalmente por project-pm o project-architect | — | agente soporte | [DIRECT] |
| `reverse-engineer-architect` (agente) | Invocado por reverse-engineering Fase 1 | — | agente análisis | [DIRECT] |
| `reverse-engineer-product-discovery` (agente) | Invocado por reverse-engineering Fase 1 | — | agente análisis | [DIRECT] |
| `reverse-engineer-business-analyst` (agente) | Invocado por reverse-engineering Fase 1 | — | agente análisis | [DIRECT] |
| `reverse-engineer-ux-flow-mapper` (agente) | Invocado por reverse-engineering Fase 1 | — | agente análisis | [DIRECT] |
| `reverse-engineer-synthesizer` (agente) | Invocado por reverse-engineering Fase 2 | — | agente síntesis | [DIRECT] |

---

## User Flows Detected

### Flujo 1 — Especificación completa de proyecto (flujo principal)

1. **Entry**: El usuario invoca `/project-begin-intention` en Claude Code
2. El skill verifica WIP: si hay un doc en Estado: Doing, ofrece Sobrescribir o Retomar
3. El skill delega al agente `project-pm`
4. `project-pm` conduce entrevista en dos fases (Captura → Refinamiento), max 3-4 preguntas por ronda
5. `project-pm` escribe `docs/specs/project/project-intent.md` con Estado: Doing
6. Usuario revisa y actualiza Estado a `Ready` manualmente
7. El usuario invoca `/project-discovery`
8. El skill verifica precondición: project-intent.md debe estar en Estado: Ready
9. El skill delega a `project-pm` para discovery de usuarios (Fase Discovery)
10. `project-pm` puede invocar a `project-ux` para flujos y usabilidad
11. El skill delega a `project-architect` para especificación de requisitos (Fase Specifying)
12. `project-architect` puede invocar a `project-ux` para secciones UX/UI
13. `project-architect` escribe `docs/specs/project/requirement-spec.md` con Estado: Doing
14. Usuario revisa y actualiza Estado a `Ready` manualmente
15. El usuario invoca `/project-planning`
16. El skill verifica precondición: requirement-spec.md debe estar en Estado: Ready
17. El skill delega a `project-architect`
18. `project-architect` extrae features FEAT-NNN, las prioriza y agrupa en releases
19. `project-architect` escribe `docs/specs/project/project-plan.md` con Estado: Doing
20. **Exit (éxito)**: Usuario revisa project-plan.md y cambia Estado a `Ready` — pipeline completo
21. **Exit (error)**: Precondición no cumplida en cualquier estado → mensaje de error + instrucción de qué skill ejecutar primero

### Flujo 2 — Retoma de sesión interrumpida

1. **Entry**: El usuario re-invoca un skill (ej. `/project-discovery`) con documento en Estado: Doing
2. El skill detecta Estado: Doing en el documento de output
3. El agente delegado lee el documento existente e identifica secciones incompletas (placeholders `[...]`)
4. El agente completa solo las secciones faltantes sin re-preguntar las ya completadas
5. **Exit (éxito)**: Documento completado, confirmación al usuario

### Flujo 3 — Creación y evaluación de historias de usuario

1. **Entry**: El usuario invoca `/story-creation` con texto libre, ruta o término de búsqueda
2. El skill detecta el tipo de input (Tipo A: texto libre / Tipo B: ruta / Tipo C: búsqueda)
3. Si Tipo C y hay múltiples coincidencias → lista de opciones al usuario
4. El skill recopila contexto (Quién / Qué / Para qué / Contexto)
5. Redacta `Como/Quiero/Para` con criterios Mike Cohn
6. Define escenarios Gherkin (mínimo 1 principal + 1 alternativo/error)
7. Verifica INVEST internamente antes de entregar
8. Guarda `docs/specs/stories/story-{slug}.md`
9. (Opcional) El usuario invoca `/story-finvest-evaluation` sobre la historia generada
10. Si score S ≤ 2 o historia demasiado grande → El usuario invoca `/story-split`
11. `/story-split` aplica uno de 8 patrones de splitting y genera N historias independientes
12. **Exit (éxito)**: Historias guardadas en `docs/specs/stories/`, listas para sprint planning
13. **Exit (error)**: F_score < 2.5 en evaluación FINVEST → RECHAZAR con recomendaciones de formato

### Flujo 4 — Gestión de cambios con OpenSpec

1. **Entry**: El usuario invoca `/opsx:explore` para explorar una idea (modo thinking partner)
2. El usuario refina la idea; puede solicitar capturar insights como artefactos OpenSpec
3. El usuario invoca `/opsx:propose` con descripción o nombre de cambio
4. El skill crea `openspec/changes/<name>/` con proposal.md, design.md, tasks.md
5. El usuario invoca `/opsx:apply` para implementar las tareas del change
6. El skill implementa tarea a tarea, marcando checkboxes `- [ ]` → `- [x]`
7. Si implementación revela problemas de diseño → pausa y sugiere actualizar artefactos
8. El usuario invoca `/opsx:archive` para finalizar el change
9. El skill evalúa si hay delta specs para sincronizar con specs principales
10. El skill mueve el change a `openspec/changes/archive/YYYY-MM-DD-<name>/`
11. **Exit (éxito)**: Change archivado con specs sincronizadas

### Flujo 5 — Ingeniería inversa de codebase existente

1. **Entry**: El usuario invoca `/reverse-engineering` (con flags opcionales --focus, --update, --verbose)
2. El skill parsea flags y resuelve el path del template de requisitos
3. El skill lanza 4 agentes de análisis en paralelo (mismo turn)
4. Cada agente escribe su output en `.tmp/rfc-*.md`
5. El skill invoca al `reverse-engineer-synthesizer` con los 4 archivos intermedios
6. El synthesizer genera `docs/specs/project/requirement-spec.md`
7. **Exit (éxito)**: requirement-spec.md generado con secciones `<!-- PENDING MANUAL REVIEW -->` para gaps
8. **Exit (error parcial)**: Uno o más archivos `.tmp/rfc-*.md` faltantes → advertencia, pero continúa

### Flujo 6 — Creación y mejora de skills

1. **Entry**: El usuario invoca `/skill-creator` con descripción de skill a crear o mejorar
2. Captura de intención → Entrevista sobre edge cases, inputs/outputs, criterios de éxito
3. Draft del SKILL.md con frontmatter (name, description, compatibility)
4. Definición de casos de prueba → `evals/evals.json`
5. Ejecución paralela de runs (with-skill + baseline) como subagentes
6. Grading de assertions → `grading.json` + `benchmark.json`
7. Generación del eval viewer (`generate_review.py`) para revisión humana
8. El usuario provee feedback → el skill mejora el SKILL.md
9. Loop: re-ejecución con nueva iteración hasta convergencia
10. Optimización de description con `run_loop.py` (triggering accuracy)
11. **Exit (éxito)**: SKILL.md finalizado + `.skill` package generado

---

## Guards & Auth Patterns

- **Mecanismo detectado**: Precondición de documento (Document State Gate)
- **Implementación**: Cada skill orquestador lee el campo `**Estado**` del documento de entrada requerido antes de ejecutar. Si el documento no existe o su Estado es `Doing`, la ejecución se detiene con un mensaje de error instructivo. Este patrón reemplaza a los guards de autenticación tradicionales.
- **Estados de documento como gates**:
  - `Estado: Doing` — documento en progreso; el skill ofrece "Retomar" en lugar de reiniciar
  - `Estado: Ready` — precondición cumplida; permite avanzar al siguiente estado del pipeline
  - No existe — primera ejecución; el skill crea el documento desde cero
- **Control WIP=1**: El skill `project-begin-intention` verifica que no haya más de un documento en `Estado: Doing` simultáneamente en `docs/specs/project/`. Si hay conflicto, ofrece Sobrescribir o Retomar.
- **Roles detectados**: No hay roles de usuario (no es una aplicación multiusuario). Los "roles" son agentes especializados: `project-pm`, `project-architect`, `project-ux` — cada uno con responsabilidades delimitadas dentro del pipeline.
- **Ruta de login**: No aplica. El sistema es CLI sin autenticación de usuarios.

---

## Gaps & Unknowns

- **Generación dinámica de preguntas**: Los agentes `project-pm` y `project-architect` extraen secciones y comentarios `<!-- -->` de los templates en runtime para generar preguntas. Este comportamiento es instruccional (definido en los SKILL.md de los agentes) y no puede mapearse estáticamente como un árbol de navegación fijo.
- **Navegación programática en story-creation**: El skill acepta 3 tipos de input (texto libre, ruta, búsqueda) con resolución dinámica. El path exacto de navegación depende del input en runtime.
- **Dependencias entre historias de usuario**: Los 8 patrones de splitting en `/story-split` pueden generar dependencias entre historias resultantes que no se capturan en el árbol de navegación.
- **Artefactos OpenSpec con schemas variables**: El skill `openspec-apply-change` obtiene el orden de artefactos dinámicamente desde `openspec status --json`. Los artefactos exactos dependen del schema del change y no son mapeables estáticamente.
- **Subdirectorio `.agents/skills/`**: Existe un directorio `.agents/skills/` (además de `.claude/skills/`) con contenido parcialmente duplicado (`story-creation`, `story-split`). No queda claro si este directorio es la fuente de verdad activa o un residuo de una versión anterior.
- **Directorio `rovo/`**: Existe `rovo/story-evaluator-agent.md` cuyo rol en el sistema actual no está documentado en ningún skill o pipeline activo.
- **Directorio `gem/`**: Contiene prompts alternativos (`prompt-project-begin-intention.md`, etc.) para una integración diferente (posiblemente Google Gemini). Su relación con el pipeline principal de Claude Code es ambigua.
- **`docs/project-spec-factory/`**: Existe un directorio con documentos del proyecto (`project-intent.md`, `requirement-spec.md`, `project-plan.md`) separado del path esperado `docs/specs/project/`. Puede indicar una migración de paths en curso.
- **Pregunta para revisor manual**: ¿El path canónico de outputs es `docs/specs/project/` o `docs/project-spec-factory/`? Los skills referencian el primero pero los documentos existentes están en el segundo.
