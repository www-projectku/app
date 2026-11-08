import React, { useState } from 'react';
import { 
  INITIAL_SEMBAKO_ITEMS, 
  INITIAL_DISTRIBUTORS, 
  INITIAL_KULAKAN_HISTORY, 
  INITIAL_PENJUALAN_HISTORY, 
  INITIAL_OPNAME_SESI, 
  INITIAL_KARTU_STOK,
  SembakoItem,
  DistributorAgen,
  TransaksiKulakan,
  TransaksiPengeluaran,
  OpnameSesi,
  KartuStokEntry
} from './data/sembakoMasterData';
import { SembakoDashboard } from './components/sembako/SembakoDashboard';
import { SembakoProductsTable } from './components/sembako/SembakoProductsTable';
import { SembakoCategories } from './components/sembako/SembakoCategories';
import { SembakoKulakan } from './components/sembako/SembakoKulakan';
import { SembakoPenjualan } from './components/sembako/SembakoPenjualan';
import { SembakoOpname } from './components/sembako/SembakoOpname';
import { SembakoAuditReport } from './components/sembako/SembakoAuditReport';
import { SembakoKartuStok } from './components/sembako/SembakoKartuStok';
import { SembakoAgen } from './components/sembako/SembakoAgen';
import { SembakoReportsSql } from './components/sembako/SembakoReportsSql';
import { SembakoSettings } from './components/sembako/SembakoSettings';
import { SembakoAuditGuide } from './components/SembakoAuditGuide';
import { SembakoMethodology } from './components/sembako/SembakoMethodology';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LivePreviewModal } from './components/LivePreviewModal';
import { GithubExportModal } from './components/GithubExportModal';
import { LoginModal } from './components/auth/LoginModal';
import { StorefrontView } from './components/storefront/StorefrontView';
import { LoginPage } from './components/auth/LoginPage';
import { UserRole, UserSession, DEMO_USERS } from './types/auth';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Github,
  Globe,
  Lock,
  ArrowRight,
  LogOut,
  Store
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [viewMode, setViewMode] = useState<'login' | 'storefront' | 'management'>('management');
  const [currentUser, setCurrentUser] = useState<UserSession>(DEMO_USERS.admin);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState<boolean>(false);

  // Sidebar responsive & collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Standard Logout handler: directs user back to real login screen
  const handleLogout = () => {
    setViewMode('login');
  };

  // Core Sembako Application State
  const [products, setProducts] = useState<SembakoItem[]>([...INITIAL_SEMBAKO_ITEMS]);
  const [distributors, setDistributors] = useState<DistributorAgen[]>([...INITIAL_DISTRIBUTORS]);
  const [kulakanHistory, setKulakanHistory] = useState<TransaksiKulakan[]>([...INITIAL_KULAKAN_HISTORY]);
  const [penjualanHistory, setPenjualanHistory] = useState<TransaksiPengeluaran[]>([...INITIAL_PENJUALAN_HISTORY]);
  const [opnameSesi, setOpnameSesi] = useState<OpnameSesi>({ ...INITIAL_OPNAME_SESI });
  const [kartuStokHistory, setKartuStokHistory] = useState<KartuStokEntry[]>([...INITIAL_KARTU_STOK]);

  // Handler: Add new product
  const handleAddProduct = (newProd: Omit<SembakoItem, 'id'>) => {
    const created: SembakoItem = {
      ...newProd,
      id: products.length + 1,
    };
    setProducts([created, ...products]);

    // Also record in stock card as initial balance
    const cardEntry: KartuStokEntry = {
      id: kartuStokHistory.length + 1,
      barang_id: created.id,
      nama_barang: created.nama,
      tgl: new Date().toISOString().slice(0, 10),
      no_dokumen: 'STOK-AWAL-REG',
      keterangan: 'Pendaftaran Komoditas Sembako Baru',
      masuk: created.stok_saat_ini,
      keluar: 0,
      saldo_akhir: created.stok_saat_ini,
    };
    setKartuStokHistory([cardEntry, ...kartuStokHistory]);
  };

  // Handler: Delete product
  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Handler: Kulakan Masuk
  const handleAddKulakan = (transaksi: Omit<TransaksiKulakan, 'id'>) => {
    const newTrx: TransaksiKulakan = {
      ...transaksi,
      id: kulakanHistory.length + 1,
    };

    let updatedProducts = [...products];
    let newCards = [...kartuStokHistory];

    transaksi.items.forEach((item) => {
      const targetProd = updatedProducts.find((p) => p.id === item.barang_id);
      if (targetProd) {
        const newStock = targetProd.stok_saat_ini + item.jumlah;
        updatedProducts = updatedProducts.map((p) =>
          p.id === item.barang_id ? { ...p, stok_saat_ini: newStock } : p
        );

        newCards.unshift({
          id: newCards.length + 1,
          barang_id: item.barang_id,
          nama_barang: item.nama_barang,
          tgl: transaksi.tgl_masuk,
          no_dokumen: transaksi.no_faktur,
          keterangan: `Kulakan dari ${transaksi.nama_agen}`,
          masuk: item.jumlah,
          keluar: 0,
          saldo_akhir: newStock,
        });
      }
    });

    setProducts(updatedProducts);
    setKulakanHistory([newTrx, ...kulakanHistory]);
    setKartuStokHistory(newCards);
  };

  // Handler: Penjualan Keluar
  const handleAddPenjualan = (transaksi: Omit<TransaksiPengeluaran, 'id'>): boolean => {
    const newTrx: TransaksiPengeluaran = {
      ...transaksi,
      id: penjualanHistory.length + 1,
    };

    let updatedProducts = [...products];
    let newCards = [...kartuStokHistory];

    // Check availability
    for (const item of transaksi.items) {
      const prod = products.find((p) => p.id === item.barang_id);
      if (!prod || prod.stok_saat_ini < item.jumlah) {
        return false;
      }
    }

    transaksi.items.forEach((item) => {
      const targetProd = updatedProducts.find((p) => p.id === item.barang_id);
      if (targetProd) {
        const newStock = targetProd.stok_saat_ini - item.jumlah;
        updatedProducts = updatedProducts.map((p) =>
          p.id === item.barang_id ? { ...p, stok_saat_ini: newStock } : p
        );

        newCards.unshift({
          id: newCards.length + 1,
          barang_id: item.barang_id,
          nama_barang: item.nama_barang,
          tgl: transaksi.tgl_keluar,
          no_dokumen: transaksi.no_transaksi,
          keterangan: `${transaksi.tipe === 'barang_rusak_pecah' ? 'Pemusnahan Rusak' : 'Penjualan'}: ${transaksi.keterangan}`,
          masuk: 0,
          keluar: item.jumlah,
          saldo_akhir: newStock,
        });
      }
    });

    setProducts(updatedProducts);
    setPenjualanHistory([newTrx, ...penjualanHistory]);
    setKartuStokHistory(newCards);
    return true;
  };

  // Handler: Stock Opname Adjustment
  const handleApplyOpnameAdjustment = (updatedDetails: OpnameSesi['details']) => {
    let updatedProducts = [...products];
    let newCards = [...kartuStokHistory];

    updatedDetails.forEach((d) => {
      const targetProd = updatedProducts.find((p) => p.id === d.barang_id);
      if (targetProd && d.selisih !== 0) {
        const newStock = d.stok_fisik;
        updatedProducts = updatedProducts.map((p) =>
          p.id === d.barang_id ? { ...p, stok_saat_ini: newStock } : p
        );

        newCards.unshift({
          id: newCards.length + 1,
          barang_id: d.barang_id,
          nama_barang: d.nama_barang,
          tgl: opnameSesi.tgl_opname,
          no_dokumen: opnameSesi.no_opname,
          keterangan: `Penyesuaian Opname Fisik: ${d.penyebab}`,
          masuk: d.selisih > 0 ? d.selisih : 0,
          keluar: d.selisih < 0 ? Math.abs(d.selisih) : 0,
          saldo_akhir: newStock,
        });
      }
    });

    setProducts(updatedProducts);
    setKartuStokHistory(newCards);
    setOpnameSesi({
      ...opnameSesi,
      details: updatedDetails,
      status: 'selesai_diverifikasi',
    });
  };

  // Handler: Add distributor
  const handleAddDistributor = (distributor: Omit<DistributorAgen, 'id'>) => {
    setDistributors([
      ...distributors,
      {
        ...distributor,
        id: distributors.length + 1,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Academic Banner */}
      <div className="bg-slate-900 text-slate-300 border-b border-slate-800 px-4 py-2 text-xs no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Judul Tugas:</span>
            <strong className="text-amber-300 font-medium">
              "Perancangan dan Pengembangan Pengelolaan Stok Barang pada Toko Sembako Berbasis Web"
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGithubModalOpen(true)}
              className="px-2.5 py-1 text-xs rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-xs flex items-center gap-1.5"
              title="Salin / Unduh index.html untuk repo GitHub Anda"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Ekspor GitHub Pages</span>
            </button>
            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Lihat Web Lama</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: DEDICATED LOGIN PAGE (MATCHING TUGAS-CP) */}
      {viewMode === 'login' ? (
        <LoginPage
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setViewMode('management');
          }}
          onGoToStorefront={() => setViewMode('storefront')}
        />
      ) : viewMode === 'storefront' ? (
        /* VIEW MODE 2: STOREFRONT VIEW */
        <div className="flex-1 flex flex-col">
          {/* Storefront Top Bar */}
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-xs">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800 text-sm">Toko Sembako Berkah Jaya</h1>
                <p className="text-[11px] text-slate-500">Tampilan Web Depan (Storefront)</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setViewMode('login')}
                className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>Login Akun</span>
              </button>

              <button
                onClick={() => setViewMode('management')}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>Buka Sistem Stok</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <StorefrontView
              products={products}
              currentUser={currentUser}
              onOpenLogin={() => setViewMode('login')}
              onGoToManagement={(tab) => {
                if (tab) setActiveTab(tab);
                setViewMode('management');
              }}
            />
          </main>
        </div>
      ) : (
        /* VIEW MODE 3: MANAGEMENT DASHBOARD LAYOUT (SIDEBAR + TOP HEADER) */
        <div className="flex-1 flex min-h-screen">
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tabId) => setActiveTab(tabId)}
            currentUser={currentUser}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
            onLogout={handleLogout}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />

          {/* Main Layout Area */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
              sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
            }`}
          >
            {/* Top Header */}
            <Header
              activeTab={activeTab}
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
              currentUser={currentUser}
              onLogout={handleLogout}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              products={products}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />

            {/* Content Container */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {/* TABS VIEW CONTROLLERS */}
              {activeTab === 'dashboard' && (
                <SembakoDashboard
                  products={products}
                  kulakanHistory={kulakanHistory}
                  penjualanHistory={penjualanHistory}
                  opnameSesi={opnameSesi}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenQuickKulakan={() => setActiveTab('kulakan')}
                  onOpenQuickPenjualan={() => setActiveTab('penjualan')}
                />
              )}

              {activeTab === 'products' && (
                <SembakoProductsTable
                  products={products}
                  currentUserRole={currentUser.role}
                  onAddProduct={handleAddProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              )}

              {activeTab === 'categories' && (
                <SembakoCategories
                  products={products}
                  onSelectProductCategory={(cat) => {
                    setActiveTab('products');
                  }}
                />
              )}

              {activeTab === 'agen' && (
                <SembakoAgen
                  distributors={distributors}
                  currentUserRole={currentUser.role}
                  onAddDistributor={handleAddDistributor}
                />
              )}

              {activeTab === 'kulakan' && (
                <SembakoKulakan
                  products={products}
                  distributors={distributors}
                  kulakanHistory={kulakanHistory}
                  onAddKulakan={handleAddKulakan}
                />
              )}

              {activeTab === 'penjualan' && (
                <SembakoPenjualan
                  products={products}
                  penjualanHistory={penjualanHistory}
                  onAddPenjualan={handleAddPenjualan}
                />
              )}

              {activeTab === 'opname' && (
                <SembakoOpname
                  products={products}
                  opnameSesi={opnameSesi}
                  currentUserRole={currentUser.role}
                  onApplyOpnameAdjustment={handleApplyOpnameAdjustment}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'kartu_stok' && (
                <SembakoKartuStok
                  products={products}
                  kartuStokHistory={kartuStokHistory}
                />
              )}

              {activeTab === 'laporan' && (
                <div className="space-y-6">
                  <SembakoAuditReport
                    products={products}
                    opnameSesi={opnameSesi}
                    currentUserRole={currentUser.role}
                  />
                  <div className="pt-6 border-t border-slate-200">
                    <SembakoReportsSql
                      products={products}
                      currentUserRole={currentUser.role}
                      onNavigateToLogin={handleLogout}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'laporan_opname' && (
                <SembakoAuditReport
                  products={products}
                  opnameSesi={opnameSesi}
                  currentUserRole={currentUser.role}
                />
              )}

              {activeTab === 'laporan_sql' && (
                <SembakoReportsSql
                  products={products}
                  currentUserRole={currentUser.role}
                  onNavigateToLogin={handleLogout}
                />
              )}

              {activeTab === 'settings' && (
                <SembakoSettings
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onOpenLoginModal={() => setIsLoginModalOpen(true)}
                  onOpenGithubModal={() => setIsGithubModalOpen(true)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'audit_judul' && (
                <SembakoAuditGuide />
              )}

              {activeTab === 'metode_sdlc' && (
                <SembakoMethodology />
              )}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-6 text-xs text-slate-500 no-print mt-auto">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Toko Sembako Berkah Jaya</span>
                  <span>•</span>
                  <span>Sistem Pengelolaan Stok Sembako Berbasis Web</span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* Modals */}
      <LivePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
      />

      <GithubExportModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
        currentRole={currentUser.role}
      />
    </div>
  );
}
