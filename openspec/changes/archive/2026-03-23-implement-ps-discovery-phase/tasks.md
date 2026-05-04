## 1. Template de Discovery

- [x] 1.1 Crear directorio `.claude/skills/ps-discovery/templates/`
- [x] 1.2 Crear `.claude/skills/ps-discovery/templates/discovery-template.md` con secciones `##` y comentarios `<!-- -->` para: Visión del Producto, Usuarios o Clientes Clave, User Journey Map, Preguntas de Descubrimiento, Hipótesis y Experimentos
- [x] 1.3 Verificar que el template en `docs/templates/discovery.md` NO fue modificado (solo lectura de referencia)

## 2. Agente discovery-agent

- [x] 2.1 Crear `.claude/agents/discovery-agent.md` con frontmatter YAML: `name: discovery-agent`, `description`, `tools: [Read, Write, Edit, AskUserQuestion]`, `model: sonnet`
- [x] 2.2 Implementar Paso 1: el agente lee `$SPECS_BASE/specs/project-intent.md` y el template al inicio
- [x] 2.3 Implementar Paso 2: extracción dinámica de headers `##` y comentarios `<!-- -->` del template para derivar preguntas (sin hardcodeo)
- [x] 2.4 Implementar Paso 3: conducción de entrevista por secciones agrupando máx 3-4 preguntas por ronda con `AskUserQuestion`; pre-rellena desde `project-intent.md` para no preguntar lo ya conocido
- [x] 2.5 Implementar Paso 4: inferencia de contenido faltante marcado con `[inferido]`
- [x] 2.6 Implementar Paso 5: escritura de `$SPECS_BASE/specs/discovery.md` con metadatos (`**Versión**`, `**substatus**: IN‑PROGRESS`, `**Fecha**`, `**Generado por**: discovery-agent`), sin comentarios HTML del template
- [x] 2.7 Implementar cierre: el agente propone al usuario revisar/editar el output y menciona `/ps-specify` como siguiente paso

## 3. Skill ps-discovery

- [x] 3.1 Crear directorio `.claude/skills/ps-discovery/`
- [x] 3.2 Crear `.claude/skills/ps-discovery/SKILL.md` con frontmatter `name: ps-discovery` y `description`
- [x] 3.3 Implementar verificación de precondición: lee `$SPECS_BASE/specs/project-intent.md`; si no existe, informa al usuario que debe ejecutar `/ps-draft` primero y detiene la ejecución
- [x] 3.4 Implementar verificación de precondición: verifica `.claude/skills/ps-discovery/templates/discovery-template.md`; si no existe, informa al usuario y detiene la ejecución
- [x] 3.5 Implementar delegación al `discovery-agent` con instrucción que incluye rutas de input, template y output esperado
- [x] 3.6 Implementar confirmación del output: verifica que `$SPECS_BASE/specs/discovery.md` existe tras la ejecución del agente; confirma éxito o sugiere re-ejecutar en caso de fallo

## 4. Validación end-to-end

- [x] 4.1 [Validación humana] Ejecutar `/ps-discovery` con un `$SPECS_BASE/specs/project-intent.md` de prueba y verificar que el agente conduce la entrevista correctamente
- [x] 4.2 [Validación humana] Verificar que `$SPECS_BASE/specs/discovery.md` es generado con las secciones del template y los metadatos correctos
- [x] 4.3 [Validación humana] Verificar que ni `docs/templates/discovery.md` ni `.claude/skills/ps-discovery/templates/discovery-template.md` fueron modificados
- [x] 4.4 [Validación humana] Ejecutar `/ps-discovery` sin `project-intent.md` y confirmar que el skill detiene la ejecución con el mensaje correcto

