## Why

Cuando un usuario adjunta imágenes (wireframes, screenshots) a una conversación y luego invoca `/story-finvest-evaluation`, el skill podría intentar interpretar o procesar el contenido binario de la imagen como parte de la evaluación. Esto genera comportamiento no deseado: el skill no está diseñado para evaluar imágenes y hacerlo produce resultados incorrectos o confusos.

## What Changes

- Agregar una regla explícita en el skill `story-finvest-evaluation` que indique que los adjuntos de imagen (wireframes, screenshots u otros archivos binarios de imagen) deben ser ignorados durante la evaluación.
- El skill debe evaluar únicamente el contenido en texto (Markdown) de la historia de usuario proporcionada.

## Capabilities

### New Capabilities
- `finvest-image-input-guard`: Regla de guardia que instruye al skill a ignorar adjuntos de imagen y evaluar solo el texto de la historia de usuario.

### Modified Capabilities

## Impact

- `.claude/skills/story-finvest-evaluation/SKILL.md` — se añade la regla de guardia.
- `.agents/skills/story-finvest-evaluation/SKILL.md` — sincronización de la misma regla.
- `.github/skills/story-finvest-evaluation/SKILL.md` — sincronización de la misma regla.
