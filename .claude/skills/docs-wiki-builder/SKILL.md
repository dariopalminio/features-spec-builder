---
name: docs-wiki-builder
description: >-
  Reorganizes the docs/ directory as a navigable wiki with a central index (docs/index.md)
  and internal wikilinks [[slug]]. Implements the LLM Wiki pattern (Karpathy): the LLM reads
  index.md first to get the full documentation map before opening individual nodes, making
  context retrieval O(index) instead of O(all-files). Use when you want to generate or update
  the docs wiki structure, create the index, or validate internal wikilinks.
alwaysApply: false
---

Eres el orquestador del skill `docs-wiki-builder`. Tu responsabilidad es reorganizar el directorio `docs/` como una wiki navegable, generar `docs/index.md` como mapa principal y validar los wikilinks internos. Operas completamente inline — sin delegar a subagentes.

---

## Paso 0 — Detectar modo de invocación

Antes de cualquier acción, determina el modo de ejecución según los argumentos del usuario:

| Argumento | Modo |
|-----------|------|
| (ninguno) | Modo completo — analizar, proponer, confirmar, ejecutar |
| `--update` | Modo actualización — solo regenerar `docs/index.md` |
| `--dry-run` | Modo simulación — mostrar plan sin ejecutar nada |

---

## Paso 1 — Detectar estado actual de docs/

1. Verifica si el directorio `docs/` existe en la raíz del repositorio.
2. Si existe, verifica si contiene `docs/index.md`.
3. Lista recursivamente todos los archivos `.md` en `docs/` para entender la estructura actual.

Con esa información, determina el flujo a seguir:

| Estado detectado | Flujo |
|-----------------|-------|
| `docs/` no existe o está vacío | → Flujo A: crear estructura desde cero |
| `docs/` existe pero sin `index.md` ni subdirectorios wiki | → Flujo B: reorganizar estructura existente |
| `docs/` existe con `index.md` | → Flujo C: actualizar índice existente |

---

## Paso 2 — Flujo A: Crear estructura desde cero

Si `docs/` no existe o está vacío:

1. Crea los siguientes directorios:
   ```
   docs/specs/projects/
   docs/specs/releases/
   docs/specs/stories/
   docs/wiki/constitution/
   docs/wiki/architecture/
   docs/wiki/process/
   docs/wiki/ux/
   docs/wiki/guides/
   docs/wiki/how-to/
   ```
2. Continúa al **Paso 4** para generar el índice.

**Regla de no-eliminación:** Este skill NUNCA elimina archivos existentes. Solo crea nuevos archivos o directorios, o propone mover archivos con confirmación explícita del usuario.

---

## Paso 3 — Flujo B: Reorganizar estructura existente

Si `docs/` existe con archivos pero sin estructura wiki:

1. Analiza cada archivo `.md` encontrado e infiere su ubicación en la nueva estructura:
   - Archivos con prefijo `story-*` → `docs/specs/stories/`
   - Archivos con prefijo `release-*` → `docs/specs/releases/`
   - Archivos con prefijo `project-*` → `docs/specs/projects/`
   - Documentación técnica / artículos → `docs/wiki/guides/` o `docs/wiki/how-to/`
   - Archivos que ya están en la ubicación correcta → sin movimiento

2. Genera un resumen de los movimientos propuestos:
   ```
   ## Plan de reorganización

   Mover:
   - docs/docker-dev-container.md → docs/wiki/how-to/docker-dev-container.md
   - docs/extreme-agile/extreme-agile.md → docs/wiki/guides/extreme-agile.md

   Sin cambios (ya en ubicación correcta):
   - docs/specs/projects/project-intent.md
   - docs/specs/releases/...
   - docs/specs/stories/...

   Crear directorios nuevos:
   - docs/wiki/constitution/
   - docs/wiki/architecture/
   ...
   ```

3. **Solicita confirmación explícita** antes de ejecutar cualquier movimiento:
   > ¿Confirmas este plan de reorganización? Responde "sí" para ejecutar o "no" para cancelar.

4. Si el usuario confirma, ejecuta los movimientos. Si cancela, detiene la ejecución sin modificar nada.

5. **Regla de no-eliminación:** NUNCA eliminar archivos. Solo mover o crear. Si un movimiento requería sobreescribir un archivo existente, avisar al usuario y saltarlo.

---

## Paso 4 — Generar docs/index.md

Lee el template `assets/wiki-index-template.md`.

Construye `docs/index.md` listando todos los archivos `.md` encontrados en `docs/`:

1. **Organiza por sección** según el subdirectorio:
   - Archivos en `docs/specs/projects/` → sección "L3 — Proyecto"
   - Archivos en `docs/specs/releases/` → sección "L2 — Releases"
   - Archivos en `docs/specs/stories/` → sección "L1 — Historias de usuario"
   - Archivos en `docs/wiki/constitution/` → sección "Constitución"
   - Archivos en `docs/wiki/architecture/` → sección "Arquitectura"
   - Archivos en `docs/wiki/process/` → sección "Proceso"
   - Archivos en `docs/wiki/ux/` → sección "UX"
   - Archivos en `docs/wiki/guides/` → sección "Guías teóricas"
   - Archivos en `docs/wiki/how-to/` → sección "How-to"

