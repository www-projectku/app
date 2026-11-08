import { TableDefinition, ErdRelation, PrebuiltQuery, ProductItem, StockTransactionRecord, StockOpnameItem } from '../types/database';

export const INVENTORY_TABLES: TableDefinition[] = [
  {
    id: 'products',
    name: 'products',
    displayName: 'Master Barang (Products / Items)',
    description: 'Menyimpan identitas barang, kode unik SKU/Barcode, satuan, batas minimum stok, posisi rak, serta saldo stok saat ini.',
    category: 'inventory',
    badgeColor: 'blue',
    sampleRowsCount: 6,
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT)', keyType: 'PK', nullable: false, defaultValue: 'Generated', description: 'Kunci primer identifikasi unik barang' },
      { name: 'sku_code', type: 'VARCHAR(50)', keyType: 'UNIQUE', nullable: false, description: 'Kode unik barang / SKU (cth: BRG-ATK-001)' },
      { name: 'barcode', type: 'VARCHAR(80)', keyType: 'UNIQUE', nullable: true, description: 'Kode barcode scanner (EAN-13 / Code-128)' },
      { name: 'name', type: 'VARCHAR(150)', keyType: 'NONE', nullable: false, description: 'Nama lengkap item barang' },
      { name: 'category_id', type: 'INT', keyType: 'FK', nullable: false, references: { table: 'product_categories', column: 'id' }, description: 'Kategori barang (Relasi FK)' },
      { name: 'unit', type: 'VARCHAR(20)', keyType: 'NONE', nullable: false, defaultValue: "'pcs'", description: 'Satuan hitung (pcs, box, rim, kg, unit, pack)' },
      { name: 'min_stock', type: 'INT', keyType: 'NONE', nullable: false, defaultValue: '5', description: 'Batas peringatan stok minimum (Reorder Point)' },
      { name: 'current_stock', type: 'INT', keyType: 'INDEX', nullable: false, defaultValue: '0', description: 'Saldo kuantitas fisik stok saat ini di sistem' },
      { name: 'purchase_price', type: 'DECIMAL(12,2)', keyType: 'NONE', nullable: false, defaultValue: '0.00', description: 'Harga beli rata-rata atau HPP (IDR)' },
      { name: 'location_rack', type: 'VARCHAR(50)', keyType: 'NONE', nullable: true, description: 'Lokasi rak / blok gudang (cth: Rak-A1-02)' },
      { name: 'is_active', type: 'BOOLEAN', keyType: 'INDEX', nullable: false, defaultValue: 'TRUE', description: 'Status keaktifan barang di gudang' },
      { name: 'updated_at', type: 'TIMESTAMP', keyType: 'NONE', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu pergerakan stok terakhir' },
    ],
  },
  {
    id: 'product_categories',
    name: 'product_categories',
    displayName: 'Kategori Barang (Product Categories)',
    description: 'Klasifikasi barang untuk mempermudah audit fisik dan pengelompokan laporan pergudangan.',
    category: 'catalog',
    badgeColor: 'emerald',
    sampleRowsCount: 4,
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT)', keyType: 'PK', nullable: false, defaultValue: 'Generated', description: 'Kunci primer kategori' },
      { name: 'code', type: 'VARCHAR(20)', keyType: 'UNIQUE', nullable: false, description: 'Kode singkatan (cth: ATK, ELK, SPR)' },
      { name: 'name', type: 'VARCHAR(100)', keyType: 'UNIQUE', nullable: false, description: 'Nama kategori (Alat Tulis Kantor, Elektronik, dll)' },
      { name: 'description', type: 'VARCHAR(255)', keyType: 'NONE', nullable: true, description: 'Keterangan kategori' },
    ],
  },
  {
    id: 'partners',
    name: 'partners',
    displayName: 'Rekanan: Supplier & Customer / Divisi',
    description: 'Pihak pengirim (supplier/vendor saat barang masuk) atau penerima (customer/departemen kantor saat barang keluar).',
    category: 'core',
    badgeColor: 'amber',
    sampleRowsCount: 4,
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT)', keyType: 'PK', nullable: false, defaultValue: 'Generated', description: 'Kunci primer rekanan' },
      { name: 'name', type: 'VARCHAR(150)', keyType: 'NONE', nullable: false, description: 'Nama PT, Toko, Supplier, atau Divisi Pemohon' },
      { name: 'type', type: "ENUM('supplier', 'customer', 'internal_dept')", keyType: 'INDEX', nullable: false, description: 'Jenis relasi rekanan' },
      { name: 'phone', type: 'VARCHAR(30)', keyType: 'NONE', nullable: true, description: 'Nomor kontak / WhatsApp' },
      { name: 'address', type: 'TEXT', keyType: 'NONE', nullable: true, description: 'Alamat kantor atau lokasi kirim' },
    ],
  },
  {
    id: 'stock_transactions',
    name: 'stock_transactions',
    displayName: 'Transaksi Mutasi: Barang Masuk & Keluar',
    description: 'Header bukti dokumen mutasi inventaris (Surat Jalan Masuk / Surat Perintah Keluar Barang).',
    category: 'inventory',
    badgeColor: 'violet',
    sampleRowsCount: 5,
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT)', keyType: 'PK', nullable: false, defaultValue: 'Generated', description: 'Kunci primer unik transaksi' },
      { name: 'trx_number', type: 'VARCHAR(60)', keyType: 'UNIQUE', nullable: false, description: 'Nomor nota resmi (cth: TRX-IN-2026-001, TRX-OUT-2026-002)' },
      { name: 'type', type: "ENUM('IN', 'OUT')", keyType: 'INDEX', nullable: false, description: 'Arah mutasi: IN (Barang Masuk) atau OUT (Barang Keluar)' },
      { name: 'reference_type', type: "ENUM('pembelian_supplier', 'penjualan', 'pemakaian_internal', 'retur_supplier', 'penyesuaian_opname')", keyType: 'NONE', nullable: false, description: 'Alasan mutasi barang' },
      { name: 'partner_id', type: 'INT', keyType: 'FK', nullable: true, references: { table: 'partners', column: 'id' }, description: 'Supplier (jika IN) atau Customer/Divisi (jika OUT)' },
      { name: 'transaction_date', type: 'DATE', keyType: 'INDEX', nullable: false, description: 'Tanggal fisik barang masuk/keluar' },
      { name: 'notes', type: 'TEXT', keyType: 'NONE', nullable: true, description: 'Keterangan surat jalan / nomor DO / nomor PO' },
      { name: 'created_by', type: 'INT', keyType: 'FK', nullable: false, references: { table: 'admin_users', column: 'id' }, description: 'Petugas gudang pembuat transaksi' },
      { name: 'created_at', type: 'TIMESTAMP', keyType: 'NONE', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu input data di sistem' },
    ],
  },
  {
    id: 'stock_transaction_items',
    name: 'stock_transaction_items',
    displayName: 'Detail Item Mutasi Barang (Multi-Item)',
    description: 'Rincian setiap item barang yang masuk atau keluar dalam satu nomor transaksi (Normalisasi 3NF).',
    category: 'inventory',
    badgeColor: 'violet',
    sampleRowsCount: 8,
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT)', keyType: 'PK', nullable: false, defaultValue: 'Generated', description: 'Kunci primer item transaksi' },
      { name: 'transaction_id', type: 'INT', keyType: 'FK', nullable: false, references: { table: 'stock_transactions', column: 'id' }, description: 'Relasi ke header nota transaksi (CASCADE ON DELETE)' },
      { name: 'product_id', type: 'INT', keyType: 'FK', nullable: false, references: { table: 'products', column: 'id' }, description: 'Barang yang dimutasi' },
      { name: 'quantity', type: 'INT', keyType: 'NONE', nullable: false, description: 'Jumlah kuantitas barang masuk/keluar (harus > 0)' },
      { name: 'unit_price', type: 'DECIMAL(12,2)', keyType: 'NONE', nullable: true, defaultValue: '0.00', description: 'Harga per satuan pada saat transaksi terjadi' },
      { name: 'subtotal', type: 'DECIMAL(12,2)', keyType: 'NONE', nullable: true, defaultValue: '0.00', description: 'Perkalian quantity * unit_price' },
    ],
  },
  {
    id: 'stock_opnames',
    name: 'stock_opnames',
    displayName: 'Header Sesi Stock Opname (Physical Audit)',
    description: 'Pencatatan sesi audit perhitungan fisik gudang berkala (harian, mingguan, atau bulanan).',
    category: 'audit',
    badgeColor: 'rose',
    sampleRowsCount: 2,
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT)', keyType: 'PK', nullable: false, defaultValue: 'Generated', description: 'Kunci primer sesi opname' },
      { name: 'opname_number', type: 'VARCHAR(60)', keyType: 'UNIQUE', nullable: false, description: 'Kode sesi opname (cth: OPN-2026-11-01)' },
      { name: 'opname_date', type: 'DATE', keyType: 'INDEX', nullable: false, description: 'Tanggal pelaksanaan audit fisik' },
      { name: 'status', type: "ENUM('draft', 'in_progress', 'completed', 'approved')", keyType: 'INDEX', nullable: false, defaultValue: "'draft'", description: 'Status alur persetujuan audit' },
      { name: 'notes', type: 'TEXT', keyType: 'NONE', nullable: true, description: 'Catatan tim pemeriksa / area gudang yang diaudit' },
      { name: 'auditor_id', type: 'INT', keyType: 'FK', nullable: false, references: { table: 'admin_users', column: 'id' }, description: 'Petugas yang melakukan penghitungan fisik' },
      { name: 'approved_by', type: 'INT', keyType: 'FK', nullable: true, references: { table: 'admin_users', column: 'id' }, description: 'Manajer gudang yang menyetujui penyesuaian' },
      { name: 'created_at', type: 'TIMESTAMP', keyType: 'NONE', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu sesi dibuat' },
    ],
  },
  {
    id: 'stock_opname_details',
    name: 'stock_opname_details',
    displayName: 'Rincian Selisih Stock Opname (Discrepancy)',
    description: 'Pusat perbandingan antara stok buku sistem dengan stok riil fisik, kalkulasi selisih (Varian), dan alasan deviasi.',
    category: 'audit',
    badgeColor: 'rose',
    sampleRowsCount: 6,
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT)', keyType: 'PK', nullable: false, defaultValue: 'Generated', description: 'Kunci primer baris audit' },
      { name: 'opname_id', type: 'INT', keyType: 'FK', nullable: false, references: { table: 'stock_opnames', column: 'id' }, description: 'Relasi ke sesi opname induk' },
      { name: 'product_id', type: 'INT', keyType: 'FK', nullable: false, references: { table: 'products', column: 'id' }, description: 'Barang yang diaudit fisiknya' },
      { name: 'system_stock', type: 'INT', keyType: 'NONE', nullable: false, description: 'Stok menurut catatan komputer saat audit dimulai' },
      { name: 'physical_stock', type: 'INT', keyType: 'NONE', nullable: false, description: 'Hasil hitung nyata fisik di rak gudang' },
      { name: 'difference', type: 'INT', keyType: 'INDEX', nullable: false, description: 'Rumus: physical_stock - system_stock (Minus = Hilang/Kurang, Plus = Lebih)' },
      { name: 'discrepancy_reason', type: "ENUM('sesuai', 'rusak', 'hilang', 'salah_hitung', 'belum_tercatat_keluar', 'kadaluwarsa')", keyType: 'NONE', nullable: false, defaultValue: "'sesuai'", description: 'Penyebab terjadinya perbedaan' },
      { name: 'adjustment_action', type: "ENUM('pending', 'adjusted_to_inventory', 'rejected')", keyType: 'NONE', nullable: false, defaultValue: "'pending'", description: 'Tindakan penyesuaian stok master' },
    ],
  },
  {
    id: 'stock_cards',
    name: 'stock_cards',
    displayName: 'Buku Kartu Stok (Stock Ledger / Audit Trail)',
    description: 'Riwayat mutasi kronologis per barang untuk melacak saldo awal, masuk, keluar, dan saldo akhir setiap detik.',
    category: 'inventory',
    badgeColor: 'cyan',
    sampleRowsCount: 6,
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT)', keyType: 'PK', nullable: false, defaultValue: 'Generated', description: 'Kunci primer baris ledger' },
      { name: 'product_id', type: 'INT', keyType: 'FK', nullable: false, references: { table: 'products', column: 'id' }, description: 'Barang terkait' },
      { name: 'reference_number', type: 'VARCHAR(60)', keyType: 'NONE', nullable: false, description: 'No TRX Masuk/Keluar atau No Opname' },
      { name: 'qty_in', type: 'INT', keyType: 'NONE', nullable: false, defaultValue: '0', description: 'Kuantitas bertambah (jika Masuk)' },
      { name: 'qty_out', type: 'INT', keyType: 'NONE', nullable: false, defaultValue: '0', description: 'Kuantitas berkurang (jika Keluar)' },
      { name: 'balance_stock', type: 'INT', keyType: 'NONE', nullable: false, description: 'Sisa saldo stok setelah pergerakan ini' },
      { name: 'notes', type: 'VARCHAR(255)', keyType: 'NONE', nullable: true, description: 'Keterangan mutasi' },
      { name: 'logged_at', type: 'TIMESTAMP', keyType: 'INDEX', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu audit trail' },
    ],
  },
];

