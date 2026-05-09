---
name: release-generate-all-stories
description: "Genera historias de usuario (directorio FEAT-NNN-nombre/story.md) para todos los releases existentes en `<SPECS_BASE>/specs/releases/`, aplicando el mismo flujo de extracción y generación del skill release-generate-stories. Procesa todos los directorios de release en orden alfabético en una sola invocación."
---
# Skill: /release-generate-all-stories

Escanea todos los **directorios** de release en `$SPECS_BASE/specs/releases/`, lee `release.md` de cada uno, y genera automáticamente un directorio `FEAT-[ID]-[Nombre-kebab]/` con un archivo `story.md` por cada feature encontrada, siguiendo exactamente la estructura de `$SPECS_BASE/specs/templates/story-template.md`. Es el equivalente batch de `/release-generate-stories`.

**Usar cuando:**
- Se quiere poblar `$SPECS_BASE/specs/stories/` de forma completa a partir de todos los releases del proyecto
- Al iniciar un sprint planning y se necesitan todas las historias de todos los releases en un solo paso
- Como alternativa a invocar `/release-generate-stories` individualmente por cada archivo de release

---

## Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

## Fase 0 — Descubrir directorios de release

Listar todos los **subdirectorios** en `$SPECS_BASE/specs/releases/` que contengan un archivo `release.md`, ordenados alfabéticamente por nombre de directorio.

**Si el directorio `$SPECS_BASE/specs/releases/` no existe o no contiene ningún subdirectorio con `release.md`**, mostrar el siguiente mensaje y terminar sin generar ningún archivo:

```
No se encontraron directorios de release en $SPECS_BASE/specs/releases/

Asegúrate de haber ejecutado el skill /releases-from-project-plan antes de usar este skill,
o verifica que el directorio contiene subdirectorios EPIC-NN-nombre/ con archivo release.md.
```

Mostrar al usuario la lista de releases descubiertos antes de continuar:
```
Se encontraron [N] directorios de release en $SPECS_BASE/specs/releases/:
- EPIC-00-nombre/
- EPIC-01-nombre/
...
Procesando en orden alfabético.
```

---

## Fase 1 — Detección anticipada de conflictos

Antes de procesar ningún release, verificar qué historias ya existen en `$SPECS_BASE/specs/stories/` que serían generadas en este batch.

Para ello, leer la sección `## Features` de cada `release.md` descubierto en Fase 0 y calcular los nombres de directorio que se generarían (`FEAT-[NNN]-[nombre-kebab]/`). Verificar cuáles de esos directorios ya existen en `$SPECS_BASE/specs/stories/`.

**Si no hay ningún conflicto**, continuar directamente a Fase 2 sin mostrar pantalla de confirmación.

**Si hay al menos un conflicto**, mostrar la lista de directorios en conflicto y presentar la siguiente pregunta antes de comenzar el procesamiento:

```
Se detectaron [N] directorios de historia que ya existen y serían sobreescritos:
- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/ (EPIC-XX)
- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/ (EPIC-YY)
...

¿Cómo deseas manejar los conflictos?
  (a) Sobreescribir todos los existentes
  (b) Saltar todos los existentes (generar solo los nuevos)
  (c) Decidir uno por uno durante el procesamiento
```

Esperar la respuesta del usuario antes de continuar a Fase 2. Registrar la decisión para aplicarla durante Fase 3.

---

## Fase 2 — Preparar directorio de destino

Verificar si el directorio `$SPECS_BASE/specs/stories/` existe.

Si no existe, crearlo antes de continuar.

---

## Fase 3 — Procesar releases en batch

Iterar sobre cada archivo de release en el orden alfabético establecido en Fase 0. Para cada release, ejecutar los siguientes pasos:

### 3a. Extraer features del release

Leer la sección `## Features` del archivo de release. Extraer cada línea de feature con el formato:
- `- [ ] FEAT-NNN — Nombre: descripción` (pendiente)
- `- [x] FEAT-NNN — Nombre: descripción` (completada)
- Variantes con `**` (bold), guion largo `—`, doble guión `--` o dos puntos como separador

Capturar para cada feature: **ID** (ej. `FEAT-027`), **Nombre** (texto después del ID hasta el separador), **Descripción** (texto después del separador, si existe).

**Si la sección `## Features` no existe o está vacía:**
- Registrar: `[nombre-release] — saltado (sin features)`
- Continuar con el siguiente release **sin interrumpir el batch**

### 3b. Generar archivo de historia por feature

Para cada feature extraída del release:

**1. Construir el nombre del directorio:**

Convertir el nombre de la feature a kebab-case:
1. Convertir a minúsculas
2. Normalizar acentos: á→a, é→e, í→i, ó→o, ú→u, ü→u, ñ→n
3. Reemplazar espacios y caracteres no alfanuméricos por guion `-`
4. Eliminar guiones consecutivos y al inicio/final

Nombre de directorio resultante: `FEAT-[NNN]-[nombre-kebab]`

Ruta del archivo de salida: `$SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/story.md`

**2. Gestionar idempotencia según la decisión de Fase 1:**
- **(a) Sobreescribir todos:** sobreescribir sin preguntar
- **(b) Saltar todos los existentes:** si el archivo ya existe, registrar como saltado y continuar con la siguiente feature
- **(c) Decidir uno por uno:** si el archivo ya existe, preguntar al usuario antes de continuar

