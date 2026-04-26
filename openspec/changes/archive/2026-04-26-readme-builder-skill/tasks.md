## 1. Skill Directory Setup

- [x] 1.1 Create directory `.claude/skills/readme-builder/`
- [x] 1.2 Create directory `.claude/skills/readme-builder/templates/`
- [x] 1.3 Copy `docs/specs/templates/readme-template.md` → `.claude/skills/readme-builder/templates/readme-template.md`

## 2. SKILL.md Authoring

- [x] 2.1 Write SKILL.md frontmatter: name `readme-builder`, description, alwaysApply false
- [x] 2.2 Document the three-tier artifact discovery order (formal specs → LLM-context files → reverse-engineering)
- [x] 2.3 Document runtime template extraction: read `##`/`###` headers + `<!-- -->` comments as section prompts
- [x] 2.4 Document write guard: detect existing README.md, offer overwrite / save-as-README-new.md / cancel via AskUserQuestion
- [x] 2.5 Document fallback message when no information found: "No se encontraron artefactos de especificación para generar el README" + suggest `/project-discovery`
- [x] 2.6 Document output path rules: always write to project root (`README.md` or `README-new.md`), never to template path

## 3. Artifact Discovery Logic (in SKILL.md)

- [x] 3.1 Define Step 1 — check for formal spec artifacts: `docs/specs/project/project-intent.md`, `requirement-spec.md`, `project-plan.md`
- [x] 3.2 Define Step 2 — if no formal artifacts, check for LLM-context files: `AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`
- [x] 3.3 Define Step 3 — if neither found, describe reverse-engineering approach: read package.json, main/index files, top-level directories

## 4. Template Extraction and Content Generation (in SKILL.md)

- [x] 4.1 Document how to extract sections from template at runtime (header + comment → section name + generation prompt)
- [x] 4.2 Specify that section prompts are derived from comments — never hardcoded
- [x] 4.3 Specify best-effort generation for sections without comments (use header name as prompt)

## 5. Write Guard Implementation (in SKILL.md)

- [x] 5.1 Document README.md existence check before any write
- [x] 5.2 Define the three-option AskUserQuestion: overwrite, save-as-README-new.md, cancel
- [x] 5.3 Confirm that the template file is never written to (read-only invariant)

## 6. Skill Registration

- [x] 6.1 Verify the new skill appears in Claude Code's available skills list after creation
- [x] 6.2 Confirm the skill is triggerable via `/readme-builder`

## 7. Validation

- [ ] 7.1 Test happy path: project with all three spec artifacts → README.md generated in project root
- [ ] 7.2 Test write guard: existing README.md → skill prompts, user chooses overwrite → README.md replaced
- [ ] 7.3 Test write guard: existing README.md → user chooses save-as-new → README-new.md created, README.md untouched
- [ ] 7.4 Test fallback: no spec artifacts, CLAUDE.md present → README generated from CLAUDE.md
- [ ] 7.5 Test reverse-engineering fallback: no artifacts, no LLM-context files → README generated from code
- [ ] 7.6 Confirm template file is unchanged after any test run
