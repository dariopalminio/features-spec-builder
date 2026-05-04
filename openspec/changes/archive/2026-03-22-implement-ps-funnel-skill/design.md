## Context

ProjectSpecFactory usa Claude Code como runtime. Los skills se definen en `.claude/skills/<nombre>/SKILL.md` y los agentes en `.claude/agents/<nombre>.md` con frontmatter YAML. Actualmente el estado **Funnel** (primer paso del pipeline) no tiene implementación: no existe el skill `/ps-funnel` ni el template `initial-prompt-template.md` que define la estructura del documento de entrada.

El usuario necesita una forma guiada de capturar la intención de su proyecto. Sin este paso, los estados posteriores (Draft, Discovery, etc.) no tienen un input estructurado sobre el cual operar.

## Goals / Non-Goals

**Goals:**
- Implementar el skill `/ps-funnel` como punto de entrada al pipeline
- Crear el agente PM que conduce la entrevista y completa el documento
- Definir el template `initial-prompt-template.md` con las secciones necesarias
- Producir `$SPECS_BASE/specs/initial-prompt.md` listo para el siguiente estado

**Non-Goals:**
- No procesar ni validar el `initial-prompt.md` generado
- No implementar estados posteriores del workflow
- No agregar lógica WIP=1 en este primer skill (eso puede manejarse con un flag simple en iteraciones futuras)

## Decisions

### D1: Arquitectura skill + agente separados

**Decisión**: El skill `SKILL.md` actúa como orchestrator liviano que delega la lógica de entrevista al agente `pm-agent.md`.

**Rationale**: Separar responsabilidades permite reutilizar el agente PM en otros contextos (e.g., revisiones, refinamientos). El skill solo define el flujo de alto nivel (leer template → invocar agente → escribir output), mientras el agente tiene el prompt especializado para conducir entrevistas.

**Alternativa descartada**: Poner todo el prompt en SKILL.md — hace el skill difícil de mantener y no aprovecha el sistema de agentes de Claude Code.

---

### D2: El agente PM usa AskUserQuestion para cada sección del template

**Decisión**: El agente lee `initial-prompt-template.md` y hace preguntas al usuario correspondientes a cada sección/título. No hace todas las preguntas de golpe, sino en secuencia lógica (máx 3-4 preguntas por ronda).

**Rationale**: Preguntas focalizadas producen respuestas de mayor calidad. El agente puede combinar respuestas + su pericia de PM para completar secciones que el usuario dejó incompletas.

**Alternativa descartada**: Un formulario de texto libre sin estructura — produce inputs inconsistentes para los agentes downstream.

---

### D3: Template como archivo Markdown con comentarios de guía

**Decisión**: `/ps-funnel/templates/initial-prompt-template.md` usa headers H2/H3 para cada sección con comentarios HTML `<!-- -->` que guían al agente sobre qué capturar en cada campo.

**Rationale**: Mantiene el principio minimalista (solo Markdown), es legible por humanos y máquinas, e idempotente (re-ejecutar sobrescribe el mismo archivo).

---

### D4: Output escrito directamente por el agente PM

**Decisión**: El agente PM escribe `$SPECS_BASE/specs/initial-prompt.md` usando la herramienta `Write` de Claude Code, usando el template como estructura base y llenando las secciones con las respuestas del usuario + inferencias del agente.

**Rationale**: Evita capas intermedias. El agente tiene contexto completo de la conversación y puede producir un documento cohesivo en una sola pasada.

## Risks / Trade-offs

- **[Riesgo] Preguntas insuficientes para cubrir todas las secciones del template** → Mitigación: el agente PM tiene instrucciones explícitas para inferir y completar secciones con su pericia cuando el usuario no proporciona suficiente detalle, marcando las inferencias como `[inferido]`
- **[Riesgo] El template evoluciona pero el agente no** → Mitigación: el agente lee el template dinámicamente en runtime, por lo que cambios al template se reflejan automáticamente en las preguntas
- **[Trade-off] Calidad del output depende de la calidad de las respuestas del usuario** → Aceptado: es inherente a cualquier proceso de captura de requisitos; el agente PM compensa con preguntas de seguimiento y síntesis

## Migration Plan

No hay estado previo que migrar. Se crean archivos nuevos sin modificar existentes:
1. Crear `/ps-funnel/templates/initial-prompt-template.md`
2. Crear `.claude/agents/pm-agent.md`
3. Crear `.claude/skills/ps-funnel/SKILL.md`

Rollback: eliminar los tres archivos.

## Open Questions

- ¿Cuántas secciones debe tener `initial-prompt-template.md`? (Ver spec `initial-prompt-template` para definición)
- ¿El skill debe verificar WIP=1 antes de ejecutar, o eso se deja para una iteración posterior?
