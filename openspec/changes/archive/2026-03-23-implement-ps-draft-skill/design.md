## Context

El skill `/ps-draft` existe como stub pero no tiene implementación real. El estado Draft es el segundo paso del pipeline: toma `docs/specs/initial-prompt.md` (output del Funnel) y produce `docs/specs/project-intent.md` con una intención de proyecto más refinada, usando un template estructurado y una entrevista guiada. El agente que realiza este trabajo es un **Draft Agent** (PM especializado en refinar intención), separado del `pm-agent` de Funnel.

## Goals / Non-Goals

**Goals:**
- Reescribir `/ps-draft` con orquestación completa: validar inputs, delegar a agente, confirmar output
- Crear `draft-agent` con prompt especializado para la fase Draft
- Crear template autónomo dentro del skill (`templates/project-intent-template.md`)
- Implementar la validación de estado de `initial-prompt.md` con opción de confirmación del usuario

**Non-Goals:**
- No modifica el Funnel ni Discovery
- No agrega lógica WIP=1

## Decisions

### D1: Agente separado para Draft (`draft-agent`) en lugar de reutilizar `pm-agent`

**Decisión**: Crear un nuevo agente `draft-agent` con prompt específico para la fase Draft.

**Rationale**: `pm-agent` está diseñado para hacer una entrevista desde cero (sin contexto previo). `draft-agent` tiene un rol diferente: lee un documento existente (`initial-prompt.md`), extrae su contenido, y conduce una entrevista de refinamiento para producir un documento más elaborado (`project-intent.md`). Mezclar ambas responsabilidades en un solo agente lo haría demasiado complejo y difícil de mantener.

---

### D2: Validación de `**Estado**` en `initial-prompt.md` dentro del agente

**Decisión**: El `draft-agent` es responsable de leer `initial-prompt.md`, verificar el campo `**Estado**`, y si está `Doing`, preguntar al usuario si confirma avanzar. Si confirma, el agente actualiza el campo a `Ready` usando la herramienta `Edit` antes de continuar.

**Rationale**: El agente tiene acceso a `AskUserQuestion` y a las herramientas de edición. Centralizar esta lógica en el agente (y no en el skill orchestrator) permite que la conversación con el usuario sea fluida y contextual.

**Alternativa descartada**: Hacer la validación en el SKILL.md antes de invocar el agente — requeriría que el skill tenga lógica de parsing del documento, lo cual rompe la separación de responsabilidades.

---

### D3: Template autónomo en `.claude/skills/ps-draft/templates/`

**Decisión**: El template `project-intent-template.md` vive en `.claude/skills/ps-draft/templates/` y no referencia `docs/templates/`. El skill es autónomo.

**Rationale**: Consistente con el principio de autonomía de skills establecido en el Funnel. Cada skill lleva sus propios recursos. `docs/templates/` es solo una referencia de diseño, no una dependencia en runtime.

---

### D4: El agente enriquece el output con pericia de PM

**Decisión**: El `draft-agent` no transcribe mecánicamente el `initial-prompt.md` — lo usa como contexto base y hace preguntas adicionales para completar secciones del `project-intent-template.md` que requieren más detalle (Vision pitch, Non-Goals, refinamiento de Success Criteria). El contenido inferido se marca con `[inferido]`.

**Rationale**: El objetivo del estado Draft es producir un documento de intención más refinado que el initial-prompt. Si el agente solo copiara datos, no aportaría valor.

## Risks / Trade-offs

- **[Riesgo] El usuario rechaza avanzar cuando Estado=Doing** → El agente detiene el proceso y le recuerda completar el Funnel con `/ps-funnel`
- **[Riesgo] `initial-prompt.md` no existe** → El skill lo verifica antes de invocar al agente y detiene la ejecución con mensaje claro
- **[Trade-off] El agente puede inferir contenido incorrecto** → Aceptado; el contenido `[inferido]` es explícito y el usuario puede corregirlo antes de avanzar a Discovery

## Migration Plan

1. Crear `.claude/skills/ps-draft/templates/project-intent-template.md`
2. Crear `.claude/agents/draft-agent.md`
3. Reescribir `.claude/skills/ps-draft/SKILL.md`

Rollback: restaurar el stub original de `SKILL.md` y eliminar los archivos nuevos.
