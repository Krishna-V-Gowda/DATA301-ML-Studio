<p align="center">
  <img src="docs/assets/data301-cover.svg" alt="DATA301 Machine Learning Studio" width="100%">
</p>

# DATA301 Machine Learning Studio

**An interactive scientific-learning system where core algorithms are small enough to inspect, behavior is visual enough to interrogate, and correctness is tested independently of the interface.**

The release contains twelve browser laboratories, eleven structured concept chapters, a four-module/30-session curriculum graph, framework-independent TypeScript implementations, deterministic mathematical tests, and an optional Supabase-backed educator workflow with row-level authorization and private file delivery.

> This public portfolio edition is independent. Institution-specific branding, private handoff documents, and supplied course binaries were deliberately removed. Two author-created Markdown resources remain as safe fallback content.

## Inspect the laboratories

| Laboratory | Inspectable computation |
|---|---|
| Linear regression | closed-form OLS, residual error, `R²` |
| K-nearest neighbours | distances, neighbour set, vote confidence |
| K-means | assignments, centroid updates, inertia |
| Confusion matrix | accuracy, precision, recall, specificity, F1 |
| Logistic regression | sigmoid, threshold, boundary, confusion effects |
| Gradient descent | convergence, oscillation, divergence |
| PCA | centering, optional standardization, eigenpairs, projection |
| Overfitting | polynomial degree, train/test error |
| Decision trees | Gini reduction, recursive splits, boundaries |
| Linear SVM | margin and support-vector behavior |
| ROC / precision–recall | threshold sweep and trapezoidal AUC |
| Ensembles | deterministic bootstrap aggregation and voting |

## Architectural split

```text
public learning surface        educator control surface
Next.js routes + labs          Supabase Auth
        |                      PostgreSQL + RLS
        +---- typed domain ---- private object storage
                    |
          framework-independent lib/ml
                    |
        example tests + metamorphic invariants
```

The user interface imports the same `lib/ml` functions exercised by Node's dependency-light test runner. Numerical logic is not copied into chart components.

## Verification

The release gate is deliberately broader than a successful browser render:

```bash
npm ci
npm run verify:source
npm run typecheck
npm run build
```

The suite covers worked examples, degenerate inputs, route/content integrity, authorization-source safeguards, and metamorphic properties such as translation invariance of PCA and monotonicity of logistic thresholding. The release pins Next.js `16.3.3` and React/React DOM `19.2.8`; `package-lock.json` is created and reviewed by the fail-closed publication finalizer before the repository is committed.

For the complete clean-install, audit, test, typecheck, build, and residue-removal sequence, see [`docs/RELEASE_VERIFICATION.md`](docs/RELEASE_VERIFICATION.md).

## Local development

Requires Node.js 22.16 or newer.

```bash
npm install
npm test
npm run typecheck
npm run dev
```

Optional educator functionality uses a personal Supabase project. Copy `.env.example` to `.env.local`; never expose `SUPABASE_SECRET_KEY` to the browser. The public learning surface remains usable when Supabase is absent.

## Evidence and limitations

- [`docs/MATHEMATICAL_VALIDATION.md`](docs/MATHEMATICAL_VALIDATION.md) — definitions and test taxonomy.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — rendering, domain, persistence, and failure boundaries.
- [`docs/SECURITY.md`](docs/SECURITY.md) — layered authorization and private-file controls.
- [`docs/SECURITY-UPGRADE-DECISION.md`](docs/SECURITY-UPGRADE-DECISION.md) — publication-blocking runtime upgrade and lockfile gate.
- [`docs/PUBLIC_RELEASE_BOUNDARY.md`](docs/PUBLIC_RELEASE_BOUNDARY.md) — exactly what was removed and why.
- [`docs/LIMITATIONS.md`](docs/LIMITATIONS.md) — educational and numerical limits.

This is a learning and experimentation product, not a replacement for validated scientific libraries. Algorithms intentionally favor inspectability over high-dimensional performance.

## License

MIT for the repository source and author-created public resources. Bibliographic citations do not imply redistribution rights to the cited works.
