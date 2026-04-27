### Requirement: Aplicar frontmatter YAML a un archivo de spec individual
El sistema SHALL añadir un bloque YAML frontmatter al inicio de un archivo Markdown de spec cuando el usuario invoca el skill con el nombre o ruta del archivo. El bloque seguirá el esquema canónico con los campos `type`, `date`, `slug`, `title` y `status` como obligatorios.

#### Scenario: Archivo sin frontmatter existente
- **WHEN** el usuario invoca el skill con la ruta de un archivo que no tiene frontmatter YAML
- **THEN** el sistema añade el bloque YAML al inicio del archivo con los campos derivados automáticamente (`slug` desde el nombre de archivo, `type` desde el prefijo, `status` desde el campo `**Estado**` si existe)
- **THEN** el contenido original del archivo se preserva intacto debajo del bloque YAML
- **THEN** el sistema muestra un resumen con los campos aplicados

#### Scenario: Archivo con frontmatter existente — merge propuesto
- **WHEN** el usuario invoca el skill con la ruta de un archivo que ya tiene un bloque YAML frontmatter
- **THEN** el sistema construye un frontmatter propuesto combinando campos existentes con los campos nuevos del esquema canónico
- **THEN** el sistema muestra el diff (campos añadidos, campos modificados, campos preservados)
- **THEN** el sistema pregunta al usuario: "Sobrescribir con propuesta / Mantener el existente / Cancelar"
- **THEN** el sistema solo modifica el archivo si el usuario elige "Sobrescribir con propuesta"

---

### Requirement: Aplicar frontmatter en modo batch a un directorio
El sistema SHALL procesar todos los archivos `.md` de un directorio dado (no recursivo por defecto) cuando el usuario invoca el skill con una ruta de directorio.

#### Scenario: Batch sobre directorio con múltiples archivos
- **WHEN** el usuario invoca el skill con la ruta de un directorio
- **THEN** el sistema lista todos los archivos `.md` del directorio
- **THEN** el sistema muestra un resumen anticipado de los archivos que serán modificados y los que ya tienen frontmatter
- **THEN** el sistema solicita confirmación global antes de proceder
- **THEN** al confirmar, aplica el frontmatter a cada archivo en secuencia y muestra el progreso

#### Scenario: Batch con archivos en conflicto
- **WHEN** uno o más archivos del directorio ya tienen frontmatter YAML
- **THEN** el sistema los marca como "conflicto" en el resumen anticipado
- **THEN** el sistema ofrece tres opciones para los conflictos: "Proponer merge en todos / Saltar todos los conflictos / Decidir uno por uno"

---

### Requirement: Esquema de frontmatter canónico
El sistema SHALL usar el siguiente esquema YAML para todos los frontmatters generados:

```yaml
---
type: <project | release | story | wiki>
date: <YYYY-MM-DD>
slug: <kebab-case único en el repositorio>
title: "<Título legible del documento>"
tags: []                          # opcional
status: <BACKLOG | IN-PROGRESS | COMPLETED>
substatus: <N/A | DOING | READY>  # opcional
parent: <slug del nodo padre>     # opcional
related:                          # opcional
  - <slug de nodo relacionado>
sources:                          # opcional
  - <clave>: <valor>
---
```

Los campos `type`, `date`, `slug`, `title` y `status` son obligatorios. El resto son opcionales y se omiten del frontmatter si no tienen valor.

#### Scenario: Derivación automática de campos desde nombre de archivo
- **WHEN** el sistema genera el frontmatter para `story-FEAT-043-header-aggregation.md`
- **THEN** `slug` = `story-FEAT-043-header-aggregation`
- **THEN** `type` = `story`
- **THEN** `title` se deriva del primer heading `#` del archivo o del nombre de archivo si no hay heading
- **THEN** `date` = fecha actual del sistema en formato `YYYY-MM-DD`
- **THEN** `status` = `IN-PROGRESS` si el documento contiene `**Estado**: Doing`, `COMPLETED` si contiene `**Estado**: Ready`, `BACKLOG` en otro caso

---

### Requirement: Validación de referencias cruzadas
El sistema SHALL validar los slugs referenciados en los campos `related` y `parent` contra los slugs existentes en el repositorio.

#### Scenario: Referencia a slug inexistente
- **WHEN** el frontmatter propuesto incluye un campo `related` o `parent` que apunta a un slug no encontrado en ningún archivo del repositorio
- **THEN** el sistema marca la referencia como `[pendiente]` en el frontmatter generado
- **THEN** el sistema advierte al usuario sobre la referencia inválida en el resumen de aplicación
- **THEN** el sistema NO falla ni cancela la operación — genera el frontmatter con la referencia marcada

#### Scenario: Todas las referencias válidas
- **WHEN** todos los slugs referenciados en `related` y `parent` existen en el repositorio
- **THEN** el sistema incluye los slugs directamente sin ninguna marca especial

---

### Requirement: Invocación multi-modo del skill
El sistema SHALL aceptar tres formas de input para identificar el objetivo:

#### Scenario: Input como nombre de archivo corto
- **WHEN** el usuario proporciona solo el nombre de archivo (ej. `story-FEAT-043-header-aggregation.md`) sin ruta
- **THEN** el sistema busca automáticamente el archivo en `docs/specs/stories/`, `docs/specs/releases/` y `docs/specs/project/`
- **THEN** si encuentra exactamente un resultado, lo procesa directamente
- **THEN** si encuentra múltiples resultados, muestra la lista y solicita selección al usuario

#### Scenario: Input como ruta relativa o absoluta
- **WHEN** el usuario proporciona una ruta completa al archivo o directorio
- **THEN** el sistema usa esa ruta directamente sin búsqueda adicional

#### Scenario: Sin input — modo interactivo
- **WHEN** el usuario invoca el skill sin especificar archivo o directorio
- **THEN** el sistema pregunta si desea procesar un archivo individual o todos los archivos de un directorio
