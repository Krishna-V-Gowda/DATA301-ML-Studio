#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env.local ]]; then
  echo "✗ .env.local is missing."
  exit 1
fi

SUPABASE_URL="$(node --env-file=.env.local --input-type=module -e "process.stdout.write(process.env.NEXT_PUBLIC_SUPABASE_URL || '')")"
PROJECT_REF="$(printf '%s' "$SUPABASE_URL" | sed -E 's#https://([^.]+)\.supabase\.co/?#\1#')"

if [[ -z "$PROJECT_REF" || "$PROJECT_REF" == "$SUPABASE_URL" ]]; then
  echo "✗ Could not derive the Supabase project reference from NEXT_PUBLIC_SUPABASE_URL."
  exit 1
fi

supabase_cli() {
  npx --yes supabase@latest "$@"
}

printf '\nSupabase migration gate\n'
printf '%s\n' '───────────────────────'
printf 'Project reference: %s\n' "$PROJECT_REF"

if ! supabase_cli projects list >/dev/null 2>&1; then
  echo "→ Supabase CLI authorization is required once."
  echo "  The CLI will ask for a personal access token from Supabase Dashboard → Account → Access Tokens."
  supabase_cli login
fi

# Create only local CLI configuration. Existing migration files are preserved.
supabase_cli init --force >/dev/null

if [[ -z "${SUPABASE_DB_PASSWORD:-}" ]]; then
  printf 'Supabase database password (input hidden): '
  IFS= read -r -s SUPABASE_DB_PASSWORD
  printf '\n'
fi

if [[ -z "$SUPABASE_DB_PASSWORD" ]]; then
  echo "✗ A database password is required to apply the schema migration."
  exit 1
fi
export SUPABASE_DB_PASSWORD

if ! supabase_cli link --project-ref "$PROJECT_REF" >/dev/null; then
  unset SUPABASE_DB_PASSWORD
  echo "✗ Supabase project linking failed. Confirm the database password in Project Settings → Database."
  exit 1
fi
printf '✓ Linked to Supabase project %s\n' "$PROJECT_REF"

CORE_SCHEMA_EXISTS="$(node --env-file=.env.local --input-type=module <<'NODE'
import { createClient } from '@supabase/supabase-js';
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});
const { error } = await client.from('courses').select('id', { head: true, count: 'exact' });
process.stdout.write(error ? 'no' : 'yes');
NODE
)"

MIGRATION_LIST="$(supabase_cli migration list --linked 2>&1)"
printf '%s\n' "$MIGRATION_LIST"

remote_has_version() {
  local version="$1"
  local line
  line="$(printf '%s\n' "$MIGRATION_LIST" | grep "$version" | head -1 || true)"
  [[ "$(printf '%s' "$line" | grep -o "$version" | wc -l | tr -d ' ')" -ge 2 ]]
}

# The live DATA301 project was originally created through the SQL editor. When its
# core tables already exist, record the baseline migration without rerunning it.
if [[ "$CORE_SCHEMA_EXISTS" == "yes" ]] && ! remote_has_version "202608180001"; then
  echo "→ Existing DATA301 schema detected; recording the non-destructive baseline migration as applied."
  supabase_cli migration repair 202608180001 --status applied --linked
  MIGRATION_LIST="$(supabase_cli migration list --linked 2>&1)"
fi

if remote_has_version "202609090001"; then
  echo "✓ Cosmic V4 migration is already recorded on the remote database."
else
  echo "→ Previewing the pending Cosmic V4 migration…"
  supabase_cli db push --linked --include-all --dry-run
  echo "→ Applying the pending Cosmic V4 migration…"
  supabase_cli db push --linked --include-all
fi

unset SUPABASE_DB_PASSWORD
rm -f supabase/config.toml
rm -rf supabase/.temp

printf '✓ Supabase migrations are synchronized.\n'
