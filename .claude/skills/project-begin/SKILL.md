---
description: >-
  Primer paso del pipeline de ProjectSpecFactory. Entrevista al usuario mediante
  el agente project-pm para capturar la intención del proyecto y refinarla,
  produciendo docs/specs/project/project-intent.md en una sola sesión.
alwaysApply: false
name: project-begin
---
Eres el orchestrator del estado **Begin Intention** del pipeline de ProjectSpecFactory.

## Tu tarea

Generar `docs/specs/project/project-intent.md` conduciendo una entrevista en una sola sesión que captura la intención inicial del proyecto y la refina hasta producir el documento final.

## Pasos

### 1. Verificar WIP=1

Antes de iniciar, revisa los documentos de `docs/specs/project/` y detecta si existe algun archivo con `substatus: DOING`.

- Si **no** existe ningun documento en substatus `DOING`: continua al paso 2.
- Si **existe** al menos uno en substatus `DOING`: notifica el conflicto WIP=1 e indica que ya hay un proyecto activo. Muestra cual documento esta en substatus `DOING` y ofrece solo estas opciones:
  - `Sobrescribir`: iniciar de cero y continuar con el flujo normal.
  - `Retomar`: continuar el proyecto activo aplicando flujo de retoma sobre el documento en substatus `DOING`.

Si el usuario elige retomar, activa el flujo de retoma del paso 4 sin reiniciar desde cero.

### 2. Verificar estado del documento de output

Lee `docs/specs/project/project-intent.md` (si existe) y detecta el valor de `**Estado**:`.

- Si el archivo **no existe**: continua al paso 3 (primera ejecucion).
- Si existe con `substatus: DOING`: activa flujo de retoma y continua al paso 3.
- Si existe con `substatus: READY`: informa que el documento ya esta completo y pide confirmacion antes de sobrescribir.
  - Si el usuario confirma sobrescribir: continua al paso 3.
  - Si el usuario cancela: deten la ejecucion sin modificar el archivo.

### 3. Verificar que el template existe

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca codifique directamente los nombres o la estructura de las secciones en esta habilidad; siempre derréglelos de la plantilla en tiempo de ejecución. Si la plantilla cambia, el output generado se actualizará automáticamente.

El archivo de plantilla es de **solo lectura**. Nunca escriba en él, lo modifique ni lo use como ruta de salida.

Lee el archivo de plantilla `assets/project-intent-template.md`.

- Si el archivo **no existe**: informar al usuario y detener la ejecución:
  > ❌ No se encontró el template requerido en `assets/project-intent-template.md`.
  > Por favor verifica que el archivo existe antes de continuar.
- Si el archivo **existe**: continua.

### 4. Delegar al project-pm

Invoca al agente `project-pm` con la siguiente instrucción:

> Lee el template en `assets/project-intent-template.md`. Extrae las secciones del template en runtime.
>
> Si estas en flujo de retoma (documento existente en `Estado: Doing`), primero lee `docs/specs/project/project-intent.md`, identifica secciones incompletas con placeholders como `[...]` o valores sin reemplazar, y continua solo con esas secciones. No vuelvas a preguntar ni sobrescribas secciones ya completas.
>
> Conduce la entrevista de intencion de proyecto con el usuario en dos fases dentro de la misma sesion:
>
> **Fase 1 — Captura de intención:** Pregunta al usuario por la idea general del proyecto (qué quiere construir, para quién, qué problema resuelve). Usa máx 3-4 preguntas abiertas para entender el contexto.
>
> **Fase 2 — Refinamiento:** A partir de las respuestas de la Fase 1, profundiza sección por sección del template (máx 3-4 preguntas por ronda). Pre-rellena con la información ya capturada y solicita solo lo que falta. Infiere el contenido faltante marcándolo con `[inferido]`.
>
> Escribe el resultado completo en `docs/specs/project/project-intent.md`.

El `project-pm` se encargará de:
- Capturar la intención inicial del proyecto en la Fase 1
- Refinar y completar todas las secciones del template en la Fase 2
- Inferir contenido faltante marcándolo con `[inferido]`
- Escribir el documento final con metadatos de generación

### 5. Confirmar output

Cuando el `project-pm` termine:

1. Verifica que `docs/specs/project/project-intent.md` existe leyendo el archivo
2. Si existe, confirma al usuario:
  > ✅ Documento generado correctamente.
  > Path: `docs\specs\project\project-intent.md`
  > Siguiente comando: `/project-discovery`.
3. Si no existe, informa al usuario que algo salió mal y sugiere ejecutar `/project-begin` nuevamente.

