## Why

Los skills del flujo SDD generan artefactos pero no actualizan el estado de la historia en `story.md`, dejando el frontmatter (`status`/`substatus`) siempre estático y sin reflejo del progreso real. Esto impide detectar en qué etapa se encuentra una historia, fuerza al desarrollador a inferirlo manualmente revisando qué archivos existen, y no permite que los skills apliquen precondiciones basadas en estado.

## What Changes

- **`story-creation` / `story-refine`**: Actualiza `status: SPECIFYING / substatus: IN‑PROGRESS` al iniciar y `status: SPECIFIED / substatus: DONE` al finalizar la especificación.
- **`story-plan`**: Actualiza `status: PLANNING / substatus: IN‑PROGRESS` al comenzar el pipeline de planning.
- **`story-analyze`**: Actualiza `status: PLANNED / substatus: DONE` al concluir el análisis de coherencia (último paso del pipeline de planning).
- **`story-implement`**: Agrega precondición — solo puede ejecutarse si `status: PLANNED` y `substatus: DONE`. Actualiza `status: IMPLEMENTING / substatus: IN‑PROGRESS` al iniciar y `status: IMPLEMENTED / substatus: DONE` al finalizar.
- **Release checklist**: Al alcanzar `IMPLEMENTED / DONE`, el skill actualiza `- [ ]` → `- [x]` en el `release.md` padre para la historia correspondiente.
- **Máquina de estados**: El ciclo completo queda definido formalmente como: `SPECIFYING/IN‑PROGRESS → SPECIFIED/DONE → PLANNING/IN‑PROGRESS → PLANNED/DONE → IMPLEMENTING/IN‑PROGRESS → IMPLEMENTED/DONE`.

## Capabilities

### New Capabilities

- `story-lifecycle-states`: Define la máquina de estados del ciclo de vida de una historia SDD: estados válidos, transiciones permitidas, reglas de precondición por skill y convención de actualización del frontmatter. Es la fuente de verdad para todos los skills que leen o escriben `status`/`substatus`.

### Modified Capabilities

- `story-refine-skill`: Agrega transiciones de estado al inicio (`SPECIFYING/IN‑PROGRESS`) y al finalizar (`SPECIFIED/DONE`).
- `story-plan-skill`: Agrega transición de estado al inicio del pipeline (`PLANNING/IN‑PROGRESS`). Delega la transición de cierre (`PLANNED/DONE`) a `story-analyze`.
- `story-analyze-skill`: Agrega actualización de estado al finalizar (`PLANNED/DONE`).
- `story-implement-skill`: Agrega precondición de estado (`PLANNED/DONE` requerido), transición al inicio (`IMPLEMENTING/IN‑PROGRESS`), transición al finalizar (`IMPLEMENTED/DONE`) y actualización del checklist en `release.md`.
- `story-workflow-mvp`: Actualiza el workflow canónico para reflejar los estados visibles entre cada skill.

## Impact

- **Artefactos modificados en runtime**: `story.md` (frontmatter `status`/`substatus`) y, al completar la implementación, `release.md` del release padre.
- **Sin cambios en templates**: Los templates de `story.md` y `release.md` ya incluyen campos `status` y `substatus` — solo se escribe en campos existentes.
- **Backwards compatibility**: Historias sin `status` en frontmatter se tratan como `BACKLOG/TODO` (comportamiento actual implícito); los skills añaden el campo al actualizarlo por primera vez.
- **Skills NO afectados** (no tienen transiciones de estado propias): `story-design`, `story-tasking`, `story-split`, `story-evaluation` — sus transiciones son gestionadas por sus orquestadores (`story-refine` y `story-plan`).