2. **Genera wikilinks** para cada archivo usando la sintaxis `[[slug]]` donde `slug` = nombre del archivo sin extensión (kebab-case). Ejemplo: `docs/specs/projects/project-intent.md` → `[[project-intent]]`.

3. **Valida wikilinks** (ver Paso 5) y marca los rotos antes de escribir el índice.

4. **Añade frontmatter al índice**:
   ```yaml
   ---
   type: wiki
   slug: index
   title: "Índice de documentación"
   date: <fecha-actual YYYY-MM-DD>
   status: IN-PROGRESS
   substatus: DOING
   parent: null
   ---
   ```

5. Escribe el archivo en `docs/index.md`.

**Modo `--update`:** En este modo, solo regenera `docs/index.md` incorporando archivos nuevos. No modifica la estructura de directorios ni el contenido de otros archivos. Los archivos ya referenciados en el índice previo se mantienen.

---

## Paso 5 — Validar wikilinks y detectar nodos pendientes

Para cada wikilink `[[slug]]` que aparezca en el índice generado:

1. Busca si existe algún archivo en `docs/` cuyo nombre (sin extensión) coincida exactamente con `slug`.
2. Si el archivo **existe**: incluye el wikilink sin marcador adicional — `[[slug]]`.
3. Si el archivo **no existe**: marca el wikilink con el indicador de nodo pendiente — `[[slug]] ⚠️ nodo pendiente`.

**Este paso no bloquea la operación.** El índice se genera siempre, con o sin nodos pendientes.

Después de generar el índice, muestra un resumen de nodos pendientes al usuario:
```
## Nodos pendientes detectados

Los siguientes wikilinks apuntan a archivos que aún no existen:
- [[constitution]] → docs/wiki/constitution/constitution.md
- [[tech-stack]] → docs/wiki/architecture/tech-stack.md

Crea estos archivos cuando estés listo para expandir la wiki.
```

Si no hay nodos pendientes, omite el resumen.

---

## Paso 6 — Aplicar frontmatter YAML a nodos

Para cada archivo `.md` procesado (creado o movido) por el skill:

### Reglas de derivación de frontmatter

- **`type`**: Se deriva según la ubicación del archivo:
  - Archivos en `docs/wiki/` → `wiki`
  - Archivos con prefijo `story-*` → `story`
  - Archivos con prefijo `release-*` → `release`
  - Archivos con prefijo `project-*` → `project`
  - Otros → `wiki`
- **`slug`**: Nombre del archivo sin extensión, en kebab-case. Ejemplo: `project-intent.md` → `project-intent`.
- **`title`**: Primer heading `#` del documento. Si no hay heading, usar el nombre de archivo formateado.
- **`date`**: Fecha actual en formato YYYY-MM-DD.
- **`status`**: `**Estado**: Doing` → `IN-PROGRESS`; `**Estado**: Ready` → `COMPLETED`; ausente → `BACKLOG`.
- **`substatus`**: `**Estado**: Doing` → `DOING`; `**Estado**: Ready` → `READY`; ausente → `N/A`.
- **`parent`**: `N/A` por defecto (sin nodo padre).

### Comportamiento según estado del archivo

- **Archivo sin frontmatter**: añadir el bloque YAML al inicio del archivo preservando el contenido original intacto debajo del bloque.
- **Archivo con frontmatter existente**: preservarlo sin modificación. No sobreescribir ni fusionar automáticamente — el usuario puede invocar `/header-aggregation` si necesita actualizar el frontmatter de archivos existentes.

---

## Paso 7 — Modo --dry-run

Si el usuario invocó el skill con `--dry-run`:

1. Ejecuta los Pasos 1-6 completos pero **sin escribir ningún archivo** ni crear ningún directorio.
2. Muestra en la conversación todas las acciones que se realizarían:
   ```
   ## Plan de ejecución (--dry-run)

   Directorios a crear:
   - docs/wiki/constitution/
   - docs/wiki/architecture/
   ...

   Archivos a mover:
   - docs/docker-dev-container.md → docs/wiki/how-to/docker-dev-container.md

   Archivos a generar:
   - docs/index.md (nuevo)

   Frontmatter a añadir:
   - docs/extreme-agile/extreme-agile.md (sin frontmatter actualmente)

   Nodos pendientes en el índice:
   - [[constitution]], [[tech-stack]], ...

   No se realizó ningún cambio. Invoca el skill sin --dry-run para ejecutar.
   ```

---

## Paso 8 — Resumen final

Al completar la ejecución, muestra un resumen:

```
## Wiki generada ✅

docs/index.md — actualizado
Nodos indexados: [N]
Wikilinks rotos: [M] (ver nodos pendientes arriba)

Estructura:
docs/
├── index.md
├── specs/
│   ├── project/  ([N] archivos)
│   ├── releases/ ([N] archivos)
│   └── stories/  ([N] archivos)
└── wiki/
    ├── constitution/ ([N] archivos)
    ├── architecture/ ([N] archivos)
    ├── process/      ([N] archivos)
    ├── ux/           ([N] archivos)
    ├── guides/       ([N] archivos)
    └── how-to/       ([N] archivos)

Siguiente paso: Invoca con --update para regenerar el índice cuando añadas nuevos archivos.
```

> 💡 Para visualizar el grafo de la wiki, instala la extensión [Foam](https://marketplace.visualstudio.com/items?itemName=foam.foam-vscode) en VS Code.
