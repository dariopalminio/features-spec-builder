# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added

- **Variable de entorno `SDDF_ROOT`** (FEAT-049) — todos los skills del pipeline (`project-begin`, `project-discovery`, `project-planning`, `releases-from-project-plan`, `release-generate-stories`, `release-generate-all-stories`, `reverse-engineering`) leen `SDDF_ROOT` para determinar la ruta base de artefactos (`SPECS_BASE`); si no está definida usa `docs` como fallback; si está definida pero la ruta no existe muestra advertencia y usa `docs`

### Changed

- **Restructura de `docs/specs/`** — migrado a la convención workitem-per-directory especificada en `docs/wiki/guides/organization-of-artifacts.md`: cada proyecto, release e historia ocupa su propio directorio con un archivo canónico (`project.md`, `release.md`, `story.md`); directorio `project/` (singular, flat) → `projects/PROJ-01-agile-sddf/`; 10 archivos flat de releases → `EPIC-NN-nombre/release.md`; 42 archivos flat de stories → `FEAT-NNN-nombre/story.md`; wikilinks y referencias `parent:` actualizados a los nuevos slugs

---

## [Unreleased] — Release 09: Docs & Wiki Builders

### Added
- **Skill `/docs-wiki-builder`** (FEAT-044) — reorganiza el directorio `docs/` como una wiki navegable con índice central `docs/index.md` y wikilinks internos `[[slug]]`; implementa el patrón LLM Wiki (Karpathy) donde el LLM lee `index.md` primero para obtener el mapa completo de la documentación antes de abrir nodos individuales, haciendo la recuperación O(índice) y no O(todos-los-archivos); detecta estado actual de `docs/` (sin existir, sin índice, con índice) y adapta el flujo; solicita confirmación antes de mover o renombrar archivos existentes; marca wikilinks rotos con indicador visual; soporta `--update` para regenerar solo el índice y `--dry-run` para simulación sin cambios
- **Skill `/header-aggregation`** (FEAT-040) — agrega un encabezado de tabla de contenido a un documento Markdown existente basado en sus títulos; detecta niveles de encabezado, genera anclas, construye tabla de contenido con formato adecuado y la inserta al inicio del documento; write guard que solicita confirmación antes de sobreescribir el documento original
- **Skill `/readme-builder`** (FEAT-042) — genera un `README.md` completo a partir de los artefactos SDDF disponibles (`project-intent.md`, `requirement-spec.md`, `project-plan.md`) usando un template como fuente de verdad estructural; descubrimiento de contenido en 3 tiers (specs formales → archivos de contexto LLM → ingeniería inversa); write guard que solicita confirmación antes de sobreescribir un README existente
- **Skill `/skill-creator`** (FEAT-048) — ciclo iterativo de creación y mejora de skills con captura de intención, redacción de SKILL.md, generación de casos de prueba, ejecución paralela (con skill vs sin skill), grading contra aserciones y viewer HTML de benchmarking; incluye scripts Python y agentes `analyzer`, `comparator`, `grader`

### Added

- **Wiki guides** — `docs/wiki/guides/` incorpora guías de buenas prácticas para agentes, skills y comandos; estrategia de branching SDDF Git Flow; modelo Flight Levels; eliminado `README-old.md` obsoleto
- **Runbook despliegue a npm** — `docs/runbooks/deployment-to-npm.md` con procedimiento paso a paso para publicar el paquete en npm

### Changed

- **`substatus` en lugar de `Estado`** — reemplazado el campo `**Estado:**` por `substatus` en todos los skills y agentes del pipeline para unificar el manejo del ciclo de vida de los documentos spec; afecta 17 archivos: skills `project-begin`, `project-discovery`, `project-planning`, `project-flow`, `project-story-mapping`, `release-generate-stories`, `release-generate-all-stories`, `releases-from-project-plan`, `reverse-engineering`, `story-creation`, `story-refine`, `story-split` y agentes `project-pm`, `project-architect`, `story-product-owner`; incluye actualización del template `release-spec-template.md`
- **Assets empaquetados por skill** (FEAT-048) — renombradas todas las carpetas `templates/` dentro de los skills a `assets/` para cumplir el estándar oficial de Agent Skills; actualizadas todas las referencias en `SKILL.md`, agentes y documentación; spec `skill-template-autonomy` actualizado con el nuevo contrato `assets/<file>.md`; eliminados prefijos de cliente hardcodeados en cadenas de fallback de SKILL.md
- **Skills multicliente con rutas relativas** (FEAT-047) — los skills `project-begin`, `project-discovery`, `project-planning`, `release-format-validation`, `release-generate-all-stories`, `release-generate-stories`, `releases-from-project-plan`, `reverse-engineering`, `story-creation`, `story-evaluation`, `story-split` actualizados para usar rutas relativas a su directorio base, eliminando dependencia de paths absolutos y haciendo los skills portables entre runtimes

