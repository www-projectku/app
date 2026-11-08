import React, { useState } from 'react';
import { SembakoItem, TransaksiPengeluaran } from '../../data/sembakoMasterData';
import { 
  ArrowUpFromLine, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Plus, 
  AlertTriangle, 
  AlertCircle,
  Clock,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';

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
        `Pengeluaran berhasil disimpan! -${jumlah} ${selectedProduct.satuan} ${selectedProduct.nama} dikeluarkan dari stok toko. Sisa stok sekarang: ${selectedProduct.stok_saat_ini - jumlah} ${selectedProduct.satuan}.`
      );
      setNoTransaksi(`NOTA-OUT-${Date.now().toString().slice(-6)}`);
      setTimeout(() => setSuccessNotif(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <ArrowUpFromLine className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Barang Keluar & Penjualan Sembako</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan mutasi pengurangan stok untuk penjualan eceran warga, pesanan warung kelontong mitra, maupun pengurangan akibat telur pecah atau karung bocor.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Proteksi Anti-Stok Minus Aktif</span>
        </div>
      </div>

      {/* Notifications */}
      {errorNotif && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-xs animate-in fade-in duration-200">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorNotif}</div>
          <button onClick={() => setErrorNotif(null)} className="text-rose-700 font-bold">✕</button>
        </div>
      )}

      {successNotif && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-2 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successNotif}</span>
          </div>
          <button onClick={() => setSuccessNotif(null)} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* Form & Guard Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-600" />
              Pencatatan Bukti Pengeluaran Barang
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-200">
              -Stok Berkurang Otomatis
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Bukti Transaksi:
                </label>
                <input
                  type="text"
                  required
                  value={noTransaksi}
                  onChange={(e) => setNoTransaksi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 font-mono text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tanggal Pengeluaran:
                </label>
                <input
                  type="date"
                  required
                  value={tglKeluar}
                  onChange={(e) => setTglKeluar(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tipe Pengeluaran:
                </label>
                <select
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 text-slate-800 bg-white font-medium"
                >
                  <option value="penjualan_eceran">Penjualan Eceran Toko</option>
                  <option value="penjualan_grosir">Penjualan Grosir Warung</option>
                  <option value="barang_rusak_pecah">Barang Rusak / Telur Pecah</option>
                  <option value="pemakaian_toko">Pemakaian Sendiri / Operasional</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Komoditas Sembako yang Dikeluarkan:
                </label>
                <select
                  value={barangId}
                  onChange={(e) => handleBarangChange(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 text-slate-800 bg-white font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} (Stok Saat Ini: {p.stok_saat_ini} {p.satuan})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jumlah ({selectedProduct?.satuan.split(' ')[0]}):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct?.stok_saat_ini || 1}
                    required
                    value={jumlah}
                    onChange={(e) => setJumlah(parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 rounded-lg border font-mono font-bold text-slate-800 focus:outline-none ${
                      isStockInsufficient
                        ? 'border-rose-500 bg-rose-50 text-rose-800'
                        : 'border-slate-200 focus:border-rose-500 bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Harga Satuan (Rp):
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={hargaJual}
                    onChange={(e) => setHargaJual(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 font-mono text-slate-800 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Negative stock live warning */}
            {isStockInsufficient && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>
                  <strong>Peringatan Stok Kurang:</strong> Kuantitas ({jumlah}) melebihi stok tersedia ({selectedProduct?.stok_saat_ini} {selectedProduct?.satuan}).
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Keterangan / Pembeli:
                </label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Contoh: Bu Siti (Warung Kelontong Blok A)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Total Nilai Transaksi:
                </label>
                <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-800 text-sm">
                  Rp {subtotal.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isStockInsufficient}
              className={`w-full py-2.5 rounded-lg text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 ${
                isStockInsufficient
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <ArrowUpFromLine className="w-4 h-4" />
              <span>Simpan Pengeluaran Barang (-Stok)</span>
            </button>
          </form>
        </div>

        {/* Right 1 Col: Anti-Stok Minus Explanation */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Integritas Data & Proteksi Stok Minus
          </h3>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <strong className="text-slate-800 block">CHECK (stok &ge; 0) Constraint</strong>
              <p className="text-slate-500">
                Sistem database secara ketat menolak mutasi keluar apabila stok barang di rak tidak mencukupi, mencegah deviasi data fiktif pada saat audit.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <strong className="text-slate-800 block">Pemisahan Komoditas Rusak</strong>
              <p className="text-slate-500">
                Telur pecah atau karung beras yang sobek di gudang wajib dicatat melalui tipe "Barang Rusak / Pecah" agar tercatat di berita acara susut fisik.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800">
            <strong>Stok Sembako Riil:</strong> Saldo komoditas yang keluar akan langsung dicatat di Buku Kartu Stok secara berurutan waktu.
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Riwayat Barang Keluar / Penjualan</h3>
          <span className="text-xs text-slate-500">{penjualanHistory.length} Transaksi Terdata</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3 px-4">No. Transaksi</th>
                <th className="py-3 px-4">Tanggal Keluar</th>
                <th className="py-3 px-4">Tipe Pengeluaran</th>
                <th className="py-3 px-4">Rincian Komoditas</th>
                <th className="py-3 px-4 text-right">Nilai Total</th>
                <th className="py-3 px-4">Keterangan</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {penjualanHistory.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-rose-700">
                    {trx.no_transaksi}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{trx.tgl_keluar}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        trx.tipe === 'barang_rusak_pecah'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : trx.tipe === 'penjualan_grosir'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {trx.tipe === 'barang_rusak_pecah'
                        ? 'Barang Rusak'
                        : trx.tipe === 'penjualan_grosir'
                        ? 'Grosir Warung'
                        : 'Eceran Toko'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {trx.items.map((item, idx) => (
                      <div key={idx} className="text-slate-700">
                        <strong className="text-rose-700">-{item.jumlah} {item.satuan}</strong> {item.nama_barang}
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                    Rp {trx.total_nilai.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{trx.keterangan}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Selesai
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
