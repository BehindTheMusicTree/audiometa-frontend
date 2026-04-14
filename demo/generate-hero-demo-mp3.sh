#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
assets="$root/demo/assets"

write_demo_mp3() {
  local duration="$1"
  local out="$2"
  ffmpeg -y -f lavfi -i "sine=frequency=523.25:duration=${duration}" -c:a libmp3lame -b:a 160k -write_id3v1 1 -id3v2_version 3 \
    -metadata title="Untitled" \
    -metadata artist="" \
    -metadata album="dem0_album_wip" \
    -metadata album_artist="" \
    -metadata genre="misc" \
    -metadata date="0000" \
    -metadata comment="fix tags before release" \
    -metadata track="0" \
    "$out"
  echo "Wrote $out"
}

mkdir -p "$assets"
write_demo_mp3 3 "$assets/audiometa-hero-demo-messy-tags.mp3"
write_demo_mp3 150 "$assets/audiometa-hero-demo-messy-tags-2m30.mp3"
