---
name: release-generate-stories
description: "Genera historias de usuario (directorio `<SPECS_BASE>/specs/stories/FEAT-NNN-nombre/story.md`) a partir de las features definidas en el release.md de un directorio de release, usando el template story-template.md. El usuario puede indicar el nombre del directorio de release."
---
# Skill: /release-generate-stories

Lee `release.md` de un directorio de release en `$SPECS_BASE/specs/releases/` y genera automáticamente un directorio `FEAT-[ID]-[Nombre-kebab]/` con un archivo `story.md` por cada feature definida en la sección `## Features` del release. Cada archivo generado sigue exactamente la estructura de `$SPECS_BASE/specs/templates/story-template.md`.

**Usar cuando:**
- Se quiere derivar historias de usuario listas para sprint planning a partir de un archivo de release
- Como paso siguiente a ejecutar `/releases-from-project-plan`
- Para poblar `$SPECS_BASE/specs/stories/` de forma automatizada antes de refinar con `/story-refine`

---

## Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

## Fase 0 — Resolver el input

El skill acepta dos formatos de input:

### Formato A — Nombre de directorio (parcial o completo)

**Señal:** el input no contiene separadores de directorio (`/` o `\`) o es un nombre de directorio sin `release.md`.

**Acción:**
1. Buscar en `$SPECS_BASE/specs/releases/` **subdirectorios** cuyo nombre contenga el término (sin distinguir mayúsculas).
2. Si hay exactamente 1 coincidencia → usar ese directorio y leer `release.md` dentro. Continuar a Fase 1.
3. Si hay más de 1 coincidencia → mostrar la lista y pedir al usuario que especifique cuál usar antes de continuar.
4. Si no hay ninguna coincidencia → mostrar el mensaje de error y terminar:

```
No se encontró el directorio de release: <término>

Asegúrate de que el directorio existe en $SPECS_BASE/specs/releases/ y vuelve a intentarlo.
```

### Formato B — Ruta relativa completa al directorio o al archivo `release.md`

**Señal:** el input contiene separadores de directorio (`/` o `\`) o empieza con `$SPECS_BASE/`.

**Acción:** resolver la ruta al archivo `release.md` del directorio indicado. Si el archivo no existe, mostrar el mensaje de error y terminar:

```
No se encontró release.md en: <ruta>

Asegúrate de que la ruta es correcta y vuelve a intentarlo.
```

**En ambos casos, si `release.md` no se encuentra: terminar inmediatamente sin generar ningún archivo de historia.**

---

## Fase 1 — Leer el release y extraer features

Leer el archivo de release resuelto en Fase 0.

Localizar la sección `## Features`. Solo analizar el contenido dentro de esa sección.

Dentro de esa sección, extraer cada línea de feature con el formato:
- `- [ ] FEAT-NNN — Nombre: descripción` (pendiente)
- `- [x] FEAT-NNN — Nombre: descripción` (completada)
- `- [ ] **FEAT-NNN — Nombre:** descripción`
- Variantes con guion largo `—`, doble guión `--` o dos puntos como separador

Para cada feature, capturar:
- **ID**: el identificador de la feature (ej. `FEAT-027`, `FEAT-029`)
- **Nombre**: el texto después del ID hasta el separador (ej. `Validación de formato de Release`)
- **Descripción**: el texto después del separador, si existe
- **Estado**: `[ ]` (pendiente) o `[x]` (completada) — se procesan todas independientemente del estado

**Si la sección `## Features` no existe o no contiene ninguna entrada**, mostrar el siguiente mensaje y terminar sin generar ningún archivo:

```
No se encontraron features en el archivo de release indicado.

Asegúrate de que el archivo contiene una sección "## Features" con al menos una entrada de feature.
```

---

## Fase 2 — Preparar directorio de destino

Verificar si el directorio `$SPECS_BASE/specs/stories/` existe.

Si no existe, crearlo antes de continuar.

---

## Fase 3 — Generar archivos de historia

Para cada feature extraída en Fase 1, ejecutar los siguientes pasos:

### 3a. Construir el nombre del directorio

Convertir el nombre de la feature a kebab-case siguiendo estas reglas:
1. Convertir a minúsculas
2. Normalizar caracteres acentuados: á→a, é→e, í→i, ó→o, ú→u, ü→u, ñ→n
3. Reemplazar espacios y cualquier carácter que no sea letra o número por un guion `-`
4. Eliminar guiones consecutivos (`--` → `-`)
5. Eliminar guiones al inicio o al final

Nombre de directorio resultante: `FEAT-[NNN]-[nombre-kebab]`

Ruta del archivo de salida: `$SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/story.md`

**Ejemplo:** `FEAT-029 — Generar stories` → directorio `FEAT-029-generar-stories/` con archivo `story.md`

### 3b. Verificar existencia previa

Si ya existe el **directorio** `$SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/`, informar al usuario:

```
El directorio $SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/ ya existe.
¿Deseas sobreescribir story.md? (s/n)
```

Esperar confirmación antes de continuar. Si el usuario responde `n` o `no`, saltar esta feature y continuar con la siguiente.

### 3c. Verificar que el template existe:

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca codifique directamente los nombres o la estructura de las secciones en esta habilidad; siempre derréglelos de la plantilla en tiempo de ejecución. Si la plantilla cambia, el output generado se actualizará automáticamente.

El archivo de plantilla es de **solo lectura**. Nunca escriba en él, lo modifique ni lo use como ruta de salida.

Lee el archivo de plantilla `$SPECS_BASE/specs/templates/story-template.md`.

- Si el archivo **no existe**: informar al usuario y detener la ejecución:
  > ❌ No se encontró el template requerido en `$SPECS_BASE/specs/templates/story-template.md`.
  > Por favor verifica que el archivo existe antes de continuar.

- Si el archivo **existe**: continua.

### 3d. Inferir el contenido de la historia

Usando el nombre y la descripción de la feature, inferir:

- **Rol** (`Como`): el desarrollador, PM o practitioner que ejecuta o se beneficia de esta feature dentro del sistema SDDF. Ser específico — evitar "usuario" genérico.
- **Acción** (`Quiero`): la acción concreta que habilita la feature, orientada al usuario y no a la implementación técnica.
- **Beneficio** (`Para`): el valor real que aporta al flujo de trabajo, medible o concreto.

Generar al menos:
- **1 escenario Gherkin principal** (happy path): con `Dado/Cuando/Entonces` específicos y verificables.
- **1 escenario alternativo/error**: con condición de fallo y comportamiento esperado.

Si la feature tiene descripción detallada, usarla para enriquecer los escenarios. Si la descripción es mínima, inferir escenarios razonables desde el nombre y el contexto del sistema SDDF (framework de especificación de software con skills, agents y templates Markdown).

Las secciones opcionales (`⚙️ Criterios no funcionales`, `📎 Notas`) se incluyen con placeholder `[Por completar]` si no hay datos suficientes.

### 3e. Escribir el archivo de historia

Crear el directorio `$SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/` si no existe, luego crear el archivo `story.md` dentro de ese directorio con la estructura del template `$SPECS_BASE/specs/templates/story-template.md`. Siempre completa dinámicamente la estructura de la plantilla en tiempo de ejecución para asegurar flexibilidad ante cambios futuros en la estructura del template.

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
substatus: DOING
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

### Escenario principal – [título descriptivo del happy path]
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

## Fase 4 — Resumen

Al terminar de procesar todas las features, mostrar un resumen en pantalla:

```
## Historias generadas

Se generaron [N] directorios de historia en $SPECS_BASE/specs/stories/:

- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/story.md
- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/story.md
...

**Siguiente paso:** Ejecuta `/story-evaluation` para verificar la calidad de cada historia generada, o `/story-refine` para refinarlas de forma interactiva.
```

Si alguna feature fue saltada (usuario eligió no sobreescribir), listarla como:
```
- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/ — saltada (ya existía)
```

Si alguna feature no pudo procesarse por formato inesperado, listarla como:
```
- FEAT-NNN — [Nombre] — no procesada (formato no reconocido)
```

---

## Notas de implementación

- El skill **no valida** la calidad FINVEST de las historias generadas — esa responsabilidad es de `/story-evaluation`.
- El skill **no modifica** el archivo de release.
- El skill procesa **todas** las features del release (pendientes y completadas).
- Si dos features tienen el mismo ID (duplicado en el release), añadir sufijo `-bis` al segundo archivo (ej. `story-FEAT-029-nombre-bis.md`) e informar al usuario.
- Las secciones opcionales siempre se incluyen con placeholder `[Por completar]` para facilitar la edición posterior.
- El skill no realiza evaluación INVEST ni splitting — si una historia generada parece demasiado grande, sugerirlo en las notas pero no dividirla automáticamente.
