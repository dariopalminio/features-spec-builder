## RENAMED Requirements

### Requirement: Product Manager Agent exists as role-based agent
FROM: Product Manager Agent exists as role-based agent
TO: Project-PM Agent exists as role-based agent

## MODIFIED Requirements

### Requirement: Project-PM Agent exists as role-based agent
El sistema SHALL incluir un agente `project-pm` en `.claude/agents/project-pm.agent.md` con frontmatter YAML válido (name: project-pm, description, tools, model) que lo describa como PM especializado en entrevistas, discovery e intención de producto.

#### Scenario: Agent file exists with valid frontmatter
- **WHEN** se ejecuta cualquier skill del pipeline (project-begin-intention, project-discovery)
- **THEN** el sistema DEBE poder invocar `project-pm` como subagente desde el SKILL.md correspondiente

#### Scenario: PM agent handles multiple pipeline states
- **WHEN** un skill de los estados Begin Intention o Discovery invoca al agente
- **THEN** el `project-pm` DEBE ejecutar la tarea correspondiente a ese estado sin errores
