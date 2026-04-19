## Context

El skill `project-begin-intention` es el punto de entrada del pipeline ProjectSpecFactory. Actualmente reside en `.claude/skills/project-begin-intention/`. El nombre es redundante: "begin" e "intention" expresan lo mismo y resulta más largo de lo necesario comparado con los demás skills del proyecto (`project-discovery`, `project-planning`). El nuevo nombre `project-begin` es más conciso y alineado con el patrón `project-<fase>`.

## Goals / Non-Goals

**Goals:**
- Renombrar el directorio del skill de `project-begin-intention` a `project-begin`
- Actualizar todas las referencias internas al nombre anterior
- Mantener comportamiento idéntico tras el rename

**Non-Goals:**
- Cambiar la lógica, templates o agentes del skill
- Renombrar otros skills del pipeline
- Modificar el spec `project-begin-intention-skill` más allá de reflejar el nuevo nombre

## Decisions

**Rename directo con `mv`**: Se usa un simple rename de directorio en lugar de crear un nuevo directorio y copiar archivos, ya que no hay cambio de comportamiento ni de contenido.

**Actualizar referencias en archivos internos**: El `SKILL.md` dentro del directorio puede referenciar el nombre antiguo en su trigger o descripción — se actualizan in-place con Edit.

**No crear alias ni compatibilidad hacia atrás**: No hay dependencias externas que consuman el nombre del directorio directamente. El sistema de skills de Claude Code carga skills por nombre de directorio, por lo que el rename es suficiente.

## Risks / Trade-offs

- [Referencia rota] Si algún archivo externo (CLAUDE.md, MEMORY.md, README) referencia `project-begin-intention` explícitamente → Mitigación: búsqueda con Grep antes de ejecutar.
- [Histórico de git] El rename aparece como delete + add en git si no se usa `git mv` → Mitigación: usar `git mv` para preservar historial.
