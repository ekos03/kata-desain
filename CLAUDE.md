# kata-desain

Produksi video explainer 9:16 kanal **KATA DESAIN**: tips desain grafis untuk (a) pemula yang belajar desain dan (b) pelaku UMKM/industri yang membutuhkan jasa desain. Bahasa Indonesia, animasi **3D halus** (Remotion + Three.js, bukan *low-poly*). Divisi kedua kantor NOEKANG (divisi pertama: repo `video-arsitek`).

- Membuat video baru: skill **`/buat-video`** (`.claude/skills/buat-video/SKILL.md`). Riset topik: **`/riset-tren`** (Silvia). Jadwal: `content/jadwal.md`.
- Kru: Irena (Penulis Naskah & Konsep Desain), Bima (Desainer 3D & Animator); kru lain dipakai bersama dengan NOEKANG.
- Pustaka: `src/lib/` (ui, palettes, Shell, Closing) dan `src/lib3d/kit.tsx` (Studio, Gloss, Emblem, Cup, RoundedBox). Video referensi gaya: `src/videos/logo-umkm/`.
- Pipeline audio & render: `pipeline/` (TTS gratis lokal Piper → timeline → musik → efek suara → mix → render). Render 3D memakai OpenGL `swangle` (diatur di `remotion.config.ts`), ±40–45 menit per video 60 detik: jalankan di latar belakang.
- Hasil: `output/<tanggal>-<slug>.mp4` + naskah VO `.txt` + caption Instagram `.txt`.
- Cek kode: `npm run lint`.
- Bahasa naskah dan teks layar untuk orang awam: sederhana, tidak menggurui, tetap benar. Jangan meniru logo/merek nyata; pakai merek fiktif dan beri catatan "hanya contoh".
- Semua teks layar mengikuti EYD, tanpa kata menggantung (`tidy()`), istilah asing dicetak miring.
