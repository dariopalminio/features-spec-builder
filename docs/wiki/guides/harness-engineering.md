---
type: guide
slug: harness-engineering
title: "Harness Engineering"
date: 2026-03-26
status: null
substatus: null
parent: null
related:
  - best-practices-for-agents
  - best-practices-for-commands
  - best-practices-for-skills
---
<!-- Referencias -->
[[best-practices-for-agents]]
[[best-practices-for-commands]]
[[best-practices-for-skills]]

# Harness Engineering

Harness Engineering es un enfoque de diseño y desarrollo de sistemas de IA que se centra en crear un entorno controlado y estructurado para que la IA opere de manera eficiente y efectiva. Este enfoque se basa en varios principios clave:

* **El propio repositorio como sistema:** el repositorio de código no es solo el contenedor del software, sino el propio entorno de trabajo para la IA.
* **Orquestación multiagente:** dividir el trabajo utilizando un patrón donde un agente líder (orquestador) administra las tareas y decide cuándo delegar el trabajo a subagentes especializados.
* **Verificación y automejora:** se debe tener un sistema de verificación integrado (con mecanismos como "agentes revisadores" y "Quality Gates"), obligando a la IA a demostrar que algo funciona (por ejemplo, ejecutando tests automatizados) en lugar de solo decir que terminó.
* **Mantenlo simple con las herramientas (KISS):** otorgarle a la IA herramientas muy sencillas del ecosistema y dejar que la IA deduzca cómo resolver los problemas.
* **Gestión estricta de la memoria y el contexto:** la IA no debe acumular todo en su contexto; debe tener un sistema de memoria externa (ficheros locales o bases de datos) donde lea y escriba solo lo que necesita en cada momento.
* **Evita el "teléfono descompuesto":** cuando el agente padre crea subagentes, no debe pasarles todo su contexto heredado, en su lugar, los subagentes deben escribir sus resultados de forma independiente en un directorio `.tmp/<skill-name>/` para que otros agentes lean exclusivamente lo que necesiten. Ver patrón detallado en `[[best-practices-for-skills]]`.
* **Uso estricto de Protocolos de Inicialización:** La IA no puede empezar a trabajar hasta que un protocolo de verificación valide que el entorno es completamente sano. En este proyecto, ese protocolo está implementado como el skill `skill-preflight` (`[[skill-preflight]]`), que verifica la estructura de directorios, la existencia de templates y las dependencias requeridas antes de ejecutar cualquier skill. No se utiliza un script externo (`init.sh`) sino que la verificación está integrada como un skill reutilizable invocable desde cualquier otro skill.
* **Mantener buenas prácticas y estándares homogéneos:** El código base debe estar bien estructurado y definimos buenas prácticas y reglas claras para que los patrones de resultado esperado sean predecibles.

