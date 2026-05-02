## 1. Template

- [x] 1.1 Create `.claude/skills/ps-approval/templates/clarifications-template.md` with `##` section headers and `<!-- -->` guidance comments covering: Resumen de Hallazgos, Hallazgos por Perfil (PM / Arquitecto / UX), Preguntas y Respuestas (grouped by theme), and Estado de Clarificaciones (Resueltas / Pendientes)
- [x] 1.2 Verify the template follows the same structural conventions as `project-template.md` (metadata block at top, `**Estado**` field, `**Generado por**` field)

## 2. Approval Agent

- [x] 2.1 Create `.claude/agents/approval-agent.md` with YAML frontmatter: `name: approval-agent`, `description: ...`, `tools: [Read, Write, Edit, AskUserQuestion]`, `model: sonnet`
- [x] 2.2 Add Paso 1: Leer los cuatro documentos de entrada (`initial-prompt.md`, `project-intent.md`, `discovery.md`, `requirement-spec.md`) desde `docs/specs/projects/`
- [x] 2.3 Add Paso 2: Validar Estado de `requirement-spec.md` — si `Doing`, preguntar confirmación; si confirma, cambiar a `Ready` y continuar; si rechaza, detener
- [x] 2.4 Add Paso 3: Extraer secciones del template en runtime (headers `##` + comentarios `<!-- -->`) — sin preguntas hardcodeadas
- [x] 2.5 Add Paso 4: Análisis multi-lente — aplicar los tres perfiles (PM, Arquitecto, UX) para generar hallazgos diferenciados antes de formular preguntas
- [x] 2.6 Add Paso 5: Entrevista interactiva — presentar preguntas agrupadas por tema (máx 3-4 por ronda), permitir seguimiento en respuestas críticas, registrar todas las respuestas
- [x] 2.7 Add Paso 6: Escribir `docs/specs/projects/clarifications.md` usando el template como estructura, sin copiar comentarios HTML, con metadatos completos (`Estado: Doing`, `Generado por: approval-agent`), y clasificando preguntas como Resueltas o Pendientes
- [x] 2.8 Add Paso 7: Proponer al usuario que revise el resultado, lo edite si es necesario, y mencionar `/ps-plan` como siguiente paso

## 3. ps-approval Skill

- [x] 3.1 Create `.claude/skills/ps-approval/SKILL.md` with YAML frontmatter (`name: ps-approval`, `description: ...`)
- [x] 3.2 Add Paso 1: Verificar que `docs/specs/projects/project.md` existe — si no, informar al usuario y detener
- [x] 3.3 Add Paso 2: Verificar que el template existe en `.claude/skills/ps-approval/templates/clarifications-template.md` — si no, informar y detener
- [x] 3.4 Add Paso 3: Delegar al `approval-agent` con instrucción explícita que incluya las rutas de todos los archivos de entrada y salida
- [x] 3.5 Add Paso 4: Confirmar que `docs/specs/projects/clarifications.md` existe después de la ejecución del agente — si existe, mostrar mensaje de éxito y mencionar `/ps-plan`; si no, sugerir re-ejecutar `/ps-approval`

## 4. Validation

- [x] 4.1 Run `/ps-approval` end-to-end with an existing project that has `requirement-spec.md` in `Ready` state — verify `clarifications.md` is created with correct structure (**human validation required**)
- [x] 4.2 Verify the template at `.claude/skills/ps-approval/templates/clarifications-template.md` is unchanged after a full run (**human validation required**)
- [x] 4.3 Test the `Doing` state guard: run `/ps-approval` with `requirement-spec.md` having `Estado: Doing`, confirm the skill prompts correctly (**human validation required**)
