![agile-sddf](assets/logo/agile-sddf-logo-v1.png)

# Agile Spec-Driven-Development Framework (SDDF)

Sistema multiagente minimalista que automatiza el ciclo completo de especificación de proyectos software — desde la intención inicial hasta el backlog planificado y las historias de usuario — usando solo archivos Markdown como agentes, skills y templates en Claude Code.

## Vision

**Para** builders, freelancers, developers y equipos ágiles que usan IA para acelerar el desarrollo de software,
**quienes** sufren de procesos manuales, prompts inconsistentes y falta de estructura para transformar ideas en especificaciones precisas que la IA pueda ejecutar de forma predecible,
**nuestro producto** es un sistema que extrae dinámicamente la estructura de los templates en tiempo de ejecución para generar preguntas contextuales, garantizando que el framework evolucione junto con tus prácticas sin modificar lógica hardcodeada. Integra nativamente con OpenSpec y SpecKit, potenciando sus capacidades con agentes y skills personalizables.

---

## Módulos

| Módulo | Descripción |
|--------|-------------|
| [ProjectSpecFactory CLI](#projectspecfactory-cli) | Pipeline de especificación de proyecto: intención → discovery → backlog |
| [features-spec-builder](#features-spec-builder) | Pipeline de historias de usuario: creación → evaluación → splitting |

---

# ProjectSpecFactory CLI

Sistema CLI multiagente que convierte la intención inicial de un proyecto en un backlog planificado por releases, con control de WIP y revisión humana en cada etapa.

## Workflow

```
/project-begin-intention → /project-discovery → /project-planning
```

Cada comando produce un documento. WIP=1: un proyecto activo a la vez. Cada documento tiene subestados `Doing` y `Ready`.

## Comandos

| Comando | Documento de salida | Agente principal |
|---------|---------------------|-----------------|
| `/project-begin-intention` | `docs/specs/project/project-intent.md` | `project-pm` |
| `/project-discovery` | `docs/specs/project/requirement-spec.md` | `project-architect` |
| `/project-planning` | `docs/specs/project/project-plan.md` | `project-architect` |

## Agentes

| Agente | Archivo | Rol |
|--------|---------|-----|
| `project-pm` | `.claude/agents/project-pm.agent.md` | Entrevistas de intención y discovery de producto |
| `project-architect` | `.claude/agents/project-architect.agent.md` | Especificación técnica y planificación |
| `project-ux` | `.claude/agents/project-ux.agent.md` | Flujos de usuario y usabilidad (soporte en Discovery) |

## Principios

- **Minimalista** — sin dependencias externas, solo archivos Markdown
- **Trazable** — cada documento incluye metadatos de estado (`Doing` / `Ready`) y agente generador
- **Idempotente** — re-ejecutar un estado detecta el documento existente y retoma sin duplicar
- **Extensible** — agregar una sección al template es suficiente para que el agente la incluya

## Estructura

```
.claude/
├── agents/
│   ├── project-pm.agent.md          # PM — Begin Intention, Discovery
│   ├── project-architect.agent.md   # Arquitecto — Discovery, Planning
│   └── project-ux.agent.md          # UX — apoyo en Discovery
└── skills/
    ├── project-begin-intention/
    │   ├── SKILL.md
    │   └── templates/project-intent-template.md
    ├── project-discovery/
    │   ├── SKILL.md
    │   └── templates/requirement-spec-template.md
    └── project-planning/
        ├── SKILL.md
        └── templates/project-plan-template.md

docs/specs/project/              # Documentos generados por el pipeline
├── project-intent.md
├── requirement-spec.md
└── project-plan.md
```

---

# features-spec-builder

Sistema agentico minimalista para crear, dividir y evaluar historias de usuario de alta calidad usando skills de Claude Code.

## Workflow

```
Necesidad / feature
       │
       ▼
 /story-creation          ← Genera la historia en formato canónico
       │
       ▼
 /finvest-evaluation      ← Evalúa la calidad (score S ≤ 2 → dividir)
       │
       ├── Ready           → Historia lista para sprint planning
       ├── Refinar         → Aplicar recomendaciones y re-evaluar
       └── Rechazar
             │
             ├── Formato insuficiente → Reescribir con /story-creation
             └── Historia muy grande  → /story-split → /finvest-evaluation
```

## Comandos

| Comando | Descripción |
|---------|-------------|
| `/story-creation` | Crea una historia de usuario en formato story-gherkin a partir de una necesidad en lenguaje natural. Aplica Mike Cohn, 3 C's e INVEST. |
| `/story-split` | Divide una historia grande en historias más pequeñas e independientes usando los 8 patrones de splitting. |
| `/finvest-evaluation` | Evalúa la calidad de una historia con la rúbrica FINVEST (Formato + INVEST) en escala Likert 1–5. Produce score por dimensión, score global y decisión Ready / Refinar / Rechazar. |

## Template canónico

Todas las historias siguen el template `story-gherkin-template.md`:

```markdown
## Historia
**Como** {rol específico}
**Quiero** {acción concreta}
**Para** {beneficio medible}

## Criterios de aceptación

### Escenario principal – {título}
Dado {contexto}
Cuando {acción}
Entonces {resultado}

### Escenario alternativo / error – {título}
Dado {contexto}
Cuando {acción inválida}
Entonces {error}
  Pero {excepción}

## Criterios no funcionales (opcional)
## Notas / contexto adicional (opcional)
```

## Estructura

```
.claude/skills/
├── story-creation/
│   ├── SKILL.md
│   └── templates/story-gherkin-template.md
├── story-split/
│   ├── SKILL.md
│   └── templates/story-gherkin-template.md
└── finvest-evaluation/
    ├── SKILL.md
    ├── templates/
    │   ├── story-gherkin-template.md
    │   └── output-template.md
    └── examples/
        ├── example-ready.md
        ├── example-refinar.md
        └── example-rechazar.md
```

## Uso en otros clientes

**Claude Code / VS Code / JetBrains** — ejecuta directamente los comandos en el chat del agente:
```
/story-creation
/story-split
/finvest-evaluation
```

**Jira (Rovo)** — crea un agente en Studio → Agentes → Crear un Agente y configúralo con los prompts de la carpeta `gem/prompts/`.

**Gemini Gem** — crea una Gem con las instrucciones de `gem/prompts/`. Agrega como conocimiento el template canónico (`story-gherkin-template.md`) y la base teórica FINVEST.

## Base teórica

- Mike Cohn — *User Stories Applied* (2004)
- Bill Wake — *INVEST in Good Stories* (2003)
- Richard Lawrence & Peter Green — *Humanizing Work Guide to Splitting User Stories*
- User Experience Mapping — Peter W. Szabo
