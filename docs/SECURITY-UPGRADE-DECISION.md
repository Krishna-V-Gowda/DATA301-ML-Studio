# Runtime and dependency release decision

## Decision

The public release pins:

- Next.js `16.3.3`
- React `19.2.8`
- React DOM `19.2.8`

The exact transitive dependency graph is committed through `package-lock.json` only after a clean publication-machine resolution and verification run.

## Why the lock is a release boundary

Pinned direct versions are not sufficient evidence of the software actually installed. The lockfile, dependency audit, TypeScript check, production build, and source suite must describe the same public release.

The publication finalizer therefore fails closed unless it can:

1. generate or refresh `package-lock.json` from the pinned direct versions;
2. reinstall with `npm ci`;
3. pass a high-severity production dependency audit;
4. pass all source and boundary tests;
5. pass TypeScript checking;
6. produce the optimized Next.js build;
7. remove `node_modules`, `.next`, logs, and other generated residue;
8. revalidate the final source tree.

## Verified target-machine observation

The intended Apple Silicon publication environment completed dependency resolution, reported zero vulnerabilities at that time, passed all 36 source tests, passed TypeScript checking, and completed the Next.js production build. This is a dated reproduction, not a permanent guarantee: CI and the publication script rerun the gates on the exact commit.

## Public claim boundary

The release can claim that the specified commit passed its retained validation workflow. It cannot claim that future dependency advisories, external Supabase configuration, or every deployed environment are automatically safe.
