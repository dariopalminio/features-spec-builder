---
type: story
id: FEAT-012
slug: FEAT-012-story-split
title: "story-split — Dividir épicas en historias pequeñas"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-01-features-spec-builder
---

<!-- Referencias -->
[[EPIC-01-features-spec-builder]]

# Historia de Usuario

## ?? Historia: story-split — Dividir épicas en historias pequeñas

**Como** desarrollador o PM que tiene una historia de usuario demasiado grande para estimar o entregar en un sprint
**Quiero** ejecutar el skill `story-split` sobre esa historia para obtener historias más pequeñas e independientes
**Para** conseguir unidades de trabajo estimables, entregables de forma incremental y que cumplan el criterio S (Small) de INVEST

## ? Criterios de aceptación

### Escenario principal – División exitosa usando el patrón de pasos de flujo
```gherkin
Dado que "docs/specs/stories/story-gestion-completa-pedidos.md" cubre creación, edición y cancelación de pedidos
Cuando el desarrollador ejecuta el skill "story-split" sobre esa historia
Entonces el skill identifica el patrón de splitting más adecuado (pasos de flujo)
  Y genera tres historias independientes: crear pedido, editar pedido, cancelar pedido
  Y cada historia resultante sigue el template story-gherkin-template.md con sus propios escenarios Gherkin
```

### Escenario alternativo / error – Historia ya suficientemente pequeña
```gherkin
Dado que la historia indicada tiene un solo escenario principal y alcance acotado
Cuando el skill evalúa si necesita división
Entonces el skill informa que la historia ya cumple el criterio S de INVEST
  Pero no genera historias derivadas sin confirmación del usuario
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado automáticamente desde el release: release-01-features-spec-builder.md
Feature origen: FEAT-012 — story-split
