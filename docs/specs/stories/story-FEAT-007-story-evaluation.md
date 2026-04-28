---
type: story
slug: story-FEAT-007-story-evaluation
title: "story-evaluation — Evaluación FINVEST de historias"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: release-01-features-spec-builder
---

<!-- Referencias -->
[[release-01-features-spec-builder]]

# Historia de Usuario

## 📖 Historia: story-evaluation — Evaluación FINVEST de historias

**Como** desarrollador o PM que ha redactado una historia de usuario
**Quiero** ejecutar el skill `story-evaluation` sobre esa historia para obtener una evaluación de calidad
**Para** recibir un score Likert 1–5 por cada dimensión FINVEST, una decisión accionable (APROBADA / REFINAR / RECHAZAR) y recomendaciones concretas para mejorarla

## ✅ Criterios de aceptación

### Escenario principal – Evaluación exitosa de historia aprobada
```gherkin
Dado que existe "docs/specs/stories/story-recuperar-contrasena.md" con Como/Quiero/Para y dos escenarios Gherkin bien definidos
Cuando el desarrollador ejecuta el skill "story-evaluation" sobre ese archivo
Entonces el skill muestra el score por dimensión (F, I, N, V, E, S, T) con escala 1-5
  Y muestra un score global ponderado
  Y muestra la decisión "APROBADA" con sugerencias de mejora opcionales
```

### Escenario alternativo / error – Historia con formato incorrecto
```gherkin
Dado que el archivo indicado no contiene la sección Como/Quiero/Para
Cuando el skill evalúa la dimensión F (Formato)
Entonces la dimensión F recibe score 1
  Y la decisión es "RECHAZAR" con indicación de secciones faltantes
```

## ⚙️ Criterios no funcionales

[Por completar]

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: release-01-features-spec-builder.md
Feature origen: FEAT-007 — story-evaluation (antes story-finvest-evaluation)
