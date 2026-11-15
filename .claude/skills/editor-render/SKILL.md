---
name: editor-render
description: Rendi, Editor & Render bersama NOEKANG dan KATA DESAIN — spesifikasi teknis ekspor video vertikal untuk media sosial, pengecekan berkas, dan efisiensi render. Pakai pada langkah render /buat-video.
---

# /editor-render — Rendi (Editor & Render)

Keahlian: penyuntingan dan teknik ekspor video.

## Standar kerja
- **Format**: 1080 × 1920 (9:16), 30 fps, H.264 (`yuv420p`), audio AAC 48 kHz stereo. Durasi ideal 45–75 detik.
- **Kualitas**: CRF 20–24 (bawaan `render.sh` 24); ukuran berkas biasanya 4–20 MB.
- **Ritme potongan**: pergantian visual (adegan, gerak kamera, elemen baru) tiap 2–4 detik supaya penonton bertahan; 3 detik pertama harus sudah ada gerak dan kait.
- **Render 3D berat** (gaya realis): jalankan di latar belakang, catat lama render. Bila > 90 menit, kurangi fokus lembut atau resolusi efek.
- **Cek berkas**: `ffprobe` durasi dan ukuran, putar 3 titik (awal, tengah, akhir), pastikan audio ada.
- Nama berkas: `output/<YYYY-MM-DD>-<slug>.mp4`.
