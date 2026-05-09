---
name: story-creation
description: "Crea historias de usuario siguiendo el template story-gherkin (Como/Quiero/Para + Gherkin). Aplica los principios 3 C's, INVEST y el formato Mike Cohn. Output diseñado para superar la evaluación FINVEST."
---

# Skill: /story-creation

Crea una historia de usuario completa a partir de una necesidad o feature descrito en lenguaje natural. El output sigue **estrictamente** el template `$SPECS_BASE/specs/templates/story-template.md` definido en este skill.

**Usar cuando:**
- Se necesita redactar una historia de usuario lista para sprint planning
- Se quiere convertir un requisito o necesidad en una historia bien formada
- Se va a evaluar la historia con `/story-evaluation` y se quiere maximizar el score

---

## Modos de Ejecución

- **Modo manual** (`/story-creation {texto de descripción}`): el usuario proporciona la historia a crear en lenguaje natural, y el proceso es interactivo, muestra progreso en tiempo real
- **Modo Agent** (invocado por orquestador de nivel superior): automático, reporta resultado

---

## Template canónico (fuente de verdad)

### paso A. Verificar que el template existe y leerlo

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca codifique directamente los nombres o la estructura de las secciones en esta habilidad; siempre derréglelos de la plantilla en tiempo de ejecución. Si la plantilla cambia, el output generado se actualizará automáticamente.

El archivo de plantilla es de **solo lectura**. Nunca escriba en él, lo modifique ni lo use como ruta de salida.

Lee el archivo de plantilla `$SPECS_BASE/specs/templates/story-template.md`.

- Si el archivo **no existe**: informar al usuario y detener la ejecución:
  > ❌ No se encontró el template requerido en `$SPECS_BASE/specs/templates/story-template.md`.
  > Por favor verifica que el archivo existe antes de continuar.

- Si el archivo **existe**: continua.

### paso B. Guía de estructura y formato

Toda historia generada por este skill debe seguir **exactamente** la estructura de `$SPECS_BASE/specs/templates/story-template.md` leida en el paso A. No asumas que las secciones siempre estarán en el mismo orden o que tendrán los mismos nombres. Siempre completa dinámicamente la estructura de la plantilla en tiempo de ejecución, infiriendo la información, para asegurar flexibilidad ante cambios futuros en la estructura del template.:

Por ejemplo:

```markdown
## 📖 Historia

**Como** {rol o persona específica}
**Quiero** {acción concreta orientada al usuario}
**Para** {beneficio medible o valor real}

## ✅ Criterios de aceptación

### Escenario principal – {título descriptivo}
Dado {contexto inicial específico}
  Y {otra condición si aplica}
Cuando {acción del usuario}
Entonces {resultado esperado concreto}
  Y {otro resultado}

### Escenario alternativo / error – {título}
Dado {contexto}
Cuando {acción inválida o límite}
Entonces {mensaje de error o comportamiento alternativo}
  Pero {excepción si aplica}

### Escenario con datos (Scenario Outline) – opcional
Escenario: {título}
  Dado que el usuario tiene el rol "<rol>"
  Cuando intenta acceder a "{recurso}"
  Entonces ve "{mensaje}"
Ejemplos:
  | rol      | recurso | mensaje           |
  | invitado | /admin  | "Acceso denegado" |

### Requerimiento (opcional)
{Requerimiento específico (como regla de negocio) relacionado con la historia, si aplica}

## ⚙️ Criterios no funcionales (opcional)

* Rendimiento: {ej. respuesta < 2s}
* Seguridad: {ej. solo usuarios con rol X}
* UX/Accesibilidad: {ej. compatible con lectores de pantalla}

## 📎 Notas / contexto adicional
{Información relevante para desarrollo o QA. Scope out explícito si aplica.}

Este es solo un ejemplo, recuerda que el archivo de plantilla es la guía a completar.
```

---

## Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

## Proceso de creación

### Paso 0 — Resolver el input

El skill acepta tres tipos de input. Detectar cuál aplica antes de continuar:

#### Tipo A — Texto libre (necesidad o feature en lenguaje natural)
**Señal:** El input es una descripción en prosa o una historia incompleta.
**Acción:** Continuar directamente al Paso 1.

