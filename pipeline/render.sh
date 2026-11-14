#!/usr/bin/env bash
# Render video final ke output/<tanggal>-<slug>.mp4.  Pemakaian: pipeline/render.sh <slug>
set -euo pipefail
cd "$(dirname "$0")/.."
slug=$1
out="output/$(TZ=Asia/Jakarta date +%Y-%m-%d)-$slug.mp4"
mkdir -p output
npx remotion render "$slug" "$out" --concurrency=4 --crf=24
ffprobe -v error -show_entries format=duration:format=size -of compact "$out"
echo "$out"
