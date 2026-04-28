![agile-sddf](assets/logo/agile-sddf-logo-v1.png)
# Agile SDDF — Spec-Driven Development Framework

Sistema multiagente minimalista que automatiza el ciclo completo de especificación de proyectos software usando solo archivos Markdown como agentes, skills y templates.

[![npm version](https://img.shields.io/npm/v/agile-sddf.svg)](https://npmjs.com/package/agile-sddf)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Los developers y equipos que trabajan con IA para desarrollar software carecen de un proceso estructurado y reproducible para transformar ideas en especificaciones de calidad. Agile SDDF resuelve esto con un workflow ágil y secuencial que cubre desde la intención inicial hasta el backlog planificado de historias de usuario, con control de WIP, gates de revisión humana y trazabilidad completa en cada etapa. A diferencia de los prompts ad-hoc o frameworks rígidos, el sistema extrae dinámicamente la estructura de los templates en runtime para generar preguntas y comportamientos contextuales, y opera sin modificar código subyacente en múltiples runtimes de IA (Claude Code, GitHub Copilot, OpenCode, Google Gemini, Atlassian Rovo).

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
- **Meta-framework**: crea, benchmarkea y distribuye nuevas skills con ciclo iterativo (skill-builder)
- **Trazabilidad completa**: IDs únicos FEAT-NNN y Estado: Doing/Ready en cada documento del pipeline
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

### Basic Usage

**Crear y refinar una historia de usuario:**

```bash
# Ciclo completo: creación → evaluación FINVEST → split → mejora
/story-refine

# Solo crear una historia
/story-creation "Como usuario quiero poder registrarme para acceder al sistema"

# Evaluar una historia existente
/story-evaluation docs/specs/stories/story-mi-historia.md

# Dividir una historia grande
/story-split docs/specs/stories/story-mi-historia.md
```

**Generar artefactos de release:**

```bash
# Genera todos los archivos release desde project-plan.md
/releases-from-project-plan

# Genera las historias de usuario de un release específico
/release-generate-stories docs/specs/releases/release-01-features-spec-builder.md

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
/skill-builder
```

## Configuration

El framework es declarativo y no requiere configuración de variables de entorno. Toda la lógica de flujo se controla mediante el campo `**Estado**` en los documentos Markdown del pipeline.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| — | — | El sistema no requiere variables de entorno propias |

El runtime de IA (Claude Code, GitHub Copilot, etc.) gestiona su propia autenticación de forma independiente al framework.

### Estado de documentos

El único mecanismo de control de flujo es el campo `**Estado**` en cada documento:

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

El framework no tiene suite de tests automatizados para el pipeline principal. La calidad de los skills se valida con el meta-skill `skill-builder` mediante ejecución paralela (con skill vs sin skill) y un viewer HTML de benchmarking:

```bash
/skill-builder
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
