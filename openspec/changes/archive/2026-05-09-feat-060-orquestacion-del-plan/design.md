## Context

El workflow de planning de historias SDD está compuesto por tres skills especializados (`story-design`, `story-tasking`, `story-analyze`) que el desarrollador debe invocar manualmente en secuencia. No existe un punto de entrada único que los coordine, lo que implica que el usuario debe gestionar manualmente el encadenamiento, los errores entre pasos y la idempotencia de cada artefacto.

Estado actual: `story-design`, `story-tasking` y `story-analyze` existen como skills independientes con lógica propia de validación e idempotencia. `story-plan` los orquesta sin replicar su lógica.

## Goals / Non-Goals

**Goals:**
- Orquestar `story-design → story-tasking → story-analyze` en secuencia con fail-fast
- Mostrar el progreso paso a paso mientras cada sub-skill ejecuta
- Delegar la idempotencia a cada sub-skill (no duplicar la lógica de "¿sobreescribir?")
- Presentar un resumen final agregado del estado de los tres pasos
- Si `story-analyze` detecta inconsistencias, marcar el plan como "requiere revisión" sin bloquear el acceso a los artefactos

**Non-Goals:**
- Reimplementar la lógica de `story-design`, `story-tasking` ni `story-analyze`
- Permitir ejecución parcial (ej. solo design + tasking sin analyze)
- Gestionar conflictos de artefactos por cuenta propia (se delega a cada sub-skill)

## Decisions

### Decisión: Modelo de invocación de sub-skills — modo Agent inline

**Elegida:** El skill `story-plan` invoca cada sub-skill en **modo Agent** (automático, sin confirmación interactiva). Inyecta el contexto resuelto (directorio de historia, `$SPECS_BASE`) en cada invocación y espera el resultado antes de pasar al siguiente paso.

En el SDDF, un skill puede invocar a otro skill instruyendo al LLM a "leer el SKILL.md de `story-design` y ejecutar sus pasos en modo Agent con los siguientes parámetros". Este es el mecanismo estándar del framework para la invocación en cadena sin intermediarios de código.

Alternativa descartada: re-implementar los pasos de `story-design`, `story-tasking` y `story-analyze` directamente en `story-plan`. Viola el principio DRY y rompe la mantenibilidad: si un sub-skill cambia, hay que actualizar también `story-plan`.

Alternativa descartada: crear un agente orquestador separado (`story-plan-agent`). Añadiría un nivel extra de delegación innecesario para este caso de uso lineal.

### Decisión: Fail-fast con estado acumulado

**Elegida:** Si un paso falla, `story-plan` detiene la cadena y muestra el estado acumulado hasta ese punto (pasos completados ✓, paso fallido ✗, pasos no ejecutados —). Esto permite que el usuario entienda qué artefactos están disponibles antes del fallo.

No se realiza rollback de artefactos generados antes del fallo: el usuario puede corregir el problema y re-ejecutar `story-plan`; los sub-skills ya generados preguntarán si sobreescribir (idempotencia delegada).

### Decisión: story-analyze como paso no bloqueante

**Elegida:** Si `story-analyze` detecta inconsistencias (ERROREs o WARNINGs), `story-plan` marca el resumen como "⚠️ requiere revisión" pero NO interrumpe el flujo ni elimina los artefactos. El usuario puede revisar `analyze.md` y decidir si ajustar design.md o tasks.md antes de implementar.

Fundamento: `story-analyze` ya clasifica las inconsistencias por severidad. El rol de `story-plan` es informar, no tomar decisiones por el usuario.

## Risks / Trade-offs

- **Contexto cruzado entre sub-skills** → Cada sub-skill lee sus propios artefactos desde el sistema de archivos, no del contexto del orquestador. Esto es correcto por diseño (principio "evitar el teléfono descompuesto"), pero requiere que `story-plan` resuelva y pase la ruta del directorio de la historia a cada sub-skill de forma consistente.
- **Verbosidad del output** → Tres skills en secuencia producen mucho texto. Mitigación: `story-plan` muestra una línea de estado por sub-skill en tiempo real (`→ story-design...`, `✓ story-design`) y el output detallado de cada sub-skill solo aparece bajo una sección colapsable o como texto de apoyo.
- **Idempotencia delegada puede ser confusa** → Si el usuario re-ejecuta `story-plan` en un directorio con artefactos parciales, cada sub-skill preguntará individualmente. Mitigación: documentar claramente en el Paso 1 que la idempotencia está delegada.
