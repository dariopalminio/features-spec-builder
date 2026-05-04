---
description: >-
  Tercer paso del pipeline de ProjectSpecFactory. Verifica que
  requirement-spec.md existe, conduce la generación del plan mediante el agente
  project-architect y genera `<SPECS_BASE>/specs/projects/<PROJ-ID>-<nombre>/project-plan.md`.
alwaysApply: false
name: project-planning
---
Eres el orchestrator del estado **Planning** del pipeline de ProjectSpecFactory.

## Tu tarea

Generar `$SPECS_BASE/specs/projects/$PROJ_DIR/project-plan.md` a partir de `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md` y los documentos anteriores del pipeline, delegando el análisis y la generación al `project-architect`.

## Pasos

### 0. Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

### 0b. Resolver directorio del proyecto activo (`PROJ_DIR`)

1. Listar todos los subdirectorios de `$SPECS_BASE/specs/projects/`.
2. Para cada subdirectorio, leer `project-intent.md` y verificar si `substatus` es `DONE`.
3. Si se encuentra exactamente uno con `substatus: DONE` → usar ese directorio como `$PROJ_DIR`.
4. Si se encuentran varios → mostrar la lista y pedir al usuario que elija antes de continuar.
5. Si no se encuentra ninguno → mostrar error y detener:
   > ❌ No se encontró ningún proyecto activo en `$SPECS_BASE/specs/projects/`.
   > Ejecuta `/project-begin` primero.

La ruta completa del proyecto activo es: `$SPECS_BASE/specs/projects/$PROJ_DIR/`

### 1. Verificar precondicion de entrada (requirement-spec.md)

Lee `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md`.

- Si el archivo **no existe**: informa al usuario y deten la ejecucion:

  > ❌ No se encontró `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md`.
  > Debes completar primero la fase Discovery ejecutando `/project-discovery`.

- Si el archivo **existe** pero `substatus` es `IN‑PROGRESS`: informa al usuario y deten la ejecucion.

  > ❌ `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md` aun esta en `substatus: IN‑PROGRESS`.
  > Debes completar Discovery y dejar el documento en `Estado: Ready` antes de ejecutar `/project-planning`.

- Si el archivo **existe** con `substatus: DONE`: continua al paso 2.

### 2. Verificar estado del documento de output

Lee `$SPECS_BASE/specs/projects/$PROJ_DIR/project-plan.md` (si existe) y detecta el valor de `substatus:`.

- Si el archivo **no existe**: continua al paso 3 (primera ejecucion).
- Si existe con `substatus: IN‑PROGRESS`: activa flujo de retoma y continua al paso 3.
- Si existe con `substatus: DONE`: informa que el documento ya esta completo y pide confirmacion antes de sobrescribir.
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

Lee `$SPECS_BASE/specs/projects/$PROJ_DIR/story-map.md`:

**Si el archivo existe:**

- Informa al usuario:
  > ✅ Se encontró `$SPECS_BASE/specs/projects/$PROJ_DIR/story-map.md`. Se usará como guía estructural para el plan de proyecto.
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

> Lee los documentos `$SPECS_BASE/specs/projects/$PROJ_DIR/project-intent.md` y `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md`. Lee también el template `assets/project-plan-template.md`.
>
> Si estás en flujo de retoma (documento existente en `substatus: IN‑PROGRESS`), primero lee `$SPECS_BASE/specs/projects/$PROJ_DIR/project-plan.md`, identifica secciones incompletas con placeholders como `[...]` o valores sin reemplazar, y continúa solo con esas secciones. No vuelvas a preguntar ni sobrescribas secciones ya completas.
>
> [CONDICIONAL — incluir solo si `$SPECS_BASE/specs/projects/$PROJ_DIR/story-map.md` existe]
> Lee también `$SPECS_BASE/specs/projects/$PROJ_DIR/story-map.md`. Usa las actividades del backbone como guía para agrupar features relacionadas en el plan. Usa los release slices del story map como referencia estructural para definir qué features van en cada release (respetando las dependencias técnicas y el valor de negocio). No estás obligado a replicar el story map exactamente — es una guía, no una restricción.
> [FIN CONDICIONAL]
>
> Extrae features atómicas con IDs FEAT-NNN, priorízalas, agrúpalas en releases con MVP en Release 1, y escribe el resultado en `$SPECS_BASE/specs/projects/$PROJ_DIR/project-plan.md`.

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

1. Verifica que `$SPECS_BASE/specs/projects/$PROJ_DIR/project-plan.md` existe leyendo el archivo
2. Si existe, confirma al usuario:
  > ✅ Documento generado correctamente.
  > Path: `$SPECS_BASE/specs/projects/$PROJ_DIR/project-plan.md`
  > Workflow completo: el documento esta listo para revision.
3. Si no existe, informa al usuario que algo salió mal y sugiere ejecutar `/project-planning` nuevamente.
