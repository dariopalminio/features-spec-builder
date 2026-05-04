## 1. Preparación del skill

- [x] 1.1 Crear el directorio `.claude/skills/release-generate-all-stories/`
- [x] 1.2 Revisar el skill hermano `release-generate-stories/SKILL.md` para alinear estructura y convenciones del nuevo SKILL.md

## 2. Implementación del SKILL.md — Fase de descubrimiento y validación

- [x] 2.1 Crear `.claude/skills/release-generate-all-stories/SKILL.md` con la sección de descripción y trigger del skill
- [x] 2.2 Documentar en SKILL.md la Fase 0: escanear `$SPECS_BASE/specs/releases/` y listar todos los archivos `.md` en orden alfabético
- [x] 2.3 Documentar en SKILL.md el mensaje de error para directorio vacío o inexistente: "No se encontraron archivos de release en docs/specs/releases/"

## 3. Implementación del SKILL.md — Idempotencia en modo batch

- [x] 3.1 Documentar en SKILL.md la Fase 1: detección anticipada de conflictos — verificar qué historias ya existen antes de comenzar el procesamiento
- [x] 3.2 Documentar en SKILL.md la confirmación global única con las tres opciones: (a) sobreescribir todos, (b) saltar todos los existentes, (c) decidir uno por uno
- [x] 3.3 Documentar en SKILL.md el flujo de procesamiento cuando no hay conflictos (proceder directamente sin pantalla de confirmación)

## 4. Implementación del SKILL.md — Procesamiento batch

- [x] 4.1 Documentar en SKILL.md la Fase 2: preparar directorio de destino `$SPECS_BASE/specs/stories/` (crearlo si no existe)
- [x] 4.2 Documentar en SKILL.md la Fase 3: iterar sobre cada archivo de release y aplicar el mismo flujo de extracción y generación de `release-generate-stories` — extraer features de `## Features`, inferir Como/Quiero/Para, generar archivo `story-[ID]-[nombre-kebab].md`
- [x] 4.3 Documentar en SKILL.md el manejo de releases sin features: registrar en resumen y continuar con el siguiente sin interrumpir el batch

## 5. Implementación del SKILL.md — Resumen final

- [x] 5.1 Documentar en SKILL.md la Fase 4: mostrar resumen consolidado con contadores (releases procesados / historias generadas / historias saltadas / releases sin features)
- [x] 5.2 Documentar en SKILL.md el listado de archivos creados y la sugerencia de ejecutar `/story-evaluation` o `/story-refine`

## 6. Verificación funcional

- [x] 6.1 Ejecutar el skill sin argumentos y verificar que escanea todos los archivos de `$SPECS_BASE/specs/releases/` y genera stories para cada uno
- [x] 6.2 Verificar que el resumen final muestra contadores correctos (releases procesados, historias generadas, releases sin features)
- [x] 6.3 Verificar que el skill detecta conflictos y presenta la confirmación global antes de procesar cuando ya existen historias
- [x] 6.4 Verificar que el skill muestra error descriptivo cuando `$SPECS_BASE/specs/releases/` está vacío o no existe

## 7. Integración con el release activo

- [x] 7.1 Marcar FEAT-035 como completado (`[x]`) en `$SPECS_BASE/specs/releases/release-06-release-and-story-generator.md`
