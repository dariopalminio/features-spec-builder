---
description: >-
  Jeff Patton's User Story Mapping technique for Agile discovery. Visualizes user journey as a map, identifies backbone activities, walking skeleton, and release slices. Use when organizing requirements into deliverable increments or defining MVP scope.
alwaysApply: false
name: project-story-mapping
---

Eres el **orquestador del flujo de User Story Mapping** para el pipeline SDDF. Tu tarea es preparar el contexto del proyecto y delegar la sesión completa de mapeo al agente especializado `project-story-mapper`.

## Cuándo usar esta skill

**Keywords:** story map, user story map, backbone, walking skeleton, MVP, release planning, user journey, story slicing, Jeff Patton, Agile discovery, mapa de historias, planificación de releases

**Usa esta skill cuando:**

- El usuario quiere organizar requisitos en incrementos entregables
- Se necesita definir el alcance del MVP desde un conjunto grande de requisitos
- Se quiere visualizar el journey del usuario a través de las funcionalidades
- Se planifican releases con valor claro para el usuario
- Se están dividiendo grandes épicas en historias entregables
- Se necesita comunicar la visión del producto a stakeholders

---

## Paso 0 — Determinar ruta base (`SPECS_BASE`)

Antes de cualquier operación con archivos, determinar el directorio raíz de especificaciones:

1. Leer la variable de entorno `SDDF_ROOT`.
2. Si `SDDF_ROOT` está definida y la ruta existe: usar ese valor como `SPECS_BASE`.
3. Si `SDDF_ROOT` no está definida: usar `SPECS_BASE=docs`.
4. Si `SDDF_ROOT` está definida pero la ruta no existe: mostrar `⚠️ La ruta definida en SDDF_ROOT no existe. Se usará el valor por defecto: docs` y usar `SPECS_BASE=docs`.

Usar `$SPECS_BASE` en lugar de `docs` para todas las rutas de artefactos en los pasos siguientes.

---

## Paso 0b — Resolver directorio del proyecto activo (`PROJ_DIR`)

1. Listar todos los subdirectorios de `$SPECS_BASE/specs/projects/`.
2. Para cada subdirectorio, leer `project-intent.md` y verificar si `substatus` es `READY`.
3. Si se encuentra exactamente uno con `substatus: READY` → usar ese directorio como `$PROJ_DIR`.
4. Si se encuentran varios → mostrar la lista y pedir al usuario que elija antes de continuar.
5. Si no se encuentra ninguno → proceder sin contexto de proyecto (el agente recopilará la información interactivamente).

La ruta completa del proyecto activo es: `$SPECS_BASE/specs/projects/$PROJ_DIR/`

---

## Paso 1 — Leer documentos del proyecto

Antes de invocar al agente, lee los siguientes archivos si existen:

1. `$SPECS_BASE/specs/projects/$PROJ_DIR/project-intent.md`
2. `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md`

Si existen, extrae y resume:
- Nombre del proyecto
- Problema que resuelve
- Usuarios/personas identificadas
- Funcionalidades clave

Este resumen será el contexto inicial que pasarás al agente.

---

## Paso 2 — Invocar al agente project-story-mapper

Delega la sesión completa al agente `project-story-mapper` con el siguiente briefing:

> Inicia una sesión de User Story Mapping para el proyecto [nombre del proyecto si se conoce].
> [Si hay documentos disponibles]: He leído los documentos del proyecto. El contexto es: [resumen].
> [Si no hay documentos]: No hay documentos de proyecto disponibles aún; recopila el contexto interactivamente.
> Produce el documento completo en `$SPECS_BASE/specs/projects/$PROJ_DIR/story-map.md`.

El agente conduce toda la sesión de forma interactiva con el usuario y escribe el documento de salida.

---

## Integración con el pipeline SDDF

Esta skill se ubica después de las fases de discovery del proyecto:

```
project-begin → project-discovery → [user-story-mapping] → project-planning
```

Los documentos producidos por fases anteriores alimentan automáticamente el mapa de historias cuando existen.

**Output:** `$SPECS_BASE/specs/projects/$PROJ_DIR/story-map.md`

---

## Paso 3 — Añadir frontmatter al documento generado

Una vez que el agente `project-story-mapper` haya escrito `$SPECS_BASE/specs/projects/$PROJ_DIR/story-map.md`, antepón o completa si existe el siguiente bloque YAML al inicio del archivo (antes de cualquier otro contenido):

```yaml
---
type: spec
slug: < nombre-del-directorio-del-proyecto-story-map | story-map si es el primer documento >
title: "[primer # heading del documento generado]"
date: [YYYY-MM-DD]
status: BACKLOG
substatus: DOING
parent: null
---
```

Reglas de derivación:
- `title`: extrae el primer `#` heading del documento
- `date`: fecha actual en formato YYYY-MM-DD
- `substatus`: `substatus: DOING` → DOING; `substatus: READY` → READY; ausente → N/A
