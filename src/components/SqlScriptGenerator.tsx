import React, { useState } from 'react';
import { 
  MYSQL_DDL, 
  POSTGRES_DDL, 
  PRISMA_SCHEMA, 
  FIREBASE_SCHEMA, 
  SEED_DATA_SQL 
} from '../data/databaseSchemaData';
import { SqlDialect } from '../types/database';
import { Copy, Check, Download, FileCode, Sparkles, Terminal, BookOpen } from 'lucide-react';

export const SqlScriptGenerator: React.FC = () => {
  const [activeDialect, setActiveDialect] = useState<SqlDialect>('mysql');
  const [copied, setCopied] = useState<boolean>(false);

  const getScriptContent = (): { code: string; filename: string; language: string; notes: string } => {
    switch (activeDialect) {
      case 'mysql':
        return {
          code: MYSQL_DDL,
          filename: 'tugas_cp_mysql.sql',
          language: 'sql',
          notes: 'Dialek MySQL/MariaDB ini langsung siap dieksekusi di phpMyAdmin (XAMPP/Laragon) atau CLI mysql. Menggunakan InnoDB engine dan utf8mb4 untuk dukungan emoji & karakter lengkap.',
        };
      case 'postgres':
        return {
          code: POSTGRES_DDL,
          filename: 'tugas_cp_postgres.sql',
          language: 'sql',
          notes: 'Dialek PostgreSQL modern dengan dukungan native ENUM types, timestamptz (timezone-aware), check constraints (rating 1-5), dan partial indexing.',
        };
      case 'prisma':
        return {
          code: PRISMA_SCHEMA,
          filename: 'schema.prisma',
          language: 'prisma',
          notes: 'Skema Prisma ORM untuk Next.js, Remix, atau Express TypeScript. Dilengkapi relasi otomatis (@relation) dan mapping nama tabel database.',
        };
      case 'firebase':
        return {
          code: FIREBASE_SCHEMA,
          filename: 'firestore.rules',
          language: 'javascript',
          notes: 'Skema NoSQL Firestore + Aturan Keamanan (Security Rules). Sangat cocok jika Anda tetap ingin hosting di GitHub Pages tanpa sewa server backend, karena bisa dipanggil langsung via JavaScript SDK.',
        };
      case 'seed':
        return {
          code: SEED_DATA_SQL,
          filename: 'tugas_cp_seed_data.sql',
          language: 'sql',
          notes: 'Data dummy awal (Seeding) berbahasa Indonesia: profil perusahaan, kategori layanan, produk portofolio, review klien bintang 5, dan tiket pesan kontak untuk langsung diuji.',
        };
      default:
        return { code: '', filename: 'script.sql', language: 'sql', notes: '' };
    }
  };

  const current = getScriptContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([current.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = current.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Dialect Selector */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Generator Skrip SQL & Skema ORM Siap Eksekusi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pilih dialek database yang Anda gunakan untuk tugas atau proyek produksi.
          </p>
        </div>

        {/* Dialect Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto no-scrollbar">
          {[
            { id: 'mysql', label: 'MySQL / MariaDB (XAMPP)' },
            { id: 'postgres', label: 'PostgreSQL (Supabase)' },
            { id: 'prisma', label: 'Prisma ORM' },
            { id: 'firebase', label: 'Firebase Firestore' },
            { id: 'seed', label: 'Dummy Seed Data' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDialect(tab.id as SqlDialect)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeDialect === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dialect Info Banner */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-300">
        <BookOpen className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-white">Catatan Teknis Implementasi:</div>
          <p className="text-slate-400 text-xs leading-relaxed">{current.notes}</p>
        </div>
      </div>

      {/* Code Editor / Viewer Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        {/* Editor Toolbar */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="ml-2 font-mono text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              {current.filename}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Kode</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh File</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-5 max-h-[550px] overflow-y-auto font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200 select-all whitespace-pre bg-slate-950/95">
          {current.code}
        </div>
      </div>
    </div>
  );
};
