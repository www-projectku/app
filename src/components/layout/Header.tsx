import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  LogOut, 
  AlertTriangle, 
  AlertOctagon,
  ChevronDown
} from 'lucide-react';
import { UserSession } from '../../types/auth';
import { SembakoItem } from '../../data/sembakoMasterData';

interface HeaderProps {
  activeTab: string;
  onOpenMobileSidebar: () => void;
  currentUser: UserSession;
  onLogout: () => void;
  onOpenLoginModal: () => void;
  products: SembakoItem[];
  onNavigateTab: (tab: string) => void;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard Manajemen Stok', subtitle: 'Ringkasan komprehensif metrik persediaan, akurasi opname, dan aktivitas terbaru.' },
  products: { title: 'Data Master Barang', subtitle: 'Katalog komoditas sembako, harga modal HPP, harga eceran, dan lokasi penyimpanan.' },
  categories: { title: 'Kategori Komoditas', subtitle: 'Pengelompokan kebutuhan pokok: beras, minyak, gula, telur, terigu & mie.' },
  agen: { title: 'Data Pemasok & Distributor', subtitle: 'Daftar agen kulakan resmi: BULOG, Salim Ivomas, Peternak Blitar, dan Indofood.' },
  kulakan: { title: 'Barang Masuk (Kulakan Agen)', subtitle: 'Penerimaan faktur pasokan barang masuk dari distributor grosir resmi.' },
  penjualan: { title: 'Barang Keluar & Penjualan', subtitle: 'Pencatatan pengeluaran sembako untuk penjualan toko dan komoditas rusak/pecah.' },
  opname: { title: 'Audit Stock Opname Fisik', subtitle: 'Pencocokan stok catatan komputer vs hitungan nyata di rak toko secara berkala.' },
  kartu_stok: { title: 'Riwayat Pergerakan Stok', subtitle: 'Buku kartu stok mutasi kronologis masuk, keluar, dan saldo akhir komoditas.' },
  laporan: { title: 'Laporan & Berita Acara', subtitle: 'Dokumen Berita Acara Stock Opname (BAST), valuasi aset modal, dan skrip database.' },
  settings: { title: 'Pengaturan & Otorisasi', subtitle: 'Manajemen hak akses pengguna (RBAC), metodologi skripsi, dan ekspor GitHub.' },
  laporan_opname: { title: 'Berita Acara Stock Opname (BAST)', subtitle: 'Pengesahan dokumen serah terima hasil audit fisik dan selisih komoditas.' },
  laporan_sql: { title: 'Skema Database SQL DDL', subtitle: 'Skrip struktur tabel normalisasi 3NF untuk laporan Bab III/IV tugas akhir.' },
  audit_judul: { title: 'Koreksi Judul Tugas Akhir', subtitle: 'Analisis kepatuhan fitur aplikasi terhadap judul skripsi yang diajukan.' },
  metode_sdlc: { title: 'Dokumentasi Metodologi SDLC', subtitle: 'Tahapan waterfall, analisis kebutuhan fungsional, dan matriks validasi.' },
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileSidebar,
  currentUser,
  onLogout,
  onOpenLoginModal,
  products,
  onNavigateTab,
}) => {
  const [showNotificationMenu, setShowNotificationMenu] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  // Compute alerts
  const criticalItems = products.filter((p) => p.stok_saat_ini <= p.stok_minimum && p.stok_saat_ini > 0);
  const outOfStockItems = products.filter((p) => p.stok_saat_ini === 0);
  const totalAlerts = criticalItems.length + outOfStockItems.length;

  const currentTabInfo = TAB_TITLES[activeTab] || {
    title: 'Sistem Informasi Stok Toko Sembako',
    subtitle: 'Pengelolaan Persediaan Berbasis Web Berkah Jaya',
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3 overflow-hidden">
          <button
            onClick={onOpenMobileSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden shrink-0"
            aria-label="Buka navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="truncate">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>Sistem Stok</span>
              <span>/</span>
              <span className="text-slate-600 font-semibold">{currentTabInfo.title}</span>
            </div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight truncate hidden sm:block">
              {currentTabInfo.title}
            </h2>
          </div>
        </div>

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationMenu(!showNotificationMenu);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
              title="Notifikasi & Peringatan Stok"
            >
              <Bell className="w-4 h-4" />
              {totalAlerts > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Popover */}
            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-50 animate-in fade-in duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">Peringatan Persediaan</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700">
                    {totalAlerts} Isu
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 text-xs">
                  {outOfStockItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setShowNotificationMenu(false);
                        onNavigateTab('kulakan');
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer flex items-start gap-2.5"
                    >
                      <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-800">{item.nama}</div>
                        <div className="text-[11px] text-rose-600 font-semibold">
                          Stok Habis (0 {item.satuan}) • Segera Kulakan
                        </div>
                      </div>
                    </div>
                  ))}

                  {criticalItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setShowNotificationMenu(false);
                        onNavigateTab('products');
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer flex items-start gap-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-800">{item.nama}</div>
                        <div className="text-[11px] text-amber-700 font-medium">
                          Stok Menipis ({item.stok_saat_ini} {item.satuan} tersisa, batas min: {item.stok_minimum})
                        </div>
                      </div>
                    </div>
                  ))}

                  {totalAlerts === 0 && (
                    <div className="p-4 text-center text-slate-400 text-xs">
                      Semua stok barang dalam kondisi aman.
                    </div>
                  )}
                </div>

                <div className="px-3 pt-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setShowNotificationMenu(false);
                      onNavigateTab('products');
                    }}
                    className="text-[11px] text-emerald-600 font-semibold hover:underline"
                  >
                    Buka Data Barang →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Button & Popover */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotificationMenu(false);
              }}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="text-left px-1">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.nama}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {currentUser.jabatan}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-50 animate-in fade-in duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="font-bold text-xs text-slate-800">{currentUser.nama}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{currentUser.email}</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {currentUser.role === 'admin' ? 'Super Admin' : 'Petugas Toko'}
                  </span>
                </div>

                <div className="py-1 text-xs">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigateTab('settings');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    Pengaturan Akun & RBAC
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-semibold text-xs flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Ganti Akun / Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
