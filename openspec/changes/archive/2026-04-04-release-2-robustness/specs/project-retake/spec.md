## ADDED Requirements

### Requirement: Agent resumes from existing Doing document
Cuando el skill detecta `Estado: Doing`, el agente delegado SHALL recibir instrucción de leer el documento existente, identificar las secciones incompletas y continuar solo con ellas, preservando el contenido ya capturado.

#### Scenario: Agent loads existing document
- **WHEN** el skill activa el flujo de retoma
- **THEN** el agente MUST leer el documento existente en `$SPECS_BASE/specs/projects/` antes de formular cualquier pregunta al usuario

#### Scenario: Agent identifies incomplete sections
- **WHEN** el agente lee el documento existente en estado `IN‑PROGRESS`
- **THEN** el agente MUST identificar los campos con formato `[...]` o placeholders sin reemplazar como secciones pendientes

#### Scenario: Agent skips completed sections
- **WHEN** una sección del documento ya tiene contenido concreto (no es un placeholder)
- **THEN** el agente MUST NOT volver a preguntar al usuario sobre esa sección

#### Scenario: Retake preserves manually edited content
- **WHEN** el usuario editó manualmente secciones del documento antes de retomar
- **THEN** el agente MUST preservar ese contenido y no sobrescribirlo con nuevas respuestas
