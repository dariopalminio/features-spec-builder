---
description: >-
  Tercer paso del pipeline de ProjectSpecFactory. Verifica que
  requirement-spec.md existe, conduce la generación del plan mediante el agente
  project-architect y genera docs/specs/project/project-plan.md.
alwaysApply: false
name: project-planning
---
Eres el orchestrator del estado **Planning** del pipeline de ProjectSpecFactory.

## Tu tarea

Generar `docs/specs/project/project-plan.md` a partir de `docs/specs/project/requirement-spec.md` y los documentos anteriores del pipeline, delegando el análisis y la generación al `project-architect`.

## Pasos

### 1. Verificar precondicion de entrada (requirement-spec.md)

Lee `docs/specs/project/requirement-spec.md`.

- Si el archivo **no existe**: informa al usuario y deten la ejecucion:

  > ❌ No se encontró `docs/specs/project/requirement-spec.md`.
  > Debes completar primero la fase Discovery ejecutando `/project-discovery`.

- Si el archivo **existe** pero `substatus` es `DOING`: informa al usuario y deten la ejecucion.

  > ❌ `docs/specs/project/requirement-spec.md` aun esta en `substatus: DOING`.
  > Debes completar Discovery y dejar el documento en `Estado: Ready` antes de ejecutar `/project-planning`.

- Si el archivo **existe** con `substatus: READY`: continua al paso 2.

### 2. Verificar estado del documento de output

Lee `docs/specs/project/project-plan.md` (si existe) y detecta el valor de `substatus:`.

- Si el archivo **no existe**: continua al paso 3 (primera ejecucion).
- Si existe con `substatus: DOING`: activa flujo de retoma y continua al paso 3.
- Si existe con `substatus: READY`: informa que el documento ya esta completo y pide confirmacion antes de sobrescribir.
  - Si el usuario confirma sobrescribir: continua al paso 3.
  - Si el usuario cancela: deten la ejecucion sin modificar el archivo.

### 3. Verificar que el template existe

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca codifique directamente los nombres o la estructura de las secciones en esta habilidad; siempre derréglelos de la plantilla en tiempo de ejecución. Si la plantilla cambia, el output generado se actualizará automáticamente.

El archivo de plantilla es de **solo lectura**. Nunca escriba en él, lo modifique ni lo use como ruta de salida.

Lee el archivo de plantilla `assets/project-plan-template.md`.

- Si el archivo **no existe**: informar al usuario y detener la ejecución:

  > ❌ No se encontró el template requerido en `assets/project-plan-template.md`.
  > Por favor verifica que el archivo existe antes de continuar.

- Si el archivo **existe**: continua.

### 4. Story Mapping (fase previa a la planificación)

Lee `docs/specs/project/story-map.md`:

**Si el archivo existe:**

- Informa al usuario:
  > ✅ Se encontró `docs/specs/project/story-map.md`. Se usará como guía estructural para el plan de proyecto.
- Continúa al paso 5 con el story map disponible como contexto adicional.

**Si el archivo NO existe:**

- Pregunta al usuario:
  > ¿Deseas realizar un Story Mapping antes de planificar? Esto produce un mapa de actividades del usuario (backbone, walking skeleton y release slices) que enriquecerá el plan.
  >
  > Opciones:
  > 1. **Sí, hacer Story Mapping ahora** — invoca el skill `project-story-mapping` y luego continúa con la planificación.
  > 2. **No, continuar sin Story Mapping** — salta directamente a la planificación (comportamiento anterior).

  - Si el usuario elige **opción 1**: invoca el skill `project-story-mapping`. Cuando termine y `story-map.md` esté generado, continúa al paso 5 con el story map como contexto.
  - Si el usuario elige **opción 2**: continúa al paso 5 sin story map (comportamiento idéntico a la versión anterior).

### 5. Delegar al project-architect

Invoca al agente `project-architect` con la siguiente instrucción:

> Lee los documentos `docs/specs/project/project-intent.md` y `docs/specs/project/requirement-spec.md`. Lee también el template `assets/project-plan-template.md`.
>
> Si estás en flujo de retoma (documento existente en `substatus: DOING`), primero lee `docs/specs/project/project-plan.md`, identifica secciones incompletas con placeholders como `[...]` o valores sin reemplazar, y continúa solo con esas secciones. No vuelvas a preguntar ni sobrescribas secciones ya completas.
>
> [CONDICIONAL — incluir solo si `docs/specs/project/story-map.md` existe]
> Lee también `docs/specs/project/story-map.md`. Usa las actividades del backbone como guía para agrupar features relacionadas en el plan. Usa los release slices del story map como referencia estructural para definir qué features van en cada release (respetando las dependencias técnicas y el valor de negocio). No estás obligado a replicar el story map exactamente — es una guía, no una restricción.
> [FIN CONDICIONAL]
>
> Extrae features atómicas con IDs FEAT-NNN, priorízalas, agrúpalas en releases con MVP en Release 1, y escribe el resultado en `docs/specs/project/project-plan.md`.

El `project-architect` se encargará de:
- Leer los documentos de entrada de fases anteriores
- Leer el template y derivar la estructura del output dinámicamente
- Leer `story-map.md` si existe y usar el backbone/release slices como guía estructural
- Extraer features atómicas con IDs únicos (FEAT-NNN), descripciones y dependencias
- Priorizar por valor de negocio, dependencias y riesgo técnico
- Agrupar en releases con MVP en Release 1, incluyendo criterios de éxito
- Escribir el documento final con metadatos y checkboxes vacíos `- [ ]`

### 6. Confirmar output

Cuando el `project-architect` termine:

1. Verifica que `docs/specs/project/project-plan.md` existe leyendo el archivo
2. Si existe, confirma al usuario:
  > ✅ Documento generado correctamente.
  > Path: `docs\specs\project\project-plan.md`
  > Workflow completo: el documento esta listo para revision.
3. Si no existe, informa al usuario que algo salió mal y sugiere ejecutar `/project-planning` nuevamente.

