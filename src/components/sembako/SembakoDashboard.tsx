import React, { useState } from 'react';
import { 
  Package, 
  Boxes, 
  AlertTriangle, 
  AlertOctagon, 
  BadgeDollarSign, 
  TrendingUp, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ClipboardCheck, 
  FileCheck, 
  ArrowRight, 
  Clock, 
  Calendar,
  CheckCircle2,
  Scale,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { SembakoItem, TransaksiKulakan, TransaksiPengeluaran, OpnameSesi } from '../../data/sembakoMasterData';

interface SembakoDashboardProps {
  products: SembakoItem[];
  kulakanHistory: TransaksiKulakan[];
  penjualanHistory?: TransaksiPengeluaran[];
  opnameSesi: OpnameSesi;
  onNavigateTab: (tab: string) => void;
  onOpenQuickKulakan: () => void;
  onOpenQuickPenjualan?: () => void;
}

export const SembakoDashboard: React.FC<SembakoDashboardProps> = ({
  products,
  kulakanHistory,
  penjualanHistory = [],
  opnameSesi,
  onNavigateTab,
  onOpenQuickKulakan,
  onOpenQuickPenjualan,
}) => {
  // 1. Total Jenis Barang
  const totalSku = products.length;

  // 2. Total Stok Barang (unit count)
  const totalStockUnits = products.reduce((acc, p) => acc + p.stok_saat_ini, 0);

  // 3. Barang Menipis (stok <= min && > 0)
  const criticalItems = products.filter((p) => p.stok_saat_ini <= p.stok_minimum && p.stok_saat_ini > 0);

  // 4. Barang Habis (stok === 0)
  const outOfStockItems = products.filter((p) => p.stok_saat_ini === 0);

  // 5. Total Nilai Persediaan (HPP)
  const totalAssetValue = products.reduce((acc, p) => acc + p.stok_saat_ini * p.harga_beli, 0);

  // Opname metrics
  const totalAudited = opnameSesi.details.length;
  const matchAudited = opnameSesi.details.filter((d) => d.selisih === 0).length;
  const deficitAudited = opnameSesi.details.filter((d) => d.selisih < 0);
  const opnameAccuracy = totalAudited > 0 ? Math.round((matchAudited / totalAudited) * 100) : 100;
  const totalOpnameDeficitValue = deficitAudited.reduce((acc, curr) => acc + Math.abs(curr.dampak_rp), 0);

  // Chart time series (Monthly Stock Level & Inbound/Outbound)
  const monthlyData = [
    { bulan: 'Jun', masuk: 180, keluar: 165, stok: 340 },
    { bulan: 'Jul', masuk: 210, keluar: 195, stok: 355 },
    { bulan: 'Agt', masuk: 230, keluar: 220, stok: 365 },
    { bulan: 'Sep', masuk: 205, keluar: 210, stok: 360 },
    { bulan: 'Okt', masuk: 260, keluar: 245, stok: 375 },
    { bulan: 'Nov', masuk: 290, keluar: 260, stok: 405 },
  ];

  const maxVal = Math.max(...monthlyData.map((d) => Math.max(d.masuk, d.keluar)));

  // Combine recent activities from kulakan and penjualan
  const recentKulakan = kulakanHistory.slice(0, 3).map((k) => ({
    id: `kulakan-${k.id}`,
    type: 'in' as const,
    title: `Kulakan dari ${k.nama_agen}`,
    subtitle: `${k.no_faktur} • ${k.items.map((i) => `${i.jumlah} ${i.satuan.split(' ')[0]} ${i.nama_barang}`).join(', ')}`,
    date: k.tgl_masuk,
    amount: k.total_bayar,
    itemCount: k.items.reduce((acc, i) => acc + i.jumlah, 0),
  }));

  const recentPenjualan = penjualanHistory.slice(0, 3).map((p) => ({
    id: `penjualan-${p.id}`,
    type: 'out' as const,
    title: p.tipe === 'barang_rusak_pecah' ? 'Barang Rusak / Pecah' : 'Penjualan Toko',
    subtitle: `${p.no_transaksi} • ${p.keterangan}`,
    date: p.tgl_keluar,
    amount: p.total_nilai,
    itemCount: p.items.reduce((acc, i) => acc + i.jumlah, 0),
  }));

  const recentActivities = [...recentKulakan, ...recentPenjualan].sort((a, b) => (a.date > b.date ? -1 : 1));

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Sistem Informasi Pengelolaan Stok Barang Toko Sembako</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Ringkasan Persediaan & Audit Sembako
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Pantau saldo komoditas kebutuhan pokok (beras, minyak, gula, telur, tepung, mie), cegah stok kosong, dan rekam audit fisik stock opname secara akurat.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenQuickKulakan}
            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>+ Barang Masuk</span>
          </button>

          <button
            onClick={onOpenQuickPenjualan || (() => onNavigateTab('penjualan'))}
            className="px-4 py-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <ArrowUpFromLine className="w-4 h-4 text-rose-500" />
            <span>+ Barang Keluar</span>
          </button>

          <button
            onClick={() => onNavigateTab('opname')}
            className="px-4 py-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <ClipboardCheck className="w-4 h-4 text-amber-600" />
            <span>Audit Opname</span>
          </button>
        </div>
      </div>

      {/* 5 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Stat 1: Total Jenis Barang */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Jenis Barang</span>
            <span className="p-2 rounded-lg bg-slate-50 text-slate-700">
              <Package className="w-4 h-4 text-slate-600" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-800 font-mono tracking-tight">
              {totalSku} <span className="text-xs font-normal text-slate-500">SKU</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">6 Kategori Sembako</div>
          </div>
        </div>

        {/* Stat 2: Total Stok Barang */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Stok Barang</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Boxes className="w-4 h-4 text-emerald-600" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-800 font-mono tracking-tight">
              {totalStockUnits} <span className="text-xs font-normal text-slate-500">Unit</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              Tersedia di rak & palet
            </div>
          </div>
        </div>

        {/* Stat 3: Barang Menipis */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Barang Menipis</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600 font-mono tracking-tight">
              {criticalItems.length} <span className="text-xs font-normal text-slate-500">Item</span>
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-1">
              Segera reorder ke agen
            </div>
          </div>
        </div>

        {/* Stat 4: Barang Habis */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Barang Habis</span>
            <span className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-600 font-mono tracking-tight">
              {outOfStockItems.length} <span className="text-xs font-normal text-slate-500">Item</span>
            </div>
            <div className="text-[11px] text-rose-600 font-medium mt-1">
              Stok kosong (0 unit)
            </div>
          </div>
        </div>

        {/* Stat 5: Total Nilai Persediaan */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Nilai Persediaan</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <BadgeDollarSign className="w-4 h-4 text-emerald-600" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-emerald-700 font-mono tracking-tight truncate">
              Rp {(totalAssetValue / 1000000).toFixed(1)} Jt
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Valuasi modal HPP</div>
          </div>
        </div>
      </div>

      {/* Charts Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Pergerakan Arus Barang Masuk & Keluar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Arus Barang Masuk vs Keluar</h3>
              <p className="text-xs text-slate-500 mt-0.5">Volume komoditas bulanan (unit) dari kulakan dan penjualan</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
                Masuk
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
                Keluar
              </span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="py-6">
            <div className="h-48 w-full flex items-end justify-between gap-3 px-2">
              {monthlyData.map((d, i) => {
                const masukHeight = Math.round((d.masuk / maxVal) * 140);
                const keluarHeight = Math.round((d.keluar / maxVal) * 140);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-36">
                      {/* Bar Inbound */}
                      <div
                        style={{ height: `${masukHeight}px` }}
                        className="w-3 sm:w-5 bg-emerald-600 rounded-t-sm group-hover:bg-emerald-500 transition-all relative"
                        title={`${d.bulan}: Masuk ${d.masuk} unit`}
                      />
                      {/* Bar Outbound */}
                      <div
                        style={{ height: `${keluarHeight}px` }}
                        className="w-3 sm:w-5 bg-rose-500 rounded-t-sm group-hover:bg-rose-400 transition-all relative"
                        title={`${d.bulan}: Keluar ${d.keluar} unit`}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-800">
                      {d.bulan}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rata-rata perputaran bulanan: 235 unit</span>
            <button
              onClick={() => onNavigateTab('kartu_stok')}
              className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              <span>Lihat Buku Kartu Stok</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Chart 2: Tren Akumulasi Saldo Stok Toko */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Tren Akumulasi Saldo Stok</h3>
              <p className="text-xs text-slate-500 mt-0.5">Perkembangan total ketersediaan komoditas di gudang</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              +19% Periode H-6
            </span>
          </div>

          {/* SVG Smooth Curve Area Chart */}
          <div className="py-6">
            <div className="h-48 w-full relative flex items-center justify-center">
              <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="stockAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16A34A" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" />

                {/* Area */}
                <path
                  d="M 20 110 Q 110 95, 180 85 T 320 60 T 420 40 T 480 25 L 480 140 L 20 140 Z"
                  fill="url(#stockAreaGrad)"
                />

                {/* Line */}
                <path
                  d="M 20 110 Q 110 95, 180 85 T 320 60 T 420 40 T 480 25"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Data points */}
                {[
                  { cx: 20, cy: 110, label: '340' },
                  { cx: 110, cy: 95, label: '355' },
                  { cx: 180, cy: 85, label: '365' },
                  { cx: 320, cy: 60, label: '360' },
                  { cx: 420, cy: 40, label: '375' },
                  { cx: 480, cy: 25, label: '405' },
                ].map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.cx} cy={pt.cy} r="4" fill="#FFFFFF" stroke="#16A34A" strokeWidth="2.5" />
                  </g>
                ))}
              </svg>
            </div>
            <div className="flex justify-between px-2 text-xs font-semibold text-slate-500 pt-1">
              {monthlyData.map((d, i) => (
                <span key={i}>{d.bulan}</span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Akurasi Fisik vs Buku: <strong className="text-emerald-600 font-bold">{opnameAccuracy}%</strong></span>
            <button
              onClick={() => onNavigateTab('opname')}
              className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              <span>Verifikasi Stock Opname</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Critical Stock List & Recent Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Stock Alert Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-800 text-sm">Daftar Barang Stok Kritis & Habis</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {criticalItems.length + outOfStockItems.length} Komoditas
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {[...outOfStockItems, ...criticalItems].map((p) => {
                const isZero = p.stok_saat_ini === 0;
                return (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800 truncate">{p.nama}</span>
                        <span
                          className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                            isZero
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isZero ? 'Habis' : 'Menipis'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Rak: {p.lokasi_rak} • Supplier: {p.supplier_utama}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-mono font-bold text-xs text-slate-800">
                          {p.stok_saat_ini} {p.satuan.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-slate-400">Min: {p.stok_minimum}</div>
                      </div>

                      <button
                        onClick={onOpenQuickKulakan}
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                        title="Kulakan Komoditas Ini"
                      >
                        <ArrowDownToLine className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {criticalItems.length === 0 && outOfStockItems.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Semua persediaan komoditas berada di atas batas minimum.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('products')}
              className="w-full py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
            >
              <span>Lihat Seluruh Katalog Data Barang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Transactions Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Clock className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-800 text-sm">Aktivitas Transaksi Terbaru</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Mutasi Terkini</span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3 truncate">
                    <span
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        act.type === 'in'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {act.type === 'in' ? (
                        <ArrowDownToLine className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpFromLine className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <div className="truncate">
                      <div className="font-bold text-xs text-slate-800 truncate">{act.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{act.subtitle}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{act.date}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-xs text-slate-800">
                      Rp {act.amount.toLocaleString('id-ID')}
                    </div>
                    <span
                      className={`text-[10px] font-semibold ${
                        act.type === 'in' ? 'text-emerald-600' : 'text-slate-500'
                      }`}
                    >
                      {act.type === 'in' ? `+${act.itemCount} Unit Masuk` : `-${act.itemCount} Unit Keluar`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('kartu_stok')}
              className="w-full py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
            >
              <span>Buka Seluruh Riwayat Mutasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
