## 📖 Historia: Story validar release en Rovo

**Como** PM o Tech Lead que gestiona releases del pipeline SDDF desde Jira
**Quiero** invocar desde Jira al agente validador de release en Rovo para verificar que una especificación cumple el formato obligatorio del template
**Para** detectar secciones faltantes y decidir si la descripción del workitem Epic tipo release puede avanzar al siguiente paso del pipeline cumpliendo el formato de escritura de release esperado.

## ✅ Criterios de aceptación

### Escenario principal – Validación exitosa (APROBADO)
```gherkin
Dado que soy un PM con acceso a Rovo en Jira
  Y existe un workitem Epic tipo release con todas las secciones 
  O se le pasa el texto de descripciòn de un release 
  O se le pasa la Key de un workitem tipo Epic
  Y cumplen con las secciones obligatorias completas en su descripción, siguiendo el template definido en "docs/specs/releases/release-template.md"
Cuando invoco al agente con el nombre "release-format-validation"
Entonces el agente localiza y lee el archivo correspondiente
  Y responde con el estado "APROBADO"
```

### Escenario alternativo / error – Secciones faltantes (REFINAR)
```gherkin
Dado que existe un workitem Epic tipo release con una descripción incompleta, siguiendo el template definido en "docs/specs/releases/release-template.md"
O se le pasa la Key de un workitem tipo Epic
O se le pasa un texto de descripción de release que solo contiene algunas secciones del template,
  Pero no contiene las secciones obligatorias como "Features" y "Flujos Críticos / Smoke Tests"
Cuando el agente valida la estructura de la descripción
Entonces responde con el estado "REFINAR"
  Y lista exactamente las secciones y campos faltantes
  Pero no genera ni corrige contenido de la descripción
```

### Escenario alternativo / error – Archivo no encontrado (RECHAZADO)
```gherkin
Dado que proporciono el nombre de épica o "release-inexistente"
O un workitem que no es una épica Epic
Cuando el agente intenta localizar el workitem
Entonces responde con el estado "RECHAZADO"
  Y indica que no se encontró ningún workitem Epic con ese nombre o con esa key en Jira
```

### Escenario con datos – Resolución de input por nombre parcial
```gherkin
Escenario: El agente resuelve el workitem por nombre parcial
  Dado que existe un solo workitem Epic en Jira cuyo nombre contiene "<término>"
  Cuando invoco al agente con "<término>"
  Entonces el agente usa ese workitem y produce el resultado "<estado>"
Ejemplos:
  | término   | estado   |
  | Release Epic v2.0      | APROBADO |
  | sprint-14 | REFINAR  |
```

### Requirement: Estructura del archivo del agente rovo 
El prompt de instrucciones del agente debe ser semejante al skill .claude\skills\release-format-validation, adaptado a la estructura de agentes Rovo, e incluir: Nombre, Descripción, Comportamiento e Instrucciones.

### Requirement: Template canónico
El Template canónico debe estar incrustado dentro de la secciòn de Instrucciones como "## Template canónico (fuente de verdad)", y el agente debe validar que la descripción del release contenga al menos las secciones obligatorias definidas en ese template (Título, Versión, Estado, Fecha, Descripción, Features, Flujos Críticos / Smoke Tests). El template canónico debe seguir la estructura definida en "docs/specs/templates/release-spec-template.md", pero el agente nunca referencia ni busca ningun archivo ya que vive dentro del alcance de Jira.

## ⚙️ Criterios no funcionales

* Compatibilidad: el agente debe ejecutarse en el runtime Rovo de Atlassian Jira sin dependencias externas
* Consistencia: la lógica de validación debe ser equivalente a la del skill `/release-format-validation` del pipeline SDDF
* Alcance: el agente valida presencia de secciones por encabezado `##`, no valida contenido semántico

## 📎 Notas / contexto adicional

El agente `release-validator-agent.md` se ubica en el directorio `rovo/`, siguiendo la misma convención que los agentes existentes (`story-creator-agent.md`, `story-evaluator-agent.md`, `story-splitter-agent.md`).

La lógica de validación es una adaptación del skill `.claude/skills/release-format-validation` al formato de agente Rovo: mismas fases (resolver input → extraer secciones obligatorias del template → validar → producir resultado), mismo vocabulario de estados (APROBADO / REFINAR / RECHAZADO).

**Dependencias:** FEAT-027, FEAT-030 deben estar completos antes de implementar este agente.

Generación ni corrección de contenido están fuera del scope de esta historia.
