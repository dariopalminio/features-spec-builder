# Architecture Analysis
**Generado por**: reverse-engineer-architect
**Fecha**: 2026-04-18

---

## Detected Stack

- **Primary Language**: Markdown (`.md`) — lenguaje dominante del repositorio con 100+ archivos `[DIRECT]`
- **Additional Languages**: Python (10 archivos `.py` en `.claude/skills/skill-creator/scripts/`) `[DIRECT]`
- **Primary Framework**: No hay framework de aplicación convencional. El sistema opera sobre el runtime de Claude Code (Anthropic Claude Agent SDK) como plataforma de ejecución `[INFERRED]`
- **Additional Frameworks/Libraries**:
  - OpenSpec (sistema propio de spec-driven change management, con `openspec/config.yaml` y estructura de changes/specs) `[DIRECT]`
  - Docker (Dockerfile.dev + docker-compose.dev.yml para entorno de desarrollo) `[DIRECT]`
  - skill-creator (skill externo importado desde `anthropics/skills` via `skills-lock.json`) `[DIRECT]`
- **Architecture Pattern**: Framework de agentes multi-plataforma con orquestación por skills — no es un monolito ni microservicio tradicional, sino un sistema de instrucciones distribuidas para múltiples runtimes de IA `[INFERRED]`
- **Entry Points**:
  - `.claude/skills/project-begin-intention/SKILL.md` — inicio del pipeline principal ProjectSpecFactory
  - `.claude/skills/reverse-engineering/SKILL.md` — skill de ingeniería inversa
  - `.claude/skills/story-creation/SKILL.md` — creación de historias de usuario
  - `.claude/skills/story-finvest-evaluation/SKILL.md` — evaluación FINVEST
  - `.claude/skills/story-split/SKILL.md` — splitting de historias
  - `.claude/skills/skill-creator/SKILL.md` — meta-skill para crear/mejorar skills

---

## Directory Structure Summary

```
agile-sddf/                         → raíz del repositorio
├── .agents/                        → skills duplicados para runtime Codex/Cursor/OpenCode
│   └── skills/
│       ├── story-creation/         → skill de creación de historias (SKILL.md + templates)
│       ├── story-finvest-evaluation/ → skill de evaluación (SKILL.md + templates + examples)
│       └── story-split/            → skill de splitting (SKILL.md + templates)
├── .claude/                        → fuente primaria para Claude Code runtime
│   ├── agents/                     → definiciones de subagentes especializados
│   │   ├── project-pm.agent.md     → PM: Begin Intention + Discovery
│   │   ├── project-architect.agent.md → Architect: Discovery + Planning
│   │   ├── project-ux.agent.md     → UX: apoyo en Discovery
│   │   ├── reverse-engineer-architect.agent.md → análisis de stack
│   │   ├── reverse-engineer-business-analyst.agent.md → reglas de negocio
│   │   ├── reverse-engineer-product-discovery.agent.md → features desde perspectiva de usuario
│   │   ├── reverse-engineer-synthesizer.agent.md → síntesis de outputs paralelos
│   │   └── reverse-engineer-ux-flow-mapper.agent.md → navegación y flujos UX
│   ├── commands/opsx/              → comandos legacy para OpenSpec (apply/archive/explore/propose)
│   └── skills/                     → skills del sistema (punto de entrada + orquestadores)
│       ├── openspec-apply-change/  → aplicar cambio en OpenSpec
│       ├── openspec-archive-change/ → archivar cambio en OpenSpec
│       ├── openspec-explore/       → explorar cambios en OpenSpec
│       ├── openspec-propose/       → proponer cambio en OpenSpec
│       ├── project-begin-intention/ → paso 1: capturar intención del proyecto
│       ├── project-discovery/      → paso 2: discovery + requirement-spec
│       ├── project-planning/       → paso 3: project-plan con features/releases
│       ├── reverse-engineering/    → ingeniería inversa de codebase
│       ├── skill-creator/          → meta-skill para crear/mejorar skills (con scripts Python)
│       ├── story-creation/         → crear historias de usuario
│       ├── story-finvest-evaluation/ → evaluar historias con rúbrica FINVEST
│       └── story-split/            → dividir historias grandes (8 patrones)
├── .devcontainer/                  → configuración VS Code Dev Container
│   └── devcontainer.json           → extensiones: Claude Code, Continue, Markdown, YAML
├── .github/                        → skills/prompts duplicados para GitHub Copilot runtime
│   ├── prompts/                    → prompts OpenSpec para Copilot
│   └── skills/                     → skills duplicados (story-creation, finvest, story-split, openspec)
├── assets/logo/                    → assets visuales del proyecto
├── docs/                           → documentación y especificaciones generadas
│   ├── extreme-agile/              → documentación de metodología Extreme Agile
│   ├── project-spec-factory/       → documentos de ejemplo del pipeline (intent, plan, spec)
│   └── specs/                      → output de specs generadas por el sistema
├── gem/                            → versión para Google Gemini Gems
│   └── prompts/                    → prompts equivalentes para los 3 pasos del pipeline
├── openspec/                       → sistema de gestión de cambios spec-driven
│   ├── config.yaml                 → configuración OpenSpec (schema: spec-driven)
│   ├── changes/archive/            → historial de cambios aprobados y archivados
│   └── specs/                      → specs activas del sistema
└── rovo/                           → versión para Atlassian Rovo
    ├── story-creator-agent.md
    ├── story-evaluator-agent.md
    └── story-splitter-agent.md
```

