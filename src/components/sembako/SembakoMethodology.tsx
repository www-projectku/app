import React, { useState } from 'react';
import { 
  GitBranch, 
  Workflow, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  BookOpen, 
  FileText
} from 'lucide-react';

export const SembakoMethodology: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const bab3Text = `BAB III: METODOLOGI PENGEMBANGAN PERANGKAT LUNAK

1. Evaluasi Metode pada Website Sebelumnya (Tugas-CP):
Website sebelumnya dibangun menggunakan metode Waterfall Konvensional berfokus Frontend (Static Brochureware Development) yang di-deploy ke GitHub Pages. 
Tahapannya meliputi:
a. Analisis Kebutuhan Konten (Requirement): Pengumpulan data profil usaha statis.
b. Perancangan Antarmuka (UI Design): Wireframe landing page dan styling CSS.
c. Pengkodean Statis (Coding): Pembuatan markup HTML5 dan CSS tanpa database.
d. Deployment: Mengunggah berkas ke GitHub Pages.

Kelemahan Metode Sebelumnya:
- Tidak adanya Data Modeling & Normalisasi Database (tidak ada skema ERD).
- Tidak adanya Business Logic Processing (aritmatika stok dan mutasi tidak berjalan).
- Bersifat satu arah (read-only) tanpa kemampuan manipulasi data (Create, Read, Update, Delete).

2. Metode Pengembangan yang Diusulkan untuk Sistem Stok Toko Sembako:
Menggunakan metode Waterfall Terstruktur Berorientasi Data (Data-Driven SDLC) dengan tahapan:
1) Analisis Sistem: Analisis proses bisnis toko sembako (kulakan, penjualan, stock opname).
2) Perancangan Database: Pembuatan ERD, Normalisasi 1NF-3NF, dan Data Dictionary (10 Tabel).
3) Perancangan Antarmuka & Logika: Pembuatan modul transaksi, proteksi stok minus, dan alert kadaluwarsa.
4) Implementasi Sistem: Pengkodean antarmuka React/TypeScript dan penyimpanan data.
5) Pengujian Sistem: Black-box testing pada validasi stok minus dan perhitungan selisih opname.`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Workflow className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">
              Dokumentasi Metodologi SDLC (Bab III Skripsi)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Analisis komparasi metode Waterfall statis (website lama) versus Waterfall Terstruktur Berorientasi Data untuk laporan tugas akhir.
          </p>
        </div>

        <button
          onClick={() => handleCopy(bab3Text, 'all')}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          {copiedSection === 'all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copiedSection === 'all' ? 'Tersalin!' : 'Salin Teks Lengkap Bab III'}</span>
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Method 1: Old Static Web */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-800 text-sm">1. Metode Website Lama (Tugas-CP)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                Statis Brochureware
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                Website awal di GitHub Pages dikembangkan menggunakan pendekatan presentasi statis (Company Profile) satu arah tanpa relasi database.
              </p>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-slate-600">
                <div className="font-semibold text-rose-600">Keterbatasan untuk Tugas Akhir Stok:</div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-500">
                  <li>Tidak ada pemodelan data relasional (ERD & 3NF).</li>
                  <li>Tidak ada logika penambahan dan pengurangan saldo stok.</li>
                  <li>Tidak ada verifikasi autentikasi hak akses Admin vs Petugas.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Method 2: Proposed Stock System */}
        <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-emerald-800 text-sm">2. Metode Sistem Stok Sembako (Saat Ini)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Data-Driven SDLC
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                Sistem pengelolaan stok ini menerapkan model SDLC Waterfall yang berpusat pada integritas data, alur mutasi barang, dan audit opname.
              </p>
              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1 text-emerald-900">
                <div className="font-semibold text-emerald-700">Kesesuaian dengan Judul Skripsi:</div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-emerald-800">
                  <li>Skema relasional 10 tabel normalisasi 3NF dengan integrity constraint.</li>
                  <li>Arus mutasi barang masuk (+kulakan) dan keluar (-penjualan).</li>
                  <li>Rekonsiliasi fisik stock opname & Berita Acara Serah Terima (BAST).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Waterfall Stages Detail */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">
          5 Tahapan Waterfall Terstruktur Berorientasi Data
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
          {[
            { step: '1', title: 'Analisis Kebutuhan', desc: 'Identifikasi proses bisnis kulakan, penjualan, dan penanganan telur pecah/karung bocor.' },
            { step: '2', title: 'Perancangan DB (3NF)', desc: 'Penyusunan ERD, kamus data, dan skrip SQL 10 tabel terhubung relasi kunci asing.' },
            { step: '3', title: 'Desain Antarmuka', desc: 'Perancangan dashboard statistik, lembar opname, dan formulir barang masuk/keluar.' },
            { step: '4', title: 'Implementasi Logika', desc: 'Pengkodean React/TypeScript, kalkulasi selisih deviasi, dan proteksi stok minus.' },
            { step: '5', title: 'Pengujian Black-Box', desc: 'Validasi form submit, uji batasan kuantitas, dan pencetakan dokumen resmi BAST.' },
          ].map((s) => (
            <div key={s.step} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                {s.step}
              </span>
              <div className="font-bold text-slate-800 text-xs">{s.title}</div>
              <p className="text-[11px] text-slate-500 leading-tight">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
