# Changelog

All notable platform releases are documented here.

## [4.0.0] — 2026-09-09

### Added

- Complete VU-centered visual experience with campus imagery and institutional course context.
- Dedicated Course Overview route and course-overview-first public information hierarchy.
- Deep Module 2 integration from the 110-slide supervised-learning presentation.
- Eight additional evidence-based Module 2 concept lessons.
- Connected Module 2 topic → interactive Lab → Python/Jupyter repository pathways.
- Instructor ML Lab GitHub bridge on the Labs directory, supervised-learning module, and each Lab.
- Explicit `public` versus `staff` material visibility.
- Staff-only Detailed Course Plan delivery through the authenticated instructor route.
- Separate instructor-account provisioning and private credential handoff generation.
- Temporary-password banner and first-login password-change workflow.
- V4 source-integrity, privacy, secret, asset, and release-structure checks.
- Live production smoke tests for Module 2, signed delivery, Course Plan privacy, attribution, search, and assets.
- GitHub Actions quality workflow.

### Changed

- Course Overview is now the primary navigation and homepage learning entry.
- Resources are ordered Course Overview → Module 2 → Module 1 → latest materials.
- Homepage, Labs, Resources, About, Course, and Module pages receive a richer responsive visual system.
- Production metadata records platform authorship while keeping course and university identity primary.
- Repository documentation now clearly separates platform software, academic content, institutional assets, and the instructor’s external repository.

### Security

- Private academic binaries remain outside Git and Vercel source uploads.
- Detailed Course Plan is excluded from the public view and public signed-material endpoint.
- Supabase RLS and explicit table privileges are migrated idempotently.
- Instructor credentials are written only to mode-600 local handoff files and never printed or committed.

## [2.1.0] — 2026-08-18

- Initial production deployment with 12 interactive Labs, Supabase administration, private Storage, signed resources, and Vercel hosting.

## [4.0.0] — reliability patch

- Material seeding now reconciles existing rows by the same logical course/kind/title/module/session/version identity enforced by `materials_series_version_unique`.
- Duplicate-key races are retried as updates rather than aborting the release.
- The release tests cover the idempotent seeding invariant.
