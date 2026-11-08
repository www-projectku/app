import { TableDefinition } from '../types/database';

export interface SembakoProduct {
  id: number;
  kode: string;
  nama: string;
  kategori: string;
  satuan_utama: string; // kg, liter, dus, pcs, karung
  stok_saat_ini: number;
  stok_minimum: number;
  harga_beli_kulakan: number;
  harga_jual_eceran: number;
  tanggal_kadaluwarsa: string;
  lokasi: string;
  status_stok: 'aman' | 'kritis' | 'habis';
}

export interface SembakoAuditDiff {
  kategori: string;
  dihilangkan: string[];
  diubah: string[];
  ditambahkan: string[];
}

export const INITIAL_SEMBAKO_PRODUCTS: SembakoProduct[] = [
  {
    id: 1,
    kode: 'SMB-BRS-01',
    nama: 'Beras Pandan Wangi Super (Sak 25kg)',
    kategori: 'Beras & Biji-bijian',
    satuan_utama: 'karung (25kg)',
    stok_saat_ini: 14,
    stok_minimum: 5,
    harga_beli_kulakan: 345000,
    harga_jual_eceran: 380000,
    tanggal_kadaluwarsa: '2027-05-15',
    lokasi: 'Gudang Belakang - Palet A1',
    status_stok: 'aman',
  },
  {
    id: 2,
    kode: 'SMB-MYK-02',
    nama: 'Minyak Goreng Bimoli Pouch 2 Liter',
    kategori: 'Minyak & Mentega',
    satuan_utama: 'pouch (2L)',
    stok_saat_ini: 4,
    stok_minimum: 12,
    harga_beli_kulakan: 34000,
    harga_jual_eceran: 38500,
    tanggal_kadaluwarsa: '2027-02-10',
    lokasi: 'Rak Display B1',
    status_stok: 'kritis', // Kritis! (4 < 12)
  },
  {
    id: 3,
    kode: 'SMB-GLA-03',
    nama: 'Gula Pasir Kristal Putih GMP (Karung 50kg)',
    kategori: 'Gula & Pemanis',
    satuan_utama: 'karung (50kg)',
    stok_saat_ini: 2,
    stok_minimum: 3,
    harga_beli_kulakan: 780000,
    harga_jual_eceran: 840000,
    tanggal_kadaluwarsa: '2027-11-20',
    lokasi: 'Gudang Belakang - Palet A2',
    status_stok: 'kritis', // Kritis! (2 < 3)
  },
  {
    id: 4,
    kode: 'SMB-MIE-04',
    nama: 'Indomie Goreng Original (Dus isi 40 bks)',
    kategori: 'Makanan Instan',
    satuan_utama: 'dus (40 bks)',
    stok_saat_ini: 28,
    stok_minimum: 10,
    harga_beli_kulakan: 118000,
    harga_jual_eceran: 132000,
    tanggal_kadaluwarsa: '2027-03-01',
    lokasi: 'Rak Tengah C1',
    status_stok: 'aman',
  },
  {
    id: 5,
    kode: 'SMB-TLR-05',
    nama: 'Telur Ayam Ras Segar (Peti Kayu 15kg)',
    kategori: 'Telur & Unggas',
    satuan_utama: 'peti (15kg)',
    stok_saat_ini: 6,
    stok_minimum: 4,
    harga_beli_kulakan: 390000,
    harga_jual_eceran: 435000,
    tanggal_kadaluwarsa: '2026-11-28', // Cepat kadaluwarsa!
    lokasi: 'Area Ventilasi Sejuk',
    status_stok: 'aman',
  },
  {
    id: 6,
    kode: 'SMB-TPG-06',
    nama: 'Tepung Terigu Segitiga Biru 1 Kg',
    kategori: 'Tepung & Olahan',
    satuan_utama: 'pcs (1kg)',
    stok_saat_ini: 0,
    stok_minimum: 15,
    harga_beli_kulakan: 11000,
    harga_jual_eceran: 13000,
    tanggal_kadaluwarsa: '2027-01-15',
    lokasi: 'Rak Display B2',
    status_stok: 'habis', // Habis! (0)
  },
];

