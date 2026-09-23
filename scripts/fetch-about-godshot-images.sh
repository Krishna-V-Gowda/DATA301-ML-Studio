#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${PROJECT_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"
ASSET_DIR="$ROOT_DIR/public/campus"

mkdir -p "$ASSET_DIR"

fetch_image() {
  local url="$1"
  local output="$2"

  echo "-> Fetching $(basename "$output")"
  curl -fL --retry 4 --retry-delay 1 --connect-timeout 15 --max-time 90 \
    -A 'DATA301-Machine-Learning-Studio/6.6 campus asset fetch' \
    "$url" -o "$output"

  if command -v sips >/dev/null 2>&1; then
    local tmp="${output}.tmp"
    sips -s format jpeg -s formatOptions 88 -Z 2200 "$output" --out "$tmp" >/dev/null
    mv "$tmp" "$output"
  fi

  test -s "$output"
  if command -v file >/dev/null 2>&1; then
    local image_type
    image_type="$(file -b "$output")"
    printf '%s\n' "$image_type" | grep -Eqi 'JPEG image data|JFIF|JPEG 2000' || {
      echo "ERROR: $(basename "$output") is not a browser-safe JPEG: $image_type" >&2
      return 1
    }
  fi
  printf '✓ %s\n' "$(basename "$output")"
}

fetch_image \
  'https://vidyashilp.edu.in/btech/images/img/Student_life_at_VU_1.jpg' \
  "$ASSET_DIR/about-life.jpg"

fetch_image \
  'https://vidyashilp.edu.in/wp-content/uploads/2022/11/Campus-Reception-scaled.jpeg' \
  "$ASSET_DIR/about-reception-final.jpg"

printf '\n✓ Final About photography prepared from official Vidyashilp University sources.\n'
