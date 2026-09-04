# Deployment

The learning surface is designed to remain usable without an external database. The optional educator workflow adds authenticated material management through a separately owned Supabase project.

## 1. Verify the release locally

Requires Node.js 22.16 or newer.

```bash
npm ci
npm run verify:source
npm run typecheck
npm run build
```

The complete publication-machine gate is:

```bash
bash scripts/finalize-public-release.sh
```

It resolves and retains the lockfile, audits production dependencies, runs the source suite and typecheck, creates an optimized build, removes generated residue, and rechecks the public boundary.

## 2. Run the public learning surface

```bash
npm run dev
```

Without Supabase variables, the public chapters and twelve laboratories remain available. Educator-only functionality must fail safely rather than silently using placeholder credentials.

## 3. Optional educator workflow

To enable educator routes:

1. create a personal Supabase project;
2. apply `supabase/schema.sql`;
3. copy `.env.example` to `.env.local`;
4. populate only your local Supabase values;
5. run `npm run setup:admin` and `npm run verify:supabase`;
6. verify row-level policies and one signed private-material download.

Never commit `.env.local` or a service/secret key. The browser receives only the public project URL and publishable key; privileged operations remain server-side.

## 4. Deploy to Vercel

A normal Git-connected Vercel deployment is sufficient for the public learning surface. For the optional Supabase-backed deployment, review `scripts/deploy-vercel.sh` before running:

```bash
npm run deploy:vercel
```

The helper requires a configured `.env.local`, writes environment variables through the Vercel CLI, deploys, and runs the live public smoke test. It does not create a Supabase project or silently manufacture administrator credentials.

## 5. Final browser review

In a signed-out/private browser, verify:

- the homepage, learning modules, search, resources, and all twelve laboratories;
- direct refresh of nested routes;
- mobile navigation and keyboard focus;
- absence of console/network failures on the demonstrated path;
- educator routes fail safely when Supabase is absent;
- authenticated material operations and signed downloads when Supabase is enabled.
