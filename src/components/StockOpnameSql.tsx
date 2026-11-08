import React, { useState } from 'react';
import { INVENTORY_MYSQL_DDL, INVENTORY_QUERIES } from '../data/inventorySchemaData';
import { Copy, Check, Download, FileCode, Sparkles, Terminal, BookOpen, Play } from 'lucide-react';

export const StockOpnameSql: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedQueryIndex, setSelectedQueryIndex] = useState<number>(0);
  const [queryCopied, setQueryCopied] = useState<boolean>(false);

  const handleCopyDdl = () => {
    navigator.clipboard.writeText(INVENTORY_MYSQL_DDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDdl = () => {
    const blob = new Blob([INVENTORY_MYSQL_DDL], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stock_opname_inventory_mysql.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeQuery = INVENTORY_QUERIES[selectedQueryIndex];

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(activeQuery.sql);
    setQueryCopied(true);
    setTimeout(() => setQueryCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            Skrip DDL Database Stock Opname & Trigger Otomatis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Skrip SQL MySQL/MariaDB siap pakai di phpMyAdmin lengkap dengan Database Trigger untuk auto-update stok dan proteksi stok minus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyDdl}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin DDL SQL</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadDdl}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh .sql</span>
          </button>
        </div>
      </div>

      {/* Trigger & Integrity Notice */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-white">Logika Inti Database yang Wajib Diterapkan:</span>
          <p className="text-slate-400 leading-relaxed">
            Skrip ini menyertakan trigger <code className="text-cyan-300 font-mono">trg_after_insert_transaction_item</code>. Setiap kali ada barang masuk (IN), kolom <code className="text-emerald-300 font-mono">products.current_stock</code> bertambah secara atomik. Jika ada barang keluar (OUT), sistem memverifikasi ketersediaan stok; jika stok tidak cukup, sistem melempar sinyal error <code className="text-rose-300 font-mono">SIGNAL SQLSTATE '45000'</code> sehingga stok mustahil bernilai negatif.
          </p>
        </div>
      </div>

      {/* SQL Script Viewer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <span className="font-mono text-xs text-slate-300 font-semibold">
            stock_opname_inventory_mysql.sql (8 Tabel + Trigger)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Dialek: MySQL 8.0+ / MariaDB 10.4+</span>
        </div>

        <div className="p-4 sm:p-5 max-h-[420px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-200 select-all whitespace-pre bg-slate-950">
          {INVENTORY_MYSQL_DDL}
        </div>
      </div>

      {/* 4 Crucial Stock Queries for Reports */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          4 Query SQL Krusial untuk Laporan Stock Opname & Pergudangan
        </h3>

        {/* Query Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INVENTORY_QUERIES.map((q, idx) => {
            const isSelected = selectedQueryIndex === idx;
            return (
              <button
                key={q.id}
                onClick={() => setSelectedQueryIndex(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="text-xs font-bold text-white mb-1">{q.title}</div>
                <div className="text-[11px] text-slate-400 truncate">{q.description}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Query Box */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Penjelasan Query: {activeQuery.explanation}
            </span>
            <button
              onClick={handleCopyQuery}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              {queryCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{queryCopied ? 'Tersalin' : 'Salin Query'}</span>
            </button>
          </div>

          <pre className="p-3.5 rounded-lg bg-slate-950 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
            {activeQuery.sql}
          </pre>
        </div>
      </div>
    </div>
  );
};
