---
type: guide
slug: sddf-main-workflows
title: "Flujos principales SDDF"
date: 2026-04-26
status: N/A
substatus: N/A
parent: N/A
related:                                    # opcional, si tiene relación con otros nodos
  - flight-leves-model
---

# Flujos principales SDDF

---

## 1. Pipeline de especificación de proyecto

```
project-begin → project-discovery → project-planning
```

| Skill | Input | Output |
|---|---|---|
| `project-begin` | Intención del usuario (conversación) | `docs/specs/project/project-intent.md` |
| `project-discovery` | `project-intent.md` | `docs/specs/project/requirement-spec.md` |
| `project-planning` | `requirement-spec.md` | `docs/specs/project/project-plan.md` |

> `project-flow` orquesta los 3 pasos en una sola sesión con gates de revisión entre etapas.

---

## 2. Pipeline de generación de releases e historias

```
releases-from-project-plan → release-generate-stories
```

| Skill | Input | Output |
|---|---|---|
| `releases-from-project-plan` | `project-plan.md` | `docs/specs/releases/release-[ID]-[Nombre].md` (uno por release) |
| `release-generate-stories` | Un archivo `release-*.md` | `docs/specs/stories/story-[ID]-[Nombre].md` (una por feature) |

> `release-generate-all-stories` procesa todos los releases en batch.

---

## 3. Pipeline de refinamiento de historias

```
story-creation → story-evaluation → story-split
```

| Skill | Propósito |
|---|---|
| `story-creation` | Redacta la historia (Como/Quiero/Para + Gherkin) |
| `story-evaluation` | Evalúa calidad con rúbrica FINVEST (1–5 por dimensión) → `APROBADA / REFINAR / RECHAZAR` |
| `story-split` | Divide historias grandes usando 8 patrones de splitting |

> `story-refine` orquesta el ciclo completo con control de backlog por archivo (`substatus: DOING / READY`).