---

## Key Dependencies

### Runtime Dependencies

No hay `package.json`, `requirements.txt`, `pyproject.toml`, `go.mod`, ni ningún manifest de dependencias de runtime convencional para la aplicación principal. `[DIRECT]`

El sistema no es una aplicación ejecutable — es un **framework de instrucciones** que corre dentro de agentes de IA. Sus "dependencias" son los runtimes de IA que lo ejecutan:

- **Claude Code** (Anthropic): runtime primario — lee `.claude/agents/` y `.claude/skills/` `[DIRECT]`
- **GitHub Copilot**: runtime secundario — lee `.github/skills/` y `.github/prompts/` `[DIRECT]`
- **Codex / Cursor / OpenCode**: runtime alternativo — lee `.agents/skills/` `[DIRECT]`
- **Google Gemini Gems**: runtime alternativo — consume prompts de `gem/prompts/` `[DIRECT]`
- **Atlassian Rovo**: runtime alternativo — consume agentes de `rovo/` `[DIRECT]`
- **OpenSpec**: sistema propio de spec-driven change management `[DIRECT]`
- **skill-creator** (anthropics/skills, hash: `57f470f5...`): skill externo instalado via `skills-lock.json` `[DIRECT]`

### Key Dev Tools

- **Docker + docker-compose**: entorno de desarrollo reproducible (`Dockerfile.dev`, `docker-compose.dev.yml`) — imagen `debian:bookworm-slim` con git, curl y bash `[DIRECT]`
- **VS Code Dev Container**: configurado con extensiones `anthropic.claude-code`, `Continue.continue`, `yzhang.markdown-all-in-one`, `davidanson.vscode-markdownlint`, `redhat.vscode-yaml` `[DIRECT]`
- **Python 3.x** (en `skill-creator/scripts/`): scripts de evaluación de skills (`run_eval.py`, `run_loop.py`, `aggregate_benchmark.py`, `generate_report.py`, `improve_description.py`, `package_skill.py`, `quick_validate.py`, `utils.py`) `[DIRECT]`
- **`claude -p`** CLI: invocado en los scripts Python para tests de triggering de skill descriptions `[INFERRED]` (a partir del código de `run_eval.py`)

---

## Integration Points

- **Database**: Ninguna. El sistema no persiste datos en base de datos — usa archivos `.md` como almacenamiento de estado `[DIRECT]`
- **Authentication**: Ninguna integración de autenticación detectada `[DIRECT]`
- **External APIs**:
  - Claude API (Anthropic) — invocada por los runtimes de Claude Code `[INFERRED]`
  - Google Gemini API — consumida por las Gems configuradas via `gem/` `[SUGGESTED]`
  - Atlassian Rovo API — consumida por los agentes en `rovo/` `[SUGGESTED]`
  - GitHub API — no directamente, pero `.github/` sugiere integración con GitHub Copilot `[INFERRED]`
