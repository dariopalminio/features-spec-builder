## Context

Actualmente, todos los skills del framework SDDF resuelven rutas de artefactos usando la cadena literal `docs` (e.g., `$SPECS_BASE/specs/projects/`, `$SPECS_BASE/specs/stories/`). Esta ruta está embebida directamente en el cuerpo de cada `SKILL.md`, lo que significa que cualquier usuario que necesite almacenar artefactos en una ubicación distinta debe editar manualmente cada skill.

El framework ya usa variables de entorno para otras configuraciones. Extender este patrón a la ruta raíz de specs es consistente con la filosofía del framework y no requiere ninguna infraestructura nueva.

Stakeholders: usuarios finales del framework (developers, PMs), contribuidores de skills.

## Goals / Non-Goals

**Goals:**
- Cada skill lee `SDDF_ROOT` al inicio de su ejecución y construye todas sus rutas a partir del valor resultante.
- Fallback a `docs` cuando `SDDF_ROOT` no está definida (retrocompatibilidad total).
- Advertencia visible cuando `SDDF_ROOT` apunta a una ruta inexistente.
- Documentación del mecanismo en el README del proyecto.

**Non-Goals:**
- No se crea ningún script de instalación ni se modifica el entorno del usuario.
- No se centraliza la lógica en un script compartido; cada skill lee la variable de forma autónoma.
- No se soportan múltiples variables de entorno (una sola: `SDDF_ROOT`).
- No se valida el formato de la ruta más allá de comprobar si existe.

## Decisions

### Decisión 1: Lectura inline en cada SKILL.md, sin helper centralizado

**Elegido**: Cada `SKILL.md` incluye el bloque de lectura directamente en su sección de ejecución.

```bash
SPECS_BASE="${SDDF_ROOT:-docs}"
if [ ! -d "$SPECS_BASE" ]; then
  echo "⚠️  La ruta definida en SDDF_ROOT no existe. Se usará el valor por defecto: docs"
  SPECS_BASE="docs"
fi
```

**Alternativa descartada**: Script compartido `sddf-env.sh` importado por todos los skills.
- Requeriría que los skills ejecuten scripts externos, añadiendo una dependencia frágil.
- Los skills de Claude Code son instrucciones de texto (Markdown); un helper externo rompe la portabilidad a otras plataformas (OpenCode, Copilot).
- La duplicación es mínima (3 líneas) y preferible a la complejidad de un helper.

### Decisión 2: Variable única `SDDF_ROOT`, sin aliases

**Elegido**: Una sola variable de entorno `SDDF_ROOT`.

**Alternativa descartada**: Variables por nivel (`SDDF_STORIES_DIR`, `SDDF_RELEASES_DIR`, etc.).
- Añade complejidad innecesaria para el caso de uso real.
- La mayoría de los usuarios solo necesita reubicar la raíz completa.

### Decisión 3: Advertencia y fallback en lugar de error fatal

**Elegido**: Advertencia + fallback a `docs` cuando la ruta no existe.

**Alternativa descartada**: Fallar con error cuando `SDDF_ROOT` es inválida.
- Un error fatal bloquea el flujo de trabajo del usuario sin posibilidad de recuperación automática.
- El fallback permite continuar trabajando mientras el usuario corrige la variable.

## Risks / Trade-offs

- **[Riesgo] Inconsistencia entre skills**: Si algún skill no es actualizado, los artefactos se crearán en `docs` mientras otros van a `SDDF_ROOT`. → Mitigación: la lista de skills afectados en la historia es exhaustiva y las tasks cubren todos los skills.
- **[Riesgo] Rutas con espacios o caracteres especiales**: Bash puede fallar si `SDDF_ROOT` contiene espacios sin comillas. → Mitigación: la lectura usa `"${SDDF_ROOT:-docs}"` con comillas dobles; documentar en README que se recomienda evitar espacios.
- **[Trade-off] Duplicación de 3 líneas**: Leve duplicación vs. portabilidad y simplicidad. Aceptado.

## Migration Plan

1. Actualizar cada `SKILL.md` de la lista de skills afectados añadiendo el bloque de lectura de `SDDF_ROOT` al inicio de la sección de ejecución.
2. Sustituir todas las referencias a la ruta literal `docs` dentro del skill por `$SPECS_BASE`.
3. Actualizar `README.md` con la sección de configuración de `SDDF_ROOT`.
4. Verificar con prueba representativa en ambos modos (con y sin variable definida).

**Rollback**: Revertir los archivos `SKILL.md` modificados. No hay cambios de estado ni migraciones de datos.

## Open Questions

- ¿Debería `SDDF_ROOT` incluir o excluir el sufijo `/specs/`? Decisión: excluir — la variable apunta a la raíz del directorio de documentación (`docs` o `.sdd`), y los skills construyen el sub-path (`$SPECS_BASE/specs/...`) internamente. Esto es más flexible y consistente con el fallback actual.