export const INVENTORY_RELATIONS: ErdRelation[] = [
  {
    id: 'rel_prod_cat',
    fromTable: 'product_categories',
    fromColumn: 'id',
    toTable: 'products',
    toColumn: 'category_id',
    cardinality: '1:N',
    label: '1 Kategori memiliki banyak Produk Barang (1 : N)',
  },
  {
    id: 'rel_trx_partner',
    fromTable: 'partners',
    fromColumn: 'id',
    toTable: 'stock_transactions',
    toColumn: 'partner_id',
    cardinality: '1:N',
    label: '1 Rekanan terkait ke banyak Transaksi Masuk/Keluar (1 : N)',
  },
  {
    id: 'rel_trx_items',
    fromTable: 'stock_transactions',
    fromColumn: 'id',
    toTable: 'stock_transaction_items',
    toColumn: 'transaction_id',
    cardinality: '1:N',
    label: '1 Dokumen Transaksi memiliki banyak Item Rincian (1 : N)',
  },
  {
    id: 'rel_prod_items',
    fromTable: 'products',
    fromColumn: 'id',
    toTable: 'stock_transaction_items',
    toColumn: 'product_id',
    cardinality: '1:N',
    label: '1 Produk dimutasi pada banyak Transaksi (1 : N)',
  },
  {
    id: 'rel_opname_details',
    fromTable: 'stock_opnames',
    fromColumn: 'id',
    toTable: 'stock_opname_details',
    toColumn: 'opname_id',
    cardinality: '1:N',
    label: '1 Sesi Opname memiliki banyak baris Penghitungan Fisik (1 : N)',
  },
  {
    id: 'rel_prod_opname',
    fromTable: 'products',
    fromColumn: 'id',
    toTable: 'stock_opname_details',
    toColumn: 'product_id',
    cardinality: '1:N',
    label: '1 Produk diaudit dalam Rincian Opname (1 : N)',
  },
  {
    id: 'rel_prod_card',
    fromTable: 'products',
    fromColumn: 'id',
    toTable: 'stock_cards',
    toColumn: 'product_id',
    cardinality: '1:N',
    label: '1 Produk memiliki riwayat di Buku Kartu Stok (1 : N)',
  },
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  { id: 1, sku: 'ATK-KRT-001', name: 'Kertas HVS A4 80gr Sinar Dunia', category: 'Alat Tulis Kantor', unit: 'rim', min_stock: 10, current_stock: 45, purchase_price: 52000, location_rack: 'Rak-A1' },
  { id: 2, sku: 'ATK-BLP-002', name: 'Ballpoint Pilot G2 0.5 Black', category: 'Alat Tulis Kantor', unit: 'box', min_stock: 8, current_stock: 6, purchase_price: 185000, location_rack: 'Rak-A2' }, // Kritis! (6 < 8)
  { id: 3, sku: 'ELK-KBL-003', name: 'Kabel UTP Cat6 Belden 305M', category: 'Elektronik & IT', unit: 'roll', min_stock: 2, current_stock: 5, purchase_price: 1750000, location_rack: 'Rak-B1' },
  { id: 4, sku: 'ELK-MOU-004', name: 'Wireless Mouse Logitech M185', category: 'Elektronik & IT', unit: 'unit', min_stock: 5, current_stock: 18, purchase_price: 145000, location_rack: 'Rak-B2' },
  { id: 5, sku: 'LOG-KBN-005', name: 'Lakban Bening Daimaru 2 Inch', category: 'Perlengkapan Packing', unit: 'roll', min_stock: 15, current_stock: 32, purchase_price: 14000, location_rack: 'Rak-C1' },
  { id: 6, sku: 'LOG-KRD-006', name: 'Kardus Box Polos 30x20x15cm', category: 'Perlengkapan Packing', unit: 'pcs', min_stock: 50, current_stock: 42, purchase_price: 4500, location_rack: 'Rak-C2' }, // Kritis! (42 < 50)
];

