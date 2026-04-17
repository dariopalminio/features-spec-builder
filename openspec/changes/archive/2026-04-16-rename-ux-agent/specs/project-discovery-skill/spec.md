## MODIFIED Requirements

### Requirement: project-discovery uses project-architect as primary agent
El skill `/project-discovery` SHALL delegar la especificacion al `project-architect` como agente principal, con soporte del `project-pm` para el discovery y del `project-ux` para flujos de usuario.

#### Scenario: Architect agent produces the spec
- **WHEN** el skill ejecuta la fase de especificacion
- **THEN** el sistema MUST invocar `project-architect` para generar `requirement-spec.md`
