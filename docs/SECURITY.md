# Security Model

## Authorization layers

1. Supabase Auth establishes identity.
2. The protected Next.js admin layout requires `editor` or `admin`.
3. PostgreSQL Row Level Security independently controls table operations.
4. Storage policies independently protect private course files.

UI visibility is never treated as authorization.

## Roles

- `viewer` — default, no administration
- `editor` — course/session/material operations
- `admin` — editor capabilities plus staff-role administration

No public sign-up flow assigns an elevated role.

## Files

- `course-materials` is private.
- Bucket limits enforce 50 MB and an explicit MIME allowlist.
- Object paths are sanitized and randomized.
- Public pages never receive permanent private-object URLs.
- `/api/materials/[id]` checks published/released metadata and returns a short-lived signed redirect.
- Vercel excludes local source copies under `public/materials`; production Resources use Supabase database records only.

## Secrets

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` may reach the browser and remains RLS-constrained.
- `SUPABASE_SECRET_KEY` is server-only, bypasses RLS, and is never prefixed with `NEXT_PUBLIC_`.
- `.env.local`, Vercel project state, logs, and live URL files are ignored/excluded appropriately.
- The deployment helper marks the server key sensitive.

## Credentials

- The setup helper creates/updates an administrator through the trusted Admin API and privately prompts for a 12+ character password. It does not use recovery email.
- The signed-in Settings page verifies the current password before changing it.
- Forgot/reset-password routes remain available for normal production recovery, but launch does not depend on Supabase's test-email quota.
- Login itself accepts valid existing passwords; stronger policy is enforced when creating, resetting, or changing credentials.

## Redirects

Login destinations pass through same-origin validation. External, protocol-relative, backslash, and non-admin destinations are rejected.

## Database safeguards

- Explicit API grants provide the required SQL privileges.
- RLS remains the authorization boundary for anon/authenticated users.
- `materials_public` is a security-invoker view.
- Module/session relational constraints prevent cross-module placement.
- Publishing/scheduling requires a real release timestamp.

## Recommended institutional hardening after acceptance

- MFA for staff accounts
- Institutional SMTP and approved-domain invites
- Leaked-password protection
- Malware scanning/quarantine before publication
- Audit-event table for publish/archive/role changes
- Periodic access review and secret rotation
- Documented copyright, retention, backup, and incident-response policy
