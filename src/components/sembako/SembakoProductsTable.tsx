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
  Lock,
  Tag,
  MapPin,
  Truck,
  Eye,
  AlertOctagon
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
  const [kode, setKode] = useState<string>(`SMB-SKU-${products.length + 1}`);
  const [barcode, setBarcode] = useState<string>(`8991234560${products.length + 1}`);
  const [kategori, setKategori] = useState<string>('Beras & Biji-bijian');
  const [satuan, setSatuan] = useState<string>('karung (25kg)');
  const [stokAwal, setStokAwal] = useState<number>(10);
  const [stokMin, setStokMin] = useState<number>(5);
  const [hargaBeli, setHargaBeli] = useState<number>(320000);
  const [hargaJual, setHargaJual] = useState<number>(355000);
  const [tglKadaluwarsa, setTglKadaluwarsa] = useState<string>('2027-08-20');
  const [lokasiRak, setLokasiRak] = useState<string>('Gudang Palet A4');
  const [supplierUtama, setSupplierUtama] = useState<string>('Perum BULOG Divre');

  const categories = [
    'all',
    'Beras & Biji-bijian',
    'Minyak & Mentega',
    'Gula & Pemanis',
    'Telur & Unggas',
    'Tepung & Olahan',
    'Makanan Instan',
  ];

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
    setKode(`SMB-SKU-${products.length + 2}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Package className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Master Data Komoditas Sembako</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Daftar komoditas bahan pokok, tingkat stok saat ini di rak, harga modal kulakan (HPP), dan tanggal kadaluwarsa FIFO.
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Komoditas Baru</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-500 text-xs shrink-0">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Tambah/Hapus Produk: Khusus Admin</span>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama beras, minyak, kode SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-emerald-600"
          >
            <option value="all">Semua Kategori</option>
            {categories.slice(1).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-emerald-600"
          >
            <option value="all">Semua Status Stok</option>
            <option value="aman">✓ Stok Aman</option>
            <option value="kritis">⚠ Stok Kritis (Reorder)</option>
            <option value="habis">✕ Stok Habis</option>
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3.5 px-4">Komoditas & SKU</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-center">Stok Riil</th>
                <th className="py-3.5 px-4 text-right">Modal Kulakan (HPP)</th>
                <th className="py-3.5 px-4 text-right">Harga Jual</th>
                <th className="py-3.5 px-4">Kadaluwarsa</th>
                <th className="py-3.5 px-4">Lokasi Rak</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                {isAdmin && <th className="py-3.5 px-4 text-center w-20">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stok_saat_ini === 0;
                const isCritical = p.stok_saat_ini > 0 && p.stok_saat_ini <= p.stok_minimum;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Item Name & Code */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{p.nama}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {p.kode} • Barcode: {p.barcode}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                        {p.kategori}
                      </span>
                    </td>

                    {/* Stock & Unit */}
                    <td className="py-3 px-4 text-center">
                      <div className="font-mono font-bold text-slate-800 text-sm">
                        {p.stok_saat_ini}
                      </div>
                      <div className="text-[10px] text-slate-400">{p.satuan}</div>
                    </td>

                    {/* HPP (Role-based Protected) */}
                    <td className="py-3 px-4 text-right">
                      {isAdmin ? (
                        <div>
                          <div className="font-mono font-semibold text-slate-800">
                            Rp {p.harga_beli.toLocaleString('id-ID')}
                          </div>
                          <div className="text-[10px] text-slate-400">per {p.satuan.split(' ')[0]}</div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 italic flex items-center justify-end gap-1">
                          <Lock className="w-3 h-3" /> Rahasia Admin
                        </span>
                      )}
                    </td>

                    {/* Selling Price */}
                    <td className="py-3 px-4 text-right">
                      <div className="font-mono font-bold text-emerald-600 text-sm">
                        Rp {p.harga_jual.toLocaleString('id-ID')}
                      </div>
                    </td>

                    {/* FIFO Expiry */}
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {p.tgl_kadaluwarsa}
                    </td>

                    {/* Storage Location */}
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{p.lokasi_rak}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 text-center">
                      {isOutOfStock ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          ✕ Habis
                        </span>
                      ) : isCritical ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          ⚠ Kritis ({p.stok_saat_ini} &le; {p.stok_minimum})
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✓ Aman
                        </span>
                      )}
                    </td>

                    {/* Actions (Admin Only) */}
                    {isAdmin && (
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus komoditas ${p.nama} dari master stok?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ada komoditas sembako yang cocok dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <span>Menampilkan {filteredProducts.length} dari {products.length} komoditas sembako</span>
          <span className="font-medium text-slate-700">Metode Penjagaan Mutu: FIFO (First-In, First-Out)</span>
        </div>
      </div>

      {/* MODAL: Tambah Komoditas Baru (Admin Only) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <Plus className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-800 text-base">Tambah Komoditas Sembako</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Komoditas Sembako:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beras Rojolele Super (Sak 25kg)"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode SKU:</label>
                  <input
                    type="text"
                    required
                    value={kode}
                    onChange={(e) => setKode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori:</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-800 bg-white"
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Satuan:</label>
                  <input
                    type="text"
                    required
                    value={satuan}
                    onChange={(e) => setSatuan(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stok Awal:</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stokAwal}
                    onChange={(e) => setStokAwal(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batas Min:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={stokMin}
                    onChange={(e) => setStokMin(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harga Beli Kulakan (HPP):</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={hargaBeli}
                    onChange={(e) => setHargaBeli(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harga Jual Eceran:</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={hargaJual}
                    onChange={(e) => setHargaJual(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lokasi Rak Gudang:</label>
                  <input
                    type="text"
                    value={lokasiRak}
                    onChange={(e) => setLokasiRak(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Expired (FIFO):</label>
                  <input
                    type="date"
                    value={tglKadaluwarsa}
                    onChange={(e) => setTglKadaluwarsa(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
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
