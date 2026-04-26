---
name: header-aggregation
description: Añade o actualiza frontmatter YAML estandarizado en archivos Markdown de spec (project-intent, requirement-spec, project-plan, release-*, story-*). Soporta un archivo individual o modo batch sobre un directorio completo. Detecta frontmatter existente y propone un merge con confirmación del usuario antes de sobreescribir. Usar cuando se necesite estandarizar metadatos de trazabilidad en archivos de spec, preparar archivos para el patrón LLM Wiki (index-first navigation), o añadir campos slug/type/status de forma masiva.
---

# Skill: /header-aggregation

Aplica un bloque YAML frontmatter estandarizado a archivos Markdown de especificación del proyecto SDDF. El objetivo es habilitar el patrón LLM Wiki: cada archivo de spec tiene metadatos suficientes para que un índice pueda referenciar nodos sin abrir el contenido completo.

---

## Esquema canónico de frontmatter

Este esquema es la fuente de verdad del skill. Nunca lo hardcodees en otro lugar — si cambia aquí, el comportamiento del skill cambia automáticamente.

```yaml
---
type: <project | release | story | wiki>   # OBLIGATORIO
date: <YYYY-MM-DD>                          # OBLIGATORIO
slug: <kebab-case único en el repositorio>  # OBLIGATORIO
title: "<Título legible del documento>"     # OBLIGATORIO
tags: []                                    # opcional
status: <BACKLOG | IN-PROGRESS | COMPLETED> # OBLIGATORIO
substatus: <N/A | DOING | READY>            # opcional — alineado con Estado: Doing/Ready
parent: <slug del nodo padre>               # opcional
related:                                    # opcional
  - <slug de nodo relacionado>
sources:                                    # opcional
  - <clave>: <valor>
---
```

Omite los campos opcionales del bloque generado si no tienen valor relevante.

---

## Paso 1: Resolver el input

El skill acepta tres formas de input:

**A) Nombre corto de archivo** (ej. `story-FEAT-043-header-aggregation`):
- Busca el archivo en este orden: `docs/specs/stories/`, `docs/specs/releases/`, `docs/specs/project/`
- Si hay exactamente un resultado → úsalo directamente
- Si hay múltiples resultados → muestra la lista y pide selección al usuario
- Si no hay resultado → trata el input como texto libre e informa al usuario

**B) Ruta relativa o absoluta** (ej. `docs/specs/stories/story-FEAT-043.md` o directorio `docs/specs/stories/`):
- Usa la ruta directamente sin búsqueda adicional
- Si es un directorio → activa el modo batch (ver Paso 4)

**C) Sin input**:
- Pregunta al usuario: "¿Deseas procesar un archivo individual o todos los archivos de un directorio?"
- Solicita la ruta correspondiente según la elección

---

## Paso 2: Derivar los campos del frontmatter

Para cada archivo a procesar, deriva automáticamente los campos obligatorios:

| Campo | Regla de derivación |
|-------|---------------------|
| `slug` | Nombre del archivo sin extensión, en kebab-case (ej. `story-FEAT-043-header-aggregation`) |
| `type` | Prefijo del nombre de archivo: `story-*` → `story`, `release-*` → `release`, `project-*` → `project`, cualquier otro → `wiki` |
| `title` | Primer heading `#` del contenido del archivo. Si no hay heading `#`, usar el nombre del archivo sin extensión formateado (guiones → espacios, capitalizar) |
| `date` | Fecha en formato `YYYY-MM-DD` (debería preservar la fecha del documento cuando está disponible o fecha today si no existe o es nuevo) |
| `status` | Buscar `**Estado**: Doing` en el contenido → `IN-PROGRESS`; `**Estado**: Ready` → `COMPLETED`; ausente o desconocido → `BACKLOG` |

Muestra los valores derivados al usuario antes de escribir y permite correcciones.

---

## Paso 3: Aplicar frontmatter a un archivo individual

### 3.1 Detección de frontmatter existente

Lee el archivo. El archivo tiene frontmatter YAML si comienza exactamente con `---` en la primera línea (antes de cualquier otro contenido).

### 3.2 Archivo sin frontmatter

1. Deriva los campos (Paso 2)
2. Valida referencias si aplica (Paso 5)
3. Genera el bloque YAML con los campos derivados
4. Antepone el bloque al contenido existente (sin modificar el contenido debajo)
5. Escribe el archivo
6. Muestra resumen: qué campos fueron añadidos y sus valores

### 3.3 Archivo con frontmatter existente — merge con confirmación

1. Lee los campos del bloque YAML existente
2. Construye un frontmatter propuesto:
   - Preserva todos los campos que ya existen con sus valores actuales
   - Añade los campos obligatorios del esquema canónico que falten, con valores derivados
3. Muestra el diff al usuario:
   ```
   Campos añadidos:   type, status
   Campos existentes: slug, title, date (sin cambios)
   ```
4. Pregunta al usuario qué hacer:
   - **Sobrescribir con propuesta** — reemplaza el bloque YAML con el propuesto
   - **Mantener el existente** — no modifica el archivo
   - **Cancelar** — sale sin escribir nada
5. Solo modifica el archivo si el usuario elige "Sobrescribir con propuesta"

---

## Paso 4: Modo batch (directorio)

Cuando el input es un directorio:

1. Lista todos los archivos `.md` directamente en ese directorio (no recursivo)
2. Clasifica cada archivo:
   - **Sin frontmatter**: será modificado
   - **Con frontmatter existente**: conflicto potencial
3. Muestra el resumen anticipado antes de proceder:
   ```
   Archivos a modificar (sin frontmatter): 12
   Archivos con conflicto (frontmatter existente): 3
   ```
4. Para los archivos con conflicto, pregunta la estrategia:
   - **Proponer merge en todos** — aplica la lógica del Paso 3.3 en todos
   - **Saltar todos los conflictos** — procesa solo los archivos sin frontmatter
   - **Decidir uno por uno** — aplica el flujo interactivo del Paso 3.3 para cada conflicto
5. Solicita confirmación global antes de proceder: "¿Confirmas el procesamiento de N archivos?"
6. Procesa los archivos en secuencia y muestra el progreso con un resumen final

---

## Paso 5: Validación de referencias cruzadas

Para cada slug referenciado en los campos `related` y `parent` del frontmatter propuesto:

1. Busca ese slug en todos los archivos `.md` del repositorio (busca en los frontmatters existentes o en los nombres de archivo)
2. Si el slug **existe** → inclúyelo en el frontmatter normalmente
3. Si el slug **no existe** → márcalo como `[pendiente]` en el frontmatter generado:
   ```yaml
   related:
     - "[pendiente] slug-que-no-existe"
   ```
4. Incluye todos los avisos de referencias inválidas en el resumen final de la operación
5. No canceles ni falles la operación — genera el frontmatter con las marcas y avisa al usuario

---

## Resumen de salida

Al terminar (archivo individual o batch), muestra siempre:

```
✓ Frontmatter aplicado: <ruta-del-archivo>
  type:   story
  slug:   story-FEAT-043-header-aggregation
  title:  "Encabezado de archivos spec con metadata de estado"
  date:   2026-04-26
  status: IN-PROGRESS

⚠ Referencias marcadas como [pendiente]: 0
```

Para batch, añade contadores totales: archivos procesados / saltados / con error.
