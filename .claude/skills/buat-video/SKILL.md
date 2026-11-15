---
name: buat-video
description: Produksi satu video explainer 9:16 kanal KATA DESAIN (tips desain grafis untuk pemula dan pelaku UMKM/industri yang butuh jasa desain) secara penuh — riset dan naskah berbahasa awam yang mudah dipahami (EYD), voice over TTS gratis lokal (plus ekspor naskah VO untuk ElevenLabs), animasi **3D halus** (Remotion + Three.js, bukan *low-poly*), efek suara, musik, render, lalu commit dan push. Pakai saat diminta membuat video baru, misalnya "/buat-video topik: ..." atau saat tugas terjadwal harian berjalan.
---

# /buat-video

Argumen: `topik: <judul>` dan opsional `slug: <slug>`. Kalau tidak ada, ambil baris hari ini dari `content/jadwal.md`.

Targetkan selesai dalam ±60 menit (render 3D ±15 menit, jalankan di latar belakang). Kerjakan berurutan; jangan lewati pengecekan visual.

### Mode hemat (wajib — kuota pemakaian Claude terbatas)
- **Jangan membaca ulang file besar** yang tidak perlu. Baca `src/videos/logo-umkm/scenes.tsx` (video referensi) sekali, salin polanya; pakai `src/lib3d/kit.tsx` (`Studio`, `Gloss`, `Emblem`, `Cup`, `RoundedBox`, `mix`, `toMono`) dan `src/lib/ui` (`Title`, `InfoCard`, `KeyPill`) daripada menulis ulang dari nol.
- Tulis `scenes.tsx` **sekali secara utuh**, lalu perbaiki dengan edit kecil — jangan menulis ulang seluruh file berkali-kali.
- Pengecekan visual: **satu** lembar kontak `stills.sh` untuk semua scene (scale 0.4). Render ulang hanya frame yang bermasalah. Maksimal 2 putaran perbaikan; sisa catatan kecil cukup dilaporkan.
- Jangan menjalankan `npx remotion studio`, jangan render video penuh lebih dari sekali kecuali ada kesalahan fatal.
- Ringkasan akhir singkat (≤ 15 baris + teks naskah VO).
- Bila terkena batas pemakaian lalu dilanjutkan, **jangan mulai dari nol**: cek `git status` dan file yang sudah ada, lanjutkan dari langkah terakhir.
- Commit lebih awal (setelah naskah + VO + timeline jadi, dan setelah `scenes.tsx` lolos lint) agar pekerjaan tidak hilang bila sesi terhenti.

### Status kantor digital (live, opsional)
Kantor NOEKANG, sayap KATA DESAIN: https://claude.ai/artifact/Fxc1g9o9KqMVer8jfGKFug — di awal dan akhir tiap langkah, tulis status lewat **ArtifactData** (`action: "update"`, `collection: "pegawai"`, `doc_id` peran): naskah `naskah-desain` (Irena) · VO `suara` · arah visual `art-director` (Galih) · adegan 3D dan render `desainer3d` (Bima) · musik dan efek suara `musik` · cek `qc` · caption `sosmed`. Data `{status, tugas, video: "<slug>", waktu}`. Video: `collection: "video"`, `doc_id: <slug>`, sertakan `divisi: "desain"`. Bila ArtifactData tidak tersedia atau gagal, lewati tanpa menggagalkan produksi.

### Kru dan skill keahlian (wajib dibaca singkat di awal tiap langkah)
| Langkah | Kru | Skill |
|---|---|---|
| Riset topik | Arya | `/riset-tren` |
| 1. Naskah | Irena | `/konsep-naskah` |
| 2. Voice over | Suara | `/pengisi-suara` |
| Arah visual + persetujuan stills | Galih | `/art-director` |
| 3. Kode video 3D + render | Bima | `/desainer-3d` |
| 4. Musik + efek suara | Nada | `/musik-sfx` |
| 5. Cek | Teliti | `/qc-video` |
| Review visual | Galih | `/art-director` |
| Review isi dan kelengkapan | Putra | `/manajer-produksi` |
| 6. Render | Rendi | `/editor-render` |
| Caption + naskah VO | Kirana | `/media-sosial` |
Baca hanya bagian "Standar kerja" skill tersebut (singkat) sebelum mengerjakan langkahnya; hemat kuota, jangan dibaca ulang.

