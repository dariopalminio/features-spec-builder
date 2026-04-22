## Context

El framework SDDF ya genera `docs/specs/project/project-plan.md` mediante el skill `project-planning`, que incluye la sección "## Propuesta de Releases" con bloques `### Release NN — Nombre` conteniendo objetivo, features asignadas y criterios de éxito. El template `docs/specs/templates/release-spec-template.md` define el formato canónico de un archivo de release.

El gap actual: no existe ningún mecanismo para transformar esos releases planificados en archivos de especificación listos para usar. El desarrollador debe crear cada archivo manualmente.

El nuevo skill `releases-from-project-plan` cierra ese gap. Siguiendo el patrón SDDF, es un skill puramente Markdown: no requiere código ejecutable, opera con instrucciones al LLM y herramientas nativas de lectura/escritura de archivos.

## Goals / Non-Goals

**Goals:**
- Leer `docs/specs/project/project-plan.md` y extraer todos los bloques de release
- Generar un archivo `release-[ID]-[Nombre-kebab].md` por release, en `docs/specs/releases/`
- Poblar cada archivo con los datos disponibles del plan siguiendo `release-spec-template.md`
- Informar con mensajes claros cuando el archivo de plan no existe o no tiene releases
- Crear el directorio `docs/specs/releases/` si no existe

**Non-Goals:**
- Validar el formato del archivo generado (responsabilidad de FEAT-027 / `release-format-validation`)
- Generar historias de usuario desde el release (responsabilidad de FEAT-029)
- Modificar `project-plan.md`
- Soportar múltiples planes de proyecto como input

## Decisions

### D1 — Skill Markdown puro (sin código ejecutable)

**Decisión:** Implementar como `SKILL.md` con instrucciones al LLM, igual que `release-format-validation` y `story-creation`.

**Rationale:** Consistencia con la filosofía SDDF ("solo archivos Markdown"). El LLM puede leer `project-plan.md`, parsear la sección de releases y escribir múltiples archivos en una sola sesión sin necesidad de scripts.

**Alternativa descartada:** Script Python que parsee el Markdown. Añade dependencia de runtime y rompe el principio de zero-code del framework.

### D2 — Punto de entrada: sección "## Propuesta de Releases"

**Decisión:** El skill busca la sección `## Propuesta de Releases` en `project-plan.md` y dentro de ella extrae los bloques `### Release NN — Nombre`.

**Rationale:** Es la estructura canónica generada por `project-planning`. Anclar a este encabezado hace el parsing robusto ante contenido adicional en el plan.

**Alternativa descartada:** Buscar cualquier `### Release` en todo el documento. Demasiado frágil si el plan tiene secciones con ese patrón por otras razones.

### D3 — Naming de archivos: `release-[ID]-[nombre-kebab].md`

**Decisión:** El ID se extrae del número del release (ej. `00`, `01`); el nombre se convierte a kebab-case eliminando caracteres especiales.

**Rationale:** Consistente con el patrón `story-{slug}.md` usado en stories. Permite identificar releases a simple vista y ordenarlos numéricamente.

### D4 — Secciones opcionales con placeholder

**Decisión:** Las secciones opcionales del template (Requerimiento, Impacto, Dependencias, Riesgos, Criterios de éxito, Notas) se incluyen en el archivo generado con placeholder `[Por completar]` cuando no hay datos en el plan.

**Rationale:** Un archivo completo en estructura (aunque con placeholders) supera la validación de `release-format-validation` y requiere menos edición manual que un archivo parcial.

## Risks / Trade-offs

- **Variación en la estructura de project-plan.md** → El skill debe ser tolerante: si la sección "## Propuesta de Releases" no sigue exactamente el patrón esperado, informar al usuario qué sección no pudo parsear en lugar de fallar silenciosamente.

- **Releases con nombres largos o caracteres especiales** → El slug kebab-case puede quedar truncado o con caracteres inválidos. Mitigación: el skill limpia el nombre (lowercase, reemplaza espacios y caracteres no alfanuméricos por guiones, elimina guiones dobles).

- **Sobreescritura de archivos existentes** → Si ya existe `docs/specs/releases/release-01-nombre.md`, el skill debe avisar antes de sobreescribir. Mitigación: incluir fase de verificación de existencia en las instrucciones del skill.
