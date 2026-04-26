## Context

Los skills de SDDF son archivos Markdown (`SKILL.md`) que contienen instrucciones para el agente. Cuando un skill necesita leer su template, las instrucciones le dicen al LLM dónde encontrarlo — usando actualmente rutas como `.claude/skills/story-creation/templates/story-gherkin-template.md`. Esto funciona en Claude Code porque sus skills viven bajo `.claude/`, pero falla en clientes que montan skills en rutas distintas (OpenCode usa `.opencode/`, GitHub Copilot usa `.github/copilot/`, etc.).

El refactoring es puramente textual: buscar y reemplazar el patrón de ruta en cada SKILL.md afectado. No hay cambios en la lógica de los skills, en los templates ni en los agentes.

## Goals / Non-Goals

**Goals:**
- Reemplazar las 8+ referencias a `.claude/skills/<skill>/templates/<template>.md` en SKILL.md files por `templates/<template>.md` (ruta relativa al directorio del skill).
- Actualizar el spec `skill-template-autonomy` para que el requisito normativo refleje el nuevo patrón.
- Mantener compatibilidad completa con Claude Code (rutas relativas funcionan igual).

**Non-Goals:**
- Cambiar la ubicación física de los archivos de template (siguen en `.claude/skills/<skill>/templates/`).
- Implementar un script de fallback bash en cada skill (es overkill para la mayoría de los clientes; se documenta como opción avanzada).
- Migrar agentes en `.claude/agents/` — esos no referencian templates de skills directamente.
- Cubrir skills que ya usan rutas relativas (`readme-builder`) — ya están correctos.

## Decisions

### Decision 1: Ruta relativa simple sobre `{{SKILL_ROOT}}`

Usar `templates/<template>.md` como forma canónica, no `{{SKILL_ROOT}}/templates/<template>.md`.

**Por qué:** La ruta relativa al directorio del skill es universalmente entendida por cualquier cliente que ejecute el SKILL.md desde el contexto del skill. No depende de que el cliente expanda una variable especial. `{{SKILL_ROOT}}` es una alternativa documentada para clientes que la soporten, pero no debe ser el patrón primario — añade dependencia en la convención de naming de la variable.

**Alternativas consideradas:**
- `{{SKILL_ROOT}}/templates/...` como patrón primario → rechazado: si el cliente no expande la variable, la instrucción literal falla silenciosamente.
- Mantener rutas absolutas y añadir un script de fallback bash → rechazado: añade complejidad a cada SKILL.md y no resuelve la portabilidad del texto de instrucción.

### Decision 2: Cambio in-place en SKILL.md, sin wrapper ni abstracción

Editar directamente el texto de cada SKILL.md afectado. No crear ningún archivo intermedio ni convención de import/alias.

**Por qué:** Los SKILL.md son instrucciones en prosa para el LLM, no código fuente con imports. La forma más legible y portable de referenciar un template es simplemente escribir su ruta relativa. Cualquier abstracción adicional haría las instrucciones más difíciles de leer para el LLM.

### Decision 3: Actualizar spec `skill-template-autonomy` como MODIFIED requirement

Solo el requirement "Referencias actualizadas en SKILL.md y agentes" cambia su norma (de `.claude/skills/...` a `templates/...`). Los otros dos requirements (localización física de templates y duplicación por skill) siguen vigentes sin cambios.

**Por qué:** La localización física del template sigue siendo `<skill>/templates/` — lo que cambia es cómo el SKILL.md *nombra* ese path, no dónde vive el archivo.


### Decision 4: Nota de verificación de rutas relativas

Aunque se asume que el LLM ejecuta el skill con el directorio del skill como current working directory (CWD) y aunque es lo común, podrías añadir una nota de verificación:
"Al leer templates/..., el LLM debe resolver la ruta relativa al directorio que contiene el archivo SKILL.md. No se debe interpretar como relativo al proyecto raíz."
Esto deja claro el comportamiento esperado en clientes que no sigan la convención implícita.

## Risks / Trade-offs

- **[Risk] Clientes que no resuelven rutas relativas** — Un cliente LLM que no ejecute el skill desde su directorio podría no encontrar `templates/...`. → Mitigation: Se documenta `{{SKILL_ROOT}}` como alternativa en cada SKILL.md actualizado; es un escape hatch sin complejidad de código.
- **[Risk] Búsquedas que asumen la ruta vieja** — Grep / documentación externa que busque `.claude/skills/.*/templates/` como evidencia de correctitud deberá actualizarse. → Mitigation: El spec actualizado es la fuente de verdad; cualquier lint/grep externo deberá adaptarse.
- **[Trade-off] Menos explícito en la ruta** — `templates/story-gherkin-template.md` no incluye el nombre del skill; puede parecer ambiguo fuera de contexto. → Aceptado: el contexto de ejecución (el skill activo) hace la referencia inequívoca.

## Migration Plan

1. Identificar todas las referencias hardcodeadas con Grep en `.claude/skills/*/SKILL.md`.
2. Editar cada SKILL.md: reemplazar `.claude/skills/<skill>/templates/<template>.md` → `templates/<template>.md`.
3. En secciones de verificación ("Verificar que el template existe"), actualizar el comando de ejemplo igual.
4. Actualizar el spec `skill-template-autonomy` con el delta de este cambio.
5. Verificar con Grep que no queden referencias al patrón antiguo.

No rollback especial necesario — los archivos están en git; revertir es un `git checkout`.
