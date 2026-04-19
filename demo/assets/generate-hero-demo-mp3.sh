#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
out="$root/demo/assets/audiometa-hero-demo-messy-tags.mp3"
ffmpeg -y -f lavfi -i "sine=frequency=523.25:duration=3" -c:a libmp3lame -b:a 160k -write_id3v1 1 -id3v2_version 3 \
  -metadata title="Untitled" \
  -metadata artist="" \
  -metadata album="dem0_album_wip" \
  -metadata album_artist="" \
  -metadata genre="misc" \
  -metadata date="0000" \
  -metadata comment="fix tags before release — source unknown" \
  -metadata track="0" \
  "$out"
echo "Wrote $out"
