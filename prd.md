
---

# 📄 Product Requirements Document (PRD): ScanApp MVP

**Status**: Draft v1.0
**Penulis**: \[Nama Anda]
**Tanggal**: 27 Oktober 2023
**Stakeholder**: Tim Produk, Tim Engineering
**Target Rilis**: Akhir Q4 2023

---

## 1. Latar Belakang & Visi Produk

### 1.1. Masalah yang Ingin Diselesaikan (Problem Statement)

Di era digital, pengelolaan dokumen fisik seperti kuitansi, catatan, dan tugas masih menjadi tantangan. Proses digitalisasi seringkali merepotkan:

* Scanner flatbed lambat dan tidak portabel.
* Kamera ponsel menghasilkan foto miring, gelap, atau ada bayangan.

**Pelajar dan profesional membutuhkan solusi yang instan, berkualitas tinggi, dan mudah diakses** untuk mengubah dokumen fisik menjadi file digital yang rapi.

### 1.2. Visi Produk

Menjadi aplikasi pemindai dokumen yang **paling sederhana, cepat, dan andal** di perangkat mobile, memungkinkan siapa saja mendigitalkan dokumen dengan sekali sentuh.

### 1.3. Tujuan & Sasaran MVP

* **Validasi kebutuhan inti**: membuktikan adanya permintaan pasar untuk pemindai sederhana dan berkualitas.
* **Membangun fondasi teknis**: arsitektur stabil & skalabel.
* **Kepuasan pengguna awal**: pengalaman mulus, bebas bug, rating target >4.5 bintang.

---

## 2. Target Pengguna & Persona

### 2.1. Target Pasar

* **Pelajar & Mahasiswa** → memindai catatan & tugas.
* **Profesional & Freelancer** → memindai kuitansi, faktur, kontrak.
* **Pengguna Umum** → mendigitalkan dokumen penting (KTP, resep, dsb.).

### 2.2. Persona Pengguna Utama

**Nama**: Maya
**Usia/Peran**: 20 tahun, Mahasiswi
**Kebutuhan**: Memindai tugas tulis tangan menjadi PDF rapi.
**Tantangan**: Kamera ponsel menghasilkan foto buruk, aplikasi lain rumit/mahal.
**Tujuan**: "Saya butuh cara super cepat untuk mengubah lembaran tugas menjadi file PDF yang profesional, langsung dari ponsel saya, tanpa ribet."

---

## 3. Fitur & Persyaratan (User Stories)

| ID     | Prioritas | User Story                                                        | Kriteria Penerimaan (Acceptance Criteria)                                                                          |
| ------ | --------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| US-001 | Wajib     | Sebagai Maya, saya ingin memindai dokumen dengan kamera.          | 1. Kamera dapat dibuka.<br>2. Aplikasi mendeteksi & menyorot tepi kertas.<br>3. Pengguna bisa ambil gambar manual. |
| US-002 | Wajib     | Sebagai Maya, saya ingin gambar dipotong otomatis agar rapi.      | 1. Perspektif otomatis diperbaiki.<br>2. Pengguna dapat menyesuaikan sudut manual.                                 |
| US-003 | Wajib     | Sebagai Maya, saya ingin teks terlihat jelas.                     | 1. Tersedia filter Hitam-Putih, Grayscale, dan Warna Asli.<br>2. Gambar bisa diputar.                              |
| US-004 | Wajib     | Sebagai Maya, saya ingin semua pindaian tersimpan di satu tempat. | 1. Dokumen muncul di galeri utama.<br>2. Galeri menampilkan thumbnail, judul, dan tanggal.<br>3. Urut terbaru.     |
| US-005 | Wajib     | Sebagai Maya, saya ingin berbagi pindaian sebagai PDF.            | 1. Opsi "Bagikan sebagai PDF" tersedia.<br>2. PDF 1 halaman dihasilkan.<br>3. Dialog berbagi OS muncul.            |
| US-006 | Wajib     | Sebagai Maya, saya ingin bisa menghapus pindaian yang salah.      | 1. Opsi hapus dokumen tersedia.<br>2. Konfirmasi sebelum hapus permanen.                                           |

---

## 4. Ruang Lingkup Proyek

### 4.1. In-Scope (MVP)

* Otentikasi anonim (tanpa akun).
* Pemindaian 1 halaman per dokumen.
* Deteksi tepi otomatis + pemotongan manual.
* Filter dasar (B\&W, Grayscale, Warna).
* Rotasi gambar.
* Galeri dokumen sederhana (cloud per pengguna).
* Ekspor & berbagi (PDF & JPG).
* Hapus dokumen.

### 4.2. Out-of-Scope (Tidak termasuk di MVP)

* Pemindaian multi-halaman (batch scanning).
* OCR (Optical Character Recognition).
* Folder & Tag untuk organisasi dokumen.
* Anotasi & tanda tangan digital.
* Sinkronisasi lintas perangkat penuh.
* Mode khusus (KTP, Buku, Papan Tulis).
* Fitur kolaborasi & berbagi folder.

---

## 5. Metrik Keberhasilan (Success Metrics)

* **Adopsi Pengguna**

  * 1.000 unduhan bulan pertama.
  * 200 DAU (Daily Active Users).

* **Keterlibatan (Engagement)**

  * Rata-rata 3 dokumen dipindai per pengguna dalam minggu pertama.
  * Tingkat berbagi >40%.

* **Retensi & Kepuasan**

  * Retensi Hari ke-7 >20%.
  * Rating aplikasi >4.5 bintang di Play Store / App Store.

* **Kinerja Teknis**

  * Crash rate <1% dari total sesi.

---

## 6. Linimasa Rilis (Timeline)

* **Minggu 0**: Setup lingkungan & persiapan.
* **Minggu 1**: UI/UX statis dengan data dummy.
* **Minggu 2**: Implementasi fungsionalitas inti (kamera & editor).
* **Minggu 3**: Integrasi dengan Appwrite (simpan & otentikasi).
* **Minggu 4**: Fitur lengkap (lihat, hapus, bagikan) + polishing.
* **Minggu 5**: Pengujian akhir & persiapan peluncuran.

---

## 7. Pertimbangan Masa Depan (Future Considerations)

Setelah MVP berhasil divalidasi, roadmap fokus pada:

1. **Multi-halaman** → kebutuhan paling umum.
2. **OCR** → pembeda kompetitif utama.
3. **Organisasi Folder/Tag** → membantu mengelola dokumen banyak.

---


