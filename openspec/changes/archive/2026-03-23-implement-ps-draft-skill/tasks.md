## 1. Template de Project Intent

- [x] 1.1 Crear directorio `.claude/skills/ps-draft/templates/` si no existe
- [x] 1.2 Crear `.claude/skills/ps-draft/templates/project-intent-template.md` adaptando la estructura de `docs/templates/project-intent-template.md`: secciones Problem Statement, Vision (elevator pitch), Success Criteria, Constraints, Non-Goals
- [x] 1.3 Agregar comentarios HTML de guía en cada sección indicando qué información capturar y cómo formular las preguntas

## 2. Agente Draft

- [x] 2.1 Crear `.claude/agents/draft-agent.md` con frontmatter YAML: `name: draft-agent`, `description`, `tools: [Read, Write, Edit, AskUserQuestion]`, `model: sonnet`
- [x] 2.2 Redactar el prompt del agente: instrucciones para leer `initial-prompt.md` y verificar el campo `**Estado**`
- [x] 2.3 Agregar lógica de validación de estado: si `IN‑PROGRESS` → preguntar al usuario si confirma avanzar; si confirma → usar `Edit` para cambiar `**Estado**` a `DONE`; si rechaza → detener y remitir a `/ps-funnel`
- [x] 2.4 Agregar instrucciones de entrevista: leer el template, pre-rellenar secciones con datos de `initial-prompt.md`, hacer preguntas de refinamiento por rondas (máx 3-4 por ronda), inferir contenido faltante con `[inferido]`
- [x] 2.5 Agregar instrucciones de escritura: crear `$SPECS_BASE/specs/project-intent.md` con estructura del template, contenido recopilado y metadatos (fecha, agente, `**substatus**: IN‑PROGRESS`)

## 3. Skill ps-draft

- [x] 3.1 Reescribir `.claude/skills/ps-draft/SKILL.md`: verificar existencia de `$SPECS_BASE/specs/initial-prompt.md`; si no existe → error con sugerencia de `/ps-funnel`
- [x] 3.2 Agregar verificación del template `.claude/skills/ps-draft/templates/project-intent-template.md`; si no existe → error
- [x] 3.3 Agregar paso de delegación al `draft-agent` con instrucción explícita de leer `initial-prompt.md`, validar estado, conducir entrevista y escribir `project-intent.md`
- [x] 3.4 Agregar confirmación final: verificar que `$SPECS_BASE/specs/project-intent.md` existe y confirmar al usuario con la ruta y el siguiente paso (`/ps-discover`)

## 4. Validación Manual

- [ ] 4.1 [Validación humana] Ejecutar `/ps-draft` con `initial-prompt.md` en estado `IN‑PROGRESS` y verificar que el agente pregunta si se confirma avanzar y actualiza el campo a `DONE`
- [ ] 4.2 [Validación humana] Ejecutar `/ps-draft` con `initial-prompt.md` en estado `DONE` y verificar el flujo completo de preguntas y el documento generado
- [ ] 4.3 [Validación humana] Revisar `$SPECS_BASE/specs/project-intent.md`: secciones completas, contenido inferido marcado, metadatos correctos
