import React, { useState } from 'react';
import { SembakoItem, KartuStokEntry } from '../../data/sembakoMasterData';
import { History, BookOpen, Filter, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';

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
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Buku Kartu Stok Sembako (Stock Ledger & Audit Trail)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Melacak histori mutasi kronologis masuk dan keluar per komoditas sembako untuk memastikan saldo buku akurat dan mencegah kecurangan.
          </p>
        </div>

        {/* Product selector dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-300 font-semibold whitespace-nowrap">Pilih Komoditas:</label>
          <select
            value={selectedBarangId}
            onChange={(e) => setSelectedBarangId(parseInt(e.target.value))}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium text-xs focus:outline-none focus:border-cyan-500"
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
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Komoditas Dipilih</div>
          <div className="text-base font-bold text-white mt-1 truncate">{selectedProduct.nama}</div>
          <div className="text-[11px] text-cyan-300 font-mono mt-0.5">{selectedProduct.kode} | {selectedProduct.satuan}</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-900/40">
          <div className="text-[11px] text-emerald-400 font-medium">Total Kulakan Masuk (+)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">+{totalIn}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Akumulasi pasokan agen</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-rose-900/40">
          <div className="text-[11px] text-rose-300 font-medium">Total Penjualan Keluar (-)</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">-{totalOut}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Penjualan & barang susut</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-cyan-900/40">
          <div className="text-[11px] text-cyan-400 font-medium">Saldo Stok Saat Ini</div>
          <div className="text-2xl font-bold text-white mt-1">
            {selectedProduct.stok_saat_ini}{' '}
            <span className="text-xs text-slate-400 font-normal">{selectedProduct.satuan}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Rak: {selectedProduct.lokasi_rak}</div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            Riwayat Pergerakan Saldo Berjalan (Ledger)
          </h3>
          <span className="text-xs text-slate-400 font-mono">{entries.length} Catatan Ditemukan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">No Dokumen / Bukti</th>
                <th className="py-3 px-4">Keterangan Mutasi</th>
                <th className="py-3 px-3 text-center">Masuk (+)</th>
                <th className="py-3 px-3 text-center">Keluar (-)</th>
                <th className="py-3 px-4 text-center font-bold">Saldo Akhir Berjalan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-sans text-xs">
              {entries.length > 0 ? (
                entries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors text-slate-200">
                    <td className="py-3 px-4 font-mono text-slate-400">{item.tgl}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-cyan-300">{item.no_dokumen}</td>
                    <td className="py-3 px-4 text-slate-300">{item.keterangan}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                      {item.masuk > 0 ? `+${item.masuk}` : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-rose-400">
                      {item.keluar > 0 ? `-${item.keluar}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-extrabold text-sm text-white">
                      {item.saldo_akhir} <span className="text-xs font-normal text-slate-400">{selectedProduct.satuan}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
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
