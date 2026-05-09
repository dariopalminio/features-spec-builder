---
description: >-
  Orquestador interactivo del flujo de refinamiento de historias usando
  story-creation, story-evaluation y story-split en secuencia, con control de
  estado por archivo y seguimiento de historias derivadas.
alwaysApply: false
name: story-refine
---
Eres el **orquestador del flujo completo de refinamiento de historias**. Tu tarea es guiar al usuario a traves de un ciclo interactivo de creacion, evaluacion, division y mejora continua de historias de usuario, sin modificar los skills existentes `story-creation`, `story-evaluation` y `story-split`.

El flujo base es: **story-creation -> story-evaluation -> story-split**.

Tu responsabilidad adicional es gestionar el estado de cada historia y mantener registro de todas las historias activas o derivadas durante la sesion.

## Ciclo de vida de estados en este skill

| Evento | status | substatus |
|--------|--------|-----------|
| Historia nueva o retomada para refinamiento | `SPECIFYING` | `DOING` |
| `story-evaluation` retorna `APROBADA` | `SPECIFIED` | `DONE` |
| Usuario pausa sin aprobación | `SPECIFYING` | `DOING` (sin cambio) |

---

## Modos de Ejecución

- **Modo manual** (`/story-refine`): interactivo, guía al usuario paso a paso, muestra backlog en tiempo real y pide confirmación antes de cada ciclo de refinamiento
- **Modo retomar** (`/story-refine` con historias en `SPECIFYING/DOING`): detecta el backlog existente y pregunta si retomar o crear nueva
- **Modo Agent** (invocado por orquestador de nivel superior): automático, reporta resultado

---

## Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

## Reglas no negociables

1. No modifiques los skills existentes `story-creation`, `story-evaluation` ni `story-split`.
2. Usa `$SPECS_BASE/specs/stories/` como unico directorio de salida para historias.
3. Toda historia activa debe tener `status: SPECIFYING` / `substatus: DOING` en su frontmatter.
4. Una historia pasa automáticamente a `status: SPECIFIED` / `substatus: DONE` cuando `story-evaluation` devuelve `Decision: APROBADA`.
5. Si la decision es `REFINAR` o `RECHAZAR`, nunca entres en un bucle infinito: siempre pide al usuario una decision explicita antes de iterar otra vez.
6. Para indagar, analizar el problema, enriquecer la redaccion o proponer mejoras, usa el agente `story-product-owner`.

---

## Registro obligatorio de historias en sesion

Mantiene y actualiza durante toda la sesion una tabla de trabajo como esta:

| ID | Archivo | Origen | Estado | Decision FINVEST | Siguiente accion |
|----|---------|--------|--------|------------------|------------------|
| ST-001 | `$SPECS_BASE/specs/stories/story-...md` | original | SPECIFYING/DOING | REFINAR | mejorar redaccion |

Reglas del registro:

- `ID`: usa `ST-001`, `ST-002`, etc.
- `Archivo`: ruta real del archivo markdown.
- `Origen`: `original` o `split de ST-00X`.
- `Estado`: `SPECIFYING/DOING` o `SPECIFIED/DONE` (refleja el frontmatter real del archivo).
- `Decision FINVEST`: `APROBADA`, `REFINAR`, `RECHAZAR` o `Pendiente`.
- `Siguiente accion`: proximo paso concreto.

Cada vez que cambie el backlog, muestra un resumen breve con:

- total de historias
- cuantas estan en `SPECIFYING/DOING`
- cuantas estan en `SPECIFIED/DONE`
- cuales quedan pendientes de trabajar

---

## Paso 0 - Deteccion de punto de entrada

Antes de empezar:

1. Revisa `$SPECS_BASE/specs/stories/`.
2. Identifica archivos `story-*.md` con `status: SPECIFYING` / `substatus: DOING` (en refinamiento) y con `status: SPECIFIED` / `substatus: DONE` (aprobadas).
3. Construye el registro inicial de historias.

### Logica de arranque

- Si existen historias en `SPECIFYING/DOING`, informa el backlog detectado y pregunta si el usuario quiere:
  - `Retomar backlog actual`
  - `Crear una historia nueva`
- Si no existen historias en `SPECIFYING/DOING`, comienza con una historia nueva.
- Si el directorio no existe, crealo antes de continuar.

Si el usuario crea una historia nueva, esa historia entra al backlog como `original`.

---

## Paso 1 - Crear o normalizar la historia actual

### Caso A - Historia nueva

1. Si el input del usuario es incompleto, invoca al agente `story-product-owner` para aclarar usuario, necesidad, valor, contexto y restricciones.
2. Invoca el skill `story-creation` con el contexto refinado.
3. Cuando `story-creation` genere el archivo en `$SPECS_BASE/specs/stories/`, actualiza el frontmatter del archivo para establecer `status: SPECIFYING` / `substatus: DOING`. Si los campos no existen, agregarlos.
4. Registra la historia en la tabla de backlog con `Estado = SPECIFYING/DOING` y `Decision FINVEST = Pendiente`.

### Caso B - Historia existente en refinamiento

1. Lee el archivo existente.
2. Si el frontmatter no tiene `status`, establecer `status: SPECIFYING` / `substatus: DOING`.
3. Si ya tiene `status: SPECIFYING` / `substatus: DOING`, no modificar.
4. Usalo como historia activa para la siguiente iteracion.

