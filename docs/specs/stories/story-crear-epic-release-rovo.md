## 📖 Historia

**Como** PM o Tech Lead que gestiona releases del pipeline SDDF desde Jira
**Quiero** invocar al agente creador de Epic Release en Rovo para generar la descripción de un nuevo Epic tipo release siguiendo el template canónico
**Para** crear releases bien estructurados directamente desde Jira sin copiar el template manualmente ni salir del contexto de trabajo

## ✅ Criterios de aceptación

### Escenario principal – Generación exitosa de descripción de release
```gherkin
Dado que soy un PM con acceso a Rovo en Jira
  Y proporciono el nombre del release, una descripción y al menos un feature a incluir
Cuando invoco al agente creador de Epic Release
Entonces el agente puede hacer preguntas para completar secciones faltantes o aclarar información insuficiente
  Y el agente genera la descripción completa del Epic siguiendo el template canónico
  Y la descripción incluye los campos de frontmatter: Título, Versión, Estado y Fecha
  Y la descripción incluye las secciones obligatorias: Descripción, Features y Flujos Críticos / Smoke Tests
```

### Escenario alternativo / error – Información insuficiente para generar el release
```gherkin
Dado que invoco al agente sin proporcionar el nombre del release ni los features
Cuando el agente evalúa el input recibido
Entonces el agente solicita los datos mínimos requeridos antes de generar el output
  Pero no genera contenido inventado para reemplazar información faltante
```

### Requerimiento: Estructura del archivo del agente Rovo
El prompt de instrucciones del agente debe seguir la convención de agentes Rovo existentes e incluir las secciones: Nombre, Descripción, Comportamiento e Instrucciones.

### Requerimiento: Template canónico incrustado
El template canónico de release debe estar incrustado dentro de la sección Instrucciones bajo el encabezado `## Template canónico (fuente de verdad)`. El agente nunca referencia ni busca archivos externos, ya que vive dentro del alcance de Jira. El template debe incluir las secciones obligatorias (Descripción, Features, Flujos Críticos / Smoke Tests) y los campos de frontmatter (Título, Versión, Estado, Fecha), siguiendo la estructura de `docs/specs/templates/release-spec-template.md`.

## ⚙️ Criterios no funcionales

* Compatibilidad: el agente debe ejecutarse en el runtime Rovo de Atlassian Jira sin dependencias externas
* Consistencia: el template canónico incrustado debe ser equivalente al definido en `docs/specs/templates/release-spec-template.md`
* Alcance: el agente genera la estructura del release con placeholders; no redacta el contenido de negocio por el usuario

## 📎 Notas / contexto adicional

El agente `release-creator-agent.md` se ubica en el directorio `rovo/`, siguiendo la misma convención que los agentes existentes (`story-creator-agent.md`, `story-evaluator-agent.md`, `story-splitter-agent.md`, `release-validator-agent.md`).

El output del agente es el texto de la descripción del Epic listo para pegar en Jira. El agente no crea el workitem directamente en Jira; el PM lo copia y pega en la descripción del Epic.

**Dependencias:** FEAT-027, FEAT-030 deben estar completos antes de implementar este agente.

Edición del contenido de negocio (Descripción, Features, Smoke Tests) queda a cargo del PM; el agente solo provee la estructura con placeholders orientativos.
