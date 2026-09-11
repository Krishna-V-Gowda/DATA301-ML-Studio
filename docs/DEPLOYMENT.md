# Cosmic V4 Deployment

The supported release path is the separately supplied `COSMIC_RELEASE.command`. Run it from the extracted release bundle rather than manually copying files or issuing disconnected deployment commands.

## One command

```bash
bash COSMIC_RELEASE.command
```

The launcher performs the following guarded sequence:

1. verifies the release bundle and required private academic files;
2. validates macOS, Homebrew, Node.js 22.16+, Git, GitHub CLI, and account ownership;
3. backs up any previous local release workspace;
4. clones the canonical `Krishna-V-Gowda/DATA301-ML-Studio` repository;
5. creates a release branch and overlays the verified V4 source;
6. recovers or securely prompts for Supabase environment values;
7. runs source, algorithm, content, security, TypeScript, and production-build gates;
8. links Supabase, records the pre-existing SQL-editor baseline when appropriate, and applies the idempotent V4 migration;
9. provisions and verifies Dr. Shabbeer Basha's separate administrator account;
10. uploads Course Overview, Module 1, Module 2, and the staff-only Detailed Course Plan to private Storage;
11. verifies RLS, material visibility, private Storage, signed delivery, and session state;
12. commits and pushes the release branch without force-pushing;
13. synchronizes Vercel environment variables;
14. deploys an isolated preview and smoke-tests it before production changes;
15. promotes only the verified preview, smoke-tests the canonical production URL, and requests rollback on a failed production check;
16. fast-forwards the verified commit to the default GitHub branch and creates the release tag.

## Required account interactions

The script cannot and should not bypass account security. It may pause for:

- GitHub browser authorization when GitHub CLI is not already authenticated;
- a Supabase personal access token when Supabase CLI is not already authenticated;
- the Supabase database password for migration access;
- Vercel browser authorization when Vercel CLI is not already authenticated;
- Supabase URL/publishable/secret values only when no valid existing `.env.local` can be recovered.

Passwords and secrets are never printed, committed, or added to the release ZIP.

## Production safety

The canonical URL is `https://data301-ml-studio.vercel.app`.

Production is not changed until a preview deployment passes the complete live smoke test. The smoke test covers public routes, all twelve Labs, Module 2 topics, search, assets, Course Overview ordering, GitHub bridges, developer attribution, signed Module 2 delivery, and blocking of the staff-only Course Plan.

## Private handoff

Instructor credentials and the prepared email are written with user-only permissions to:

```text
~/Documents/DATA301-Private-Handoff/
```

Delete the temporary-password handoff after Dr. Shabbeer Basha has signed in and changed the password.
