export type UserRole = 'admin' | 'petugas';

export interface UserSession {
  id: number;
  nama: string;
  email: string;
  role: UserRole;
  jabatan: string;
  telepon: string;
  avatar: string;
  loginTime: string;
}

export interface RolePermissionMatrix {
  featureId: string;
  featureName: string;
  category: 'Katalog' | 'Transaksi' | 'Audit' | 'Keuangan' | 'Pengaturan';
  adminAccess: boolean;
  petugasAccess: boolean;
  petugasNotes: string;
}

export const ROLE_PERMISSIONS: RolePermissionMatrix[] = [
  {
    featureId: 'view_stock',
    featureName: 'Melihat Katalog & Saldo Stok Barang',
    category: 'Katalog',
    adminAccess: true,
    petugasAccess: true,
    petugasNotes: 'Dapat melihat sisa stok rak, satuan, dan lokasi penyimpanan barang.',
  },
  {
    featureId: 'edit_master_products',
    featureName: 'Menambah & Mengubah Data Master Komoditas',
    category: 'Katalog',
    adminAccess: true,
    petugasAccess: false,
    petugasNotes: 'Terkunci. Hanya Admin yang berwenang menambah SKU baru & ubah batas minimum.',
  },
  {
    featureId: 'view_financial_hpp',
    featureName: 'Melihat Harga Modal Kulakan (HPP) & Margin Laba',
    category: 'Keuangan',
    adminAccess: true,
    petugasAccess: false,
    petugasNotes: 'Disembunyikan demi privasi keuangan & margin keuntungan pemilik toko.',
  },
  {
    featureId: 'delete_products',
    featureName: 'Menghapus Komoditas Sembako dari Sistem',
    category: 'Katalog',
    adminAccess: true,
    petugasAccess: false,
    petugasNotes: 'Dilarang keras untuk mencegah kehilangan jejak histori transaksi.',
  },
  {
    featureId: 'trx_kulakan',
    featureName: 'Pencatatan Barang Masuk (+Kulakan Supplier)',
    category: 'Transaksi',
    adminAccess: true,
    petugasAccess: true,
    petugasNotes: 'Petugas gudang mencatat penerimaan barang fisik dari truk distributor.',
  },
  {
    featureId: 'opname_discrepancy_logging',
    featureName: 'Pencatatan Deviasi Selisih (Karung Bocor, Telur Pecah)',
    category: 'Audit',
    adminAccess: true,
    petugasAccess: true,
    petugasNotes: 'Petugas auditor mendata komoditas rusak, susut timbangan, atau kadaluwarsa.',
  },
  {
    featureId: 'opname_input',
    featureName: 'Input Hasil Hitung Fisik Stock Opname',
    category: 'Audit',
    adminAccess: true,
    petugasAccess: true,
    petugasNotes: 'Petugas gudang menghitung karung/dus fisik di rak dan menginput jumlah aktual.',
  },
  {
    featureId: 'opname_approval',
    featureName: 'Otorisasi & Sinkronisasi Selisih Stock Opname (Adjustment)',
    category: 'Audit',
    adminAccess: true,
    petugasAccess: false,
    petugasNotes: 'Terkunci! Hanya Admin yang berhak menyetujui penghapusan selisih kerugian barang.',
  },
  {
    featureId: 'view_kartu_stok',
    featureName: 'Melihat Buku Kartu Stok (Ledger Mutasi)',
    category: 'Audit',
    adminAccess: true,
    petugasAccess: true,
    petugasNotes: 'Dapat melihat riwayat mutasi masuk/keluar untuk pelacakan komoditas.',
  },
  {
    featureId: 'manage_distributors',
    featureName: 'Kelola Agen & Distributor (BULOG, Indofood, dll)',
    category: 'Pengaturan',
    adminAccess: true,
    petugasAccess: false,
    petugasNotes: 'Hanya Admin yang berwenang mengatur kontrak agen & batas tempo pembayaran.',
  },
  {
    featureId: 'financial_reports',
    featureName: 'Laporan Nilai Total Aset Persediaan Toko',
    category: 'Keuangan',
    adminAccess: true,
    petugasAccess: false,
    petugasNotes: 'Hanya Admin yang berhak melihat total modal berjalan dan valuasi stok toko.',
  },
  {
    featureId: 'system_sql_ddl',
    featureName: 'Akses Skema Relasional SQL DDL & Audit Akademis',
    category: 'Pengaturan',
    adminAccess: true,
    petugasAccess: false,
    petugasNotes: 'Khusus Admin / Developer untuk keperluan administrasi dan laporan tugas.',
  },
];

export const DEMO_USERS: Record<UserRole, UserSession> = {
  admin: {
    id: 1,
    nama: 'H. Ridwan Supriyadi',
    email: 'admin@sembakoberkah.com',
    role: 'admin',
    jabatan: 'Pemilik Toko / Super Admin',
    telepon: '0812-3456-7890',
    avatar: '👨‍💼',
    loginTime: 'Hari ini, 08:00 WIB',
  },
  petugas: {
    id: 2,
    nama: 'Siti Fatimah Azzahra',
    email: 'petugas@sembakoberkah.com',
    role: 'petugas',
    jabatan: 'Petugas Auditor Fisik Lapangan',
    telepon: '0857-9876-5432',
    avatar: '👩‍💼',
    loginTime: 'Hari ini, 08:15 WIB',
  },
};
