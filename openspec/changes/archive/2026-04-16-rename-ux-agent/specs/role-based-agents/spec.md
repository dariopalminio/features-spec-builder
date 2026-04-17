## RENAMED Requirements

### Requirement: UX Designer Agent exists as role-based agent
FROM: UX Designer Agent exists as role-based agent
TO: Project-UX Agent exists as role-based agent

## MODIFIED Requirements

### Requirement: Project-UX Agent exists as role-based agent
El sistema SHALL incluir un agente `project-ux` en `.claude/agents/project-ux.agent.md` con frontmatter YAML válido (name: project-ux, description, tools, model) que lo describa como UX Designer especializado en flujos de usuario y usabilidad.

#### Scenario: UX agent supports discovery state
- **WHEN** el skill project-discovery invoca al agente UX como agente secundario
- **THEN** el `project-ux` DEBE aportar perspectiva de usabilidad al documento de discovery generado
