# Spec Driven Development (SDD)

## Qué es Spec Driven Development
Spec Driven Development propone, en esencia que la especificación preceda y guíe al código. No es un marco de trabajo ni una metodología prescriptiva como scrum. Es más bien un enfoque de trabajo que propone:

Escribir primero una especificación clara de lo que se quiere construir: objetivos, reglas de negocio, criterios de aceptación, restricciones técnicas.

Usar esa especificación como fuente tanto para humanos como para agentes de IA.

Generar código a partir de la spec, no de prompts improvisados.

Como lo resume GitHub en su documentación de Spec Kit: "En este nuevo mundo, mantener software significa evolucionar especificaciones. [...] El código es el enfoque de última milla."[3]

SDD no propone documentación extensiva estilo waterfall. Propone especificaciones vivas, ejecutables y versionadas que evolucionan con el código. Como GitHub lo describe: "Spec-Driven Development no se trata de escribir documentos de requisitos exhaustivos que nadie lee. Tampoco se trata de planificación waterfall."[3]

## Herramientas del ecosistema SDD

El ecosistema de herramientas SDD está creciendo rápidamente:[6]

- **OpenSpec:** OpenSpec es un framework de SDD creado por Fission AI, publicado bajo licencia MIT. Su flujo principal es: /opsx:propose ──► /opsx:apply ──► /opsx:archive

- **GitHub Spec Kit:** Toolkit open source que proporciona un flujo estructurado: Constitution → Specify → Plan → Tasks → Implement. Funciona con Copilot, Claude Code y otros.

- **Kiro (AWS):** IDE basado en VS Code con flujo integrado de Requirements → Design → Tasks.

- **Tessl Framework:** Explora el nivel spec-as-source con mapeo 1:1 entre specs y archivos de código.

- **BMAD Method:** Usa agentes virtuales (Analyst, Product Manager, Architect) para generar PRDs y specs de arquitectura.



Referencias:
[3]: GitHub Blog - Spec-driven development with AI: github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai 
