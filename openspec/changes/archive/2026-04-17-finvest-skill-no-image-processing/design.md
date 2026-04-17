## Context

El skill `story-finvest-evaluation` es un archivo Markdown de instrucciones ubicado en tres mirrors: `.claude/skills/`, `.agents/skills/` y `.github/skills/`. Evalúa historias de usuario en texto usando la rúbrica FINVEST. No incluye lógica de procesamiento de imágenes, pero carece de una regla explícita que instruya al modelo a ignorar adjuntos binarios cuando están presentes.

## Goals / Non-Goals

**Goals:**
- Añadir una regla de guardia en la sección de instrucciones del skill que indique que los adjuntos de imagen deben ser ignorados.
- Sincronizar la regla en los tres mirrors del skill.

**Non-Goals:**
- Modificar la lógica de evaluación FINVEST.
- Añadir soporte para interpretar wireframes como especificaciones de historia de usuario.
- Cambiar otros skills del repositorio.

## Decisions

**Dónde insertar la regla:** Al inicio del cuerpo del skill (después del frontmatter y el encabezado principal), como una sección `## Restricciones de entrada` o como un bloque de advertencia destacado. Esto garantiza que el modelo lo lea antes de procesar cualquier input.

**Redacción:** La regla debe ser afirmativa y clara: "Si el input incluye imágenes adjuntas, ignóralas y evalúa únicamente el contenido en texto." Evitar condicionales complejos.

**Alternativa descartada:** Colocar la regla al final del skill — descartada porque los LLMs dan más peso a las instrucciones tempranas.

## Risks / Trade-offs

- [Riesgo mínimo] La regla es instrucción de comportamiento, no enforcement técnico — el modelo podría ignorarla en contextos adversariales. → Mitigación: redacción clara y ubicación prominente.
- [Sin impacto en usuarios] Los usuarios que no adjuntan imágenes no notarán diferencia alguna.
