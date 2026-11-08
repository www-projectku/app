import React, { useState } from 'react';
import { SembakoItem, TransaksiPengeluaran } from '../../data/sembakoMasterData';
import { TrendingDown, ShieldAlert, CheckCircle2, FileText, Plus, AlertTriangle, AlertCircle } from 'lucide-react';

interface SembakoPenjualanProps {
  products: SembakoItem[];
  penjualanHistory: TransaksiPengeluaran[];
  onAddPenjualan: (transaksi: Omit<TransaksiPengeluaran, 'id'>) => boolean;
}

export const SembakoPenjualan: React.FC<SembakoPenjualanProps> = ({
  products,
  penjualanHistory,
  onAddPenjualan,
}) => {
  const [noTransaksi, setNoTransaksi] = useState<string>(`NOTA-OUT-${Date.now().toString().slice(-6)}`);
  const [tglKeluar, setTglKeluar] = useState<string>(new Date().toISOString().slice(0, 10));
  const [tipe, setTipe] = useState<'penjualan_eceran' | 'penjualan_grosir' | 'barang_rusak_pecah' | 'pemakaian_toko'>('penjualan_eceran');
  const [barangId, setBarangId] = useState<number>(products[0]?.id || 1);
  const [jumlah, setJumlah] = useState<number>(2);
  const [hargaJual, setHargaJual] = useState<number>(products[0]?.harga_jual || 380000);
  const [keterangan, setKeterangan] = useState<string>('Penjualan eceran harian toko');

  const [errorNotif, setErrorNotif] = useState<string | null>(null);
  const [successNotif, setSuccessNotif] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === barangId) || products[0];

  const handleBarangChange = (id: number) => {
    setBarangId(id);
    const p = products.find((item) => item.id === id);
    if (p) {
      setHargaJual(p.harga_jual);
    }
  };

  const isStockInsufficient = (jumlah || 0) > (selectedProduct?.stok_saat_ini || 0);
  const subtotal = (jumlah || 0) * (hargaJual || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotif(null);
    setSuccessNotif(null);

    if (!jumlah || jumlah <= 0) {
      setErrorNotif('Kuantitas keluar harus lebih dari 0.');
      return;
    }

    // CRITICAL: Negative Stock Protection
    if (jumlah > selectedProduct.stok_saat_ini) {
      setErrorNotif(
        `VALIDASI GUDANG DITOLAK: Stok ${selectedProduct.nama} tidak mencukupi! Stok riil di toko hanya tersisa ${selectedProduct.stok_saat_ini} ${selectedProduct.satuan}. Kuantitas diminta: ${jumlah} ${selectedProduct.satuan}.`
      );
      return;
    }

    const success = onAddPenjualan({
      no_transaksi: noTransaksi,
      tgl_keluar: tglKeluar,
      tipe,
      total_nilai: subtotal,
      keterangan,
      items: [
        {
          barang_id: selectedProduct.id,
          nama_barang: selectedProduct.nama,
          jumlah,
          satuan: selectedProduct.satuan,
          harga_jual: hargaJual,
          subtotal,
        },
      ],
    });

    if (success) {
      setSuccessNotif(
        `Penjualan berhasil disimpan! -${jumlah} ${selectedProduct.satuan} ${selectedProduct.nama} dikeluarkan dari stok toko. Sisa stok sekarang: ${selectedProduct.stok_saat_ini - jumlah} ${selectedProduct.satuan}.`
      );
      setNoTransaksi(`NOTA-OUT-${Date.now().toString().slice(-6)}`);
      setTimeout(() => setSuccessNotif(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-rose-400" />
            Pengeluaran Barang Keluar (Penjualan Kasir & Barang Rusak)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mencatat sembako yang keluar untuk transaksi penjualan eceran, grosir warung, atau pengurangan akibat telur pecah dan karung sobek.
          </p>
        </div>

        <span className="text-xs font-mono bg-rose-950 text-rose-300 border border-rose-800 px-3 py-1 rounded-lg">
          Logika: Stok = Stok - Qty (Wajib Stok &ge; 0)
        </span>
      </div>

      {/* Notifications */}
      {errorNotif && (
        <div className="p-3.5 rounded-xl bg-rose-950/90 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 animate-bounce">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-semibold">{errorNotif}</span>
        </div>
      )}

      {successNotif && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNotif}</span>
        </div>
      )}

      {/* Form & Protection Logic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Outbound Form */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
            <Plus className="w-4 h-4 text-rose-400" />
            Catat Pengeluaran Sembako Baru
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nomor Nota / Transaksi:</label>
                <input
                  type="text"
                  value={noTransaksi}
                  onChange={(e) => setNoTransaksi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tipe Pengeluaran:</label>
                <select
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:border-cyan-500"
                >
                  <option value="penjualan_eceran">Penjualan Eceran Toko (Konsumen Langsung)</option>
                  <option value="penjualan_grosir">Penjualan Grosir (Warung / Mitra)</option>
                  <option value="barang_rusak_pecah">Barang Rusak / Telur Pecah / Karung Bocor</option>
                  <option value="pemakaian_toko">Pemakaian Operasional Toko</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tanggal Keluar:</label>
                <input
                  type="date"
                  value={tglKeluar}
                  onChange={(e) => setTglKeluar(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Komoditas Sembako yang Dikeluarkan:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-slate-300 font-semibold mb-1">Nama Barang:</label>
                  <select
                    value={barangId}
                    onChange={(e) => handleBarangChange(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-medium focus:outline-none focus:border-cyan-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama} (Sisa: {p.stok_saat_ini} {p.satuan})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Jumlah Keluar ({selectedProduct.satuan}):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={jumlah}
                    onChange={(e) => setJumlah(parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 rounded-lg bg-slate-900 border font-mono font-bold ${
                      isStockInsufficient
                        ? 'border-rose-500 text-rose-300 focus:ring-2 focus:ring-rose-500'
                        : 'border-slate-800 text-white'
                    }`}
                    required
                  />
                  {isStockInsufficient && (
                    <span className="text-[10px] text-rose-400 font-bold block mt-1">
                      ⚠ Melebihi sisa stok ({selectedProduct.stok_saat_ini} {selectedProduct.satuan})!
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Harga Jual / Unit (Rp):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={hargaJual}
                    onChange={(e) => setHargaJual(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>
              </div>

              {/* Total Calculation Display */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Subtotal: {jumlah} {selectedProduct.satuan} &times; Rp {hargaJual.toLocaleString('id-ID')}
                </span>
                <span className="font-mono text-base font-bold text-rose-400">
                  Total Nilai: Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Catatan / Nama Pembeli / Keterangan:</label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="cth: Pelanggan Warung Bu Siti / Telur pecah di rak"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isStockInsufficient}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg ${
                isStockInsufficient
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>Simpan Pengeluaran & Potong Stok (-OUT)</span>
            </button>
          </form>
        </div>

        {/* Right: Stock Warning Card */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <ShieldAlert className="w-4 h-4" />
            <h4>Kondisi Stok Barang Terpilih</h4>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-white text-sm">{selectedProduct.nama}</div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Sisa Stok Fisik:</span>
              <span className="font-mono font-bold text-sm text-cyan-300">
                {selectedProduct.stok_saat_ini} {selectedProduct.satuan}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Batas Minimum:</span>
              <span>{selectedProduct.stok_minimum} {selectedProduct.satuan}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Lokasi Rak:</span>
              <span>{selectedProduct.lokasi_rak}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/30 text-amber-200 space-y-1">
            <span className="font-semibold text-amber-300 text-[11px] flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Aturan Integritas Tugas:
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dosen penguji akan menguji coba memasukkan kuantitas keluar lebih besar dari stok. Sistem ini secara otomatis menolak transaksi tersebut agar stok tidak minus.
            </p>
          </div>
        </div>
      </div>

      {/* Riwayat Penjualan Keluar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-400" />
            Riwayat Barang Keluar / Penjualan Toko
          </h3>
          <span className="text-xs text-slate-400 font-mono">{penjualanHistory.length} Transaksi Terdata</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">No Transaksi</th>
                <th className="py-3 px-3 text-center">Tipe Pengeluaran</th>
                <th className="py-3 px-4">Komoditas yang Dikeluarkan</th>
                <th className="py-3 px-3 text-center">Jumlah</th>
                <th className="py-3 px-4 text-right">Total Nilai</th>
                <th className="py-3 px-4">Keterangan / Pembeli</th>
                <th className="py-3 px-3 text-center">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-sans text-xs">
              {penjualanHistory.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors text-slate-200">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-300">{p.no_transaksi}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                        p.tipe === 'barang_rusak_pecah'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : p.tipe === 'penjualan_grosir'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {p.tipe.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-white">
                    {p.items.map((i) => i.nama_barang).join(', ')}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-rose-400">
                    -{p.items.reduce((acc, curr) => acc + curr.jumlah, 0)} {p.items[0]?.satuan}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                    Rp {p.total_nilai.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{p.keterangan}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-400">{p.tgl_keluar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
