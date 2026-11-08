import React, { useState } from 'react';
import { INVENTORY_TABLES, INVENTORY_RELATIONS } from '../data/inventorySchemaData';
import { TableDefinition } from '../types/database';
import { Database, Key, Link as LinkIcon, Filter, ArrowRight, ShieldCheck, Layers } from 'lucide-react';

export const StockOpnameErd: React.FC = () => {
  const [selectedTableId, setSelectedTableId] = useState<string>('stock_opname_details');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'full' | 'compact'>('full');

  const filteredTables = INVENTORY_TABLES.filter((t) => {
    if (filterCategory === 'all') return true;
    return t.category === filterCategory;
  });

  const selectedTable = INVENTORY_TABLES.find((t) => t.id === selectedTableId) || INVENTORY_TABLES[0];

  const getRelationsForTable = (tableId: string) => {
    return INVENTORY_RELATIONS.filter((r) => r.fromTable === tableId || r.toTable === tableId);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              ERD Relasional: Sistem Stock Opname & Pergudangan
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                8 Tabel Terhubung (3NF)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Desain relasi lengkap yang menghubungkan master barang, dokumen mutasi masuk/keluar, dan lembar audit fisik stock opname.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {[
              { id: 'all', label: 'Semua (8)' },
              { id: 'inventory', label: 'Stok & Mutasi' },
              { id: 'audit', label: 'Stock Opname' },
              { id: 'catalog', label: 'Kategori' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterCategory(f.id)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  filterCategory === f.id
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* View mode */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('full')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'full' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Kolom
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'compact' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ringkas
            </button>
          </div>
        </div>
      </div>

      {/* Relations Summary Bar */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap text-slate-300">
          <span className="font-semibold text-slate-400">Jalur Relasi Krusial:</span>
          <span className="text-emerald-300 font-mono bg-slate-900 px-2 py-0.5 rounded">
            products (1) ── (N) stock_transaction_items
          </span>
          <span className="text-cyan-300 font-mono bg-slate-900 px-2 py-0.5 rounded">
            products (1) ── (N) stock_opname_details
          </span>
          <span className="text-amber-300 font-mono bg-slate-900 px-2 py-0.5 rounded">
            stock_opnames (1) ── (N) stock_opname_details
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-xs">
          <span className="flex items-center gap-1">
            <Key className="w-3.5 h-3.5 text-amber-400" /> PK
          </span>
          <span className="flex items-center gap-1">
            <LinkIcon className="w-3.5 h-3.5 text-cyan-400" /> FK
          </span>
        </div>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTables.map((table) => {
          const isSelected = selectedTableId === table.id;
          const tableRelations = getRelationsForTable(table.id);

          const displayedColumns = viewMode === 'compact'
            ? table.columns.filter((c) => c.keyType === 'PK' || c.keyType === 'FK')
            : table.columns;

          return (
            <div
              key={table.id}
              onClick={() => setSelectedTableId(table.id)}
              className={`rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-950/50 ring-2 ring-emerald-500/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                {/* Table Header */}
                <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800 text-emerald-400">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-mono font-bold text-sm text-white">
                        {table.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{table.displayName}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {table.columns.length} col
                  </span>
                </div>

                {/* Columns */}
                <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto font-mono text-xs">
                  {displayedColumns.map((col, idx) => {
                    const isPK = col.keyType === 'PK';
                    const isFK = col.keyType === 'FK';

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
                        </div>

                        <span className="text-slate-400 font-sans text-[11px] shrink-0">
                          {col.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span className="truncate max-w-[200px]">{table.description.slice(0, 36)}...</span>
                <span className="text-emerald-400 font-medium">Detail →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Table Inspection */}
      {selectedTable && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-white font-mono">
                  Detail Tabel Pergudangan: `{selectedTable.name}`
                </h3>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {selectedTable.displayName}
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">{selectedTable.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Hubungan Kunci (Foreign Key & Relasi)
              </span>
              {getRelationsForTable(selectedTable.id).length > 0 ? (
                <ul className="space-y-1.5 font-mono">
                  {getRelationsForTable(selectedTable.id).map((r) => (
                    <li key={r.id} className="text-slate-200 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{r.label}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400">Tabel master independen.</p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Fungsi dalam Alur Stock Opname
              </span>
              <p className="text-slate-300 leading-relaxed">
                Tabel ini menyimpan data krusial untuk pelaporan mutasi dan audit fisik persediaan, menjamin catatan buku inventaris selalu sinkron dengan kondisi gudang.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
