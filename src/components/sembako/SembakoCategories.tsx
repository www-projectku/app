import React, { useState } from 'react';
import { SembakoItem } from '../../data/sembakoMasterData';
import { Layers, Package, TrendingUp, DollarSign, Filter, Search, ArrowRight } from 'lucide-react';

interface SembakoCategoriesProps {
  products: SembakoItem[];
  onSelectProductCategory?: (category: string) => void;
}

export const SembakoCategories: React.FC<SembakoCategoriesProps> = ({
  products,
  onSelectProductCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique categories and calculate metrics
  const categoryNames = Array.from(new Set(products.map((p) => p.kategori)));

  const categoryData = categoryNames.map((cat) => {
    const items = products.filter((p) => p.kategori === cat);
    const totalUnits = items.reduce((acc, curr) => acc + curr.stok_saat_ini, 0);
    const totalValue = items.reduce((acc, curr) => acc + curr.stok_saat_ini * curr.harga_beli, 0);
    const criticalCount = items.filter((p) => p.stok_saat_ini <= p.stok_minimum).length;

    return {
      nama: cat,
      items,
      skuCount: items.length,
      totalUnits,
      totalValue,
      criticalCount,
    };
  });

  const filteredCategories = categoryData.filter((c) =>
    c.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Kategori Komoditas Sembako</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengelompokan kebutuhan pokok untuk mempermudah monitoring stok, rotasi FIFO, dan tata letak rak gudang.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 w-48 sm:w-60 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => (
          <div
            key={cat.nama}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{cat.nama}</h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {cat.skuCount} Varian Produk
                  </span>
                </div>

                {cat.criticalCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    {cat.criticalCount} Menipis
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Stok Aman
                  </span>
                )}
              </div>

              {/* Category Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <div className="text-slate-500 text-[11px]">Total Volume</div>
                  <div className="font-bold text-slate-800 font-mono text-sm mt-0.5">
                    {cat.totalUnits} <span className="text-[11px] font-normal text-slate-500">Unit</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <div className="text-slate-500 text-[11px]">Nilai Persediaan</div>
                  <div className="font-bold text-emerald-600 font-mono text-sm mt-0.5">
                    Rp {(cat.totalValue / 1000000).toFixed(1)} Jt
                  </div>
                </div>
              </div>

              {/* Sample Items in Category */}
              <div className="mt-4 space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Daftar Produk:
                </div>
                <div className="space-y-1">
                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-1 px-2 rounded-md bg-slate-50/70 text-xs text-slate-700"
                    >
                      <span className="truncate max-w-[180px]">{item.nama}</span>
                      <span className="font-mono font-medium text-slate-600 shrink-0">
                        {item.stok_saat_ini} {item.satuan.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {onSelectProductCategory && (
              <button
                onClick={() => onSelectProductCategory(cat.nama)}
                className="mt-5 w-full py-2 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Lihat Data Barang Kategori Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
