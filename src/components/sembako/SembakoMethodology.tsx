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
  Cpu, 
  ShieldAlert,
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
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/50 border border-blue-800/60 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30">
          <BookOpen className="w-3.5 h-3.5" />
          Kajian Akademik Rekayasa Perangkat Lunak (SDLC)
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Analisis Metode Pengembangan Website Sebelumnya (<span className="text-cyan-400 font-mono">Tugas-CP</span>)
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
          Penjelasan komprehensif mengenai metode rekayasa perangkat lunak yang digunakan pada website repositori GitHub Pages sebelumnya, kelebihan, kelemahan, serta transformasi metodologi yang dibutuhkan untuk memenuhi judul skripsi/tugas <strong>"Pengelolaan Stok Toko Sembako"</strong>.
        </p>

        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => handleCopy(bab3Text, 'bab3')}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/30"
          >
            {copiedSection === 'bab3' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'bab3' ? 'Tersalin untuk Bab III!' : 'Salin Teks Lengkap untuk Bab III Skripsi'}</span>
          </button>
        </div>
      </div>

      {/* SDLC Waterfall Comparison */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Workflow className="w-5 h-5 text-cyan-400" />
          1. Metode yang Digunakan pada Website Sebelumnya: <span className="text-cyan-300">Model Waterfall Konvensional (Static Site)</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Berdasarkan struktur berkas pada repositori GitHub <code className="text-cyan-300 font-mono">www-projectku.github.io/Tugas-CP/</code>, metode pengembangan yang diterapkan adalah <strong>Model Waterfall Klasik (Linear Sequential)</strong> dengan pendekatan <em>Static Site Architecture (Jamstack Client-Side Dasar)</em>. Tahapannya berjalan secara sekuensial satu arah:
        </p>

        {/* 5 Stages Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          {[
            {
              step: '1',
              title: 'Analisis Kebutuhan',
              desc: 'Mengidentifikasi teks konten profil perusahaan (visi, misi, kontak kantor, daftar layanan).',
              status: 'Hanya Teks Statis',
              color: 'border-blue-800/40 bg-blue-950/20 text-blue-300',
            },
            {
              step: '2',
              title: 'Perancangan (Design)',
              desc: 'Membuat wireframe layout landing page (header, hero section, card layanan, dan footer).',
              status: 'Desain Satu Halaman',
              color: 'border-indigo-800/40 bg-indigo-950/20 text-indigo-300',
            },
            {
              step: '3',
              title: 'Implementasi (Coding)',
              desc: 'Penulisan kode frontend statis menggunakan HTML5, CSS3/Bootstrap, dan script visual sederhana.',
              status: 'Tanpa Backend Database',
              color: 'border-cyan-800/40 bg-cyan-950/20 text-cyan-300',
            },
            {
              step: '4',
              title: 'Pengujian (Testing)',
              desc: 'Pengujian tampilan antarmuka (black-box UI) di browser lokal untuk memastikan tampilan rapi.',
              status: 'Uji Responsif Browser',
              color: 'border-amber-800/40 bg-amber-950/20 text-amber-300',
            },
            {
              step: '5',
              title: 'Deployment',
              desc: 'Mengunggah kode sumber ke GitHub Repo dan mengaktifkan hosting gratis GitHub Pages.',
              status: 'Static Git Hosting',
              color: 'border-emerald-800/40 bg-emerald-950/20 text-emerald-300',
            },
          ].map((s) => (
            <div key={s.step} className={`p-4 rounded-xl border ${s.color} space-y-2 flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-[10px]">
                    {s.step}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                    {s.status}
                  </span>
                </div>
                <div className="font-bold text-white text-xs">{s.title}</div>
                <p className="text-slate-400 text-[11px] mt-1 leading-snug">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Evaluation: Why it Fails for Sembako Store */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kelemahan Metode Website Sebelumnya */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-rose-900/40 space-y-3.5">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5" />
            <h4>Kelemahan & Limitasi Metode Website Sebelumnya</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0">✕</span>
              <span><strong>Tidak Memiliki Tahap Pemodelan Data (Data Modeling):</strong> Tidak ada perancangan Diagram Hubungan Entitas (ERD), normalisasi tabel 1NF-3NF, atau relasi Foreign Key.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0">✕</span>
              <span><strong>Bersifat Satu Arah (Read-Only):</strong> Pengguna hanya bisa membaca informasi; tidak ada modul manipulasi data dinamis (Create, Read, Update, Delete / CRUD).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0">✕</span>
              <span><strong>Tidak Memiliki Lapisan Logika Bisnis (Business Logic Layer):</strong> Tidak ada algoritma untuk menghitung saldo stok, mutasi masuk/keluar, dan selisih stock opname.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0">✕</span>
              <span><strong>Ketergantungan Hardcode:</strong> Menambah beras atau mengganti harga minyak goreng mengharuskan buka source code HTML dan push ulang ke Git.</span>
            </li>
          </ul>
        </div>

        {/* Transformasi ke Metode Data-Driven Sembako */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-900/40 space-y-3.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <h4>Metode Baru yang Benar: Data-Driven Application SDLC</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>Pemodelan Data Relasional 3NF:</strong> Merancang 10 tabel khusus sembako dengan integritas referensial dan proteksi stok minus.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>Logika Transaksi Inventaris:</strong> Pengurangan stok otomatis saat penjualan, penambahan saat kulakan, dan kartu stok kronologis.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>Algoritma Audit Stock Opname:</strong> Formula penghitungan selisih varian (fisik - sistem) dan klasifikasi susut timbangan / telur pecah.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>Pengujian Validasi Ekstensif:</strong> Pengujian black-box pada kasus batas (stok habis, stok menipis, dan pencegahan stok bernilai minus).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyable Academic Script for Bab III */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Naskah Jawaban Sidang / Bab III: Metode Penelitian & Pengembangan</span>
          </div>

          <button
            onClick={() => handleCopy(bab3Text, 'box_bab3')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            {copiedSection === 'box_bab3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'box_bab3' ? 'Tersalin!' : 'Salin Paragraf'}</span>
          </button>
        </div>

        <div className="p-5 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950/95 whitespace-pre-wrap select-all">
          {bab3Text}
        </div>
      </div>
    </div>
  );
};
