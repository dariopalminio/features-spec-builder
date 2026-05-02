## 1. Skills L3 Project

- [x] 1.1 Actualizar `project-begin` SKILL.md: añadir lectura de `SDDF_ROOT` con fallback a `docs` y sustituir rutas hardcodeadas por `$SPECS_BASE`
- [x] 1.2 Actualizar `project-discovery` SKILL.md: añadir lectura de `SDDF_ROOT` con fallback a `docs` y sustituir rutas hardcodeadas por `$SPECS_BASE`
- [x] 1.3 Actualizar `project-planning` SKILL.md: añadir lectura de `SDDF_ROOT` con fallback a `docs` y sustituir rutas hardcodeadas por `$SPECS_BASE`

## 2. Skills L2 Release

- [x] 2.1 Actualizar `releases-from-project-plan` SKILL.md: añadir lectura de `SDDF_ROOT` y sustituir rutas por `$SPECS_BASE`
- [x] 2.2 Actualizar `release-generate-stories` SKILL.md: añadir lectura de `SDDF_ROOT` y sustituir rutas por `$SPECS_BASE`
- [x] 2.3 Actualizar `release-generate-all-stories` SKILL.md: añadir lectura de `SDDF_ROOT` y sustituir rutas por `$SPECS_BASE`

## 3. Skills L1 Story

- [x] 3.1 Actualizar `story-creation` SKILL.md: añadir lectura de `SDDF_ROOT` y sustituir rutas por `$SPECS_BASE`
- [x] 3.2 Actualizar `story-split` SKILL.md: añadir lectura de `SDDF_ROOT` y sustituir rutas por `$SPECS_BASE`
- [x] 3.3 Actualizar `story-evaluation` SKILL.md: añadir lectura de `SDDF_ROOT` y sustituir rutas por `$SPECS_BASE`
- [x] 3.4 Actualizar `story-refine` SKILL.md (si aplica): añadir lectura de `SDDF_ROOT` y sustituir rutas por `$SPECS_BASE`

## 4. Skills de soporte y análisis

- [x] 4.1 Actualizar `project-story-mapping` SKILL.md: añadir lectura de `SDDF_ROOT` y sustituir rutas por `$SPECS_BASE`
- [x] 4.2 Actualizar `reverse-engineering` SKILL.md: añadir lectura de `SDDF_ROOT` y sustituir rutas de salida por `$SPECS_BASE`
- [x] 4.3 Actualizar `header-aggregation` SKILL.md: añadir lectura de `SDDF_ROOT` y sustituir rutas por `$SPECS_BASE`

## 5. Validación de ruta inválida

- [x] 5.1 Verificar que cada skill actualizado incluye la comprobación de existencia de ruta y emite la advertencia `⚠️  La ruta definida en SDDF_ROOT no existe. Se usará el valor por defecto: docs` antes de hacer fallback

## 6. Documentación

- [x] 6.1 Añadir sección `SDDF_ROOT` al `README.md`: propósito, valor por defecto, ejemplo de uso (`export SDDF_ROOT=".sdd"`) y nota sobre rutas con espacios
- [x] 6.2 Actualizar la guía de instalación (`docs/wiki/`) para mencionar la variable `SDDF_ROOT` como opción de configuración

## 7. Verificación

- [x] 7.1 Ejecutar un skill representativo (e.g., `story-creation`) con `SDDF_ROOT` definida y verificar que los artefactos se crean en la ruta configurada
- [x] 7.2 Ejecutar el mismo skill sin `SDDF_ROOT` y verificar que opera sobre `docs/specs/stories/` (retrocompatibilidad)
- [x] 7.3 Ejecutar el skill con `SDDF_ROOT` apuntando a ruta inexistente y verificar que aparece la advertencia y el fallback a `docs` funciona