export const INITIAL_TRANSACTIONS: StockTransactionRecord[] = [
  { id: 1, trx_number: 'TRX-IN-202611-001', type: 'IN', product_id: 1, product_name: 'Kertas HVS A4 80gr Sinar Dunia', quantity: 20, partner_name: 'PT Gramedia Mitra Sarana (Supplier)', notes: 'PO-2026-8891 dari Supplier', date: '2026-11-06' },
  { id: 2, trx_number: 'TRX-OUT-202611-002', type: 'OUT', product_id: 2, product_name: 'Ballpoint Pilot G2 0.5 Black', quantity: 4, partner_name: 'Divisi Keuangan & Akuntansi (Pemohon)', notes: 'Permintaan ATK bulanan divisi', date: '2026-11-06' },
  { id: 3, trx_number: 'TRX-IN-202611-003', type: 'IN', product_id: 4, product_name: 'Wireless Mouse Logitech M185', quantity: 10, partner_name: 'CV Sentra Komputindo (Supplier)', notes: 'Pengadaan laptop baru', date: '2026-11-07' },
  { id: 4, trx_number: 'TRX-OUT-202611-004', type: 'OUT', product_id: 6, product_name: 'Kardus Box Polos 30x20x15cm', quantity: 25, partner_name: 'Divisi Logistik Ekspedisi', notes: 'Packing pengiriman barang cabang', date: '2026-11-07' },
];

