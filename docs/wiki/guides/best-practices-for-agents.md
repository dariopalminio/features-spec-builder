---
type: guide
slug: best-practices-for-agents
title: "Buenas prácticas para Agentes"
date: 2026-03-26
status: null
substatus: null
parent: null
related:                                    # opcional, si tiene relación con otros nodos
  - best-practices-for-skills
  - best-practices-for-commands
---

# Buenas prácticas para Agentes

Los **agentes**, las **skills** y los **comandos** son elementos fundamentales para estructurar un el equipo de inteligencia artificial automatizado para Agile Spec-Driven Development Framework (SDDF). Aquí tienes la definición y el uso de agentes:

## Agentes

Los agentes funcionan como **pequeños empleados virtuales especializados** en tareas concretas dentro de un proyecto, como por ejemplo un agente que hace discovery, otro que redacta especificaciones o uno que diseña arquitectura. Técnicamente, son archivos de texto (Markdown) que contienen instrucciones de roly contexto específico sobre cómo deben actuar. Estos agentes pueden trabajar de forma autónoma, simultánea o en equipo, entregando resultados listos para usar.

### Custom Agents en Github Copilot (Agentes personalizados)

Representan personas artificiales con tareas específicas. Pueden tener sus propias instrucciones, restricciones de herramientas y contexto personalizado. Existen de dos tipos:

* **Agentes personalizados:** Seleccionados manualmente desde un desplegable para proyectos o flujos que necesitan una persona específica (como un agente revisor de React o un auditor de seguridad).

* **Subagentes:** Invocados automáticamente por el agente principal para delegar trabajo en un contexto aislado, aunque no son configurados por el usuario directamente.

