export interface SembakoItem {
  id: number;
  kode: string;
  barcode: string;
  nama: string;
  kategori: string;
  satuan: string; // karung 25kg, dus 40 bks, pouch 2L, peti 15kg, kg, bks
  stok_saat_ini: number;
  stok_minimum: number;
  harga_beli: number; // HPP Kulakan
  harga_jual: number; // Harga Jual Eceran
  tgl_kadaluwarsa: string;
  lokasi_rak: string;
  supplier_utama: string;
}

export interface DistributorAgen {
  id: number;
  kode: string;
  nama: string;
  kontak_sales: string;
  telepon: string;
  alamat: string;
  komoditas_suplai: string;
}

export interface TransaksiKulakan {
  id: number;
  no_faktur: string;
  agen_id: number;
  nama_agen: string;
  tgl_masuk: string;
  total_bayar: number;
  keterangan: string;
  items: {
    barang_id: number;
    nama_barang: string;
    jumlah: number;
    satuan: string;
    harga_kulakan: number;
    subtotal: number;
  }[];
}

export interface TransaksiPengeluaran {
  id: number;
  no_transaksi: string;
  tgl_keluar: string;
  tipe: 'penjualan_eceran' | 'penjualan_grosir' | 'barang_rusak_pecah' | 'pemakaian_toko';
  total_nilai: number;
  keterangan: string;
  items: {
    barang_id: number;
    nama_barang: string;
    jumlah: number;
    satuan: string;
    harga_jual: number;
    subtotal: number;
  }[];
}

export interface OpnameSesi {
  id: number;
  no_opname: string;
  tgl_opname: string;
  status: 'draft' | 'selesai_diverifikasi';
  petugas: string;
  catatan: string;
  details: {
    barang_id: number;
    nama_barang: string;
    kode: string;
    satuan: string;
    stok_sistem: number;
    stok_fisik: number;
    selisih: number;
    penyebab: 'sesuai' | 'karung_bocor_susut' | 'telur_pecah' | 'kadaluwarsa' | 'hilang_tidak_tercatat';
    dampak_rp: number;
  }[];
}

export interface KartuStokEntry {
  id: number;
  barang_id: number;
  nama_barang: string;
  tgl: string;
  no_dokumen: string;
  keterangan: string;
  masuk: number;
  keluar: number;
  saldo_akhir: number;
}

