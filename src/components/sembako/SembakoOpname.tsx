import React, { useState } from 'react';
import { SembakoItem, OpnameSesi } from '../../data/sembakoMasterData';
import { UserRole } from '../../types/auth';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Scale, 
  ShieldAlert,
  ArrowRight,
  Lock,
  Printer,
  FileCheck,
  Check
} from 'lucide-react';

interface SembakoOpnameProps {
  products: SembakoItem[];
  opnameSesi: OpnameSesi;
  currentUserRole?: UserRole;
  onApplyOpnameAdjustment: (updatedDetails: OpnameSesi['details']) => void;
  onNavigateTab?: (tab: string) => void;
}

export const SembakoOpname: React.FC<SembakoOpnameProps> = ({
  products,
  opnameSesi,
  currentUserRole = 'admin',
  onApplyOpnameAdjustment,
  onNavigateTab,
}) => {
  const isAdmin = currentUserRole === 'admin';
  const [details, setDetails] = useState<OpnameSesi['details']>([...opnameSesi.details]);
  const [petugas, setPetugas] = useState<string>(opnameSesi.petugas);
  const [catatan, setCatatan] = useState<string>(opnameSesi.catatan);
  const [adjustedSuccess, setAdjustedSuccess] = useState<boolean>(false);

  // Handle Physical Stock Change
  const handlePhysicalStockChange = (barangId: number, newPhysicalVal: number) => {
    setDetails((prev) =>
      prev.map((d) => {
        if (d.barang_id === barangId) {
          const safePhysical = Math.max(0, newPhysicalVal || 0);
          const diff = safePhysical - d.stok_sistem;
          const targetProd = products.find((p) => p.id === barangId);
          const unitPrice = targetProd?.harga_beli || 0;
          const dampakRp = diff * unitPrice;

          let penyebab = d.penyebab;
          if (diff === 0) penyebab = 'sesuai';
          else if (diff < 0 && penyebab === 'sesuai') {
            if (d.nama_barang.toLowerCase().includes('telur')) penyebab = 'telur_pecah';
            else if (d.nama_barang.toLowerCase().includes('beras') || d.nama_barang.toLowerCase().includes('gula')) penyebab = 'karung_bocor_susut';
            else penyebab = 'hilang_tidak_tercatat';
          }

          return {
            ...d,
            stok_fisik: safePhysical,
            selisih: diff,
            dampak_rp: dampakRp,
            penyebab,
          };
        }
        return d;
      })
    );
  };

  const handlePenyebabChange = (barangId: number, penyebab: any) => {
    setDetails((prev) =>
      prev.map((d) => (d.barang_id === barangId ? { ...d, penyebab } : d))
    );
  };

  const handleApplyAdjustment = () => {
    if (!isAdmin) {
      alert('Akses Ditolak: Hanya Administrator / Pemilik Toko yang berhak menyetujui rekonsiliasi stock opname.');
      return;
    }
    onApplyOpnameAdjustment(details);
    setAdjustedSuccess(true);
    setTimeout(() => setAdjustedSuccess(false), 5000);
  };

  // Metrics
  const totalItems = details.length;
  const matchCount = details.filter((d) => d.selisih === 0).length;
  const deficitItems = details.filter((d) => d.selisih < 0);
  const surplusItems = details.filter((d) => d.selisih > 0);
  const accuracyPct = Math.round((matchCount / totalItems) * 100);
  const totalDeficitNominal = deficitItems.reduce((acc, curr) => acc + Math.abs(curr.dampak_rp), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ClipboardCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Lembar Audit Stock Opname Toko Sembako</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pencocokan stok catatan komputer vs hitungan nyata di rak toko (deteksi susut timbangan, telur pecah, karung sobek, dan expired).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('laporan_opname')}
              className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Lihat Berita Acara (BAST)</span>
            </button>
          )}

          {isAdmin ? (
            <button
              onClick={handleApplyAdjustment}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Otorisasi & Sinkronkan Saldo Master</span>
            </button>
          ) : (
            <div className="px-3 py-2 rounded-lg bg-slate-100 text-slate-500 text-xs flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Otorisasi Penyesuaian: Khusus Admin</span>
            </div>
          )}
        </div>
      </div>

      {/* Success Banner */}
      {adjustedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-2 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Otorisasi Berhasil! Saldo stok master produk telah disinkronkan sesuai hasil hitung fisik nyata di rak.
            </span>
          </div>
          <button onClick={() => setAdjustedSuccess(false)} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* 4 Opname Audit Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Tingkat Akurasi Fisik</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">
            {accuracyPct}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {matchCount} dari {totalItems} komoditas tepat cocok
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Komoditas Selisih Kurang</div>
          <div className="text-2xl font-bold text-rose-600 font-mono mt-1">
            {deficitItems.length} <span className="text-xs font-normal text-slate-500">Item</span>
          </div>
          <div className="text-[11px] text-rose-600 mt-0.5">
            Pecah / Susut Timbangan
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Nilai Selisih Deviasi (HPP)</div>
          <div className="text-2xl font-bold text-rose-600 font-mono mt-1">
            Rp {totalDeficitNominal.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Beban susut persediaan toko
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Nomor Audit & Tanggal</div>
          <div className="text-sm font-bold text-slate-800 font-mono mt-1">
            {opnameSesi.no_opname}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {opnameSesi.tgl_opname} • Auditor: {opnameSesi.petugas}
          </div>
        </div>
      </div>

      {/* Main Audit Worksheet Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3.5 px-4">Nama Komoditas Sembako</th>
                <th className="py-3.5 px-3 text-center">Satuan</th>
                <th className="py-3.5 px-4 text-center w-28">Stok Buku (Sistem)</th>
                <th className="py-3.5 px-4 text-center w-36">Hitung Fisik Toko</th>
                <th className="py-3.5 px-4 text-center w-24">Selisih</th>
                <th className="py-3.5 px-4 w-52">Klasifikasi Penyebab Deviasi</th>
                <th className="py-3.5 px-4 text-right">Dampak Finansial (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {details.map((d) => {
                const isMatch = d.selisih === 0;
                const isDeficit = d.selisih < 0;
                const isSurplus = d.selisih > 0;

                return (
                  <tr key={d.barang_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {d.nama_barang}
                    </td>

                    <td className="py-3 px-3 text-center text-slate-500 font-mono text-[11px]">
                      {d.satuan}
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-700 bg-slate-50/50">
                      {d.stok_sistem}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        value={d.stok_fisik}
                        onChange={(e) =>
                          handlePhysicalStockChange(d.barang_id, parseInt(e.target.value) || 0)
                        }
                        className="w-20 px-2 py-1 text-center font-mono font-bold text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
                      />
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-bold">
                      {isMatch ? (
                        <span className="text-slate-400">0</span>
                      ) : isDeficit ? (
                        <span className="text-rose-600 font-bold">{d.selisih}</span>
                      ) : (
                        <span className="text-amber-600 font-bold">+{d.selisih}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={d.penyebab}
                        onChange={(e) => handlePenyebabChange(d.barang_id, e.target.value)}
                        className={`w-full px-2.5 py-1 text-xs rounded-lg border font-medium focus:outline-none ${
                          isMatch
                            ? 'border-slate-200 text-slate-500 bg-slate-50'
                            : 'border-amber-300 text-amber-900 bg-amber-50/50'
                        }`}
                      >
                        <option value="sesuai">✓ Pas / Sesuai Fisik</option>
                        <option value="karung_bocor_susut">Karung Bocor / Susut Timbangan</option>
                        <option value="telur_pecah">Telur Pecah di Rak / Tray</option>
                        <option value="kadaluwarsa">Kadaluwarsa / Rusak Kemasan</option>
                        <option value="hilang_tidak_tercatat">Hilang / Tidak Tercatat</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold">
                      {isAdmin ? (
                        d.dampak_rp === 0 ? (
                          <span className="text-slate-400">Rp 0</span>
                        ) : d.dampak_rp < 0 ? (
                          <span className="text-rose-600">-Rp {Math.abs(d.dampak_rp).toLocaleString('id-ID')}</span>
                        ) : (
                          <span className="text-emerald-600">+Rp {d.dampak_rp.toLocaleString('id-ID')}</span>
                        )
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">🔒 Rahasia Admin</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Total Dampak Finansial Audit: <strong className="text-rose-600 font-mono font-bold">Rp {totalDeficitNominal.toLocaleString('id-ID')}</strong>
          </span>
          <span className="italic">
            {isAdmin
              ? 'Klik tombol "Otorisasi & Sinkronkan" untuk menerapkan hitung fisik ke stok master.'
              : 'Anda login sebagai Petugas: Hasil hitungan fisik tersimpan untuk disetujui Administrator.'}
          </span>
        </div>
      </div>
    </div>
  );
};
