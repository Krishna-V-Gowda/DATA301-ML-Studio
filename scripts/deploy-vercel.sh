#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

CANONICAL_URL="${CANONICAL_URL:-https://data301-ml-studio.vercel.app}"
VERCEL_PROJECT="${VERCEL_PROJECT:-data301-ml-studio}"

if [[ ! -f .env.local ]]; then
  echo "✗ .env.local is missing. Run the cosmic release launcher first."
  exit 1
fi

TARGET_SITE_URL="$CANONICAL_URL" node scripts/normalize-env.mjs

read_env() {
  local name="$1"
  node --env-file=.env.local --input-type=module -e "process.stdout.write(process.env['$name'] || '')"
}

SUPABASE_URL="$(read_env NEXT_PUBLIC_SUPABASE_URL)"
SUPABASE_PUBLISHABLE_KEY="$(read_env NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)"
SERVER_KEY="$(read_env SUPABASE_SECRET_KEY)"

if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_PUBLISHABLE_KEY" || -z "$SERVER_KEY" ]]; then
  echo "✗ Required Supabase variables are missing from .env.local."
  exit 1
fi

vercel_cli() {
  npx --yes vercel@latest --no-color "$@"
}

if ! vercel_cli whoami >/dev/null 2>&1; then
  echo "→ Vercel authentication is required once. Complete the sign-in flow."
  vercel_cli login
fi

# Link explicitly to the existing project so an accidental duplicate is never created.
vercel_cli link --yes --project "$VERCEL_PROJECT" >/dev/null
printf '✓ Linked to Vercel project: %s\n' "$VERCEL_PROJECT"

set_config_env() {
  local name="$1"
  local value="$2"
  local environment="$3"
  printf '%s' "$value" | vercel_cli env add "$name" "$environment" --force --yes --no-sensitive >/dev/null
  printf '✓ %s → %s\n' "$name" "$environment"
}

set_secret_env() {
  local name="$1"
  local value="$2"
  local environment="$3"
  printf '%s' "$value" | vercel_cli env add "$name" "$environment" --force --yes --sensitive >/dev/null
  printf '✓ %s → %s (secret)\n' "$name" "$environment"
}

printf '\nSynchronizing Vercel environment variables…\n'
for environment in production preview; do
  set_config_env NEXT_PUBLIC_SUPABASE_URL "$SUPABASE_URL" "$environment"
  set_config_env NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY "$SUPABASE_PUBLISHABLE_KEY" "$environment"
  set_config_env NEXT_PUBLIC_SITE_URL "$CANONICAL_URL" "$environment"
  set_secret_env SUPABASE_SECRET_KEY "$SERVER_KEY" "$environment"
done

extract_deployment_url() {
  grep -Eo 'https://[A-Za-z0-9.-]+\.vercel\.app' | tail -1
}

printf '\nCreating an isolated preview deployment…\n'
PREVIEW_OUTPUT="$(vercel_cli deploy --yes --archive=tgz 2>&1)"
printf '%s\n' "$PREVIEW_OUTPUT"
PREVIEW_URL="$(printf '%s\n' "$PREVIEW_OUTPUT" | extract_deployment_url || true)"

if [[ -z "$PREVIEW_URL" ]]; then
  echo "✗ Vercel did not return a preview URL. Production was not changed."
  exit 1
fi

printf '\nRunning the complete live smoke test against the preview…\n'
node --env-file=.env.local --no-warnings --experimental-strip-types scripts/smoke-live.mjs "$PREVIEW_URL"

printf '\nPromoting the verified preview to production…\n'
vercel_cli promote "$PREVIEW_URL" --yes --timeout=5m

printf '\nRunning the complete live smoke test against the canonical production URL…\n'
if ! node --env-file=.env.local --no-warnings --experimental-strip-types scripts/smoke-live.mjs "$CANONICAL_URL"; then
  echo "✗ Canonical production verification failed after promotion."
  echo "→ Requesting an immediate rollback to the previous production deployment…"
  vercel_cli rollback --non-interactive --timeout=5m || true
  exit 1
fi

printf '%s\n' "$CANONICAL_URL" > LIVE_URL.txt

cat <<EOF2

✓ Cosmic V4 production deployment passed every automated public check.

Canonical course URL:
  $CANONICAL_URL

Verified preview promoted:
  $PREVIEW_URL

The prior production deployment remained untouched until the preview passed.
A final private-window instructor sign-in is the only account-owner acceptance check.
EOF2
