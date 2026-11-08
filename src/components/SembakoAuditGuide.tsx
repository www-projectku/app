import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Package, 
  ShoppingBag, 
  RefreshCw, 
  ArrowRight, 
  FileCode, 
  Copy, 
  Check, 
  Sparkles, 
  Calendar, 
  Scale, 
  ShieldAlert,
  Database
} from 'lucide-react';
import { 
  SEMBAKO_AUDIT_CHECKLIST, 
  INITIAL_SEMBAKO_PRODUCTS, 
  SEMBAKO_SQL_DDL, 
  SembakoProduct 
} from '../data/sembakoSchemaData';

export const SembakoAuditGuide: React.FC = () => {
  const [products, setProducts] = useState<SembakoProduct[]>([...INITIAL_SEMBAKO_PRODUCTS]);
  const [activeTab, setActiveTab] = useState<'koreksi' | 'simulator_sembako' | 'sql_sembako'>('koreksi');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Sembako quick action simulation
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [actionType, setActionType] = useState<'kulakan' | 'jual' | 'opname'>('kulakan');
  const [actionQty, setActionQty] = useState<number>(5);
  const [actionNotes, setActionNotes] = useState<string>('Kulakan dari Agen Beras Bulog');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExecuteSembakoAction = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);

    const target = products.find((p) => p.id === selectedProductId);
    if (!target) return;

    if (actionType === 'kulakan') {
      // Tambah stok
      const updated = products.map((p) => {
        if (p.id === selectedProductId) {
          const newStok = p.stok_saat_ini + actionQty;
          return {
            ...p,
            stok_saat_ini: newStok,
            status_stok: newStok <= p.stok_minimum ? 'kritis' : 'aman',
          };
        }
        return p;
      });
      setProducts(updated as SembakoProduct[]);
      setFeedbackMsg({
        type: 'success',
        text: `Kulakan Berhasil: +${actionQty} ${target.satuan_utama} ditambahkan ke stok ${target.nama}. Total stok sekarang: ${target.stok_saat_ini + actionQty} ${target.satuan_utama}.`,
      });
    } else if (actionType === 'jual') {
      // Kurangi stok (Validasi stok tidak boleh minus)
      if (actionQty > target.stok_saat_ini) {
        setFeedbackMsg({
          type: 'error',
          text: `Gagal! Stok ${target.nama} hanya ada ${target.stok_saat_ini} ${target.satuan_utama}. Pembelian ${actionQty} ${target.satuan_utama} ditolak oleh sistem.`,
        });
        return;
      }
      const updated = products.map((p) => {
        if (p.id === selectedProductId) {
          const newStok = p.stok_saat_ini - actionQty;
          let status: 'aman' | 'kritis' | 'habis' = 'aman';
          if (newStok === 0) status = 'habis';
          else if (newStok <= p.stok_minimum) status = 'kritis';

          return { ...p, stok_saat_ini: newStok, status_stok: status };
        }
        return p;
      });
      setProducts(updated as SembakoProduct[]);
      setFeedbackMsg({
        type: 'success',
        text: `Penjualan Berhasil: -${actionQty} ${target.satuan_utama} terjual. Sisa stok toko: ${target.stok_saat_ini - actionQty} ${target.satuan_utama}.`,
      });
    } else if (actionType === 'opname') {
      // Penyesuaian fisik opname
      const updated = products.map((p) => {
        if (p.id === selectedProductId) {
          return {
            ...p,
            stok_saat_ini: actionQty,
            status_stok: actionQty <= p.stok_minimum ? (actionQty === 0 ? 'habis' : 'kritis') : 'aman',
          };
        }
        return p;
      });
      setProducts(updated as SembakoProduct[]);
      setFeedbackMsg({
        type: 'success',
        text: `Stock Opname Sembako: Stok fisik ${target.nama} disesuaikan menjadi ${actionQty} ${target.satuan_utama} (Catatan: ${actionNotes}).`,
      });
    }

    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SEMBAKO_SQL_DDL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Primary Audit Verdict Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/40 border border-amber-600/50 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              Hasil Evaluasi Kesesuaian Judul Tugas
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Status: <span className="text-rose-400">TIDAK SESUAI (Mismatch Signifikan)</span>
            </h2>

            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl space-y-2">
              <p>
                <strong>Judul Tugas Anda:</strong>{' '}
                <span className="text-amber-300 font-semibold underline decoration-amber-500/50">
                  "Perancangan dan Pengembangan Pengelolaan Stok Barang pada Toko Sembako Berbasis Web."
                </span>
              </p>
              <p>
                <strong>Kondisi Link GitHub Saat Ini:</strong>{' '}
                <code className="text-cyan-300 font-mono text-xs bg-slate-950 px-2 py-0.5 rounded">
                  https://www-projectku.github.io/Tugas-CP/
                </code>{' '}
                adalah sebuah website <strong>Company Profile statis</strong> (perkenalan perusahaan/jasa), <em>bukan</em> sistem inventaris toko sembako.
              </p>
              <p className="text-slate-400 text-xs">
                Jika diuji oleh dosen atau penguji sidang, aplikasi ini <strong>pasti akan dikritisi</strong> karena tidak ada satupun fitur pengelolaan stok beras, minyak, telur, barang masuk (kulakan), barang keluar, maupun penghitungan stock opname.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 shrink-0">
            <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400">Skor Kesesuaian Judul</div>
              <div className="text-3xl font-extrabold text-rose-400 mt-0.5">25%</div>
              <div className="text-[10px] text-rose-300">Wajib Dirombak</div>
            </div>

            <button
              onClick={() => setActiveTab('simulator_sembako')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Coba Sistem Stok Sembako Live</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'koreksi', label: '1. Rincian Koreksi: Dihilangkan, Diubah & Ditambah', icon: CheckCircle2 },
          { id: 'simulator_sembako', label: '2. Simulasi Stok Toko Sembako (Beras, Minyak, Telur)', icon: ShoppingBag },
          { id: 'sql_sembako', label: '3. Skrip Database SQL Khusus Toko Sembako (10 Tabel)', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: RINCIAN KOREKSI 3 PILAR */}
      {activeTab === 'koreksi' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Daftar Koreksi Komprehensif Sesuai Judul Tugas
            </h3>
            <span className="text-xs text-slate-400 font-mono">Pedoman Revisi Skripsi / Tugas Akhir</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. DIHILANGKAN */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-rose-900/40 space-y-4">
              <div className="flex items-center gap-2 text-rose-400">
                <XCircle className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-white text-sm">1. Yang Harus DIHILANGKAN (Remove)</h4>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Section "Tentang Kami" yang panjang & Visi Misi Korporat:</strong> Toko sembako tidak memerlukan narasi agensi digital atau profil direktur.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Portofolio Showcase:</strong> Dosen akan heran jika toko sembako memiliki galeri "karya desain/proyek web".</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Testimoni Klien Korporat:</strong> Ulasan bergaya "Direktur PT X memuji agensi kami" harus dihilangkan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Formulir Kontak Umum:</strong> Form "Kirim Pesan / Hubungi Kami" tidak relevan untuk pengelolaan persediaan sembako.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Istilah CP (Company Profile):</strong> Singkirkan istilah CP pada judul, header, dan dokumentasi.</span>
                </li>
              </ul>
            </div>

            {/* 2. DIUBAH */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-amber-900/40 space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <RefreshCw className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-white text-sm">2. Yang Harus DIUBAH (Modify)</h4>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">↻</span>
                  <span><strong>Tipe Website:</strong> Dari <em>Landing Page Promosi Statis</em> diubah menjadi <em>Aplikasi Web Dashboard Manajemen Stok (CRUD & Transaksi)</em>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">↻</span>
                  <span><strong>Katalog Layanan ➜ Master Barang Sembako:</strong> Ganti entitas layanan menjadi produk sembako: Beras, Minyak Goreng, Gula Pasir, Telur, Tepung, Mie Instan, Susu, Bumbu Dapur.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">↻</span>
                  <span><strong>Satuan Barang:</strong> Harus mendukung multi-satuan sembako: <code>karung (25kg/50kg)</code>, <code>peti (15kg)</code>, <code>pouch (2L)</code>, <code>dus (40 bks)</code>, dan <code>kg</code>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">↻</span>
                  <span><strong>Struktur Harga:</strong> Wajib memisahkan <strong>Harga Beli Kulakan (HPP)</strong> dan <strong>Harga Jual Eceran</strong> untuk menghitung keuntungan toko.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">↻</span>
                  <span><strong>Nama Proyek/URL:</strong> Rename repositori GitHub dari <code>Tugas-CP</code> menjadi <code>stok-toko-sembako-web</code>.</span>
                </li>
              </ul>
            </div>

            {/* 3. DITAMBAHKAN */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-900/40 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-white text-sm">3. Yang Harus DITAMBAHKAN (Add)</h4>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Modul Barang Masuk (Kulakan):</strong> Form pencatatan belanja sembako dari Agen/Distributor (Beras Bulog, Minyak Bimoli, Agen Telur) lengkap dengan tanggal & nota.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Modul Barang Keluar (Penjualan & Susut):</strong> Pengurangan stok saat sembako terjual atau rusak (misal: telur pecah, karung beras sobek/tumpah).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Modul Stock Opname Sembako:</strong> Formulir audit berkala (menimbang karung beras dan menghitung dus minyak fisik vs catatan sistem) untuk mengetahui barang susut/hilang.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Peringatan Stok Menipis (Reorder Alert):</strong> Notifikasi visual jika beras tinggal &lt; 5 karung atau minyak tinggal &lt; 10 botol agar pemilik segera kulakan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Pelacakan Tanggal Kadaluwarsa (Expired Alert):</strong> Penting untuk produk sembako seperti telur (daya tahan 14-21 hari) dan mie/susu.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sembako Characteristic Deep-Dive */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              Karakteristik Unik Toko Sembako yang Sangat Disukai Dosen Penguji:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-bold text-amber-300">1. Konversi Satuan Bertingkat</div>
                <p className="text-slate-400 leading-relaxed">
                  Toko sembako kulakan dalam satuan besar (1 Karung Beras = 25kg, 1 Dus Indomie = 40 Bungkus) tapi sering dijual eceran per kg atau per bungkus.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-bold text-rose-300">2. Kerugian Susut & Barang Pecah</div>
                <p className="text-slate-400 leading-relaxed">
                  Pada saat stock opname, telur sering pecah atau gula tumpah karena kelembapan. Fitur pencatatan alasan selisih pada stock opname menjadi poin nilai A.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-bold text-emerald-300">3. Metode Persediaan FIFO</div>
                <p className="text-slate-400 leading-relaxed">
                  <em>First In First Out:</em> Barang sembako yang datang lebih dulu dari agen wajib dikeluarkan/dijual lebih dulu agar tidak kedaluwarsa di gudang.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SIMULATOR STOK TOKO SEMBAKO */}
      {activeTab === 'simulator_sembako' && (
        <div className="space-y-6">
          {/* Sembako Alert Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Total Komoditas Sembako</div>
              <div className="text-2xl font-bold text-white mt-1">{products.length} Komoditas</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Beras, Minyak, Telur, Gula, Mie</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-amber-900/40">
              <div className="text-[11px] text-amber-300">Stok Kritis (Segera Kulakan)</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">
                {products.filter((p) => p.status_stok === 'kritis').length} Produk
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Stok &lt; batas minimum</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-rose-900/40">
              <div className="text-[11px] text-rose-300">Stok Habis (Kosong)</div>
              <div className="text-2xl font-bold text-rose-400 mt-1">
                {products.filter((p) => p.status_stok === 'habis').length} Produk
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Stok = 0 (Tepung Terigu)</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Total Nilai Aset Kulakan</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">
                Rp{' '}
                {(
                  products.reduce((acc, curr) => acc + curr.stok_saat_ini * curr.harga_beli_kulakan, 0) /
                  1000000
                ).toFixed(1)}{' '}
                Jt
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Modal berputar di rak</div>
            </div>
          </div>

          {/* Sembako Quick Transact Form */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  Uji Coba Transaksi Sembako Real-Time
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulasikan kulakan beras masuk, penjualan minyak keluar, atau penyesuaian stock opname sembako.
                </p>
              </div>

              {feedbackMsg && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 animate-bounce ${
                    feedbackMsg.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {feedbackMsg.type === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <ShieldAlert className="w-3.5 h-3.5" />
                  )}
                  {feedbackMsg.text}
                </span>
              )}
            </div>

            <form onSubmit={handleExecuteSembakoAction} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pilih Komoditas Sembako:</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} (Sisa: {p.stok_saat_ini} {p.satuan_utama})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Jenis Operasi Stok:</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-medium"
                >
                  <option value="kulakan">Kulakan Masuk (+ Stok dari Agen)</option>
                  <option value="jual">Penjualan Eceran (- Stok Toko)</option>
                  <option value="opname">Stock Opname Fisik (Set Nilai Real)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {actionType === 'opname' ? 'Hasil Hitung Fisik Nyata:' : 'Jumlah Kuantitas:'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={actionQty}
                  onChange={(e) => setActionQty(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  className={`w-full py-2 px-4 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md ${
                    actionType === 'kulakan'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                      : actionType === 'jual'
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                      : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    {actionType === 'kulakan'
                      ? 'Simpan Kulakan (+IN)'
                      : actionType === 'jual'
                      ? 'Simpan Penjualan (-OUT)'
                      : 'Update Stock Opname'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Sembako Inventory Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-400" />
                Data Persediaan Barang Toko Sembako
              </h4>
              <span className="text-xs text-slate-400 font-mono">Format Sesuai Skripsi & Uji Tugas</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px]">
                    <th className="py-3 px-4">Kode Sembako</th>
                    <th className="py-3 px-4">Nama Komoditas</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3 text-center">Satuan</th>
                    <th className="py-3 px-3 text-center">Stok Riil</th>
                    <th className="py-3 px-3 text-center">Batas Min</th>
                    <th className="py-3 px-4 text-right">Harga Beli (HPP)</th>
                    <th className="py-3 px-4 text-right">Harga Jual</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 font-sans text-xs">
                  {products.map((p) => {
                    const isHabis = p.status_stok === 'habis';
                    const isKritis = p.status_stok === 'kritis';

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors text-slate-200">
                        <td className="py-3 px-4 font-mono font-semibold text-cyan-300">{p.kode}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{p.nama}</div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-500" /> Exp: {p.tanggal_kadaluwarsa}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-300">{p.kategori}</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-400">{p.satuan_utama}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-sm text-white">
                          {p.stok_saat_ini}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-400">{p.stok_minimum}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-300">
                          Rp {p.harga_beli_kulakan.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-300 font-semibold">
                          Rp {p.harga_jual_eceran.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {isHabis && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                              ✕ Habis!
                            </span>
                          )}
                          {isKritis && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              ⚠ Kritis!
                            </span>
                          )}
                          {!isHabis && !isKritis && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              ✓ Aman
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
        </div>
      )}

      {/* TAB 3: SKRIP DATABASE TOKO SEMBAKO (SQL DDL) */}
      {activeTab === 'sql_sembako' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                Skrip SQL DDL Toko Sembako (10 Tabel Relasional 3NF)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Struktur tabel database yang 100% cocok untuk judul tugas Anda. Siap di-import ke phpMyAdmin (XAMPP).
              </p>
            </div>

            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Tersalin!' : 'Salin Skrip SQL'}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 max-h-[500px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-200 select-all whitespace-pre bg-slate-950">
              {SEMBAKO_SQL_DDL}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