---

## [1.5.6] — 2026-04-25

### Fixed

- `package.json` — corrección de campos de metadata del paquete npm

---

## [1.5.5] — 2026-04-25

### Changed

- Eliminada integración por comandos `opsx:*` en favor de invocación por skills
- Añadida entrada en `.gitignore` para excluir archivos generados de `openspec/`

---

## [1.5.4] — 2026-04-25 — npm Package & Local Install

### Added

- **Publicación como paquete npm** (FEAT-039) — `package.json` con metadata completa; `npm install -g agile-sddf` instala el framework globalmente con script `postinstall` que copia skills y agentes a `~/.claude/`
- **Instalación local** (FEAT-041) — `npm install agile-sddf` copia skills y agentes a `./.claude/` del proyecto actual sin afectar la instalación global; `scripts/postinstall.js` detecta automáticamente el tipo de instalación (global vs local)
- **Assets empaquetados por skill** — cada directorio de skill incluye su propio subdirectorio `assets/` para portabilidad multi-cliente; los templates y recursos se copian junto con el skill en la instalación

### Fixed

- `scripts/postinstall.js` — incluido el directorio de agentes en el paso de copia (resuelto en 3 iteraciones de fix)

---

## [1.4.0] — 2026-04-23 — Release & Story Generator + OpenSpec Utilities

### Added

- **Skill `/release-generate-stories`** (FEAT-029) — genera archivos `story-[ID]-[nombre-kebab].md` en `docs/specs/stories/` a partir de las features de un archivo de release; acepta nombre corto, nombre con extensión o ruta relativa como input; solicita confirmación antes de sobreescribir historias existentes
- **Skill `/release-generate-all-stories`** (FEAT-035) — procesa en modo batch todos los archivos `.md` de `docs/specs/releases/` en orden alfabético; detecta conflictos anticipadamente con confirmación global única (sobreescribir todo / saltar todos / decidir uno por uno); muestra resumen consolidado con contadores al finalizar
- **Skill `/openspec-init-config`** (FEAT-036) — carga el contexto del proyecto en `openspec/config.yaml` leyendo exhaustivamente `README.md`, `CLAUDE.md` y `AGENTS.md`; actualiza únicamente el campo `context:` preservando `schema:` y `rules:`; ejecutado sobre el propio proyecto SDDF para inicializar el contexto de OpenSpec
- **Skill `/openspec-generate-baseline`** (FEAT-037) — genera una línea base de especificaciones OpenSpec mediante ingeniería inversa del código fuente (`src/`, `README.md`, `AGENTS.md`); invoca `/opsx:propose baseline` con instrucción de reverse engineering y archiva el change directamente sin fase de apply; detecta conflictos si ya existe un change `baseline` (opción de sobreescribir o usar sufijo de fecha)

### Changed

- **Centralización de skills y agentes** — `.claude/` es ahora la fuente única de verdad para skills y agentes; `.agents/` y `.github/` apuntan via symlinks a `.claude/skills/` y `.claude/agents/`
- **Rovo agents actualizados** — agentes Rovo (`release-creator`, `release-validator`) alineados con las convenciones de naming y estructura actuales del proyecto

### OpenSpec

- Specs archivadas y promovidas a `openspec/specs/`:
  - `release-generate-stories/spec.md` — 7 requisitos
  - `release-generate-all-stories/spec.md` — 5 requisitos
  - `openspec-load-context/spec.md` — 3 requisitos (renombrado a `openspec-init-config`)
  - `openspec-generate-baseline/spec.md` — 4 requisitos

---

## [1.3.3] — 2026-04-18

### Changed
- Clarified automatic rejection rule in `story-evaluation` to explicitly scope `INVE-T` as all INVEST dimensions except `S` (Small)
- Strengthened `story-product-owner` guidance with stricter story-writing checks:
  - Added explicit guardrails for a real, concrete user role in `Como`
  - Added explicit clarity criteria for `Quiero`
  - Expanded refinement guidance to include `DIVIDIR` decisions and separate weak cohesion from pure size issues

### Added
- Archived OpenSpec change `add-skill-story-refine` under `openspec/changes/archive/2026-04-18-add-skill-story-refine/` with full proposal/design/spec/tasks artifacts
- Promoted capability spec to `openspec/specs/story-refine-skill/spec.md`

---

## [1.3.2] — 2026-04-18

