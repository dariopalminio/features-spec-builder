## Context

El pipeline ProjectSpecFactory tiene tres fases secuenciales con una dependencia estricta de orden: `project-begin` produce `project-intent.md`, `project-discovery` lo consume y produce `requirement-spec.md`, `project-planning` consume ambos y produce `project-plan.md`. Cada documento usa el campo `**Estado**` (`Doing` / `Ready`) como señal de completitud.

El skill `project-flow` actúa como orquestador de nivel superior. No reemplaza los skills existentes, sino que los invoca como fases coordinadas dentro de una sola sesión de usuario.

## Goals / Non-Goals

**Goals:**
- Ejecutar las tres fases en secuencia dentro de una sola sesión
- Mantener la interactividad: cada fase sigue siendo una entrevista guiada con el usuario
- Introducir un gate de revisión entre fases: el usuario revisa el documento generado y confirma antes de continuar
- Marcar cada documento como `Estado: Ready` al pasar el gate, antes de ejecutar la siguiente fase
- Detectar fases ya completadas (Estado: Ready) y ofrecer saltar o rehacer

**Non-Goals:**
- Modificar la lógica interna de los skills existentes
- Ejecutar fases en paralelo
- Reemplazar los comandos individuales (`/project-begin`, etc.)

## Decisions

**Replicar la lógica de delegación, no invocar el skill como comando**: Claude Code no puede invocar un skill desde otro skill con `/command`. El orquestador replica el patrón de delegación de cada fase (invoca los mismos agentes con las mismas instrucciones), manteniendo el comportamiento idéntico.

**Gate de revisión explícito entre fases**: Después de que cada agente escribe el documento de output, el orquestador:
1. Lee el documento y muestra un resumen al usuario
2. Pregunta: "¿El documento está completo y listo para continuar?"
3. Si confirma: actualiza `**Estado**: Doing` → `**Estado**: Ready` con Edit
4. Si no confirma: ofrece continuar la entrevista o detener el flujo

**Detección de fases completas al inicio**: Antes de ejecutar cada fase, el orquestador lee el documento de output y verifica `**Estado**`:
- `Ready` → ofrece saltar la fase (ya completa) o rehacerla
- `Doing` → retoma desde donde quedó
- No existe → ejecuta desde cero

**Un solo SKILL.md**: El orquestador vive en `.claude/skills/project-flow/SKILL.md`. No requiere templates propios (usa los de cada skill).

## Risks / Trade-offs

- [Longitud de sesión] La sesión completa puede ser larga (3 entrevistas) → Mitigación: los gates permiten pausar y retomar en cualquier punto.
- [Estado inconsistente] Si el usuario interrumpe entre el gate y el inicio de la siguiente fase, el estado queda Ready para la fase anterior pero la siguiente no inició → Mitigación: la detección de fases completas al inicio del flujo maneja este caso correctamente.
- [Edit del campo Estado] El orquestador usa Edit para cambiar `Doing` → `Ready` en el documento; si el formato del campo cambia, el Edit puede fallar → Mitigación: usar `replace_all: false` con el string exacto `**Estado**: Doing`.
