# Release verification

The public repository is committed only after dependency resolution and a clean production build succeed from a reviewed lockfile.

```bash
bash scripts/finalize-public-release.sh
```

The gate performs, in order:

1. exact dependency resolution and `package-lock.json` creation;
2. a clean `npm ci` from that lockfile;
3. a high-severity audit of production dependencies;
4. all 36 source, mathematical, content, route, and authorization-boundary tests;
5. TypeScript typechecking;
6. an optimized Next.js build;
7. removal of dependency and build residue;
8. a final source-boundary and lockfile check.

The script fails before publication if any step fails. `node_modules`, `.next`, logs, and local environment files are never part of the public payload. The retained lockfile is the dependency identity for the release.

## Independent target-machine reproduction

The intended Apple Silicon publication environment successfully resolved 49 packages, reported zero audited vulnerabilities at the time of that run, passed all 36 tests, completed TypeScript checking, and generated the full Next.js route set. These observations are environment- and date-bound; CI reruns the same gates rather than treating them as permanent guarantees.
