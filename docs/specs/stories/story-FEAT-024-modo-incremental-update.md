---
alwaysApply: false
---
**Título**: Modo incremental — Flag --update para reverse-engineering
**Versión**: 1.0
**Estado**: Completed
**Fecha**: 2026-04-22
**FINVEST Score:** —
**FINVEST Decisión:** —
---

# Historia de Usuario

## 📖 Historia: Modo incremental — Flag --update para reverse-engineering

**Como** developer que ya ejecutó ingeniería inversa y tiene un `requirement-spec.md` con secciones marcadas como pendientes
**Quiero** usar el flag `--update` con el skill `reverse-engineering` para re-analizar únicamente las secciones marcadas como `<!-- PENDING MANUAL REVIEW -->`
**Para** completar el documento de requisitos de forma incremental sin volver a analizar las secciones ya correctas

## ✅ Criterios de aceptación

### Escenario principal – Re-análisis incremental de secciones pendientes
```gherkin
Dado que existe "docs/specs/project/requirement-spec.md" con tres secciones marcadas "<!-- PENDING MANUAL REVIEW -->"
Cuando el desarrollador ejecuta "/reverse-engineering --update"
Entonces el skill identifica las secciones marcadas y lanza el análisis solo sobre esas partes
  Y actualiza únicamente las secciones pendientes en el documento existente
  Y preserva las secciones que ya estaban completas sin modificarlas
```

### Escenario alternativo / error – No hay secciones pendientes
```gherkin
Dado que "docs/specs/project/requirement-spec.md" no contiene ninguna sección "<!-- PENDING MANUAL REVIEW -->"
Cuando el desarrollador ejecuta "/reverse-engineering --update"
Entonces el skill informa "No se encontraron secciones pendientes. El documento ya está completo."
  Pero no modifica el documento ni lanza análisis adicionales
```

## ⚙️ Criterios no funcionales

[Por completar]

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: release-03-reverse-engineering.md
Feature origen: FEAT-024 — Modo incremental (--update)
