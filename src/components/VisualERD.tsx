import React, { useState } from 'react';
import { TABLES, RELATIONS } from '../data/databaseSchemaData';
import { TableDefinition } from '../types/database';
import { Key, Link as LinkIcon, Database, Eye, Filter, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface VisualERDProps {
  onSelectTableForDictionary: (tableName: string) => void;
}

export const VisualERD: React.FC<VisualERDProps> = ({ onSelectTableForDictionary }) => {
  const [selectedTableId, setSelectedTableId] = useState<string | null>('services');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'full' | 'compact'>('full');

  const filteredTables = TABLES.filter((t) => {
    if (filterCategory === 'all') return true;
    return t.category === filterCategory;
  });

  const selectedTable = TABLES.find((t) => t.id === selectedTableId) || TABLES[0];

  const getRelationsForTable = (tableId: string) => {
    return RELATIONS.filter((r) => r.fromTable === tableId || r.toTable === tableId);
  };

  return (
    <div className="space-y-6">
      {/* ERD Control Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Visual Entity Relationship Diagram (ERD)
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Relasional 3NF
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Struktur hubungan tabel yang dirancang untuk website Tugas-CP. Klik tabel untuk memeriksa dependensi foreign key.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Kategori:
            </span>
            {[
              { id: 'all', label: 'Semua (6)' },
              { id: 'catalog', label: 'Katalog' },
              { id: 'interaction', label: 'Interaksi' },
              { id: 'core', label: 'Profil' },
              { id: 'auth', label: 'Auth' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterCategory(f.id)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  filterCategory === f.id
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('full')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'full'
                  ? 'bg-slate-700 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Kolom
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'compact'
                  ? 'bg-slate-700 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ringkas (PK/FK Saja)
            </button>
          </div>
        </div>
      </div>

      {/* Relational Indicators Bar */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap text-slate-300">
          <span className="font-semibold text-slate-400">Keterangan Relasi:</span>
          <span className="inline-flex items-center gap-1.5 text-cyan-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <code className="font-mono bg-slate-900 px-1 py-0.5 rounded">categories (1) ── (N) services</code>
            <span className="text-slate-500 text-[11px]">(Foreign Key: category_id)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <code className="font-mono bg-slate-900 px-1 py-0.5 rounded">services (1) ── (N) testimonials</code>
            <span className="text-slate-500 text-[11px]">(Foreign Key: service_id, Opsional)</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-xs">
          <span className="flex items-center gap-1">
            <Key className="w-3.5 h-3.5 text-amber-400" /> Primary Key (PK)
          </span>
          <span className="flex items-center gap-1">
            <LinkIcon className="w-3.5 h-3.5 text-cyan-400" /> Foreign Key (FK)
          </span>
        </div>
      </div>

      {/* Grid of Interactive ERD Table Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTables.map((table) => {
          const isSelected = selectedTableId === table.id;
          const tableRelations = getRelationsForTable(table.id);
          const hasRelations = tableRelations.length > 0;

          const displayedColumns = viewMode === 'compact'
            ? table.columns.filter((col) => col.keyType === 'PK' || col.keyType === 'FK')
            : table.columns;

          return (
            <div
              key={table.id}
              onClick={() => setSelectedTableId(table.id)}
              className={`rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/50 ring-2 ring-cyan-500/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Table Card Header */}
              <div>
                <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-mono font-bold text-sm text-white flex items-center gap-1.5">
                        {table.name}
                        {hasRelations && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800">
                            Relational
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{table.displayName}</div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {table.columns.length} kolom
                  </span>
                </div>

                {/* Table Columns List */}
                <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto font-mono text-xs">
                  {displayedColumns.map((col, idx) => {
                    const isPK = col.keyType === 'PK';
                    const isFK = col.keyType === 'FK';
                    const isUnique = col.keyType === 'UNIQUE';

                    return (
                      <div
                        key={idx}
                        className={`px-3.5 py-2 flex items-center justify-between gap-2 transition-colors ${
                          isPK
                            ? 'bg-amber-950/20 text-amber-200'
                            : isFK
                            ? 'bg-cyan-950/20 text-cyan-200'
                            : 'text-slate-300 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isPK && (
                            <span title="Primary Key">
                              <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            </span>
                          )}
                          {isFK && (
                            <span title="Foreign Key">
                              <LinkIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            </span>
                          )}
                          {!isPK && !isFK && <span className="w-3.5 h-3.5 shrink-0" />}

                          <span className="font-medium truncate text-white">{col.name}</span>
                          {isUnique && (
                            <span className="text-[10px] px-1 rounded bg-slate-800 text-slate-400 font-sans">
                              UNIQUE
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 text-[11px]">
                          <span className="text-slate-400 font-sans text-[11px]">{col.type}</span>
                          {!col.nullable && (
                            <span className="text-rose-400 text-[10px] font-sans" title="Not Null">
                              *
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer / Quick Actions */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                  {table.description.slice(0, 38)}...
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTableForDictionary(table.name);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] font-medium"
                >
                  <span>Detail Kamus</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Table Deep-Dive Inspector */}
      {selectedTable && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-white font-mono">
                  Detail Tabel: {selectedTable.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                  {selectedTable.displayName}
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">{selectedTable.description}</p>
            </div>

            <button
              onClick={() => onSelectTableForDictionary(selectedTable.name)}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Buka di Kamus Data</span>
            </button>
          </div>

          {/* Relation Details for this Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Hubungan & Integritas Referensial
              </span>
              {getRelationsForTable(selectedTable.id).length > 0 ? (
                <ul className="space-y-1.5">
                  {getRelationsForTable(selectedTable.id).map((r) => (
                    <li key={r.id} className="text-slate-200 flex items-center gap-1.5 font-mono">
                      <LinkIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{r.label}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400">
                  Tabel ini berdiri sendiri (independen) dan tidak memerlukan Foreign Key luar untuk beroperasi secara efisien.
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Peran Normalisasi (Database Normalization)
              </span>
              <p className="text-slate-300 leading-relaxed">
                Tabel ini memenuhi <strong>Bentuk Normal Ketiga (3NF)</strong>: seluruh atribut bukan-kunci bergantung penuh pada Primary Key (`id`), tanpa ketergantungan transitif.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
