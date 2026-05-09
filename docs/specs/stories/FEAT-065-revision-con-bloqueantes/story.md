---
alwaysApply: false
type: story
id: FEAT-065
slug: FEAT-065-revision-con-bloqueantes
title: "Skill story-code-review: instrucciones de corrección cuando la revisión detecta bloqueantes"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-05-09
updated: 2026-05-09
related:
  - EPIC-12-story-sdd-workflow
  - FEAT-064
  - FEAT-066
---
**FINVEST Score:** [FINVEST Score]
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]
[[FEAT-064-revision-codigo-multi-agente]]
[[FEAT-066-revision-validacion-precondiciones]]

# 📖 Historia: Skill story-code-review — instrucciones de corrección cuando la revisión detecta bloqueantes

**Como** desarrollador o tech lead cuya revisión multi-agente detectó problemas de severidad HIGH o MEDIUM  
**Quiero** recibir instrucciones concretas de corrección y que la historia retroceda a IMPLEMENTING  
**Para** corregir el código con guía clara sobre qué cambiar y en qué archivos, sin perder el contexto de lo que falló

## ✅ Criterios de aceptación

### Escenario principal – Revisión con bloqueantes genera fix-directives y retrocede la historia
```gherkin
Dado que "/story-code-review FEAT-NNN" detecta al menos un problema de severidad HIGH o MEDIUM
Cuando el árbitro consolida los informes de los tres revisores
Entonces el skill genera "docs/specs/stories/FEAT-NNN/fix-directives.md" con instrucciones concretas de corrección
  Y "fix-directives.md" incluye la lista de archivos permitidos para modificar (lista blanca)
  Y el frontmatter de "story.md" permanece en status: IMPLEMENTING y substatus: IN-PROGRESS
  Pero no se actualiza la historia a READY-FOR-VERIFY hasta que una nueva revisión retorne "approved"
```

### Escenario con datos (Scenario Outline) – Severidades que generan needs-changes
```gherkin
Escenario: Decisión final cuando hay problemas bloqueantes
  Dado que los revisores detectan problemas con severidad máxima "<severidad>"
  Cuando el árbitro consolida los informes
  Entonces el review-status es "needs-changes"
    Y se genera "fix-directives.md"
Ejemplos:
  | severidad |
  | HIGH      |
  | MEDIUM    |
```

## ⚙️ Criterios no funcionales

* Trazabilidad: cada instrucción en `fix-directives.md` referencia el hallazgo exacto del reporte (archivo:línea, dimensión de revisión)
* Idempotencia: ejecutar el skill sobre el mismo código con los mismos problemas produce el mismo `fix-directives.md`

## 📎 Notas / contexto adicional

`fix-directives.md` debe incluir la lista blanca de archivos permitidos para modificar, para que las correcciones no introduzcan cambios fuera del scope de la historia.

El flujo de corrección iterativa es: desarrollador aplica las correcciones sugeridas → vuelve a ejecutar `/story-code-review` → si retorna "approved", continúa el flujo de FEAT-064.

Orden de implementación sugerido: implementar primero FEAT-064 (happy path), luego FEAT-065 (este flujo), finalmente FEAT-066 (precondiciones).