export const INITIAL_SEMBAKO_ITEMS: SembakoItem[] = [
  {
    id: 1,
    kode: 'SMB-BRS-001',
    barcode: '899123456001',
    nama: 'Beras Pandan Wangi Super (Sak 25kg)',
    kategori: 'Beras & Biji-bijian',
    satuan: 'karung (25kg)',
    stok_saat_ini: 18,
    stok_minimum: 6,
    harga_beli: 345000,
    harga_jual: 380000,
    tgl_kadaluwarsa: '2027-06-30',
    lokasi_rak: 'Gudang Utama Palet A1',
    supplier_utama: 'Perum BULOG Divre Regional',
  },
  {
    id: 2,
    kode: 'SMB-BRS-002',
    barcode: '899123456002',
    nama: 'Beras Setra Ramos IR 64 (Sak 10kg)',
    kategori: 'Beras & Biji-bijian',
    satuan: 'karung (10kg)',
    stok_saat_ini: 8,
    stok_minimum: 10, // Kritis! (8 < 10)
    harga_beli: 138000,
    harga_jual: 152000,
    tgl_kadaluwarsa: '2027-05-15',
    lokasi_rak: 'Gudang Utama Palet A2',
    supplier_utama: 'Perum BULOG Divre Regional',
  },
  {
    id: 3,
    kode: 'SMB-MYK-003',
    barcode: '899123456003',
    nama: 'Minyak Goreng Bimoli Pouch 2 Liter',
    kategori: 'Minyak & Margarin',
    satuan: 'pouch (2L)',
    stok_saat_ini: 5,
    stok_minimum: 15, // Kritis! (5 < 15)
    harga_beli: 34000,
    harga_jual: 38500,
    tgl_kadaluwarsa: '2027-04-10',
    lokasi_rak: 'Rak Display B1',
    supplier_utama: 'PT Salim Ivomas Pratama',
  },
  {
    id: 4,
    kode: 'SMB-MYK-004',
    barcode: '899123456004',
    nama: 'Minyakita Subsidi Pemerintah Pouch 1 Liter',
    kategori: 'Minyak & Margarin',
    satuan: 'pouch (1L)',
    stok_saat_ini: 24,
    stok_minimum: 20,
    harga_beli: 14000,
    harga_jual: 15500,
    tgl_kadaluwarsa: '2027-03-20',
    lokasi_rak: 'Rak Display B2',
    supplier_utama: 'PT Salim Ivomas Pratama',
  },
  {
    id: 5,
    kode: 'SMB-GLA-005',
    barcode: '899123456005',
    nama: 'Gula Pasir Kristal Putih GMP (Karung 50kg)',
    kategori: 'Gula & Pemanis',
    satuan: 'karung (50kg)',
    stok_saat_ini: 3,
    stok_minimum: 4, // Kritis! (3 < 4)
    harga_beli: 780000,
    harga_jual: 840000,
    tgl_kadaluwarsa: '2027-11-30',
    lokasi_rak: 'Gudang Palet A3',
    supplier_utama: 'CV Berkah Manis Nusantara',
  },
  {
    id: 6,
    kode: 'SMB-GLA-006',
    barcode: '899123456006',
    nama: 'Gula Pasir Gulaku Kemasan Kuning 1kg',
    kategori: 'Gula & Pemanis',
    satuan: 'bks (1kg)',
    stok_saat_ini: 32,
    stok_minimum: 15,
    harga_beli: 16500,
    harga_jual: 18500,
    tgl_kadaluwarsa: '2027-09-15',
    lokasi_rak: 'Rak Tengah C1',
    supplier_utama: 'CV Berkah Manis Nusantara',
  },
  {
    id: 7,
    kode: 'SMB-TLR-007',
    barcode: '899123456007',
    nama: 'Telur Ayam Ras Segar (Peti Kayu 15kg)',
    kategori: 'Telur & Ternak',
    satuan: 'peti (15kg)',
    stok_saat_ini: 7,
    stok_minimum: 5,
    harga_beli: 390000,
    harga_jual: 435000,
    tgl_kadaluwarsa: '2026-11-26', // Mendekati Expired! (19 hari)
    lokasi_rak: 'Area Ventilasi Sejuk T1',
    supplier_utama: 'Peternakan Unggas Sejahtera Blitar',
  },
  {
    id: 8,
    kode: 'SMB-TPG-008',
    barcode: '899123456008',
    nama: 'Tepung Terigu Segitiga Biru 1 Kg',
    kategori: 'Tepung & Olahan',
    satuan: 'bks (1kg)',
    stok_saat_ini: 0, // Habis! (0)
    stok_minimum: 20,
    harga_beli: 11000,
    harga_jual: 13000,
    tgl_kadaluwarsa: '2027-01-20',
    lokasi_rak: 'Rak Tengah C2',
    supplier_utama: 'PT Indofood Sukses Makmur',
  },
  {
    id: 9,
    kode: 'SMB-MIE-009',
    barcode: '899123456009',
    nama: 'Indomie Goreng Original (Dus isi 40 bks)',
    kategori: 'Makanan Instan',
    satuan: 'dus (40 bks)',
    stok_saat_ini: 35,
    stok_minimum: 12,
    harga_beli: 118000,
    harga_jual: 132000,
    tgl_kadaluwarsa: '2027-04-18',
    lokasi_rak: 'Rak Atas D1',
    supplier_utama: 'PT Indofood Sukses Makmur',
  },
  {
    id: 10,
    kode: 'SMB-MIE-010',
    barcode: '899123456010',
    nama: 'Mie Sedaap Soto Madura (Dus isi 40 bks)',
    kategori: 'Makanan Instan',
    satuan: 'dus (40 bks)',
    stok_saat_ini: 14,
    stok_minimum: 10,
    harga_beli: 116000,
    harga_jual: 130000,
    tgl_kadaluwarsa: '2027-03-30',
    lokasi_rak: 'Rak Atas D2',
    supplier_utama: 'PT Wings Surya Distributor',
  },
];

export const INITIAL_DISTRIBUTORS: DistributorAgen[] = [
  {
    id: 1,
    kode: 'AGEN-01',
    nama: 'Perum BULOG Divre Regional',
    kontak_sales: 'Bapak H. Sukardi (Divisi Pangan)',
    telepon: '0812-8899-7711',
    alamat: 'Jl. Pemuda No. 45, Kompleks Pergudangan Bulog',
    komoditas_suplai: 'Beras Premium, Beras Medium, Gula Rafinasi, Minyakita',
  },
  {
    id: 2,
    kode: 'AGEN-02',
    nama: 'PT Salim Ivomas Pratama',
    kontak_sales: 'Ibu Ratna Dewi (Key Account)',
    telepon: '0813-2244-6688',
    alamat: 'Kawasan Industri Rungkut Blok C-12',
    komoditas_suplai: 'Minyak Goreng Bimoli, Delima, Margarin Amanda',
  },
  {
    id: 3,
    kode: 'AGEN-03',
    nama: 'Peternakan Unggas Sejahtera Blitar',
    kontak_sales: 'Pak Suwandi (Juragan Telur)',
    telepon: '0857-9911-3344',
    alamat: 'Desa Ponggok RT 04/RW 02, Blitar',
    komoditas_suplai: 'Telur Ayam Ras Segar Petian (Grade A Super)',
  },
  {
    id: 4,
    kode: 'AGEN-04',
    nama: 'PT Indofood Sukses Makmur (Depo Distribusi)',
    kontak_sales: 'Mas Dimas Aditya',
    telepon: '0821-3344-5566',
    alamat: 'Jl. Raya Cikarang Km. 32',
    komoditas_suplai: 'Indomie, Tepung Terigu Segitiga Biru, Cakra Kembar, Susu Tiga Sapi',
  },
  {
    id: 5,
    kode: 'AGEN-05',
    nama: 'CV Berkah Manis Nusantara',
    kontak_sales: 'Bapak Ahmad Faisal',
    telepon: '0818-0909-1212',
    alamat: 'Pasar Induk Kramat Jati Blok D No. 8',
    komoditas_suplai: 'Gula Pasir GMP Karungan, Gulaku, Gula Merah Aren',
  },
];

