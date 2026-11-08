import React, { useState } from 'react';
import {
  LayoutDashboard, Package, Truck, ShoppingCart, ClipboardCheck,
  BookOpen, Users, FileText, LogIn, RotateCw, Database, Info,
} from 'lucide-react';
import {
  INITIAL_SEMBAKO_ITEMS, INITIAL_DISTRIBUTORS, INITIAL_KULAKAN_HISTORY,
  INITIAL_PENJUALAN_HISTORY, INITIAL_OPNAME_SESI, INITIAL_KARTU_STOK,
  SembakoItem, DistributorAgen, TransaksiKulakan, TransaksiPengeluaran,
  OpnameSesi, KartuStokEntry,
} from './data/sembakoMasterData';
import { SembakoDashboard } from './components/sembako/SembakoDashboard';
import { SembakoProductsTable } from './components/sembako/SembakoProductsTable';
import { SembakoKulakan } from './components/sembako/SembakoKulakan';
import { SembakoPenjualan } from './components/sembako/SembakoPenjualan';
import { SembakoOpname } from './components/sembako/SembakoOpname';
import { SembakoKartuStok } from './components/sembako/SembakoKartuStok';
import { SembakoAgen } from './components/sembako/SembakoAgen';
import { SembakoReportsSql } from './components/sembako/SembakoReportsSql';
import { LoginModal } from './components/auth/LoginModal';
import { UserRole, UserSession, DEMO_USERS } from './types/auth';

