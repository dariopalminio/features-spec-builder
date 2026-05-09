---
name: story-split
description: "Divide una historia de usuario épica o demasiado grande en historias más pequeñas e independientes. Usar cuando una historia tiene S≤2 en evaluación FINVEST, ≥4 escenarios Gherkin, múltiples flujos de usuario bundleados, o el equipo no puede estimarla. Aplica los 8 patrones de splitting de Richard Lawrence. Cada historia resultante sigue el template story-template.md (Como/Quiero/Para + Gherkin) y cumple criterios INVEST. El directorio original se reutiliza como historia core (happy path), las adicionales reciben IDs nuevos."
---

# Skill: /story-split

Toma una historia grande, épica o feature demasiado amplio y lo divide en historias más pequeñas e independientes. Cada historia resultante sigue **estrictamente** el template `$SPECS_BASE/specs/templates/story-template.md`.

**Usar cuando:**
- Una historia tiene ≥ 4 escenarios Gherkin o ≥ 8 pasos totales
- Hay múltiples flujos principales (varios `Cuando` independientes)
- El equipo no puede estimar la historia con confianza
- La historia mezcla varios roles, tipos de datos o reglas de negocio distintas
- `/story-evaluation` da score S ≤ 2 (Grande o Épica)

**No usar cuando:**
- La historia ya es pequeña y bien acotada (no sobre-dividir)
- El splitting crearía dependencias que bloquean entrega
- Es una tarea técnica sin valor de usuario directo

## Flags opcionales

| Flag | Comportamiento |
|---|---|
| `--dry-run` | Muestra el plan de splitting (patrón, historias propuestas, core designada) sin crear ni modificar ningún archivo |
| `--pattern N` | Fuerza el patrón de splitting 1–8, saltando la selección automática de Fase 2 |
| `--core N` | Designa manualmente qué historia del split (por número de orden) será la core; omite la selección automática de Fase 3.5 |

## Idempotencia

Si el directorio de la historia original ya fue renombrado (el slug no coincide con el directorio existente), el skill lo detecta y omite el renombrado sin error. Si los directorios de las historias adicionales ya existen, informa al usuario y no los sobreescribe.

---

## Modos de Ejecución

- **Modo manual** (`/story-split {story_id}`): el usuario proporciona la historia a dividir (ruta de archivo o identificador de story)
- **Modo Agent** (invocado por orquestador de nivel superior): automático, reporta resultado

---

## Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

## Proceso de división

### Fase 0 — Resolver el input

El skill acepta tres tipos de input. Detectar cuál aplica antes de continuar:

#### Tipo A — Texto libre (historia completa o descripción en prosa)
**Señal:** El input es texto de una historia de usuario o descripción de feature.
**Acción:** Continuar directamente a la Fase 1.

