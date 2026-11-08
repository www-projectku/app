import React, { useState } from 'react';
import { SembakoItem } from '../../data/sembakoMasterData';
import { UserRole } from '../../types/auth';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  TrendingUp,
  Tag,
  Lock,
  ShieldCheck
} from 'lucide-react';

interface SembakoProductsTableProps {
  products: SembakoItem[];
  currentUserRole?: UserRole;
  onAddProduct: (product: Omit<SembakoItem, 'id'>) => void;
  onDeleteProduct: (id: number) => void;
}

export const SembakoProductsTable: React.FC<SembakoProductsTableProps> = ({
  products,
  currentUserRole = 'admin',
  onAddProduct,
  onDeleteProduct,
}) => {
  const isAdmin = currentUserRole === 'admin';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'aman' | 'kritis' | 'habis'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New product form state
  const [nama, setNama] = useState<string>('');
  const [kode, setKode] = useState<string>('SMB-BRS-011');
  const [barcode, setBarcode] = useState<string>('899123456011');
  const [kategori, setKategori] = useState<string>('Beras & Biji-bijian');
  const [satuan, setSatuan] = useState<string>('karung (25kg)');
  const [stokAwal, setStokAwal] = useState<number>(10);
  const [stokMin, setStokMin] = useState<number>(5);
  const [hargaBeli, setHargaBeli] = useState<number>(320000);
  const [hargaJual, setHargaJual] = useState<number>(355000);
  const [tglKadaluwarsa, setTglKadaluwarsa] = useState<string>('2027-08-20');
  const [lokasiRak, setLokasiRak] = useState<string>('Gudang Palet A4');
  const [supplierUtama, setSupplierUtama] = useState<string>('Perum BULOG Divre Regional');

  const categories = ['all', 'Beras & Biji-bijian', 'Minyak & Margarin', 'Gula & Pemanis', 'Telur & Ternak', 'Tepung & Olahan', 'Makanan Instan'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);

    const matchesCategory = selectedCategory === 'all' || p.kategori === selectedCategory;

    let matchesStatus = true;
    if (selectedStatus === 'habis') matchesStatus = p.stok_saat_ini === 0;
    else if (selectedStatus === 'kritis') matchesStatus = p.stok_saat_ini > 0 && p.stok_saat_ini <= p.stok_minimum;
    else if (selectedStatus === 'aman') matchesStatus = p.stok_saat_ini > p.stok_minimum;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama) return;

    onAddProduct({
      kode,
      barcode,
      nama,
      kategori,
      satuan,
      stok_saat_ini: stokAwal,
      stok_minimum: stokMin,
      harga_beli: hargaBeli,
      harga_jual: hargaJual,
      tgl_kadaluwarsa: tglKadaluwarsa,
      lokasi_rak: lokasiRak,
      supplier_utama: supplierUtama,
    });

    setIsAddModalOpen(false);
    // Reset form
    setNama('');
    setKode(`SMB-NEW-${Date.now().toString().slice(-4)}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Controls */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            Master Data Barang Sembako & Stok Fisik
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar komoditas beras, minyak, gula, telur, dan sembako lainnya lengkap dengan stok riil, harga kulakan, dan tanggal kadaluwarsa.
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-md shadow-emerald-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Barang Sembako Baru</span>
          </button>
        ) : (
          <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-amber-900/40 text-xs text-amber-300 flex items-center gap-2 self-start md:self-auto">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Tambah SKU Baru: <strong>Wewenang Admin</strong></span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama beras, minyak, SKU, atau barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(['all', 'aman', 'kritis', 'habis'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded text-xs capitalize transition-colors ${
                selectedStatus === st
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st === 'all' ? 'Semua Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat === 'all' ? 'Semua Kategori' : cat}
          </button>
        ))}
      </div>

      {/* Sembako Products Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">Kode SKU</th>
                <th className="py-3 px-4">Nama Komoditas Sembako</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3 text-center">Satuan</th>
                <th className="py-3 px-3 text-center">Stok Riil</th>
                <th className="py-3 px-3 text-center">Min</th>
                <th className="py-3 px-4 text-right">Harga Beli (HPP)</th>
                <th className="py-3 px-4 text-right">Harga Jual</th>
                <th className="py-3 px-3 text-center">Margin Untung</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-sans text-xs">
              {filteredProducts.map((p) => {
                const isHabis = p.stok_saat_ini === 0;
                const isKritis = p.stok_saat_ini > 0 && p.stok_saat_ini <= p.stok_minimum;
                const profitRp = p.harga_jual - p.harga_beli;
                const profitPct = Math.round((profitRp / p.harga_beli) * 100);

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors text-slate-200">
                    <td className="py-3 px-4 font-mono font-semibold text-cyan-300">
                      {p.kode}
                      <div className="text-[10px] text-slate-500 font-mono">{p.barcode}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{p.nama}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Tag className="w-3 h-3 text-slate-500" />
                        <span>Rak: {p.lokasi_rak}</span>
                        <span>•</span>
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>Exp: {p.tgl_kadaluwarsa}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-300">{p.kategori}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">{p.satuan}</td>

                    {/* Stock Value */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-sm text-white">
                      {p.stok_saat_ini}
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-slate-400">{p.stok_minimum}</td>

                    <td className="py-3 px-4 text-right font-mono">
                      {isAdmin ? (
                        <span className="text-slate-300">Rp {p.harga_beli.toLocaleString('id-ID')}</span>
                      ) : (
                        <span className="text-slate-500 italic text-[11px] flex items-center justify-end gap-1" title="Harga modal kulakan dirahasiakan untuk petugas">
                          <Lock className="w-3 h-3 text-amber-500/70" />
                          <span>Rahasia</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-emerald-300 font-bold">
                      Rp {p.harga_jual.toLocaleString('id-ID')}
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-[11px]">
                      {isAdmin ? (
                        <div className="text-cyan-400">
                          +Rp {profitRp.toLocaleString('id-ID')}
                          <div className="text-[10px] text-slate-500">({profitPct}%)</div>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[10px] flex items-center justify-center gap-1">
                          <Lock className="w-3 h-3 text-slate-600" />
                          <span>Admin Only</span>
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center">
                      {isHabis && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                          ✕ Habis
                        </span>
                      )}
                      {isKritis && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          ⚠ Kritis
                        </span>
                      )}
                      {!isHabis && !isKritis && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          ✓ Aman
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-center">
                      {isAdmin ? (
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          title="Hapus barang (Khusus Admin)"
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span title="Hanya Admin yang berhak menghapus data produk" className="p-1 rounded text-slate-700 cursor-not-allowed inline-block">
                          <Lock className="w-3.5 h-3.5 text-slate-600" />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Barang Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Tambah Komoditas Sembako Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Barang Sembako:</label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="cth: Beras Raja Lele 25kg"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kode SKU Barang:</label>
                  <input
                    type="text"
                    value={kode}
                    onChange={(e) => setKode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori:</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Beras & Biji-bijian">Beras & Biji-bijian</option>
                    <option value="Minyak & Margarin">Minyak & Margarin</option>
                    <option value="Gula & Pemanis">Gula & Pemanis</option>
                    <option value="Telur & Ternak">Telur & Ternak</option>
                    <option value="Tepung & Olahan">Tepung & Olahan</option>
                    <option value="Makanan Instan">Makanan Instan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Satuan Sembako:</label>
                  <input
                    type="text"
                    value={satuan}
                    onChange={(e) => setSatuan(e.target.value)}
                    placeholder="karung (25kg), pouch (2L), dus"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stok Awal:</label>
                  <input
                    type="number"
                    min="0"
                    value={stokAwal}
                    onChange={(e) => setStokAwal(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Batas Min (Reorder):</label>
                  <input
                    type="number"
                    min="1"
                    value={stokMin}
                    onChange={(e) => setStokMin(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Harga Beli Kulakan (HPP):</label>
                  <input
                    type="number"
                    min="0"
                    value={hargaBeli}
                    onChange={(e) => setHargaBeli(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Harga Jual Eceran:</label>
                  <input
                    type="number"
                    min="0"
                    value={hargaJual}
                    onChange={(e) => setHargaJual(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tanggal Kadaluwarsa:</label>
                  <input
                    type="date"
                    value={tglKadaluwarsa}
                    onChange={(e) => setTglKadaluwarsa(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lokasi Rak di Toko:</label>
                  <input
                    type="text"
                    value={lokasiRak}
                    onChange={(e) => setLokasiRak(e.target.value)}
                    placeholder="Rak A1, Palet Depan"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/30"
                >
                  Simpan Komoditas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
