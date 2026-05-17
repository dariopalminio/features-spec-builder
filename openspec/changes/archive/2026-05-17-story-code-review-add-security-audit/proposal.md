<!-- Referencias -->
[[FEAT-073-skill-security-audit-condicional]]

## Why

El skill `story-code-review` orquesta tres agentes revisores en paralelo (Inspector de Código, Guardián de Requisitos, Inspector de Integración), pero no incluye análisis de seguridad. Las historias que introducen cambios en rutas de autenticación, manejo de entrada de usuario, acceso a base de datos o exposición de APIs pueden pasar el quality gate sin detección de vulnerabilidades. Integrar `security-audit` como cuarto agente paralelo cierra este gap sin añadir latencia al proceso de revisión.

## What Changes

- `story-code-review` lanza un cuarto subagente en paralelo: invocación del skill `security-audit` con alcance acotado a los archivos modificados por la historia (derivados de `tasks.md` y `design.md`).
- El informe de seguridad se consolida en `code-review-report.md` como una sección dedicada `## Security Review`.
- Los hallazgos de severidad HIGH o MEDIUM del security audit se tratan como bloqueantes, igual que los hallazgos de los otros tres agentes.
- Si `security-audit` no encuentra archivos modificados relevantes (historia de solo documentación), el agente se omite y se registra `security-review: skipped` en el reporte.

## Capabilities

### New Capabilities

- `story-code-review-security-integration`: Integración del skill `security-audit` en el flujo multi-agente de `story-code-review`. Define cómo se determina el alcance de la auditoría (archivos derivados de la historia), cómo se consolida el resultado en el reporte y cómo se propaga el estado bloqueante.

### Modified Capabilities

<!-- No hay specs de story-code-review ni security-audit en openspec/specs/ que cubran este comportamiento integrado. El cambio introduce capacidad nueva sin modificar specs existentes. -->

## Impact

- `.claude/skills/story-code-review/SKILL.md` — añadir paso de invocación paralela de `security-audit` y sección de consolidación del reporte de seguridad.
- `.claude/skills/story-code-review/assets/` — posible template para la sección `## Security Review` del `code-review-report.md`.
- No hay cambios en el skill `security-audit` ni en su interfaz de invocación.
- No hay cambios en la estructura de `code-review-report.md` más allá de la nueva sección.
