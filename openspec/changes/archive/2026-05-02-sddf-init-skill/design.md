## Context

El framework SDDF asume que ciertos directorios y archivos de configuración ya existen antes de ejecutar cualquier skill. Actualmente, `skill-preflight` detecta cuándo faltan (emitiendo `[WARNING]` o `[ERROR]`), pero no los crea. El desarrollador debe crearlos a mano, lo que rompe el onboarding y genera fricción innecesaria.

La solución es una skill dedicada, `sddf-init`, que crea el entorno base en un único paso. Su diseño sigue el mismo patrón de todas las skills SDDF: un archivo `SKILL.md` con instrucciones en lenguaje natural para el agente IA. No requiere scripts, binarios ni dependencias externas.

## Goals / Non-Goals

**Goals:**
- Crear `$SPECS_BASE/specs/projects/`, `$SPECS_BASE/specs/releases/`, `$SPECS_BASE/specs/stories/` (o la ruta equivalente bajo `SDDF_ROOT`).
- Generar `openspec/config.yaml` mínimo (solo si no existe) con la estructura base (`schema: spec-driven` + comentarios del template).
- Generar `.env.template` documentando `SDDF_ROOT` (solo si no existe).
- Garantizar idempotencia: nunca sobrescribir ni eliminar contenido existente.
- Validar `SDDF_ROOT` antes de operar: si está definida pero la ruta no existe, abortar con mensaje de error accionable.

**Non-Goals:**
- Instalar dependencias (npm, pip, etc.).
- Configurar hooks de Claude Code.
- Inicializar repositorio git.
- Cargar contexto del proyecto en `openspec/config.yaml` (eso es responsabilidad de `openspec-init-config`).
- Exportar `SDDF_ROOT` al shell del usuario.

## Decisions

### Decisión 1 — Skill puro en Markdown, sin scripts

**Alternativas consideradas:**
- A) Script shell (`sddf-init.sh`) que crea dirs y archivos con `mkdir -p` y `touch`.
- B) Skill Markdown con instrucciones al agente IA para crear dirs/archivos con las herramientas disponibles.

**Elección: B.** Consistente con el patrón de todas las skills SDDF. No requiere permisos de ejecución, funciona en todos los entornos compatibles (Claude Code, OpenCode, Rovo, Gemini Gem), y el agente ya dispone de herramientas para crear directorios y archivos.

### Decisión 2 — `openspec/config.yaml` mínimo, no completo

`sddf-init` genera un `config.yaml` con solo `schema: spec-driven` y los comentarios del template original. El campo `context:` lo llena `openspec-init-config`. Esto mantiene separación de responsabilidades: `sddf-init` prepara la estructura física, `openspec-init-config` inyecta el contexto semántico.

### Decisión 3 — `.env.template` como artefacto documentado, no ejecutable

`sddf-init` genera `.env.template` con la variable `SDDF_ROOT` documentada. No ejecuta `export` ni modifica el entorno del shell. El desarrollador decide cómo y cuándo aplicar la variable (`.env` local, perfil de shell, CI/CD).

### Decisión 4 — Lógica de resolución de `SDDF_ROOT` replicada (no delegada a `skill-preflight`)

`sddf-init` se ejecuta **antes** de `skill-preflight` (es su predecesor en el onboarding). Por eso no puede invocar `skill-preflight` para resolver `SDDF_ROOT`. Replica la misma lógica de resolución descripta en `sddf-root-env-var` spec:
- Si `SDDF_ROOT` no está definida → usar `docs/` como raíz.
- Si `SDDF_ROOT` está definida y existe → usar esa ruta.
- Si `SDDF_ROOT` está definida pero no existe → abortar con `[ERROR]`.

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| El agente puede crear `openspec/config.yaml` con contenido extra (no solo el mínimo) | El SKILL.md especifica explícitamente el contenido mínimo y que no debe añadir nada más |
| El agente puede sobrescribir archivos existentes si no verifica antes | El SKILL.md debe ordenar explícitamente verificar existencia + contenido antes de crear cada artefacto |
| Divergencia entre lógica de `SDDF_ROOT` en `sddf-init` y en `skill-preflight` | Ambas specs (`sddf-init` y `sddf-root-env-var`) documentan el mismo contrato; si cambia uno, cambia el otro |
| El flujo `sddf-init → skill-preflight` no está documentado prominentemente | La spec de `skill-preflight` se actualiza para mencionar `sddf-init` como predecesor |
