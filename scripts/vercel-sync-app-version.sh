#!/usr/bin/env bash
set -euo pipefail

# Upserts NEXT_PUBLIC_APP_VERSION on Vercel (production target only).
# Requires: VERCEL_TOKEN, VERCEL_PROJECT_ID, checkout at repo root with package.json.
# On tag push: refs/tags/vX.Y.Z must match package.json "version".
# On workflow_dispatch: uses package.json "version".

: "${VERCEL_TOKEN:?VERCEL_TOKEN is required}"
: "${VERCEL_PROJECT_ID:?VERCEL_PROJECT_ID is required}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

[ -f package.json ] || {
  echo "::error::package.json not found at repo root"
  exit 1
}

PKG_VERSION=$(jq -r '.version' package.json)
EVENT="${GITHUB_EVENT_NAME:-}"
REF="${GITHUB_REF:-}"

if [[ "$REF" =~ ^refs/tags/v([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
  TAG_VER="${BASH_REMATCH[1]}.${BASH_REMATCH[2]}.${BASH_REMATCH[3]}"
  if [ "$TAG_VER" != "$PKG_VERSION" ]; then
    echo "::error::Release tag v$TAG_VER must match package.json version $PKG_VERSION"
    exit 1
  fi
  APP_VERSION="$PKG_VERSION"
elif [ "$EVENT" = "workflow_dispatch" ]; then
  APP_VERSION="$PKG_VERSION"
else
  echo "::error::Requires push of semver tag refs/tags/vX.Y.Z or workflow_dispatch (GITHUB_REF=$REF GITHUB_EVENT_NAME=$EVENT)"
  exit 1
fi

TARGET_JSON='["production"]'
body=$(
  jq -n \
    --arg key "NEXT_PUBLIC_APP_VERSION" \
    --arg value "$APP_VERSION" \
    --argjson target "$TARGET_JSON" \
    '{key: $key, value: $value, type: "plain", target: $target}'
)

echo "Syncing NEXT_PUBLIC_APP_VERSION=$APP_VERSION to Vercel production..."
curl -sS -X POST "https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env?upsert=true" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$body"

echo "App version sync done: $APP_VERSION"
