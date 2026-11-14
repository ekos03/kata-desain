#!/usr/bin/env bash
# Render beberapa frame lalu gabungkan jadi satu lembar kontak untuk dicek.
# Pemakaian: pipeline/stills.sh <slug> <frame> [frame...]   -> .work/<slug>/sheet.jpg
set -euo pipefail
cd "$(dirname "$0")/.."
slug=$1; shift
dir=.work/$slug; rm -rf "$dir"; mkdir -p "$dir"
for f in "$@"; do
  npx remotion still "$slug" "$dir/$(printf %05d "$f").png" --frame="$f" --scale=0.4 >/dev/null 2>&1 || echo "gagal frame $f"
done
if [ "$#" -eq 1 ]; then
  ffmpeg -y -loglevel error -i "$(ls "$dir"/*.png)" "$dir/sheet.jpg"
else
  ffmpeg -y -loglevel error $(ls "$dir"/*.png | sed 's/^/-i /') -filter_complex "hstack=inputs=$#" "$dir/sheet.jpg"
fi
echo "$dir/sheet.jpg"
