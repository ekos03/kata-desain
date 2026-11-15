# kata-desain

Produksi video explainer 9:16 kanal **KATA DESAIN**: tips desain grafis untuk (a) pemula yang belajar desain dan (b) pelaku UMKM/industri yang membutuhkan jasa desain. Bahasa Indonesia, animasi **3D realis sehari-hari** (Remotion + Three.js, bukan *low-poly*). Divisi kedua kantor NOEKANG (divisi pertama: repo `video-arsitek`).

- Membuat video baru: skill **`/buat-video`** (`.claude/skills/buat-video/SKILL.md`). Riset topik: **`/riset-tren`** (Arya). Jadwal: `content/jadwal.md`.
- Kru: Arya (Analis Tren & Riset Pasar, `/riset-tren`), Irena (Penulis Naskah & Konsep Desain, `/konsep-naskah`), Galih (Art Director, `/art-director`), Bima (Desainer 3D & Animator, `/desainer-3d`); kru bersama NOEKANG: Suara `/pengisi-suara`, Nada `/musik-sfx`, Teliti `/qc-video`, Rendi `/editor-render`, Kirana `/media-sosial`, manajer Eko.
- Pustaka: `src/lib/` (Shell, Closing), `src/lib3d/kit.tsx` (Studio, Gloss, Emblem, Cup, RoundedBox), `src/lib3d/layout.tsx` (tata letak teks bebas), `src/lib3d/tones.ts` (satu tone warna lembut per video, bergiliran). Video referensi gaya standar: **`src/videos/uji-realis/`** (realis sehari-hari, satu dunia, aset di `src/lib3d/real.tsx`).
- Pipeline audio & render: `pipeline/` (TTS gratis lokal Piper → timeline → musik → efek suara → mix → render). Render 3D memakai OpenGL `swangle` (diatur di `remotion.config.ts`), ± 70 menit per video 60 detik (fokus lembut): jalankan di latar belakang.
- Hasil: `output/<tanggal>-<slug>.mp4` + naskah VO `.txt` + caption Instagram `.txt`.
- Cek kode: `npm run lint`.
- Bahasa naskah dan teks layar untuk orang awam: sederhana, tidak menggurui, tetap benar. Jangan meniru logo/merek nyata; pakai merek fiktif dan beri catatan "hanya contoh".
- Semua teks layar mengikuti EYD, tanpa kata menggantung (`tidy()`), istilah asing dicetak miring.