export const SEMBAKO_AUDIT_CHECKLIST: SembakoAuditDiff[] = [
  {
    kategori: '1. Nama & Identitas Proyek (Branding / URL)',
    dihilangkan: [
      'Nama URL "Tugas-CP" (CP = Company Profile) yang membuat dosen/penilai bingung karena tidak mencerminkan sistem stok toko sembako.',
      'Slogan korporat atau jasa konsultan agensi.',
    ],
    diubah: [
      'Ganti nama proyek menjadi: "Sistem Informasi Pengelolaan Stok Barang Toko Sembako [Nama Toko]" (cth: "Toko Sembako Berkah Mandiri").',
      'Ubah judul HTML (<title>) dan deskripsi web agar sinkron 100% dengan judul tugas.',
    ],
    ditambahkan: [
      'Identitas Toko Sembako: Alamat ruko/toko, jam operasional, kontak agen sembako, dan nama pemilik toko.',
    ],
  },
  {
    kategori: '2. Struktur Halaman & Antarmuka Pengguna (UI/Frontend)',
    dihilangkan: [
      'Section "Tentang Kami" yang panjang, Visi-Misi korporat, sejarah perusahaan, dan profil direktur.',
      'Section Portofolio karya / Project Showcase yang biasa ada di Tugas-CP.',
      'Section Testimoni Klien bergaya perusahaan jasa.',
      'Formulir kontak umum ("Hubungi Kami" / Kirim pesan ke email kantor).',
    ],
    diubah: [
      'Dari Landing Page Profil Statis diubah menjadi Dashboard Manajemen Toko Sembako.',
      'Tabel katalog layanan diubah menjadi Tabel Master Stok Barang Sembako (Beras, Minyak, Gula, Mie, Telur).',
      'Tombol navigasi diubah: Dashboard Stok, Barang Masuk (Kulakan), Barang Keluar (Penjualan), dan Stock Opname.',
    ],
    ditambahkan: [
      'Widget Indikator Stok Kritis (Badge merah untuk sembako yang tersisa sedikit, cth: Beras sisa 2 karung).',
      'Form Transaksi Barang Masuk (Kulakan dari Agen/Distributor dengan no faktur & harga beli).',
      'Form Transaksi Barang Keluar (Penjualan harian ke pembeli eceran/warung atau susut/rusak).',
      'Lembar Kerja Stock Opname Toko: Menghitung selisih fisik vs catatan buku toko sembako.',
      'Peringatan Kadaluwarsa (Expired Alert): Untuk sembako seperti telur (2 minggu) dan makanan instan.',
    ],
  },
  {
    kategori: '3. Database & Logika Bisnis (Backend & Storage)',
    dihilangkan: [
      'Tabel `companies` (profil perusahaan), `services` (layanan), `testimonials` (ulasan klien), `contact_messages` (buku tamu/pesan).',
    ],
    diubah: [
      'Pola penyimpanan: Dari hardcoded HTML statis menjadi Database Relasional Persisten.',
      'Atribut barang disesuaikan dengan sembako: Satuan beragam (karung, dus, kg, liter, bks), harga beli (kulakan), dan harga jual.',
    ],
    ditambahkan: [
      'Tabel `barang_sembako` (Master data barang)',
      'Tabel `kategori_sembako` (Beras, Minyak, Gula, Tepung, Telur, Mie)',
      'Tabel `agen_distributor` (Supplier grosir kulakan sembako)',
      'Tabel `transaksi_kulakan_masuk` & `detail_kulakan`',
      'Tabel `transaksi_penjualan_keluar` & `detail_penjualan`',
      'Tabel `stock_opname_sembako` (Audit selisih timbangan, barang rusak, atau hilang)',
      'Tabel `kartu_stok_sembako` (Riwayat mutasi saldo berjalan)',
      'Trigger Proteksi Stok Minus: Mencegah kasir menjual minyak/beras jika stok gudang sudah 0.',
    ],
  },
];