## 0. Persiapan

```bash
cd <root repo>
[ -d node_modules ] || npm ci --no-audit --no-fund
python3 -c "import numpy, soundfile, piper" 2>/dev/null || pip install -q -r pipeline/requirements.txt
```

**Voice over memakai TTS gratis lokal** (Piper, suara wanita Bahasa Indonesia; model diunduh otomatis sekali). **Jangan memakai ElevenLabs atau layanan TTS berbayar** — pemilik kanal membuat VO ElevenLabs sendiri dari naskah yang kita ekspor.

## 1. Naskah (bahasa awam, isi tetap benar)

- **Penonton** (dua kelompok, pilih salah satu per video sesuai jadwal): (a) **pemula** yang ingin belajar desain grafis; (b) **pelaku UMKM/industri** yang membutuhkan jasa desain (cara memilih desainer, brief, logo, kemasan, konten promosi). Bahasa ramah, tidak menggurui, tanpa jargon.
- **Pakai riset Arya**: sebelum menulis, buka laporan terbaru di `content/riset/` (`ls content/riset | tail -1`), cari slug hari ini, lalu pakai usulan hook dan pola yang berhasil (hook langsung di 3 detik pertama, poin bernomor, penutup "simpan/bagikan"). Bila tidak ada catatan untuk slug ini, lanjut seperti biasa.

Tulis `content/<slug>/naskah.json`:

```json
{
  "slug": "logo-umkm",
  "title": "Tips Memilih Rangka Atap Baja Ringan",
  "segments": [
    { "id": "hook", "text": "…", "beats": ["frasa persis di dalam text", "…"] },
    { "id": "masalah", "text": "…", "beats": [] },
    { "id": "s1", "text": "Pertama, …", "beats": ["…"] },
    { "id": "outro", "text": "…", "beats": [] }
  ]
}
```

**Bahasa untuk orang awam (wajib).** Penonton bukan desainer profesional. Jadi:
- Pakai kata sehari-hari dan kalimat pendek, gaya santai ("Yuk", "pastikan", "jangan").
- Istilah desain (*kerning*, *whitespace*, vektor, *mockup*) hanya bila perlu dan langsung dijelaskan dengan kata sederhana; istilah asing dicetak miring di layar.
- Fokus pada hal yang bisa langsung dicoba atau dicek penonton (di HP, Canva, atau saat brief ke desainer), bukan teori panjang.
- Jangan menyebut atau meniru logo/merek nyata; contoh di layar memakai merek fiktif (mis. "Kopi Senja") dan diberi catatan "hanya contoh".
- Tetap benar: menyederhanakan bahasa, bukan mengubah fakta.

Aturan isi:
- Struktur: `hook` (pertanyaan pembuka) → `masalah` → 5–6 tahap `s1..sN` → `outro` (ajakan praktis; untuk UMKM boleh saran memakai jasa desainer). Scene `closing` ditambahkan otomatis.
- **Total teks ±800–1.000 karakter** agar durasi ±55–70 dtk.
- Akurat secara keilmuan: hanya pakai angka/aturan yang Anda yakin benar (prinsip desain yang umum diajarkan). Bila ragu, pakai kalimat kualitatif. Angka di layar diberi catatan "angka bersifat umum".
- Tulis `text` untuk **diucapkan**, dengan nada ramah seperti menjelaskan ke teman: singkatan dieja ("pe be ge", "es en i"), angka ditulis kata ("lima belas sentimeter"), satuan lengkap. Kalimat aktif, energik, ramah.
- `beats` = frasa kunci (substring persis dari `text`) untuk momen animasi, mis. "uji tanah". Urutan sesuai kemunculan.

## 2. Voice over + timeline

```bash
python3 pipeline/tts.py <slug>        # TTS lokal; --force bila naskah berubah
python3 pipeline/timeline.py <slug>   # -> src/videos/<slug>/timeline.json
```

## 3. Kode video `src/videos/<slug>/` — gaya standar: **realis sehari-hari, satu dunia**

