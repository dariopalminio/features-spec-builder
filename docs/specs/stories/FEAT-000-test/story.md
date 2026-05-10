---
type: story
id: FEAT-000
slug: FEAT-000-test
title: "Test: Fixture mínimo para verificar story-code-review"
status: READY-FOR-VERIFY
substatus: DONE
parent: EPIC-00-test
created: 2026-05-09
updated: 2026-05-09
---

# Historia: Fixture de prueba para story-code-review

**Como** desarrollador
**Quiero** verificar que el skill story-code-review funciona correctamente
**Para** confirmar el happy path del quality gate antes de integrarlo al workflow SDD

## ✅ Criterios de aceptación

### Escenario principal – Revisión aprobada
```gherkin
Dado que existen story.md, design.md e implement-report.md en docs/specs/stories/FEAT-000-test/
Cuando ejecuto /story-code-review FEAT-000
Y ningún revisor detecta problemas de severidad HIGH o MEDIUM
Entonces el skill genera code-review-report.md con review-status: approved
  Y el frontmatter de story.md se actualiza a status: READY-FOR-VERIFY y substatus: DONE
```

### Escenario – Severidad LOW aprobada
```gherkin
Dado que los revisores detectan solo hallazgos con severidad LOW
Cuando el árbitro consolida los informes
Entonces el review-status es approved
  Y no se genera fix-directives.md
```

### Escenario – Sin hallazgos
```gherkin
Dado que los revisores no detectan ningún hallazgo
Cuando el árbitro consolida los informes
Entonces el review-status es approved con max-severity: ninguna
  Y no se genera fix-directives.md
```
