## 1. Búsqueda de referencias previas

- [x] 1.1 Buscar con Grep todas las referencias a `project-begin-intention` en el repositorio (CLAUDE.md, MEMORY.md, README, otros archivos)
- [x] 1.2 Anotar los archivos que requieren actualización

## 2. Rename del directorio

- [x] 2.1 Ejecutar `git mv .claude/skills/project-begin-intention .claude/skills/project-begin`

## 3. Actualización de contenido interno del skill

- [x] 3.1 Actualizar el campo `name` y referencias en `.claude/skills/project-begin/SKILL.md` de `project-begin-intention` a `project-begin`
- [x] 3.2 Actualizar rutas internas del skill que referencien el directorio antiguo (templates, ejemplos, scripts)

## 4. Actualización de referencias externas

- [x] 4.1 Actualizar referencias en `CLAUDE.md` si mencionan `project-begin-intention`
- [x] 4.2 Actualizar referencias en `MEMORY.md` si mencionan `project-begin-intention`
- [x] 4.3 Actualizar referencias en `README.md` u otros docs si aplica

## 5. Verificación

- [x] 5.1 Verificar que `.claude/skills/project-begin/SKILL.md` existe y tiene frontmatter válido
- [x] 5.2 Confirmar que no quedan referencias al nombre antiguo con Grep final
