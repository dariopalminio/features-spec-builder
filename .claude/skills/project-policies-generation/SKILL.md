---
name: project-policies-generation
description: "Inicializa o actualiza los documentos de políticas y constitución del proyecto SDDF (`constitution.md` y `definition-of-done.md`) a partir de templates Markdown, y registra las referencias en CLAUDE.md / AGENTS.md. Usar cuando se quiere establecer o actualizar las reglas técnicas, convenciones y criterios de calidad del proyecto para que los agentes IA los lean automáticamente."
---

# Skill: /project-policies-generation

Genera o actualiza los documentos de políticas del proyecto SDDF:
- `$SPECS_BASE/policies/constitution.md` — principios técnicos inamovibles del proyecto (stack, convenciones, metodologías)
- `$SPECS_BASE/policies/definition-of-done.md` — criterios de calidad para considerar una historia completada

Y registra las referencias en `CLAUDE.md` / `AGENTS.md` para que todos los agentes IA los lean automáticamente antes de cualquier acción.

**Usar cuando:**
- Se configura un proyecto SDDF por primera vez y se necesitan documentos de políticas
- Se necesita actualizar las políticas existentes (stack tecnológico, criterios de DoD, etc.)
- Se quiere asegurar que los agentes IA del proyecto operen con las mismas reglas y estándares

---

## Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

Verificar adicionalmente que existen los templates requeridos:
- `$SPECS_BASE/specs/templates/project-constitution-template.md`
- `$SPECS_BASE/specs/templates/definition-of-done-template.md`

Si alguno de los templates no existe, mostrar el mensaje y detener la ejecución:

```
❌ No se encontró el template requerido en: $SPECS_BASE/specs/templates/<nombre>.md

Por favor verifica que el archivo existe o ejecuta `sddf-init` para inicializar la estructura base.
```

---

## Fase 1 — Preparar directorio de políticas

Verificar si el directorio `$SPECS_BASE/policies/` existe.

Si no existe, crearlo antes de continuar e informar al usuario:
```
📁 Directorio creado: $SPECS_BASE/policies/
```

---

## Fase 2 — Generar constitution.md

### 2a. Leer el template

Leer el archivo `$SPECS_BASE/specs/templates/project-constitution-template.md`.

La estructura del output la define íntegramente el template — nunca hardcodear secciones en este skill.

### 2b. Verificar existencia previa

Si `$SPECS_BASE/policies/constitution.md` **no existe**:
- Crear el archivo con el contenido del template, completando el frontmatter con:
  - `created: <YYYY-MM-DD>` (fecha actual)
  - `updated: <YYYY-MM-DD>` (fecha actual)
- Informar: `✅ Creado: $SPECS_BASE/policies/constitution.md`

Si `$SPECS_BASE/policies/constitution.md` **ya existe**, preguntar al usuario:

```
El archivo $SPECS_BASE/policies/constitution.md ya existe.
¿Qué deseas hacer?
  (e) Editar el contenido existente
  (s) Sobreescribir con el template en blanco
  (n) Saltar este archivo
```

Esperar respuesta antes de continuar:
- `e` / `editar`: abrir el archivo para que el usuario lo edite; no modificar su contenido
- `s` / `sobreescribir`: reemplazar el contenido con el template y actualizar el campo `updated`
- `n` / `saltar`: no modificar el archivo y continuar con la Fase 3

---

## Fase 3 — Generar definition-of-done.md

### 3a. Leer el template

Leer el archivo `$SPECS_BASE/specs/templates/definition-of-done-template.md`.

La estructura del output la define íntegramente el template.

### 3b. Verificar existencia previa

Si `$SPECS_BASE/policies/definition-of-done.md` **no existe**:
- Crear el archivo con el contenido del template, completando el frontmatter con `created` y `updated`.
- Informar: `✅ Creado: $SPECS_BASE/policies/definition-of-done.md`

Si `$SPECS_BASE/policies/definition-of-done.md` **ya existe**, preguntar al usuario:

```
El archivo $SPECS_BASE/policies/definition-of-done.md ya existe.
¿Qué deseas hacer?
  (e) Editar el contenido existente
  (s) Sobreescribir con el template en blanco
  (n) Saltar este archivo
```

Proceder según la respuesta, con la misma lógica que en la Fase 2.

---

## Fase 4 — Registrar referencias en CLAUDE.md / AGENTS.md

### 4a. Detectar archivo de entrada del agente

Verificar en la raíz del repositorio:
1. Si existe `CLAUDE.md` → usarlo
2. Si no existe `CLAUDE.md` pero existe `AGENTS.md` → usarlo
3. Si no existe ninguno → notificar al usuario y mostrar las líneas a agregar manualmente:

```
⚠️ No se encontró CLAUDE.md ni AGENTS.md en la raíz del repositorio.

Agrega las siguientes líneas manualmente a tu archivo de entrada del agente:

@docs/policies/constitution.md
@docs/policies/definition-of-done.md
```

### 4b. Verificar referencias existentes

Buscar en el archivo detectado si ya contiene referencias a los archivos de políticas:
- `@$SPECS_BASE/policies/constitution.md` (o la ruta relativa equivalente)
- `@$SPECS_BASE/policies/definition-of-done.md`

Si **ambas referencias ya existen**: informar que no es necesario modificar el archivo:
```
ℹ️ Las referencias a las políticas ya están registradas en CLAUDE.md — sin cambios.
```

### 4c. Agregar referencias faltantes

Si alguna referencia no está presente, intentar insertarla al final del archivo.

Si el archivo tiene una sección de contexto identificable (por ejemplo, un bloque con encabezado `# Contexto` o similar), insertar antes del cierre de esa sección.

Si el formato del archivo es no estándar o no se puede determinar la sección correcta, **no modificar el archivo** y mostrar las líneas a agregar manualmente:

```
⚠️ No se pudo determinar el lugar correcto en CLAUDE.md para insertar las referencias.

Agrega las siguientes líneas manualmente:

@docs/policies/constitution.md
@docs/policies/definition-of-done.md
```

Si se insertaron las referencias exitosamente:
```
✅ Referencias agregadas en CLAUDE.md:
   @docs/policies/constitution.md
   @docs/policies/definition-of-done.md
```

---

## Fase 5 — Resumen

Mostrar el resumen de la ejecución:

```
## Políticas del proyecto generadas

📄 Archivos de políticas:
- $SPECS_BASE/policies/constitution.md    [creado | actualizado | saltado]
- $SPECS_BASE/policies/definition-of-done.md  [creado | actualizado | saltado]

🔗 Referencias en CLAUDE.md:
- [registradas | ya existían | requieren acción manual]

**Siguiente paso:**
Edita los archivos de políticas generados para adaptar el contenido al contexto específico de tu proyecto.
Luego ejecuta `/story-design` para comenzar a diseñar la implementación de una historia.
```
