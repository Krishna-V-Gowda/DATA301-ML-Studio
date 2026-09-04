#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
export NEXT_TELEMETRY_DISABLED=1

printf '%s\n' '[1/8] resolve exact dependency graph and create lockfile'
npm install --package-lock-only --ignore-scripts --no-audit --no-fund

printf '%s\n' '[2/8] clean dependency install from lockfile'
rm -rf node_modules .next
npm ci --ignore-scripts --no-audit --no-fund

printf '%s\n' '[3/8] production dependency audit'
npm audit --omit=dev --audit-level=high

printf '%s\n' '[4/8] source, mathematical, content and security tests'
npm run verify:source

printf '%s\n' '[5/8] TypeScript typecheck'
npm run typecheck

printf '%s\n' '[6/8] optimized Next.js build'
npm run build

printf '%s\n' '[7/8] retain only source-controlled release inputs'
rm -rf node_modules .next
rm -f .tsbuildinfo tsconfig.tsbuildinfo
find . -type f -name '*.log' -delete

printf '%s\n' '[8/8] final public-tree scan'
node scripts/verify-public-release.mjs
node scripts/check-release-prerequisites.mjs
printf '%s\n' 'DATA301 public release finalized and verified.'
