import React, { useState } from 'react';
import { SembakoItem, DistributorAgen, TransaksiKulakan } from '../../data/sembakoMasterData';
import { Truck, CheckCircle2, Plus, Calendar, DollarSign, FileText, ArrowRight } from 'lucide-react';

interface SembakoKulakanProps {
  products: SembakoItem[];
  distributors: DistributorAgen[];
  kulakanHistory: TransaksiKulakan[];
  onAddKulakan: (transaksi: Omit<TransaksiKulakan, 'id'>) => void;
}

export const SembakoKulakan: React.FC<SembakoKulakanProps> = ({
  products,
  distributors,
  kulakanHistory,
  onAddKulakan,
}) => {
  const [agenId, setAgenId] = useState<number>(distributors[0]?.id || 1);
  const [noFaktur, setNoFaktur] = useState<string>(`FAK-IN-${Date.now().toString().slice(-6)}`);
  const [tglMasuk, setTglMasuk] = useState<string>(new Date().toISOString().slice(0, 10));
  const [barangId, setBarangId] = useState<number>(products[0]?.id || 1);
  const [jumlah, setJumlah] = useState<number>(10);
  const [hargaKulakan, setHargaKulakan] = useState<number>(products[0]?.harga_beli || 345000);
  const [keterangan, setKeterangan] = useState<string>('Kulakan pasokan mingguan dari distributor');
  const [successNotif, setSuccessNotif] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === barangId) || products[0];
  const selectedDistributor = distributors.find((d) => d.id === agenId) || distributors[0];

  const handleBarangChange = (id: number) => {
    setBarangId(id);
    const p = products.find((item) => item.id === id);
    if (p) {
      setHargaKulakan(p.harga_beli);
    }
  };

  const subtotal = (jumlah || 0) * (hargaKulakan || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jumlah || jumlah <= 0) return;

    onAddKulakan({
      no_faktur: noFaktur,
      agen_id: agenId,
      nama_agen: selectedDistributor.nama,
      tgl_masuk: tglMasuk,
      total_bayar: subtotal,
      keterangan,
      items: [
        {
          barang_id: selectedProduct.id,
          nama_barang: selectedProduct.nama,
          jumlah,
          satuan: selectedProduct.satuan,
          harga_kulakan: hargaKulakan,
          subtotal,
        },
      ],
    });

    setSuccessNotif(
      `Kulakan berhasil dicatat! +${jumlah} ${selectedProduct.satuan} ${selectedProduct.nama} ditambahkan ke stok toko. Total tagihan: Rp ${subtotal.toLocaleString('id-ID')}`
    );

    // Refresh faktur
    setNoFaktur(`FAK-IN-${Date.now().toString().slice(-6)}`);
    setTimeout(() => setSuccessNotif(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            Penerimaan Barang Masuk (Kulakan dari Agen / Distributor)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pencatatan pasokan sembako baru yang dibeli dari supplier grosir. Saldo stok di master barang akan otomatis bertambah secara real-time.
          </p>
        </div>

        <span className="text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-lg">
          Logika: Stok = Stok + Qty Masuk
        </span>
      </div>

      {/* Success Notification */}
      {successNotif && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNotif}</span>
        </div>
      )}

      {/* Form & Helper Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Kulakan Form */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
            <Plus className="w-4 h-4 text-emerald-400" />
            Formulir Faktur Kulakan Baru
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nomor Faktur Kulakan:</label>
                <input
                  type="text"
                  value={noFaktur}
                  onChange={(e) => setNoFaktur(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pilih Agen / Distributor:</label>
                <select
                  value={agenId}
                  onChange={(e) => setAgenId(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:border-cyan-500"
                >
                  {distributors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nama} ({d.komoditas_suplai.slice(0, 20)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tanggal Pasokan Masuk:</label>
                <input
                  type="date"
                  value={tglMasuk}
                  onChange={(e) => setTglMasuk(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Rincian Komoditas Sembako yang Dibeli:
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
                        {p.nama} (Stok Saat Ini: {p.stok_saat_ini} {p.satuan})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Jumlah Masuk ({selectedProduct.satuan}):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={jumlah}
                    onChange={(e) => setJumlah(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Harga Kulakan / Unit (Rp):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={hargaKulakan}
                    onChange={(e) => setHargaKulakan(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>
              </div>

              {/* Total Calculation Display */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Subtotal: {jumlah} {selectedProduct.satuan} &times; Rp {hargaKulakan.toLocaleString('id-ID')}
                </span>
                <span className="font-mono text-base font-bold text-emerald-400">
                  Total: Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Catatan / Keterangan Kulakan:</label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              <Truck className="w-4 h-4" />
              <span>Simpan Faktur Kulakan & Tambah Stok Toko (+IN)</span>
            </button>
          </form>
        </div>

        {/* Right: Info Agen */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Truck className="w-4 h-4" />
            <h4>Info Agen Distributor Terpilih</h4>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-white text-sm">{selectedDistributor.nama}</div>
            <div className="text-slate-400">Sales: {selectedDistributor.kontak_sales}</div>
            <div className="text-cyan-300 font-mono">WA: {selectedDistributor.telepon}</div>
            <div className="text-slate-500 text-[11px]">{selectedDistributor.alamat}</div>
            <div className="text-amber-400 text-[11px] mt-1">
              Komoditas: {selectedDistributor.komoditas_suplai}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-slate-300 space-y-1">
            <span className="font-semibold text-emerald-300 text-[11px]">Audit Trail Otomatis:</span>
            <p className="text-[11px] text-slate-400">
              Menyimpan faktur ini akan otomatis memicu pencatatan saldo berjalan di tabel <code>kartu_stok_sembako</code> dan memperbarui HPP stok.
            </p>
          </div>
        </div>
      </div>

      {/* Riwayat Faktur Kulakan Masuk */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Riwayat Faktur Kulakan Masuk
          </h3>
          <span className="text-xs text-slate-400 font-mono">{kulakanHistory.length} Transaksi Terdata</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">No Faktur</th>
                <th className="py-3 px-4">Distributor / Agen</th>
                <th className="py-3 px-4">Rincian Komoditas</th>
                <th className="py-3 px-3 text-center">Jumlah</th>
                <th className="py-3 px-4 text-right">Total Tagihan</th>
                <th className="py-3 px-3 text-center">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-sans text-xs">
              {kulakanHistory.map((k) => (
                <tr key={k.id} className="hover:bg-slate-800/40 transition-colors text-slate-200">
                  <td className="py-3 px-4 font-mono font-semibold text-cyan-300">{k.no_faktur}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{k.nama_agen}</div>
                    <div className="text-[10px] text-slate-500">{k.keterangan}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-emerald-300">
                    {k.items.map((i) => i.nama_barang).join(', ')}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                    +{k.items.reduce((acc, curr) => acc + curr.jumlah, 0)} {k.items[0]?.satuan}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">
                    Rp {k.total_bayar.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-400">{k.tgl_masuk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