- **Storage**: Sistema de archivos local (todos los outputs son archivos `.md` en `docs/specs/`) `[DIRECT]`
- **Messaging**: Ningún sistema de mensajería detectado `[DIRECT]`
- **Change Management**: OpenSpec — sistema propio de spec-driven change management con estructura `changes/archive/` y `.openspec.yaml` por cambio `[DIRECT]`

---

## Technical Constraints Inferred

- **Sin código ejecutable propio en runtime**: el sistema completo es declarativo — los agentes y skills son archivos Markdown con instrucciones en lenguaje natural. No hay servidor, no hay proceso daemon, no hay API propia `[DIRECT]`
- **Dependencia de runtime de IA**: el sistema no puede ejecutarse sin un agente de IA compatible (Claude Code, Copilot, etc.). La plataforma de ejecución es un requisito externo no gestionado por el proyecto `[INFERRED]`
- **WIP=1 como constraint de proceso**: el sistema impone un límite de trabajo en progreso de 1 documento por pipeline. Solo puede haber un proyecto activo en `Estado: Doing` a la vez `[DIRECT]`
- **Secuencialidad del pipeline ProjectSpecFactory**: el flujo `project-begin-intention → project-discovery → project-planning` es estrictamente secuencial con precondiciones de estado. No se puede saltar etapas `[DIRECT]`
- **Estado como control de flujo**: el campo `**Estado**: Doing | Ready` en los documentos Markdown actúa como mecanismo de control de flujo y lock distribuido `[DIRECT]`
- **Plataforma-agnóstico por diseño**: el mismo conjunto de skills/agentes está duplicado en `.claude/`, `.agents/`, `.github/` y `rovo/` para ser compatible con múltiples runtimes, generando overhead de mantenimiento de sincronización `[INFERRED]`
- **Sin testing automatizado del pipeline principal**: los scripts Python de evaluación solo existen en `skill-creator/`. El pipeline ProjectSpecFactory (begin-intention, discovery, planning) no tiene tests automatizados detectados `[INFERRED]`
- **Templates como contrato de interfaz**: los archivos en `*/templates/*.md` son el contrato entre skills y agentes. Un cambio en un template altera el comportamiento de todos los agentes que lo leen en runtime `[INFERRED]`
- **Entorno de dev requiere Docker**: el Dockerfile y devcontainer están configurados para un entorno Linux (debian:bookworm-slim). El repositorio está en Windows (d:\code\) pero el devcontainer corre en Linux `[DIRECT]`
- **`skills-lock.json` como mecanismo de versionado de dependencias externas**: similar a `package-lock.json` pero para skills. Solo `skill-creator` está bloqueado con hash, resto de skills son locales `[DIRECT]`

---

## Gaps & Unknowns

- **No se detectó mecanismo de sincronización entre plataformas**: los skills están duplicados en `.claude/`, `.agents/`, `.github/` y `rovo/` sin un script de sincronización visible. No queda claro si se mantienen manualmente o si existe algún proceso automatizado no detectado.
- **Scope de `openspec/specs/`**: el directorio existe pero estaba vacío o sin archivos detectables en el scan. No se pudo determinar qué specs activas hay versus las archivadas en `changes/archive/`.
- **Integración real con `claude -p`**: los scripts Python en `skill-creator/` invocan `claude -p` via subprocess, pero no se puede determinar desde análisis estático si esto funciona en el entorno de CI/CD del equipo.
- **Ausencia de `.gitignore`**: no se detectó archivo `.gitignore`. Potencialmente archivos temporales (`.tmp/`) o de estado local se commitean accidentalmente.
- **Modelo de autenticación con múltiples runtimes**: no hay documentación de cómo se configura la autenticación con Claude API, Gemini API o Rovo en distintos entornos de usuario.
- **Preguntas para revisor manual**:
  - ¿Existe un proceso de release/publish para distribuir actualizaciones del framework a usuarios?
  - ¿Cómo se gestiona la sincronización de skills entre los distintos directorios de plataforma (`.claude/`, `.agents/`, `.github/`, `rovo/`)?
  - ¿El directorio `openspec/specs/` contiene specs activas o fue vaciado intencionalmente?
  - ¿Hay planes de agregar testing automatizado al pipeline ProjectSpecFactory?
  - ¿La carpeta `docs/specs/stories/` se usa como directorio de output en usuarios reales o solo en ejemplos?
