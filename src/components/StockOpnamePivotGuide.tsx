import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Database, 
  Layers, 
  RefreshCw, 
  ShieldAlert, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  Server,
  FileCode2,
  PackageCheck
} from 'lucide-react';

interface StockOpnamePivotGuideProps {
  onGoToSimulator: () => void;
  onGoToErd: () => void;
  onGoToSql: () => void;
}

export const StockOpnamePivotGuide: React.FC<StockOpnamePivotGuideProps> = ({
  onGoToSimulator,
  onGoToErd,
  onGoToSql,
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Answer Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-800/60 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <PackageCheck className="w-3.5 h-3.5" />
              Panduan Transformasi Proyek: Menuju Sistem Stock Opname & Pergudangan
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Apa yang Perlu Diubah untuk Fokus pada <span className="text-cyan-400">Stock Opname</span>, <span className="text-emerald-400">Barang Masuk</span>, dan <span className="text-rose-400">Barang Keluar</span>?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
              Jika proyek Anda beralih dari <strong>Company Profile</strong> menjadi <strong>Sistem Manajemen Persediaan & Stock Opname</strong>, terdapat <strong>4 pilar utama</strong> yang harus dirombak: struktur tabel database, logika perhitungan stok & pencegahan stok minus, tampilan antarmuka (UI), dan arsitektur backend.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={onGoToSimulator}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Coba Simulasi Stock Opname Live</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToSql}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-all flex items-center justify-center gap-2"
            >
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              <span>Lihat Skrip SQL & Trigger Stok</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comparison: Old Web vs. Stock Opname System */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-cyan-400" />
          1. Tabel Komparasi: Dari Web Company Profile ke Sistem Pergudangan
        </h3>
        
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 shadow-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-medium">
                <th className="py-3 px-4 w-40">Aspek Sistem</th>
                <th className="py-3 px-4 w-1/3 text-rose-300">Desain Lama (Company Profile)</th>
                <th className="py-3 px-4 text-emerald-300">Desain Baru (Stock Opname & Mutasi)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-sans">
              <tr className="hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-semibold text-white">Struktur Tabel Inti</td>
                <td className="py-3.5 px-4 text-slate-400">
                  <code className="text-xs font-mono text-rose-400">companies</code>, <code className="text-xs font-mono text-rose-400">services</code>, <code className="text-xs font-mono text-rose-400">testimonials</code>, <code className="text-xs font-mono text-rose-400">contact_messages</code>
                </td>
                <td className="py-3.5 px-4 text-slate-200">
                  <div className="space-y-1">
                    <div><strong className="text-emerald-400 font-mono">products</strong> (Master barang, SKU, min_stock, saldo)</div>
                    <div><strong className="text-emerald-400 font-mono">stock_transactions</strong> & <strong className="text-emerald-400 font-mono">items</strong> (Header & detail barang masuk/keluar)</div>
                    <div><strong className="text-emerald-400 font-mono">stock_opnames</strong> & <strong className="text-emerald-400 font-mono">details</strong> (Audit fisik vs sistem & selisih varian)</div>
                    <div><strong className="text-emerald-400 font-mono">stock_cards</strong> (Buku riwayat kartu stok per detik)</div>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-semibold text-white">Fokus Logika Bisnis</td>
                <td className="py-3.5 px-4 text-slate-400">
                  Hanya menampilkan teks statis promosi dan menyimpan formulir pengirim pesan kontak.
                </td>
                <td className="py-3.5 px-4 text-slate-200">
                  <strong>Kalkulasi Aritmatika Stok Real-Time:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs text-slate-300">
                    <li>Barang Masuk: <code className="text-cyan-300 font-mono">current_stock = current_stock + qty</code></li>
                    <li>Barang Keluar: <code className="text-cyan-300 font-mono">current_stock = current_stock - qty</code> (Cek stok tidak boleh &lt; 0!)</li>
                    <li>Stock Opname: <code className="text-cyan-300 font-mono">selisih = physical_stock - system_stock</code></li>
                  </ul>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-semibold text-white">Halaman Antarmuka (UI)</td>
                <td className="py-3.5 px-4 text-slate-400">
                  Landing page: Hero banner, Tentang Kami, Galeri Layanan, Form Kontak.
                </td>
                <td className="py-3.5 px-4 text-slate-200">
                  <strong>Aplikasi Web Operasional Gudang:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs text-slate-300">
                    <li>Dashboard Ringkasan Stok & Peringatan Stok Kritis (Reorder Point)</li>
                    <li>Form Penerimaan Barang Masuk (Pilih Supplier, Qty, No Surat Jalan)</li>
                    <li>Form Pengeluaran Barang (Validasi otomatis jika stok gudang habis)</li>
                    <li>Formulir Audit Sesi Stock Opname & Cetak Berita Acara Selisih</li>
                  </ul>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-semibold text-white">Integritas & Keamanan</td>
                <td className="py-3.5 px-4 text-slate-400">
                  Cukup validasi teks HTML.
                </td>
                <td className="py-3.5 px-4 text-slate-200">
                  <strong>Constraint Database & Database Triggers:</strong>
                  Pencegahan stok bernilai minus (<code className="text-cyan-300 font-mono">CHECK (current_stock &gt;= 0)</code>), audit trail kartu stok, dan pencatatan petugas input (<code className="text-cyan-300 font-mono">created_by</code>).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Steps to Implement */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-400" />
          2. Rincian 4 Hal yang Harus Dikerjakan Langkah Demi Langkah
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h4 className="font-bold text-white text-sm">Ganti Skema Database ke 8 Tabel Pergudangan</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hapus atau arsipkan tabel profil lama (<code className="text-cyan-300 font-mono">companies</code>, <code className="text-cyan-300 font-mono">services</code>). Ganti dengan tabel:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
              <li>• <span className="text-white">products</span>: Master data barang, SKU, barcode, stok minimal, lokasi rak.</li>
              <li>• <span className="text-white">stock_transactions</span> & <span className="text-white">items</span>: Dokumen mutasi masuk & keluar.</li>
              <li>• <span className="text-white">stock_opnames</span> & <span className="text-white">details</span>: Audit pencocokan fisik vs sistem.</li>
              <li>• <span className="text-white">stock_cards</span>: Log pergerakan saldo riwayat audit.</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h4 className="font-bold text-white text-sm">Terapkan Rumus & Logika Stock Opname</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pada modul Stock Opname, logika paling krusial yang dinilai oleh penguji/dosen adalah <strong>Penghitungan Selisih (Varian)</strong>:
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 space-y-1">
              <div><span className="text-cyan-400">SELISIH</span> = Stok_Fisik_Riil - Stok_Sistem_Buku</div>
              <div className="text-slate-400 text-[11px]">• Jika Selisih &lt; 0: Defisit (Barang Hilang / Rusak / Kadaluwarsa)</div>
              <div className="text-slate-400 text-[11px]">• Jika Selisih &gt; 0: Surplus (Barang Masuk Belum Tercatat)</div>
              <div className="text-slate-400 text-[11px]">• Jika Selisih = 0: Sesuai (Akurasi 100%)</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <span className="w-6 h-6 rounded-full bg-amber-950 border border-amber-700 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <h4 className="font-bold text-white text-sm">Proteksi Stok Minus pada Barang Keluar</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pada barang keluar, sistem <strong>WAJIB menolak transaksi</strong> jika kuantitas keluar melebihi stok yang ada di gudang. Di MySQL, ini dapat diamankan via:
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300">
              CONSTRAINT chk_stock_non_negative CHECK (current_stock &gt;= 0)
            </div>
            <p className="text-[11px] text-slate-400">
              Serta validasi di sisi aplikasi sebelum form disimpan.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-violet-400">
              <span className="w-6 h-6 rounded-full bg-violet-950 border border-violet-700 flex items-center justify-center text-xs font-bold">
                4
              </span>
              <h4 className="font-bold text-white text-sm">Solusi Hosting: Hubungkan ke Supabase / Firebase</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Karena website repositori Anda ada di <strong>GitHub Pages</strong>, cara terbaik agar form mutasi dan opname bisa langsung berfungsi tanpa sewa server adalah memakai:
            </p>
            <ul className="space-y-1 text-xs text-slate-300">
              <li>• <strong>Supabase (PostgreSQL):</strong> Mendukung SQL, Trigger, dan REST API gratis yang bisa dipanggil dari browser.</li>
              <li>• <strong>Firebase Firestore:</strong> Mendukung transaksi atomik <code className="text-cyan-300 font-mono text-[11px]">runTransaction()</code> langsung dari JavaScript.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
