# Rapat Konsep Visual Realis KATA DESAIN

**Waktu:** Sabtu malam, 14 November 2026 · **Peserta:** Irena (Konsep), Arya (Riset Pasar), Bima (Desainer 3D) · **Diminta oleh:** Eko
**Catatan jujur:** semua peran dijalankan oleh satu agen Claude yang bekerja bergantian sebagai Irena, Arya, dan Bima. "Rapat" ini adalah sesi kerja bersama: tiap peran menyumbang temuan dari bidangnya, lalu disusun menjadi keputusan bersama.

## 1. Latar
Eko tidak cocok dengan video uji pertama (aset tidak nyambung, komposisi kurang pas). Dari tiga arah gaya, Eko memilih **"satu objek utama"**, dengan syarat **dekat dan realis dengan kehidupan nyata**.

## 2. Temuan Irena (konsep visual)
- Video produk 3D pendek sedang tren tahun 2026: pencahayaan sinematik, komposisi rapat, dan produk yang akurat seperti aslinya ([Elipse Studio](https://elipsestudio.com/blogs/3d-animation-motion-graphics-2026/), [Prolific](https://prolificstudio.co/blog/3d-product-animation-still-outperforms-ai-generated-product-videos/), [Maverick Frame](https://maverickframe.com/blog/product-rendering-trends/)).
- Supaya terasa nyata bagi penonton UMKM, produknya harus **produk yang mereka pegang sehari-hari**: keripik dalam *standing pouch* kraft, sambal dalam toples kaca, kopi *sachet*, kue kering dalam toples. Jenis kemasan inilah yang paling sering dibahas untuk UMKM ([UKM Indonesia](https://ukmindonesia.id/baca-deskripsi-posts/informasi-penting-nih-mengenal-jenis-jenis-kemasan-berdasarkan-bentuk-dan-penggunaannya), [Cermati](https://www.cermati.com/artikel/8-ide-kemasan-menarik-untuk-bisnis-makanan-ringan)).
- Tempatnya juga harus akrab: meja kayu, rak warung, dapur rumahan, lapak bazar, paket kiriman, layar marketplace.
- Bahan harus terasa asli: kertas kraft berserat kasar (tidak mengilap), kaca bening yang membiaskan isi, tutup logam emas, *sachet* foil mengilap, kayu bergaris.

## 3. Temuan Arya (pasar dan format)
- Video *makeover* (perubahan produk atau kemasan) di TikTok diteliti berpengaruh pada *branding* dan minat beli usaha mikro ([Iqtishaduna, UIN Alauddin](https://arsip-journal.uin-alauddin.ac.id/index.php/iqtishaduna/article/download/62003/23717/195505)). Format **sebelum–sesudah** layak dipakai, walau belum ada data tonton pasti.
- Kemasan yang unik dan fotogenik lebih mudah viral ([RRI](https://rri.co.id/batam/ekonomi/umkm/1820144/umkm-naik-kelas-berkat-inovasi-kemasan-menarik)).
- **Hati-hati:** desain yang cuma "cantik" bisa merugikan. Contoh terkenal Tropicana kehilangan penjualan setelah ganti kemasan ([Marketing Made Clear](https://marketingmadeclear.com/?p=14295)). Pesan kanal kita sebaiknya **"jelas dan mudah dikenali"**, bukan sekadar "bagus".
- Konten UMKM yang disarankan peneliti: seri edukasi pendek, *reels*, dan grafis gerak sederhana ([UMN](https://kc.umn.ac.id/id/eprint/49624/2/BAB_I.pdf)).

## 4. Temuan Bima (teknis)
- Semua aset realis dibuat **prosedural** di Three.js (bentuk dan tekstur dibuat lewat kode, tanpa unduhan): pouch kraft dengan serat dan tonjolan, toples kaca dengan isi sambal, *sachet* bergerigi, meja kayu, taplak motif, kardus dan plastik gelembung, ponsel, cangkir, talenan, cahaya jendela.
- Kertas kraft: kekasaran tinggi, tanpa logam, ditambah *bump* serat (sesuai saran tekstur PBR, [AITextured](https://aitextured.com/textures/paper/parcel-packaging-paper-texture-with-wrinkles-free-pbr.html)).
- Latar warna solid lembut **menyatu** dengan meja lewat kabut berwarna sama, jadi tetap sesuai aturan "latar solid".
- **Batas:** tangan atau orang sungguhan belum bisa dibuat realistis. Tekstur foto asli (HDRI, kayu foto) tidak bisa diunduh di server ini.
- Satu gambar diam butuh sekitar 10 detik. Waktu render video belum diukur, dan perkiraan saya 15–25 menit per video.

## 5. Keputusan rapat
1. Arah visual: **realis sehari-hari** dengan satu objek utama, ditambah benda pendukung yang akrab.
2. Tokoh utama: produk UMKM fiktif yang terasa nyata (Keripik Mbok Sari, Sambal Bu Rini, Kue Mama Lia, Kopi Senja), selalu diberi catatan "merek fiktif".
3. Setiap video punya satu **momen sebelum–sesudah** (label pucat → label jelas).
4. Tetap: judul rata tengah, latar solid lembut satu tone per video, keterangan bergaris penunjuk, kartu "CARA CEK".
5. Gaya *liquid glass* hanya untuk kartu/teks di layar. **Objek 3D memakai bahan asli** (kraft, kaca bening, logam, kayu), bukan kaca berwarna.

## 6. Sepuluh opsi (gambar: `10-opsi-realis.jpg`)

| No | Opsi | Tone | Kekuatan | Catatan |
|---|---|---|---|---|
| 1 | Meja kayu, tiga produk | pink | Lengkap, langsung terasa "dagangan" | Agak ramai |
| 2 | *Close-up* satu produk | pink | Paling jelas untuk menjelaskan isi label | Butuh variasi sudut kamera |
| 3 | Rak toko sebelum–sesudah | pink | Pesan paling kuat, mudah dimengerti | Butuh latar rak yang lebih kaya |
| 4 | Rak warung bertingkat | oranye | Nyata: produk kita di antara banyak produk | Objek kecil di HP |
| 5 | Dapur rumahan | persik | Dekat dengan UMKM rumahan | |
| 6 | Lapak bazar + label harga | mentega | Suasana jualan nyata, "3 detik" | |
| 7 | Paket online dibuka | mint | Relevan untuk penjual daring | Label di dalam kardus kurang terlihat |
| 8 | Ponsel marketplace + produk | langit | Menghubungkan kemasan dengan foto daring | |
| 9 | Skala dengan benda sehari-hari | sage | Membantu cek ukuran label | |
| 10 | Cahaya jendela pagi | lavender | Hangat, cocok untuk tips foto produk | |

## 7. Rekomendasi tim
- **Satu video = satu "dunia".** Pilih satu latar dari opsi di atas sesuai topik, lalu kamera bergerak di dalam dunia itu: dekat, lalu menjauh, lalu ke detail. Jangan berganti-ganti benda acak.
- Usulan per topik di jadwal:
  - **Kemasan UMKM (17 Nov):** opsi 3 rak sebelum–sesudah dan opsi 2 *close-up*.
  - **Desain tidak berantakan (19 Nov):** opsi 2 *close-up* label, rapikan elemen satu per satu.
  - **Feed Instagram (21 Nov):** opsi 8 ponsel.
  - ***Brief* desainer (24 Nov):** opsi 5 dapur atau opsi 1 meja kerja.
  - **Tulisan mudah dibaca (26 Nov):** opsi 6 lapak, uji baca dari jauh.
- Langkah berikutnya setelah Eko memilih: Bima membuat satu video uji 20 detik dengan opsi terpilih untuk mengukur waktu render, lalu kit dan skill diperbarui.
