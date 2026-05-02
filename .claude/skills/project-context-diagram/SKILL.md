---
name: project-context-diagram
description: >
  Genera un diagrama de contexto C4 Nivel 1 (System Context) en PlantUML para el proyecto activo.
  Soporta dos modos: `--interactive` (preguntas guiadas sobre actores, sistemas externos y relaciones)
  y `--from-files` (inferencia automática desde documentos de specs y código fuente).
  Escribe el resultado en `<SPECS_BASE>/specs/projects/<PROJ-slug>/context-diagram.puml`.
triggers:
  - /project-context-diagram
  - /context-diagram
license: MIT
compatibility: Claude Code, GitHub Copilot, OpenCode
metadata:
  author: sddf
  version: "1.0"
---

# Skill: /project-context-diagram

Genera un **diagrama de contexto C4 Nivel 1** (System Context) en formato PlantUML para el proyecto activo en SDDF.
El diagrama describe cómo el sistema principal interactúa con actores externos (personas/roles) y sistemas adyacentes.

**Usar cuando:**
- Se quiere documentar la arquitectura de contexto de un proyecto junto al resto de los artefactos de specs
- Se necesita comunicar a stakeholders el scope del sistema y sus integraciones externas
- Se va a comenzar la especificación de un proyecto (complementa `/project-planning`)

---

## Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

## Paso A — Leer y validar el template PlantUML

Lee el archivo `assets/c4-context-template.puml` de este skill.

- Si el archivo **no existe** → detener la ejecución con:
  > ❌ No se encontró el template requerido en `assets/c4-context-template.puml`.  
  > Por favor verifica que el archivo existe antes de continuar.

- Si el archivo **existe** → continuar. El template es la guía estructural del diagrama de salida.

---

## Paso 0 — Detectar modo de operación

El skill acepta tres formas de invocación:

### Modo A — `--interactive` (por defecto)
**Señal:** No se pasan argumentos, o se pasa explícitamente `--interactive`.  
**Acción:** Continuar al **Modo interactivo**.

### Modo B — `--from-files` sin ruta
**Señal:** Se pasa `--from-files` sin ninguna ruta adicional.  
**Acción:** Continuar al **Modo from-files** (escaneo del proyecto activo).

### Modo C — Ruta de archivo explícita
**Señal:** El argumento contiene `/`, `\` o termina en `.md` (parece una ruta).  
**Acción:** Verificar si el archivo existe:
- **Existe** → leerlo y continuar al **Modo from-files** con ese documento como input.
- **No existe** → mostrar error y continuar al **Fallback interactivo**:
  > ❌ No se encontró el archivo de especificaciones indicado: `<ruta>`

---

## Modo interactivo (`--interactive`)

Formular las siguientes preguntas al usuario en orden. No omitir ninguna:

### 1. Sistema principal
- **Nombre del sistema:** ¿Cómo se llama el sistema que estás documentando?
- **Descripción breve:** ¿Qué hace este sistema en una frase?

### 2. Actores (personas o roles que interactúan con el sistema)
Preguntar en loop hasta que el usuario indique que no hay más actores:
- **Nombre del actor:** ¿Cómo se llama este actor o rol?
- **Descripción:** ¿Cuál es su rol o cómo interactúa con el sistema?
- *(Preguntar: ¿Hay otro actor? Sí / No)*

### 3. Sistemas externos
Preguntar en loop hasta que el usuario indique que no hay más sistemas externos:
- **Nombre del sistema externo:** ¿Cómo se llama el sistema externo?
- **Descripción:** ¿Qué hace ese sistema? ¿Qué provee o consume?
- **Protocolo de comunicación:** ¿Qué protocolo o tecnología usa la integración? (ej: REST API, SMTP, WebSocket, SDK, etc.)
- *(Preguntar: ¿Hay otro sistema externo? Sí / No)*

### 4. Relaciones
Para cada actor y sistema externo recopilado, preguntar:
- **¿Qué hace `<actor/sistema_ext>` con el sistema `<nombre_sistema>`?** Describe la interacción en una frase corta.
- El sentido de la relación puede ser: actor → sistema, sistema → sistema_ext, o sistema_ext → sistema.

---

## Modo from-files (`--from-files`)

Escanear los siguientes archivos en orden de prioridad para inferir los elementos del diagrama:

1. **`$SPECS_BASE/specs/projects/*/project.md`** — leer si existe; extraer nombre del sistema, actores mencionados ("Como un..."), sistemas externos e integraciones.
2. **`$SPECS_BASE/specs/projects/*/project.md`** — leer si existe; extraer actores, integraciones y restricciones de integración.
3. **`README.md`** — extraer nombre del sistema, descripción y sistemas mencionados.
4. **`package.json` / `pyproject.toml` / `*.csproj`** — inferir stack tecnológico como hint para protocolos.
5. **Imports del Código fuente** — buscar imports de servicios conocidos (Stripe, SendGrid, AWS SDK, Firebase, etc.) para inferir sistemas externos.
6. **Código fuente** — analizar el código fuente para buscar menciones de actores o sistemas en comentarios o strings (ej: "Como un admin...") o deducir estructura de sistema de contexto.

Construir los elementos `Person`, `System`, `System_Ext` y `Rel` a partir de la información recopilada.

**Siempre mostrar preview antes de escribir** (ver Paso 2).

---

## Fallback interactivo (cuando el archivo indicado no existe)

1. Mostrar: `❌ No se encontró el archivo de especificaciones indicado: <ruta>`
2. Listar los proyectos disponibles en `$SPECS_BASE/specs/projects/` (mostrar nombres de directorios).
3. Ofrecer al usuario:
   - **Opción A:** Seleccionar uno de los proyectos listados y continuar en modo `--from-files` con su `project.md`.
   - **Opción B:** Continuar en modo `--interactive` con preguntas guiadas.

---

## Paso 1 — Generar el diagrama PlantUML

Con los datos recopilados (interactivo o inferidos), construir el contenido PlantUML usando `assets/c4-context-template.puml` como estructura base:

1. Sustituir los placeholders del template con los datos reales.
2. Añadir un elemento `Person(id, "Nombre", "Descripción")` por cada actor.
3. Añadir el elemento `System(id, "Nombre", "Descripción")` para el sistema principal.
4. Añadir un elemento `System_Ext(id, "Nombre", "Descripción")` por cada sistema externo.
5. Añadir un elemento `Rel(origen, destino, "etiqueta", "protocolo")` por cada relación.
6. Añadir el `title` con el nombre del sistema.

**Reglas de semántica C4 estricta:**
- Usar únicamente `Person()`, `System()`, `System_Ext()` y `Rel()` (Nivel 1 — ningún elemento de Nivel 2 o 3).
- No usar `Container()`, `Component()`, `ContainerDb()` ni elementos de niveles superiores.
- El sistema principal siempre es exactamente **un** `System()`.

---

## Paso 2 — Preview y confirmación

Mostrar en la conversación el diagrama PlantUML generado completo:

```
Vista previa del diagrama:

