<!-- Referencias -->
[[FEAT-062-status-management-on-workflow]]

## ADDED Requirements

### Requirement: story-refine sets SPECIFYING/DOING at the start of refinement
The system SHALL update `status: SPECIFYING` and `substatus: DOING` in `story.md` frontmatter when `story-refine` (or `story-creation` as the entry point) begins processing a story.

#### Scenario: Status updated at refinement start
- **WHEN** `/story-refine` (or `/story-creation`) begins a new or existing story
- **THEN** `story.md` frontmatter MUST be updated to `status: SPECIFYING` and `substatus: DOING` before any sub-skill is invoked

### Requirement: story-refine sets SPECIFIED/DONE when FINVEST approves
The system SHALL update `status: SPECIFIED` and `substatus: DONE` in `story.md` frontmatter when `story-evaluation` returns `APROBADA`.

#### Scenario: Status updated on FINVEST approval
- **WHEN** `story-evaluation` returns decision `APROBADA` during the `story-refine` flow
- **THEN** `story.md` frontmatter MUST be updated to `status: SPECIFIED` and `substatus: DONE` before the skill terminates

#### Scenario: Status remains SPECIFYING/DOING on non-approved evaluation
- **WHEN** `story-evaluation` returns `REFINAR` or `RECHAZAR`
- **THEN** `story.md` frontmatter MUST remain at `status: SPECIFYING` and `substatus: DOING` to signal that refinement is still in progress

## MODIFIED Requirements

### Requirement: story files maintain explicit state transitions
Cada historia en refinamiento SHALL mantener los campos `status` y `substatus` en el frontmatter YAML de `story.md`, y el orquestador SHALL gestionar la transición según el resultado de `story-evaluation` y las decisiones del usuario.

Los valores válidos para el ciclo de refinement son:
- `status: SPECIFYING` / `substatus: DOING` — mientras el refinamiento está activo
- `status: SPECIFIED` / `substatus: DONE` — cuando `story-evaluation` retorna `APROBADA`

#### Scenario: Story remains SPECIFYING/DOING during active refinement
- **WHEN** una historia aún no cumple criterios de cierre (evaluación no aprobada)
- **THEN** su `story.md` MUST tener `status: SPECIFYING` y `substatus: DOING`

#### Scenario: Story becomes SPECIFIED/DONE when FINVEST is approved
- **WHEN** `story-evaluation` retorna decisión `APROBADA`
- **THEN** el orquestador MUST actualizar `story.md` a `status: SPECIFIED` y `substatus: DONE`

#### Scenario: User decides to pause refinement
- **WHEN** la decisión FINVEST es `REFINAR` o `RECHAZAR` y el usuario elige pausar
- **THEN** el orquestador MUST permitir finalizar la sesión dejando la historia en `status: SPECIFYING` / `substatus: DOING`
