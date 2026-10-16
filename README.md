# Ruang Riset S2 — Insight Metodologi Penelitian TI

Media pembelajaran interaktif berbasis **32 judul skripsi S1** untuk mendiskusikan perbedaan fundamental penelitian **skripsi (S1)**, **tesis (S2)**, dan **disertasi (S3)**, serta konsep **research gap** dan **novelty**.

## Status versi ini

Versi ini **hanya frontend statis**:

- ✅ Peta distribusi 32 judul skripsi dalam 7 kategori, dapat difilter dan dicari.
- ✅ Perbandingan tujuan, pembuktian, dan kontribusi penelitian S1–S3.
- ✅ 8 contoh transformasi tema S1 → S2 → S3.
- ✅ Penjelasan research problem, research gap, novelty, dan pembuktian.
- ✅ Laboratorium interaktif menghasilkan *kerangka diskusi* (bukan verifikasi otomatis jurnal).
- ✅ 3 referensi jurnal ilmiah dengan tautan DOI.
- ✅ Tampilan responsif untuk proyektor, laptop, dan ponsel.
- ❌ Tidak ada pretest atau posttest.
- ❌ Tidak ada database, Supabase, autentikasi, dashboard dosen, identitas mahasiswa, ataupun forum online.
- ❌ Tidak ada API eksternal, analytics, cookies, atau sistem penyimpanan data.
- ❌ Tidak ada proses unduh data mahasiswa/PDF karena aplikasi tidak mengumpulkan informasi mahasiswa.

## Struktur file

```
index.html     # Struktur satu halaman pembelajaran
styles.css     # Desain antarmuka dan responsif
app.js         # Interaktivitas: filter judul, studi kasus, laboratorium gap
 data.js       # 32 judul anonim, 7 label tema, 8 studi kasus, 3 referensi
vercel.json    # Headers keamanan dan pengaturan Vercel
README.md      # Dokumentasi
```

Tidak perlu instalasi Node.js atau menjalankan `npm install`.

## Menjalankan secara lokal

Cara paling cepat: buka `index.html` langsung pada browser.

Untuk mencoba mode server lokal (direkomendasikan):

```bash
python -m http.server 8080
```

Buka `http://localhost:8080`.

## Deploy ke GitHub dan Vercel

1. Buat repositori GitHub, misalnya `ruang-riset-s2`.
2. Unggah semua file aplikasi pada **root** repositori (bukan di dalam subfolder ZIP).
3. Buka [vercel.com/new](https://vercel.com/new) → Import Git Repository → pilih repo GitHub.
4. **Framework Preset:** `Other` (website statis); **Build Command:** kosong / nonaktif; **Output Directory:** kosong (root proyek).
5. Klik **Deploy**. Vercel akan menyajikan `index.html`.
6. Untuk memperbarui konten, edit file lewat GitHub lalu lakukan commit; Vercel akan otomatis men-deploy ulang apabila integrasi GitHub sudah dihubungkan.

**Tidak memerlukan environment variables, Supabase, SQL, atau paket npm.**

> Penerapan ke repositori atau akun Vercel milik Anda tidak dilakukan otomatis dari ZIP ini. Anda perlu mengunggah atau menghubungkan repositori GitHub sendiri.

## Ubah data dan materi

- Untuk memperbarui judul dan kategori, edit `titles` dan `labels` di `data.js`.
- Untuk menambahkan contoh transformasi S1–S3, tambahkan objek baru pada `transformations` di `data.js` dengan properti `id`, `label`, `focus`, `s1`, `s2`, `s3`, `proof`, `gap`.
- Untuk referensi jurnal, edit array `references`.
- Untuk mengubah panduan perbandingan jenjang, edit bagian `#jenjang` di `index.html`.
- Angka kategori di chart otomatis dihitung dari `data.js`. **Angka KPI 32/7/8 pada hero bersifat statis**; perbarui angka-angka tersebut jika jumlah data berubah.

## Pedoman ilmiah

Klasifikasi tema **berdasarkan judul saja**, bukan pemeriksaan isi atau kualitas skripsi. Studi kasus S2/S3 adalah skenario hipotetis, bukan klaim novelty yang sudah dibuktikan.

Research gap dan novelty baru dapat diklaim setelah dilakukan pencarian, evaluasi, dan sintesis literatur ilmiah yang relevan. Contoh referensi adalah artikel metodologi yang digunakan sebagai pengayaan, bukan peraturan resmi jenjang pendidikan.

## Privasi dan batasan

Aplikasi tidak meminta nama, NIM, alamat surel, pekerjaan, ataupun informasi pribadi. Data 32 judul disediakan oleh pengampu dan tidak memuat nama penulis; sejumlah judul mengandung nama institusi/organisasi sebagai bagian dari judulnya.

Laboratorium gap diproses sepenuhnya di browser; ketika pengguna menutup halaman, tidak ada data yang disimpan oleh aplikasi. Perlu dicatat, platform hosting atau browser dapat tetap memiliki log akses standar yang berada di luar kode aplikasi ini.

## Pengujian

- `node --check data.js`
- `node --check app.js`
- `python tests/check_content.py`
- Pengujian visual/interaksi menggunakan Chromium bila tersedia.

## Isi perkuliahan yang disarankan (±100 menit)

1. Pengantar problem, gap, novelty, dan kontribusi ilmiah (15 menit).
2. Insight distribusi 32 judul dan refleksi implementasi vs penelitian (15 menit).
3. Perbandingan S1–S2–S3 (20 menit).
4. Studi kasus transformasi topik (25 menit).
5. Latihan membangun kerangka gap dan rancangan validasi (20 menit).
6. Refleksi serta simpulan kelas (5 menit).

Proyek ini dapat digunakan untuk bahan ajar publik pada pertemuan pertama tanpa mengumpulkan data mahasiswa.