export const INITIAL_OPNAME_ITEMS: StockOpnameItem[] = [
  { id: 1, product_id: 1, sku: 'ATK-KRT-001', product_name: 'Kertas HVS A4 80gr Sinar Dunia', system_stock: 45, physical_stock: 45, difference: 0, reason: 'sesuai', status: 'matched' },
  { id: 2, product_id: 2, sku: 'ATK-BLP-002', product_name: 'Ballpoint Pilot G2 0.5 Black', system_stock: 6, physical_stock: 5, difference: -1, reason: 'hilang', status: 'deficit' },
  { id: 3, product_id: 3, sku: 'ELK-KBL-003', product_name: 'Kabel UTP Cat6 Belden 305M', system_stock: 5, physical_stock: 5, difference: 0, reason: 'sesuai', status: 'matched' },
  { id: 4, product_id: 4, sku: 'ELK-MOU-004', product_name: 'Wireless Mouse Logitech M185', system_stock: 18, physical_stock: 19, difference: 1, reason: 'belum_tercatat_keluar', status: 'surplus' },
  { id: 5, product_id: 5, sku: 'LOG-KBN-005', product_name: 'Lakban Bening Daimaru 2 Inch', system_stock: 32, physical_stock: 30, difference: -2, reason: 'rusak', status: 'deficit' },
  { id: 6, product_id: 6, sku: 'LOG-KRD-006', product_name: 'Kardus Box Polos 30x20x15cm', system_stock: 42, physical_stock: 42, difference: 0, reason: 'sesuai', status: 'matched' },
];

