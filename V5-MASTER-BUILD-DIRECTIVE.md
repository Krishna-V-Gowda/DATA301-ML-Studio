# DATA301 ML Studio V5 — Definitive Master Build Directive

## SOURCE OF TRUTH

This LOCAL repository is the authoritative DATA301 source.

The immutable recovery point is:

CANONICAL-PRE-V5

All development occurs on:

V5-WORK

Never delete, rewrite, or invalidate CANONICAL-PRE-V5.

Do not reconstruct the application from memory, screenshots, previous
AI-generated descriptions, or the lost V5 patch.

Preserve the verified canonical functional and academic core.

---

## MISSION

Build the definitive production-grade DATA301 Machine Learning Studio
for 300+ university students.

The finished product must be:

- academically credible
- technically robust
- exceptionally polished
- visually distinctive
- responsive
- accessible
- fast
- intuitive
- pedagogically meaningful
- portfolio-grade
- production-grade

This is not a generic LMS.

This is not a SaaS dashboard.

This is not a cosmetic reskin of Cosmic V4.

It should feel like a flagship interactive computational learning
environment worthy of a modern university course.

---

## PRESERVE THE VERIFIED CORE

Preserve and improve the existing implementation of:

- DATA301 Course Overview
- Module 1: Introduction to Machine Learning
- Module 2: Supervised Learning Techniques and Evaluation Metrics
- Learn / curriculum
- Topics
- Labs
- Projects
- Resources
- Search
- About
- Admin authentication
- instructor administration
- course/material APIs
- Supabase integration
- existing ML algorithms
- course/topic/lab data
- security/privacy boundaries

Do not casually rewrite working mathematical implementations.

---

## REQUIRED INTERACTIVE LABS

All 12 existing laboratories must remain functional and be individually
reviewed:

1. Linear Regression
2. KNN
3. K-Means
4. Confusion Matrix
5. Logistic Regression
6. Gradient Descent
7. PCA
8. Overfitting / Generalization
9. Decision Tree
10. SVM
11. ROC / Precision-Recall
12. Ensemble Learning

The laboratories are a signature feature of the product.

They must not merely load.

For each laboratory verify:

- mathematical correctness
- controls
- state transitions
- visualizations
- explanatory content
- edge cases
- responsive behavior
- keyboard usability
- clarity for students
- absence of runtime/console errors

---

## VERIFIED ACADEMIC EXPECTATIONS

Preserve the canonical course structure.

Known requirements include:

- four modules
- thirty official sessions
- Course Overview public
- Module 1 public
- Module 2 public
- three intended public course materials
- four source files retained in private storage
- Detailed Course Plan staff-only

Do not invent academic structure that conflicts with the canonical
course data.

---

## KNOWN COSMIC V4 DEFECTS

Do not rediscover these blindly.

Explicitly investigate, repair and verify:

1. /api/search
2. robots.txt canonical production origin
3. sitemap.xml canonical production origin
4. Course Overview public-material ordering
5. public/private material boundaries
6. Detailed Course Plan privacy
7. instructor material workflow
8. material-seeding idempotency
9. Supabase schema/cache consistency
10. release-script correctness
11. preview-protection handling
12. smoke-test reliability

The previous preview returned HTTP 200 for many routes while the old
smoke harness still marked them failed because it depended on exact
marketing-copy strings.

Do not repeat that design.

A semantic smoke test should verify stable behavior such as:

- HTTP status
- route identity
- semantic headings
- stable data markers
- API response shape
- redirects
- authentication boundaries
- material visibility
- required assets
- canonical origins

Do not make ordinary copywriting changes capable of producing dozens
of false release failures.

---

## SUPABASE SAFETY

Do not reset Supabase.

Do not invent database columns.

Do not guess schema.

Inspect the actual schema/migrations/code before changing anything.

Database changes must be:

- necessary
- explicit
- idempotent
- migration-backed
- backward-conscious
- verified

Preserve:

- private course-material storage
- signed private delivery
- public visibility only where intended
- Detailed Course Plan staff-only
- instructor/admin authentication

Never print or commit secrets.

Never commit .env.local.

Never expose service-role credentials client-side.

---

## SHABBEER INSTRUCTOR EXPERIENCE

Dr. Shabbeer Basha must remain supported as an instructor administrator.

Do not expose his credentials in source, Git history, logs, screenshots,
documentation, or ChatGPT prompts.

Credential handoff remains private and local.

The external instructor repository:

https://github.com/shabbeersh/ML_lab.git

is an external course-practice bridge.

Do not copy its source into DATA301.

---

## ATTRIBUTION

Preserve discreet, professional attribution:

Platform design & development · Krishna V Gowda

It should be discoverable without dominating the university/course
identity.

---

## VISUAL DIRECTION

The previous Cosmic V4 public-facing visual direction was rejected.

Do not reproduce:

- generic navy/dark SaaS styling
- generic AI-product aesthetics
- repetitive rounded-card grids
- excessive floating containers
- visually empty hero sections
- template-like dashboards
- monotonous section repetition
- decorative complexity without pedagogical value

Create one coherent design system across the complete application.

Prioritize:

- exceptional typography
- editorial hierarchy
- purposeful whitespace
- sophisticated composition
- clear information architecture
- restrained but meaningful motion
- strong interactive feedback
- accessible contrast
- polished responsive behavior
- visual storytelling for ML concepts

Use the authorized Vidyashilp University and campus assets already
present in the repository where they genuinely strengthen the design.

The result should feel designed specifically for DATA301.

