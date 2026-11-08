import React, { useState } from 'react';
import { TABLES } from '../data/databaseSchemaData';
import { TableDefinition, ColumnDefinition } from '../types/database';
import { Database, Search, Filter, Key, Link as LinkIcon, Check, Copy } from 'lucide-react';

interface DataDictionaryProps {
  initialSelectedTable?: string;
}

export const DataDictionary: React.FC<DataDictionaryProps> = ({ initialSelectedTable }) => {
  const [selectedTable, setSelectedTable] = useState<string>(initialSelectedTable || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [keyFilter, setKeyFilter] = useState<'all' | 'PK' | 'FK'>('all');
  const [copiedCol, setCopiedCol] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCol(id);
    setTimeout(() => setCopiedCol(null), 2000);
  };

  const tablesToDisplay = selectedTable === 'all' 
    ? TABLES 
    : TABLES.filter((t) => t.name === selectedTable);

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Kamus Data (Data Dictionary) Lengkap
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Spesifikasi detail setiap atribut, tipe data, batasan (constraints), dan peran normalisasi untuk dokumentasi tugas dan pengembangan.
          </p>
        </div>

        {/* Search & Key Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kolom atau tipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
            />
          </div>

          {/* Key Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {(['all', 'PK', 'FK'] as const).map((k) => (
              <button
                key={k}
                onClick={() => setKeyFilter(k)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  keyFilter === k ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                {k === 'all' ? 'Semua Kunci' : k}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedTable('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            selectedTable === 'all'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Semua Tabel ({TABLES.length})
        </button>
        {TABLES.map((t) => (
          <button
            key={t.name}
            onClick={() => setSelectedTable(t.name)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
              selectedTable === t.name
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {t.name} ({t.columns.length})
          </button>
        ))}
      </div>

      {/* Tables Content */}
      <div className="space-y-6">
        {tablesToDisplay.map((table) => {
          const matchingColumns = table.columns.filter((col) => {
            const matchesSearch =
              col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              col.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
              col.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesKey =
              keyFilter === 'all' ||
              (keyFilter === 'PK' && col.keyType === 'PK') ||
              (keyFilter === 'FK' && col.keyType === 'FK');

            return matchesSearch && matchesKey;
          });

          if (matchingColumns.length === 0) return null;

          return (
            <div key={table.name} className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-lg">
              {/* Table Header Section */}
              <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-cyan-400 font-mono text-sm font-bold">
                    `{table.name}`
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{table.displayName}</h3>
                    <p className="text-xs text-slate-400">{table.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {matchingColumns.length} dari {table.columns.length} kolom ditampilkan
                  </span>
                </div>
              </div>

              {/* Responsive Columns Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-medium">
                      <th className="py-3 px-4 w-44">Nama Kolom</th>
                      <th className="py-3 px-4 w-36">Tipe Data</th>
                      <th className="py-3 px-3 w-24">Kunci</th>
                      <th className="py-3 px-3 w-24">Nullable</th>
                      <th className="py-3 px-3 w-32">Nilai Default</th>
                      <th className="py-3 px-4">Deskripsi & Peran Normalisasi</th>
                      <th className="py-3 px-3 w-16 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {matchingColumns.map((col, idx) => {
                      const isPK = col.keyType === 'PK';
                      const isFK = col.keyType === 'FK';
                      const colId = `${table.name}_${col.name}`;

                      return (
                        <tr
                          key={idx}
                          className="hover:bg-slate-800/40 transition-colors text-slate-300 group"
                        >
                          {/* Column Name */}
                          <td className="py-3 px-4 font-mono font-semibold text-white">
                            <div className="flex items-center gap-1.5">
                              {col.name}
                              {col.keyType === 'UNIQUE' && (
                                <span className="text-[10px] px-1 rounded bg-slate-800 text-slate-400 font-sans font-normal">
                                  UNIQUE
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Data Type */}
                          <td className="py-3 px-4 font-mono text-cyan-300 text-[11px]">
                            {col.type}
                          </td>

                          {/* Key */}
                          <td className="py-3 px-3">
                            {isPK && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                <Key className="w-3 h-3" /> PK
                              </span>
                            )}
                            {isFK && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                                <LinkIcon className="w-3 h-3" /> FK
                              </span>
                            )}
                            {!isPK && !isFK && (
                              <span className="text-slate-500 text-[11px]">-</span>
                            )}
                          </td>

                          {/* Nullable */}
                          <td className="py-3 px-3">
                            {col.nullable ? (
                              <span className="text-slate-400">Boleh NULL</span>
                            ) : (
                              <span className="text-rose-400 font-semibold font-mono text-[11px]">NOT NULL</span>
                            )}
                          </td>

                          {/* Default */}
                          <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                            {col.defaultValue || <span className="text-slate-600">-</span>}
                          </td>

                          {/* Description & Normalization role */}
                          <td className="py-3 px-4">
                            <p className="text-slate-200">{col.description}</p>
                            {col.references && (
                              <div className="mt-1 text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                                <LinkIcon className="w-3 h-3" /> Merujuk ke: {col.references.table}.{col.references.column}
                              </div>
                            )}
                            {col.normalizationRole && (
                              <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                {col.normalizationRole}
                              </div>
                            )}
                          </td>

                          {/* Copy button */}
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => handleCopy(`${col.name} ${col.type}`, colId)}
                              title="Salin definisi kolom"
                              className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                            >
                              {copiedCol === colId ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
