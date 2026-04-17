## 1. Lógica de detección de estado (skill-state-detection)

- [x] 1.1 Agregar sección "Verificar estado del documento de output" en `.claude/skills/ps-begin-intention/SKILL.md`: leer `docs/specs/project/project-intent.md`, detectar campo `**Estado**:` y bifurcar según valor (`Doing` → retoma, `Ready` → pedir confirmación, inexistente → continuar)
- [x] 1.2 Agregar sección "Verificar estado del documento de output" en `.claude/skills/ps-discovery/SKILL.md`: leer `docs/specs/project/requirement-spec.md`, aplicar misma lógica de bifurcación
- [x] 1.3 Agregar sección "Verificar estado del documento de output" en `.claude/skills/ps-planning/SKILL.md`: leer `docs/specs/project/project-plan.md`, aplicar misma lógica de bifurcación

## 2. Retoma de proyecto (project-retake)

- [x] 2.1 Agregar instrucción de retoma en el paso de delegación de `.claude/skills/ps-begin-intention/SKILL.md`: cuando el documento está en `Doing`, el agente debe leer el documento existente, identificar secciones con placeholders `[...]` y continuar solo con ellas
- [x] 2.2 Agregar instrucción de retoma en el paso de delegación de `.claude/skills/ps-discovery/SKILL.md`: misma lógica para `requirement-spec.md`
- [x] 2.3 Agregar instrucción de retoma en el paso de delegación de `.claude/skills/ps-planning/SKILL.md`: misma lógica para `project-plan.md`

## 3. Detección de conflicto WIP=1 (wip-conflict-detection)

- [x] 3.1 Agregar sección "Verificar WIP=1" al inicio de `.claude/skills/ps-begin-intention/SKILL.md`: verificar si existe algún documento en `docs/specs/project/` con `Estado: Doing`, notificar al usuario y ofrecer las opciones (sobrescribir / retomar)

## 4. Validación de precondición con Estado: Ready

- [x] 4.1 Actualizar la verificación de precondición en `.claude/skills/ps-discovery/SKILL.md`: además de verificar que `project-intent.md` existe, verificar que su `Estado` es `Ready` (no solo que el archivo existe)
- [x] 4.2 Actualizar la verificación de precondición en `.claude/skills/ps-planning/SKILL.md`: verificar que `requirement-spec.md` existe y tiene `Estado: Ready`

## 5. Feedback de transición (transition-feedback)

- [x] 5.1 Formalizar sección "Confirmar output" en `.claude/skills/ps-begin-intention/SKILL.md`: verificar que `project-intent.md` existe, confirmar con el path del archivo y sugerir `/ps-discovery` como siguiente comando
- [x] 5.2 Formalizar sección "Confirmar output" en `.claude/skills/ps-discovery/SKILL.md`: verificar que `requirement-spec.md` existe, confirmar con el path del archivo y sugerir `/ps-planning` como siguiente comando
- [x] 5.3 Formalizar sección "Confirmar output" en `.claude/skills/ps-planning/SKILL.md`: verificar que `project-plan.md` existe, confirmar con el path del archivo e indicar que el workflow está completo

## 6. Validación manual

- [x] 6.1 (**Revisión humana**) Ejecutar `/ps-begin-intention` sobre un `project-intent.md` existente en estado `Doing` y verificar que el agente retoma desde las secciones incompletas sin preguntar las ya completadas
- [x] 6.2 (**Revisión humana**) Ejecutar `/ps-begin-intention` sobre un `project-intent.md` existente en estado `Ready` y verificar que el skill pide confirmación antes de sobrescribir
- [x] 6.3 (**Revisión humana**) Ejecutar `/ps-begin-intention` con un documento en `Doing` en `docs/specs/project/` y verificar que el conflicto WIP es detectado y se ofrecen las dos opciones
- [x] 6.4 (**Revisión humana**) Ejecutar el workflow completo desde cero y verificar que al final de cada fase se muestra el path del documento generado y el siguiente comando
