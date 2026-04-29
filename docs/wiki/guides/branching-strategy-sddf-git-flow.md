---
type: guide
slug: branching-strategy-sddf-git-flow
title: "Estrategia de Branching SDDF git flow"
date: 2026-03-26
status: BACKLOG
substatus: N/A
parent: N/A
related:                                    # opcional, si tiene relación con otros nodos
  - flight-leves-model
---

# Estrategia de Branching SDDF git flow

## Flujo de Trabajo en repositorio de código (Git)

Si bien el modelo es independiente de la estrategia de branching que utilices, proponemos una convención de ramas básica que refleja la jerarquía de elementos de trabajo para facilitar la trazabilidad y el control de versiones; y que también sirve de forma didáctica para entender los niveles de trabajo.

El flujo se basa en una jerarquía de ramas de tres niveles: `main` → `release/` → (`feat/`/`fix`/`chore`).

```
main  o----------------------------------o (tag v1.0.2)
      |                                  |
      | git checkout -b                  | PR (de release a main)
      |                                  |
      v                                  |
   release o-----------------------------o
            |                             |
            | git checkout -b             | PR (de feat a release)
            |                             |
            v                             |
         feat o---------------------------o
```

* **main:** La rama main representa y el nivel de proyecto siendo la acumulación de releases de proyectos. La rama main termina en ambiente producción.
* **release:** Cada rama release representa un entregable específico dentro del proyecto, que puede ser liberado de un tirón o de manera incremental. La rama release generalmente es probada en ambientes de staging (eso dependerá de tu diseño de CI/CD).
* **feat:** Cada rama feat representa una historia de usuario o feature específica dentro de un release, que se puede dividir en subtareas o tareas técnicas o specs partes del desarrollo (operativo y táctico). Las feats acumulan los commits del desarrollo. La rama feat generalmente es probada en ambientes de desarrollo y/o testing (también dependerá de tu diseño de CI/CD).

**Buenas prácticas:**
* **Convención de branches:** Esto respeta la "Convención de branches" recomendado [Conventional Branch](https://conventional-branch.github.io/).
* **Convención de Commits:** Se recomienda usar "Convensión de Commits" [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) para mantener un historial de commits claro y estructurado, lo que facilita la generación de changelogs y la trazabilidad de cambios.