Video referensi: **`src/videos/uji-realis/index.tsx`** (baca sekali, salin polanya). Struktur:
- Satu `<Studio top={0} height={1920}>` untuk seluruh video, berisi `World`: meja/rak/dapur + produk utama + aset pendukung. **Kamera bergerak terus** lewat `KEYS` (posisi + titik pandang per frame), tidak berganti-ganti benda acak antar adegan.
- `Rig`: menggerakkan kamera dan **mengganti warna latar per adegan** (`bgAt`), lembut tetapi berbeda tiap adegan; satu adegan penting boleh lebih kuat warnanya (mis. "sesudah").
- `EffectComposer` dengan `DepthOfField` (fokus dikunci ke produk utama lewat `worldFocusDistance`) dan `ToneMapping NEUTRAL`: aset di depan/belakang buram lembut, produk utama tajam.
- Teks HTML di atas kanvas per adegan, lalu daftarkan di `src/videos/registry.ts`.

Aset (`src/lib3d/real.tsx`, semua prosedural): `Pouch` (kraft), `Jar` (kaca + isi), `Sachet`, `Table`, `Taplak`, `Kardus`, `Phone`, `Mug`, `Talenan`, `Mangkuk`, `KepingKeripik`, `CahayaJendela`, `SoftShadow`, `Marker`, label dari `useLabels()`/`useLabels2()` (tambah label baru di sana bila perlu). Contoh 10 latar: `src/videos/opsi/` dan `src/videos/gaya/`.

Aturan visual (wajib, permintaan pemilik kanal):
- **Judul atas sans-serif** (`Headline`, huruf Bricolage Grotesque dari `src/lib3d/fonts.ts`), pendek 1–3 kata. Kata kunci 1–2 kata dibedakan dengan `*warna aksen*`, `~garis tepi~` (tetap berwarna isi), atau `_stabilo_`. Rata tengah.
- **Produk utama tidak boleh tertutup** teks atau elemen apa pun. Atur kamera agar produk berada di tengah (± y 520–1400); info di pita atas (± y 280–500) dan pita bawah (± y 1420–1620). Jangan menaruh teks penting di bawah y 1620 atau di atas y 250: tertutup antarmuka Reels/TikTok/Shorts (lihat `/qc-video`).
- **Tanpa garis penunjuk.** Pakai `Marker` (cincin bernomor tanpa isian) di produk + `InfoChip` bernomor besar (satu baris, lebar penuh) di bawah.
- **Lebih ramai, tetap jelas:** tiap adegan 3–5 info kecil (`Sticker`, `Meter`, `Card`, `Bullets`, harga, daftar cek) + 2–3 aset pendukung di latar (buram lembut). Ukuran teks info minimal 40 px.
- **Satu momen sebelum–sesudah** per video (mis. label pucat berubah menjadi label jelas, stiker SEBELUM/SESUDAH, meter skor naik).
- Merek di layar selalu fiktif dan diberi catatan "*… hanya contoh merek fiktif". Jangan menampilkan merek atau logo aplikasi nyata.
- **EYD dan pemenggalan baris:** semua teks lewat `tidy()` (kata tugas menempel ke kata sesudahnya, awal dan akhir kalimat tidak menggantung, frasa padu tidak dipisah) dan `textWrap: "balance"`; tanpa pemotongan kata. Kartu info usahakan satu baris. Hindari kata asing; bila terpaksa, cetak miring.
- Render: ± 25–30 menit per 23 detik (karena fokus lembut). Video 60 detik bisa ± 70 menit, jadi **jalankan di latar belakang** dan pakai fokus lembut seperlunya.

## 4. Efek suara + musik + mix

Tulis `content/<slug>/sfx.json` (lihat docstring `pipeline/sfx.py`): cue untuk setiap momen animasi penting (dentuman saat benda jatuh, pop saat ikon/titik muncul, tick untuk hitungan, pour, drill, rain, chime, dll.). Lalu:

```bash
python3 pipeline/music.py <slug> && python3 pipeline/sfx.py <slug> && python3 pipeline/mix.py <slug>
```

## 5. Cek

```bash
npm run lint
pipeline/stills.sh <slug> $(python3 pipeline/frames.py <slug> hook:b1+20 masalah:end-10 s1:end-10 s2:end-10 s3:end-10 s4:end-10 s5:end-10 s6:end-10 outro:110 closing:110)
```

