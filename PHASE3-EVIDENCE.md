# Phase 3 Evidence

## Runtime qualification

- Local production-equivalent server was reachable at `http://localhost:3001` during bounded browser checks.
- One long route sweep was invalidated by the server disappearing mid-run. Its `ERR_CONNECTION_REFUSED` and browser-origin errors are infrastructure evidence only, not application failures.
- The current running server predates the uncommitted Phase 3 lab accessibility edits. Those edits require a fresh build and server restart before their evidence can be counted.
- The shell PATH later became corrupted (`/opengraph-image`); a local Node runtime was located at `/opt/homebrew/Cellar/node@22/22.23.2/bin/node`. Command restoration is the next continuation action.

## Direct browser observations

- Prior to the current Phase 3 edits, bounded browser checks directly confirmed 12 lab routes and major public routes rendered without horizontal overflow at desktop and 390px mobile.
- Prior direct keyboard checks confirmed Linear Regression point ArrowRight movement updated accessible coordinates from `x 0.8` to `x 0.9`.
- Prior direct keyboard checks confirmed the KNN query ArrowUp path updated `y 5.2` to `y 5.3` and exposed the prediction through `aria-valuetext`.
- Prior direct visual checks identified and fixed the Course Overview light-theme hero contrast regression.
- The first destructive lab batches exercised native controls at Home/End boundaries and clicked available buttons for all 12 labs. The numeric text check was corrected to ignore explanatory prose containing “negative to positive infinity”; no actual NaN/Infinity numeric state was observed.
- First four bounded lab batches returned no overflow and finite rendered state: Linear Regression, KNN, K-Means, Confusion Matrix, Logistic Regression, Gradient Descent, PCA, Overfitting, Decision Tree, SVM, ROC/PR, Ensemble. This evidence predates current source edits and must be retested for affected labs.

## Defect found and fix in current source

- Defect: Linear Regression point insertion/deletion, KNN training-point insertion/deletion, and K-Means observation insertion were pointer-oriented without an equivalent keyboard command.
- Fix: Added `Add point` to Linear Regression and KNN, `Add observation` to K-Means, keyboard Delete/Backspace removal for Linear Regression/KNN points, and focus/role/labels for KNN training points.
- Retest: blocked until the fresh build is running; status remains `NOT VERIFIED`.

## Console/runtime observations

- No application-origin console or page errors were observed in the bounded Phase 2 browser runs across all 12 labs.
- VS Code embedded-browser preload errors appeared in the browser event stream and are tooling-origin errors, not DATA301 application errors.
- Next.js image preload warnings appeared for shared brand/campus images; they were warnings, not application exceptions. A fresh Phase 3 console capture remains pending.

## Visual/responsive observations

- The V5 visual system was previously checked at desktop and 390px mobile with no horizontal overflow.
- The Phase 2 self-critique fixed the Course Overview hero contrast and aligned its hero family with the V5 notebook system.
- Phase 3 required viewports 320, 375, 390, 430, 1024, 1280, and 1440 remain to be directly certified after the current source edits.
- Required representative screenshots and final screenshots remain pending in the fresh Phase 3 run.

## Automated evidence available

- Functional checkpoint suite previously passed 39 tests.
- Source verification, TypeScript, and build previously passed after Phase 2.
- Phase 3 current edits have not yet been included in a fresh dependency-backed build because the shell lost the Node/npm PATH.

## Direct Phase 3 certification results

- Route batches: all 19 generated topic routes, all 12 lab routes, core public pages, admin/auth, robots, sitemap, manifest, and OpenGraph returned expected local responses; page routes exposed expected headings and no overflow at 1440x900 light theme.
- Mobile: sampled public surfaces and Labs at 320, 375, 390, and 430px returned headings with no horizontal overflow.
- Dark theme: representative public pages and labs returned persisted dark theme with no overflow and no numeric `NaN`/`undefined` output.
- Search: normal, uppercase, irrelevant, and empty queries returned HTTP 200 with valid JSON shapes; irrelevant query returned zero results.
- Materials/privacy: invalid public material ID returns 404; protected admin material route redirects to `/admin/login`; expected browser logging for the 404 is not an application exception.
- Lab controls: all 12 labs were loaded fresh; buttons and range controls were exercised through Home/End; outputs stayed finite and overflow-free. Linear Regression point move/delete/add, KNN query move/training-point delete/add, and K-Means observation add were directly retested after source edits.
- Accessibility: KNN query ArrowUp changed `y 5.2` to `y 5.3`, retained focus on the SVG `g[role=slider]`, and had a visible solid focus outline.
- Runtime: clean Linear Regression navigation produced no application-origin console errors. VS Code preload errors and expected HTTP 404 logging are tooling/browser behavior.
- Local semantic smoke: all public pages, all 12 labs, admin login/recovery, attribution, ML_lab bridge, `/api/search`, and critical assets passed. Robots/sitemap canonical-origin assertions are `NOT VERIFIED` locally because the requested base is `localhost`; Supabase material privacy proof is `NOT VERIFIED` because no `.env.local` exists. No production credentials or services were used.
- Screenshot evidence captured through the browser evidence mechanism: final Resources desktop, final Homepage mobile, and representative Linear Regression desktop/lab views. Earlier Phase 2 captures include homepage, Course Overview, Labs directory, and representative mobile/desktop views.

## Next evidence action

Restore Node/npm invocation using the located Node runtime, run typecheck/build, restart the production-equivalent server, then rerun only the invalidated route, lab, accessibility, theme, and console batches. Update this file and the matrix immediately at each safe boundary.
