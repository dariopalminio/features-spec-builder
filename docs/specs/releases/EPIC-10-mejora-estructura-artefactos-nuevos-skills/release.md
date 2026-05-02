---
alwaysApply: false
type: spec
slug: EPIC-10-mejora-estructura-artefactos-nuevos-skills
title: "Mejora en estructura de artefactos y nuevos skills"
date: 2026-05-01
status: BACKLOG
substatus: DOING
parent: null
---

# Release/Epic: Mejora en estructura de artefactos y nuevos skills

## Descripción <!-- sección obligatoria-->
Se mejora la estructura de artefactos de especificaciones permitiendo seguir un estándar y se agregan skills necesarios para releases y diagramado de contexto.

## Features <!-- sección obligatoria-->
- [ ] FEAT-049 - **Agregar configuración de directorio raíz de specs:** Soporte para variable SDDF_ROOT como ruta base configurable haciendo que los skills lean la variable de entorno y usen `$SPECS_BASE` en lugar de hardcodear `docs` para todas las rutas de artefactos.
- [ ] FEAT-050 - **Mejorar la estructura de artefactos de especificaciones:** Mejora estructural que permite seguir un estándar, haciendo que cada workitem (proyecto, release, historia) se almacene en su propio subdirectorio identificado bajo `projects/`, `releases/` o `stories/`, agrupando todos los artefactos de un mismo workitem en un único lugar y facilitando la navegación cuando hay múltiples proyectos simultáneos (estilo como lo hace openspec y speckit).
- [ ] FEAT-051 - **Crear nuevo skill de creación de release:** Skill interactivo para crear releases guiados por el usuario.
- [ ] FEAT-052 - **Crear nuevo skill de diagramado de contexto:** Skill para generar diagramas de contexto del proyecto tio c4 a partir de preguntas al usuario sobre los sistemas involucrados y sus relaciones o a partir del documento de especificaciones de proyecto.