Buka `.work/<slug>/sheet.jpg` dengan Read. Cek juga frame `end-4` scene yang punya animasi di akhir. Periksa: teks menggantung/bertumpuk/terpotong, area kosong, keterbacaan, sinkron animasi. Perbaiki lalu cek ulang frame yang bermasalah (juga momen tengah animasi, mis. `s3:b2+30`).

## Standar viral & kualitas (hasil rapat besar 15 Nov 2026, dipimpin Putra)
Notulen: `content/rapat/2026-11-15-rapat-besar.md` (baca juga tabel "Judul tayang usulan" di sana).
1. **Kait 3 detik:** kalimat VO dan teks layar pertama memakai pola kesalahan, rugi/uang, pertanyaan langsung, atau angka kaget. Jangan buka dengan "Halo" atau "Tips kali ini". Gambar pertama langsung menunjukkan masalah.
2. **Satu pesan utama**, 3–5 poin bernomor, durasi 45–60 detik.
3. **Momen kunci wajib:** minimal satu adegan salah vs benar atau sebelum–sesudah, tampil ≥ 2 detik.
4. **Ritme:** visual/kamera berganti tiap 2–3 detik; teks layar ≤ 7 kata per baris dan sinkron dengan VO.
5. **Judul tayang & caption berpola kait**, bukan "Tips ..." (slug tidak berubah).
6. **Alasan menyimpan:** sebelum penutup ada ringkasan daftar periksa satu layar + ajakan komentar dengan pertanyaan spesifik.
7. **Audio:** VO sedikit lebih cepat di kait, jeda sebelum poin penting, satu efek suara khas di momen kunci, musik −18 s.d. −22 dB di bawah VO.
8. **Kebenaran di atas viral:** angka bersumber atau ditulis "perkiraan"; topik berisiko selalu menyarankan tenaga ahli.
9. **Ukur:** bila pemilik mengirim angka tonton/simpan/bagikan, catat di `content/kinerja.md`; riset mingguan memakainya.
10. **Khusus KATA DESAIN:** kait sebelum–sesudah ("sesudah" sekilas dulu), tiap adegan 2–3 aset pendukung + 1 gerak kecil tanpa menutupi produk, satu langkah praktis yang bisa dicoba hari itu.

10b. **Brief per video:** sebelum menulis naskah, cari slug video di `content/rapat/2026-11-15-rapat-detail-sesi-2.md`. Bila ada, pakai judul tayang, kait, poin, momen kunci, dan ajakannya (tetap periksa kebenarannya). Struktur 60 detik, ikon ✕/✓, SFX khas "benar"/"salah", 3 versi kait (≤ 12 kata) di naskah, dan bingkai pertama sebagai sampul juga mengikuti notulen itu.

## Sampul Instagram & TikTok (wajib, setiap video)
Komponen `src/lib/Sampul.tsx` + skrip `pipeline/sampul.sh`.
1. Tulis `content/<slug>/sampul.json`: `kicker` (≤ 4 kata), `judul` (judul tayang berpola kait, 2–3 baris dipisah `|`, satu kata aksen `*...*`, ≤ 16 huruf per baris), `sub` (≤ 6 kata, mis. "5 hal yang wajib dicek"), `kanal`, `accent`, dan `band` [y awal, y akhir] = pita ilustrasi/produk dari bingkai video yang **tidak berisi teks** (KATA DESAIN: zona produk ± 480–1420). KATA DESAIN juga: `ink`, `panel` terang, `bgColor`/`bgEdge` = warna latar adegan itu, `font: "'Bricolage Grotesque', sans-serif"`.
2. Pilih bingkai momen kunci (sesudah/benar) lalu jalankan `pipeline/sampul.sh <slug> <frame> content/<slug>/sampul.json <tanggal>`. Hasil: `output/<tanggal>-<slug>-sampul-tiktok.png`, `-sampul-ig.png` (1080×1920; untuk IG semua teks berada di pita tengah 3:4 agar aman di grid profil), dan lembar cek `-sampul-cek.jpg` (TikTok | IG | potongan grid IG).
3. Sampul ikut **review Galih → Putra** (lihat lembar cek): judul terbaca di ukuran kecil, tidak keluar panel, gambar tidak terpotong aneh, sesuai isi video, tidak ada klaim berlebihan. Perbaiki lalu jalankan ulang.

