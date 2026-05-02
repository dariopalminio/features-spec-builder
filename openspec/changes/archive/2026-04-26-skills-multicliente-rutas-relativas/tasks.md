## 1. Skills con referencias propias (self-referencing)

Reemplazar `.claude/skills/<skill>/templates/<template>` → `templates/<template>` en cada SKILL.md listado.

- [x] 1.1 `project-begin/SKILL.md` — 3 referencias a `project-intent-template.md` (líneas 40, 45, 52)
- [x] 1.2 `project-discovery/SKILL.md` — 3 referencias a `project-template.md` (líneas 46, 51, 70)
- [x] 1.3 `project-planning/SKILL.md` — 3 referencias a `project-plan-template.md` (líneas 45, 50, 79)
- [x] 1.4 `release-format-validation/SKILL.md` — 3 referencias a `release-spec-template.md` (líneas 7 descripción, 50, 113)
- [x] 1.5 `release-generate-stories/SKILL.md` — 1 referencia a `story-gherkin-template.md` (línea 7 descripción)
- [x] 1.6 `release-generate-all-stories/SKILL.md` — 1 referencia a `story-gherkin-template.md` (línea 7 descripción)
- [x] 1.7 `releases-from-project-plan/SKILL.md` — 1 referencia a `release-spec-template.md` (línea 7 descripción)
- [x] 1.8 `reverse-engineering/SKILL.md` — 2 referencias a `project-template.md` (líneas 26, 31)
- [x] 1.9 `story-creation/SKILL.md` — 3 referencias a `story-gherkin-template.md` (líneas 8 descripción, 19, 250)
- [x] 1.10 `story-split/SKILL.md` — 3 referencias a `story-gherkin-template.md` (líneas 8 descripción, 193, 320)
- [x] 1.11 `story-evaluation/SKILL.md` — 2 referencias: `story-gherkin-template.md` (línea 26) y `evaluation-output-template.md` (línea 228)

## 2. Skill orquestador con referencias cruzadas

`project-flow/SKILL.md` referencia templates de otros skills (project-begin, project-discovery, project-planning). Estas son referencias cruzadas entre skills, no self-references.

- [x] 2.1 Analizar las 6 referencias cruzadas en `project-flow/SKILL.md` (líneas 71, 77, 128, 146, 194, 200)
- [x] 2.2 Reemplazar referencias cruzadas: usar ruta relativa desde raíz del proyecto (`.claude/skills/<skill>/templates/`) es aceptable aquí porque el contexto de ejecución es el proyecto, no el skill activo. Alternativamente, eliminar las referencias explícitas y delegar la lectura del template a cada sub-skill invocado.

## 3. Verificación post-cambio

- [x] 3.1 Ejecutar Grep de `.claude/skills/` en todos los SKILL.md para confirmar que no quedan referencias al patrón antiguo (excepto las referencias cruzadas aceptadas en project-flow si se decide mantenerlas)
- [x] 3.2 Verificar que todos los templates referenciados existen en `templates/` de su skill correspondiente (ningún template renombrado o faltante)
- [x] 3.3 Ejecutar `/story-creation` con input de prueba y confirmar que el skill lee su template correctamente con la nueva ruta

## 4. Actualizar spec

- [x] 4.1 Confirmar que el delta spec en `specs/skill-template-autonomy/spec.md` refleja el MODIFIED requirement correctamente antes de archivar
