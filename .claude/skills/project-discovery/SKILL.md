---
description: >-
  Segundo paso del pipeline de ProjectSpecFactory. Verifica que
  project-intent.md existe en el directorio del proyecto activo, conduce discovery de usuarios y especificación de
  requisitos mediante project-pm y project-architect, produciendo
  `<SPECS_BASE>/specs/projects/<PROJ-ID>-<nombre>/project.md` en una sola sesión.
alwaysApply: false
name: project-discovery
---
Eres el orchestrator del estado **Discovery** del pipeline de ProjectSpecFactory.

## Tu tarea

Generar `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md` a partir de `$SPECS_BASE/specs/projects/$PROJ_DIR/project-intent.md`, conduciendo una sesión que fusiona el discovery de usuarios y la especificación de requisitos.

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

### 1. Verificar precondicion de entrada (project-intent.md)

Lee `$SPECS_BASE/specs/projects/$PROJ_DIR/project-intent.md`.

- Si el archivo **no existe**: informa al usuario y deten la ejecucion:

  > ❌ No se encontró `$SPECS_BASE/specs/projects/$PROJ_DIR/project-intent.md`.
  > Debes completar primero la fase Begin Intention ejecutando `/project-begin`.

- Si el archivo **existe** pero `substatus` es `IN‑PROGRESS`: informa al usuario y deten la ejecucion.

  > ❌ `$SPECS_BASE/specs/projects/$PROJ_DIR/project-intent.md` aun esta en `Estado: IN‑PROGRESS`.
  > Debes completar Begin Intention y dejar el documento en `Estado: Ready` antes de ejecutar `/project-discovery`.

- Si el archivo **existe** con `substatus: DONE`: continua al paso 2.

### 2. Verificar estado del documento de output

Lee `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md` (si existe) y detecta el valor de `substatus:`.

- Si el archivo **no existe**: continua al paso 3 (primera ejecucion).
- Si existe con `substatus: IN‑PROGRESS`: activa flujo de retoma y continua al paso 3.
- Si existe con `substatus: DONE`: informa que el documento ya esta completo y pide confirmacion antes de sobrescribir.
  - Si el usuario confirma sobrescribir: continua al paso 3.
  - Si el usuario cancela: deten la ejecucion sin modificar el archivo.

### 3. Verificar que el template existe

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca codifique directamente los nombres o la estructura de las secciones en esta habilidad; siempre derréglelos de la plantilla en tiempo de ejecución. Si la plantilla cambia, el output generado se actualizará automáticamente.

El archivo de plantilla es de **solo lectura**. Nunca escriba en él, lo modifique ni lo use como ruta de salida.

Lee el archivo de plantilla `$SPECS_BASE/specs/templates/project-template.md`.

- Si el archivo **no existe**: informar al usuario y detener la ejecución:

  > ❌ No se encontró el template requerido en `$SPECS_BASE/specs/templates/project-template.md`.
  > Por favor verifica que el archivo existe antes de continuar.

- Si el archivo **existe**: continua.

### 4. Fase Discovery - Delegar al project-pm

Invoca al agente `project-pm` con la siguiente instrucción:

> Lee `$SPECS_BASE/specs/projects/$PROJ_DIR/project-intent.md`. Conduce el discovery de usuarios con el usuario:
> - Identifica los perfiles de usuario del sistema (quiénes son, qué necesitan, cuál es su contexto de uso)
> - Descubre los flujos de uso principales y los puntos de dolor actuales
> - Identifica restricciones de negocio, integraciones externas y contexto del ecosistema
> Usa máx 3-4 preguntas por ronda. Infiere lo que sea posible desde `project-intent.md` y pregunta solo lo que falta.
> Al terminar, entrega un resumen estructurado del discovery para que el project-architect lo use en la siguiente fase.
> Si necesitas apoyo para los flujos de usuario y usabilidad, invoca al agente `project-ux`.

### 5. Fase Specifying - Delegar al project-architect

Una vez completado el discovery, invoca al agente `project-architect` con la siguiente instrucción:

> Lee `$SPECS_BASE/specs/projects/$PROJ_DIR/project-intent.md` y el resumen del discovery de la fase anterior. Lee tambien el template `$SPECS_BASE/specs/templates/project-template.md`.
>
> Si estas en flujo de retoma (documento existente en `Estado: IN‑PROGRESS`), primero lee `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md`, identifica secciones incompletas con placeholders como `[...]` o valores sin reemplazar, y continua solo con esas secciones. No vuelvas a preguntar ni sobrescribas secciones ya completas.
>
> Extrae las secciones del template en runtime y conduce la entrevista de especificación de requisitos con el usuario por secciones (máx 3-4 preguntas por ronda).
> Pre-rellena con la información ya disponible del discovery y el project-intent. Infiere contenido faltante marcándolo con `[inferido]`.
> Para secciones de experiencia de usuario y usabilidad, puedes apoyarte en el agente `project-ux`.
> Al completar el frontmatter del documento generado, usar `status: DISCOVERY` — estado inicial de todo proyecto en etapa de descubrimiento de requisitos.
> Escribe el documento final en `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md`.

El `project-architect` se encargará de:
- Pre-rellenar secciones con información del discovery y project-intent
- Conducir la entrevista de especificación por secciones (máx 3-4 preguntas por ronda)
- Apoyarse en `project-ux` para requisitos de experiencia de usuario
- Inferir contenido faltante marcándolo con `[inferido]`
- Escribir el documento final con metadatos de generación

### 6. Confirmar output

Cuando el `project-architect` termine:

1. Verifica que `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md` existe leyendo el archivo
2. Si existe, confirma al usuario:
  > ✅ Documento generado correctamente.
  > Path: `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md`
  > Siguiente comando: `/project-planning`.
3. Si no existe, informa al usuario que algo salió mal y sugiere ejecutar `/project-discovery` nuevamente.