[contenido del diagrama PlantUML]
```

Luego preguntar:
> ¿El diagrama está correcto? (Sí / No / Editar)
- **Sí** → continuar al Paso 3.
- **No / Editar** → volver al paso correspondiente para corregir actores, sistemas o relaciones, luego regenerar.

---

## Paso 3 — Determinar ruta de salida y escribir el archivo

### 3.1 — Identificar el proyecto destino

Si se está en modo `--from-files` con un documento específico, usar el slug del directorio de ese documento.

Si se está en modo `--interactive`, preguntar:
> ¿En qué proyecto deseas guardar el diagrama?
Listar los directorios disponibles en `$SPECS_BASE/specs/projects/` y pedir al usuario que elija uno.

Si el directorio del proyecto no existe → mostrar:
> ❌ El proyecto `<PROJ-slug>` no existe en `$SPECS_BASE/specs/projects/`. Lista de proyectos disponibles: [...]

### 3.2 — Verificar si el archivo ya existe

Comprobar si `$SPECS_BASE/specs/projects/<PROJ-slug>/context-diagram.puml` ya existe:
- **No existe** → escribir el archivo directamente.
- **Ya existe** → preguntar al usuario:
  > ⚠️ Ya existe un `context-diagram.puml` en `$SPECS_BASE/specs/projects/<PROJ-slug>/`. ¿Deseas sobreescribirlo? (Sí / No)
  - **Sí** → sobreescribir.
  - **No** → detener sin escribir.

### 3.3 — Escribir el archivo

Escribir el contenido PlantUML generado en `$SPECS_BASE/specs/projects/<PROJ-slug>/context-diagram.puml`.

---

## Paso 4 — Confirmar resultado

Mostrar:

```
✅ Diagrama de contexto C4 generado:
   $SPECS_BASE/specs/projects/<PROJ-slug>/context-diagram.puml

Para renderizarlo localmente, instala la extensión PlantUML en VS Code
(ext: jebbs.plantuml) o visita https://www.plantuml.com/plantuml

Siguiente paso sugerido: /project-planning
```

---

## Anti-patrones frecuentes

| Anti-patrón | Problema | Corrección |
|---|---|---|
| Usar `Container()` en un diagrama de contexto | Mezcla niveles C4 | Solo usar `Person()`, `System()`, `System_Ext()` y `Rel()` |
| Sistema principal con más de un `System()` | Viola la semántica C4-L1 | El sistema en foco siempre es exactamente uno |
| Relaciones sin etiqueta | Diagrama no comunica las interacciones | Siempre incluir una etiqueta descriptiva en cada `Rel()` |
| Actores técnicos como "Base de datos" en `Person()` | `Person` es solo para humanos/roles | Usar `System_Ext()` para sistemas externos técnicos |

---

## Referencias

- **Template C4:** `assets/c4-context-template.puml`
- **Librería C4-PlantUML:** https://github.com/plantuml-stdlib/C4-PlantUML
- **Evaluación del diagrama:** revisar manualmente contra los criterios C4 Nivel 1 de Simon Brown
- Simon Brown, *The C4 Model for Visualising Software Architecture* (c4model.com)
