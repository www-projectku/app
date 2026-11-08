export const GITHUB_PAGES_INDEX_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Toko Sembako Berkah Jaya - Pengelolaan Stok Barang Berbasis Web</title>
  <meta name="description" content="Perancangan dan Pengembangan Pengelolaan Stok Barang pada Toko Sembako Berbasis Web. Dilengkapi autentikasi hak akses Admin dan Petugas, mutasi barang masuk/keluar, dan stock opname fisik." />
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    code, .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-emerald-500 selection:text-black">

  <!-- TOP HEADER / BANNER -->
  <header class="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
    <!-- Academic Verification Bar -->
    <div class="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 px-4 py-2 text-xs border-b border-slate-800/80">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2 text-slate-300">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-slate-400">Judul Tugas:</span>
          <strong class="text-amber-300">"Perancangan dan Pengembangan Pengelolaan Stok Barang pada Toko Sembako Berbasis Web"</strong>
        </div>
        <div class="flex items-center gap-2 text-[11px]">
          <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Multi-User RBAC Ready</span>
        </div>
      </div>
    </div>

    <!-- MAIN NAVBAR -->
    <div class="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
          🌾
        </div>
        <div>
          <h1 class="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Toko Sembako Berkah Jaya
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-normal">Sistem Stok</span>
          </h1>
          <p class="text-xs text-slate-400">Grosir & Retail Sembako: Beras, Minyak, Gula, Telur & Mie Instan</p>
        </div>
      </div>

      <nav class="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-300">
        <a href="#tentang-toko" class="hover:text-emerald-400 transition-colors">Tentang Toko</a>
        <a href="#katalog-stok" class="hover:text-emerald-400 transition-colors">Katalog Sembako</a>
        <a href="#hak-akses" class="hover:text-emerald-400 transition-colors">Hak Akses Peran</a>
        <a href="#transaksi-mutasi" class="hover:text-emerald-400 transition-colors">Barang Masuk & Keluar</a>
        <a href="#stock-opname" class="hover:text-emerald-400 transition-colors">Stock Opname</a>
        <a href="#kontak" class="hover:text-emerald-400 transition-colors">Kontak</a>
      </nav>

      <!-- AUTH USER BADGE & SWITCHER -->
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <span id="user-avatar" class="text-base">👨‍💼</span>
          <div>
            <div id="user-name" class="text-white font-semibold leading-tight">H. Ridwan Supriyadi</div>
            <div id="user-role-badge" class="text-[10px] text-amber-400 font-bold uppercase">ADMINISTRATOR</div>
          </div>
        </div>

        <button onclick="toggleUserRole()" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1" title="Tukar peran antara Admin dan Petugas">
          🔄 <span id="switch-role-btn-text">Tukar Petugas</span>
        </button>

        <button onclick="openLoginModal()" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md">
          🔑 Login
        </button>
      </div>
    </div>
  </header>

  <!-- ROLE PRIVILEGE STATUS BANNER -->
  <div id="role-notification-bar" class="bg-amber-950/40 border-b border-amber-900/60 px-4 py-2 text-xs text-amber-200">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="font-bold">⭐ Mode Aktif: ADMINISTRATOR</span>
        <span class="text-slate-400">|</span>
        <span class="text-slate-300">Full Akses: Master SKU, HPP Kulakan, Otorisasi Penyesuaian Opname, dan Valuasi Aset Toko.</span>
      </div>
      <button onclick="toggleUserRole()" class="text-xs text-amber-300 hover:underline font-semibold">
        Uji Coba Tampilan Petugas →
      </button>
    </div>
  </div>

  <!-- HERO SECTION (Mirroring the Old Web Storefront Style) -->
  <section class="py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full">
    <div class="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-2xl relative overflow-hidden">
      <div class="max-w-3xl space-y-4">
        <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
          🌾 Toko Sembako Berkah Jaya • Sejak 2018
        </span>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
          Pusat Grosir & Eceran Sembako Terlengkap
        </h2>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
          Sistem Pengelolaan Stok Terpadu untuk mengontrol arus barang masuk kulakan dari distributor resmi, transaksi penjualan kasir dengan proteksi stok minus, serta audit fisik stock opname berkala.
        </p>

        <div class="flex flex-wrap gap-3 pt-2">
          <a href="#katalog-stok" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/30">
            Lihat Katalog Stok Sembako
          </a>
          <a href="#transaksi-mutasi" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-all">
            + Catat Barang Masuk / Keluar
          </a>
          <button onclick="openLoginModal()" class="px-5 py-2.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 font-semibold text-xs sm:text-sm transition-all">
            Halaman Login Admin & Petugas
          </button>
        </div>
      </div>

      <!-- 4 Quick Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/80">
        <div>
          <div class="text-xs text-slate-400">Total Komoditas</div>
          <div class="text-2xl font-bold text-white mt-1" id="stat-total-items">9 Produk</div>
        </div>
        <div>
          <div class="text-xs text-slate-400">Nilai Aset Modal (HPP)</div>
          <div class="text-2xl font-bold text-emerald-400 mt-1" id="stat-asset-val">Rp 18.2 Jt</div>
        </div>
        <div>
          <div class="text-xs text-slate-400">Stok Kritis (Segera Kulakan)</div>
          <div class="text-2xl font-bold text-amber-400 mt-1" id="stat-critical-items">3 Produk</div>
        </div>
        <div>
          <div class="text-xs text-slate-400">Akurasi Audit Opname</div>
          <div class="text-2xl font-bold text-cyan-400 mt-1" id="stat-accuracy">100%</div>
        </div>
      </div>
    </div>
  </section>

  <!-- TENTANG TOKO & PROFIL PERUSAHAAN (Old Web Company Profile Section) -->
  <section id="tentang-toko" class="py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div class="space-y-4">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
          Profil Toko Sembako Berkah Jaya
        </span>
        <h3 class="text-2xl sm:text-3xl font-bold text-white">
          Menjaga Ketahanan Pangan dengan Pengelolaan Stok Modern
        </h3>
        <p class="text-slate-300 text-sm leading-relaxed">
          Toko Sembako Berkah Jaya adalah badan usaha perdagangan kebutuhan pokok yang melayani kebutuhan rumah tangga dan lebih dari 200 warung kelontong mitra. Melalui sistem berbasis web ini, kami memantau ketersediaan barang secara akurat, mencegah stok kosong, dan memastikan mutu komoditas selalu segar.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div class="font-bold text-white text-sm">🎯 Visi Toko</div>
            <p class="text-xs text-slate-400">Pusat distribusi sembako rakyat terpercaya dengan transparansi harga dan stok pasti.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div class="font-bold text-white text-sm">⚙️ Misi Toko</div>
            <p class="text-xs text-slate-400">Digitalisasi pencatatan kulakan, kasir anti-stok minus, dan audit fisik teratur.</p>
          </div>
        </div>
      </div>

      <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h4 class="font-bold text-white text-base">Informasi Kapasitas & Layanan Gudang</h4>
        <div class="space-y-3 text-xs">
          <div class="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span class="text-slate-400">Komoditas Utama:</span>
            <strong class="text-white">Beras, Minyak, Gula, Telur, Tepung, Mie</strong>
          </div>
          <div class="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span class="text-slate-400">Metode Pengawasan Kadaluwarsa:</span>
            <strong class="text-cyan-400">FIFO (First In, First Out)</strong>
          </div>
          <div class="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span class="text-slate-400">Mitra Agen Resmi:</span>
            <strong class="text-emerald-400">BULOG, Salim Ivomas, Peternak Blitar, Indofood</strong>
          </div>
          <div class="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span class="text-slate-400">Waktu Operasional Toko:</span>
            <strong class="text-amber-400">Setiap Hari: 07.00 - 21.00 WIB</strong>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- PERBEDAAN HAK AKSES PERAN (ADMIN VS PETUGAS) -->
  <section id="hak-akses" class="py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
    <div class="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950/30 border border-slate-800 space-y-6">
      <div class="max-w-2xl">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
          Role-Based Access Control (RBAC)
        </span>
        <h3 class="text-2xl font-bold text-white mt-2">Perbedaan Hak Akses: Administrator vs Petugas</h3>
        <p class="text-xs text-slate-400 mt-1">
          Sistem memisahkan tugas operasional fisik kasir dari wewenang finansial dan otorisasi pemilik toko.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- PETUGAS CARD -->
        <div class="p-6 rounded-2xl bg-slate-950 border border-cyan-800/40 space-y-3">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <div class="font-bold text-cyan-300 text-base">👩‍💼 PETUGAS GUDANG & KASIR</div>
            <span class="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">Operasional</span>
          </div>
          <div class="text-xs space-y-1.5 text-slate-300">
            <div class="text-emerald-400 font-semibold">✓ Fitur yang Bisa Diakses:</div>
            <ul class="list-disc pl-5 space-y-1 text-[11px]">
              <li>Melihat Stok Riil Komoditas & Lokasi Rak Display</li>
              <li>Mencatat Barang Masuk (+Kulakan Supplier/Agen)</li>
              <li>Mencatat Barang Keluar (-Penjualan Kasir dengan Anti-Stok Minus)</li>
              <li>Input Hasil Hitung Fisik Stock Opname di Gudang</li>
            </ul>
            <div class="text-rose-400 font-semibold pt-2 border-t border-slate-800">✕ Fitur yang Terkunci:</div>
            <ul class="list-disc pl-5 space-y-1 text-[11px] text-slate-400">
              <li>Harga Beli Modal (HPP) & Margin Keuntungan Dirahasiakan</li>
              <li>Tidak Berhak Menyetujui Sinkronisasi Saldo Opname (Adjustment)</li>
              <li>Tidak Dapat Menambah/Menghapus Master SKU Produk</li>
            </ul>
          </div>
        </div>

        <!-- ADMIN CARD -->
        <div class="p-6 rounded-2xl bg-slate-950 border border-amber-800/40 space-y-3">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <div class="font-bold text-amber-300 text-base">👨‍💼 ADMINISTRATOR / PEMILIK</div>
            <span class="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">Full Access</span>
          </div>
          <div class="text-xs space-y-1.5 text-slate-300">
            <div class="text-emerald-400 font-semibold">✓ Seluruh Wewenang Admin Penuh:</div>
            <ul class="list-disc pl-5 space-y-1 text-[11px]">
              <li>Full CRUD Master Komoditas Sembako (Tambah, Edit, Hapus)</li>
              <li>Melihat & Mengatur Harga Modal Kulakan (HPP) serta Margin Untung</li>
              <li><strong>Otorisasi Stock Opname:</strong> Menyetujui penyesuaian selisih kerugian ke saldo master</li>
              <li>Laporan Keuangan Nilai Total Aset Persediaan Toko</li>
              <li>Manajemen Data Rekanan Agen Distributor Resmi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- KATALOG STOK SEMBAKO -->
  <section id="katalog-stok" class="py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="text-xl font-bold text-white">Katalog & Saldo Stok Barang Sembako</h3>
        <p class="text-xs text-slate-400 mt-1">Data master komoditas, stok riil di rak, harga kulakan vs eceran, dan tanggal kadaluwarsa.</p>
      </div>

      <div class="flex items-center gap-2">
        <input type="text" id="search-input" placeholder="Cari beras, minyak, SKU..." oninput="filterProducts()" class="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 w-52 sm:w-64" />
      </div>
    </div>

    <!-- Product Grid -->
    <div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <!-- Injected by JavaScript -->
    </div>
  </section>

  <!-- TRANSAKSI BARANG MASUK & KELUAR -->
  <section id="transaksi-mutasi" class="py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
    <div>
      <h3 class="text-xl font-bold text-white">Transaksi Mutasi: Barang Masuk & Barang Keluar</h3>
      <p class="text-xs text-slate-400 mt-1">Pencatatan faktur kulakan supplier dan nota penjualan kasir dengan proteksi stok minus.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- FORM KULAKAN MASUK -->
      <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 class="font-bold text-emerald-400 text-sm flex items-center gap-2">
            🚚 Catat Barang Masuk (Kulakan dari Agen)
          </h4>
          <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">+Stok Toko</span>
        </div>

        <form id="form-kulakan" onsubmit="handleKulakan(event)" class="space-y-3 text-xs">
          <div>
            <label class="block text-slate-300 font-semibold mb-1">Pilih Komoditas Sembako:</label>
            <select id="kulakan-barang-id" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:border-emerald-500">
              <!-- Injected by JS -->
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-300 font-semibold mb-1">Jumlah Masuk:</label>
              <input type="number" id="kulakan-qty" min="1" value="10" required class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono font-bold" />
            </div>
            <div>
              <label class="block text-slate-300 font-semibold mb-1">Pemasok / Agen:</label>
              <select id="kulakan-agen" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white">
                <option value="Perum BULOG Divre">Perum BULOG (Beras & Gula)</option>
                <option value="PT Salim Ivomas">PT Salim Ivomas (Minyak Bimoli)</option>
                <option value="Peternakan Blitar">Peternakan Blitar (Telur Ayam)</option>
                <option value="PT Indofood">PT Indofood (Indomie & Tepung)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-slate-300 font-semibold mb-1">Keterangan / No Faktur:</label>
            <input type="text" id="kulakan-notes" value="Kulakan pasokan mingguan" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
          </div>

          <button type="submit" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-600/30">
            Simpan Barang Masuk (+Stok)
          </button>
        </form>
      </div>

      <!-- FORM PENJUALAN KELUAR -->
      <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 class="font-bold text-rose-400 text-sm flex items-center gap-2">
            📉 Catat Barang Keluar (Penjualan / Rusak)
          </h4>
          <span class="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono">-Stok Toko</span>
        </div>

        <form id="form-penjualan" onsubmit="handlePenjualan(event)" class="space-y-3 text-xs">
          <div>
            <label class="block text-slate-300 font-semibold mb-1">Pilih Komoditas Sembako:</label>
            <select id="penjualan-barang-id" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:border-rose-500">
              <!-- Injected by JS -->
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-300 font-semibold mb-1">Jumlah Keluar:</label>
              <input type="number" id="penjualan-qty" min="1" value="2" required class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono font-bold" />
            </div>
            <div>
              <label class="block text-slate-300 font-semibold mb-1">Tipe Pengeluaran:</label>
              <select id="penjualan-tipe" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white">
                <option value="penjualan_eceran">Penjualan Eceran Kasir</option>
                <option value="penjualan_grosir">Penjualan Grosir Warung</option>
                <option value="barang_rusak">Telur Pecah / Karung Bocor</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-slate-300 font-semibold mb-1">Nama Pembeli / Catatan:</label>
            <input type="text" id="penjualan-notes" value="Pelanggan Warung Bu Siti" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
          </div>

          <button type="submit" class="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-600/30">
            Simpan Barang Keluar (-Stok)
          </button>
        </form>
      </div>
    </div>
  </section>

  <!-- STOCK OPNAME SECTION -->
  <section id="stock-opname" class="py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="text-xl font-bold text-white flex items-center gap-2">
          📋 Lembar Audit Stock Opname Toko Sembako
        </h3>
        <p class="text-xs text-slate-400 mt-1">Pencocokan stok catatan komputer vs hitungan riil di rak toko (susut timbangan, telur pecah, kadaluwarsa).</p>
      </div>

      <button id="btn-apply-opname" onclick="applyOpnameAdjustment()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all">
        ✓ Sinkronkan Stok Fisik ke Master (Admin)
      </button>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
              <th class="py-3 px-4">Nama Komoditas</th>
              <th class="py-3 px-3 text-center">Satuan</th>
              <th class="py-3 px-3 text-center">Stok Sistem</th>
              <th class="py-3 px-3 text-center w-36">Stok Fisik Toko</th>
              <th class="py-3 px-3 text-center">Selisih</th>
              <th class="py-3 px-4">Penyebab Deviasi</th>
            </tr>
          </thead>
          <tbody id="opname-table-body" class="divide-y divide-slate-800 font-sans text-xs">
            <!-- Injected by JS -->
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- KONTAK & PEMESANAN TOKO -->
  <section id="kontak" class="py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
    <div class="p-8 rounded-3xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div class="space-y-3">
        <h3 class="text-xl font-bold text-white">Hubungi Toko Sembako Berkah Jaya</h3>
        <p class="text-xs text-slate-400">Siap melayani pesanan kulakan grosir warung mitra dan kebutuhan pokok rumah tangga.</p>
        <div class="text-xs space-y-2 pt-2 text-slate-300">
          <div>📍 <strong>Alamat:</strong> Jl. Pasar Raya Sembako No. 45, Blok B3, Jakarta Timur</div>
          <div>📞 <strong>Telepon / WA:</strong> 0812-3456-7890 (H. Ridwan - Admin) / 0857-9876-5432 (Siti - Kasir)</div>
          <div>⏰ <strong>Jam Operasional:</strong> Buka Setiap Hari (07.00 - 21.00 WIB)</div>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
        <div class="font-bold text-emerald-400">Kirim Pesan Cepat Pemesanan Sembako:</div>
        <input type="text" placeholder="Nama Anda / Nama Warung..." class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white" />
        <textarea rows="2" placeholder="Pesanan (cth: Beras Pandan Wangi 3 Karung, Minyak 2 Dus)..." class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white"></textarea>
        <button onclick="alert('Permintaan pesanan telah dicatat! Petugas kami akan segera menghubungi Anda.')" class="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs">
          Kirimkan Pesanan
        </button>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="mt-auto border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 text-xs text-slate-500">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2 text-slate-300">
        <span class="text-emerald-400 font-bold">🌾 Toko Sembako Berkah Jaya</span>
        <span>|</span>
        <span class="text-slate-500">Perancangan dan Pengembangan Pengelolaan Stok Barang pada Toko Sembako Berbasis Web</span>
      </div>
      <div class="text-slate-400">Normalisasi 3NF, FIFO & Proteksi Stok Minus</div>
    </div>
  </footer>

  <!-- LOGIN MODAL DIALOG -->
  <div id="login-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div class="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          🔑 Masuk Sistem Pengelolaan Stok
        </h3>
        <button onclick="closeLoginModal()" class="text-slate-400 hover:text-white text-lg font-bold">✕</button>
      </div>

      <div class="space-y-3">
        <label class="block text-xs font-semibold text-slate-300">Pilih Peran Akun:</label>
        <div class="grid grid-cols-2 gap-3">
          <button type="button" onclick="selectModalRole('admin')" id="modal-role-admin" class="p-3 rounded-xl border text-left bg-amber-950/40 border-amber-500 text-xs">
            <div class="font-bold text-amber-300">👨‍💼 ADMIN</div>
            <div class="text-[10px] text-slate-400">H. Ridwan Supriyadi</div>
          </button>
          <button type="button" onclick="selectModalRole('petugas')" id="modal-role-petugas" class="p-3 rounded-xl border text-left bg-slate-950 border-slate-800 text-xs">
            <div class="font-bold text-cyan-300">👩‍💼 PETUGAS</div>
            <div class="text-[10px] text-slate-400">Siti Fatimah</div>
          </button>
        </div>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block text-slate-300 font-semibold mb-1">Email:</label>
          <input type="email" id="modal-email" value="admin@sembakoberkah.com" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono" />
        </div>
        <div>
          <label class="block text-slate-300 font-semibold mb-1">Kata Sandi:</label>
          <input type="password" value="password123" class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
        </div>
      </div>

      <button onclick="submitModalLogin()" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg">
        Masuk Sekarang
      </button>
    </div>
  </div>

  <!-- CORE JAVASCRIPT APPLICATION LOGIC -->
  <script>
    let currentRole = 'admin'; // 'admin' or 'petugas'

    const users = {
      admin: { nama: 'H. Ridwan Supriyadi', role: 'admin', avatar: '👨‍💼', label: 'ADMINISTRATOR' },
      petugas: { nama: 'Siti Fatimah Azzahra', role: 'petugas', avatar: '👩‍💼', label: 'PETUGAS GUDANG & KASIR' }
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
        ? 'text-[10px] text-amber-400 font-bold uppercase'
        : 'text-[10px] text-cyan-400 font-bold uppercase';

      document.getElementById('switch-role-btn-text').innerText = currentRole === 'admin' ? 'Tukar Petugas' : 'Tukar Admin';

      const bar = document.getElementById('role-notification-bar');
      if (currentRole === 'admin') {
        bar.className = 'bg-amber-950/40 border-b border-amber-900/60 px-4 py-2 text-xs text-amber-200';
        bar.innerHTML = \`
          <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="font-bold">⭐ Mode Aktif: ADMINISTRATOR</span>
              <span class="text-slate-400">|</span>
              <span class="text-slate-300">Full Akses: Master SKU, HPP Kulakan, Otorisasi Penyesuaian Opname, dan Valuasi Aset Toko.</span>
            </div>
            <button onclick="toggleUserRole()" class="text-xs text-amber-300 hover:underline font-semibold">
              Uji Coba Tampilan Petugas →
            </button>
          </div>
        \`;
      } else {
        bar.className = 'bg-cyan-950/40 border-b border-cyan-900/60 px-4 py-2 text-xs text-cyan-200';
        bar.innerHTML = \`
          <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="font-bold">🔒 Mode Aktif: PETUGAS GUDANG & KASIR</span>
              <span class="text-slate-400">|</span>
              <span class="text-slate-300">Akses Terbatas: Dapat mencatat barang masuk/keluar & input fisik opname. HPP dan Otorisasi Opname Terkunci.</span>
            </div>
            <button onclick="toggleUserRole()" class="text-xs text-cyan-300 hover:underline font-semibold">
              Uji Coba Tampilan Admin →
            </button>
          </div>
        \`;
      }

      renderProducts();
    }

    function toggleUserRole() {
      currentRole = currentRole === 'admin' ? 'petugas' : 'admin';
      updateRoleUI();
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
        document.getElementById('modal-role-admin').className = 'p-3 rounded-xl border text-left bg-amber-950/40 border-amber-500 text-xs';
        document.getElementById('modal-role-petugas').className = 'p-3 rounded-xl border text-left bg-slate-950 border-slate-800 text-xs';
        document.getElementById('modal-email').value = 'admin@sembakoberkah.com';
      } else {
        document.getElementById('modal-role-admin').className = 'p-3 rounded-xl border text-left bg-slate-950 border-slate-800 text-xs';
        document.getElementById('modal-role-petugas').className = 'p-3 rounded-xl border text-left bg-cyan-950/40 border-cyan-500 text-xs';
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
      const penjualanSelect = document.getElementById('penjualan-barang-id');

      let html = '';
      let optionsHtml = '';

      products.forEach(p => {
        const isHabis = p.stok === 0;
        const isKritis = p.stok > 0 && p.stok <= p.min;
        const statusBadge = isHabis 
          ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">✕ Habis</span>'
          : isKritis
          ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">⚠ Kritis</span>'
          : '<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">✓ Aman</span>';

        const hppRow = currentRole === 'admin'
          ? \`<div class="flex justify-between text-xs text-slate-400">
               <span>Harga Modal Kulakan (HPP):</span>
               <strong class="font-mono text-slate-200">Rp \${p.beli.toLocaleString('id-ID')}</strong>
             </div>\`
          : \`<div class="flex justify-between text-xs text-slate-500 italic">
               <span>Harga Modal Kulakan (HPP):</span>
               <span class="text-amber-500/70">🔒 Rahasia Admin</span>
             </div>\`;

        html += \`
          <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-lg">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="font-mono text-xs text-cyan-300 font-semibold">\${p.kode}</span>
                \${statusBadge}
              </div>
              <h4 class="font-bold text-white text-sm">\${p.nama}</h4>
              <div class="text-[11px] text-slate-400 mt-1">Rak: \${p.rak} | Exp: \${p.exp}</div>
            </div>

            <div class="space-y-2 pt-3 border-t border-slate-800/80">
              <div class="flex justify-between text-xs text-slate-300">
                <span>Stok Toko:</span>
                <strong class="font-mono text-white">\${p.stok} \${p.satuan}</strong>
              </div>
              \${hppRow}
              <div class="flex justify-between text-xs text-slate-300">
                <span>Harga Jual Eceran:</span>
                <strong class="font-mono text-emerald-400 font-bold">Rp \${p.jual.toLocaleString('id-ID')}</strong>
              </div>
            </div>
          </div>
        \`;

        optionsHtml += \`<option value="\${p.id}">\${p.nama} (Stok: \${p.stok} \${p.satuan})</option>\`;
      });

      grid.innerHTML = html;
      kulakanSelect.innerHTML = optionsHtml;
      penjualanSelect.innerHTML = optionsHtml;

      renderOpnameTable();
    }

    function renderOpnameTable() {
      const tbody = document.getElementById('opname-table-body');
      let html = '';

      opnameData.forEach(o => {
        const diffColor = o.selisih < 0 ? 'text-rose-400 font-bold' : o.selisih > 0 ? 'text-amber-400 font-bold' : 'text-slate-400';
        html += \`
          <tr class="hover:bg-slate-800/50">
            <td class="py-2.5 px-4 font-semibold text-white">\${o.nama}</td>
            <td class="py-2.5 px-3 text-center text-slate-400 font-mono">\${o.satuan}</td>
            <td class="py-2.5 px-3 text-center text-slate-300 font-mono font-bold">\${o.sistem}</td>
            <td class="py-2.5 px-3 text-center">
              <input type="number" min="0" value="\${o.fisik}" onchange="updatePhysicalStock(\${o.id}, this.value)" class="w-20 text-center py-1 px-2 rounded bg-slate-950 border border-slate-700 text-white font-mono font-bold" />
            </td>
            <td class="py-2.5 px-3 text-center font-mono \${diffColor}">\${o.selisih > 0 ? '+' + o.selisih : o.selisih}</td>
            <td class="py-2.5 px-4">
              <select onchange="updatePenyebab(\${o.id}, this.value)" class="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-slate-300 text-xs">
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

    function handlePenjualan(e) {
      e.preventDefault();
      const id = parseInt(document.getElementById('penjualan-barang-id').value);
      const qty = parseInt(document.getElementById('penjualan-qty').value) || 0;

      const p = products.find(prod => prod.id === id);
      if (p) {
        if (qty > p.stok) {
          alert('PROTEKSI STOK MINUS: Penjualan DITOLAK! Stok ' + p.nama + ' hanya tersisa ' + p.stok + ' ' + p.satuan);
          return;
        }
        p.stok -= qty;
        const o = opnameData.find(op => op.id === id);
        if (o) { o.sistem = p.stok; o.fisik = p.stok; o.selisih = 0; }
        alert('Penjualan Kasir Berhasil: -' + qty + ' ' + p.satuan + ' ' + p.nama + ' dikeluarkan.');
        renderProducts();
      }
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
