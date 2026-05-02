## REMOVED Requirements

### Requirement: ps-project-spec skill exists and is invocable
**Reason**: Skill renombrado a `project-discovery-skill`. El directorio `.claude/skills/ps-project-spec/` y el comando `/ps-project-spec` ya no existen.
**Migration**: Usar `/project-discovery` en lugar de `/ps-project-spec`.

### Requirement: ps-project-spec requires project-intent.md as input
**Reason**: Reemplazado por `project-discovery-skill` con comportamiento equivalente.
**Migration**: Ver requisito equivalente en `project-discovery-skill`.

### Requirement: ps-project-spec produces requirement-spec.md
**Reason**: Reemplazado por `project-discovery-skill` con el mismo documento de salida.
**Migration**: Ver requisito equivalente en `project-discovery-skill`.

### Requirement: ps-project-spec uses project-architect as primary agent
**Reason**: Reemplazado por `project-discovery-skill` con los mismos agentes.
**Migration**: Ver requisito equivalente en `project-discovery-skill`.

### Requirement: ps-project-spec template exists
**Reason**: Template movido a `.claude/skills/project-discovery/templates/project-template.md`.
**Migration**: Ver requisito equivalente en `project-discovery-skill`.
