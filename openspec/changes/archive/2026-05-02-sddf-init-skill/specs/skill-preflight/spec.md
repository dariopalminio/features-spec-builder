## ADDED Requirements

### Requirement: Documentar sddf-init como predecesor en el flujo de onboarding
El skill `skill-preflight` SHALL documentar en su descripción que `sddf-init` es su predecesor en el flujo de onboarding: primero se inicializa el entorno con `sddf-init` (operación de escritura), luego se valida con `skill-preflight` antes de cada skill (operación de solo lectura).

#### Scenario: Flujo de onboarding documentado
- **WHEN** un desarrollador configura SDDF en un proyecto nuevo
- **THEN** la documentación de `skill-preflight` indica claramente que debe ejecutarse `sddf-init` antes del primer uso de cualquier skill SDDF
- **THEN** el flujo recomendado es `sddf-init → skill-preflight → [cualquier skill SDDF]`
