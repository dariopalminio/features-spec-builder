## 1. Renombrar directorio del skill

- [x] 1.1 Renombrar `.claude/skills/ps-project-spec/` → `.claude/skills/ps-discovery/`

## 2. Actualizar SKILL.md

- [x] 2.1 Actualizar frontmatter `name:` en `.claude/skills/ps-discovery/SKILL.md` — cambiar `ps-project-spec` → `ps-discovery`
- [x] 2.2 Actualizar `description:` en el frontmatter para reflejar el nuevo nombre
- [x] 2.3 Actualizar las rutas de template en el cuerpo del SKILL.md — reemplazar `ps-project-spec/templates/` → `ps-discovery/templates/`
- [x] 2.4 Actualizar los mensajes de error y confirmación en el SKILL.md que mencionen `/ps-project-spec` → `/ps-discovery`

## 3. Actualizar CLAUDE.md

- [x] 3.1 Actualizar la sección `Comandos Disponibles` — cambiar `/ps-project-spec` → `/ps-discovery`
- [x] 3.2 Actualizar la tabla `Documentos por Estado` si referencia `ps-project-spec`
- [x] 3.3 Actualizar la sección `Documentos de plantillas` — cambiar ruta `ps-project-spec` → `ps-discovery`
- [x] 3.4 Actualizar la `Estructura del Proyecto` — cambiar `ps-project-spec/` → `ps-discovery/`

## 4. Actualizar ps-planning/SKILL.md

- [x] 4.1 Actualizar mensaje de error en `.claude/skills/ps-planning/SKILL.md` — cambiar referencia a `/ps-project-spec` → `/ps-discovery`

## 5. Verificación

- [x] 5.1 Verificar que no quedan referencias a `ps-project-spec` en ningún SKILL.md activo ni en `CLAUDE.md`
