## Context

El SDDF incluye ~20 skills en `.claude/skills/`. Cada uno repite en su "Paso 0" la misma secuencia de validaciones: verificar `SDDF_ROOT`, comprobar que existen los subdirectorios de specs, y en algunos casos validar templates y `config.yaml`. Esta duplicación genera:

- Inconsistencias entre skills (algunos validan más checks que otros).
- Mantenimiento distribuido: un cambio en la convención de rutas requiere actualizar 20+ archivos.
- Onboarding complicado: nuevos skills deben copiar la lógica o corren el riesgo de omitir validaciones críticas.

El skill `skill-preflight` actuará como módulo de inicialización invocable desde cualquier otro skill como primer paso.

## Goals / Non-Goals

**Goals:**
- Centralizar en un único SKILL.md todas las validaciones de entorno estándar del SDDF.
- Ofrecer un contrato claro: el skill recibe parámetros opcionales (lista de templates requeridos) y devuelve un resultado de estado (OK / WARNING / ERROR) con mensajes accionables.
- Permitir que cada skill existente reemplace su Paso 0 ad-hoc con: `Paso 0: Invocar skill-preflight`.
- Ser multicliente: funcionar en Claude Code, OpenCode y entornos compatibles sin dependencias externas más allá de Markdown/YAML/Bash.

**Non-Goals:**
- No reemplaza la lógica de negocio propia de cada skill (solo el entorno).
- No instala ni crea directorios faltantes automáticamente (solo reporta).
- No gestiona secretos ni credenciales.
- No reemplaza `openspec-init-config` para la inicialización completa del proyecto.

## Decisions

### D1: Skill puro en Markdown (sin script Bash independiente)

**Decisión:** El preflight se implementa como `SKILL.md` con instrucciones en lenguaje natural para el agente, usando pseudocódigo para describir las verificaciones. No se crea un `scripts/preflight.sh` como artefacto principal.

**Rationale:** El stack del SDDF es Markdown-first. Los scripts Bash son auxiliares opcionales. Un SKILL.md es interpretado por cualquier cliente compatible (Claude Code, OpenCode, Copilot) sin requerir ejecución de shell.

**Alternativa descartada:** Script Bash puro. Requeriría permisos de ejecución, no sería multicliente y rompería el modelo Markdown-first del framework.

### D2: Parámetros opcionales vía contexto de invocación

**Decisión:** El skill invocador pasa los templates requeridos como lista en el cuerpo de su invocación (ej.: `templates: [SKILL.md, assets/template.md]`). El preflight lee este contexto para verificar existencia de archivos específicos.

**Rationale:** Evita la necesidad de un sistema de argumentos formal. El agente LLM extrae los parámetros del contexto conversacional, alineado con la filosofía SDDF de "templates como fuente de verdad".

### D3: Resultado como texto estructurado (no código de salida)

**Decisión:** El preflight produce un bloque de texto con estado por verificación:
```
[OK]      SDDF_ROOT = /ruta/al/proyecto
[OK]      docs/specs/projects/ existe
[ERROR]   docs/specs/releases/ no encontrado → Crear el directorio antes de continuar
[WARNING] openspec/config.yaml no inicializado → Ejecutar /openspec-init-config
```
El skill invocador decide si detener o continuar según los ERRORs.

**Rationale:** Los agentes LLM procesan texto estructurado mejor que códigos de salida numéricos. Además, es legible para el usuario en la sesión de Claude Code.

## Risks / Trade-offs

- **[Riesgo] Adopción incremental:** Si los skills existentes no se actualizan para llamar al preflight, la centralización no aporta valor. → Mitigación: las tasks incluyen una fase de migración de los skills de mayor uso prioritario.
- **[Riesgo] Falsos negativos en entornos no estándar:** Proyectos con estructura diferente a la convención SDDF pueden recibir ERRORs incorrectos. → Mitigación: el preflight debe documentar claramente las convenciones asumidas y ofrecer un modo `--skip-dirs` implícito (el skill invocador puede indicar qué verificaciones aplican).
- **[Trade-off] Latencia adicional:** Cada skill añade un paso de invocación al preflight. En sesiones de Claude Code esto es despreciable (instrucciones en texto), pero en pipelines automatizados puede sumar turnos. → Aceptado: la coherencia supera el coste mínimo de latencia.