## Review video (langkah wajib, sebelum dikirim ke pemilik)
Urutan: **Galih (visual) → perbaiki → Putra (isi & kelengkapan) → perbaiki → pemilik (Putra pemilik kanal)**. Supaya hemat render, review pertama memakai lembar kontak `stills.sh` (semua adegan) **sebelum render penuh**; setelah render, ambil 6 bingkai dari mp4 untuk cek akhir.

1. **Review Galih** — baca `/art-director` bagian "Daftar review". Tulis koreksi bernomor (mana, apa salahnya, usulan perbaikan). Perbaiki semuanya, cek ulang bingkai yang diperbaiki.
2. **Review Putra** — baca `/manajer-produksi` bagian "Daftar review". Tulis koreksi bernomor. Perbaiki semuanya.
3. Render penuh. Ambil 6 bingkai dari mp4 (`ffmpeg -ss <detik> -i <mp4> -frames:v 1`) dan putar audio sekilas; bila Galih/Putra menemukan masalah baru yang jelas, perbaiki dan render ulang **sekali** saja.
4. Simpan catatan di `content/<slug>/review.md`: koreksi Galih, koreksi Putra, apa yang sudah diperbaiki, sisa catatan (bila ada).
5. Status kantor digital: `art-director` (Galih) dan `manajer` (Putra) diisi "bekerja"/"selesai" saat review (lewati bila ArtifactData tidak ada).
6. Kirim ke pemilik video + sampul TikTok & IG beserta ringkasan review (≤ 5 baris: jumlah koreksi Galih dan Putra, yang sudah diperbaiki, sisa catatan).

## 6. Render, simpan, laporkan

```bash
pipeline/render.sh <slug>          # -> output/<YYYY-MM-DD>-<slug>.mp4
git add content/<slug> src/videos/<slug> src/videos/registry.ts public/<slug> output/
git commit -m "Video: <judul>"
git push origin HEAD:main          # ulangi s.d. 4x bila gagal jaringan
```

Tulis **caption Instagram** di `content/<slug>/caption-ig.txt` (wajib), lalu ekspor:

```bash
python3 pipeline/caption_txt.py <slug>   # -> output/<YYYY-MM-DD>-<slug>-caption-ig.txt (cek ≤ 2.200 karakter, ≤ 30 tagar)
```

Aturan caption (contoh: `content/logo-umkm/caption-ig.txt`):
- Baris pertama = kait yang memancing (pertanyaan/masalah) + 1 emoji.
- 1–2 kalimat masalah, lalu poin tiap tahap bernomor (1️⃣ 2️⃣ …) dalam bahasa awam, sama isinya dengan video.
- Ajakan: simpan, bagikan, dan bertanya di kolom komentar.
- Catatan "*Contoh merek fiktif" bila memakai merek contoh.
- 5–8 tagar relevan berbahasa Indonesia (lihat `/media-sosial`) (#desaingrafis #belajardesain #tipsdesain #katadesain #umkm #branding + tagar topik).
- EYD, tanpa klaim berlebihan, panjang ±800–1.300 karakter.

Sebelum commit, ekspor naskah VO (wajib, ikut di-commit):

```bash
python3 pipeline/naskah_txt.py <slug>   # -> output/<YYYY-MM-DD>-<slug>-naskah-vo.txt
```

Akhiri dengan: kirim **tiga file** — mp4, naskah VO .txt, dan caption Instagram .txt — ke pengguna (SendUserFile, status proactive), lalu ringkasan singkat dalam Bahasa Indonesia: judul, durasi, isi tiap tahap, lokasi file di repo, catatan bila ada yang perlu dicek manusia (mis. angka teknis), **teks naskah VO lengkap** dan **caption Instagram lengkap**, masing-masing dalam blok kode agar mudah disalin.

## Lampiran: mengganti VO dengan mp3 dari pemilik (mis. ElevenLabs)

```bash
python3 pipeline/vo_import.py <slug> <file.mp3>   # transkripsi Whisper lokal + penyelarasan ke naskah
pipeline/rebuild.sh <slug>                        # timeline, musik, sfx, mix, render
```

Cek ulang frame akhir tiap scene: durasi VO berubah, jadi animasi di dekat akhir scene bisa terpotong.
