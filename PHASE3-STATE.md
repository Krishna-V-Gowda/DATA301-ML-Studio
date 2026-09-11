# Phase 3 State

- Frozen starting checkpoint: `71ef6e41339133f515656e83c98712d77b258674`
- Functional checkpoint preserved: `96a8638`
- Canonical recovery tag preserved: `CANONICAL-PRE-V5`
- Branch: `V5-WORK`
- Current HEAD: `71ef6e4` plus uncommitted Phase 3 accessibility/API edits
- Current subsection: P, checkpointed with explicit environment-bound limitations
- Completed this run: baseline inventory; production-server reachability check; route matrix planning; first bounded lab batches; visual/overflow checks on 12 labs and public surfaces from Phase 2; first accessibility defect analysis
- Infrastructure-invalidated: one long browser route sweep and one lab-control batch after the local server disappeared. Connection-refused results are not application evidence and must not be recorded as failures.
- Confirmed Phase 3 source edits: keyboard-equivalent Add point/Add observation commands; keyboard deletion and semantics for Linear Regression and KNN training points.
- Confirmed defects: pointer-only point insertion/deletion in Linear Regression, KNN, and K-Means before the current fix.
- Unresolved / intentionally deferred: live Supabase material privacy proof and production canonical-origin verification require prohibited runtime configuration; retain as `NOT VERIFIED` for the next authorized environment QA.
- Validation already completed in this run: fresh typecheck/build; 39 tests after API fix; direct browser certification for all 19 topics, all 12 labs, core public pages, admin/auth, robots, sitemap, manifest, and OG; mobile 320/375/390/430 sampled pages without overflow; dark-theme sampled surfaces without overflow or numeric bad values; KNN keyboard query movement and visible focus; all 12 lab control boundary batches; search normal/case/empty/irrelevant queries; invalid public material ID 404; protected admin material redirect; clean lab console capture.
- Evidence artifacts: this file, `PHASE3-QA-MATRIX.md`, `PHASE3-EVIDENCE.md`.
- Server/runtime: fresh production-equivalent server is running at `http://localhost:3001` from the current build; Node uses `/opt/homebrew/Cellar/node@22/22.23.2/bin/node` and npm uses `/opt/homebrew/lib/node_modules/npm/bin/npm-cli.js`.
- Exact next action: authorized environment QA must run read-only Supabase verification and production-origin semantic smoke before any release promotion; do not deploy or use PROMOTE from this checkpoint.
