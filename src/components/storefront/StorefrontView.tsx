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
  Scale, 
  ClipboardCheck,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { SembakoItem } from '../../data/sembakoMasterData';
import { UserSession, UserRole, ROLE_PERMISSIONS } from '../../types/auth';

interface StorefrontViewProps {
  products: SembakoItem[];
  currentUser: UserSession;
  onOpenLogin: () => void;
  onGoToManagement: (tab?: string) => void;
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  products,
  currentUser,
  onOpenLogin,
  onGoToManagement,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  const categories = [
    { id: 'semua', label: 'Semua Komoditas' },
    { id: 'Beras & Biji-bijian', label: 'Beras & Biji' },
    { id: 'Minyak & Mentega', label: 'Minyak Goreng' },
    { id: 'Gula & Pemanis', label: 'Gula Pasir' },
    { id: 'Telur & Unggas', label: 'Telur Ayam' },
    { id: 'Makanan Instan', label: 'Mie & Instan' },
    { id: 'Tepung & Olahan', label: 'Tepung Terigu' },
  ];

  const filteredProducts = selectedCategory === 'semua'
    ? products
    : products.filter((p) => p.kategori === selectedCategory);

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span>🌾 Toko Sembako Berkah Jaya • Melayani Sejak 2018</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Pusat Pengelolaan Stok & Persediaan Sembako
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Sistem informasi persediaan terpadu untuk mengontrol arus barang masuk kulakan dari agen resmi, pencatatan mutasi pengeluaran barang, serta pelaksanaan audit fisik stock opname berkala.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onGoToManagement('dashboard')}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Buka Dashboard Manajemen Stok</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onGoToManagement('opname')}
              className="px-5 py-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <ClipboardCheck className="w-4 h-4 text-emerald-600" />
              <span>Audit Stock Opname Fisik</span>
            </button>

            <button
              onClick={onOpenLogin}
              className="px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-xs sm:text-sm transition-colors"
            >
              Ganti Akun ({currentUser.role.toUpperCase()})
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Komoditas</div>
            <div className="text-2xl font-bold text-slate-800 font-mono mt-0.5">{products.length} SKU</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Stok Unit</div>
            <div className="text-2xl font-bold text-emerald-600 font-mono mt-0.5">
              {products.reduce((acc, p) => acc + p.stok_saat_ini, 0)} Unit
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Stok Kritis / Habis</div>
            <div className="text-2xl font-bold text-amber-600 font-mono mt-0.5">
              {products.filter((p) => p.stok_saat_ini <= p.stok_minimum).length} Item
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Akurasi Audit Fisik</div>
            <div className="text-2xl font-bold text-blue-600 font-mono mt-0.5">100%</div>
          </div>
        </div>
      </section>

      {/* Profil Toko & Layanan */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
            Profil Badan Usaha
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Penyedia Kebutuhan Pokok Terpercaya Masyarakat
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Toko Sembako Berkah Jaya mendistribusikan kebutuhan pangan masyarakat dan bermitra dengan lebih dari 200 warung kelontong sekitar. Melalui sistem ini, ketersediaan bahan pokok dipantau secara digital dan diuji melalui stock opname fisik berkala.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-slate-800 text-xs">🎯 Visi Toko</div>
              <p className="text-[11px] text-slate-500">Menjaga stabilitas pasokan pangan murah dengan stok pasti dan mutu terjaga.</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-slate-800 text-xs">⚙️ Misi Toko</div>
              <p className="text-[11px] text-slate-500">Menerapkan pencatatan kulakan masuk, kasir anti-stok minus, dan audit fisik BAST.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Informasi Kapasitas Pergudangan</h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between p-3 rounded-lg bg-slate-50">
              <span className="text-slate-500">Komoditas Utama:</span>
              <strong className="text-slate-800 font-medium">Beras, Minyak, Gula, Telur, Tepung, Mie</strong>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-slate-50">
              <span className="text-slate-500">Metode Pengawasan Expired:</span>
              <strong className="text-emerald-700 font-semibold">FIFO (First-In, First-Out)</strong>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-slate-50">
              <span className="text-slate-500">Mitra Agen Resmi:</span>
              <strong className="text-slate-800 font-medium">BULOG, Salim Ivomas, Peternak Blitar, Indofood</strong>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-slate-50">
              <span className="text-slate-500">Jam Operasional Toko:</span>
              <strong className="text-slate-800 font-medium">Setiap Hari: 07.00 - 21.00 WIB</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Katalog Stok Barang Sembako */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Katalog Persediaan Komoditas</h2>
            <p className="text-xs text-slate-500 mt-0.5">Daftar stok riil di rak toko dan harga eceran saat ini.</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => {
            const isHabis = p.stok_saat_ini === 0;
            const isKritis = p.stok_saat_ini > 0 && p.stok_saat_ini <= p.stok_minimum;

            return (
              <div
                key={p.id}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-semibold text-emerald-700">{p.kode}</span>
                    {isHabis ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        ✕ Habis
                      </span>
                    ) : isKritis ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        ⚠ Kritis
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ Aman
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm leading-snug">{p.nama}</h3>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Rak: {p.lokasi_rak} • Exp: {p.tgl_kadaluwarsa}
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Stok Tersedia:</span>
                    <strong className="font-mono text-slate-800">{p.stok_saat_ini} {p.satuan}</strong>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Harga Beli Modal:</span>
                    {currentUser.role === 'admin' ? (
                      <span className="font-mono text-slate-800">Rp {p.harga_beli.toLocaleString('id-ID')}</span>
                    ) : (
                      <span className="text-[11px] text-amber-700 italic flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Rahasia Admin
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-600 font-medium">Harga Eceran:</span>
                    <strong className="font-mono text-emerald-600 font-bold text-sm">
                      Rp {p.harga_jual.toLocaleString('id-ID')}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Kontak & Lokasi Toko */}
      <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            Layanan Pelanggan
          </div>
          <h2 className="text-xl font-bold text-slate-800">Hubungi Toko Sembako Berkah Jaya</h2>
          <p className="text-xs text-slate-500">
            Melayani pesanan partai grosir warung kelontong mitra dan kebutuhan belanja rumah tangga.
          </p>

          <div className="space-y-2 text-xs text-slate-600 pt-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Jl. Pasar Raya Sembako No. 45, Blok B3, Jakarta Timur</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>0812-3456-7890 (H. Ridwan - Admin) / 0857-9876-5432 (Siti - Petugas)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Buka Setiap Hari (07.00 - 21.00 WIB)</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="font-bold text-slate-800">Pesan Cepat Kebutuhan Sembako:</div>
          {contactSubmitted ? (
            <div className="p-4 rounded-lg bg-emerald-50 text-emerald-800 text-center font-medium">
              ✓ Permintaan pesanan telah terkirim! Petugas kami akan segera menghubungi Anda.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setContactSubmitted(true);
              }}
              className="space-y-2.5"
            >
              <input
                type="text"
                required
                placeholder="Nama Anda / Nama Warung..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-emerald-600 text-slate-800"
              />
              <textarea
                rows={2}
                required
                placeholder="Daftar pesanan (contoh: Beras Pandan Wangi 2 Sak, Minyak Bimoli 3 Pouch)..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-emerald-600 text-slate-800"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                Kirim Pesan Pemesanan
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
