<!-- Referencias -->
[[FEAT-073-skill-security-audit-condicional]]

## ADDED Requirements

### Requirement: Security audit runs in parallel with code review agents
`story-code-review` SHALL invoke `security-audit --repo $SDDF_ROOT --story $STORY_DIR` as a fourth parallel participant alongside the three existing reviewer agents (Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer). The audit MUST start at the same time as the other three agents and the skill SHALL wait for all four to complete before consolidating results.

#### Scenario: Security audit launches in parallel
- **WHEN** `story-code-review` reaches Paso 3b with a story that has source files
- **THEN** four participants run simultaneously: Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, and security-audit
- **THEN** the progress message includes a fourth line `🔒 Security-Audit → analizando archivos modificados`

### Requirement: Security audit scope is limited to story files
`security-audit` SHALL be invoked with `--story <$STORY_DIR>` so that file resolution (via git diff or tasks.md) is delegated to the skill itself. `story-code-review` SHALL NOT resolve the list of changed files independently for this purpose.

#### Scenario: File scope is resolved by security-audit
- **WHEN** `security-audit` is invoked with `--story $STORY_DIR`
- **THEN** it resolves changed files via `git diff main...HEAD --name-only` filtered to story scope, falling back to tasks.md if git diff yields no results
- **THEN** only files associated with that story are audited

### Requirement: Security audit result is read and incorporated into consolidation
After all four participants finish, `story-code-review` SHALL read `.tmp/security-audit/audit-report.md` and include its outcome in the severity calculation. A `FAIL` status from the security audit SHALL be treated as equivalent to `max-severity: HIGH` when computing `$REVIEW_STATUS`.

#### Scenario: Security audit FAIL triggers needs-changes
- **WHEN** `security-audit` completes with `status: FAIL` in `audit-report.md`
- **THEN** `$MAX_SEVERITY` is set to at least HIGH
- **THEN** `$REVIEW_STATUS = needs-changes`
- **THEN** `fix-directives.md` includes security findings with file:line references where available

#### Scenario: Security audit PASS does not block review
- **WHEN** `security-audit` completes with `status: PASS` in `audit-report.md`
- **THEN** no security-related severity is added to `$MAX_SEVERITY`
- **THEN** the review proceeds to approval if no other blockers exist

### Requirement: Security audit is skipped for documentation-only stories
If `security-audit` detects no source files (`source_files_found: false` or `audit-report.md` absent), `story-code-review` SHALL skip the security audit without blocking the review. The skip MUST be recorded in `code-review-report.md`.

#### Scenario: Skip on no source files
- **WHEN** `.tmp/security-audit/audit-report.md` does not exist after invocation, OR it contains `source_files_found: false`
- **THEN** no security severity is added to `$MAX_SEVERITY`
- **THEN** `code-review-report.md` includes `⏭️ Security Audit: omitido — no se detectaron archivos fuente modificados`

### Requirement: Security audit results appear as a dedicated section in code-review-report.md
`code-review-report.md` SHALL include a `## Security Audit` section after the existing reviewer sections. This section SHALL contain the audit status, a summary (evaluated/pass/fail/na counts), and the list of FAIL findings when present.

#### Scenario: Security findings visible in report when audit runs
- **WHEN** `security-audit` completes and produces findings
- **THEN** `code-review-report.md` contains a `## Security Audit` section with status (`PASS`/`FAIL`), summary counts, and detail of FAIL items
- **THEN** the summary table in Paso 7 includes a row `🔒 Security Audit │ <status> │ <N> hallazgos`

#### Scenario: Skipped audit noted in report
- **WHEN** security audit was skipped
- **THEN** `code-review-report.md` contains `## Security Audit` with `⏭️ omitido — no se detectaron archivos fuente modificados`
- **THEN** the summary table row shows `🔒 Security Audit │ — │ omitido`
