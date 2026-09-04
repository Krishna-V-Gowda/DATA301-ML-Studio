# Public release checklist

- [ ] `package-lock.json` exists and matches the pinned direct dependencies.
- [ ] `npm ci --ignore-scripts --no-audit --no-fund` succeeds from a clean tree.
- [ ] `npm audit --omit=dev --audit-level=high` succeeds.
- [ ] `npm run verify:source` passes all source and boundary tests.
- [ ] `npm run typecheck` succeeds.
- [ ] `npm run build` succeeds.
- [ ] `node_modules`, `.next`, logs, local environment files, and private handoff material are absent from the commit.
- [ ] the public learning surface works without Supabase configuration.
- [ ] educator routes fail safely when Supabase is absent.
- [ ] repository description, topics, social preview, and live URL are reviewed.
- [ ] CI passes on the exact release commit.

Run `bash scripts/finalize-public-release.sh` to execute the local technical gates in the required order.
