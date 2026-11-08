export const GITHUB_PAGES_INDEX_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Toko Sembako Berkah Jaya - Pengelolaan Stok Barang Berbasis Web</title>
  <meta name="description" content="Perancangan dan Pengembangan Pengelolaan Stok Barang pada Toko Sembako Berbasis Web. Dilengkapi autentikasi hak akses Admin dan Petugas, mutasi barang masuk/keluar, dan stock opname fisik." />
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Inter', -apple-system, sans-serif; background-color: #F8FAFC; color: #1E293B; }
    code, .font-mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
    @media print {
      header, #role-notification-bar, #tentang-toko, #hak-akses, #penerimaan-kulakan, #kontak, footer, button, .no-print {
        display: none !important;
      }
      body { background: white !important; color: black !important; }
      #stock-opname { padding: 0 !important; }
    }
  </style>
</head>
<body class="bg-[#F8FAFC] text-slate-800 min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white">

  <!-- TOP HEADER / BANNER -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
    <!-- Academic Verification Bar -->
    <div class="bg-slate-900 text-slate-300 px-4 py-2 text-xs border-b border-slate-800">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span class="text-slate-400">Judul Tugas:</span>
          <strong class="text-amber-300 font-medium">"Perancangan dan Pengembangan Pengelolaan Stok Barang pada Toko Sembako Berbasis Web"</strong>
        </div>
        <div class="flex items-center gap-2 text-[11px]">
          <span class="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-semibold">RBAC Admin & Petugas</span>
        </div>
      </div>
    </div>

    <!-- MAIN NAVBAR -->
    <div class="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-xl text-white shadow-xs">
          🌾
        </div>
        <div>
          <h1 class="text-base sm:text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Toko Sembako Berkah Jaya
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">Sistem Stok</span>
          </h1>
          <p class="text-xs text-slate-500">Grosir & Retail Sembako: Beras, Minyak, Gula, Telur & Mie Instan</p>
        </div>
      </div>

      <nav class="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
        <a href="#tentang-toko" class="hover:text-emerald-600 transition-colors">Tentang Toko</a>
        <a href="#katalog-stok" class="hover:text-emerald-600 transition-colors">Katalog Sembako</a>
        <a href="#penerimaan-kulakan" class="hover:text-emerald-600 transition-colors">Kulakan Masuk</a>
        <a href="#stock-opname" class="hover:text-emerald-600 transition-colors font-bold text-emerald-700">Audit Stock Opname</a>
        <a href="#hak-akses" class="hover:text-emerald-600 transition-colors">Hak Akses</a>
      </nav>

      <!-- AUTH USER BADGE & LOGIN -->
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <span id="user-avatar" class="text-base">👨‍💼</span>
          <div>
            <div id="user-name" class="text-slate-800 font-semibold leading-tight">H. Ridwan Supriyadi</div>
            <div id="user-role-badge" class="text-[10px] text-amber-700 font-bold uppercase">ADMINISTRATOR</div>
          </div>
        </div>

        <button onclick="openLoginModal()" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs">
          🔑 Ganti Akun / Login
        </button>
      </div>
    </div>
  </header>

  <!-- ROLE PRIVILEGE STATUS BANNER -->
  <div id="role-notification-bar" class="bg-amber-50/80 border-b border-amber-200 px-4 py-2 text-xs text-amber-900">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="font-bold">⭐ Mode Aktif: ADMINISTRATOR</span>
        <span class="text-slate-300">|</span>
        <span class="text-slate-600">Full Akses: Master SKU, HPP Kulakan, Otorisasi Penyesuaian Opname, dan Valuasi Aset Toko.</span>
      </div>
      <button onclick="openLoginModal()" class="text-xs text-amber-800 hover:underline font-semibold">
        Keluar / Ganti Akun →
      </button>
    </div>
  </div>

  <!-- HERO SECTION -->
  <section class="py-10 px-4 sm:px-6 max-w-7xl mx-auto w-full">
    <div class="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
      <div class="max-w-3xl space-y-4">
        <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          🌾 Toko Sembako Berkah Jaya • Sejak 2018
        </span>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
          Pusat Pengelolaan Stok Sembako Terpadu
        </h2>
        <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
          Sistem Pengelolaan Stok Modern untuk mengontrol arus barang masuk kulakan dari distributor resmi, pengawasan susut komoditas pangan, serta audit fisik stock opname berkala.
        </p>

        <div class="flex flex-wrap gap-3 pt-2">
          <a href="#katalog-stok" class="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs">
            Lihat Katalog Stok Sembako
          </a>
          <a href="#stock-opname" class="px-5 py-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs transition-all">
            Lembar Audit Stock Opname
          </a>
          <button onclick="openLoginModal()" class="px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs sm:text-sm transition-all">
            Login Admin & Petugas
          </button>
        </div>
      </div>

      <!-- 4 Quick Stats -->
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
          <div>
            <div class="text-xs text-slate-500 font-medium">Total Komoditas</div>
            <div class="text-2xl font-bold text-slate-800 font-mono mt-1" id="stat-total-items">9 Produk</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 font-medium">Nilai Aset Modal (HPP)</div>
            <div class="text-2xl font-bold text-emerald-600 font-mono mt-1" id="stat-asset-val">Rp 18.2 Jt</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 font-medium">Stok Kritis (Segera Kulakan)</div>
            <div class="text-2xl font-bold text-amber-600 font-mono mt-1" id="stat-critical-items">3 Produk</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 font-medium">Akurasi Audit Opname</div>
            <div class="text-2xl font-bold text-blue-600 font-mono mt-1" id="stat-accuracy">100%</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- TENTANG TOKO & PROFIL PERUSAHAAN -->
  <section id="tentang-toko" class="py-6 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          Profil Toko Sembako Berkah Jaya
        </span>
        <h3 class="text-2xl sm:text-3xl font-bold text-slate-800">
          Menjaga Ketahanan Pangan dengan Pengelolaan Stok Modern
        </h3>
        <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Toko Sembako Berkah Jaya adalah badan usaha perdagangan kebutuhan pokok yang melayani kebutuhan rumah tangga dan lebih dari 200 warung kelontong mitra. Melalui sistem berbasis web ini, kami memantau ketersediaan barang secara akurat, mencegah stok kosong, dan memastikan mutu komoditas selalu segar.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div class="font-bold text-slate-800 text-xs">🎯 Visi Toko</div>
            <p class="text-[11px] text-slate-500">Pusat distribusi sembako rakyat terpercaya dengan transparansi harga dan stok pasti.</p>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div class="font-bold text-slate-800 text-xs">⚙️ Misi Toko</div>
            <p class="text-[11px] text-slate-500">Digitalisasi pencatatan kulakan, kartu stok mutasi, dan audit fisik teratur.</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h4 class="font-bold text-slate-800 text-sm">Informasi Kapasitas & Layanan Gudang</h4>
        <div class="space-y-2.5 text-xs">
          <div class="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span class="text-slate-500">Komoditas Utama:</span>
            <strong class="text-slate-800">Beras, Minyak, Gula, Telur, Tepung, Mie</strong>
          </div>
          <div class="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span class="text-slate-500">Metode Pengawasan Kadaluwarsa:</span>
            <strong class="text-emerald-700 font-semibold">FIFO (First In, First Out)</strong>
          </div>
          <div class="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span class="text-slate-500">Mitra Agen Resmi:</span>
            <strong class="text-slate-800">BULOG, Salim Ivomas, Peternak Blitar, Indofood</strong>
          </div>
          <div class="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span class="text-slate-500">Waktu Operasional Toko:</span>
            <strong class="text-slate-800">Setiap Hari: 07.00 - 21.00 WIB</strong>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- PERBEDAAN HAK AKSES PERAN (ADMIN VS PETUGAS) -->
  <section id="hak-akses" class="py-6 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
    <div class="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
      <div class="max-w-2xl">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Role-Based Access Control (RBAC)
        </span>
        <h3 class="text-xl font-bold text-slate-800 mt-2">Perbedaan Hak Akses: Administrator vs Petugas</h3>
        <p class="text-xs text-slate-500 mt-1">
          Sistem memisahkan tugas operasional fisik kasir dari wewenang finansial dan otorisasi pemilik toko.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- PETUGAS CARD -->
        <div class="p-5 rounded-xl bg-blue-50/40 border border-blue-200 space-y-3">
          <div class="flex items-center justify-between border-b border-blue-100 pb-2">
            <div class="font-bold text-blue-900 text-sm">👩‍💼 PETUGAS GUDANG</div>
            <span class="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">Operasional</span>
          </div>
          <div class="text-xs space-y-1.5 text-slate-700">
            <div class="text-emerald-700 font-semibold">✓ Fitur yang Bisa Diakses:</div>
            <ul class="list-disc pl-5 space-y-1 text-[11px] text-slate-600">
              <li>Melihat Stok Riil Komoditas & Lokasi Rak Display</li>
              <li>Mencatat Barang Masuk (+Kulakan Supplier/Agen)</li>
              <li>Input Hasil Hitung Fisik Stock Opname di Gudang</li>
            </ul>
            <div class="text-rose-700 font-semibold pt-2 border-t border-blue-100">✕ Fitur yang Terkunci:</div>
            <ul class="list-disc pl-5 space-y-1 text-[11px] text-slate-500">
              <li>Harga Beli Modal (HPP) & Margin Keuntungan Dirahasiakan</li>
              <li>Tidak Berhak Menyetujui Sinkronisasi Saldo Opname (Adjustment)</li>
              <li>Tidak Dapat Menambah/Menghapus Master SKU Produk</li>
            </ul>
          </div>
        </div>

        <!-- ADMIN CARD -->
        <div class="p-5 rounded-xl bg-amber-50/40 border border-amber-200 space-y-3">
          <div class="flex items-center justify-between border-b border-amber-100 pb-2">
            <div class="font-bold text-amber-900 text-sm">👨‍💼 ADMINISTRATOR / PEMILIK</div>
            <span class="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">Full Access</span>
          </div>
          <div class="text-xs space-y-1.5 text-slate-700">
            <div class="text-emerald-700 font-semibold">✓ Seluruh Wewenang Admin Penuh:</div>
            <ul class="list-disc pl-5 space-y-1 text-[11px] text-slate-600">
              <li>Full CRUD Master Komoditas Sembako (Tambah, Edit, Hapus)</li>
              <li>Melihat & Mengatur Harga Modal Kulakan (HPP) serta Margin Untung</li>
              <li><strong>Otorisasi Stock Opname:</strong> Menyetujui penyesuaian selisih ke saldo master</li>
              <li>Laporan Keuangan Nilai Total Aset Persediaan Toko</li>
              <li>Manajemen Data Rekanan Agen Distributor Resmi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- KATALOG STOK SEMBAKO -->
  <section id="katalog-stok" class="py-6 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="text-lg font-bold text-slate-800">Katalog & Saldo Stok Barang Sembako</h3>
        <p class="text-xs text-slate-500 mt-0.5">Data master komoditas, stok riil di rak, harga kulakan vs eceran, dan tanggal kadaluwarsa.</p>
      </div>

      <div class="flex items-center gap-2">
        <input type="text" id="search-input" placeholder="Cari beras, minyak, SKU..." oninput="filterProducts()" class="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 w-52 sm:w-64" />
      </div>
    </div>

    <!-- Product Grid -->
    <div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Injected by JavaScript -->
    </div>
  </section>

  <!-- PENERIMAAN BARANG MASUK (KULAKAN SUPPLIER) -->
  <section id="penerimaan-kulakan" class="py-6 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          🚚 Penerimaan Barang Masuk (Kulakan Agen)
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">Pencatatan faktur barang masuk dari BULOG, Salim Ivomas, Peternak Blitar, dan Indofood untuk penambahan saldo stok.</p>
      </div>
      <a href="#stock-opname" class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs">
        📋 Ke Lembar Stock Opname
      </a>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- FORM KULAKAN MASUK (2 COLS) -->
      <div class="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 class="font-bold text-slate-800 text-sm">
            Pencatatan Faktur Kulakan Distributor
          </h4>
          <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold">+Saldo Gudang</span>
        </div>

        <form id="form-kulakan" onsubmit="handleKulakan(event)" class="space-y-3.5 text-xs">
          <div>
            <label class="block text-slate-700 font-semibold mb-1">Pilih Komoditas Sembako yang Diterima:</label>
            <select id="kulakan-barang-id" class="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-emerald-600">
              <!-- Injected by JS -->
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Jumlah Diterima (Qty):</label>
              <input type="number" id="kulakan-qty" min="1" value="10" required class="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 font-mono font-bold focus:outline-none focus:border-emerald-600" />
            </div>
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Pemasok / Agen Resmi:</label>
              <select id="kulakan-agen" class="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-600">
                <option value="Perum BULOG Divre">Perum BULOG (Beras & Gula)</option>
                <option value="PT Salim Ivomas">PT Salim Ivomas (Minyak Bimoli)</option>
                <option value="Peternakan Blitar">Peternakan Blitar (Telur Ayam)</option>
                <option value="PT Indofood">PT Indofood (Indomie & Tepung)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-slate-700 font-semibold mb-1">Nomor Faktur / Bukti Kirim Truk:</label>
            <input type="text" id="kulakan-notes" value="FAKTUR-BLG-2026-XI-01" class="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 font-mono focus:outline-none focus:border-emerald-600" />
          </div>

          <button type="submit" class="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs">
            Simpan Barang Masuk (+Stok Gudang)
          </button>
        </form>
      </div>

      <!-- KARTU INFORMASI JADWAL AUDIT OPNAME -->
      <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 class="font-bold text-slate-800 text-sm">
          ⏱️ Prosedur Audit Stock Opname
        </h4>
        <div class="space-y-3 text-xs text-slate-600">
          <div class="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <strong class="text-slate-800 block mb-0.5">1. Hitung Fisik Nyata:</strong>
            Petugas auditor menimbang sak beras/gula dan menghitung peti telur di rak.
          </div>
          <div class="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <strong class="text-slate-800 block mb-0.5">2. Catat Penyebab Selisih:</strong>
            Pemisahan telur retak, karung bocor, susut timbangan, atau kedaluwarsa.
          </div>
          <div class="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <strong class="text-slate-800 block mb-0.5">3. Otorisasi Administrator:</strong>
            Persetujuan penyesuaian saldo buku dan pengesahan Berita Acara (BAST).
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- STOCK OPNAME SECTION -->
  <section id="stock-opname" class="py-6 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          📋 Lembar Audit Stock Opname Toko Sembako
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">Pencocokan stok catatan komputer vs hitungan riil di rak toko (susut timbangan, telur pecah, kadaluwarsa).</p>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="printBAST()" class="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-all">
          🖨️ Cetak Berita Acara (BAST)
        </button>
        <button id="btn-apply-opname" onclick="applyOpnameAdjustment()" class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-all">
          ✓ Sinkronkan Stok Fisik ke Master (Admin)
        </button>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
              <th class="py-3 px-4">Nama Komoditas</th>
              <th class="py-3 px-3 text-center">Satuan</th>
              <th class="py-3 px-3 text-center">Stok Sistem</th>
              <th class="py-3 px-3 text-center w-36">Stok Fisik Toko</th>
              <th class="py-3 px-3 text-center">Selisih</th>
              <th class="py-3 px-4">Penyebab Deviasi</th>
            </tr>
          </thead>
          <tbody id="opname-table-body" class="divide-y divide-slate-100 font-sans text-xs">
            <!-- Injected by JS -->
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- KONTAK & PEMESANAN TOKO -->
  <section id="kontak" class="py-6 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
    <div class="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div class="space-y-3">
        <h3 class="text-lg font-bold text-slate-800">Hubungi Toko Sembako Berkah Jaya</h3>
        <p class="text-xs text-slate-500">Siap melayani pesanan kulakan grosir warung mitra dan kebutuhan pokok rumah tangga.</p>
        <div class="text-xs space-y-2 pt-2 text-slate-600">
          <div>📍 <strong>Alamat:</strong> Jl. Pasar Raya Sembako No. 45, Blok B3, Jakarta Timur</div>
          <div>📞 <strong>Telepon / WA:</strong> 0812-3456-7890 (H. Ridwan - Admin) / 0857-9876-5432 (Siti - Petugas)</div>
          <div>⏰ <strong>Jam Operasional:</strong> Buka Setiap Hari (07.00 - 21.00 WIB)</div>
        </div>
      </div>

      <div class="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
        <div class="font-bold text-slate-800">Kirim Pesan Pemesanan Sembako:</div>
        <input type="text" placeholder="Nama Anda / Nama Warung..." class="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800" />
        <textarea rows="2" placeholder="Pesanan (cth: Beras Pandan Wangi 3 Karung, Minyak 2 Dus)..." class="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800"></textarea>
        <button onclick="alert('Permintaan pesanan telah dicatat! Petugas kami akan segera menghubungi Anda.')" class="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs">
          Kirimkan Pesanan
        </button>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="mt-auto border-t border-slate-200 bg-white py-6 px-4 sm:px-6 text-xs text-slate-500">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="text-slate-800 font-bold">🌾 Toko Sembako Berkah Jaya</span>
        <span>|</span>
        <span>Perancangan dan Pengembangan Pengelolaan Stok Barang pada Toko Sembako Berbasis Web</span>
      </div>
      <div class="text-slate-400">Normalisasi 3NF, FIFO & Proteksi Stok Minus</div>
    </div>
  </footer>

  <!-- LOGIN MODAL DIALOG -->
  <div id="login-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
    <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-5">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
          🔑 Masuk Sistem Pengelolaan Stok
        </h3>
        <button onclick="closeLoginModal()" class="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
      </div>

      <div class="space-y-3">
        <label class="block text-xs font-semibold text-slate-700">Pilih Peran Akun:</label>
        <div class="grid grid-cols-2 gap-3">
          <button type="button" onclick="selectModalRole('admin')" id="modal-role-admin" class="p-3 rounded-xl border text-left bg-amber-50 border-amber-300 text-xs">
            <div class="font-bold text-amber-900">👨‍💼 ADMIN</div>
            <div class="text-[10px] text-slate-500">H. Ridwan Supriyadi</div>
          </button>
          <button type="button" onclick="selectModalRole('petugas')" id="modal-role-petugas" class="p-3 rounded-xl border text-left bg-white border-slate-200 text-xs">
            <div class="font-bold text-blue-900">👩‍💼 PETUGAS</div>
            <div class="text-[10px] text-slate-500">Siti Fatimah</div>
          </button>
        </div>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">Email:</label>
          <input type="email" id="modal-email" value="admin@sembakoberkah.com" class="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 font-mono" />
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">Kata Sandi:</label>
          <input type="password" value="password123" class="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800" />
        </div>
      </div>

      <button onclick="submitModalLogin()" class="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs">
        Masuk Sekarang
      </button>
    </div>
  </div>

  <!-- CORE JAVASCRIPT APPLICATION LOGIC -->
  <script>
    let currentRole = 'admin';

    const users = {
      admin: { nama: 'H. Ridwan Supriyadi', role: 'admin', avatar: '👨‍💼', label: 'ADMINISTRATOR' },
      petugas: { nama: 'Siti Fatimah Azzahra', role: 'petugas', avatar: '👩‍💼', label: 'PETUGAS GUDANG' }
    };

    let products = [
      { id: 1, kode: 'SMB-BRS-001', nama: 'Beras Pandan Wangi Super (Sak 25kg)', kategori: 'Beras', satuan: 'karung (25kg)', stok: 18, min: 6, beli: 345000, jual: 380000, exp: '2027-06-30', rak: 'Palet A1' },
      { id: 2, kode: 'SMB-BRS-002', nama: 'Beras Setra Ramos IR 64 (Sak 10kg)', kategori: 'Beras', satuan: 'karung (10kg)', stok: 8, min: 10, beli: 138000, jual: 152000, exp: '2027-05-15', rak: 'Palet A2' },
      { id: 3, kode: 'SMB-MYK-003', nama: 'Minyak Goreng Bimoli Pouch 2L', kategori: 'Minyak', satuan: 'pouch (2L)', stok: 5, min: 15, beli: 34000, jual: 38500, exp: '2027-04-10', rak: 'Rak B1' },
      { id: 4, kode: 'SMB-MYK-004', nama: 'Minyakita Subsidi Pouch 1L', kategori: 'Minyak', satuan: 'pouch (1L)', stok: 24, min: 20, beli: 14000, jual: 15500, exp: '2027-03-20', rak: 'Rak B2' },
      { id: 5, kode: 'SMB-GLA-005', nama: 'Gula Pasir Kristal GMP (Sak 50kg)', kategori: 'Gula', satuan: 'karung (50kg)', stok: 3, min: 4, beli: 780000, jual: 840000, exp: '2027-11-30', rak: 'Palet A3' },
      { id: 6, kode: 'SMB-GLA-006', nama: 'Gula Pasir Gulaku Kuning 1kg', kategori: 'Gula', satuan: 'bks (1kg)', stok: 32, min: 15, beli: 16500, jual: 18500, exp: '2027-09-15', rak: 'Rak C1' },
      { id: 7, kode: 'SMB-TLR-007', nama: 'Telur Ayam Ras Segar (Peti 15kg)', kategori: 'Telur', satuan: 'peti (15kg)', stok: 7, min: 5, beli: 390000, jual: 435000, exp: '2026-11-26', rak: 'Ventilasi Sejuk' },
      { id: 8, kode: 'SMB-TPG-008', nama: 'Tepung Terigu Segitiga Biru 1kg', kategori: 'Tepung', satuan: 'bks (1kg)', stok: 0, min: 20, beli: 11000, jual: 13000, exp: '2027-01-20', rak: 'Rak C2' },
      { id: 9, kode: 'SMB-MIE-009', nama: 'Indomie Goreng (Dus isi 40 bks)', kategori: 'Mie', satuan: 'dus (40 bks)', stok: 35, min: 12, beli: 118000, jual: 132000, exp: '2027-04-18', rak: 'Rak D1' }
    ];

    let opnameData = products.map(p => ({
      id: p.id,
      nama: p.nama,
      satuan: p.satuan,
      sistem: p.stok,
      fisik: p.stok,
      selisih: 0,
      penyebab: 'sesuai'
    }));

    function updateRoleUI() {
      const u = users[currentRole];
      document.getElementById('user-avatar').innerText = u.avatar;
      document.getElementById('user-name').innerText = u.nama;
      document.getElementById('user-role-badge').innerText = u.label;
      document.getElementById('user-role-badge').className = currentRole === 'admin'
        ? 'text-[10px] text-amber-700 font-bold uppercase'
        : 'text-[10px] text-blue-700 font-bold uppercase';

      document.getElementById('switch-role-btn-text').innerText = currentRole === 'admin' ? 'Tukar Petugas' : 'Tukar Admin';

      const bar = document.getElementById('role-notification-bar');
      if (currentRole === 'admin') {
        bar.className = 'bg-amber-50/80 border-b border-amber-200 px-4 py-2 text-xs text-amber-900';
        bar.innerHTML = \`
          <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="font-bold">⭐ Mode Aktif: ADMINISTRATOR</span>
              <span class="text-slate-300">|</span>
              <span class="text-slate-600">Full Akses: Master SKU, HPP Kulakan, Otorisasi Penyesuaian Opname, dan Valuasi Aset Toko.</span>
            </div>
            <button onclick="openLoginModal()" class="text-xs text-amber-800 hover:underline font-semibold">
              Keluar / Ganti Akun →
            </button>
          </div>
        \`;
      } else {
        bar.className = 'bg-blue-50/80 border-b border-blue-200 px-4 py-2 text-xs text-blue-900';
        bar.innerHTML = \`
          <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="font-bold">🔒 Mode Aktif: PETUGAS GUDANG</span>
              <span class="text-slate-300">|</span>
              <span class="text-slate-600">Akses Terbatas: Dapat mencatat barang masuk/keluar & input fisik opname. HPP dan Otorisasi Opname Terkunci.</span>
            </div>
            <button onclick="openLoginModal()" class="text-xs text-blue-800 hover:underline font-semibold">
              Keluar / Ganti Akun →
            </button>
          </div>
        \`;
      }

      renderProducts();
    }

    function openLoginModal() {
      document.getElementById('login-modal').classList.remove('hidden');
      document.getElementById('login-modal').classList.add('flex');
    }

    function closeLoginModal() {
      document.getElementById('login-modal').classList.add('hidden');
      document.getElementById('login-modal').classList.remove('flex');
    }

    let tempModalRole = 'admin';
    function selectModalRole(role) {
      tempModalRole = role;
      if (role === 'admin') {
        document.getElementById('modal-role-admin').className = 'p-3 rounded-xl border text-left bg-amber-50 border-amber-300 text-xs';
        document.getElementById('modal-role-petugas').className = 'p-3 rounded-xl border text-left bg-white border-slate-200 text-xs';
        document.getElementById('modal-email').value = 'admin@sembakoberkah.com';
      } else {
        document.getElementById('modal-role-admin').className = 'p-3 rounded-xl border text-left bg-white border-slate-200 text-xs';
        document.getElementById('modal-role-petugas').className = 'p-3 rounded-xl border text-left bg-blue-50 border-blue-300 text-xs';
        document.getElementById('modal-email').value = 'petugas@sembakoberkah.com';
      }
    }

    function submitModalLogin() {
      currentRole = tempModalRole;
      closeLoginModal();
      updateRoleUI();
      alert('Berhasil Masuk sebagai ' + users[currentRole].label + ' (' + users[currentRole].nama + ')');
    }

    function renderProducts() {
      const grid = document.getElementById('product-grid');
      const kulakanSelect = document.getElementById('kulakan-barang-id');

      let html = '';
      let optionsHtml = '';

      products.forEach(p => {
        const isHabis = p.stok === 0;
        const isKritis = p.stok > 0 && p.stok <= p.min;
        const statusBadge = isHabis 
          ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">✕ Habis</span>'
          : isKritis
          ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">⚠ Kritis</span>'
          : '<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">✓ Aman</span>';

        const hppRow = currentRole === 'admin'
          ? \`<div class="flex justify-between text-xs text-slate-500">
               <span>Modal Kulakan (HPP):</span>
               <strong class="font-mono text-slate-800">Rp \${p.beli.toLocaleString('id-ID')}</strong>
             </div>\`
          : \`<div class="flex justify-between text-xs text-slate-400 italic">
               <span>Modal Kulakan (HPP):</span>
               <span class="text-amber-700">🔒 Rahasia Admin</span>
             </div>\`;

        html += \`
          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="font-mono text-xs text-emerald-700 font-semibold">\${p.kode}</span>
                \${statusBadge}
              </div>
              <h4 class="font-bold text-slate-800 text-sm">\${p.nama}</h4>
              <div class="text-[11px] text-slate-400 mt-1">Rak: \${p.rak} | Exp: \${p.exp}</div>
            </div>

            <div class="space-y-2 pt-3 border-t border-slate-100">
              <div class="flex justify-between text-xs text-slate-600">
                <span>Stok Toko:</span>
                <strong class="font-mono text-slate-800 font-bold">\${p.stok} \${p.satuan}</strong>
              </div>
              \${hppRow}
              <div class="flex justify-between text-xs text-slate-600">
                <span>Harga Jual Eceran:</span>
                <strong class="font-mono text-emerald-600 font-bold">Rp \${p.jual.toLocaleString('id-ID')}</strong>
              </div>
            </div>
          </div>
        \`;

        optionsHtml += \`<option value="\${p.id}">\${p.nama} (Stok: \${p.stok} \${p.satuan})</option>\`;
      });

      grid.innerHTML = html;
      if (kulakanSelect) kulakanSelect.innerHTML = optionsHtml;

      renderOpnameTable();
    }

    function renderOpnameTable() {
      const tbody = document.getElementById('opname-table-body');
      let html = '';

      opnameData.forEach(o => {
        const diffColor = o.selisih < 0 ? 'text-rose-600 font-bold' : o.selisih > 0 ? 'text-amber-600 font-bold' : 'text-slate-400';
        html += \`
          <tr class="hover:bg-slate-50/80 transition-colors">
            <td class="py-2.5 px-4 font-semibold text-slate-800">\${o.nama}</td>
            <td class="py-2.5 px-3 text-center text-slate-500 font-mono">\${o.satuan}</td>
            <td class="py-2.5 px-3 text-center text-slate-700 font-mono font-bold">\${o.sistem}</td>
            <td class="py-2.5 px-3 text-center">
              <input type="number" min="0" value="\${o.fisik}" onchange="updatePhysicalStock(\${o.id}, this.value)" class="w-20 text-center py-1 px-2 rounded-lg bg-white border border-slate-300 text-slate-800 font-mono font-bold focus:outline-none focus:border-emerald-600" />
            </td>
            <td class="py-2.5 px-3 text-center font-mono \${diffColor}">\${o.selisih > 0 ? '+' + o.selisih : o.selisih}</td>
            <td class="py-2.5 px-4">
              <select onchange="updatePenyebab(\${o.id}, this.value)" class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none">
                <option value="sesuai" \${o.penyebab === 'sesuai' ? 'selected' : ''}>✓ Pas / Sesuai</option>
                <option value="karung_bocor" \${o.penyebab === 'karung_bocor' ? 'selected' : ''}>Karung Bocor / Susut Timbangan</option>
                <option value="telur_pecah" \${o.penyebab === 'telur_pecah' ? 'selected' : ''}>Telur Pecah di Rak</option>
                <option value="kadaluwarsa" \${o.penyebab === 'kadaluwarsa' ? 'selected' : ''}>Kadaluwarsa / Rusak</option>
                <option value="hilang" \${o.penyebab === 'hilang' ? 'selected' : ''}>Hilang / Tidak Tercatat</option>
              </select>
            </td>
          </tr>
        \`;
      });

      tbody.innerHTML = html;
    }

    function updatePhysicalStock(id, val) {
      const num = Math.max(0, parseInt(val) || 0);
      const item = opnameData.find(o => o.id === id);
      if (item) {
        item.fisik = num;
        item.selisih = num - item.sistem;
        renderOpnameTable();
      }
    }

    function updatePenyebab(id, val) {
      const item = opnameData.find(o => o.id === id);
      if (item) item.penyebab = val;
    }

    function applyOpnameAdjustment() {
      if (currentRole !== 'admin') {
        alert('AKSES DITOLAK: Anda sedang login sebagai Petugas! Otorisasi penyesuaian selisih stock opname ke saldo master hanya dapat disetujui oleh Administrator / Pemilik Toko.');
        return;
      }

      opnameData.forEach(o => {
        const p = products.find(prod => prod.id === o.id);
        if (p) {
          p.stok = o.fisik;
          o.sistem = o.fisik;
          o.selisih = 0;
        }
      });
      alert('OTORISASI ADMIN BERHASIL: Stok Master Toko Sembako Berhasil Disinkronkan Sesuai Hasil Hitung Nyata!');
      renderProducts();
    }

    function handleKulakan(e) {
      e.preventDefault();
      const id = parseInt(document.getElementById('kulakan-barang-id').value);
      const qty = parseInt(document.getElementById('kulakan-qty').value) || 0;

      const p = products.find(prod => prod.id === id);
      if (p) {
        p.stok += qty;
        const o = opnameData.find(op => op.id === id);
        if (o) { o.sistem = p.stok; o.fisik = p.stok; o.selisih = 0; }
        alert('Berhasil Kulakan: +' + qty + ' ' + p.satuan + ' ' + p.nama + ' ditambahkan ke stok toko!');
        renderProducts();
      }
    }

    function printBAST() {
      window.print();
    }

    function filterProducts() {
      const query = document.getElementById('search-input').value.toLowerCase();
      const cards = document.querySelectorAll('#product-grid > div');
      products.forEach((p, idx) => {
        const match = p.nama.toLowerCase().includes(query) || p.kode.toLowerCase().includes(query);
        if (cards[idx]) {
          cards[idx].style.display = match ? 'flex' : 'none';
        }
      });
    }

    updateRoleUI();
  </script>
</body>
</html>
`;