export const INITIAL_KULAKAN_HISTORY: TransaksiKulakan[] = [
  {
    id: 1,
    no_faktur: 'FAK-IN-202611-001',
    agen_id: 1,
    nama_agen: 'Perum BULOG Divre Regional',
    tgl_masuk: '2026-11-05',
    total_bayar: 6900000,
    keterangan: 'Kulakan beras awal bulan untuk stok toko',
    items: [
      {
        barang_id: 1,
        nama_barang: 'Beras Pandan Wangi Super (Sak 25kg)',
        jumlah: 20,
        satuan: 'karung (25kg)',
        harga_kulakan: 345000,
        subtotal: 6900000,
      },
    ],
  },
  {
    id: 2,
    no_faktur: 'FAK-IN-202611-002',
    agen_id: 3,
    nama_agen: 'Peternakan Unggas Sejahtera Blitar',
    tgl_masuk: '2026-11-06',
    total_bayar: 3900000,
    keterangan: 'Kiriman telur mingguan grade A',
    items: [
      {
        barang_id: 7,
        nama_barang: 'Telur Ayam Ras Segar (Peti Kayu 15kg)',
        jumlah: 10,
        satuan: 'peti (15kg)',
        harga_kulakan: 390000,
        subtotal: 3900000,
      },
    ],
  },
  {
    id: 3,
    no_faktur: 'FAK-IN-202611-003',
    agen_id: 4,
    nama_agen: 'PT Indofood Sukses Makmur (Depo Distribusi)',
    tgl_masuk: '2026-11-07',
    total_bayar: 3540000,
    keterangan: 'Pasokan Indomie Goreng kartonan',
    items: [
      {
        barang_id: 9,
        nama_barang: 'Indomie Goreng Original (Dus isi 40 bks)',
        jumlah: 30,
        satuan: 'dus (40 bks)',
        harga_kulakan: 118000,
        subtotal: 3540000,
      },
    ],
  },
];

export const INITIAL_PENJUALAN_HISTORY: TransaksiPengeluaran[] = [
  {
    id: 1,
    no_transaksi: 'NOTA-OUT-202611-001',
    tgl_keluar: '2026-11-06',
    tipe: 'penjualan_eceran',
    total_nilai: 760000,
    keterangan: 'Pembelian langganan Warung Bu Siti',
    items: [
      {
        barang_id: 1,
        nama_barang: 'Beras Pandan Wangi Super (Sak 25kg)',
        jumlah: 2,
        satuan: 'karung (25kg)',
        harga_jual: 380000,
        subtotal: 760000,
      },
    ],
  },
  {
    id: 2,
    no_transaksi: 'NOTA-OUT-202611-002',
    tgl_keluar: '2026-11-06',
    tipe: 'barang_rusak_pecah',
    total_nilai: 435000,
    keterangan: '1 peti telur jatuh saat diturunkan dari truk agen',
    items: [
      {
        barang_id: 7,
        nama_barang: 'Telur Ayam Ras Segar (Peti Kayu 15kg)',
        jumlah: 1,
        satuan: 'peti (15kg)',
        harga_jual: 435000,
        subtotal: 435000,
      },
    ],
  },
  {
    id: 3,
    no_transaksi: 'NOTA-OUT-202611-003',
    tgl_keluar: '2026-11-07',
    tipe: 'penjualan_grosir',
    total_nilai: 1305000,
    keterangan: 'Pesanan katering hajatan Bu Darmi',
    items: [
      {
        barang_id: 7,
        nama_barang: 'Telur Ayam Ras Segar (Peti Kayu 15kg)',
        jumlah: 2,
        satuan: 'peti (15kg)',
        harga_jual: 435000,
        subtotal: 870000,
      },
      {
        barang_id: 3,
        nama_barang: 'Minyak Goreng Bimoli Pouch 2 Liter',
        jumlah: 10,
        satuan: 'pouch (2L)',
        harga_jual: 38500,
        subtotal: 385000,
      },
      {
        barang_id: 8,
        nama_barang: 'Tepung Terigu Segitiga Biru 1 Kg',
        jumlah: 5,
        satuan: 'bks (1kg)',
        harga_jual: 13000,
        subtotal: 65000,
      },
    ],
  },
];

