---
type: story
slug: story-FEAT-028-generar-releases
title: "Generar releases desde project-plan"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: release-06-release-and-story-generator
---

<!-- Referencias -->
[[release-06-release-and-story-generator]]

# Historia de Usuario

## 📖 Historia: Generar releases desde project-plan

**Como** desarrollador que ha completado la planificación de un proyecto SDDF con releases definidos en `project-plan.md`
**Quiero** ejecutar el skill `releases-from-project-plan` para generar automáticamente un archivo `release-[ID]-[Nombre].md` por cada release planificado
**Para** obtener especificaciones de release estructuradas según el template `release-spec-template.md` listas para completar, sin crearlas manualmente desde cero

## ✅ Criterios de aceptación

### Escenario principal – Generación exitosa de archivos de release
```gherkin
Dado que existe "docs/specs/project/project-plan.md" con al menos una sección "### Release NN — Nombre" bajo "## Propuesta de Releases"
  Y el directorio "docs/specs/releases/" existe o puede ser creado
Cuando el desarrollador ejecuta el skill "releases-from-project-plan"
Entonces el skill genera un archivo "release-[ID]-[Nombre-kebab].md" por cada release encontrado
  Y cada archivo sigue la estructura de "docs/specs/templates/release-spec-template.md"
  Y los archivos se guardan en "docs/specs/releases/"
```

### Escenario alternativo / error – project-plan.md no existe
```gherkin
Dado que el archivo "docs/specs/project/project-plan.md" no existe
Cuando el desarrollador ejecuta el skill "releases-from-project-plan"
Entonces el skill muestra "No se encontró docs/specs/project/project-plan.md"
  Pero no genera ningún archivo de release
```

### Escenario alternativo / error – Plan sin releases planificados
```gherkin
Dado que "docs/specs/project/project-plan.md" existe
  Y no contiene ninguna sección "### Release" bajo "## Propuesta de Releases"
Cuando el desarrollador ejecuta el skill "releases-from-project-plan"
Entonces el skill muestra "No se encontraron releases planificados en project-plan.md"
  Pero no genera ningún archivo de release
```

## ⚙️ Criterios no funcionales

[Por completar]

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: release-06-release-and-story-generator.md
Feature origen: FEAT-028 — Generar releases
