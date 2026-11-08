import React, { useState } from 'react';
import { SembakoItem, KartuStokEntry } from '../../data/sembakoMasterData';
import { 
  History, 
  BookOpen, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Package, 
  Calendar,
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine
} from 'lucide-react';

interface SembakoKartuStokProps {
  products: SembakoItem[];
  kartuStokHistory: KartuStokEntry[];
}

export const SembakoKartuStok: React.FC<SembakoKartuStokProps> = ({
  products,
  kartuStokHistory,
}) => {
  const [selectedBarangId, setSelectedBarangId] = useState<number>(products[0]?.id || 1);

  const selectedProduct = products.find((p) => p.id === selectedBarangId) || products[0];

  // Filter entries for selected product
  const entries = kartuStokHistory.filter((k) => k.barang_id === selectedBarangId);

  const totalIn = entries.reduce((acc, curr) => acc + curr.masuk, 0);
  const totalOut = entries.reduce((acc, curr) => acc + curr.keluar, 0);

  return (
    <div className="space-y-6">
      {/* Page Header & Commodity Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <History className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Buku Kartu Stok Sembako (Stock Ledger)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audit trail kronologis pergerakan mutasi masuk, keluar, dan saldo persediaan per komoditas secara berurutan waktu.
          </p>
        </div>

        {/* Commodity selector dropdown */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
          <label className="text-xs text-slate-600 font-semibold pl-2 whitespace-nowrap">Pilih Komoditas:</label>
          <select
            value={selectedBarangId}
            onChange={(e) => setSelectedBarangId(parseInt(e.target.value))}
            className="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-800 font-semibold text-xs focus:outline-none focus:border-emerald-600"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.kode} - {p.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Product KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] text-slate-500 font-medium">Komoditas Dipilih</div>
          <div className="text-sm font-bold text-slate-800 mt-1 truncate">{selectedProduct.nama}</div>
          <div className="text-[11px] text-emerald-600 font-mono mt-0.5">
            {selectedProduct.kode} • {selectedProduct.satuan}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-600" />
            Total Mutasi Masuk
          </div>
          <div className="text-xl font-bold text-emerald-600 font-mono mt-1">
            +{totalIn} <span className="text-xs font-normal text-slate-500">{selectedProduct.satuan.split(' ')[0]}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Kulakan Distributor</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <ArrowUpFromLine className="w-3.5 h-3.5 text-rose-500" />
            Total Mutasi Keluar
          </div>
          <div className="text-xl font-bold text-rose-600 font-mono mt-1">
            -{totalOut} <span className="text-xs font-normal text-slate-500">{selectedProduct.satuan.split(' ')[0]}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Penjualan & Susut</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] text-slate-500 font-medium">Saldo Riil Saat Ini</div>
          <div className="text-xl font-bold text-slate-800 font-mono mt-1">
            {selectedProduct.stok_saat_ini} <span className="text-xs font-normal text-slate-500">{selectedProduct.satuan.split(' ')[0]}</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            Rak: {selectedProduct.lokasi_rak}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Buku Jurnal Mutasi: {selectedProduct.nama}
          </h3>
          <span className="text-xs text-slate-500 font-mono">{entries.length} Catatan Kronologis</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">No. Dokumen / Referensi</th>
                <th className="py-3 px-4">Uraian / Keterangan Transaksi</th>
                <th className="py-3 px-4 text-center">Masuk (+)</th>
                <th className="py-3 px-4 text-center">Keluar (-)</th>
                <th className="py-3 px-4 text-center bg-slate-100/50">Saldo Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {entries.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-600">{item.tgl}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {item.no_dokumen}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{item.keterangan}</td>
                  <td className="py-3 px-4 text-center font-mono">
                    {item.masuk > 0 ? (
                      <span className="font-bold text-emerald-600">+{item.masuk}</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    {item.keluar > 0 ? (
                      <span className="font-bold text-rose-600">-{item.keluar}</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-800 bg-slate-50/50">
                    {item.saldo_akhir} {selectedProduct.satuan.split(' ')[0]}
                  </td>
                </tr>
              ))}

              {entries.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Belum ada riwayat mutasi untuk komoditas ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
