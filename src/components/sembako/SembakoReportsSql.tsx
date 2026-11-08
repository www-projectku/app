import React, { useState } from 'react';
import { SembakoItem } from '../../data/sembakoMasterData';
import { SEMBAKO_SQL_DDL } from '../../data/sembakoSchemaData';
import { UserRole } from '../../types/auth';
import { FileText, Copy, Check, Download, Printer, Database, Sparkles, Lock, ShieldAlert, ArrowRight } from 'lucide-react';

interface SembakoReportsSqlProps {
  products: SembakoItem[];
  currentUserRole?: UserRole;
  onSwitchRole?: (role: UserRole) => void;
}

export const SembakoReportsSql: React.FC<SembakoReportsSqlProps> = ({ 
  products,
  currentUserRole = 'admin',
  onSwitchRole
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const isAdmin = currentUserRole === 'admin';

  if (!isAdmin) {
    return (
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-2xl mx-auto space-y-4 my-8 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-2xl">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Akses Dibatasi: Khusus Administrator</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Laporan Valuasi Nilai Total Aset HPP Toko dan Skrip Relasional SQL DDL hanya dapat diakses oleh Pemilik Toko / Super Admin demi kerahasiaan keuangan.
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 max-w-sm mx-auto">
          Peran Anda saat ini: <strong className="text-cyan-300 font-semibold uppercase">Petugas Gudang / Kasir</strong>
        </div>
        {onSwitchRole && (
          <button
            onClick={() => onSwitchRole('admin')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs transition-all shadow-lg shadow-amber-500/20 inline-flex items-center gap-2"
          >
            <span>Tukar ke Akun Admin (H. Ridwan)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  const handleCopySql = () => {
    navigator.clipboard.writeText(SEMBAKO_SQL_DDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([SEMBAKO_SQL_DDL], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'toko_sembako_database.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalAssetHpp = products.reduce((acc, p) => acc + p.stok_saat_ini * p.harga_beli, 0);
  const totalAssetSelling = products.reduce((acc, p) => acc + p.stok_saat_ini * p.harga_jual, 0);
  const potentialProfit = totalAssetSelling - totalAssetHpp;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            Laporan Rekap Stok Sembako & Skrip Database (SQL DDL)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Laporan resmi nilai persediaan toko sembako serta skrip DDL 10 tabel untuk dokumen lampiran laporan tugas/skripsi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan</span>
          </button>

          <button
            onClick={handleCopySql}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin SQL DDL'}</span>
          </button>

          <button
            onClick={handleDownloadSql}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh .sql</span>
          </button>
        </div>
      </div>

      {/* Financial Valuation Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 space-y-3">
        <h3 className="font-bold text-white text-sm">
          Ringkasan Valuasi Keuangan Stok Toko Sembako:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Total Modal Persediaan (HPP Beli):</span>
            <div className="text-lg font-bold text-white mt-1">
              Rp {totalAssetHpp.toLocaleString('id-ID')}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Estimasi Nilai Jual Eceran:</span>
            <div className="text-lg font-bold text-emerald-400 mt-1">
              Rp {totalAssetSelling.toLocaleString('id-ID')}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Proyeksi Laba Kotor (Gross Margin):</span>
            <div className="text-lg font-bold text-cyan-400 mt-1">
              +Rp {potentialProfit.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>

      {/* Printable Report Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white text-sm">
              LEMBAR LAPORAN STATUS PERSEDIAAN TOKO SEMBAKO
            </h4>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Dicetak pada: 07 November 2026 | Periode Audit Toko
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            {products.length} Komoditas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-4">No</th>
                <th className="py-2.5 px-4">SKU</th>
                <th className="py-2.5 px-4">Nama Komoditas</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3 text-center">Satuan</th>
                <th className="py-2.5 px-3 text-center">Stok</th>
                <th className="py-2.5 px-4 text-right">Harga Beli</th>
                <th className="py-2.5 px-4 text-right">Total Aset (HPP)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-sans text-xs">
              {products.map((p, idx) => {
                const totalHpp = p.stok_saat_ini * p.harga_beli;
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 text-slate-200">
                    <td className="py-2.5 px-4 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-mono text-cyan-300">{p.kode}</td>
                    <td className="py-2.5 px-4 font-semibold text-white">{p.nama}</td>
                    <td className="py-2.5 px-3 text-slate-300">{p.kategori}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-400">{p.satuan}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-white">
                      {p.stok_saat_ini}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-300">
                      Rp {p.harga_beli.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-400">
                      Rp {totalHpp.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {p.stok_saat_ini === 0 ? (
                        <span className="text-rose-400 font-bold">Habis</span>
                      ) : p.stok_saat_ini <= p.stok_minimum ? (
                        <span className="text-amber-400 font-bold">Kritis</span>
                      ) : (
                        <span className="text-emerald-400 font-semibold">Aman</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SQL Script Viewer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl space-y-0">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <span className="font-mono text-xs text-slate-300 font-semibold flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            toko_sembako_database.sql (10 Tabel Relasional Sesuai Judul Tugas)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Dialek: MySQL 8.0+ / MariaDB</span>
        </div>

        <div className="p-4 sm:p-5 max-h-[420px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-200 select-all whitespace-pre bg-slate-950">
          {SEMBAKO_SQL_DDL}
        </div>
      </div>
    </div>
  );
};