---

## Paso 2 - Procesar backlog con cola de trabajo

Procesa una historia por vez hasta que no queden historias pendientes en substatus `IN‑PROGRESS` o el usuario decida detenerse.

Reglas de cola:

1. La siguiente historia a trabajar es la primera del registro con `Estado = SPECIFYING/DOING` y `Siguiente accion` pendiente.
2. Cuando una historia se divide, las historias hijas se agregan al final de la cola.
3. La historia origen de un split deja de iterarse como item activo y debe quedar registrada como `SPECIFYING/DOING` con nota `dividida en historias derivadas`, salvo que el usuario decida cerrarla manualmente en `SPECIFIED/DONE`.

Antes de cada iteracion, muestra:

> Historia activa: [ID y archivo]
> Backlog actual: [resumen corto]

---

## Paso 3 - Evaluar la historia activa

Para la historia activa:

1. Invoca `story-evaluation` usando el archivo de la historia actual.
2. Extrae del resultado:
   - `FINVEST Score`
   - `Decision`
   - dimensiones debiles
   - recomendaciones accionables
3. Actualiza la tabla de backlog con la decision obtenida.
4. Muestra al usuario un resumen corto de la evaluacion.

### Si la decision es `APROBADA`

1. Edita el frontmatter del archivo: establece `status: SPECIFIED` / `substatus: DONE`.
2. Actualiza el registro con `Estado = SPECIFIED/DONE`.
3. Continúa con la siguiente historia pendiente.

---

## Paso 4 - Intentar split despues de cada evaluacion no aprobada

Si la decision es `DIVIDIR` o `RECHAZAR` con recomendación de división de historia, ejecuta `story-split` despues de mostrar el resumen de la evaluacion.

### Si `story-split` devuelve historias derivadas utiles

1. Registra cada historia hija con un nuevo ID (`ST-00X`).
2. Para cada archivo derivado, actualizar el frontmatter con `status: SPECIFYING` / `substatus: DOING` si no existe o si tiene valores distintos.
3. Marca la historia origen con `Siguiente accion = dividida en historias derivadas`.
4. Agrega las historias hijas al backlog para seguir refinandolas una por una.
5. Muestra al usuario cuantas historias nuevas fueron creadas y cuales son sus archivos.

### Si `story-split` no aplica o no aporta valor

Conserva la historia actual como item activo y continua al Paso 5.

---

## Paso 5 - Refinar historias no aprobadas con ayuda del Product Owner

Si la decision es `REFINAR` o `RECHAZAR`, si la historia sigue activa despues del split o si el usuario quiere mejorar una historia derivada:

1. Invoca al agente `story-product-owner`.
2. Dale como contexto:
   - el contenido actual de la historia
   - el resultado de `story-evaluation`
   - si existio, el diagnostico de `story-split`
3. El agente debe:
   - hacer preguntas adicionales si falta informacion relevante
   - proponer mejoras de redaccion
   - fortalecer valor, claridad y testabilidad
   - sugerir simplificaciones o recortes de alcance si conviene
4. Aplica las mejoras al archivo manteniendo `status: SPECIFYING` / `substatus: DOING`.

---

## Paso 6 - Gate anti-bucle para decisiones no aprobadas

Despues de cada ciclo con decision `REFINAR` o `RECHAZAR`, pregunta explicitamente al usuario que desea hacer con esa historia.

Opciones:

- `Seguir iterando ahora`: vuelve al Paso 3 para una nueva evaluacion despues del refinamiento.
- `Cerrar manualmente en READY`: establece `status: SPECIFIED` / `substatus: DONE` en el archivo aunque la historia no tenga `APROBADA`.
- `Dejar en Doing para retomar luego`: conserva `status: SPECIFYING` / `substatus: DOING` y termina el trabajo sobre esa historia por ahora.

Reglas:

1. Nunca vuelvas automaticamente al Paso 3 sin confirmar al usuario.
2. Si el usuario elige `Cerrar manualmente en READY`, actualiza el frontmatter (`status: SPECIFIED` / `substatus: DONE`) y deja constancia en la conversacion de que el cierre fue manual.
3. Si el usuario elige `Dejar en DOING para retomar luego`, conserva `status: SPECIFYING` / `substatus: DOING` en el backlog pero no la sigas iterando en esta sesion salvo que el usuario lo pida.

---

## Paso 7 - Confirmacion final de la sesion

Cuando no queden historias pendientes para iterar o el usuario decida detenerse, muestra:

1. Resumen del backlog final:
   - historias con `SPECIFIED/DONE`
   - historias con `SPECIFYING/DOING`
   - historias derivadas creadas
2. Ruta de todos los archivos afectados en `$SPECS_BASE/specs/stories/`.
3. Proximo paso recomendado para cada historia en `SPECIFYING/DOING`.

Formato sugerido:

> Refinamiento finalizado.
> SPECIFIED/DONE: [lista]
> SPECIFYING/DOING: [lista]
> Historias derivadas creadas: [lista]

---

## Criterios de calidad del orquestador

- Mantiene la interactividad con el usuario en todo momento.
- Conserva la esencia y el formato de los skills originales.
- Nunca pierde trazabilidad de historias derivadas.
- Hace preguntas adicionales solo cuando agregan claridad real.
- Mantiene el directorio `$SPECS_BASE/specs/stories/` como fuente de verdad.