**3. Verificar que el template existe:**

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca codifique directamente los nombres o la estructura de las secciones en esta habilidad; siempre derréglelos de la plantilla en tiempo de ejecución. Si la plantilla cambia, el output generado se actualizará automáticamente.

El archivo de plantilla es de **solo lectura**. Nunca escriba en él, lo modifique ni lo use como ruta de salida.

Lee el archivo de plantilla `$SPECS_BASE/specs/templates/story-template.md`.

- Si el archivo **no existe**: informar al usuario y detener la ejecución:
  > ❌ No se encontró el template requerido en `$SPECS_BASE/specs/templates/story-template.md`.
  > Por favor verifica que el archivo existe antes de continuar.

- Si el archivo **existe**: continua.

**4. Inferir el contenido de la historia:**

Usa el archivo de plantilla anteriormente leido para inferir la estructura de la historia, pero extrae el contenido específico de cada sección a partir del nombre y la descripción de la feature. Por ejemplo, el nombre de la feature puede sugerir el rol y la acción principal, mientras que la descripción puede aportar detalles adicionales para los criterios de aceptación.

Usando el nombre y la descripción de la feature, inferir:
- **Como**: rol específico que se beneficia dentro del sistema SDDF (desarrollador, PM, practitioner — ser específico, no "usuario")
- **Quiero**: acción concreta orientada al usuario, no a la implementación técnica
- **Para**: beneficio real y medible, no restatement de la acción

Generar al menos un escenario Gherkin principal (happy path) y uno alternativo/error, con pasos `Dado/Cuando/Entonces` específicos y verificables.

**5. Escribir el archivo:**

Crear el directorio `$SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/` si no existe, luego crear `story.md` dentro de ese directorio con la estructura del template `$SPECS_BASE/specs/templates/story-template.md` infiriendo la información. Siempre completa dinámicamente la estructura de la plantilla en tiempo de ejecución para asegurar flexibilidad ante cambios futuros en la estructura del template.

Al completar el frontmatter del archivo generado, usar:
- `status: PLANNED` — estado inicial de toda historia generada desde un release planificado (pendiente de refinamiento)

Si no encuentras el template generar el archivo con la siguiente estructura:

```markdown
---
alwaysApply: false
type: story
id: <FEAT-NNN>
slug: <nombre-del-directorio-de-historia>
title: "<primer # heading del documento o Nombre de la feature>"
status: PLANNED
substatus: IN‑PROGRESS
parent: <EPIC-NN>
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
**FINVEST Score:** —
**FINVEST Decisión:** —
---

# Historia de Usuario

## 📖 Historia: [Nombre de la feature]

**Como** [rol específico inferido]
**Quiero** [acción concreta orientada al usuario]
**Para** [beneficio real y medible]

## ✅ Criterios de aceptación

### Escenario principal – [título descriptivo]
```gherkin
Dado [contexto inicial específico]
  Y [condición adicional si aplica]
Cuando [acción del usuario]
Entonces [resultado esperado concreto]
  Y [resultado adicional si aplica]
```

### Escenario alternativo / error – [título]
```gherkin
Dado [contexto de fallo]
Cuando [acción inválida o condición de error]
Entonces [mensaje de error o comportamiento alternativo]
  Pero [excepción si aplica]
```

## ⚙️ Criterios no funcionales

[Por completar]

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: [nombre del archivo de release]
Feature origen: [ID] — [Nombre de la feature]

Este es solo un ejemplo, recuerda que el archivo de plantilla es la guía a completar.
```

---

## Fase 4 — Resumen consolidado

Al finalizar el procesamiento de todos los releases, mostrar el resumen:

```
## Historias generadas — Resumen batch

**Releases procesados:** [N total]
**Historias generadas:** [N creadas]
**Historias saltadas:** [N saltadas por conflicto]
**Releases sin features:** [N releases que no tenían features]

### Directorios creados
- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/story.md  (EPIC-XX)
- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/story.md  (EPIC-YY)
...

### Directorios saltados (ya existían)
- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/  (EPIC-XX)
...

### Releases sin features (no procesados)
- $SPECS_BASE/specs/releases/EPIC-NN-nombre/

**Siguiente paso:** Ejecuta `/story-evaluation` para verificar la calidad de las historias generadas, o `/story-refine` para refinarlas de forma interactiva.
```

---

## Notas de implementación

- El skill **no valida** la calidad FINVEST de las historias — esa responsabilidad es de `/story-evaluation`.
- El skill **no modifica** los archivos de release.
- El skill procesa **todas** las features de cada release (pendientes `[ ]` y completadas `[x]`).
- Si dos features en distintos releases generan el mismo nombre de directorio (mismo ID y mismo slug), el segundo directorio se nombra con sufijo `-bis` (ej. `FEAT-027-nombre-bis/`) e informa al usuario en el resumen.
- Las secciones opcionales de cada historia siempre se incluyen con placeholder `[Por completar]` para facilitar la edición posterior.
- El orden de procesamiento es siempre alfabético por nombre de directorio de release, lo que equivale al orden numérico dado el patrón `EPIC-NN-nombre/`.
