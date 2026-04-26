## Context

The repository currently standardizes skill-local templates under `templates/` through existing capability requirements. However, the broader Agent Skills ecosystem treats `assets/` as the canonical folder for static resources, including templates, images, and helper files. This mismatch causes reduced compatibility with out-of-the-box tooling and validator expectations.

This change is a structural migration that updates naming conventions while preserving current behavior. It affects multiple mirrored skill trees and reference points in `SKILL.md` and related docs.

## Goals / Non-Goals

**Goals:**
- Align skill resource directory naming with the canonical `assets/` convention.
- Ensure all references to skill-local templates/resources point to `assets/` paths.
- Keep migration deterministic, auditable, and safe for multi-client mirrors.
- Preserve behavior and generated outputs from all existing skills.

**Non-Goals:**
- Redesigning skill prompts or template content semantics.
- Introducing new agent orchestration logic.
- Changing business workflow stages (project/release/story pipelines).

## Decisions

1. Directory naming standardization to `assets/`
- Decision: Replace `templates/` with `assets/` in skill directories where templates/resources are currently stored.
- Rationale: `assets/` is the ecosystem-recognized convention and improves interoperability.
- Alternative considered: Keep `templates/` and document exception.
- Rejected because it perpetuates divergence and weakens tool compatibility.

2. Update path references, not content semantics
- Decision: Update only filesystem paths and path mentions in markdown/instructions.
- Rationale: Minimizes risk by avoiding behavioral changes.
- Alternative considered: Refactor template file structures during migration.
- Rejected to keep scope controlled and rollback simple.

3. Maintain mirror parity
- Decision: Apply equivalent path updates across mirrored skill locations (`.claude/`, `.agents/`, `.github/`) where present.
- Rationale: Avoids client-specific drift and broken references.
- Alternative considered: Update only source-of-truth and defer mirrors.
- Rejected due to temporary inconsistency and tooling confusion.

4. Keep compatibility expression explicit in specs
- Decision: Update OpenSpec capability requirements to codify `assets/` and accepted explicit root variant `{{SKILL_ROOT}}/assets/<file>`.
- Rationale: Prevents regressions and establishes a clear contract for future skills.

## Risks / Trade-offs

- [Risk] Missed path references leave broken links in some skills or docs. -> Mitigation: Run repository-wide search for `/templates/` patterns under skill contexts and validate no stale references remain.
- [Risk] Partial migration across mirror directories causes platform-specific breakage. -> Mitigation: Include mirror parity as a required checklist item in tasks.
- [Risk] External users with local custom automations expect `templates/`. -> Mitigation: Document migration in changelog/release notes and provide simple mapping (`templates/` -> `assets/`).

## Migration Plan

1. Inventory all skill directories that contain `templates/`.
2. Rename each `templates/` directory to `assets/` preserving file contents.
3. Update all relative/explicit path references in `SKILL.md`, agents, and docs.
4. Validate with repository search for stale skill-template path patterns.
5. Verify OpenSpec artifacts and capability docs reflect the new convention.
6. Rollback strategy: rename `assets/` back to `templates/` and revert reference updates from version control if critical regressions are found.

## Open Questions

- Should a temporary compatibility alias (both `templates/` and `assets/`) be supported for one release cycle, or is hard migration acceptable immediately?
- Are there any external CI validators in downstream repos that parse `templates/` explicitly and need coordinated updates?
