#!/usr/bin/env bash
# Sampul Instagram & TikTok. Pakai: pipeline/sampul.sh <slug> <frame-latar> <props.json> <tanggal YYYY-MM-DD>
# props.json: {"kicker":..,"judul":"baris 1|*aksen* baris 2","sub":..,"kanal":..,"accent":..}
set -euo pipefail
SLUG=$1; FRAME=$2; PROPS=$3; DATE=$4
OUT=output; TMP=$(mktemp -d)
npx remotion still "$SLUG" "public/$SLUG/sampul-bg.png" --frame="$FRAME" --log=error
for F in tiktok ig; do
  python3 -c "import json,sys;d=json.load(open('$PROPS'));d.update(bg='$SLUG/sampul-bg.png',format='$F');json.dump(d,open('$TMP/$F.json','w'))"
  npx remotion still sampul "$OUT/$DATE-$SLUG-sampul-$F.png" --props="$TMP/$F.json" --log=error
done
# pratinjau potongan grid Instagram 3:4 (untuk dicek, tidak diunggah)
ffmpeg -loglevel error -y -i "$OUT/$DATE-$SLUG-sampul-ig.png" -vf "crop=1080:1440:0:240" "$TMP/ig-grid.png"
ffmpeg -loglevel error -y -i "$OUT/$DATE-$SLUG-sampul-tiktok.png" -i "$OUT/$DATE-$SLUG-sampul-ig.png" -i "$TMP/ig-grid.png" \
  -filter_complex "[0]scale=360:640[a];[1]scale=360:640[b];[2]scale=360:480,pad=360:640:0:80:white[c];[a][b][c]hstack=3" "$OUT/$DATE-$SLUG-sampul-cek.jpg"
echo "Sampul: $OUT/$DATE-$SLUG-sampul-{tiktok,ig}.png  (lembar cek: $OUT/$DATE-$SLUG-sampul-cek.jpg)"
