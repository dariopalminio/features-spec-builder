---
alwaysApply: false
---
**Título**: project-discovery — Discovery de usuarios y especificación de requisitos
**Versión**: 1.0
**Estado**: Completed
**Fecha**: 2026-04-22
**FINVEST Score:** —
**FINVEST Decisión:** —
---

# Historia de Usuario

## 📖 Historia: project-discovery — Discovery de usuarios y especificación de requisitos

**Como** developer que tiene `project-intent.md` aprobado y necesita detallar los requisitos del sistema
**Quiero** ejecutar el skill `project-discovery` para completar la entrevista de especificación con el agente architect
**Para** obtener `docs/specs/project/requirement-spec.md` con usuarios, flujos, requisitos funcionales y no funcionales documentados, listo para la fase de planning

## ✅ Criterios de aceptación

### Escenario principal – Generación exitosa de requirement-spec.md
```gherkin
Dado que existe "docs/specs/project/project-intent.md" con Estado: Ready
Cuando el desarrollador ejecuta el skill "project-discovery"
Entonces el agente conduce la entrevista de discovery sección por sección usando project-intent.md como contexto
  Y genera "docs/specs/project/requirement-spec.md" con Estado: Ready tras confirmación del usuario
  Y el documento incluye perfiles de usuario, flujos principales, requisitos funcionales (FR) y no funcionales (NFR)
```

### Escenario alternativo / error – project-intent.md no existe
```gherkin
Dado que "docs/specs/project/project-intent.md" no existe
Cuando el desarrollador ejecuta el skill "project-discovery"
Entonces el skill muestra "No se encontró project-intent.md. Ejecuta /project-begin primero."
  Pero no genera ningún documento de requisitos
```

## ⚙️ Criterios no funcionales

[Por completar]

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: release-02-project-spec-builder.md
Feature origen: FEAT-003 — project-discovery
