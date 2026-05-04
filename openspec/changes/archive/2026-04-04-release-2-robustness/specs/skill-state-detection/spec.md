## ADDED Requirements

### Requirement: Skill reads Estado field at startup
Al inicio de su ejecución, cada skill del pipeline SHALL leer el campo `**Estado**:` del documento de output de su fase en `$SPECS_BASE/specs/projects/` antes de delegar al agente.

#### Scenario: Document does not exist
- **WHEN** el documento de output de la fase no existe en `$SPECS_BASE/specs/projects/`
- **THEN** el skill MUST continuar con el flujo normal de ejecución (primera ejecución)

#### Scenario: Document exists with Estado Doing
- **WHEN** el documento existe y el campo `**Estado**:` tiene valor `IN‑PROGRESS`
- **THEN** el skill MUST activar el flujo de retoma (invocar `project-retake`)

#### Scenario: Document exists with Estado Ready
- **WHEN** el documento existe y el campo `**Estado**:` tiene valor `DONE`
- **THEN** el skill MUST activar el flujo de idempotencia: avisar al usuario y solicitar confirmación antes de sobrescribir

#### Scenario: Confirmation to overwrite Ready document
- **WHEN** el usuario confirma que desea sobrescribir un documento en estado `DONE`
- **THEN** el skill MUST continuar con el flujo normal de ejecución

#### Scenario: User cancels overwrite of Ready document
- **WHEN** el usuario cancela la operación sobre un documento en estado `DONE`
- **THEN** el skill MUST detenerse sin modificar el documento existente