export const INITIAL_OPNAME_SESI: OpnameSesi = {
  id: 1,
  no_opname: 'OPN-SMB-202611-01',
  tgl_opname: '2026-11-07',
  status: 'draft',
  petugas: 'Siti Rahmawati (Kepala Toko)',
  catatan: 'Audit fisik mingguan komoditas sembako utama',
  details: [
    {
      barang_id: 1,
      nama_barang: 'Beras Pandan Wangi Super (Sak 25kg)',
      kode: 'SMB-BRS-001',
      satuan: 'karung (25kg)',
      stok_sistem: 18,
      stok_fisik: 18,
      selisih: 0,
      penyebab: 'sesuai',
      dampak_rp: 0,
    },
    {
      barang_id: 3,
      nama_barang: 'Minyak Goreng Bimoli Pouch 2 Liter',
      kode: 'SMB-MYK-003',
      satuan: 'pouch (2L)',
      stok_sistem: 5,
      stok_fisik: 4,
      selisih: -1, // Kurang 1
      penyebab: 'karung_bocor_susut',
      dampak_rp: -34000,
    },
    {
      barang_id: 5,
      nama_barang: 'Gula Pasir Kristal Putih GMP (Karung 50kg)',
      kode: 'SMB-GLA-005',
      satuan: 'karung (50kg)',
      stok_sistem: 3,
      stok_fisik: 3,
      selisih: 0,
      penyebab: 'sesuai',
      dampak_rp: 0,
    },
    {
      barang_id: 7,
      nama_barang: 'Telur Ayam Ras Segar (Peti Kayu 15kg)',
      kode: 'SMB-TLR-007',
      satuan: 'peti (15kg)',
      stok_sistem: 7,
      stok_fisik: 6,
      selisih: -1, // Telur pecah
      penyebab: 'telur_pecah',
      dampak_rp: -390000,
    },
    {
      barang_id: 9,
      nama_barang: 'Indomie Goreng Original (Dus isi 40 bks)',
      kode: 'SMB-MIE-009',
      satuan: 'dus (40 bks)',
      stok_sistem: 35,
      stok_fisik: 35,
      selisih: 0,
      penyebab: 'sesuai',
      dampak_rp: 0,
    },
  ],
};

export const INITIAL_KARTU_STOK: KartuStokEntry[] = [
  { id: 1, barang_id: 1, nama_barang: 'Beras Pandan Wangi (25kg)', tgl: '2026-11-01', no_dokumen: 'SALDO-AWAL', keterangan: 'Saldo Awal Awal Bulan', masuk: 0, keluar: 0, saldo_akhir: 0 },
  { id: 2, barang_id: 1, nama_barang: 'Beras Pandan Wangi (25kg)', tgl: '2026-11-05', no_dokumen: 'FAK-IN-202611-001', keterangan: 'Kulakan dari Perum BULOG', masuk: 20, keluar: 0, saldo_akhir: 20 },
  { id: 3, barang_id: 1, nama_barang: 'Beras Pandan Wangi (25kg)', tgl: '2026-11-06', no_dokumen: 'NOTA-OUT-202611-001', keterangan: 'Penjualan ke Warung Bu Siti', masuk: 0, keluar: 2, saldo_akhir: 18 },
  { id: 4, barang_id: 7, nama_barang: 'Telur Ayam Ras (Peti 15kg)', tgl: '2026-11-06', no_dokumen: 'FAK-IN-202611-002', keterangan: 'Pasokan Peternak Blitar', masuk: 10, keluar: 0, saldo_akhir: 10 },
  { id: 5, barang_id: 7, nama_barang: 'Telur Ayam Ras (Peti 15kg)', tgl: '2026-11-06', no_dokumen: 'NOTA-OUT-202611-002', keterangan: 'Barang pecah saat bongkar muat', masuk: 0, keluar: 1, saldo_akhir: 9 },
  { id: 6, barang_id: 7, nama_barang: 'Telur Ayam Ras (Peti 15kg)', tgl: '2026-11-07', no_dokumen: 'NOTA-OUT-202611-003', keterangan: 'Pesanan Hajatan Bu Darmi', masuk: 0, keluar: 2, saldo_akhir: 7 },
];
