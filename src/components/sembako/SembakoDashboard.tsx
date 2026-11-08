import React from 'react';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  Package, 
  Truck, 
  DollarSign, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock,
  Scale,
  FileText
} from 'lucide-react';
import { SembakoItem, TransaksiKulakan, OpnameSesi } from '../../data/sembakoMasterData';

interface SembakoDashboardProps {
  products: SembakoItem[];
  kulakanHistory: TransaksiKulakan[];
  opnameSesi: OpnameSesi;
  onNavigateTab: (tab: string) => void;
  onOpenQuickKulakan: () => void;
}

export const SembakoDashboard: React.FC<SembakoDashboardProps> = ({
  products,
  kulakanHistory,
  opnameSesi,
  onNavigateTab,
  onOpenQuickKulakan,
}) => {
  const totalItems = products.length;
  const criticalItems = products.filter((p) => p.stok_saat_ini <= p.stok_minimum && p.stok_saat_ini > 0);
  const outOfStockItems = products.filter((p) => p.stok_saat_ini === 0);
  const totalAssetValue = products.reduce((acc, p) => acc + p.stok_saat_ini * p.harga_beli, 0);

  // Expired alert (FIFO audit: products expiring within 45 days)
  const expiringSoonItems = products.filter((p) => {
    const expDate = new Date(p.tgl_kadaluwarsa);
    const today = new Date();
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 45;
  });

  // Opname metrics
  const totalAudited = opnameSesi.details.length;
  const matchAudited = opnameSesi.details.filter((d) => d.selisih === 0).length;
  const deficitAudited = opnameSesi.details.filter((d) => d.selisih < 0);
  const opnameAccuracy = Math.round((matchAudited / totalAudited) * 100);
  const totalLoss = deficitAudited.reduce((acc, curr) => acc + Math.abs(curr.dampak_rp), 0);

  return (
    <div className="space-y-6">
      {/* Title & Store Status Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40 border border-emerald-600/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Ringkasan Pengelolaan Persediaan
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-emerald-400" />
              Dashboard Pengelolaan Stok Barang
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Pantau kondisi persediaan barang melalui informasi:{' '}
              <span className="text-amber-300 font-semibold underline decoration-amber-500/40">
                jumlah barang, stok menipis, barang masuk, barang keluar, dan hasil pemeriksaan stok.
              </span>
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('opname')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Lakukan Stok Opname</span>
            </button>

            <button
              onClick={onOpenQuickKulakan}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>+ Penerimaan Kulakan</span>
            </button>

            <button
              onClick={() => onNavigateTab('laporan_sql')}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Lihat Laporan Stok</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Inventory & Opname KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total SKU Komoditas */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Komoditas Diawasi</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{totalItems} SKU</div>
          <div className="text-[11px] text-slate-500">Beras, Minyak, Gula, Telur, Tepung</div>
        </div>

        {/* Card 2: Akurasi Stock Opname */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tingkat Akurasi Fisik Rak</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{opnameAccuracy}%</div>
          <div className="text-[11px] text-emerald-500/80">
            {matchAudited} dari {totalAudited} komoditas tepat cocok
          </div>
        </div>

        {/* Card 3: Nilai Kerugian / Susut Terdeteksi */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Nilai Selisih Deviasi (Opname)</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono">
            Rp {totalLoss.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-rose-300">
            {deficitAudited.length} item susut / telur retak
          </div>
        </div>

        {/* Card 4: Total Nilai Aset Fisik Gudang */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Valuasi Modal Aset (HPP)</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            Rp {(totalAssetValue / 1000000).toFixed(1)} Jt
          </div>
          <div className="text-[11px] text-slate-500">Nilai modal barang di toko</div>
        </div>
      </div>

      {/* 2 Focused Operational Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Hasil Temuan Audit Stock Opname Terkini */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-amber-400">
              <ClipboardCheck className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-white text-sm">Status Lakukan Stok Opname</h3>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
              Siklus Mingguan
            </span>
          </div>

          <div className="space-y-3">
            {opnameSesi.details.slice(0, 4).map((d) => {
              const isMatch = d.selisih === 0;
              return (
                <div
                  key={d.barang_id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{d.nama_barang}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Sistem: <strong className="text-slate-300 font-mono">{d.stok_sistem}</strong></span>
                      <span>•</span>
                      <span>Fisik: <strong className="text-white font-mono">{d.stok_fisik}</strong> {d.satuan}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`font-mono font-bold text-xs ${isMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isMatch ? '✓ Sesuai (0)' : `Selisih: ${d.selisih}`}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Alasan: {d.penyebab.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('opname')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <span>Buka Lembar Hitung Fisik Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Pelacakan Kadaluwarsa FIFO & Penerimaan Barang */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Calendar className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-white text-sm">Audit Tanggal Kadaluwarsa (FIFO)</h3>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              Kualitas Pangan
            </span>
          </div>

          <div className="space-y-3">
            {expiringSoonItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{item.nama}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Stok Tersisa: <strong className="text-white font-mono">{item.stok_saat_ini} {item.satuan}</strong> • Lokasi: {item.lokasi_rak}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-rose-400 font-bold text-xs">
                    Exp: {item.tgl_kadaluwarsa}
                  </div>
                  <div className="text-[10px] text-amber-300 font-semibold">Audit Prioritas Segera</div>
                </div>
              </div>
            ))}

            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/30 text-slate-300 text-[11px] flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                Komoditas telur ayam ras memiliki masa simpan 14–21 hari. Petugas auditor memverifikasi batch tanggal masuk agar telur terdistribusi sesuai prinsip FIFO.
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('kartu_stok')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <span>Periksa Buku Mutasi & Kartu Stok</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
