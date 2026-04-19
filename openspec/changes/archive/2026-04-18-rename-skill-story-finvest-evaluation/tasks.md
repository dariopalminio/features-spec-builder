## 1. Búsqueda de referencias previas

- [x] 1.1 Buscar con Grep todas las referencias a `story-finvest-evaluation` en el repositorio (excluir archives y .tmp)
- [x] 1.2 Anotar los archivos que requieren actualización

## 2. Rename de directorios

- [x] 2.1 Ejecutar `git mv .claude/skills/story-finvest-evaluation .claude/skills/story-evaluation`
- [x] 2.2 Renombrar `.github/skills/story-finvest-evaluation` a `.github/skills/story-evaluation`
- [x] 2.3 Renombrar `.agents/skills/story-finvest-evaluation` a `.agents/skills/story-evaluation`

## 3. Actualización de SKILL.md internos

- [x] 3.1 Actualizar campo `name` y referencias en `.claude/skills/story-evaluation/SKILL.md`
- [x] 3.2 Actualizar campo `name` y referencias en `.github/skills/story-evaluation/SKILL.md`
- [x] 3.3 Actualizar campo `name` y referencias en `.agents/skills/story-evaluation/SKILL.md`

## 4. Actualización de referencias externas

- [x] 4.1 Actualizar referencias en `.claude/skills/story-split/SKILL.md` si menciona `story-finvest-evaluation`
- [x] 4.2 Actualizar referencias en `.claude/skills/story-creation/SKILL.md` si menciona `story-finvest-evaluation`
- [x] 4.3 Actualizar referencias en `rovo/story-creator-agent.md` y `rovo/story-splitter-agent.md`
- [x] 4.4 Actualizar referencias en `.github/skills/story-split/SKILL.md` y `.github/skills/story-creation/SKILL.md`
- [x] 4.5 Actualizar referencias en `.agents/skills/story-split/SKILL.md` y `.agents/skills/story-creation/SKILL.md`
- [x] 4.6 Actualizar `README.md`

## 5. Verificación

- [x] 5.1 Confirmar que `.claude/skills/story-evaluation/SKILL.md` existe con `name: story-evaluation`
- [x] 5.2 Confirmar que no quedan referencias al nombre antiguo en archivos activos con Grep final