export const INVENTORY_MYSQL_DDL = `-- ==========================================================
-- SKEMA DATABASE: STOCK OPNAME & MUTASI BARANG MASUK/KELUAR
-- Dialek: MySQL / MariaDB (Dengan Trigger Otomatis Update Stok)
-- Karakteristik: Integritas Stok Real-Time, Pencegahan Stok Minus
-- ==========================================================

CREATE DATABASE IF NOT EXISTS gudang_stock_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE gudang_stock_db;

-- 1. KATEGORI BARANG
CREATE TABLE IF NOT EXISTS product_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255) NULL
) ENGINE=InnoDB;

-- 2. MASTER BARANG
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sku_code VARCHAR(50) NOT NULL UNIQUE,
  barcode VARCHAR(80) NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  category_id INT NOT NULL,
  unit VARCHAR(20) NOT NULL DEFAULT 'pcs',
  min_stock INT NOT NULL DEFAULT 5,
  current_stock INT NOT NULL DEFAULT 0,
  purchase_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  location_rack VARCHAR(50) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category 
    FOREIGN KEY (category_id) REFERENCES product_categories (id) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_stock_non_negative CHECK (current_stock >= 0)
) ENGINE=InnoDB;

-- 3. REKANAN (SUPPLIER & CUSTOMER / DIVISI)
CREATE TABLE IF NOT EXISTS partners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type ENUM('supplier', 'customer', 'internal_dept') NOT NULL,
  phone VARCHAR(30) NULL,
  address TEXT NULL
) ENGINE=InnoDB;

-- 4. TRANSAKSI INDUK BARANG MASUK & KELUAR
CREATE TABLE IF NOT EXISTS stock_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trx_number VARCHAR(60) NOT NULL UNIQUE,
  type ENUM('IN', 'OUT') NOT NULL,
  reference_type ENUM('pembelian_supplier', 'penjualan', 'pemakaian_internal', 'retur_supplier', 'penyesuaian_opname') NOT NULL,
  partner_id INT NULL,
  transaction_date DATE NOT NULL,
  notes TEXT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_trx_partner 
    FOREIGN KEY (partner_id) REFERENCES partners (id) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_trx_date (transaction_date),
  INDEX idx_trx_type (type)
) ENGINE=InnoDB;

-- 5. DETAIL ITEM TRANSAKSI
CREATE TABLE IF NOT EXISTS stock_transaction_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(12,2) DEFAULT 0.00,
  subtotal DECIMAL(12,2) DEFAULT 0.00,
  CONSTRAINT fk_items_trx 
    FOREIGN KEY (transaction_id) REFERENCES stock_transactions (id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_items_product 
    FOREIGN KEY (product_id) REFERENCES products (id) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_quantity_positive CHECK (quantity > 0)
) ENGINE=InnoDB;

-- 6. HEADER SESI AUDIT STOCK OPNAME
CREATE TABLE IF NOT EXISTS stock_opnames (
  id INT AUTO_INCREMENT PRIMARY KEY,
  opname_number VARCHAR(60) NOT NULL UNIQUE,
  opname_date DATE NOT NULL,
  status ENUM('draft', 'in_progress', 'completed', 'approved') NOT NULL DEFAULT 'draft',
  notes TEXT NULL,
  auditor_id INT NOT NULL,
  approved_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_opname_status (status)
) ENGINE=InnoDB;

-- 7. DETAIL HASIL AUDIT FISIK VS SISTEM (DISCREPANCY)
CREATE TABLE IF NOT EXISTS stock_opname_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  opname_id INT NOT NULL,
  product_id INT NOT NULL,
  system_stock INT NOT NULL,
  physical_stock INT NOT NULL,
  difference INT NOT NULL, -- physical_stock - system_stock
  discrepancy_reason ENUM('sesuai', 'rusak', 'hilang', 'salah_hitung', 'belum_tercatat_keluar', 'kadaluwarsa') NOT NULL DEFAULT 'sesuai',
  adjustment_action ENUM('pending', 'adjusted_to_inventory', 'rejected') NOT NULL DEFAULT 'pending',
  CONSTRAINT fk_opname_parent 
    FOREIGN KEY (opname_id) REFERENCES stock_opnames (id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_opname_product 
    FOREIGN KEY (product_id) REFERENCES products (id) 
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 8. BUKU KARTU STOK (AUDIT TRAIL MUTASI KRONOLOGIS)
CREATE TABLE IF NOT EXISTS stock_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  reference_number VARCHAR(60) NOT NULL,
  qty_in INT NOT NULL DEFAULT 0,
  qty_out INT NOT NULL DEFAULT 0,
  balance_stock INT NOT NULL,
  notes VARCHAR(255) NULL,
  logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_card_product 
    FOREIGN KEY (product_id) REFERENCES products (id) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_card_product (product_id, logged_at)
) ENGINE=InnoDB;

-- ==========================================================
-- TRIGGER OTOMATISASI: AUTO-UPDATE STOK DARI TRANSAKSI
-- ==========================================================

DELIMITER $$

-- Trigger Saat Item Transaksi Diinput
CREATE TRIGGER trg_after_insert_transaction_item
AFTER INSERT ON stock_transaction_items
FOR EACH ROW
BEGIN
  DECLARE v_trx_type VARCHAR(10);
  DECLARE v_ref_no VARCHAR(60);
  DECLARE v_current_balance INT;

  -- Cek tipe transaksi (IN atau OUT)
  SELECT type, trx_number INTO v_trx_type, v_ref_no
  FROM stock_transactions 
  WHERE id = NEW.transaction_id;

  IF v_trx_type = 'IN' THEN
    -- Tambah stok barang masuk
    UPDATE products 
    SET current_stock = current_stock + NEW.quantity 
    WHERE id = NEW.product_id;

    SELECT current_stock INTO v_current_balance FROM products WHERE id = NEW.product_id;

    -- Catat ke Kartu Stok
    INSERT INTO stock_cards (product_id, reference_number, qty_in, qty_out, balance_stock, notes)
    VALUES (NEW.product_id, v_ref_no, NEW.quantity, 0, v_current_balance, 'Barang Masuk');

  ELSEIF v_trx_type = 'OUT' THEN
    -- Cek stok cukup
    SELECT current_stock INTO v_current_balance FROM products WHERE id = NEW.product_id;
    IF v_current_balance < NEW.quantity THEN
      SIGNAL SQLSTATE '45000' 
      SET MESSAGE_TEXT = 'Gagal: Stok fisik tidak mencukupi untuk barang keluar!';
    END IF;

    -- Kurangi stok barang keluar
    UPDATE products 
    SET current_stock = current_stock - NEW.quantity 
    WHERE id = NEW.product_id;

    SELECT current_stock INTO v_current_balance FROM products WHERE id = NEW.product_id;

    -- Catat ke Kartu Stok
    INSERT INTO stock_cards (product_id, reference_number, qty_in, qty_out, balance_stock, notes)
    VALUES (NEW.product_id, v_ref_no, 0, NEW.quantity, v_current_balance, 'Barang Keluar');
  END IF;
END$$

DELIMITER ;
`;

