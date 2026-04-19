## Context

El skill `story-finvest-evaluation` existe en tres ubicaciones paralelas: `.claude/skills/`, `.github/skills/` y `.agents/skills/`. Las tres deben renombrarse de forma consistente. El nombre actual incluye "finvest" (acrónimo de la rúbrica interna), lo que lo hace menos intuitivo para usuarios nuevos. El nuevo nombre `story-evaluation` es más genérico y alineado con los otros skills del workflow (`story-creation`, `story-split`).

## Goals / Non-Goals

**Goals:**
- Renombrar los tres directorios del skill a `story-evaluation`
- Actualizar el campo `name` en cada SKILL.md
- Actualizar todas las referencias externas (README, agentes Rovo, skills relacionados)
- Mantener comportamiento idéntico tras el rename

**Non-Goals:**
- Modificar la lógica, templates o rúbrica FINVEST del skill
- Renombrar otros skills del workflow (`story-creation`, `story-split`)

## Decisions

**`git mv` para el directorio `.claude/skills/`**: Preserva historial de git en el directorio principal.

**Rename directo con `mv` para `.github/skills/` y `.agents/skills/`**: Estos directorios son mirrors/copias y no requieren trazabilidad de historial detallada.

**No crear alias ni compatibilidad hacia atrás**: No hay dependencias externas conocidas que consuman el nombre por string hardcodeado fuera de los archivos del repositorio.

## Risks / Trade-offs

- [Múltiples ubicaciones] El skill existe en tres directorios → Mitigación: tratar cada rename secuencialmente y verificar con Grep al final.
- [Referencias en rovo/] Los agentes Rovo pueden referenciar el nombre antiguo → Mitigación: Grep previo para identificar todos los archivos antes de editar.
