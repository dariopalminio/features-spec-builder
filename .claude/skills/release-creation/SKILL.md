---
name: release-creation
description: "Crea un archivo de release completado mediante interacción con el usuario. Lee el template release-spec-template.md dinámicamente en tiempo de ejecución y formula preguntas por sección para completar cada campo. Produce docs/specs/releases/<slug>/release.md listo para pasar release-format-validation. Usar cuando se quiera crear un release desde cero sin necesitar un project-plan.md previo."
---

# Skill: /release-creation

Conduce al usuario a través de la creación de un archivo de release completo mediante preguntas interactivas. Extrae la estructura del template `assets/release-spec-template.md` en tiempo de ejecución — si el template cambia, el flujo de preguntas se actualiza automáticamente.

**Usar cuando:**
- Se quiere crear un release sin tener `project-plan.md` previo
- Se necesita crear un release de forma guiada, sección por sección
- Como alternativa interactiva a `releases-from-project-plan`

**No usar cuando:**
- Ya existe un `project-plan.md` con releases definidos → usar `releases-from-project-plan`
- Solo se quiere validar un release existente → usar `release-format-validation`

**Argumento opcional:** `--quick` — omite todas las secciones opcionales sin preguntar por ellas individualmente.

---

## Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

## Fase 0 — Resolver modo de ejecución

### Detectar modo rápido

Si el input contiene `--quick` o el usuario indica "solo obligatorias" / "modo rápido": activar **modo rápido** (`QUICK_MODE=true`). En modo rápido, las secciones opcionales se omiten sin preguntar.

### Pedir el nombre del release

Si el usuario no proporcionó un nombre de release junto con el comando, preguntar:

> "¿Cómo se llama el release o épica? (Ej: 'Sistema de pagos', 'Onboarding v2')"

Con el nombre provisto:
- Derivar el **slug kebab-case**: minúsculas, palabras separadas por guiones, sin caracteres especiales (Ej: `"Sistema de pagos"` → `sistema-de-pagos`)
- Construir el **ID de directorio**: pedir al usuario un identificador de épica (Ej: `EPIC-01`) o proponer uno basado en los directorios existentes en `$SPECS_BASE/specs/releases/`. Formato final: `EPIC-NN-<slug>` (Ej: `EPIC-01-sistema-de-pagos`)
- Definir la **ruta de salida**: `$SPECS_BASE/specs/releases/<EPIC-NN-slug>/release.md`

### Verificar conflicto de directorio

Si el directorio `$SPECS_BASE/specs/releases/<EPIC-NN-slug>/` ya existe, preguntar:

> "El directorio `<ruta>` ya existe. ¿Qué deseas hacer?
> 1. Sobreescribir el archivo existente
> 2. Usar un nombre diferente"

Si elige "2", volver al inicio de la Fase 0 para pedir un nombre diferente.

---

## Fase 1 — Leer template y extraer secciones

El archivo de plantilla es la **única fuente de información estructural**. Nunca hardcodear nombres de secciones.

Leer `assets/release-spec-template.md`.

- Si el archivo **no existe**: detener la ejecución con:
  > ❌ No se encontró el template requerido en `assets/release-spec-template.md`.
  > Por favor verifica que el archivo existe antes de continuar.

- Si el archivo **existe**: extraer dinámicamente:
  - **Secciones obligatorias**: líneas que empiecen con `##` y contengan `<!-- sección obligatoria`
  - **Secciones opcionales**: líneas que empiecen con `##` y contengan `<!-- sección opcional`
  - **Campos de frontmatter obligatorios**: `slug`, `title`, `date`, `status`

Guardar la lista de secciones para guiar las fases 2, 3 y 4.

---

## Fase 2 — Completar frontmatter

Preguntar los campos del frontmatter con valores sugeridos. Para cada campo, mostrar la pregunta con el valor por defecto entre paréntesis para que el usuario lo acepte o modifique:

| Campo | Pregunta | Valor por defecto |
|---|---|---|
| `title` | "¿Cuál es el título del release?" | El nombre ingresado en Fase 0 |
| `date` | "¿Fecha del release? (YYYY-MM-DD)" | Fecha de hoy |
| `status` | "¿Estado inicial? (BACKLOG / DOING / DONE)" | `BACKLOG` |
| `substatus` | "¿Subestado? (DOING / REVIEW / READY)" | `DOING` |
| `slug` | — | Derivado automáticamente del nombre (mostrar al usuario, permitir corrección) |

Confirmar el slug con el usuario antes de continuar. El slug determinará el nombre del directorio y del archivo.

---

## Fase 3 — Completar secciones obligatorias

Para cada sección obligatoria extraída en Fase 1, formular una pregunta clara con contexto del template. **No se permite saltar secciones obligatorias.**

### Guía de preguntas por sección del template actual

> Estas preguntas son una guía basada en la estructura actual del template. Si el template cambia, adaptar las preguntas a las secciones reales extraídas.

