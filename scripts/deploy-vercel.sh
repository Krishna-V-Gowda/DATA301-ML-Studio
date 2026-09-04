#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env.local ]]; then
  echo "✗ .env.local is missing. Copy .env.example and configure a personal Supabase project first."
  exit 1
fi

node scripts/normalize-env.mjs

set -a
# shellcheck disable=SC1091
source .env.local
set +a

SERVER_KEY="${SUPABASE_SECRET_KEY:-${SUPABASE_SERVICE_ROLE_KEY:-}}"
for variable in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; do
  if [[ -z "${!variable:-}" ]]; then
    echo "✗ $variable is missing from .env.local."
    exit 1
  fi
done
if [[ -z "$SERVER_KEY" ]]; then
  echo "✗ SUPABASE_SECRET_KEY is missing from .env.local."
  exit 1
fi

vercel_cli() {
  npx --yes vercel@latest "$@"
}

if ! vercel_cli whoami >/dev/null 2>&1; then
  echo "Vercel sign-in is required. Follow the browser/terminal prompt."
  vercel_cli login
fi

if [[ ! -d .vercel ]]; then
  echo "Linking this folder to a Vercel project…"
  vercel_cli link --yes
fi

# Ensure Vercel exposes its deployment and production-domain variables to Next.js.
# This lets metadata, robots.txt, and sitemap.xml use the real production origin.
PROJECT_ID="$(node --input-type=module -e "import data from './.vercel/project.json' with { type: 'json' }; process.stdout.write(data.projectId || '')")"
if [[ -n "$PROJECT_ID" ]]; then
  if vercel_cli api "/v9/projects/$PROJECT_ID" -X PATCH -F autoExposeSystemEnvs=true --silent >/dev/null 2>&1; then
    echo "✓ Vercel system environment variables enabled."
  else
    echo "! Could not enable Vercel system variables automatically."
    echo "  In Vercel: Project Settings → Environment Variables → enable System Environment Variables, then redeploy."
  fi
fi

set_public_env() {
  local name="$1"
  local value="$2"
  local environment="$3"
  printf '%s' "$value" | vercel_cli env add "$name" "$environment" --force --yes --no-sensitive >/dev/null
  echo "✓ $name → $environment"
}

set_secret_env() {
  local name="$1"
  local value="$2"
  local environment="$3"
  printf '%s' "$value" | vercel_cli env add "$name" "$environment" --force --yes --sensitive >/dev/null
  echo "✓ $name → $environment (sensitive)"
}

printf '\nSynchronizing Vercel environment variables…\n'
for environment in production preview; do
  set_public_env NEXT_PUBLIC_SUPABASE_URL "$NEXT_PUBLIC_SUPABASE_URL" "$environment"
  set_public_env NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY "$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" "$environment"
  set_secret_env SUPABASE_SECRET_KEY "$SERVER_KEY" "$environment"
done

printf '\nRunning the production deployment…\n'
DEPLOYMENT_OUTPUT="$(vercel_cli deploy --prod --yes --archive=tgz)"
printf '%s\n' "$DEPLOYMENT_OUTPUT"
DEPLOYMENT_URL="$(printf '%s\n' "$DEPLOYMENT_OUTPUT" | grep -Eo 'https://[^[:space:]]+\.vercel\.app[^[:space:]]*' | tail -1 | sed 's/[[:punct:]]*$//')"

if [[ -z "$DEPLOYMENT_URL" ]]; then
  echo "✗ Vercel finished without a recognizable production URL. Copy the URL from the output and run:"
  echo "  npm run smoke:live -- https://YOUR-DOMAIN.vercel.app"
  exit 1
fi

printf '%s\n' "$DEPLOYMENT_URL" > LIVE_URL.txt
printf '\nRunning the live production smoke test…\n'
node --no-warnings --experimental-strip-types scripts/smoke-live.mjs "$DEPLOYMENT_URL"

cat <<EOF2

✓ Production deployment and public smoke test passed.

Production URL:
  $DEPLOYMENT_URL

Complete this final Supabase setting:
  Authentication → URL Configuration
  Site URL: $DEPLOYMENT_URL
  Redirect URL: $DEPLOYMENT_URL/**
  Redirect URL: $DEPLOYMENT_URL/admin/reset-password

Then open a private browser window, verify admin login and one signed resource download,
and review the URL before publishing it.
EOF2
