import React from 'react';
import { Database, ExternalLink, Globe, Layers, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { TARGET_WEBSITE } from '../data/databaseSchemaData';

interface HeaderProps {
  systemMode: 'sembako' | 'stock' | 'company';
  setSystemMode: (mode: 'sembako' | 'stock' | 'company') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLivePreview: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  systemMode,
  setSystemMode,
  activeTab,
  setActiveTab,
  onOpenLivePreview,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40">
      {/* Top Notification / Target URL Bar */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Target Web:</span>
            <a
              href={TARGET_WEBSITE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1 font-medium"
            >
              {TARGET_WEBSITE.url}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="hidden md:inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs">
              Hosting Statis: GitHub Pages
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLivePreview}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Preview Iframe</span>
            </button>
            <a
              href={TARGET_WEBSITE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 text-xs rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Buka Web Asli</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Branding & Focus Mode Switcher */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 via-emerald-500/20 to-blue-500/20 border border-amber-500/30 text-amber-400 shadow-inner">
              <Database className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {systemMode === 'sembako'
                    ? 'Evaluasi & Koreksi Judul: Toko Sembako'
                    : systemMode === 'stock'
                    ? 'Sistem Database Stock Opname & Mutasi Barang'
                    : 'Identifikasi Database Web: Tugas-CP'}
                </h1>

                {systemMode === 'sembako' && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    Judul Tugas: Pengelolaan Stok Toko Sembako
                  </span>
                )}
                {systemMode === 'stock' && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Fokus: Pergudangan & Stock Opname
                  </span>
                )}
                {systemMode === 'company' && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Arsitektur Awal: Company Profile
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl">
                {systemMode === 'sembako'
                  ? 'Audit kesesuaian repositori GitHub dengan judul skripsi/tugas "Pengelolaan Stok Toko Sembako". Panduan lengkap apa yang harus dihilangkan, diubah, dan ditambahkan.'
                  : systemMode === 'stock'
                  ? 'Desain ERD 8 tabel pergudangan, logika pencegahan stok minus, database trigger otomatis, dan simulator live sesi stock opname.'
                  : 'Laporan diagnosis web statis Tugas-CP di GitHub Pages, kamus data 6 tabel profil, generator SQL DDL, dan form inspector.'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Pill */}
          <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center gap-1 shrink-0 self-start lg:self-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setSystemMode('sembako');
                setActiveTab('sembako_audit');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                systemMode === 'sembako'
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Koreksi Judul: Toko Sembako</span>
            </button>

            <button
              onClick={() => {
                setSystemMode('stock');
                setActiveTab('stock_sim');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                systemMode === 'stock'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Stock Opname & Mutasi</span>
            </button>

            <button
              onClick={() => {
                setSystemMode('company');
                setActiveTab('overview');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                systemMode === 'company'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Arsitektur Asli (CP)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Navigation Tabs based on Mode */}
        <div className="flex items-center gap-1 overflow-x-auto pt-3 mt-2 border-t border-slate-800/60 no-scrollbar">
          {systemMode === 'sembako' && (
            <>
              {[
                { id: 'sembako_audit', label: 'Hasil Audit Kesesuaian Judul', icon: AlertCircle },
                { id: 'stock_sim', label: 'Simulasi Stok Sembako (Beras/Minyak/Telur)', icon: Sparkles },
                { id: 'stock_sql', label: 'Skrip Database Toko Sembako (SQL DDL)', icon: Database },
                { id: 'backend', label: 'Solusi Backend GitHub Pages', icon: ExternalLink },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </>
          )}

          {systemMode === 'stock' && (
            <>
              {[
                { id: 'stock_guide', label: 'Apa yang Perlu Diubah?', icon: AlertCircle },
                { id: 'stock_sim', label: 'Simulasi Live Stock Opname & Mutasi', icon: Sparkles },
                { id: 'stock_erd', label: 'Diagram ERD 8 Tabel Gudang', icon: Layers },
                { id: 'stock_sql', label: 'Skrip SQL, DDL & Trigger Stok', icon: Database },
                { id: 'backend', label: 'Solusi Hosting GitHub Pages', icon: ExternalLink },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </>
          )}

          {systemMode === 'company' && (
            <>
              {[
                { id: 'overview', label: 'Ringkasan & Analisis Web', icon: AlertCircle },
                { id: 'erd', label: 'Diagram ERD Company Profile', icon: Layers },
                { id: 'dictionary', label: 'Kamus Data (6 Tabel)', icon: Database },
                { id: 'sql', label: 'Generator SQL & DDL', icon: Sparkles },
                { id: 'simulator', label: 'Simulasi Query CRUD', icon: Globe },
                { id: 'backend', label: 'Cara Hubungkan ke Web', icon: ExternalLink },
                { id: 'inspector', label: 'Ekstraktor Form HTML', icon: Database },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
