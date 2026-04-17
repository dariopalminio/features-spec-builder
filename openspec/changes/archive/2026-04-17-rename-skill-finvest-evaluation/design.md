## Context

El skill `finvest-evaluation` está duplicado en cuatro ubicaciones del repositorio (`.claude/skills/`, `.agents/skills/`, `.github/skills/`, `rovo/`). El cambio afecta solo nomenclatura de directorio y referencias textuales; la lógica interna del skill no cambia.

## Goals / Non-Goals

**Goals:**
- Renombrar el directorio del skill en todas las ubicaciones espejo
- Actualizar toda referencia textual al nombre `finvest-evaluation` que identifique al skill (en SKILL.md, CLAUDE.md, rovo docs, etc.)
- Mantener la paridad entre todas las copias del skill

**Non-Goals:**
- Modificar la lógica, template o comportamiento del skill
- Cambiar la rúbrica FINVEST que aplica el skill
- Alterar otros skills del catálogo

## Decisions

**Renombrar directorio en lugar de crear alias**
Se renombra directamente el directorio. No se deja ningún directorio `finvest-evaluation` residual ni alias, dado que el skill no tiene dependencias externas (no es un paquete publicado ni una URL hardcodeada en sistemas externos).

**Actualizar referencias textuales con búsqueda exhaustiva**
Se usa `grep -r "finvest-evaluation"` para localizar todas las referencias antes de editar, evitando omisiones manuales.

**Orden de operaciones: renombrar primero, actualizar referencias después**
Renombrar el directorio primero garantiza que las referencias actualizadas apunten a la nueva ubicación real.

## Risks / Trade-offs

- [Referencia olvidada] Algún archivo no encontrado por grep puede quedar con el nombre antiguo → Mitigación: ejecutar grep post-cambio para verificar que no queden ocurrencias de `finvest-evaluation` referenciando el skill.
- [Historial git] El renombrado de directorio puede aparecer como delete+add en algunos clientes git → Mitigación: usar `git mv` para preservar el historial en los directorios relevantes.
