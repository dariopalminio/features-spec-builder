## Context

Los tres skills del pipeline (`ps-begin-intention`, `ps-discovery`, `ps-planning`) son orchestrators en Markdown que instruyen al agente cómo actuar. Actualmente cada SKILL.md asume que siempre se ejecuta sobre un proyecto nuevo: lee el template, delega a los agentes, y escribe el output. No existe ninguna lógica de estado previo.

El estado del proyecto vive íntegramente en el filesystem: los documentos en `docs/specs/projects/` incluyen el campo `**Estado**: Doing | Ready` en su frontmatter. Este campo es la única fuente de verdad sobre el progreso de una fase.

El cambio consiste en agregar una **fase de precondiciones** al inicio de cada SKILL.md que lea ese campo y bifurque el comportamiento antes de delegar al agente.

## Goals / Non-Goals

**Goals:**
- Detectar automáticamente el estado del documento de cada fase al inicio del skill
- Definir comportamiento explícito para los tres escenarios: inexistente, Doing, Ready
- Implementar retoma de sesión cuando el documento está en `Doing`
- Implementar idempotencia cuando el documento está en `Ready`
- Implementar detección de conflicto WIP=1 en `ps-begin-intention`
- Formalizar el patrón de cierre de fase con feedback al usuario

**Non-Goals:**
- Validación de placeholders `[...]` dentro del documento (Release 3)
- Modificación de agentes (`product-manager-agent`, `architect-agent`, `ux-designer-agent`)
- Modificación de templates de output
- Persistencia de estado conversacional entre sesiones (fuera del campo `Estado:`)

## Decisions

### Decisión 1: La lógica de estado vive en el SKILL.md, no en los agentes

**Alternativa considerada:** Poner la lógica de detección dentro del agente delegado.

**Decisión:** La lógica de precondiciones vive en el orchestrator (SKILL.md). Los agentes son stateless por diseño — saben hacer su tarea pero no necesitan saber si es la primera vez o una retoma. Separar la orquestación de la ejecución mantiene los agentes reutilizables y el SKILL.md como único punto de control del flujo.

### Decisión 2: Leer el campo `Estado:` del documento existente, no un lock file externo

**Alternativa considerada:** Usar un archivo `.wip-lock` separado para rastrear estado activo.

**Decisión:** El campo `**Estado**: Doing | Ready` ya existe en todos los documentos generados. Usarlo como fuente de verdad evita estado duplicado y mantiene el principio de "solo archivos Markdown". Un lock file externo sería estado adicional que puede desincronizarse.

### Decisión 3: Para WIP=1, verificar todos los documentos de output, no solo el de la fase actual

**Decisión:** Al ejecutar `/ps-begin-intention`, el skill verifica si existe cualquier documento en `docs/specs/projects/` con `Estado: Doing`. Si encuentra uno, avisa y ofrece las opciones. Esto cubre el caso de un proyecto interrumpido en cualquier fase.

### Decisión 4: En caso de retoma (`Estado: Doing`), el agente lee el documento existente y continúa

**Alternativa considerada:** Reiniciar la entrevista desde cero con el documento como contexto.

**Decisión:** El agente recibe instrucción de leer el documento en `Doing`, identificar las secciones con placeholders sin completar (`[...]`) y continuar solo con esas secciones. Las secciones ya completas no se repiten. Esto minimiza la fricción de retoma.

### Decisión 5: Patrón de cierre de fase formalizado como sección en SKILL.md

**Decisión:** Agregar una sección `### 5. Confirmar el output` explícita en cada SKILL.md que el orchestrator debe ejecutar siempre al final, con el path del archivo generado y el siguiente comando del workflow.

## Risks / Trade-offs

**[Riesgo] El agente puede no identificar correctamente las secciones incompletas al retomar**
→ Mitigación: La instrucción de retoma especifica explícitamente que debe buscar campos con formato `[...]` o `[Nombre del Proyecto]` como indicadores de secciones sin completar.

**[Riesgo] Si el usuario editó manualmente el documento en `Doing`, el agente puede sobrescribir cambios**
→ Mitigación: La instrucción de retoma indica que el agente debe pre-rellenar desde el documento existente y solo preguntar lo que falta. Los campos ya completados se preservan.

**[Riesgo] El campo `Estado:` puede tener variaciones de formato (mayúsculas, espacios)**
→ Mitigación: Los templates generan siempre `**Estado**: Doing` o `**Estado**: Ready`. El orchestrator busca ambas formas con instrucción explícita al agente de leer el campo exacto.

**[Trade-off] La lógica de estado en lenguaje natural (Markdown) es menos robusta que código**
→ Aceptado: Es coherente con el principio de "solo Markdown". La lógica es simple (tres ramas) y el lenguaje natural de los SKILL.md es suficientemente preciso para guiar al LLM.
