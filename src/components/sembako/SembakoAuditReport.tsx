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
}

export const SembakoAuditReport: React.FC<SembakoAuditReportProps> = ({
  products,
  opnameSesi,
  currentUserRole = 'admin',
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

2. RINGKASAN REKONSILIASI:
   - Total Komoditas Diperiksa : ${totalAudit} SKU Sembako
   - Jumlah Sesuai Tepat       : ${matchCount} SKU
   - Jumlah Deviasi Selisih    : ${deficitItems.length} SKU
   - Tingkat Akurasi Fisik     : ${accuracyPct}%
   - Total Estimasi Nilai Susut: Rp ${totalLossNominal.toLocaleString('id-ID')}

3. DETAIL HASIL AUDIT PER KOMODITAS:
${opnameSesi.details
  .map(
    (d, i) =>
      `   ${i + 1}. ${d.nama_barang.padEnd(40, ' ')} | Sistem: ${String(d.stok_sistem).padStart(3, ' ')} ${d.satuan.split(' ')[0]} | Fisik: ${String(d.stok_fisik).padStart(3, ' ')} ${d.satuan.split(' ')[0]} | Selisih: ${String(d.selisih > 0 ? '+' + d.selisih : d.selisih).padStart(3, ' ')} | Sebab: ${d.penyebab}`
  )
  .join('\n')}

4. CATATAN & TEMUAN:
   "${opnameSesi.catatan}"

5. PENGESAHAN DOKUMEN:
   Petugas Pemeriksa Fisik: Siti Fatimah Azzahra
   Pemilik Toko (Admin)   : H. Ridwan Supriyadi
================================================================================
    `;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BAST_Stock_Opname_${opnameSesi.no_opname}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Print Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <FileCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">
              Berita Acara Stock Opname (BAST)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dokumen pengesahan serah terima hasil audit fisik persediaan sembako dan rekonsiliasi nilai susut antara Petugas dan Administrator.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen BAST</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccess ? 'Tersimpan!' : 'Unduh Berkas TXT'}</span>
          </button>
        </div>
      </div>

      {/* Formal Printable Document Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Document Kop Surat */}
        <div className="border-b-2 border-slate-800 pb-6 text-center space-y-1">
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
            TOKO SEMBAKO BERKAH JAYA
          </div>
          <p className="text-xs text-slate-600">
            Pusat Grosir & Eceran Kebutuhan Pokok Masyarakat • Pasar Raya Blok B3 No. 45, Jakarta Timur
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            Telepon: 0812-3456-7890 • Email: admin@sembakoberkah.com • NIB: 9120003418902
          </p>
          <div className="pt-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase underline decoration-2 underline-offset-4 tracking-wide">
              BERITA ACARA SERAH TERIMA & HASIL AUDIT STOCK OPNAME
            </h2>
            <p className="text-xs font-mono text-slate-600 mt-1 font-semibold">
              NOMOR: {opnameSesi.no_opname}
            </p>
          </div>
        </div>

        {/* Audit Meta Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="space-y-1.5">
            <div>
              <span className="text-slate-500">Hari / Tanggal Audit:</span>{' '}
              <strong className="text-slate-900 font-mono">Sabtu, 07 November 2026</strong>
            </div>
            <div>
              <span className="text-slate-500">Lokasi Pergudangan:</span>{' '}
              <strong className="text-slate-900">Gudang Penyimpanan & Rak Display Utama</strong>
            </div>
            <div>
              <span className="text-slate-500">Petugas Auditor Fisik:</span>{' '}
              <strong className="text-slate-900 font-semibold">{opnameSesi.petugas} (Petugas Toko)</strong>
            </div>
          </div>

          <div className="space-y-1.5">
            <div>
              <span className="text-slate-500">Pemilik / Otorisator:</span>{' '}
              <strong className="text-slate-900 font-semibold">H. Ridwan Supriyadi (Super Admin)</strong>
            </div>
            <div>
              <span className="text-slate-500">Metode Penilaian:</span>{' '}
              <strong className="text-emerald-700 font-semibold">FIFO (First-In, First-Out) & Fisik Nyata</strong>
            </div>
            <div>
              <span className="text-slate-500">Status Otorisasi:</span>{' '}
              <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-emerald-100 text-emerald-800">
                {opnameSesi.status === 'selesai_diverifikasi' ? 'Disetujui Pemilik' : 'Menunggu Review'}
              </span>
            </div>
          </div>
        </div>

        {/* Narrative Statement */}
        <div className="text-xs text-slate-700 leading-relaxed text-justify space-y-2">
          <p>
            Pada hari ini, <strong>Sabtu tanggal tujuh bulan November tahun dua ribu dua puluh enam (07-11-2026)</strong>, telah dilakukan pemeriksaan dan perhitungan fisik (Stock Opname) terhadap seluruh komoditas sembako yang tersimpan di Toko Sembako Berkah Jaya.
          </p>
          <p>
            Hasil perhitungan fisik nyata di rak toko dibandingkan secara langsung dengan saldo catatan sistem komputer toko dengan rincian rekonsiliasi sebagai berikut:
          </p>
        </div>

        {/* Audit Details Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-800 font-semibold">
                <th className="py-2.5 px-3">No</th>
                <th className="py-2.5 px-4">Nama Komoditas</th>
                <th className="py-2.5 px-3 text-center">Satuan</th>
                <th className="py-2.5 px-3 text-center">Stok Buku</th>
                <th className="py-2.5 px-3 text-center">Stok Fisik</th>
                <th className="py-2.5 px-3 text-center">Selisih</th>
                <th className="py-2.5 px-4">Keterangan / Sebab Deviasi</th>
                <th className="py-2.5 px-4 text-right">Nilai Kerugian (HPP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {opnameSesi.details.map((d, idx) => (
                <tr key={d.barang_id}>
                  <td className="py-2 px-3 text-slate-500 text-center font-mono">{idx + 1}</td>
                  <td className="py-2 px-4 font-semibold text-slate-900">{d.nama_barang}</td>
                  <td className="py-2 px-3 text-center text-slate-600 font-mono text-[11px]">{d.satuan}</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-slate-800">{d.stok_sistem}</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-slate-900">{d.stok_fisik}</td>
                  <td className="py-2 px-3 text-center font-mono font-bold">
                    {d.selisih === 0 ? (
                      <span className="text-slate-400">0</span>
                    ) : d.selisih < 0 ? (
                      <span className="text-rose-700">{d.selisih}</span>
                    ) : (
                      <span className="text-amber-700">+{d.selisih}</span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-slate-700">
                    {d.penyebab === 'sesuai' && 'Sesuai Fisik'}
                    {d.penyebab === 'karung_bocor_susut' && 'Karung Bocor & Susut Timbangan'}
                    {d.penyebab === 'telur_pecah' && 'Telur Pecah di Rak / Tray'}
                    {d.penyebab === 'kadaluwarsa' && 'Kadaluwarsa / Rusak'}
                    {d.penyebab === 'hilang_tidak_tercatat' && 'Hilang / Tidak Tercatat'}
                  </td>
                  <td className="py-2 px-4 text-right font-mono font-semibold text-slate-800">
                    {d.dampak_rp === 0 ? (
                      <span className="text-slate-400">Rp 0</span>
                    ) : (
                      <span className="text-rose-700">-Rp {Math.abs(d.dampak_rp).toLocaleString('id-ID')}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t border-slate-300">
                <td colSpan={7} className="py-2.5 px-4 text-right text-slate-900">
                  TOTAL BEBAN SUSUT FISIK AUDIT:
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-rose-700">
                  Rp {totalLossNominal.toLocaleString('id-ID')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Narrative Closing & Signatures */}
        <div className="space-y-8 pt-4">
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            Demikian Berita Acara Stock Opname ini dibuat dengan sebenarnya dalam rangkap 2 (dua) untuk dipergunakan sebagai dasar otorisasi penyesuaian saldo buku master persediaan dan bahan evaluasi pengawasan toko.
          </p>

          <div className="grid grid-cols-2 gap-8 text-center text-xs text-slate-800 pt-6">
            <div className="space-y-16">
              <div>
                <p className="text-slate-500">Petugas Yang Memeriksa Fisik,</p>
                <p className="text-[11px] text-slate-400">Auditor Gudang Sembako</p>
              </div>
              <div>
                <p className="font-bold underline text-slate-900">{opnameSesi.petugas}</p>
                <p className="text-[11px] text-slate-500">Petugas Toko Sembako</p>
              </div>
            </div>

            <div className="space-y-16">
              <div>
                <p className="text-slate-500">Mengetahui & Menyetujui,</p>
                <p className="text-[11px] text-slate-400">Pemilik Toko (Super Admin)</p>
              </div>
              <div>
                <p className="font-bold underline text-slate-900">H. Ridwan Supriyadi</p>
                <p className="text-[11px] text-slate-500">Pimpinan / Pemilik Usaha</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