#### Tipo B — Ruta de archivo relativa
**Señal:** El input parece una ruta (contiene `/` o `\`, o termina en `.md`).
**Acción:** Leer el archivo en esa ruta y usar su contenido como base para crear o mejorar la historia. Continuar al Paso 1 con ese contenido.

#### Tipo C — Nombre de archivo o término de búsqueda
**Señal:** El input es una palabra o frase corta que no parece texto de historia ni ruta explícita.
**Acción:**
1. Buscar en `$SPECS_BASE/specs/stories/` archivos cuyo nombre contenga el término (sin distinguir mayúsculas)
2. Si hay exactamente 1 coincidencia → leerlo y usarlo como base. Continuar al Paso 1.
3. Si hay más de 1 coincidencia → mostrar la lista y pedir al usuario que elija antes de continuar.
4. Si no hay coincidencias → tratar el input como Tipo A (texto libre).

---

### Paso 1 — Recopilar contexto

Si el usuario no proporcionó suficiente información, preguntar:
- **¿Quién?** Persona o rol específico que se beneficia (no "usuario" genérico)
- **¿Qué?** Acción concreta que el usuario quiere realizar
- **¿Para qué?** Beneficio real, no restatement de la acción
- **¿Contexto?** Sistema, producto, restricciones relevantes

Si el input es suficiente, inferir los valores razonablemente sin preguntar.

### Paso 2 — Redactar `Como/Quiero/Para`

Aplicar los criterios de calidad de Mike Cohn y el marco 3 C's:

**Como** — Rol específico y contextualizado:
- ✅ "cliente registrado que olvidó su contraseña"
- ✅ "vendedor con pipeline activo"
- ❌ "usuario" (demasiado genérico)
- ❌ "el sistema" (no es un usuario)

**Quiero** — Acción orientada al usuario, no a la implementación:
- ✅ "recibir un enlace de recuperación a mi email"
- ✅ "filtrar mi lista de pedidos por estado"
- ❌ "que se implemente OAuth 2.0" (solución técnica)
- ❌ "login" (demasiado vago)

**Para** — Beneficio real y medible, no restatement:
- ✅ "acceder a mi cuenta sin contactar a soporte"
- ✅ "priorizar el seguimiento de mis leads más calientes"
- ❌ "poder entrar" (restatement de Quiero)
- ❌ "tener una mejor experiencia" (no medible)

### Paso 3 — Definir escenarios Gherkin

Reglas obligatorias:
1. **Mínimo 1 escenario principal** (happy path) en bloque ` ```gherkin `
2. **Mínimo 1 escenario alternativo o de error** en bloque ` ```gherkin `
3. Cada paso debe ser **específico y verificable** — incluir valores concretos cuando sea posible
4. Usar `Y` para precondiciones adicionales en `Dado`
5. Usar `Y` en `Entonces` para resultados múltiples del mismo escenario
6. Usar `Pero` para excepciones dentro de un escenario alternativo
7. Agregar **Scenario Outline** si hay variaciones por tipo de usuario, rol o datos de entrada

**Calidad de pasos Gherkin:**
- `Dado que el usuario "ana@ejemplo.com" tiene cuenta activa` ✅ (específico)
- `Dado que tengo usuario` ❌ (vago)
- `Entonces ve el mensaje "Contraseña actualizada correctamente"` ✅ (verificable)
- `Entonces funciona bien` ❌ (no testeable)

### Paso 4 — Verificar INVEST antes de entregar

Antes de producir el output, hacer una revisión interna rápida:

| Dimensión | Pregunta clave | Señal de alerta |
|---|---|---|
| **I** Independiente | ¿Se puede desarrollar sin esperar otra historia? | Menciona "depende de X primero" |
| **N** Negociable | ¿Documenta el qué/para qué sin prescribir el cómo técnico? | Incluye detalles de implementación |
| **V** Valiosa | ¿El `Para` expresa valor real para el usuario o el negocio? | `Para` es vago o solo técnico |
| **E** Estimable | ¿Un equipo puede estimar el esfuerzo con estos criterios? | Alcance indefinido o dependencias ocultas |
| **S** Small | ¿Hay ≤3 escenarios Gherkin y ≤7 pasos totales? | Muchos `Y` anidados o múltiples flujos principales |
| **T** Testeable | ¿Los `Entonces` son verificables objetivamente? | Resultados subjetivos o no observables |

Si alguna dimensión falla, ajustar la historia antes de entregar. Si `S` es demasiado grande, sugerir splitting.

### Paso 5 — Guardar y entregar el output

#### Derivar el siguiente ID (FEAT-NNN)

Antes de escribir el archivo, determinar el próximo número de feature:

1. Listar todos los subdirectorios de `$SPECS_BASE/specs/stories/` cuyo nombre comience con `FEAT-` o `FIX-`.
2. Extraer los números de todos los prefijos `FEAT-NNN` encontrados.
3. Tomar el número más alto y sumarle 1. Si no hay ninguno, comenzar en `FEAT-001`.
4. Formatear con ceros a la izquierda hasta 3 dígitos: `FEAT-001`, `FEAT-053`, etc.

#### Reglas de nomenclatura

- **Directorio:** `FEAT-{NNN}-{slug}/`
- **Archivo:** `story.md` dentro de ese directorio
- El `{slug}` se deriva del `Quiero` de la historia: minúsculas, palabras separadas por guiones, máximo 5 palabras significativas, sin acentos ni caracteres especiales
- Ruta final: `$SPECS_BASE/specs/stories/FEAT-{NNN}-{slug}/story.md`
- Ejemplos:
  - `$SPECS_BASE/specs/stories/FEAT-054-recuperar-contrasena-email/story.md`
  - `$SPECS_BASE/specs/stories/FEAT-055-filtrar-pedidos-por-estado/story.md`

#### Verificar conflicto de directorio

Si el directorio `FEAT-{NNN}-{slug}/` ya existe, incrementar NNN hasta encontrar uno disponible.

#### Actualizar frontmatter

En el archivo `story.md`, completar los campos del frontmatter con los valores resueltos:
- `id: FEAT-{NNN}`
- `slug: FEAT-{NNN}-{slug}`
- `status: SPECIFYING` — estado inicial de toda historia creada directamente (pendiente de evaluación)

#### Mostrar resumen en pantalla

Después de guardar el archivo, mostrar en la conversación:

```
**Archivo generado:** `$SPECS_BASE/specs/stories/FEAT-{NNN}-{slug}/story.md`

[Historia completa en formato story-template.md]

---
**Nota FINVEST:** Esta historia está lista para evaluarse con `/story-evaluation`.
```

Si la historia fue simplificada para cumplir INVEST, explicar brevemente qué se dejó fuera de scope y por qué.

---

## Anti-patrones frecuentes

| Anti-patrón | Problema | Corrección |
|---|---|---|
| `Como usuario, Quiero login, Para entrar` | Las 3 cláusulas son semánticamente vacías | Especificar rol, necesidad real y beneficio concreto |
| Criterios de aceptación como lista libre sin Gherkin | No supera gateway F de FINVEST | Usar bloques ` ```gherkin ` con Dado/Cuando/Entonces |
| Escenario único sin caso de error | Testeabilidad incompleta | Siempre agregar al menos 1 escenario alternativo |
| `Quiero que se use React con Redux` | Prescribe la solución técnica | Describir la necesidad del usuario, no la implementación |
| Historia que cubre 3 funcionalidades distintas | Épica disfrazada de historia | Usar `/user-story-splitting` para dividir |
| `Entonces el sistema funciona correctamente` | Criterio no verificable | Especificar el estado, mensaje o comportamiento observable |

---

## Ejemplo de output

```markdown
## 📖 Historia

**Como** cliente registrado que olvidó su contraseña
**Quiero** recibir un enlace de recuperación a mi email
**Para** poder acceder a mi cuenta sin contactar a soporte

## ✅ Criterios de aceptación

### Escenario principal – Recuperación exitosa
```gherkin
Dado que soy un usuario registrado con email "juan@example.com"
Cuando solicito recuperar mi contraseña
Entonces recibo un email con un enlace único de recuperación
  Y el enlace expira en exactamente 1 hora
```

### Escenario alternativo / error – Email no registrado
```gherkin
Dado que solicito recuperación con email "invalido@example.com"
Cuando el sistema verifica el email
Entonces veo el mensaje "No encontramos una cuenta con ese email"
  Pero no se envía ningún email
```

## ⚙️ Criterios no funcionales

* Seguridad: el enlace solo puede usarse una vez; se invalida tras el primer uso o expiración
* UX: se muestra confirmación de envío inmediatamente tras la solicitud

## 📎 Notas / contexto adicional

Flujo de recuperación vía email. SMS queda fuera de scope de esta historia.
```

---

## Referencias

- **Template canónico:** `$SPECS_BASE/specs/templates/story-template.md`
- **Evaluación de calidad:** `/story-evaluation`
- **División de historias grandes:** `/user-story-splitting`
- Mike Cohn, *User Stories Applied* (2004)
- INVEST criteria — Bill Wake (2003)

