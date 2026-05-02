![agile-sddf](assets/logo/agile-sddf-logo-v1.png)
# Agile SDDF — Spec-Driven Development Framework

Sistema multiagente minimalista que automatiza el ciclo completo de especificación de proyectos software usando solo archivos Markdown como agentes, skills y templates.

[![npm version](https://img.shields.io/npm/v/agile-sddf.svg)](https://npmjs.com/package/agile-sddf)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Los developers y equipos que trabajan con IA para desarrollar software carecen de un proceso estructurado y reproducible para transformar ideas en especificaciones de calidad. Agile SDDF resuelve esto con un workflow ágil y secuencial que cubre desde la intención inicial hasta el backlog planificado de historias de usuario, con control de WIP, gates de revisión humana y trazabilidad completa en cada etapa. A diferencia de los prompts ad-hoc o frameworks rígidos, el sistema extrae dinámicamente la estructura de los templates en runtime para generar preguntas y comportamientos contextuales, y opera sin modificar código subyacente en múltiples runtimes de IA (Claude Code, GitHub Copilot, OpenCode, Google Gemini, Atlassian Rovo).

![agile-sddf](assets\diagrams\context-diagram.png)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Ingeniería inversa de repositorios**: genera `requirement-spec.md` automáticamente desde código existente mediante análisis paralelo de 4 agentes especializados
- **Pipeline ProjectSpecFactory**: workflow secuencial Begin Intention → Discovery → Planning con gates de revisión humana entre cada fase
- **Control WIP=1**: impide proyectos activos simultáneos, ofreciendo exactamente las opciones Sobrescribir o Retomar
- **User Story Mapping**: sesión colaborativa al estilo Jeff Patton para construir backbone, walking skeleton y release slices
- **Gestión de épicas de releases**: planificación de releases con `project-plan.md` y generación automática de artefactos de release (feature specs, historias de usuario) con trazabilidad completa
- **Gestión de historias de usuario**: creación (Como/Quiero/Para + Gherkin), evaluación con rúbrica FINVEST (Likert 1–5), splitting con 8 patrones y refinamiento iterativo
- **Integración OpenSpec**: exploración, propuesta, implementación y archivado de cambios con trazabilidad completa
- **Multi-runtime**: los mismos skills operan en Claude Code, GitHub Copilot, Codex/Cursor/OpenCode, Google Gemini Gems y Atlassian Rovo sin modificar el SKILL.md fuente
- **Meta-framework**: crea, benchmarkea y distribuye nuevas skills con ciclo iterativo (skill-creator)
- **Trazabilidad completa**: IDs únicos FEAT-NNN y manejo de sub-estados Doing/Ready en cada documento del pipeline
- **Docs as Wiki**: skill docs-wiki-builder para generar documentación de proyecto en formato wiki navegable. Incluye un skill header-aggregation para generar encabezados frontmatter de archivo '.md'. Permite navegación bidireccional entre documentos, generación de índices automáticos y visualización de grafos con "Foam for VSCode".

## Installation

### Global — disponible en todos tus proyectos

```bash
npm install -g agile-sddf
```

Después de la instalación, el script `postinstall` copia automáticamente los skills y agentes a `~/.claude/` para que estén disponibles en Claude Code de forma global.

### Local — solo para el proyecto actual

```bash
npm install agile-sddf
```

Los skills y agentes se copian a `./.claude/` del directorio actual.

### Prerequisites

- Node.js >= 18
- Claude Code (Anthropic) u otro runtime compatible (GitHub Copilot, OpenCode, Google Gemini Gems, Atlassian Rovo)
- Foam for VSCode (opcional, recomendado para navegación de docs como wiki)

## Quick Start

Inicia el pipeline completo de especificación en una sola sesión desde Claude Code:

```bash
# Ejecuta las tres fases del pipeline en una sesión continua
/project-flow
```

O ejecuta cada fase individualmente:

```bash
# Fase 1 — Captura la intención del proyecto
/project-begin

# Fase 2 — Discovery de usuarios y especificación de requisitos
/project-discovery

# Fase 3 — Planificación de releases y backlog de features
/project-planning
```

## Usage

### Flujos principales SDDF

SDDF se organiza en 4 niveles principales que cubren todo el ciclo de vida de la especificación, desde la intención inicial (nivel de proyecto o L3), la especificación de entregas releases (L2), la especificaciòn de historias (L1), y con integración opcional de OpenSpec para gestión de cambios (L0). Cada nivel tiene su pipeline y se compone de un conjunto de skills que operan sobre documentos Markdown con control de sub-estado `Doing`/`Ready` para garantizar un flujo estructurado, reproducible y automatizable.

#### 1. L3: Pipeline de especificación de proyecto (iniciativa)

project-begin → project-discovery → project-planning

project-flow orquesta los 3 pasos en una sola sesión con gates de revisión entre etapas.

#### 2. L2: Pipeline de generación de releases e historias

releases-from-project-plan

#### 3. L1: Pipeline de generación y refinamiento de historias

release-generate-stories →

story-creation → story-evaluation → story-split

#### 4. L0: Pipeline granular SDD integración con OpenSpec

openspec-init-config → openspec-generate-baseline → 

( propose → apply → archive )

### Estructura de artefactos

Los artefactos de especificación se organizan en directorios por workitem bajo `{SDDF_ROOT}/specs/`:

```
docs/specs/
├── projects/
│   └── PROJ-01-nombre-proyecto/    # un directorio por proyecto
│       ├── project-intent.md
│       ├── requirement-spec.md
│       ├── project-plan.md
│       └── story-map.md
├── releases/
│   └── EPIC-01-nombre-release/     # un directorio por release
│       └── release.md
└── stories/
    └── FEAT-001-nombre-historia/   # un directorio por historia
        └── story.md
```

Cada archivo principal usa un nombre canónico (`project-intent.md`, `release.md`, `story.md`) e incluye frontmatter con `type`, `id`, `title`, `status`, `parent`, `created` y `updated`. Las relaciones jerárquicas se expresan mediante el campo `parent` (ej. una release tiene `parent: PROJ-01`).

### Basic Usage

**Crear y refinar una historia de usuario:**

```bash
# Ciclo completo: creación → evaluación FINVEST → split → mejora
/story-refine

# Solo crear una historia
/story-creation "Como usuario quiero poder registrarme para acceder al sistema"

# Evaluar una historia existente
/story-evaluation docs/specs/stories/FEAT-001-nombre/story.md

# Dividir una historia grande
/story-split docs/specs/stories/FEAT-001-nombre/story.md
```

**Generar artefactos de release:**

```bash
# Genera todos los directorios de release desde project-plan.md
/releases-from-project-plan

# Genera las historias de usuario de un release específico
/release-generate-stories EPIC-01-features-spec-builder

# Genera las historias de todos los releases
/release-generate-all-stories
```

### Advanced Usage

**Ingeniería inversa de un repositorio existente:**

```bash
# Genera requirement-spec.md desde el código fuente
/reverse-engineering

# Analiza solo un subdirectorio
/reverse-engineering --focus src/auth

# Actualiza solo las secciones pendientes de un spec existente
/reverse-engineering --update
```

**Gestión de cambios con OpenSpec:**

```bash
# Explorar una idea sin implementar
/openspec-explore

# Proponer un cambio con todos los artefactos generados
/openspec-propose "agregar soporte para exportar historias a CSV"

# Implementar las tareas de un cambio
/openspec-apply-change

# Archivar un cambio completado
/openspec-archive-change
```

**Crear una nueva skill:**

```bash
# Ciclo iterativo de creación y benchmarking
/skill-creator
```

## Configuration

El framework es declarativo y su flujo se controla mediante el campo `substatus` en los documentos Markdown del pipeline.

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SDDF_ROOT` | No | `docs` | Directorio raíz donde los skills leen y escriben artefactos (`specs/projects/`, `specs/releases/`, `specs/stories/`) |

El runtime de IA (Claude Code, GitHub Copilot, etc.) gestiona su propia autenticación de forma independiente al framework.

### SDDF_ROOT

`SDDF_ROOT` define el directorio raíz donde todos los skills del framework buscan y crean artefactos. Permite alojar la carpeta de especificaciones en cualquier ubicación del repositorio sin modificar los skills.

```bash
# Usar un directorio personalizado
export SDDF_ROOT=".sdd"

# Usar el valor por defecto (docs/) — equivale a no definirla
export SDDF_ROOT="docs"
```

**Comportamiento:**
- Si `SDDF_ROOT` está definida y la ruta existe → los skills usan esa ruta como raíz.
- Si `SDDF_ROOT` no está definida → los skills usan `docs` (retrocompatible con versiones anteriores).
- Si `SDDF_ROOT` apunta a una ruta inexistente → los skills emiten una advertencia y vuelven a `docs`:
  ```
  ⚠️ La ruta definida en SDDF_ROOT no existe. Se usará el valor por defecto: docs
  ```

> **Nota sobre rutas con espacios:** si el valor de `SDDF_ROOT` contiene espacios, enciérralo entre comillas al exportarlo: `export SDDF_ROOT="mi carpeta/specs"`.

### Estado de documentos

El único mecanismo de control de flujo es el campo `substatus` en cada documento:

| Valor | Significado |
|-------|-------------|
| `Doing` | Documento en progreso — el pipeline puede retomarlo |
| `Ready` | Documento completo — actúa como precondición para la siguiente fase |

## Contributing

1. Fork del repositorio
2. Crea tu rama de feature (`git checkout -b feature/nueva-skill`)
3. Haz commit de tus cambios (`git commit -m 'feat: agrega skill X'`)
4. Push a la rama (`git push origin feature/nueva-skill`)
5. Abre un Pull Request

### Development Setup

```bash
git clone https://github.com/dariopalminio/agile-sddf.git
cd agile-sddf
npm install
```

**Con Docker (entorno reproducible):**

```bash
docker-compose -f docker-compose.dev.yml up
```

El contenedor usa imagen `debian:bookworm-slim` con git, curl y bash.

### Running Tests

El framework no tiene suite de tests automatizados para el pipeline principal. La calidad de los skills se valida con el meta-skill `skill-creator` mediante ejecución paralela (con skill vs sin skill) y un viewer HTML de benchmarking:

```bash
/skill-creator
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
