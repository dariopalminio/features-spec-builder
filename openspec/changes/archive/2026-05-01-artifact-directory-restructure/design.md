## Context

El framework SDDF almacena actualmente los artefactos de especificación como archivos planos en tres carpetas compartidas:

```
docs/specs/projects/     → project-intent.md, requirement-spec.md, project-plan.md, story-map.md
docs/specs/releases/    → release-01-nombre.md, release-02-nombre.md ...
docs/specs/stories/     → story-FEAT-001-nombre.md, story-FEAT-002-nombre.md ...
```

Esta estructura no escala a múltiples proyectos simultáneos, no permite agrupar artefactos relacionados de un mismo workitem y dificulta la navegación tanto humana como de IAs. La guía `docs/wiki/guides/organization-of-artifacts.md` ya establece la nueva convención; este cambio la implementa en todos los skills productores.

## Goals / Non-Goals

**Goals:**
- Implementar la convención de un directorio por workitem en todos los skills que crean artefactos.
- Unificar los nombres canónicos de archivo principal: `project.md`, `release.md`, `story.md`.
- Actualizar las rutas de lectura y búsqueda en todos los skills consumidores.
- Documentar la convención de IDs (`PROJ-`, `EPIC-`, `FEAT-`) como fuente de nombres de directorio.

**Non-Goals:**
- Migración automática de artefactos existentes (fuera de scope; se tratará en un cambio separado).
- Cambios en la lógica de negocio de los skills más allá de las rutas.
- Soporte de múltiples proyectos activos simultáneos (WIP=1 se mantiene).
- Integración con sistemas externos (Jira, GitHub Projects).

## Decisions

### Decisión 1: Un directorio por workitem (no archivos planos)

**Elegido:** `$SPECS_BASE/specs/projects/PROJ-01-nombre/project.md`
**Alternativa descartada:** `$SPECS_BASE/specs/projects/project-intent-PROJ-01.md` (archivo plano con prefijo de ID)

**Razón:** El directorio por workitem permite agrupar todos los artefactos secundarios (`project-intent.md`, `project-plan.md`, `story-map.md`) junto al artefacto principal sin ambigüedad. Es el patrón establecido en la guía y compatible con la convención de OpenSpec.

---

### Decisión 2: El ID se deriva del nombre del proyecto en el momento de creación

**Elegido:** El skill `project-begin` solicita (o infiere del título) el ID del proyecto y lo usa como nombre del directorio: `PROJ-NN-nombre-kebab/`.

**Alternativa descartada:** Leer el ID desde un índice central (`$SPECS_BASE/specs/index.md`).

**Razón:** Un índice central introduce una dependencia de estado compartido que rompe el modelo de operación actual (un archivo → un skill). Derivar el ID en el momento de creación es más simple e independiente.

---

### Decisión 3: Archivo principal con nombre canónico por tipo

**Elegido:** `project.md`, `release.md`, `story.md` como nombres canónicos dentro de cada directorio.

**Alternativa descartada:** Conservar el nombre descriptivo (`project-intent.md` como archivo principal del proyecto).

**Razón:** Los skills consumidores pueden encontrar el artefacto principal de cualquier workitem buscando el nombre canónico dentro del directorio, sin necesidad de conocer el nombre descriptivo específico. Facilita la navegación de IAs.

---

### Decisión 4: `projects/` en plural (no `project/`)

**Elegido:** `$SPECS_BASE/specs/projects/` (plural)

**Razón:** Consistencia con las carpetas ya existentes `releases/` y `stories/` (plural). La carpeta actual `project/` (singular) era un legado del diseño de un único proyecto activo; el nuevo nombre refleja mejor la estructura multi-proyecto.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| **Breaking change total** — artefactos existentes en `$SPECS_BASE/specs/projects/` dejan de ser encontrados por los skills. | Documentar claramente que es un cambio disruptivo. Proporcionar guía de migración manual. Contemplar un skill de migración en un cambio futuro. |
| **Skills no actualizados** — un skill consumidor que no actualice sus rutas fallará silenciosamente o leerá desde la ruta antigua. | El change incluye delta specs para todos los skills afectados, garantizando cobertura. |
| **Asignación de ID en project-begin** — si el usuario no proporciona un ID explícito, el skill debe inferirlo del título, lo que puede generar IDs inconsistentes. | El skill propone el ID derivado del título (kebab-case) y solicita confirmación antes de crear el directorio. |
| **Compatibilidad con SDDF_ROOT** — la nueva estructura de directorios debe funcionar tanto con `docs` (por defecto) como con rutas personalizadas via `SDDF_ROOT`. | Las rutas se construyen siempre como `$SPECS_BASE/specs/projects/...`, no como rutas absolutas. |
