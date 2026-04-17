## Context

El agente `architect` (`.claude/agents/architect.agent.md`, `name: architect`) es invocado por nombre en los skills `project-planning` y `project-discovery`, y referenciado en `ux-designer.agent.md`. Los specs de openspec también lo mencionan como `architect-agent`. Este renombre completa la uniformidad del pipeline junto con los tres skills ya renombrados.

## Goals / Non-Goals

**Goals:**
- Renombrar el archivo del agente de `architect.agent.md` a `project-architect.agent.md`
- Actualizar `name: architect` → `name: project-architect` en el frontmatter
- Actualizar todas las invocaciones del agente por nombre (`architect`, `architect-agent`) en skills, otros agentes y specs

**Non-Goals:**
- Cambiar la lógica o comportamiento del agente
- Renombrar menciones genéricas del rol ("Software Architect", "Arquitecto de Software") — solo las invocaciones por nombre del agente
- Modificar archivos en `openspec/changes/archive/` (historia congelada)

## Decisions

**Approach: `git mv` + reemplazo quirúrgico**
- Usar `git mv` para renombrar el archivo del agente
- Reemplazar `name: architect` en el frontmatter explícitamente
- Para skills y specs: reemplazar patrones de invocación específicos (`agente \`architect\``, `` `architect` ``, `architect-agent`) → `project-architect`
- NO hacer reemplazo global ciego — verificar cada archivo para evitar afectar descripciones de rol

## Risks / Trade-offs

- [Risk] Reemplazo global afecta menciones de rol genéricas → Mitigación: revisión archivo por archivo con reemplazos quirúrgicos
- [Risk] Archivos del archive contienen `architect` → Mitigación: no modificar `openspec/changes/archive/`
