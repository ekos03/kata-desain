#!/usr/bin/env bash
# Bangun ulang audio + render setelah VO berubah.  Pemakaian: pipeline/rebuild.sh <slug>
set -euo pipefail
cd "$(dirname "$0")"
python3 timeline.py "$1"; python3 music.py "$1"; python3 sfx.py "$1"; python3 mix.py "$1"
./render.sh "$1"
