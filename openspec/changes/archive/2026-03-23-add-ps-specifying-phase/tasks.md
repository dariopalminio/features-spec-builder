## 1. Template

- [x] 1.1 Crear directorio `.claude/skills/ps-specifying/templates/`
- [x] 1.2 Crear `.claude/skills/ps-specifying/templates/project-template.md` con estructura de secciones (Descripción General, Contexto, Usuarios, Requisitos Funcionales, Requisitos No Funcionales, Referencias, Definiciones) y comentarios `<!-- -->` guía en cada sección

## 2. Agente specifying-agent

- [x] 2.1 Crear `.claude/agents/specifying-agent.md` con frontmatter YAML (`name`, `description`, `tools: [Read, Write, Edit, AskUserQuestion]`, `model: sonnet`)
- [x] 2.2 Implementar Paso 1: leer `docs/specs/project/discovery.md` y `.claude/skills/ps-specifying/templates/project-template.md`
- [x] 2.3 Implementar Paso 2: validar campo `**Estado**` en `discovery.md` — si es `Doing`, preguntar confirmación con `AskUserQuestion`; si confirma, editar a `Ready`; si rechaza, detener
- [x] 2.4 Implementar Paso 3: extraer headers `##` y comentarios `<!-- -->` del template en runtime para derivar preguntas dinámicamente (sin hardcodear)
- [x] 2.5 Implementar Paso 4: conducir la entrevista sección por sección — pre-rellenar desde `discovery.md`, agrupar máx 3-4 preguntas por ronda
- [x] 2.6 Implementar Paso 5: completar con pericia de PM marcando inferencias con `[inferido]`
- [x] 2.7 Implementar Paso 6: escribir `docs/specs/project/project.md` con el template como estructura, metadatos (Versión, Estado, Fecha, Generado por), sin comentarios HTML, y proponer revisión al usuario mencionando `/ps-approve`

## 3. Skill ps-specifying

- [x] 3.1 Crear `.claude/skills/ps-specifying/SKILL.md` con frontmatter de skill
- [x] 3.2 Implementar Paso 1: verificar que `docs/specs/project/discovery.md` existe; si no, informar y detener
- [x] 3.3 Implementar Paso 2: verificar que `.claude/skills/ps-specifying/templates/project-template.md` existe; si no, informar y detener
- [x] 3.4 Implementar Paso 3: delegar al `specifying-agent` con instrucciones para leer `discovery.md` y el template, conducir entrevista y escribir `docs/specs/project/project.md`
- [x] 3.5 Implementar Paso 4: verificar que `docs/specs/project/project.md` existe y confirmar al usuario con mensaje de éxito y próximo paso (`/ps-approve`); si no existe, informar error y sugerir re-ejecutar

## 4. Validación manual

- [x] 4.1 Ejecutar `/ps-specifying` con un `discovery.md` de prueba en Estado `Ready` y verificar que produce `requirement-spec.md` correctamente
- [x] 4.2 Verificar que el template en `.claude/skills/ps-specifying/templates/` no es modificado por el agente
- [x] 4.3 Verificar idempotencia: re-ejecutar `/ps-specifying` con el mismo input produce el mismo output sin duplicar contenido
