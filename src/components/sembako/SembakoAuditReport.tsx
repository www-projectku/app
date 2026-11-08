import React, { useState } from 'react';
import { SembakoItem, OpnameSesi } from '../../data/sembakoMasterData';
import { UserRole } from '../../types/auth';
import { 
  FileCheck, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  UserCheck, 
  Building2, 
  Scale, 
  ShieldCheck,
  Check,
  Lock,
  ArrowRight
} from 'lucide-react';

interface SembakoAuditReportProps {
  products: SembakoItem[];
  opnameSesi: OpnameSesi;
  currentUserRole?: UserRole;
  onSwitchRole?: (role: UserRole) => void;
}

export const SembakoAuditReport: React.FC<SembakoAuditReportProps> = ({
  products,
  opnameSesi,
  currentUserRole = 'admin',
  onSwitchRole,
}) => {
  const isAdmin = currentUserRole === 'admin';
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Compute metrics from opname details
  const totalAudit = opnameSesi.details.length;
  const matchCount = opnameSesi.details.filter((d) => d.selisih === 0).length;
  const deficitItems = opnameSesi.details.filter((d) => d.selisih < 0);
  const surplusItems = opnameSesi.details.filter((d) => d.selisih > 0);
  const totalLossNominal = deficitItems.reduce((acc, curr) => acc + Math.abs(curr.dampak_rp), 0);
  const accuracyPct = Math.round((matchCount / totalAudit) * 100);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    const reportText = `
================================================================================
BERITA ACARA SERAH TERIMA & HASIL STOCK OPNAME TOKO SEMBAKO
Toko Sembako Berkah Jaya - Jakarta Timur
No Dokumen: BAST-SMB/2026/XI/001
Tanggal Audit: 07 November 2026
Status Otorisasi: ${opnameSesi.status === 'selesai_diverifikasi' ? 'TERVERIFIKASI & DISETUJUI' : 'MENUNGGU VERIFIKASI ADMIN'}
================================================================================

1. PELAKSANA AUDIT:
   - Petugas Auditor Fisik  : ${opnameSesi.petugas} (Petugas Gudang)
   - Verifikator & Otorisator: H. Ridwan Supriyadi (Pemilik Toko / Super Admin)

2. RINGKASAN HASIL AUDIT FISIK:
   - Total Komoditas Diperiksa : ${totalAudit} SKU
   - Jumlah Sesuai (Akurat)    : ${matchCount} SKU (${accuracyPct}%)
   - Jumlah Selisih Kurang      : ${deficitItems.length} SKU (Karung Bocor, Telur Pecah, Rusak)
   - Total Estimasi Kerugian    : Rp ${totalLossNominal.toLocaleString('id-ID')}

3. DETAIL REKAPITULASI SELISIH BARANG:
${opnameSesi.details.map((d) => `   - [${d.kode}] ${d.nama_barang.padEnd(35)} | Sistem: ${String(d.stok_sistem).padStart(3)} ${d.satuan.padEnd(12)} | Fisik: ${String(d.stok_fisik).padStart(3)} | Selisih: ${String(d.selisih).padStart(3)} | Dampak: Rp ${d.dampak_rp.toLocaleString('id-ID')} | Alasan: ${d.penyebab}`).join('\n')}

4. REKOMENDASI & TINDAKAN KOREKTIF:
   - Memperbaiki palet penyimpanan karung beras dan gula untuk mencegah gesekan dan sobek.
   - Memasang pelindung busa di rak telur ayam Blitar guna meminimalisir risiko retak.
   - Menerapkan penyesuaian saldo akhir di master data komputer berdasarkan otorisasi Administrator.

Disahkan oleh:
Petugas Auditor: [ ${opnameSesi.petugas} ]
Pemilik Toko   : [ H. Ridwan Supriyadi ]
================================================================================
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BAST_Stock_Opname_Sembako_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            Berita Acara & Laporan Audit Stock Opname (BAST)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dokumen formal rekonsiliasi stok fisik versus catatan komputer untuk bukti pengawasan inventaris toko sembako.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadReport}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Unduh Berita Acara (.txt)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Dokumen BAST</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>File Berita Acara Stock Opname berhasil diunduh ke komputer Anda!</span>
        </div>
      )}

      {/* Formal Paper Report View */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative">
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-2xl font-bold">
              🌾
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">TOKO SEMBAKO BERKAH JAYA</h1>
              <p className="text-xs text-slate-400">Jl. Pasar Raya Sembako No. 45, Blok B3, Jakarta Timur • Telp: 0812-3456-7890</p>
              <p className="text-[11px] text-emerald-400 font-mono mt-0.5">SISTEM AUDIT & KONTROL STOK FISIK SEMBAKO BERBASIS WEB</p>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <div className="text-xs font-mono font-bold text-amber-300 bg-amber-950/50 px-2.5 py-1 rounded border border-amber-800 inline-block">
              NO: BAST-SMB/2026/XI/001
            </div>
            <div className="text-xs text-slate-400">Tanggal Audit: 07 November 2026</div>
            <div className="text-[11px] text-slate-500">Siklus: Audit Fisik Mingguan</div>
          </div>
        </div>

        {/* Audit Metadata Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400">Total Komoditas Diaudit</div>
            <div className="text-2xl font-bold text-white font-mono">{totalAudit} SKU</div>
            <div className="text-[10px] text-slate-500">Beras, Minyak, Gula, Telur</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400">Tingkat Akurasi Rak</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{accuracyPct}%</div>
            <div className="text-[10px] text-slate-500">{matchCount} dari {totalAudit} komoditas pas</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400">Komoditas Selisih (Deviasi)</div>
            <div className="text-2xl font-bold text-rose-400 font-mono">{deficitItems.length} SKU</div>
            <div className="text-[10px] text-rose-300">Penyusutan / Kerusakan</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400">Estimasi Kerugian Selisih</div>
            <div className="text-2xl font-bold text-amber-400 font-mono">
              Rp {totalLossNominal.toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] text-slate-500">Berdasarkan HPP Modal</div>
          </div>
        </div>

        {/* Auditor Personnel Table */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-3">
          <h3 className="font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            Tim Pelaksana & Penanggung Jawab Audit
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px]">Petugas Pelaksana Hitung Fisik:</span>
                <div className="font-bold text-white mt-0.5">{opnameSesi.petugas}</div>
                <div className="text-[10px] text-cyan-400">Auditor Lapangan / Gudang</div>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Pencatat
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px]">Verifikator & Otorisator:</span>
                <div className="font-bold text-white mt-0.5">H. Ridwan Supriyadi</div>
                <div className="text-[10px] text-amber-400">Pemilik Toko / Administrator</div>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
                Penyetujui
              </span>
            </div>
          </div>
        </div>

        {/* Audit Discrepancy Reconciliation Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              Tabel Rekapitulasi Deviasi Fisik vs Catatan Komputer
            </h3>
            <span className="text-[11px] text-slate-400">Unit Terverifikasi: Karung, Pouch, Dus, Peti</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <th className="py-3 px-4">Kode SKU</th>
                  <th className="py-3 px-4">Komoditas Sembako</th>
                  <th className="py-3 px-3 text-center">Satuan</th>
                  <th className="py-3 px-3 text-center">Stok Sistem</th>
                  <th className="py-3 px-3 text-center">Hasil Fisik</th>
                  <th className="py-3 px-3 text-center">Selisih</th>
                  <th className="py-3 px-4 text-right">Dampak Finansial (HPP)</th>
                  <th className="py-3 px-4">Keterangan Penyebab Deviasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans text-xs text-slate-300">
                {opnameSesi.details.map((d) => {
                  const isMatch = d.selisih === 0;
                  const isDeficit = d.selisih < 0;
                  const isSurplus = d.selisih > 0;

                  return (
                    <tr key={d.barang_id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-mono font-semibold text-cyan-300">{d.kode}</td>
                      <td className="py-2.5 px-4 font-semibold text-white">{d.nama_barang}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-400">{d.satuan}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-300">{d.stok_sistem}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-white bg-slate-950/60">
                        {d.stok_fisik}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        {isMatch && <span className="text-slate-500">0</span>}
                        {isDeficit && <span className="text-rose-400">{d.selisih}</span>}
                        {isSurplus && <span className="text-amber-400">+{d.selisih}</span>}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono">
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
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isMatch
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {d.penyebab.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Root Cause Analysis & Corrective Measures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Temuan Lapangan Sembako
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-300 text-[11px]">
              <li><strong>Telur Ayam Ras:</strong> Ditemukan 1 peti mengalami retak di rak bawah akibat penumpukan yang terlalu berat.</li>
              <li><strong>Beras Pandan Wangi:</strong> Penyusutan 1 sak disebabkan oleh jahitan karung goni bocor saat proses bongkar muat.</li>
              <li><strong>Minyak Goreng Bimoli:</strong> Kemasan pouch 2L tertata rapi sesuai standar rak penyimpanan.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Rekomendasi Tindakan Korektif
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-300 text-[11px]">
              <li>Membatasi tumpukan peti telur kayu maksimal 3 susun dan diberi alas busa tebal.</li>
              <li>Melakukan penimbangan ulang beras setiap kali truk agen distributor datang.</li>
              <li>Melakukan penyesuaian (*stock adjustment*) ke saldo master setelah persetujuan pemilik toko.</li>
            </ul>
          </div>
        </div>

        {/* Legal Signatures Block */}
        <div className="pt-8 border-t border-slate-800 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-12">
            <div className="text-slate-400">Petugas Pelaksana Audit Lapangan,</div>
            <div>
              <div className="font-bold text-white underline underline-offset-4">{opnameSesi.petugas}</div>
              <div className="text-[11px] text-slate-500">Staf Pengawas Gudang Toko Sembako</div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="text-slate-400">Mengetahui & Menyetujui (Owner),</div>
            <div>
              <div className="font-bold text-white underline underline-offset-4">H. Ridwan Supriyadi</div>
              <div className="text-[11px] text-slate-500">Pemilik Toko Sembako Berkah Jaya</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
