## 1. Inventory and directory migration

- [x] 1.1 Identify all skill directories in `.claude/skills/` that currently contain a `templates/` folder.
- [x] 1.2 Rename each discovered `templates/` folder to `assets/` while preserving file contents and relative structure.
- [x] 1.3 Apply equivalent directory migration in mirrored skill trees (`.agents/skills/`, `.github/skills/`) where the same skills exist.

## 2. Reference updates

- [x] 2.1 Update `SKILL.md` files to replace `templates/<file>` with `assets/<file>` (or `{{SKILL_ROOT}}/assets/<file>` when explicit root is required).
- [x] 2.2 Update agent/docs/script references that target skill-local `templates/` paths to `assets/` paths.
- [x] 2.3 Ensure no client-prefixed hardcoded template paths remain in `SKILL.md` files.

## 3. Spec and consistency validation

- [x] 3.1 Validate that changed files satisfy the updated `skill-template-autonomy` requirements and scenarios.
- [x] 3.2 Run repository-wide search to confirm no stale skill-local `templates/` references remain.
- [x] 3.3 Verify mirror parity so `.claude/`, `.agents/`, and `.github/` copies are consistent for migrated skills.

## 4. Final verification and documentation

- [x] 4.1 Confirm all OpenSpec artifacts for this change are complete and `openspec status --change "migrate-skill-templates-to-assets"` reports apply-ready.
- [x] 4.2 Add concise migration notes (mapping `templates/` -> `assets/`) in relevant changelog/release documentation if needed.