export const SEMBAKO_SQL_DDL = `-- ==========================================================
-- SKEMA DATABASE: SISTEM PENGELOLAAN STOK TOKO SEMBAKO
-- Judul Tugas: "Perancangan dan Pengembangan Pengelolaan Stok 
--               Barang pada Toko Sembako Berbasis Web"
-- Dialek: MySQL / MariaDB (XAMPP / phpMyAdmin)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS toko_sembako_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE toko_sembako_db;

-- 1. KATEGORI SEMBAKO
CREATE TABLE IF NOT EXISTS kategori_sembako (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_kategori VARCHAR(80) NOT NULL UNIQUE, -- Beras, Minyak, Gula, Telur, dll
  keterangan VARCHAR(255) NULL
) ENGINE=InnoDB;

-- 2. MASTER BARANG SEMBAKO
CREATE TABLE IF NOT EXISTS barang_sembako (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_barang VARCHAR(50) NOT NULL UNIQUE, -- cth: SMB-BRS-01
  barcode VARCHAR(80) NULL UNIQUE,
  nama_barang VARCHAR(150) NOT NULL,
  kategori_id INT NOT NULL,
  satuan_utama VARCHAR(30) NOT NULL, -- karung, dus, kg, liter, pouch, peti
  stok_saat_ini INT NOT NULL DEFAULT 0,
  stok_minimum INT NOT NULL DEFAULT 5, -- Reorder Point
  harga_beli_kulakan DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  harga_jual_eceran DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  tanggal_kadaluwarsa DATE NULL, -- Penting untuk sembako
  lokasi_rak VARCHAR(60) NULL,
  status_aktif BOOLEAN NOT NULL DEFAULT TRUE,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sembako_kategori 
    FOREIGN KEY (kategori_id) REFERENCES kategori_sembako (id) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_stok_sembako_positif CHECK (stok_saat_ini >= 0)
) ENGINE=InnoDB;

-- 3. DATA DISTRIBUTOR / AGEN GROSIR SEMBAKO
CREATE TABLE IF NOT EXISTS agen_distributor (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_agen VARCHAR(120) NOT NULL,
  nama_sales VARCHAR(100) NULL,
  nomor_telepon VARCHAR(30) NOT NULL,
  alamat TEXT NULL,
  produk_disuplai VARCHAR(255) NULL -- cth: Distributor Minyak, Agen Telur, Bulog
) ENGINE=InnoDB;

-- 4. TRANSAKSI BARANG MASUK (KULAKAN DARI AGEN)
CREATE TABLE IF NOT EXISTS kulakan_masuk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  no_faktur_kulakan VARCHAR(60) NOT NULL UNIQUE,
  agen_id INT NOT NULL,
  tanggal_masuk DATE NOT NULL,
  total_bayar DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  keterangan TEXT NULL,
  petugas_input VARCHAR(50) NOT NULL,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_kulakan_agen 
    FOREIGN KEY (agen_id) REFERENCES agen_distributor (id) 
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5. DETAIL BARANG KULAKAN (MULTI-ITEM)
CREATE TABLE IF NOT EXISTS detail_kulakan_masuk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kulakan_id INT NOT NULL,
  barang_id INT NOT NULL,
  jumlah_masuk INT NOT NULL,
  harga_kulakan_per_unit DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_detail_kulakan_parent 
    FOREIGN KEY (kulakan_id) REFERENCES kulakan_masuk (id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_detail_kulakan_barang 
    FOREIGN KEY (barang_id) REFERENCES barang_sembako (id) 
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. TRANSAKSI BARANG KELUAR (PENJUALAN / BARANG RUSAK)
CREATE TABLE IF NOT EXISTS pengeluaran_keluar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  no_transaksi VARCHAR(60) NOT NULL UNIQUE,
  tanggal_keluar DATE NOT NULL,
  tipe_keluar ENUM('penjualan_toko', 'barang_rusak_pecah', 'pemakaian_sendiri', 'retur_ke_agen') NOT NULL DEFAULT 'penjualan_toko',
  catatan TEXT NULL,
  petugas VARCHAR(50) NOT NULL,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. DETAIL BARANG KELUAR
CREATE TABLE IF NOT EXISTS detail_pengeluaran_keluar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pengeluaran_id INT NOT NULL,
  barang_id INT NOT NULL,
  jumlah_keluar INT NOT NULL,
  harga_jual_satuan DECIMAL(12,2) NULL,
  CONSTRAINT fk_detail_keluar_parent 
    FOREIGN KEY (pengeluaran_id) REFERENCES pengeluaran_keluar (id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_detail_keluar_barang 
    FOREIGN KEY (barang_id) REFERENCES barang_sembako (id) 
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 8. SESI STOCK OPNAME TOKO SEMBAKO
CREATE TABLE IF NOT EXISTS stock_opname_sembako (
  id INT AUTO_INCREMENT PRIMARY KEY,
  no_opname VARCHAR(60) NOT NULL UNIQUE,
  tanggal_opname DATE NOT NULL,
  status_audit ENUM('draft', 'selesai_diverifikasi') NOT NULL DEFAULT 'draft',
  catatan_opname TEXT NULL,
  nama_pemeriksa VARCHAR(80) NOT NULL,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 9. RINCIAN PERHITUNGAN FISIK STOCK OPNAME SEMBAKO
CREATE TABLE IF NOT EXISTS rincian_stock_opname_sembako (
  id INT AUTO_INCREMENT PRIMARY KEY,
  opname_id INT NOT NULL,
  barang_id INT NOT NULL,
  stok_catatan_sistem INT NOT NULL,
  stok_hitung_fisik_toko INT NOT NULL,
  selisih INT NOT NULL, -- fisik - sistem
  penyebab_selisih ENUM('sesuai', 'karung_bocor_susut', 'telur_pecah', 'kadaluwarsa', 'hilang_tidak_tercatat') NOT NULL DEFAULT 'sesuai',
  status_penyesuaian ENUM('menunggu', 'sudah_disesuaikan') NOT NULL DEFAULT 'menunggu',
  CONSTRAINT fk_opname_sembako_parent 
    FOREIGN KEY (opname_id) REFERENCES stock_opname_sembako (id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_opname_sembako_barang 
    FOREIGN KEY (barang_id) REFERENCES barang_sembako (id) 
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 10. BUKU KARTU STOK SEMBAKO (MUTASI KRONOLOGIS)
CREATE TABLE IF NOT EXISTS kartu_stok_sembako (
  id INT AUTO_INCREMENT PRIMARY KEY,
  barang_id INT NOT NULL,
  no_referensi VARCHAR(60) NOT NULL,
  masuk INT NOT NULL DEFAULT 0,
  keluar INT NOT NULL DEFAULT 0,
  saldo_akhir INT NOT NULL,
  keterangan VARCHAR(255) NULL,
  waktu_pencatatan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_kartu_sembako_barang 
    FOREIGN KEY (barang_id) REFERENCES barang_sembako (id) 
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;
`;
