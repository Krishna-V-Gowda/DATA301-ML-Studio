#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env.local ]]; then
  echo "✗ .env.local is missing. Copy .env.example to .env.local and add the Supabase values first."
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env.local
set +a

SERVER_KEY="${SUPABASE_SECRET_KEY:-${SUPABASE_SERVICE_ROLE_KEY:-}}"
if [[ -z "${NEXT_PUBLIC_SUPABASE_URL:-}" || -z "$SERVER_KEY" ]]; then
  echo "✗ NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required."
  exit 1
fi

printf "Administrator email: "
IFS= read -r ADMIN_EMAIL
printf "Display name [Course administrator]: "
IFS= read -r ADMIN_DISPLAY_NAME
ADMIN_DISPLAY_NAME="${ADMIN_DISPLAY_NAME:-Course administrator}"

while true; do
  printf "New administrator password (12+ chars, uppercase, lowercase, number, symbol): "
  IFS= read -r -s ADMIN_PASSWORD
  printf "\nConfirm password: "
  IFS= read -r -s ADMIN_PASSWORD_CONFIRM
  printf "\n"
  if [[ ${#ADMIN_PASSWORD} -lt 12 ]]; then
    echo "Password must contain at least 12 characters."
  elif [[ ! "$ADMIN_PASSWORD" =~ [a-z] || ! "$ADMIN_PASSWORD" =~ [A-Z] || ! "$ADMIN_PASSWORD" =~ [0-9] || ! "$ADMIN_PASSWORD" =~ [^a-zA-Z0-9] ]]; then
    echo "Password must include uppercase, lowercase, a number, and a symbol."
  elif [[ "$ADMIN_PASSWORD" != "$ADMIN_PASSWORD_CONFIRM" ]]; then
    echo "Passwords do not match."
  else
    break
  fi
done

ADMIN_EMAIL="$ADMIN_EMAIL" \
ADMIN_DISPLAY_NAME="$ADMIN_DISPLAY_NAME" \
ADMIN_PASSWORD="$ADMIN_PASSWORD" \
SUPABASE_SECRET_KEY="$SERVER_KEY" \
node scripts/bootstrap-admin.mjs

unset ADMIN_PASSWORD ADMIN_PASSWORD_CONFIRM SERVER_KEY
