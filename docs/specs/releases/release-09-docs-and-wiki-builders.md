
---
alwaysApply: false
---
**Título**: Docs and Wiki builders
**Versión**: 1.0
**Estado**: Doing
**Fecha**: 2026-04-25
---

# Release 08 — Docs and Wiki builders
## Descripción
Skills para generar documentación del proyecto (README.md) y organizar la wiki de documentación del proyecto dentro del directorio `docs/`, con un enfoque en la generación automática de documentación a partir de los artefactos de desarrollo (intención, requisitos, plan) y la organización de la información en una estructura tipo wiki para facilitar el acceso y la navegación. Esto permitirá a los desarrolladores mantener una documentación actualizada y bien organizada, mejorando la comunicación y la colaboración dentro del equipo de una manera AI-Frendly.

## Features

- [ ] **FEAT-042: README.md builder** — Skill `readme-builder` que genera o sobreescribe un README.md completo para el proyecto a partir de los documentos de intención, requisitos, plan o analizando todo el proyecto actual, usando un template específico para README. _(deps: FEAT-001, FEAT-003, FEAT-004)_
- [ ] **FEAT-043: Encabezado de archivos spec con metadata de estado** — Añadir un encabezado YAML a cada archivo de especificación (`project-intent.md`, `requirement-spec.md`, `project-plan.md`, `release*`, `story*`) con campos específicos estandarizados para trazabilidad y linkeo entre nodos. _(deps: FEAT-008)_
- [ ] **FEAT-044: Directorio docs tipo wiki** — Reorganizar el directorio `docs/` para que funcione como una wiki de documentación del proyecto (memoria a largo plazo del proyecto), con subdirectorio specs (memoria de especificaciones) para los artefactos principales de desarrollo, un directorio wiki/ para información de conocimiento profundo (guías, artículos, etc.) y un índice principal que enlace a cada documento. La fuente de verdad son archivos dentro del mismo repositorio. Cada nodo documento es un archivo markdown con frontmatter YAML. Los links internos usan la sintaxis [[slug]] (wikilinks). El índice (index.md) es el cursor principal: Los clientes LLMs IA como Copilot, Claude u Opencode lo leen primero en cada operación para decidir qué nodos abrir, sin leer toda la wiki de una vez. La clave está en que Claude lee el índice primero en cada operación, haciendo que la recuperación sea O(índice) y no O(todos-los-archivos). Se sigue el patrón LLM Wiki - Karpathy. _(deps: FEAT-001, FEAT-003, FEAT-004)_