const TITLE = 'Perancangan dan Pengembangan Pengelolaan Stok Barang pada Toko Sembako Berbasis Web';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Data Barang', icon: Package },
  { id: 'kulakan', label: 'Barang Masuk', icon: Truck },
  { id: 'penjualan', label: 'Barang Keluar', icon: ShoppingCart },
  { id: 'opname', label: 'Stok Opname', icon: ClipboardCheck },
  { id: 'kartu_stok', label: 'Riwayat Stok', icon: BookOpen },
  { id: 'agen', label: 'Data Pemasok', icon: Users },
  { id: 'laporan_sql', label: 'Laporan Stok', icon: FileText },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<UserSession>(DEMO_USERS.admin);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [products, setProducts] = useState<SembakoItem[]>([...INITIAL_SEMBAKO_ITEMS]);
  const [distributors, setDistributors] = useState<DistributorAgen[]>([...INITIAL_DISTRIBUTORS]);
  const [kulakanHistory, setKulakanHistory] = useState<TransaksiKulakan[]>([...INITIAL_KULAKAN_HISTORY]);
  const [penjualanHistory, setPenjualanHistory] = useState<TransaksiPengeluaran[]>([...INITIAL_PENJUALAN_HISTORY]);
  const [opnameSesi, setOpnameSesi] = useState<OpnameSesi>({ ...INITIAL_OPNAME_SESI });
  const [kartuStokHistory, setKartuStokHistory] = useState<KartuStokEntry[]>([...INITIAL_KARTU_STOK]);

  const handleSwitchRole = (role: UserRole) => setCurrentUser(DEMO_USERS[role]);

  const handleAddProduct = (newProd: Omit<SembakoItem, 'id'>) => {
    const created = { ...newProd, id: Math.max(0, ...products.map(p => p.id)) + 1 };
    setProducts(prev => [created, ...prev]);
    setKartuStokHistory(prev => [{
      id: Math.max(0, ...prev.map(x => x.id)) + 1,
      barang_id: created.id, nama_barang: created.nama,
      tgl: new Date().toISOString().slice(0, 10), no_dokumen: 'STOK-AWAL',
      keterangan: 'Pencatatan stok awal barang', masuk: created.stok_saat_ini,
      keluar: 0, saldo_akhir: created.stok_saat_ini,
    }, ...prev]);
  };

  const handleDeleteProduct = (id: number) => setProducts(prev => prev.filter(p => p.id !== id));

  const handleAddKulakan = (trx: Omit<TransaksiKulakan, 'id'>) => {
    const newTrx = { ...trx, id: Math.max(0, ...kulakanHistory.map(x => x.id)) + 1 };
    let nextProducts = [...products];
    let nextCards = [...kartuStokHistory];
    trx.items.forEach(item => {
      const product = nextProducts.find(p => p.id === item.barang_id);
      if (!product) return;
      const balance = product.stok_saat_ini + item.jumlah;
      nextProducts = nextProducts.map(p => p.id === item.barang_id ? { ...p, stok_saat_ini: balance } : p);
      nextCards.unshift({
        id: nextCards.length + 1, barang_id: item.barang_id, nama_barang: item.nama_barang,
        tgl: trx.tgl_masuk, no_dokumen: trx.no_faktur,
        keterangan: `Barang masuk dari ${trx.nama_agen}`,
        masuk: item.jumlah, keluar: 0, saldo_akhir: balance,
      });
    });
    setProducts(nextProducts); setKulakanHistory(prev => [newTrx, ...prev]); setKartuStokHistory(nextCards);
  };

  const handleAddPenjualan = (trx: Omit<TransaksiPengeluaran, 'id'>): boolean => {
    for (const item of trx.items) {
      const product = products.find(p => p.id === item.barang_id);
      if (!product || item.jumlah <= 0 || item.jumlah > product.stok_saat_ini) return false;
    }
    const newTrx = { ...trx, id: Math.max(0, ...penjualanHistory.map(x => x.id)) + 1 };
    let nextProducts = [...products];
    let nextCards = [...kartuStokHistory];
    trx.items.forEach(item => {
      const product = nextProducts.find(p => p.id === item.barang_id);
      if (!product) return;
      const balance = product.stok_saat_ini - item.jumlah;
      nextProducts = nextProducts.map(p => p.id === item.barang_id ? { ...p, stok_saat_ini: balance } : p);
      nextCards.unshift({
        id: nextCards.length + 1, barang_id: item.barang_id, nama_barang: item.nama_barang,
        tgl: trx.tgl_keluar, no_dokumen: trx.no_transaksi,
        keterangan: `Barang keluar: ${trx.tipe.replace(/_/g, ' ')} (${trx.keterangan})`,
        masuk: 0, keluar: item.jumlah, saldo_akhir: balance,
      });
    });
    setProducts(nextProducts); setPenjualanHistory(prev => [newTrx, ...prev]); setKartuStokHistory(nextCards);
    return true;
  };

  const handleApplyOpnameAdjustment = (details: OpnameSesi['details']) => {
    let nextProducts = [...products];
    let nextCards = [...kartuStokHistory];
    details.forEach(detail => {
      const product = nextProducts.find(p => p.id === detail.barang_id);
      if (!product || detail.stok_sistem === detail.stok_fisik) return;
      const balance = detail.stok_fisik;
      nextProducts = nextProducts.map(p => p.id === detail.barang_id ? { ...p, stok_saat_ini: balance } : p);
      nextCards.unshift({
        id: nextCards.length + 1, barang_id: detail.barang_id, nama_barang: detail.nama_barang,
        tgl: new Date().toISOString().slice(0, 10), no_dokumen: opnameSesi.no_opname,
        keterangan: `Penyesuaian stok opname: ${detail.penyebab.replace(/_/g, ' ')}`,
        masuk: Math.max(0, detail.selisih), keluar: Math.max(0, -detail.selisih), saldo_akhir: balance,
      });
    });
    setProducts(nextProducts); setKartuStokHistory(nextCards);
    setOpnameSesi(prev => ({ ...prev, status: 'selesai_diverifikasi', details: details.map(d => ({ ...d, stok_sistem: d.stok_fisik, selisih: 0 })) }));
  };

  const handleAddDistributor = (newDist: Omit<DistributorAgen, 'id'>) => {
    setDistributors(prev => [...prev, { ...newDist, id: Math.max(0, ...prev.map(x => x.id)) + 1 }]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-400"><Package className="h-7 w-7" /></div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Sistem Pengelolaan Stok Barang</h1>
                  <span className="rounded-full border border-emerald-700 bg-emerald-950 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">PROTOTIPE</span>
                </div>
                <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-400">Toko Sembako Berkah Jaya · Pengelolaan data barang, barang masuk, barang keluar, dan pemeriksaan stok.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs">
                <span className="text-slate-400">Pengguna: </span><strong className="text-white">{currentUser.nama}</strong>
                <span className="ml-2 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">{currentUser.role}</span>
              </div>
              <button onClick={() => handleSwitchRole(currentUser.role === 'admin' ? 'petugas' : 'admin')} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"><RotateCw className="h-3.5 w-3.5" /> Uji Peran</button>
              <button onClick={() => setIsLoginModalOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500"><LogIn className="h-3.5 w-3.5" /> Login</button>
            </div>
          </div>
          <nav className="mt-4 flex gap-1 overflow-x-auto border-t border-slate-800 pt-3" aria-label="Navigasi utama">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              return <button key={item.id} onClick={() => setActiveTab(item.id)} className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${activeTab === item.id ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Icon className="h-4 w-4" />{item.label}</button>;
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6">
        <div className="flex items-start gap-3 rounded-xl border border-sky-900/70 bg-sky-950/30 p-3 text-xs text-sky-100">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
          <p><strong>Mode prototipe:</strong> data awal merupakan data simulasi dan perubahan data hanya tersimpan selama sesi aplikasi berjalan. Website ini belum terhubung ke database permanen atau backend produksi.</p>
        </div>

        {activeTab === 'dashboard' && <SembakoDashboard products={products} kulakanHistory={kulakanHistory} opnameSesi={opnameSesi} onNavigateTab={setActiveTab} onOpenQuickKulakan={() => setActiveTab('kulakan')} />}
        {activeTab === 'products' && <SembakoProductsTable products={products} currentUserRole={currentUser.role} onAddProduct={handleAddProduct} onDeleteProduct={handleDeleteProduct} />}
        {activeTab === 'kulakan' && <SembakoKulakan products={products} distributors={distributors} kulakanHistory={kulakanHistory} onAddKulakan={handleAddKulakan} />}
        {activeTab === 'penjualan' && <SembakoPenjualan products={products} penjualanHistory={penjualanHistory} onAddPenjualan={handleAddPenjualan} />}
        {activeTab === 'opname' && <SembakoOpname products={products} opnameSesi={opnameSesi} currentUserRole={currentUser.role} onApplyOpnameAdjustment={handleApplyOpnameAdjustment} />}
        {activeTab === 'kartu_stok' && <SembakoKartuStok products={products} kartuStokHistory={kartuStokHistory} />}
        {activeTab === 'agen' && <SembakoAgen distributors={distributors} currentUserRole={currentUser.role} onAddDistributor={handleAddDistributor} />}
        {activeTab === 'laporan_sql' && <SembakoReportsSql products={products} currentUserRole={currentUser.role} onSwitchRole={handleSwitchRole} />}
      </main>

      <footer className="mt-10 border-t border-slate-800 bg-slate-950 px-4 py-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-300">{TITLE}</p>
        <p className="mt-1">Prototipe aplikasi pengelolaan stok barang toko sembako · Data simulasi</p>
      </footer>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={setCurrentUser} currentRole={currentUser.role} />
    </div>
  );
}
