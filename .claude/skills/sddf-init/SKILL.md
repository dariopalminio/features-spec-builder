---
name: sddf-init
description: "Inicializa el entorno SDDF en un proyecto nuevo: crea la estructura de directorios base (`<SPECS_BASE>/specs/projects/`, `<SPECS_BASE>/specs/releases/`, `<SPECS_BASE>/specs/stories/`), genera `openspec/config.yaml` mínimo y `.env.template` documentando `SDDF_ROOT`. Idempotente — no sobrescribe archivos ni directorios existentes."
---

# Skill: sddf-init

Inicializa el entorno base del framework SDDF en un proyecto. Es el primer paso del flujo de onboarding SDDF:

```
sddf-init → skill-preflight → [cualquier skill SDDF]
```

**Usar cuando:**
- Al configurar SDDF en un proyecto nuevo por primera vez
- Cuando `skill-preflight` reporta que faltan directorios base

**No hacer:**
- No carga contexto en `openspec/config.yaml` — eso es tarea de `openspec-init-config`
- No inicializa repositorio git
- No instala dependencias

---

## Protocolo de inicialización

### Paso 1 — Resolver SDDF_ROOT y determinar SPECS_BASE

1. Leer la variable de entorno `SDDF_ROOT`.
2. **Si `SDDF_ROOT` no está definida:**
   - Establecer `SPECS_BASE = docs`
3. **Si `SDDF_ROOT` está definida y la ruta existe:**
   - Establecer `SPECS_BASE = <valor de SDDF_ROOT>`
4. **Si `SDDF_ROOT` está definida pero la ruta NO existe:**
   - Emitir:
     ```
     [ERROR] SDDF_ROOT apunta a ruta inexistente: <ruta>
     Corrige SDDF_ROOT o elimina la variable para usar docs/ como valor por defecto
     ```
   - **Detener la ejecución. No crear ningún directorio ni archivo.**

### Paso 2 — Crear directorios de specs

Para cada uno de los siguientes directorios bajo `SPECS_BASE`:
- `specs/projects/`
- `specs/releases/`
- `specs/stories/`

Verificar si el directorio existe:
- **No existe:** crearlo y registrar `[CREADO]  <ruta>`
- **Ya existe:** no modificarlo y registrar `[YA EXISTÍA]  <ruta>`

Si algún directorio requiere rutas intermedias (ej. `SPECS_BASE/specs/`), crearlas también.

### Paso 3 — Generar openspec/config.yaml

Verificar si `openspec/config.yaml` existe y tiene contenido:
- **No existe (o existe vacío):**
  - Crear el directorio `openspec/` si no existe
  - Crear `openspec/config.yaml` usando exactamente el contenido del template en `.claude/skills/sddf-init/assets/config.yaml.template`
  - Registrar `[CREADO]  openspec/config.yaml`
- **Ya existe con contenido:**
  - No sobrescribirlo
  - Registrar `[YA EXISTÍA]  openspec/config.yaml` y emitir `[INFO] openspec/config.yaml ya existe — se mantiene sin cambios`

### Paso 4 — Generar .env.template

Verificar si `.env.template` existe en la raíz del proyecto:
- **No existe:**
  - Crear `.env.template` con el siguiente contenido exacto:
    ```
    # SDDF_ROOT — directorio raíz de los artefactos SDDF
    # Valor por defecto si no se define: docs
    # Ejemplos válidos: docs | .sdd | custom/specs
    #
    # Para aplicar, copia esta línea en tu archivo .env local o exporta la variable:
    #   export SDDF_ROOT=docs
    #
    SDDF_ROOT=docs
    ```
  - Registrar `[CREADO]  .env.template`
- **Ya existe:**
  - No sobrescribirlo
  - Registrar `[YA EXISTÍA]  .env.template` y emitir `[INFO] .env.template ya existe — se mantiene sin cambios`

### Paso 5 — Informe final

Emitir el informe consolidado con todos los artefactos verificados:

```
── sddf-init ────────────────────────────────────
[CREADO]     docs/specs/projects/
[CREADO]     docs/specs/releases/
[YA EXISTÍA] docs/specs/stories/
[CREADO]     openspec/config.yaml
[CREADO]     .env.template
─────────────────────────────────────────────────
```

**Si se creó al menos un artefacto:**
```
✓ Entorno SDDF inicializado correctamente en docs/
```

**Si todos los artefactos ya existían:**
```
✓ Entorno ya inicializado — sin cambios necesarios
```

Terminar la ejecución. El usuario puede continuar con `skill-preflight` o cualquier skill SDDF.
