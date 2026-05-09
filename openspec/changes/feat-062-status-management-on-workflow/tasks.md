## 1. story-refine / story-creation — Transiciones SPECIFYING

- [x] 1.1 En `story-creation` (o el paso de inicio de `story-refine`): añadir en el Paso 0 o Paso 1 la actualización de `story.md` frontmatter a `status: SPECIFYING` / `substatus: DOING` antes de comenzar
- [x] 1.2 En `story-refine`: al detectar que `story-evaluation` retorna `APROBADA`, actualizar `story.md` frontmatter a `status: SPECIFIED` / `substatus: DONE`
- [x] 1.3 En `story-refine`: cuando el usuario pausa con evaluación no aprobada, verificar que el frontmatter permanece en `status: SPECIFYING` / `substatus: DOING`
- [x] 1.4 Actualizar la sección de transiciones de estado en `.claude/skills/story-refine/SKILL.md` para reemplazar los valores `IN-PROGRESS`/`DONE` por `SPECIFYING/DOING` y `SPECIFIED/DONE`

## 2. story-plan — Transición PLANNING/DOING al inicio

- [x] 2.1 En `.claude/skills/story-plan/SKILL.md`, añadir en el Paso 1 (después de verificar `story.md`) la actualización del frontmatter a `status: PLANNING` / `substatus: DOING`
- [x] 2.2 Incluir en el resumen final del pipeline (Paso 5) una línea que confirme si la actualización de estado fue exitosa
- [x] 2.3 Documentar en el SKILL.md que la transición `PLANNING/DOING` se aplica incondicionalmente (incluso si la historia ya estaba en otro estado)

## 3. story-analyze — Transición PLANNED/DONE al finalizar

- [x] 3.1 En `.claude/skills/story-analyze/SKILL.md`, añadir en el Paso 9 (guardar el reporte) la actualización del frontmatter de `story.md` a `status: PLANNED` / `substatus: DONE` si no hay ERROREs
- [x] 3.2 Añadir la condición: si hay inconsistencias de tipo ERROR, NO actualizar el estado (dejar en `PLANNING/DOING`)
- [x] 3.3 Asegurarse de que la actualización de estado ocurre tanto en modo manual como en modo Agent (invocado por `story-plan`)
- [x] 3.4 Reflejar el estado resultante (`PLANNED/DONE` o `PLANNING/DOING`) en la sección de confirmación del Paso 10

## 4. story-implement — Precondición + transiciones IMPLEMENTING y IMPLEMENTED

- [x] 4.1 En `.claude/skills/story-implement/SKILL.md`, añadir en el Paso 1c la lectura del frontmatter de `story.md` y la verificación de `status: PLANNED` + `substatus: DONE`
- [x] 4.2 Si la precondición no se cumple: mostrar error descriptivo con el estado actual y sugerir `/story-plan`, detener la ejecución
- [x] 4.3 En el Paso 2 (inicio del contexto de carga), añadir la actualización del frontmatter a `status: IMPLEMENTING` / `substatus: DOING` antes de la primera tarea
- [x] 4.4 En el Paso 4 (después de generar `implement-report.md`): actualizar el frontmatter a `status: IMPLEMENTED` / `substatus: DONE`
- [x] 4.5 Actualizar el resumen final para mostrar el estado final de `story.md`

## 5. story-implement — Actualización del checklist en release.md

- [x] 5.1 En el Paso 4 de `story-implement`, después de actualizar el estado a `IMPLEMENTED/DONE`: leer el campo `parent` del frontmatter de `story.md`
- [x] 5.2 Buscar el archivo `release.md` correspondiente al `parent` en `$SPECS_BASE/specs/releases/<parent>-*/release.md`
- [x] 5.3 Si se encuentra, localizar la línea con el `story_id` (patrón `FEAT-NNN`) en el checklist del release y cambiar `- [ ]` por `- [x]`
- [x] 5.4 Si no se encuentra el `release.md` o la historia no está en el checklist: emitir WARNING en consola y en `implement-report.md`; NO bloquear la transición a `IMPLEMENTED/DONE`
- [x] 5.5 Añadir en el resumen final de `story-implement` una línea que informe el resultado de la actualización del release checklist

## 6. Documentación del ciclo de vida

- [x] 6.1 Actualizar el `assets/README.md` de `story-implement` para reflejar la precondición de estado y las nuevas transiciones
- [x] 6.2 Actualizar el `assets/README.md` de `story-plan` (o el SKILL.md) para reflejar la transición `PLANNING/DOING` al inicio
- [x] 6.3 Actualizar el `assets/README.md` de `story-refine` (o el SKILL.md) para reflejar las transiciones `SPECIFYING/DOING` y `SPECIFIED/DONE`
- [x] 6.4 Actualizar el posicionamiento en el flujo SDD en los SKILL.md afectados para mostrar los estados entre cada skill

## 7. Verificación

- [x] 7.1 Verificar que `story-refine` actualiza `story.md` a `SPECIFYING/DOING` al inicio de una nueva historia
- [x] 7.2 Verificar que al aprobar FINVEST en `story-refine`, `story.md` queda en `SPECIFIED/DONE`
- [x] 7.3 Verificar que `story-plan` actualiza `story.md` a `PLANNING/DOING` antes de invocar `story-design`
- [x] 7.4 Verificar que `story-analyze` actualiza `story.md` a `PLANNED/DONE` cuando no hay ERROREs
- [x] 7.5 Verificar que `story-analyze` NO actualiza el estado cuando hay inconsistencias ERROR-level
- [x] 7.6 Verificar que `story-implement` falla con error descriptivo si `story.md` no está en `PLANNED/DONE`
- [x] 7.7 Verificar que `story-implement` actualiza `story.md` a `IMPLEMENTING/DOING` antes del primer `[T001]`
- [x] 7.8 Verificar que `story-implement` actualiza `story.md` a `IMPLEMENTED/DONE` y el release checklist al finalizar
