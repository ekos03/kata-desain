#!/usr/bin/env bash
# Seluruh langkah audio: VO -> timeline -> musik -> sfx -> mix.  Pemakaian: pipeline/audio.sh <slug>
set -euo pipefail
cd "$(dirname "$0")"
python3 tts.py "$1"
python3 timeline.py "$1"
python3 music.py "$1"
python3 sfx.py "$1"
python3 mix.py "$1"
