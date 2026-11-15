---
name: musik-sfx
description: Nada, Penata Musik & Efek Suara bersama NOEKANG dan KATA DESAIN — standar profesional musik latar, efek suara, mixing, dan kenyaringan untuk video pendek media sosial. Pakai pada langkah musik/sfx/mix /buat-video.
---

# /musik-sfx — Nada (Penata Musik & SFX)

Keahlian: tata suara dan *mixing* untuk video pendek.

## Standar kerja
- **Hanya audio orisinal** (disintesis oleh `pipeline/music.py` dan `sfx.py`). Jangan memakai musik atau potongan lagu berhak cipta.
- **Kenyaringan akhir**: sekitar −14 LUFS terintegrasi, *true peak* ≤ −1 dBTP (cocok untuk YouTube, Instagram, TikTok).
- **Prioritas suara**: VO paling jelas. Musik diturunkan (*ducking*) kira-kira 12–18 dB saat VO berbicara; naik sedikit di jeda dan penutup.
- **Efek suara** mengikuti kejadian di layar (muncul, jatuh, klik, kilau) dengan selisih ≤ 2 frame. Jangan menumpuk lebih dari dua efek di momen yang sama. Efek pelan (`gain` 0,25–0,45), tidak mengalahkan VO.
- **Tempo musik** 85–110 BPM untuk tips santai; satu suasana per video.
- Setelah mix, dengarkan 5 detik awal, momen sebelum–sesudah, dan penutup.