---

## IMPLEMENTATION SEQUENCE

### PHASE 1 — REPOSITORY AUDIT

Before substantial editing, understand:

- route architecture
- layouts
- components
- styling
- course data
- topic data
- lab data
- ML implementations
- search
- Supabase clients
- authentication
- material APIs
- migrations
- tests
- scripts
- deployment flow
- security boundaries

Do not begin with indiscriminate redesign.

### PHASE 2 — FUNCTIONAL HARDENING

Repair known V4 functional/release defects first.

Run appropriate tests after each meaningful repair.

Commit a checkpoint when the functional baseline is green.

### PHASE 3 — DESIGN SYSTEM

Establish a coherent system for:

- typography
- spacing
- grids
- surfaces
- navigation
- responsive breakpoints
- interaction
- focus states
- motion
- visualizations

Avoid page-by-page stylistic drift.

Commit the design-system checkpoint.

### PHASE 4 — PUBLIC EXPERIENCE

Redesign and elevate:

- homepage
- Course Overview
- Learn
- module views
- topic views
- Labs directory
- Projects
- Resources
- Search
- About

Preserve functionality while radically improving presentation and
usability.

Commit the public-experience checkpoint.

### PHASE 5 — LAB EXPERIENCE

Review and elevate all 12 laboratories individually.

Do not reduce their functionality for aesthetics.

Commit the laboratory checkpoint.

### PHASE 6 — RESPONSIVE AND ACCESSIBILITY QA

Verify:

- mobile navigation
- desktop navigation
- tablet layouts
- touch targets
- keyboard navigation
- focus visibility
- semantic landmarks
- heading hierarchy
- labels
- contrast
- reduced-motion behavior
- overflow
- visualization readability

### PHASE 7 — COMPLETE LOCAL QUALITY GATE

Run the project's actual verification suite.

At minimum:

npm test
npm run typecheck
npm run build

Run source/security verification scripts when present.

Do not suppress legitimate failures merely to obtain green output.

Fix root causes and rerun.

### PHASE 8 — LOCAL RUNTIME QA

Run the production application locally.

Inspect representative and critical routes at desktop and mobile
viewports.

Verify APIs and interactions, not just static compilation.

### PHASE 9 — SEMANTIC SMOKE TEST

Replace brittle prose matching with stable semantic verification.

Cover:

- homepage
- course
- learn
- modules
- topics
- Labs directory
- all 12 lab routes
- projects
- resources
- search
- about
- admin login
- API search
- robots
- sitemap
- public materials
- private-material boundary
- developer attribution
- ML_lab bridge
- critical assets

### PHASE 10 — VISUAL QA

Do not declare completion based solely on automated tests.

Inspect desktop and mobile renders.

Look for:

- weak hierarchy
- awkward whitespace
- clipping
- overflow
- broken responsive states
- generic/template aesthetics
- inconsistent components
- illegible charts
- poor contrast
- unfinished states
- accidental regressions

Fix problems before release freeze.

---

## CHECKPOINT POLICY

The local Git repository is the persistence mechanism.

Never depend on an AI sandbox as the only copy of completed work.

Commit after every major successful phase.

The recovery point:

CANONICAL-PRE-V5

must remain untouched.

Before release, create a final candidate commit and tag only after
validation succeeds.

---

## PRODUCTION BOUNDARY

Production remains untouched throughout development.

Do not:

- deploy production prematurely
- force-push
- overwrite main
- expose secrets
- make private academic material public
- modify production merely to make tests pass

The release workflow must first create and validate an isolated preview.

There must be an explicit owner-entered:

PROMOTE

boundary before production changes.

---

## GUARDED RELEASE

The final release mechanism should perform, in order:

1. verify source integrity
2. verify runtime-secret exclusion
3. clean dependency installation
4. tests
5. TypeScript validation
6. production build
7. read-only/appropriate Supabase verification
8. protected Vercel preview
9. preview semantic smoke test
10. preview visual review
11. STOP for explicit PROMOTE
12. production deployment
13. production semantic verification
14. stop/rollback strategy on failure
15. update canonical GitHub state only after successful production

Never force-push.

---

## FINAL SOURCE / ARTIFACT POLICY

The LOCAL source tree is authoritative.

Do not rely on ChatGPT-generated attachments as the persistence layer.

Before calling the project final:

1. commit completed source
2. create final Git tag
3. generate per-file SHA-256 manifest
4. create release archive locally
5. extract archive into a fresh directory
6. install/build/test from that fresh extraction
7. verify the extracted manifest
8. verify secret exclusion
9. verify private academic binaries are not accidentally public
10. verify archive integrity

The release archive is a transport artifact.

The Git-tagged local source tree is the authoritative recoverable
source.

---

## DEFINITION OF DONE

Do not use the word FINAL merely because code was generated.

DONE means:

- functionality works
- academic structure is preserved
- all 12 labs work
- design quality is exceptional
- desktop experience is polished
- mobile experience is polished
- accessibility is credible
- search works
- APIs work
- authentication boundaries work
- privacy boundaries work
- tests pass
- typecheck passes
- production build passes
- semantic smoke passes
- visual QA passes
- source is checkpointed
- final source is locally recoverable
- release is reproducible
- production remains protected until explicit promotion

When something genuinely fails:

diagnose the actual root cause,
fix it,
rerun the relevant gate,
and continue.

Do not fabricate success.

Do not substitute documentation for implementation.

Do not abandon a working source tree.

Build the finest DATA301 ML Studio the canonical platform can support.
