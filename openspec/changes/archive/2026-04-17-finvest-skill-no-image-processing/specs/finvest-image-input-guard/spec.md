## ADDED Requirements

### Requirement: El skill ignora adjuntos de imagen
El skill `story-finvest-evaluation` SHALL evaluar únicamente el contenido en texto (Markdown) de la historia de usuario. Si el input incluye adjuntos de imagen (wireframes, screenshots u otros archivos binarios de imagen), el skill SHALL ignorarlos completamente y no intentar procesarlos ni interpretarlos.

#### Scenario: Input con imagen adjunta
- **WHEN** el usuario invoca el skill con una historia de usuario y una imagen adjunta
- **THEN** el skill ignora la imagen y evalúa únicamente el texto de la historia

#### Scenario: Input sin imagen adjunta
- **WHEN** el usuario invoca el skill con solo texto
- **THEN** el skill evalúa el texto normalmente sin cambio de comportamiento

#### Scenario: Input solo con imagen sin texto
- **WHEN** el usuario invoca el skill adjuntando solo una imagen sin texto de historia de usuario
- **THEN** el skill informa que no puede evaluar porque no se proporcionó texto de historia de usuario
