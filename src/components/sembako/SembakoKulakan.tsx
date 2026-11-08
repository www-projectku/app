import React, { useState } from 'react';
import { SembakoItem, DistributorAgen, TransaksiKulakan } from '../../data/sembakoMasterData';
import { 
  Truck, 
  CheckCircle2, 
  Plus, 
  Calendar, 
  FileText, 
  ArrowRight,
  Package,
  Layers,
  ArrowDownToLine,
  Building2,
  Clock
} from 'lucide-react';

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
  const [keterangan, setKeterangan] = useState<string>('Kulakan pasokan berkala dari distributor');
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
      `Kulakan berhasil dicatat! +${jumlah} ${selectedProduct.satuan} ${selectedProduct.nama} ditambahkan ke saldo stok toko.`
    );

    setNoFaktur(`FAK-IN-${Date.now().toString().slice(-6)}`);
    setTimeout(() => setSuccessNotif(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ArrowDownToLine className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Penerimaan Barang Masuk (Kulakan Agen)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan faktur pasokan komoditas masuk dari rekanan agen resmi (BULOG, Salim Ivomas, Peternak Blitar, Indofood) untuk menambah saldo persediaan toko.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>Faktur Terakhir: {kulakanHistory[0]?.no_faktur || '-'}</span>
        </div>
      </div>

      {/* Success Notification */}
      {successNotif && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-2 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successNotif}</span>
          </div>
          <button
            onClick={() => setSuccessNotif(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Form & Guidelines Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Input */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Formulir Bukti Penerimaan Barang Kulakan
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              +Stok Bertambah Otomatis
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Faktur / Surat Jalan:
                </label>
                <input
                  type="text"
                  required
                  value={noFaktur}
                  onChange={(e) => setNoFaktur(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tanggal Barang Diterima:
                </label>
                <input
                  type="date"
                  required
                  value={tglMasuk}
                  onChange={(e) => setTglMasuk(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-800 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Distributor / Pemasok Agen:
                </label>
                <select
                  value={agenId}
                  onChange={(e) => setAgenId(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-800 bg-white"
                >
                  {distributors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nama} ({d.kode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Komoditas yang Masuk:
                </label>
                <select
                  value={barangId}
                  onChange={(e) => handleBarangChange(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-800 bg-white font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} (Stok Saat Ini: {p.stok_saat_ini} {p.satuan})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jumlah Diterima ({selectedProduct.satuan.split(' ')[0]}):
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={jumlah}
                  onChange={(e) => setJumlah(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono text-slate-800 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Harga Beli / Satuan (HPP):
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={hargaKulakan}
                  onChange={(e) => setHargaKulakan(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Total Tagihan Faktur:
                </label>
                <div className="px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 font-mono font-bold text-emerald-700 text-sm">
                  Rp {subtotal.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Catatan Ekspedisi / Nomor Polisi Truk:
              </label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Truk B 9123 XYZ - Segel utuh aman"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-800 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Simpan Penerimaan Barang Masuk</span>
            </button>
          </form>
        </div>

        {/* Right 1 Col: Guidelines & Supplier Quick Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Standar SOP Pemeriksaan Kulakan
          </h3>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <strong className="text-slate-800 block">1. Cek Fisik Kemasan Sak / Pouch</strong>
              <p className="text-slate-500">
                Pastikan karung beras tidak basah/sobek dan pouch minyak goreng tidak bocor saat penurunan dari armada truk.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <strong className="text-slate-800 block">2. Timbang Peti Telur</strong>
              <p className="text-slate-500">
                Timbang peti kayu telur (standar 15kg bersih) dan periksa cangkang retak sebelum masuk gudang pendingin.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <strong className="text-slate-800 block">3. Catat Batch & Tanggal Expired</strong>
              <p className="text-slate-500">
                Penerimaan baru ditempatkan di belakang stok lama untuk mematuhi prinsip FIFO (First-In, First-Out).
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800">
            <strong>Otomatisasi Sistem:</strong> Saldo stok riil pada tabel Data Barang & Buku Kartu Stok akan langsung bertambah seketika.
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Riwayat Faktur Barang Masuk (Kulakan)</h3>
          <span className="text-xs text-slate-500">{kulakanHistory.length} Transaksi Terdata</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3 px-4">No. Faktur</th>
                <th className="py-3 px-4">Tanggal Masuk</th>
                <th className="py-3 px-4">Distributor Agen</th>
                <th className="py-3 px-4">Rincian Komoditas Diterima</th>
                <th className="py-3 px-4 text-right">Total Nilai Kulakan</th>
                <th className="py-3 px-4">Catatan</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {kulakanHistory.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-700">
                    {trx.no_faktur}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{trx.tgl_masuk}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{trx.nama_agen}</td>
                  <td className="py-3 px-4">
                    {trx.items.map((item, idx) => (
                      <div key={idx} className="text-slate-700">
                        <strong className="text-slate-800">+{item.jumlah} {item.satuan}</strong> {item.nama_barang}
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                    Rp {trx.total_bayar.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{trx.keterangan}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Diterima Gudang
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