export const INVENTORY_QUERIES: PrebuiltQuery[] = [
  {
    id: 'iq1',
    title: '1. Peringatan Stok Menipis / Kritis (Reorder Alert)',
    description: 'Menampilkan semua barang yang stok fisiknya sudah di bawah atau sama dengan batas minimum agar segera dilakukan pengadaan.',
    targetTable: 'products',
    sql: `SELECT 
  p.sku_code AS sku,
  p.name AS nama_barang,
  c.name AS kategori,
  p.current_stock AS stok_saat_ini,
  p.min_stock AS stok_minimum,
  (p.min_stock - p.current_stock) AS defisit_perlu_order,
  p.location_rack AS lokasi_rak
FROM products p
JOIN product_categories c ON p.category_id = c.id
WHERE p.current_stock <= p.min_stock AND p.is_active = TRUE
ORDER BY (p.current_stock / p.min_stock) ASC;`,
    explanation: 'Query krusial untuk staf pengadaan barang (procurement). Mengidentifikasi produk yang butuh di-restock sebelum terjadi kehabisan stok (stockout).',
  },
  {
    id: 'iq2',
    title: '2. Laporan Hasil Audit Stock Opname (Selisih Varian)',
    description: 'Menganalisis selisih antara stok hitungan fisik nyata di rak gudang vs stok sistem komputer beserta estimasi kerugian nominal.',
    targetTable: 'stock_opname_details',
    sql: `SELECT 
  o.opname_number,
  p.sku_code,
  p.name AS nama_barang,
  d.system_stock AS stok_sistem,
  d.physical_stock AS stok_fisik,
  d.difference AS selisih_qty,
  CASE 
    WHEN d.difference < 0 THEN 'BARANG HILANG / KURANG'
    WHEN d.difference > 0 THEN 'BARANG LEBIH / BELUM DICATAT'
    ELSE 'SESUAI'
  END AS status_audit,
  d.discrepancy_reason AS alasan,
  (d.difference * p.purchase_price) AS dampak_nominal_rp
FROM stock_opname_details d
JOIN stock_opnames o ON d.opname_id = o.id
JOIN products p ON d.product_id = p.id
WHERE d.difference != 0
ORDER BY ABS(d.difference) DESC;`,
    explanation: 'Menghitung akurasi stok (Inventory Accuracy Rate) dan nilai selisih rupiah. Menjadi dasar laporan pertanggungjawaban kepada pimpinan atau dosen penguji.',
  },
  {
    id: 'iq3',
    title: '3. Rekap Arus Mutasi Barang Masuk & Keluar Hari Ini',
    description: 'Ringkasan harian barang masuk dari supplier dan barang keluar ke customer/divisi.',
    targetTable: 'stock_transactions',
    sql: `SELECT 
  t.trx_number,
  t.type AS jenis_mutasi,
  pt.name AS nama_rekanan,
  p.name AS nama_barang,
  i.quantity AS jumlah,
  p.unit AS satuan,
  t.transaction_date AS tanggal,
  t.notes AS keterangan
FROM stock_transactions t
JOIN stock_transaction_items i ON t.id = i.transaction_id
JOIN products p ON i.product_id = p.id
LEFT JOIN partners pt ON t.partner_id = pt.id
WHERE t.transaction_date = CURRENT_DATE()
ORDER BY t.created_at DESC;`,
    explanation: 'Memantau produktivitas operasional gudang per hari secara real-time.',
  },
  {
    id: 'iq4',
    title: '4. Kartu Stok Riwayat Kronologis per Barang (Stock Card)',
    description: 'Melacak seluruh histori pergerakan satu item barang dari awal masuk hingga keluar beserta saldo berjalan.',
    targetTable: 'stock_cards',
    sql: `SELECT 
  c.logged_at AS waktu,
  c.reference_number AS no_dokumen,
  c.qty_in AS masuk,
  c.qty_out AS keluar,
  c.balance_stock AS saldo_akhir,
  c.notes AS keterangan
FROM stock_cards c
WHERE c.product_id = 1
ORDER BY c.id ASC;`,
    explanation: 'Fitur audit trail wajib pada sistem persediaan akuntansi (FIFO/Average). Mencegah manipulasi data stok oleh staf.',
  },
];
