import React, { useState } from 'react';
import { SembakoItem } from '../../data/sembakoMasterData';
import { SEMBAKO_SQL_DDL } from '../../data/sembakoSchemaData';
import { UserRole } from '../../types/auth';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Database, 
  Lock, 
  ArrowRight,
  BadgeDollarSign,
  PieChart,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface SembakoReportsSqlProps {
  products: SembakoItem[];
  currentUserRole?: UserRole;
  onNavigateToLogin?: () => void;
}

export const SembakoReportsSql: React.FC<SembakoReportsSqlProps> = ({ 
  products,
  currentUserRole = 'admin',
  onNavigateToLogin
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeReportTab, setActiveReportTab] = useState<'valuation' | 'sql'>('valuation');
  const isAdmin = currentUserRole === 'admin';

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-xl mx-auto space-y-4 my-8 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto text-xl">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-800">Akses Dibatasi: Khusus Administrator</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Laporan Valuasi Keuangan Aset Modal Toko dan Skrip Database SQL DDL hanya dapat diakses oleh Pemilik Toko / Super Admin.
          </p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 max-w-xs mx-auto">
          Peran Anda saat ini: <strong className="text-blue-700 font-semibold uppercase">Petugas Gudang (Akses Terbatas)</strong>
        </div>
        {onNavigateToLogin && (
          <button
            onClick={onNavigateToLogin}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs inline-flex items-center gap-1.5"
          >
            <span>Login sebagai Administrator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // Financial calculations
  const totalHpp = products.reduce((acc, p) => acc + p.stok_saat_ini * p.harga_beli, 0);
  const totalOmsetPotensial = products.reduce((acc, p) => acc + p.stok_saat_ini * p.harga_jual, 0);
  const totalPotensiLaba = totalOmsetPotensial - totalHpp;
  const marginPersen = totalHpp > 0 ? ((totalPotensiLaba / totalHpp) * 100).toFixed(1) : '0';

  // Group by category
  const categories = Array.from(new Set(products.map((p) => p.kategori)));
  const categorySummary = categories.map((cat) => {
    const items = products.filter((p) => p.kategori === cat);
    const subHpp = items.reduce((acc, i) => acc + i.stok_saat_ini * i.harga_beli, 0);
    const subOmset = items.reduce((acc, i) => acc + i.stok_saat_ini * i.harga_jual, 0);
    const totalUnit = items.reduce((acc, i) => acc + i.stok_saat_ini, 0);
    return {
      kategori: cat,
      itemCount: items.length,
      totalUnit,
      subHpp,
      subOmset,
      potensiLaba: subOmset - subHpp,
    };
  });

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
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-tab Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <BadgeDollarSign className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Laporan Keuangan & Database Toko</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Valuasi modal persediaan barang, proyeksi margin laba kotor, dan skema relasional database MySQL DDL normalisasi 3NF.
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveReportTab('valuation')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeReportTab === 'valuation'
                ? 'bg-white text-slate-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Valuasi Persediaan (HPP)
          </button>
          <button
            onClick={() => setActiveReportTab('sql')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeReportTab === 'sql'
                ? 'bg-white text-slate-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skrip SQL DDL (3NF)
          </button>
        </div>
      </div>

      {/* TAB 1: VALUATION */}
      {activeReportTab === 'valuation' && (
        <div className="space-y-6">
          {/* 3 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Total Nilai Modal Persediaan (HPP)</div>
              <div className="text-2xl font-bold text-slate-800 font-mono mt-1">
                Rp {totalHpp.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Total aset bahan pokok yang tersimpan</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Potensi Nilai Penjualan Eceran</div>
              <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">
                Rp {totalOmsetPotensial.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">Jika seluruh saldo komoditas terjual</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Proyeksi Margin Laba Kotor</div>
              <div className="text-2xl font-bold text-blue-600 font-mono mt-1">
                Rp {totalPotensiLaba.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-blue-700 font-semibold mt-1">
                Margin Rata-rata: ~{marginPersen}%
              </div>
            </div>
          </div>

          {/* Breakdown Table per Category */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Rincian Valuasi Stok Berdasarkan Kategori Komoditas</h3>
              <span className="text-xs text-slate-500">{categories.length} Kategori</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="py-3 px-4">Kategori Komoditas</th>
                    <th className="py-3 px-4 text-center">Jumlah SKU</th>
                    <th className="py-3 px-4 text-center">Volume Total</th>
                    <th className="py-3 px-4 text-right">Nilai Modal (HPP)</th>
                    <th className="py-3 px-4 text-right">Estimasi Omset Jual</th>
                    <th className="py-3 px-4 text-right">Potensi Keuntungan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {categorySummary.map((c) => (
                    <tr key={c.kategori} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">{c.kategori}</td>
                      <td className="py-3 px-4 text-center font-mono">{c.itemCount} SKU</td>
                      <td className="py-3 px-4 text-center font-mono">{c.totalUnit} unit</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                        Rp {c.subHpp.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                        Rp {c.subOmset.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-blue-600">
                        Rp {c.potensiLaba.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold border-t border-slate-200">
                    <td colSpan={3} className="py-3 px-4 text-slate-900">
                      TOTAL KESELURUHAN PERSEDIAAN TOKO:
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-900">
                      Rp {totalHpp.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700">
                      Rp {totalOmsetPotensial.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-blue-700">
                      Rp {totalPotensiLaba.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SQL DDL */}
      {activeReportTab === 'sql' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                Skrip SQL DDL Database Toko Sembako (MySQL / MariaDB)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Struktur 10 tabel relasional normalisasi 3NF, kunci asing (foreign key), trigger audit, dan batasan CHECK anti-stok minus untuk lampiran skripsi.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Skrip SQL'}</span>
              </button>

              <button
                onClick={handleDownloadSql}
                className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Unduh File .sql</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 overflow-hidden shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 mb-2 border-b border-slate-800 font-mono">
              <span>Dialek: MySQL 8.0 / MariaDB 10.4+ (InnoDB Engine)</span>
              <span>10 Tabel Relasional Terhubung</span>
            </div>
            <pre className="text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto max-h-[500px] selection:bg-emerald-500 selection:text-black">
              <code>{SEMBAKO_SQL_DDL}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
