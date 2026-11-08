import React, { useState } from 'react';
import { SembakoItem, OpnameSesi } from '../../data/sembakoMasterData';
import { UserRole } from '../../types/auth';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  DollarSign, 
  Scale, 
  Check, 
  ShieldAlert,
  ArrowRight,
  Lock
} from 'lucide-react';

interface SembakoOpnameProps {
  products: SembakoItem[];
  opnameSesi: OpnameSesi;
  currentUserRole?: UserRole;
  onApplyOpnameAdjustment: (updatedDetails: OpnameSesi['details']) => void;
}

export const SembakoOpname: React.FC<SembakoOpnameProps> = ({
  products,
  opnameSesi,
  currentUserRole = 'admin',
  onApplyOpnameAdjustment,
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
    onApplyOpnameAdjustment(details);
    setAdjustedSuccess(true);
    setTimeout(() => setAdjustedSuccess(false), 4000);
  };

  // KPI Calculations
  const totalAudit = details.length;
  const matchedCount = details.filter((d) => d.selisih === 0).length;
  const deficitCount = details.filter((d) => d.selisih < 0).length;
  const surplusCount = details.filter((d) => d.selisih > 0).length;
  const accuracyRate = Math.round((matchedCount / totalAudit) * 100);
  const totalLossRp = details
    .filter((d) => d.dampak_rp < 0)
    .reduce((acc, curr) => acc + Math.abs(curr.dampak_rp), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-amber-400" />
            Audit Stock Opname Toko Sembako (Fisik vs Sistem)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pencocokan stok buku komputer dengan jumlah riil di toko (menimbang karung beras, menghitung peti telur, dan karton minyak).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800 px-3 py-1 rounded-lg">
            No: {opnameSesi.no_opname}
          </span>
        </div>
      </div>

      {/* Opname KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Tingkat Akurasi Stok</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{accuracyRate}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{matchedCount} dari {totalAudit} komoditas pas</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-rose-900/50">
          <div className="text-[11px] text-rose-300 font-medium">Komoditas Defisit (Kurang)</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">{deficitCount} Produk</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Susut timbangan / telur pecah</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-amber-900/50">
          <div className="text-[11px] text-amber-300 font-medium">Total Nilai Selisih Kerugian</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            Rp {totalLossRp.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Nominal barang susut/hilang</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-900/50 flex flex-col justify-between">
          <div className="text-[11px] text-emerald-400 font-medium">Aksi Otorisasi Opname</div>
          {isAdmin ? (
            <button
              onClick={handleApplyAdjustment}
              className="mt-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Setujui & Sinkronkan Stok (Admin)</span>
            </button>
          ) : (
            <div className="mt-2 p-2 rounded-lg bg-slate-950 border border-amber-900/50 text-[11px] text-amber-300 flex items-center gap-1.5" title="Petugas hanya menginput hitung fisik. Otorisasi perubahan stok memerlukan persetujuan pemilik / admin.">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Otorisasi Penyesuaian: <strong>Khusus Admin</strong></span>
            </div>
          )}
        </div>
      </div>

      {adjustedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Penyesuaian Berhasil! Stok di Master Barang Toko Sembako telah disinkronkan dengan angka fisik hasil hitung nyata.
          </span>
        </div>
      )}

      {/* Sesi Info & Auditor */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-slate-300">
          <div>
            Pemeriksa:{' '}
            <input
              type="text"
              value={petugas}
              onChange={(e) => setPetugas(e.target.value)}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white font-semibold"
            />
          </div>
          <div>
            Catatan:{' '}
            <input
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white w-64"
            />
          </div>
        </div>

        <span className="text-slate-400 text-[11px]">
          Ubah angka di kolom <strong>"Stok Fisik Nyata (Hitung Toko)"</strong> untuk menguji kalkulasi otomatis!
        </span>
      </div>

      {/* Interactive Opname Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">Kode SKU</th>
                <th className="py-3 px-4">Nama Komoditas Sembako</th>
                <th className="py-3 px-3 text-center">Satuan</th>
                <th className="py-3 px-3 text-center">Stok Sistem (Buku)</th>
                <th className="py-3 px-3 text-center w-36">Stok Fisik Nyata (Toko)</th>
                <th className="py-3 px-3 text-center">Selisih</th>
                <th className="py-3 px-4 text-right">Dampak Kerugian (Rp)</th>
                <th className="py-3 px-4">Alasan Penyebab Deviasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-sans text-xs">
              {details.map((d) => {
                const isDefisit = d.selisih < 0;
                const isSurplus = d.selisih > 0;
                const isSesuai = d.selisih === 0;

                return (
                  <tr key={d.barang_id} className="hover:bg-slate-800/40 transition-colors text-slate-200">
                    <td className="py-3 px-4 font-mono font-semibold text-cyan-300">{d.kode}</td>
                    <td className="py-3 px-4 font-semibold text-white">{d.nama_barang}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">{d.satuan}</td>

                    {/* System Stock */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-sm text-slate-300">
                      {d.stok_sistem}
                    </td>

                    {/* Physical Stock Input */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={d.stok_fisik}
                        onChange={(e) =>
                          handlePhysicalStockChange(d.barang_id, parseInt(e.target.value) || 0)
                        }
                        className="w-24 text-center py-1 px-2 rounded-lg bg-slate-950 border border-amber-500/50 text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </td>

                    {/* Calculated Difference */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-sm">
                      {isSesuai && <span className="text-slate-400">0</span>}
                      {isDefisit && <span className="text-rose-400 font-bold">{d.selisih}</span>}
                      {isSurplus && <span className="text-amber-400 font-bold">+{d.selisih}</span>}
                    </td>

                    {/* Financial Impact */}
                    <td className="py-3 px-4 text-right font-mono">
                      {d.dampak_rp < 0 ? (
                        <span className="text-rose-400 font-bold">
                          -Rp {Math.abs(d.dampak_rp).toLocaleString('id-ID')}
                        </span>
                      ) : d.dampak_rp > 0 ? (
                        <span className="text-emerald-400 font-bold">
                          +Rp {d.dampak_rp.toLocaleString('id-ID')}
                        </span>
                      ) : (
                        <span className="text-slate-500">Rp 0</span>
                      )}
                    </td>

                    {/* Sembako Discrepancy Reason Dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={d.penyebab}
                        onChange={(e) => handlePenyebabChange(d.barang_id, e.target.value)}
                        className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="sesuai">✓ Pas / Sesuai</option>
                        <option value="karung_bocor_susut">Karung Bocor / Susut Timbangan</option>
                        <option value="telur_pecah">Telur Pecah di Rak</option>
                        <option value="kadaluwarsa">Kadaluwarsa / Rusak</option>
                        <option value="hilang_tidak_tercatat">Hilang / Tidak Tercatat</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
