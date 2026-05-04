## Context

El SDDF framework genera artefactos en pipeline secuencial: `project-plan.md` → archivos de release (`releases-from-project-plan`) → historias de usuario. El segundo salto (release → stories) es manual actualmente. El skill `release-generate-stories` automatiza ese salto sin introducir dependencias externas ni cambiar la arquitectura del framework.

El sistema es puramente Markdown: los skills son archivos `SKILL.md` con instrucciones para el agente Claude Code. No hay código ejecutable — el agente lee el SKILL.md y lo ejecuta como instrucciones. Esto es coherente con todos los skills existentes del proyecto.

## Goals / Non-Goals

**Goals:**
- Implementar `.claude/skills/release-generate-stories/SKILL.md` que, dado un archivo de release, genera un archivo `story-[ID]-[nombre-kebab].md` por cada feature de la sección `## Features`
- Reutilizar el patrón de resolución de input ya especificado en `release-input-resolution`
- Generar historias con la estructura de `story-gherkin-template.md` con datos inferidos desde el nombre/descripción de la feature
- Confirmar antes de sobreescribir stories existentes

**Non-Goals:**
- Evaluar la calidad FINVEST de las historias generadas (eso es `/story-evaluation`)
- Dividir historias grandes (eso es `/story-split`)
- Generar releases desde el plan (eso es `releases-from-project-plan`)
- Soportar formatos de release distintos al definido en `release-spec-template.md`

## Decisions

### Decisión 1: Implementar como SKILL.md (instrucciones Markdown) en lugar de script

**Elegido:** SKILL.md con instrucciones para el agente Claude.

**Alternativa descartada:** Script Python/Bash que parsee el Markdown y genere archivos.

**Rationale:** Todos los skills del SDDF son archivos SKILL.md. Un script rompería el principio de consistencia arquitectural del framework y añadiría una dependencia de runtime (Python/Bash) que el framework evita explícitamente. El agente Claude puede leer, inferir y escribir con la misma calidad que un script, con más flexibilidad ante variaciones de formato.

---

### Decisión 2: Mapeo 1:1 feature → story (una story por feature)

**Elegido:** Un archivo `story-[ID]-[nombre-kebab].md` por cada entrada en `## Features` del release.

**Alternativa descartada:** Una story por release completo, o agrupar features relacionadas.

**Rationale:** Cada feature en un release representa una unidad de valor independiente. El mapeo 1:1 permite que cada story sea estimable, independiente y accionable de forma separada (INVEST). Agrupar features produciría épicas disfrazadas de stories.

---

### Decisión 3: Reutilizar el patrón release-input-resolution en lugar de definir lógica propia

**Elegido:** Las instrucciones del SKILL.md referencian explícitamente el comportamiento definido en `release-input-resolution`: nombre corto → busca en `$SPECS_BASE/specs/releases/`, ruta relativa → usa directamente, múltiples coincidencias → pide selección.

**Alternativa descartada:** Lógica de resolución simplificada (solo ruta exacta).

**Rationale:** Ya existe un spec de resolución de input testeado y bien definido. Reutilizarlo garantiza coherencia entre skills y evita divergencia de comportamiento para el mismo tipo de input.

---

### Decisión 4: Slug de story derivado de ID + nombre de la feature

**Elegido:** `story-[ID]-[nombre-kebab].md` donde `[ID]` se extrae del identificador de la feature (ej. `FEAT-029`) y `[nombre-kebab]` es el nombre convertido a kebab-case.

**Alternativa descartada:** Solo slug del nombre sin ID.

**Rationale:** El ID de la feature mantiene trazabilidad directa con el release y el plan. Es el mismo patrón que usa `releases-from-project-plan` con `release-[ID]-[nombre].md`.

## Risks / Trade-offs

- **Features con descripción mínima** → el agente tendrá poco contexto para el `Como/Quiero/Para` y los escenarios Gherkin. Mitigación: el SKILL.md instruye a usar placeholders descriptivos e inferir desde el nombre de la feature cuando la descripción es escasa.
- **Releases con formato no estándar** (sin sección `## Features` o con features sin ID) → el skill no puede generar stories. Mitigación: error explícito con mensaje descriptivo y sin generación parcial.
- **Sobreescritura accidental de stories curadas manualmente** → si el desarrollador ya refinó una story y vuelve a ejecutar el skill, podría perder el trabajo. Mitigación: confirmación obligatoria antes de sobreescribir (idempotencia guiada).
