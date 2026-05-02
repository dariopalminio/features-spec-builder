## 1. Template

- [x] 1.1 Create `.claude/skills/ps-plan/templates/project-plan-template.md` with sections: metadata block, Objetivo, Backlog de Features (table with Prioridad/Feature/Dependencias), Propuesta de Releases (MVP + Release 2), and Resumen (metrics table)
- [x] 1.2 Add HTML `<!-- -->` comments in each template section as generation guidance for the planning-agent

## 2. Planning Agent

- [x] 2.1 Create `.claude/agents/planning-agent.md` with frontmatter: `name: planning-agent`, `description`, `tools: [Read, Write, AskUserQuestion]`, `model: sonnet`
- [x] 2.2 Write agent Step 1: read all five input documents (`initial-prompt.md`, `project-intent.md`, `discovery.md`, `requirement-spec.md`, `clarifications.md`) — note missing files and continue
- [x] 2.3 Write agent Step 2: read template at `.claude/skills/ps-plan/templates/project-plan-template.md` and extract section structure dynamically from `##` headers and `<!-- -->` comments
- [x] 2.4 Write agent Step 3: extract atomic features (FEAT-NNN IDs), one-sentence descriptions, and dependency relationships from input documents
- [x] 2.5 Write agent Step 4: prioritize features (business value → dependency order → technical risk) and group into releases with MVP in Release 1
- [x] 2.6 Write agent Step 5: write `docs/specs/projects/project-plan.md` using template structure, including metadata (`Estado: Doing`, date, `Generado por: planning-agent`), full backlog with `- [ ]` checkboxes, release proposals with success criteria, and summary metrics table
- [x] 2.7 Write agent closing message: inform user document is ready, suggest review, prompt to run `/ps-finish` when ready

## 3. ps-plan Skill (replace stub)

- [x] 3.1 Replace `.claude/skills/ps-plan/SKILL.md` stub with full orchestrator skill: update frontmatter description to reflect Planning phase role
- [x] 3.2 Add Step 1 to skill: verify `docs/specs/projects/clarifications.md` exists — halt with error and `/ps-approval` instruction if missing
- [x] 3.3 Add Step 2 to skill: verify `.claude/skills/ps-plan/templates/project-plan-template.md` exists — halt with error if missing
- [x] 3.4 Add Step 3 to skill: invoke `planning-agent` with instruction to read all input documents, read template, and write `docs/specs/projects/project-plan.md`
- [x] 3.5 Add Step 4 to skill: verify `docs/specs/projects/project-plan.md` exists after agent completes — show success message and next-step prompt, or error with re-run suggestion

## 4. Validation (human review)

- [ ] 4.1 Run `/ps-plan` on an existing project with all prior documents present and verify `project-plan.md` is generated correctly
- [ ] 4.2 Verify feature backlog contains FEAT-NNN IDs, `- [ ]` checkboxes, and dependency column
- [ ] 4.3 Verify MVP release is clearly labeled and contains success criteria
- [ ] 4.4 Verify summary metrics table reflects actual feature counts
- [ ] 4.5 Verify re-running `/ps-plan` overwrites the document without duplicating content