#### Tipo B — Ruta de archivo relativa
**Señal:** El input parece una ruta (contiene `/` o `\`, o termina en `.md`).
**Acción:** Leer el archivo en esa ruta y usar su contenido como historia a dividir. Continuar a la Fase 1.

#### Tipo C — Nombre de archivo o término de búsqueda
**Señal:** El input es una palabra o frase corta que no parece texto de historia ni ruta explícita.
**Acción:**
1. Buscar en `$SPECS_BASE/specs/stories/` archivos cuyo nombre contenga el término (sin distinguir mayúsculas)
2. Si hay exactamente 1 coincidencia → leerlo y usarlo como historia a dividir. Continuar a la Fase 1.
3. Si hay más de 1 coincidencia → mostrar la lista y pedir al usuario que elija antes de continuar.
4. Si no hay coincidencias → tratar el input como Tipo A (texto libre).

---

### Fase 1 — Diagnosticar la historia original

Leer la historia completa y responder:

1. ¿Cuántos escenarios Gherkin tiene? ¿Cuántos pasos totales?
2. ¿Hay múltiples flujos de usuario independientes bundleados?
3. ¿Mezcla varios roles, tipos de datos o reglas de negocio?
4. ¿Tiene dependencias externas múltiples?
5. ¿Por qué es difícil de estimar?

Identificar el **patrón de splitting más apropiado** (ver Fase 2). Si aplican varios, aplicarlos en orden.

---

### Fase 2 — Seleccionar el patrón de splitting

Aplicar en orden hasta encontrar el que encaja:

#### Patrón 1 — Pasos del flujo de trabajo
**Cuándo:** La historia cubre pasos secuenciales de un mismo journey.

**Señal:** Los escenarios describen etapas de un proceso en cadena.

```
Original: "Como usuario quiero registrarme, verificar mi email y completar mi perfil"
↓
Split A: "Como visitante quiero registrarme con email/contraseña..."
Split B: "Como usuario registrado quiero verificar mi email..."
Split C: "Como usuario verificado quiero completar mi perfil..."
```

---

#### Patrón 2 — Variaciones de reglas de negocio
**Cuándo:** La historia aplica reglas diferentes según condiciones (roles, permisos, cálculos).

**Señal:** Un Scenario Outline con múltiples filas donde cada fila tiene lógica diferente.

```
Original: "Como usuario quiero aplicar descuentos (10% miembro, 20% VIP, 5% primer compra)"
↓
Split A: "Como miembro quiero aplicar 10% de descuento..."
Split B: "Como usuario VIP quiero aplicar 20% de descuento..."
Split C: "Como comprador primerizo quiero aplicar 5% de descuento..."
```

---

#### Patrón 3 — Variaciones de datos
**Cuándo:** La historia maneja tipos de datos o inputs distintos que tienen comportamientos propios.

**Señal:** Escenarios que difieren solo en el tipo de archivo, formato o dato de entrada.

```
Original: "Como usuario quiero subir archivos (imágenes, PDFs, videos)"
↓
Split A: "Como usuario quiero subir imágenes (JPG, PNG)..."
Split B: "Como usuario quiero subir documentos PDF..."
Split C: "Como usuario quiero subir videos (MP4, MOV)..."
```

---

#### Patrón 4 — Complejidad de criterios de aceptación *(más común)*
**Cuándo:** La historia tiene múltiples escenarios principales independientes (varios `Cuando` distintos).

**Señal:** Más de 1 escenario principal, o escenarios alternativos que son en realidad flujos completos.

```
Original: "Como usuario quiero gestionar mi carrito"
  Escenario: agregar ítem → carrito actualizado
  Escenario: eliminar ítem → carrito actualizado
  Escenario: cambiar cantidad → total recalculado
↓
Split A: "Como comprador quiero agregar ítems a mi carrito..."
Split B: "Como comprador quiero eliminar ítems de mi carrito..."
Split C: "Como comprador quiero actualizar la cantidad de un ítem..."
```

---

#### Patrón 5 — Esfuerzo mayor (incrementos técnicos)
**Cuándo:** La implementación requiere fases técnicas que pueden entregarse incrementalmente con valor en cada etapa.

**Señal:** El equipo dice "primero necesitamos X para poder hacer Y".

```
Original: "Como usuario quiero colaboración en tiempo real en documentos"
↓
Split A: "Como usuario quiero ver quién más está viendo el documento (presencia read-only)"
Split B: "Como usuario quiero ver los cursores en tiempo real de otros editores"
Split C: "Como usuario quiero ver las ediciones de otros en tiempo real"
```

---

#### Patrón 6 — Dependencias externas
**Cuándo:** La historia depende de múltiples sistemas, APIs o terceros distintos.

**Señal:** Escenarios que varían solo por el proveedor externo.

```
Original: "Como usuario quiero iniciar sesión con Google, Facebook o Twitter"
↓
Split A: "Como usuario quiero iniciar sesión con Google OAuth"
Split B: "Como usuario quiero iniciar sesión con Facebook OAuth"
Split C: "Como usuario quiero iniciar sesión con Twitter OAuth"
```

---

#### Patrón 7 — Pasos DevOps / infraestructura
**Cuándo:** La historia incluye requerimientos de despliegue o infraestructura que escalan por etapas.

**Señal:** El alcance cambia significativamente según el entorno o el volumen.

```
Original: "Como usuario quiero subir archivos grandes a la nube"
↓
Split A: "Como usuario quiero subir archivos pequeños (<10MB)"
Split B: "Como usuario quiero subir archivos medianos (10MB–1GB) con barra de progreso"
Split C: "Como usuario quiero retomar una subida interrumpida"
```

---

#### Patrón 8 — Tiny Acts of Discovery (TADs)
**Cuándo:** Ninguno de los patrones anteriores aplica porque hay demasiadas incógnitas para escribir historias concretas.

**Señal:** El equipo no puede imaginar los escenarios Gherkin porque no entiende el problema.

> Los TADs **no son historias** — son experimentos o spikes de investigación. Producir TADs en lugar de historias y volver a `/story-split` una vez que haya claridad.

```
Original: "Como usuario quiero recomendaciones con IA" (demasiado vago)
↓
TAD 1: Prototipar 3 algoritmos de recomendación y testear con 10 usuarios
TAD 2: Definir métricas de éxito (tasa de clicks, satisfacción)
TAD 3: Construir el motor de recomendación más simple posible
```

---

### Fase 3 — Verificar que el template existe y leerlo

El archivo de plantilla (template canónico) es la **única fuente de información estructural** para generar el output de stories. Define qué secciones existen, en qué orden y con qué propósito. Nunca codifique directamente los nombres o la estructura de las secciones en esta habilidad; siempre derréglelos de la plantilla en tiempo de ejecución. Si la plantilla cambia, el output generado se actualizará automáticamente.

El archivo de plantilla (template canónico) es de **solo lectura**. Nunca escriba en él, lo modifique ni lo use como ruta de salida.

Lee el archivo de plantilla (template canónico) `$SPECS_BASE/specs/templates/story-template.md`.

- Si el archivo **no existe**: informar al usuario y detener la ejecución:

  > ❌ No se encontró el template requerido en `$SPECS_BASE/specs/templates/story-template.md`.
  > Por favor verifica que el archivo existe antes de continuar.

- Si el archivo **existe**: continua con lo siguiente.

---

### Fase 3.5 — Identificar la historia core

Antes de escribir las historias, designar cuál de las historias resultantes será la **historia core**. La historia core hereda el ID original y su directorio (renombrado); no recibe un ID nuevo.

**Criterios de selección (en orden de prioridad):**
1. La historia que contiene el **escenario principal / happy path** del flujo original
2. La historia que aporta el mayor valor independiente si se entrega sola
3. La historia que el equipo implementaría primero

Documentar internamente `CORE = Historia N` antes de continuar con la Fase 4.

---

### Fase 4 — Escribir cada historia resultante

Cada historia del split debe seguir **estrictamente** el template `$SPECS_BASE/specs/templates/story-template.md` anteriormente leido, adaptando el contenido a cada historia específica. No agregar ni eliminar secciones del template, solo llenar cada sección con la información correspondiente a la historia resultante. Siempre completa dinámicamente la estructura de la plantilla en tiempo de ejecución, infiriendo la información, para asegurar flexibilidad ante cambios futuros en la estructura del template.

Por ejemplo:

```markdown
## 📖 Historia

**Como** {rol específico}
**Quiero** {acción concreta}
**Para** {beneficio real}

## ✅ Criterios de aceptación

### Escenario principal – {título}
Dado {contexto específico}
Cuando {acción}
Entonces {resultado verificable}

### Escenario alternativo / error – {título}
Dado {contexto}
Cuando {acción inválida}
Entonces {error o comportamiento alternativo}
  Pero {excepción}

### Requerimiento (opcional)
{Requerimiento específico (como regla de negocio) relacionado con la historia, si aplica}

## ⚙️ Criterios no funcionales (opcional)
## 📎 Notas / contexto adicional

Este es solo un ejemplo, recuerda que el archivo de plantilla (template canónico) es la guía a evaluar como formato.
```

Aplicar las mismas reglas de calidad de `/story-creation`:
- `Como` → rol específico, no "usuario" genérico
- `Quiero` → acción del usuario, no implementación técnica
- `Para` → beneficio real, no restatement de `Quiero`
- Pasos Gherkin → específicos y verificables, con valores concretos cuando sea posible

---

### Fase 5 — Validar cada split

Antes de entregar, verificar que **cada historia** cumple:

| Criterio | Pregunta |
|---|---|
| **I** Independiente | ¿Se puede desarrollar sin esperar las demás historias del split? |
| **N** Negociable | ¿Documenta el qué/para qué sin prescribir el cómo técnico? |
| **V** Valiosa | ¿Entrega valor al usuario aunque las demás historias no estén hechas? |
| **E** Estimable | ¿El equipo puede estimar sin investigación previa? |
| **S** Small | ¿Tiene ≤ 3 escenarios Gherkin y ≤ 7 pasos totales? |
| **T** Testeable | ¿Los `Entonces` son verificables objetivamente? |

Si alguna historia no cumple **V** (no entrega valor por sí sola), revisar el patrón de splitting — probablemente se hizo corte horizontal en lugar de vertical.

---

### Fase 6 — Guardar y entregar el output

#### Derivar IDs para las historias resultantes

La **historia core** (identificada en Fase 3.5) conserva el ID de la historia original — no se le asigna un ID nuevo.

Las **historias adicionales** (las demás splits) reciben IDs nuevos consecutivos:

1. Listar todos los subdirectorios de `$SPECS_BASE/specs/stories/` cuyo nombre comience con `FEAT-`.
2. Extraer los números de todos los prefijos `FEAT-NNN` encontrados.
3. Tomar el número más alto y asignar IDs desde ese punto: `FEAT-(N+1)`, `FEAT-(N+2)`, etc.
4. Si no hay ninguno, comenzar en `FEAT-002` (reservando `FEAT-001` para la core).
5. Formatear con ceros a la izquierda hasta 3 dígitos.

#### Repurpose del directorio original como historia core

1. Renombrar el directorio `FEAT-{NNN}-{slug-original}/` a `FEAT-{NNN}-{slug-core}/`
   - El `{slug-core}` se deriva del `Quiero` de la historia core (mismas reglas: kebab-case, máx. 5 palabras, sin acentos ni caracteres especiales)
2. Reescribir `story.md` dentro del directorio renombrado con el contenido completo de la historia core
3. Actualizar su frontmatter:
   - `id: FEAT-{NNN}` (conservado)
   - `slug: FEAT-{NNN}-{slug-core}` (actualizado)
   - `status: SPECIFYING`
   - `substatus: IN‑PROGRESS`
   - Campo `related:` con los IDs de las historias adicionales: `[FEAT-{N+1}, FEAT-{N+2}, ...]`
4. Advertir al usuario (en el resumen final) que el directorio fue renombrado y que cualquier referencia al slug anterior en otros documentos debe actualizarse manualmente

#### Guardar cada historia adicional como directorio + archivo

Por cada historia adicional (no-core) resultante del split, crear en `$SPECS_BASE/specs/stories/`:

**Reglas de nomenclatura:**
- **Directorio:** `FEAT-{NNN}-{slug}/`
- **Archivo:** `story.md` dentro de ese directorio
- El `{slug}` se deriva del `Quiero` de la historia: minúsculas, palabras separadas por guiones, máximo 5 palabras significativas, sin acentos ni caracteres especiales
- Ruta final: `$SPECS_BASE/specs/stories/FEAT-{NNN}-{slug}/story.md`
- Ejemplos:
  - `$SPECS_BASE/specs/stories/FEAT-054-subir-imagenes-perfil/story.md`
  - `$SPECS_BASE/specs/stories/FEAT-055-recuperar-contrasena/story.md`

**Actualizar frontmatter** de cada `story.md` con `id: FEAT-{NNN}`, `slug: FEAT-{NNN}-{slug}` y `status: SPECIFYING` — estado inicial de toda historia resultante de un split (pendiente de re-evaluación).

**Contenido de cada archivo:** la historia completa en formato `story-template.md`, sin encabezados adicionales de sección (`## Historia 1`, etc.) — solo el contenido de la historia.

#### Mostrar resumen en pantalla

Después de guardar los archivos, mostrar el siguiente resumen en la conversación:

```
## Historia original
[Reproducir la historia tal como fue recibida]

## Diagnóstico
[Explicar por qué era demasiado grande y qué patrón se aplicó]

## Historias resultantes

### Historia 1 — {título corto}
**Archivo:** `$SPECS_BASE/specs/stories/FEAT-{NNN}-{slug}/story.md`
[Historia completa en formato story-template.md]

### Historia 2 — {título corto}
**Archivo:** `$SPECS_BASE/specs/stories/FEAT-{NNN+1}-{slug}/story.md`
[Historia completa en formato story-template.md]

...

## Notas del splitting
[Qué quedó fuera de scope, dependencias entre historias si las hay, sugerencias de orden de implementación]

## Archivos generados
- `$SPECS_BASE/specs/stories/FEAT-{NNN}-{slug-core}/story.md` ← **repurposed** (era `FEAT-{NNN}-{slug-original}/`)
- `$SPECS_BASE/specs/stories/FEAT-{N+1}-{slug-2}/story.md` ← nuevo
- `$SPECS_BASE/specs/stories/FEAT-{N+2}-{slug-3}/story.md` ← nuevo

> ⚠️ El directorio `FEAT-{NNN}-{slug-original}/` fue renombrado a `FEAT-{NNN}-{slug-core}/`.
> Actualiza manualmente cualquier referencia al slug anterior en `release.md` u otros documentos.
```

Si se generaron TADs en lugar de historias, explicar claramente que son experimentos previos a la escritura de historias. Los TADs **no se guardan como archivos**.

---

## Anti-patrones de splitting

| Anti-patrón | Problema | Corrección |
|---|---|---|
| Corte horizontal: "Historia 1: API. Historia 2: UI" | Ninguna entrega valor por sí sola | Corte vertical: cada historia incluye lo necesario para ser usable |
| Over-splitting: historia de 2 días dividida en 5 | Overhead innecesario | Solo dividir cuando hay señales claras de tamaño grande |
| Splits con el mismo `Para` | Se dividió la acción pero no el valor | Cada split debe tener un beneficio diferenciado |
| Dependencias duras entre splits: "el 2 bloquea al 3" | Anula el beneficio del splitting | Reordenar o replantear el patrón para minimizar bloqueos |
| Split arbitrario: "primera mitad / segunda mitad" | Sin racionalidad de valor o workflow | Usar uno de los 8 patrones con justificación explícita |
| Dejar la historia original con `status: SPLIT` como huérfana | El ID queda inutilizado; el backlog acumula ruido; git history pierde trazabilidad de la evolución | Repurpose el directorio y archivo originales como la historia core (Fase 3.5 + Fase 6) |

---

## Referencias

- **Template canónico:** `$SPECS_BASE/specs/templates/story-template.md`
- **Creación de historias:** `/story-creation`
- **Evaluación de calidad:** `/story-evaluation`
- Richard Lawrence & Peter Green, *Humanizing Work Guide to Splitting User Stories* — origen de los 8 patrones
- Bill Wake, *INVEST in Good Stories* (2003)
- Mike Cohn, *User Stories Applied* (2004)

