import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  MapPin, 
  Mail, 
  Clock, 
  Lock, 
  UserCheck, 
  Layers, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { SembakoItem } from '../../data/sembakoMasterData';
import { UserSession, UserRole, ROLE_PERMISSIONS } from '../../types/auth';

interface StorefrontViewProps {
  products: SembakoItem[];
  currentUser: UserSession;
  onOpenLogin: () => void;
  onGoToManagement: (tab?: string) => void;
  onSwitchRole: (role: UserRole) => void;
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  products,
  currentUser,
  onOpenLogin,
  onGoToManagement,
  onSwitchRole,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  const categories = [
    { id: 'semua', label: 'Semua Komoditas' },
    { id: 'Beras & Biji-bijian', label: 'Beras & Biji' },
    { id: 'Minyak & Mentega', label: 'Minyak Goreng' },
    { id: 'Gula & Pemanis', label: 'Gula Pasir' },
    { id: 'Telur & Unggas', label: 'Telur Ayam' },
    { id: 'Makanan Instan', label: 'Mie & Makanan' },
    { id: 'Tepung & Olahan', label: 'Tepung Terigu' },
  ];

  const filteredProducts = selectedCategory === 'semua'
    ? products
    : products.filter((p) => p.kategori === selectedCategory);

  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      {/* 1. HERO SECTION (Mirroring the Old Web Header & Hero Style) */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Toko Sembako Berkah Jaya • Sejak 2018</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Pusat Grosir & Eceran Sembako Terlengkap
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Menyediakan pasokan komoditas pokok pangan berkualitas tinggi: Beras Pandan Wangi, Minyak Goreng Kemasan, Gula Kristal, Telur Segar Blitar, dan Tepung Terigu untuk kebutuhan rumah tangga dan ratusan warung mitra.
          </p>

          {/* Call to actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onGoToManagement('products')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2 group"
            >
              <Package className="w-4 h-4" />
              <span>Kelola Stok Barang Sembako</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenLogin}
              className="px-6 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Ganti Akun Login (Admin / Petugas)</span>
            </button>

            <a
              href="#katalog-sembako"
              className="px-5 py-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-all"
            >
              Lihat Katalog Produk ↓
            </a>
          </div>

          {/* Current Auth Status Pill */}
          <div className="pt-4 flex items-center gap-3 flex-wrap text-xs text-slate-400 border-t border-slate-800/80">
            <span>Status Login Saat Ini:</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800">
              <span className="text-base">{currentUser.avatar}</span>
              <strong className="text-white">{currentUser.nama}</strong>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  currentUser.role === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}
              >
                {currentUser.role}
              </span>
            </div>
            <button
              onClick={() => onSwitchRole(currentUser.role === 'admin' ? 'petugas' : 'admin')}
              className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Tukar ke {currentUser.role === 'admin' ? 'Petugas' : 'Admin'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Feature Highlights (Like Old Web Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800/90">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-emerald-400 font-bold text-lg">100% Pasokan Agen</div>
            <div className="text-xs text-slate-400 mt-1">Langsung dari BULOG, Salim Ivomas, & Peternak.</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-amber-400 font-bold text-lg">Anti-Stok Minus</div>
            <div className="text-xs text-slate-400 mt-1">Proteksi kasir mencegah selisih fisik barang.</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-cyan-400 font-bold text-lg">Audit Fisik Berkala</div>
            <div className="text-xs text-slate-400 mt-1">Stock opname mendeteksi telur pecah & karung bocor.</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-rose-400 font-bold text-lg">Hak Akses Berlapis</div>
            <div className="text-xs text-slate-400 mt-1">Pemisahan wewenang Admin dan Petugas kasir.</div>
          </div>
        </div>
      </section>

      {/* 2. TENTANG TOKO & PROFIL PERUSAHAAN (Old Web Company Profile Section) */}
      <section id="tentang-kami" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
            <span>Profil Toko Sembako Berkah Jaya</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Menjaga Ketersediaan Sembako dengan Manajemen Stok Modern
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Toko Sembako Berkah Jaya adalah badan usaha perdagangan kebutuhan pokok yang melayani pelanggan eceran dan warung kelontong mitra di wilayah sekitarnya. Sejak didirikan, kami berkomitmen menjaga kestabilan harga serta jaminan kualitas timbangan dan keaslian produk.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Visi Perusahaan
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Menjadi pusat distribusi sembako rakyat terpercaya dengan transparansi stok dan harga paling kompetitif.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Misi Operasional
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Menerapkan sistem pengelolaan stok berbasis komputer untuk mencegah kekosongan barang dan mengontrol mutasi barang.
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Key Operational Metrics */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              Kapasitas Gudang & Penjualan
            </h3>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
              Operasional Aktif
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400">Total Komoditas Aktif:</span>
              <strong className="text-white text-sm font-bold">{products.length} Komoditas Pokok</strong>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400">Metode Penjualan:</span>
              <strong className="text-emerald-400 text-sm font-bold">Grosir Karungan & Eceran Kiloan</strong>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400">Kontrol Kadaluwarsa:</span>
              <strong className="text-cyan-400 text-sm font-bold">Metode FIFO (First In, First Out)</strong>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400">Waktu Operasional:</span>
              <strong className="text-amber-400 text-sm font-bold">Senin - Minggu (07.00 - 21.00 WIB)</strong>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onGoToManagement('dashboard')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <span>Buka Dashboard Operasional Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. PERBEDAAN FITUR ADMIN VS PETUGAS (Explicitly Requested by User) */}
      <section className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/30 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Otorisasi & Keamanan Sistem Berbasis Peran</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Perbedaan Hak Akses: Administrator vs Petugas Gudang & Kasir
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Sistem memisahkan tugas operasional fisik kasir dari kewenangan strategis dan finansial pemilik toko.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Pilih / Uji Akun Login</span>
            </button>
          </div>
        </div>

        {/* 2 Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PETUGAS CARD */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-cyan-800/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xl">
                  👩‍💼
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Hak Akses PETUGAS AUDITOR</h3>
                  <p className="text-[11px] text-cyan-400">Auditor Fisik Gudang & Pencatat Lapangan</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
                Auditor
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-emerald-400 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Fitur yang BISA diakses:
              </div>
              <ul className="space-y-1.5 text-slate-300 pl-6 list-disc text-[11px]">
                <li>Melihat Saldo Stok dan Lokasi Rak Penyimpanan Sembako</li>
                <li>Mencatat Barang Masuk (+Kulakan dari Agen Distributor)</li>
                <li><strong>Input Hitung Fisik Stock Opname:</strong> Menghitung riil karung, peti, & pouch</li>
                <li>Mencatat Alasan Deviasi (Telur Pecah, Karung Bocor, Susut Timbangan, Expired)</li>
                <li>Melihat Mutasi Harian pada Buku Kartu Stok</li>
              </ul>

              <div className="text-rose-400 font-semibold flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <AlertCircle className="w-4 h-4" /> Fitur yang DILARANG / TERKUNCI:
              </div>
              <ul className="space-y-1 text-slate-400 pl-6 list-disc text-[11px]">
                <li><strong className="text-slate-300">Dilarang</strong> mengubah Harga Beli Modal (HPP) & Margin Laba</li>
                <li><strong className="text-slate-300">Dilarang</strong> menghapus data master barang dari database</li>
                <li><strong className="text-slate-300">Dilarang</strong> menyetujui sinkronisasi saldo opname (Otorisasi BAST)</li>
                <li><strong className="text-slate-300">Dilarang</strong> melihat laporan total nilai aset finansial toko</li>
                <li><strong className="text-slate-300">Dilarang</strong> mengelola data kontrak agen & skrip SQL database</li>
              </ul>
            </div>

            <button
              onClick={() => onSwitchRole('petugas')}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                currentUser.role === 'petugas'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-700/50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{currentUser.role === 'petugas' ? 'Sedang Login sebagai Petugas' : 'Uji Tampilan sebagai Petugas'}</span>
            </button>
          </div>

          {/* ADMIN CARD */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-amber-800/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl">
                  👨‍💼
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Hak Akses ADMINISTRATOR</h3>
                  <p className="text-[11px] text-amber-400">Pemilik Toko / Super Admin / Dosen Penguji</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold uppercase">
                Full Access
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-emerald-400 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Seluruh Hak Istimewa Admin:
              </div>
              <ul className="space-y-1.5 text-slate-300 pl-6 list-disc text-[11px]">
                <li><strong className="text-white">Full CRUD Master Barang:</strong> Tambah barang baru, hapus, & atur stok minimum (ROP)</li>
                <li><strong className="text-white">Kontrol Keuangan:</strong> Atur HPP Kulakan, Harga Eceran, dan pantau Margin Laba</li>
                <li><strong className="text-white">Otorisasi Stock Opname:</strong> Eksekusi penyesuaian selisih (*Apply Adjustment*) ke saldo master</li>
                <li><strong className="text-white">Laporan Eksekutif:</strong> Laporan Nilai Total Aset Modal Persediaan Toko</li>
                <li><strong className="text-white">Manajemen Agen:</strong> Kelola data distributor grosir (BULOG, Salim Ivomas, dll)</li>
                <li><strong className="text-white">Akses Sistem:</strong> Skema normalisasi 3NF, ERD, dan skrip SQL DDL</li>
              </ul>
            </div>

            <div className="pt-7">
              <button
                onClick={() => onSwitchRole('admin')}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                  currentUser.role === 'admin'
                    ? 'bg-amber-500 text-black font-extrabold'
                    : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-700/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{currentUser.role === 'admin' ? 'Sedang Login sebagai Admin' : 'Uji Tampilan sebagai Admin'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KATALOG SEMBAKO UNGGULAN (The Visual Storefront Products Grid) */}
      <section id="katalog-sembako" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-2">
              <Package className="w-3.5 h-3.5" />
              <span>Etalase Produk Komoditas</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Katalog Sembako & Stok Real-Time
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Daftar barang sembako siap jual dengan ketersediaan fisik di rak display dan gudang belakang.
            </p>
          </div>

          <button
            onClick={() => onGoToManagement('products')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
          >
            <span>Buka Tabel Master Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => {
            const isCritical = p.stok_saat_ini <= p.stok_minimum;
            return (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {p.kode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCritical
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {isCritical ? '⚠️ Stok Menipis' : '✓ Stok Aman'}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base mt-2 group-hover:text-emerald-400 transition-colors">
                    {p.nama}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    Kategori: <span className="text-slate-300">{p.kategori}</span> • Lokasi: {p.lokasi_rak}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Stok Saat Ini:</span>
                    <strong className="text-white text-sm font-bold font-mono">
                      {p.stok_saat_ini} {p.satuan}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Harga Jual:</span>
                    <strong className="text-emerald-400 text-sm font-bold">
                      Rp {p.harga_jual.toLocaleString('id-ID')}
                    </strong>
                  </div>

                  {currentUser.role === 'admin' && (
                    <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-900/40 text-[11px] text-amber-300 flex items-center justify-between">
                      <span>HPP (Khusus Admin):</span>
                      <span className="font-mono">Rp {p.harga_beli.toLocaleString('id-ID')}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onGoToManagement('opname')}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-slate-700"
                    >
                      <Scale className="w-3.5 h-3.5 text-amber-400" />
                      <span>Audit Opname</span>
                    </button>
                    <button
                      onClick={() => onGoToManagement('kulakan')}
                      className="flex-1 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-600/30 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <span>+ Kulakan</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. KONTAK & LOKASI TOKO (Old Web Contact Form Style) */}
      <section id="kontak-toko" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Contact Information */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Layanan Pelanggan & Pemesanan
            </span>
            <h2 className="text-2xl font-bold text-white">Hubungi Toko Sembako Berkah Jaya</h2>
            <p className="text-xs text-slate-400">
              Melayani pemesanan kulakan grosir untuk warung mitra, katering hajatan, serta pembelian eceran warga sekitar.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Alamat Gudang & Toko:</div>
                <div className="text-slate-400">Jl. Pasar Raya Sembako No. 45, Blok B3, Jakarta Timur</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <Phone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Telepon / WhatsApp Order:</div>
                <div className="text-slate-400">0812-3456-7890 (H. Ridwan - Admin) / 0857-9876-5432 (Siti - Kasir)</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Jam Buka Layanan:</div>
                <div className="text-slate-400">Senin s/d Minggu: 07.00 - 21.00 WIB (Buka Setiap Hari)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base">Kirim Pesan Pemesanan / Pertanyaan Grosir</h3>
          {contactSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="font-bold text-emerald-300 text-sm">Pesan Berhasil Terkirim!</div>
              <p className="text-xs text-slate-300">
                Terima kasih telah menghubungi Toko Sembako Berkah Jaya. Petugas kami akan segera menghubungi Anda melalui WhatsApp.
              </p>
              <button
                onClick={() => setContactSubmitted(false)}
                className="mt-3 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
              >
                Kirim Pesan Lain
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setContactSubmitted(true);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap / Nama Warung:</label>
                <input
                  type="text"
                  required
                  placeholder="cth: Ibu Wati (Warung Berkah)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nomor WhatsApp Aktif:</label>
                <input
                  type="tel"
                  required
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pesanan Sembako / Keperluan:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan komoditas yang ingin dipesan (cth: Beras Pandan Wangi 5 Karung, Minyak Bimoli 3 Dus)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-600/30"
              >
                Kirimkan Permintaan Pemesanan
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