#### Descripción
> "Describe el release en 2-4 líneas: ¿qué valor de negocio entrega, qué problema resuelve y en qué contexto?"

#### Features
Preguntar de forma iterativa:
> "¿Cuáles son las features principales de este release? Lista cada una con formato:
> `Nombre: descripción breve`
> (Escribe 'listo' cuando termines)"

Acepta múltiples features en un mismo mensaje o una por una. **No pedir IDs al usuario** — calcularlos al generar el archivo leyendo los directorios existentes en `$SPECS_BASE/specs/stories/` para determinar el próximo número disponible y evitar colisiones. El formato final en el archivo será:
```
- [ ] FEAT-{N} - **{Nombre}:** {descripción}
```
Donde `{N}` es el número de 3 dígitos siguiente al mayor `FEAT-NNN` existente en `$SPECS_BASE/specs/stories/` (o `001` si no hay ninguno), incrementando por cada feature adicional del mismo release.

#### Flujos Críticos / Smoke Tests
> "Define al menos un flujo crítico que, si falla, debe detener el despliegue. Para cada escenario, describe:
> - **DADO** (contexto inicial)
> - **CUANDO** (acción que desencadena el flujo)
> - **ENTONCES** (resultado esperado crítico)
>
> ¿Cuántos escenarios críticos quieres definir?"

Solicitar cada escenario por separado si el usuario prefiere. Continuar hasta que el usuario indique que terminó.

---

## Fase 4 — Completar secciones opcionales

Si `QUICK_MODE=true`: saltar toda esta fase, continuar a Fase 5.

De lo contrario, para cada sección opcional extraída en Fase 1, preguntar:

> "¿Quieres completar la sección **[nombre de sección]**? (sí / no / saltar todas)"

- Si "sí": formular la pregunta específica de la sección (ver guía abajo) y registrar la respuesta.
- Si "no": omitir la sección del archivo final.
- Si "saltar todas": omitir todas las secciones opcionales restantes sin preguntar más.

### Guía de preguntas para secciones opcionales del template actual

#### Requerimiento
> "¿Hay alguna regla de negocio específica que aplique a este release? Descríbela brevemente."

#### Impacto en Procesos Claves
> "¿Qué procesos del negocio se ven afectados por este release? Lista cada proceso y cómo se ve impactado."

#### Dependencias Críticas
> "¿Hay dependencias externas críticas? Para cada una, indica: descripción, dueño responsable y fecha de compromiso."

#### Riesgos
> "¿Qué riesgos identificas? Para cada riesgo, indica la descripción y la mitigación propuesta."

#### Criterios de éxito
> "¿Cuáles son los criterios de éxito medibles para este release? Lista cada uno como un ítem verificable."

#### Notas adicionales
> "¿Hay algún comentario adicional relevante para el equipo de desarrollo o stakeholders?"

---

## Fase 5 — Generar el archivo release.md

Con todas las respuestas recopiladas, construir el archivo `release.md` completo:

1. Construir el bloque frontmatter YAML con los valores de la Fase 2
2. Añadir el encabezado `# Release/Epic: {título}`
3. Para cada sección obligatoria: insertar el encabezado `## {nombre sección}` y el contenido respondido
4. Para cada sección opcional que el usuario completó: insertar el encabezado y el contenido
5. Omitir las secciones opcionales que el usuario saltó

### Crear el directorio y escribir el archivo

```
$SPECS_BASE/specs/releases/<EPIC-NN-slug>/release.md
```

Verificar que el directorio existe; si no, crearlo.

Mostrar al usuario una vista previa del archivo antes de escribirlo:

> "Voy a crear el archivo en `<ruta>`. ¿Confirmas? (sí / editar primero)"

Si el usuario pide editar: mostrar el contenido y permitir correcciones antes de guardar.

---

## Fase 6 — Validación automática

Después de escribir el archivo, invocar el skill `release-format-validation` sobre el archivo generado.

### Si el resultado es APROBADO

Mostrar:
```
✅ APROBADO

Archivo creado: $SPECS_BASE/specs/releases/<EPIC-NN-slug>/release.md

Siguiente paso: ejecuta /release-generate-stories para generar las historias de usuario de este release.
```

### Si el resultado es REFINAR

Mostrar las secciones faltantes y ofrecer completarlas:

```
⚠️ REFINAR

Las siguientes secciones están incompletas o ausentes:
- [lista de secciones]

¿Quieres completarlas ahora de forma interactiva? (sí / no)
```

Si el usuario responde "sí": volver a Fase 3 o Fase 4 según corresponda para las secciones faltantes y regenerar el archivo.

---

## Referencias

- **Template canónico:** `assets/release-spec-template.md`
- **Validación de releases:** `/release-format-validation`
- **Generación de stories:** `/release-generate-stories`
- **Generación desde plan:** `/releases-from-project-plan`
