## 1. Crear el directorio del skill

- [x] 1.1 Crear directorio `.claude/skills/project-flow/`

## 2. Implementar SKILL.md

- [x] 2.1 Crear `.claude/skills/project-flow/SKILL.md` con frontmatter (name: project-flow, description, alwaysApply: false)
- [x] 2.2 Implementar la sección de detección de estado inicial: leer los tres documentos de output y determinar desde qué fase comenzar
- [x] 2.3 Implementar la Fase 1 (Begin Intention): delegar a `project-pm` con la misma instrucción que usa `/project-begin`
- [x] 2.4 Implementar el gate de revisión post-Fase 1: presentar resumen, pedir confirmación y actualizar `Estado: Doing` → `Estado: Ready` en `project-intent.md`
- [x] 2.5 Implementar la Fase 2 (Discovery): delegar a `project-pm` y luego a `project-architect` con las mismas instrucciones que usa `/project-discovery`
- [x] 2.6 Implementar el gate de revisión post-Fase 2: presentar resumen y actualizar `Estado: Ready` en `requirement-spec.md`
- [x] 2.7 Implementar la Fase 3 (Planning): delegar a `project-architect` con la misma instrucción que usa `/project-planning`
- [x] 2.8 Implementar el gate de revisión post-Fase 3: presentar resumen y actualizar `Estado: Ready` en `project-plan.md`
- [x] 2.9 Implementar la confirmación final: mostrar los tres documentos con sus paths y confirmar pipeline completo

## 3. Replicar en mirrors

- [x] 3.1 Crear `.github/skills/project-flow/SKILL.md` con el mismo contenido
- [x] 3.2 Crear `.agents/skills/project-flow/SKILL.md` con el mismo contenido

## 4. Verificación

- [x] 4.1 Verificar que `.claude/skills/project-flow/SKILL.md` tiene frontmatter válido con `name: project-flow`
- [x] 4.2 Verificar que el skill aparece en la lista de skills disponibles
