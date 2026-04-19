#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$root"
rm -rf demo/output/playwright-results demo/output/hero-demo.webm demo/output/hero-demo.mp4
mkdir -p demo/output
npx playwright test demo/e2e/hero-demo.spec.ts
webm="$(find demo/output/playwright-results -name '*.webm' -type f | head -1)"
if [[ -z "${webm}" ]]; then
  echo "No WebM under demo/output/playwright-results. Did the test run and record video?" >&2
  exit 1
fi
cp "$webm" demo/output/hero-demo.webm
ffmpeg -y -i demo/output/hero-demo.webm \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium -movflags +faststart -an \
  demo/output/hero-demo.mp4
echo "Wrote demo/output/hero-demo.mp4 (source: demo/output/hero-demo.webm)"
