## 1. Renombrar directorios del skill

- [x] 1.1 Renombrar `.claude/skills/finvest-evaluation/` → `.claude/skills/story-finvest-evaluation/` (usar `git mv`)
- [x] 1.2 Renombrar `.agents/skills/finvest-evaluation/` → `.agents/skills/story-finvest-evaluation/` (usar `git mv`)
- [x] 1.3 Renombrar `.github/skills/finvest-evaluation/` → `.github/skills/story-finvest-evaluation/` (usar `git mv`)

## 2. Actualizar SKILL.md del skill renombrado

- [x] 2.1 Actualizar el nombre/título del skill en `.claude/skills/story-finvest-evaluation/SKILL.md`
- [x] 2.2 Sincronizar el mismo cambio en `.agents/skills/story-finvest-evaluation/SKILL.md`
- [x] 2.3 Sincronizar el mismo cambio en `.github/skills/story-finvest-evaluation/SKILL.md`

## 3. Actualizar referencias en skills hermanos

- [x] 3.1 Actualizar referencia a `finvest-evaluation` en `.claude/skills/story-creation/SKILL.md`
- [x] 3.2 Actualizar referencia a `finvest-evaluation` en `.claude/skills/story-split/SKILL.md`
- [x] 3.3 Sincronizar cambios en `.agents/skills/story-creation/SKILL.md` y `.agents/skills/story-split/SKILL.md`
- [x] 3.4 Sincronizar cambios en `.github/skills/story-creation/SKILL.md` y `.github/skills/story-split/SKILL.md`

## 4. Actualizar referencias en documentación y agentes Rovo

- [x] 4.1 Actualizar referencia en `rovo/story-creator-agent.md`
- [x] 4.2 Actualizar referencia en `rovo/story-splitter-agent.md`
- [x] 4.3 Revisar y actualizar `README.md` si menciona el skill por nombre
- [x] 4.4 Revisar y actualizar `CHANGELOG.md` si hay entradas que referencien el nombre antiguo

## 5. Verificación final

- [x] 5.1 Ejecutar `grep -r "finvest-evaluation" . --include="*.md" -l` y confirmar que no quedan referencias (excepto historial de changelog si aplica)
- [x] 5.2 Verificar que el skill `story-finvest-evaluation` aparece en el listado de skills disponibles en Claude Code
