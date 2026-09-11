#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

CANONICAL_URL="${CANONICAL_URL:-https://data301-ml-studio.vercel.app}"
PRIVATE_SEED_DIR="${PRIVATE_SEED_DIR:-$ROOT_DIR/private_seed}"
HANDOFF_DIR="${HANDOFF_DIR:-$HOME/Documents/DATA301-Private-Handoff}"

printf '\nDATA301 Cosmic V4 production preparation\n'
printf '%s\n' '────────────────────────────────────────'

if [[ ! -f .env.local ]]; then
  echo "✗ .env.local is missing. Use COSMIC_RELEASE.command or create it from .env.example."
  exit 1
fi

for file in ML_Course_Outline.pdf ML_Course_Plan_Aug-2026.docx Module1.pdf Module-2.pdf; do
  if [[ ! -f "$PRIVATE_SEED_DIR/$file" ]]; then
    echo "✗ Private release asset is missing: $PRIVATE_SEED_DIR/$file"
    exit 1
  fi
done

mkdir -p "$HANDOFF_DIR"
chmod 700 "$HANDOFF_DIR"

TARGET_SITE_URL="$CANONICAL_URL" node scripts/normalize-env.mjs

if [[ -f package-lock.json ]]; then
  echo "→ Installing the locked dependency tree…"
  npm ci --no-audit --no-fund
else
  echo "→ Installing dependencies and creating a lockfile…"
  npm install --no-audit --no-fund
fi

printf '\n→ Running the complete local quality gate before changing live content…\n'
npm run verify:release

printf '\n→ Applying the idempotent Cosmic V4 Supabase migration…\n'
npm run migrate:supabase

printf '\n→ Provisioning Dr. Shabbeer Basha as a separately verified instructor administrator…\n'
PRIVATE_SEED_DIR="$PRIVATE_SEED_DIR" \
INSTRUCTOR_HANDOFF_PATH="$HANDOFF_DIR/PRIVATE_SHABBEER_HANDOFF.txt" \
INSTRUCTOR_EMAIL_DRAFT_PATH="$HANDOFF_DIR/PROFESSOR_HANDOFF_EMAIL.md" \
npm run setup:instructor

printf '\n→ Uploading and reconciling the four supplied academic files…\n'
PRIVATE_SEED_DIR="$PRIVATE_SEED_DIR" npm run setup:materials

printf '\n→ Verifying the live Supabase project, material privacy, instructor role, and signed delivery…\n'
npm run verify:supabase

printf '\n→ Re-running the full local quality gate after all generated state is complete…\n'
npm run verify:release

printf '\n✓ Cosmic V4 production preparation passed.\n'
printf 'Private handoff directory: %s\n' "$HANDOFF_DIR"
printf '%s\n' 'Next: npm run deploy:vercel'
