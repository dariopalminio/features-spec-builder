## 1. Estructura del skill

- [x] 1.1 Crear directorio `.claude/skills/header-aggregation/`
- [x] 1.2 Crear `.claude/skills/header-aggregation/SKILL.md` con frontmatter YAML (`name`, `description`) y cuerpo de instrucciones
- [x] 1.3 Definir el esquema canónico de frontmatter inline en el SKILL.md (campos obligatorios: `type`, `date`, `slug`, `title`, `status`; opcionales: `tags`, `substatus`, `parent`, `related`, `sources`)

## 2. Lógica de derivación automática de campos

- [x] 2.1 Documentar en SKILL.md la regla de derivación de `slug` desde nombre de archivo (sin extensión, kebab-case)
- [x] 2.2 Documentar la regla de inferencia de `type` desde prefijo de archivo (`story-*` → `story`, `release-*` → `release`, `project-*` → `project`, resto → `wiki`)
- [x] 2.3 Documentar la regla de mapeo de `status` desde el campo `**Estado**` existente (`Doing` → `IN-PROGRESS`, `Ready` → `COMPLETED`, ausente → `BACKLOG`)
- [x] 2.4 Documentar la derivación de `title` desde el primer heading `#` del archivo o desde el nombre de archivo si no hay heading

## 3. Flujo de aplicación a archivo individual

- [x] 3.1 Documentar en SKILL.md el paso de detección: verificar si el archivo tiene bloque `---` YAML al inicio
- [x] 3.2 Documentar el flujo para archivo sin frontmatter: derivar campos → generar bloque → anteponer al contenido → mostrar resumen
- [x] 3.3 Documentar el flujo para archivo con frontmatter existente: leer campos existentes → proponer merge → mostrar diff → solicitar confirmación (Sobrescribir / Mantener / Cancelar) → aplicar solo si usuario confirma

## 4. Flujo de aplicación en modo batch

- [x] 4.1 Documentar en SKILL.md el modo batch: listar todos los `.md` del directorio dado (no recursivo por defecto)
- [x] 4.2 Documentar el resumen anticipado: archivos sin frontmatter (se modificarán) vs archivos con frontmatter (conflictos)
- [x] 4.3 Documentar la solicitud de confirmación global antes de proceder
- [x] 4.4 Documentar las opciones para conflictos en batch: "Proponer merge en todos / Saltar todos los conflictos / Decidir uno por uno"

## 5. Validación de referencias cruzadas

- [x] 5.1 Documentar en SKILL.md la validación de slugs en campos `related` y `parent`: buscar el slug en todos los archivos `.md` del repositorio
- [x] 5.2 Documentar el marcado `[pendiente]` para referencias inválidas y el aviso al usuario en el resumen

## 6. Resolución de input multi-modo

- [x] 6.1 Documentar en SKILL.md los tres modos de input: nombre corto (búsqueda automática), ruta relativa/absoluta, sin input (modo interactivo)
- [x] 6.2 Documentar el comportamiento de búsqueda por nombre corto: buscar en `docs/specs/stories/`, `docs/specs/releases/` y `docs/specs/project/`; solicitar selección si hay múltiples coincidencias

## 7. Verificación

- [x] 7.1 Invocar el skill sobre `docs/specs/stories/story-FEAT-043-header-aggregation.md` y verificar que el frontmatter es añadido correctamente con los campos derivados
- [x] 7.2 Invocar el skill nuevamente sobre el mismo archivo y verificar que detecta el frontmatter existente y ofrece las opciones de merge/mantener/cancelar
- [x] 7.3 Invocar el skill sobre el directorio `docs/specs/stories/` y verificar el resumen anticipado y la confirmación global
- [x] 7.4 Verificar que referencias a slugs inexistentes son marcadas como `[pendiente]` en el frontmatter generado
