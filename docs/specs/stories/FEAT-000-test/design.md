---
type: design
id: FEAT-000
slug: FEAT-000-test-design
title: "Design: Fixture mínimo para story-code-review"
story: FEAT-000
created: 2026-05-09
updated: 2026-05-09
status: PLANNING
substatus: DONE
---

## Context

Fixture mínimo para verificar el happy path del skill story-code-review.

## Decisions

### D-1: Componentes del fixture

```
src/
├── calculator.ts       # Función sum implementada
└── calculator.test.ts  # Tests para la función sum
```

### D-2: Interfaz de calculator.ts

```typescript
export function sum(a: number, b: number): number
```