### Added
- Skill `/project-flow` as a single entry-point orchestrator for the full ProjectSpecFactory pipeline (`project-begin` → `project-discovery` → `project-planning`) in one interactive session
- Review gates between phases to enforce explicit confirmation and transition each output document from `**Estado**: Doing` to `**Estado**: Ready`
- Startup state detection logic in `project-flow` to resume from the appropriate phase based on existing outputs in `docs/specs/project/`
- Main OpenSpec capability spec for `project-flow-skill` at `openspec/specs/project-flow-skill/spec.md`

---

## [1.3.1] — 2026-04-17

### Changed
- Renamed skill `finvest-evaluation` → `story-finvest-evaluation` for consistency with the `story-` prefix convention used by sibling skills (`story-creation`, `story-split`)
  - Renamed directories in `.claude/skills/`, `.agents/skills/`, `.github/skills/`
  - Updated `name:` and heading in all three copies of `SKILL.md`
  - Updated all references in `story-creation`, `story-split`, `rovo/` agents, and `README.md`

### Added
- **Restricciones de entrada** section in `story-finvest-evaluation/SKILL.md`: el skill ahora ignora adjuntos de imagen (wireframes, screenshots) y evalúa únicamente el texto Markdown de la historia de usuario

---

## [1.3.0] — 2026-04-17 — Reverse Engineering

### Added
- Skill `reverse-engineering` (invocation: `/reverse-engineering`)
- Reverse-engineering agents to follow `reverse-engineer-<rol>` convention:
  - `reverse-engineer-architect.agent.md`
  - `reverse-engineer-business-analyst.agent.md`
  - `reverse-engineer-ux-flow-mapper.agent.md`
  - `reverse-engineer-product-discovery.agent.md`
  - `reverse-engineer-synthesizer.agent.md`

---

## [1.2.1]

### Changed
- Renamed agent files to follow `project-` prefix convention:
  - `architect.agent.md` → `project-architect.agent.md` (`name: project-architect`)
  - `product-manager.agent.md` → `project-pm.agent.md` (`name: project-pm`)
  - `ux-designer.agent.md` → `project-ux.agent.md` (`name: project-ux`)
- Renamed skill directories and commands to follow `project-` prefix convention:
  - `/ps-begin-intention` → `/project-begin-intention`
  - `/ps-discovery` → `/project-discovery`
  - `/ps-planning` → `/project-planning`
- Updated all skill invocations, agent cross-references, specs, and documentation to reflect new names

---

## [1.2.0] — 2026-04-16 — ProjectSpecFactory CLI

### Added
- **ProjectSpecFactory CLI pipeline** — three-skill workflow for project specification:
  - `/ps-begin-intention` — captures project intent and produces `docs/specs/project/project-intent.md`
  - `/ps-discovery` — conducts user discovery and produces `docs/specs/project/requirement-spec.md`
  - `/ps-planning` — generates prioritized release backlog and produces `docs/specs/project/project-plan.md`
- **Role-based agents** — three specialized agents replacing task-based agents:
  - `architect.agent.md` — technical architect for Specifying and Planning phases
  - `product-manager.agent.md` — PM for Begin Intention and Discovery phases
  - `ux-designer.agent.md` — UX Designer supporting Discovery phase
- **Skill templates** — `project-intent-template.md`, `requirement-spec-template.md`, `project-plan-template.md`
- **Gem prompts** — standalone prompt files for `ps-begin-intention`, `ps-discovery`, `ps-planning`
- **OpenSpec workflow** — `opsx:propose`, `opsx:apply`, `opsx:archive`, `opsx:explore` skills and commands
- **OpenSpec specs** — baseline specifications for all pipeline capabilities
- **Sample output documents** — `project-intent.md`, `requirement-spec.md`, `project-plan.md` for ProjectSpecFactory itself

---

## [1.1.0] — 2026-04-09 — Features-spec-builder

### Added
- **`/story-creation`** — creates a user story in story-gherkin format (Como/Quiero/Para + Gherkin) applying Mike Cohn, 3 C's, and INVEST principles
- **`/story-split`** — splits a large story into smaller independent stories using 8 splitting patterns
- **`/finvest-evaluation`** — evaluates story quality with the FINVEST rubric (Formato + INVEST) on a Likert 1–5 scale; produces per-dimension scores, global score, and Ready / Refine / Reject decision
- **`story-gherkin-template.md`** — canonical template shared across story skills
- **`output-template.md`** — evaluation output template for finvest-evaluation
- **Examples** — `example-ready.md`, `example-refinar.md`, `example-rechazar.md` for finvest-evaluation
- **Dockerization** — Docker support for local development
- **`CLAUDE.md`** — global project instructions
- **`skills-lock.json`** — skill dependency lock file
