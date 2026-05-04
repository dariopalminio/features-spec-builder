## 1. Template de Initial Prompt

- [x] 1.1 Crear directorio `.claude/skills/ps-funnel/templates/` si no existe
- [x] 1.2 Crear `.claude/skills/ps-funnel/templates/initial-prompt-template.md` con secciones H2: Nombre del Proyecto, Problema / Oportunidad, Objetivos, Usuarios / Stakeholders, Alcance Inicial, Restricciones y Supuestos, Criterios de Éxito
- [x] 1.3 Agregar comentarios HTML de guía en cada sección del template indicando qué información capturar

## 2. Agente Product Manager

- [x] 2.1 Crear `.claude/agents/pm-agent.md` con frontmatter YAML: `name: pm-agent`, `description`, `tools: [Read, Write, AskUserQuestion]`, `model: claude-sonnet-4-6`
- [x] 2.2 Redactar el prompt del agente PM con instrucciones para: leer el template, hacer preguntas por sección (máx 3-4 por ronda), inferir contenido faltante marcándolo con `[inferido]`, y escribir el documento final
- [x] 2.3 Incluir en el prompt del agente las instrucciones para escribir `$SPECS_BASE/specs/initial-prompt.md` con metadatos (fecha de generación, agente ejecutor)

## 3. Skill ps-funnel

- [x] 3.1 Crear directorio `.claude/skills/ps-funnel/`
- [x] 3.2 Crear `.claude/skills/ps-funnel/SKILL.md` con la lógica de orquestación: verificar existencia del template, invocar al agente `pm-agent`, confirmar que `$SPECS_BASE/specs/initial-prompt.md` fue generado
- [x] 3.3 Agregar manejo del caso en que el template no existe (informar al usuario y detener ejecución)

## 4. Validación Manual

- [x] 4.1 [Validación humana] Ejecutar `/ps-funnel` con un proyecto de prueba y verificar que el flujo de preguntas cubre todas las secciones del template
- [x] 4.2 [Validación humana] Revisar el `$SPECS_BASE/specs/initial-prompt.md` generado: comprobar que todas las secciones están completas, que el contenido inferido está marcado, y que los metadatos son correctos
- [x] 4.3 [Validación humana] Verificar idempotencia: ejecutar `/ps-funnel` una segunda vez y confirmar que el archivo es sobrescrito sin duplicaciones
