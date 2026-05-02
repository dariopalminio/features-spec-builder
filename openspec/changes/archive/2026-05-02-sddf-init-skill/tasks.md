## 1. Crear skill sddf-init

- [x] 1.1 Crear directorio `.claude/skills/sddf-init/`
- [x] 1.2 Crear `.claude/skills/sddf-init/SKILL.md` con frontmatter (`name`, `description`) y las instrucciones completas del protocolo de inicialización: resolución de `SDDF_ROOT`, creación de directorios, generación de `openspec/config.yaml` mínimo, generación de `.env.template`, informe de resultado
- [x] 1.3 Crear el template mínimo `openspec/config.yaml` de referencia en `.claude/skills/sddf-init/assets/config.yaml.template` para que el skill lo use al generar el archivo en el proyecto

## 2. Crear spec sddf-init en openspec/specs

- [x] 2.1 Crear directorio `openspec/specs/sddf-init/`
- [x] 2.2 Crear `openspec/specs/sddf-init/spec.md` copiando y consolidando el contenido de `openspec/changes/sddf-init-skill/specs/sddf-init/spec.md`

## 3. Actualizar skill-preflight

- [x] 3.1 Actualizar `openspec/specs/skill-preflight/spec.md` añadiendo el requisito `ADDED` que documenta el flujo `sddf-init → skill-preflight → [skill]`
- [x] 3.2 Actualizar `.claude/skills/skill-preflight/SKILL.md` para mencionar `sddf-init` como predecesor en el flujo de onboarding (sección de descripción o nota inicial)

## 4. Registrar el skill en el sistema

- [x] 4.1 Verificar que el nuevo skill `sddf-init` aparece en el listado de skills disponibles (SKILL.md con nombre y descripción correctos en el frontmatter)
- [x] 4.2 Actualizar `docs/wiki/guides/root-folder-practices.md` o la guía de onboarding correspondiente para incluir `sddf-init` como primer paso del flujo de configuración de un proyecto SDDF nuevo

## 5. Verificar idempotencia y escenarios de error

- [x] 5.1 Verificar manualmente el escenario "proyecto nuevo sin SDDF" — ejecutar `sddf-init` y confirmar que los 3 directorios y los 2 archivos se crean
- [x] 5.2 Verificar manualmente el escenario "idempotencia" — ejecutar `sddf-init` dos veces y confirmar que no hay errores ni sobreescrituras
- [x] 5.3 Verificar el escenario "SDDF_ROOT inexistente" — configurar `SDDF_ROOT` con ruta inválida y confirmar que el skill aborta sin crear nada
