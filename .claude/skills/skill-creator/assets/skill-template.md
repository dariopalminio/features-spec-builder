---
name: nombre-del-skill
description: >
  Qué hace este skill y cuándo usarlo. Incluir frases clave que disparan el skill.
  Invocar también cuando el usuario mencione "<alias>", "<alias>" o equivalentes.
triggers:
  - "<frase clave que dispara el skill>"
  - "<alias o variante>"
---

# Skill: `/<nombre-del-skill>`

## Objetivo

[Descripción concisa de qué hace y por qué. Una o dos oraciones.]

## Entrada

[Archivos, variables de entorno o contexto necesario para ejecutar el skill.]

## Parámetros

- `--id <id>`: identificador del workitem (opcional)
- `--auto`: modo automático sin interacción

## Dependencias

- Skills: [`skill-preflight`]
- Herramientas: [`git`]

## Modos de ejecución

- **Manual**: `/<nombre-del-skill>` — pide confirmación al usuario antes de escribir.
- **Automático**: invocado por otro skill — no pide confirmación.

## Restricciones / Reglas

- Regla 1: [descripción de restricción]
- Regla 2: [descripción de restricción]

## Flujo de ejecución

### 0. Preflight
- Invocar `skill-preflight`. Detener si reporta ERROR.

### 1. Cargar contexto
- Leer los artefactos necesarios (story.md, design.md, etc.).

### 2. Proceso principal
- [Subpasos específicos de la lógica del skill.]

### 3. Manejo de errores
- Si algo falla, notificar al usuario con mensaje claro y salir.

### 4. Fin de proceso
- Actualizar frontmatter del documento de salida.
- Generar informe si aplica.

## Salida

- [Archivo o artefacto generado o modificado.]
- [Nuevo estado del workitem si aplica.]
