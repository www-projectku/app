import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  FileCode2, 
  Server, 
  ShieldAlert, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { TARGET_WEBSITE } from '../data/databaseSchemaData';

interface AuditOverviewProps {
  onNavigateToTab: (tab: string) => void;
}

export const AuditOverview: React.FC<AuditOverviewProps> = ({ onNavigateToTab }) => {
  return (
    <div className="space-y-8">
      {/* Primary Diagnostic Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-blue-950/40 border border-slate-700/80 shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              Temuan Utama Analisis Arsitektur
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Website Ini Berjalan di GitHub Pages: Saat Ini Berstatus <span className="text-amber-400">Statis Tanpa Database</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
              URL target <code className="px-1.5 py-0.5 rounded bg-slate-950 font-mono text-cyan-300 text-xs">{TARGET_WEBSITE.url}</code> di-hosting pada layanan <strong>GitHub Pages</strong>. Karakteristik utama GitHub Pages adalah <em>Static Web Hosting</em> (hanya melayani HTML, CSS, JavaScript, dan berkas statis). Akibatnya, website ini <strong>belum memiliki database persisten bawaan</strong> di sisi server.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => onNavigateToTab('erd')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Lihat Desain ERD Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateToTab('sql')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-all flex items-center justify-center gap-2"
            >
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              <span>Ambil Skrip SQL Siap Pakai</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comparison: Current State vs. With Database Identification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Limitations */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-red-900/40 space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-semibold text-white text-base">Kondisi Saat Ini (Tanpa Database)</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="p-1 rounded-full bg-rose-950 text-rose-400 mt-0.5">✕</span>
              <span><strong>Data Ter-Hardcode di HTML:</strong> Setiap perubahan nama layanan, alamat, kontak, atau harga mengharuskan pengeditan kode sumber HTML dan git commit ulang.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="p-1 rounded-full bg-rose-950 text-rose-400 mt-0.5">✕</span>
              <span><strong>Formulir Kontak Tidak Tersimpan:</strong> Pengunjung yang mengisi form "Hubungi Kami" tidak memiliki tabel penerima; data akan hilang begitu halaman di-refresh kecuali memakai layanan pihak ketiga.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="p-1 rounded-full bg-rose-950 text-rose-400 mt-0.5">✕</span>
              <span><strong>Tidak Ada Autentikasi Pengelola:</strong> Tidak ada tabel pengguna atau dashboard admin yang aman untuk mengelola konten web.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="p-1 rounded-full bg-rose-950 text-rose-400 mt-0.5">✕</span>
              <span><strong>Nilai Tugas Terancam Rendah:</strong> Dalam standar penilaian tugas web (Tugas-CP / Kuliah), ketiadaan database membuat nilai CRUD (Create, Read, Update, Delete) menjadi 0.</span>
            </li>
          </ul>
        </div>

        {/* Benefits with Identified Database */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-emerald-900/40 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-semibold text-white text-base">Setelah Menerapkan Database Ini</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="p-1 rounded-full bg-emerald-950 text-emerald-400 mt-0.5">✓</span>
              <span><strong>Konten Dinamis (Content Management):</strong> Profil perusahaan, katalog layanan, dan harga dibaca langsung dari tabel <code className="text-emerald-300 font-mono text-xs">companies</code> & <code className="text-emerald-300 font-mono text-xs">services</code>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="p-1 rounded-full bg-emerald-950 text-emerald-400 mt-0.5">✓</span>
              <span><strong>Pesan Masuk Tersimpan Aman:</strong> Setiap formulir masuk tercatat di tabel <code className="text-emerald-300 font-mono text-xs">contact_messages</code> lengkap dengan status <em>unread</em> dan timestamp.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="p-1 rounded-full bg-emerald-950 text-emerald-400 mt-0.5">✓</span>
              <span><strong>Normalisasi Penuh 3NF:</strong> Menggunakan foreign key <code className="text-emerald-300 font-mono text-xs">category_id</code> untuk mencegah redundansi nama kategori dan inkonsistensi data.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="p-1 rounded-full bg-emerald-950 text-emerald-400 mt-0.5">✓</span>
              <span><strong>Bisa Diintegrasikan Langsung:</strong> Dapat dihubungkan menggunakan <strong>Firebase Firestore</strong> (langsung dari GitHub Pages) atau <strong>MySQL / PostgreSQL</strong> via REST API!</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Database Entity Breakdown Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              Identifikasi 6 Tabel Utama untuk Website Tugas-CP
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Struktur entitas yang dirancang sesuai standar industri dan pedoman kurikulum rekayasa web:
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('dictionary')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
          >
            Lihat Kamus Data
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: 'companies',
              badge: 'Profil Utama',
              fields: '12 Kolom (Nama, Visi, Misi, Alamat, WA, Email)',
              desc: 'Identitas utama perusahaan, kontak operasional, dan info yang tampil di header & footer.',
              color: 'border-blue-800/40 bg-blue-950/20 text-blue-400',
            },
            {
              name: 'categories',
              badge: 'Katalog Master',
              fields: '5 Kolom (PK id, name, slug, icon)',
              desc: 'Mengelompokkan layanan/portofolio ke dalam kategori untuk normalisasi bentuk ketiga (3NF).',
              color: 'border-emerald-800/40 bg-emerald-950/20 text-emerald-400',
            },
            {
              name: 'services',
              badge: 'Layanan & Portofolio',
              fields: '11 Kolom (FK category_id, title, price, thumbnail)',
              desc: 'Daftar produk, layanan unggulan, estimasi harga, deskripsi, dan status publikasi.',
              color: 'border-cyan-800/40 bg-cyan-950/20 text-cyan-400',
            },
            {
              name: 'testimonials',
              badge: 'Bukti Sosial (Social Proof)',
              fields: '10 Kolom (FK service_id, client_name, rating, quote)',
              desc: 'Review kepuasan pelanggan bintang 1-5 dan nama perusahaan klien untuk membangun kepercayaan.',
              color: 'border-amber-800/40 bg-amber-950/20 text-amber-400',
            },
            {
              name: 'contact_messages',
              badge: 'Formulir Kontak (Interaksi)',
              fields: '9 Kolom (sender_name, email, subject, message, status)',
              desc: 'Menampung pesan tiket dari formulir "Hubungi Kami" beserta pelacakan status respon admin.',
              color: 'border-violet-800/40 bg-violet-950/20 text-violet-400',
            },
            {
              name: 'admin_users',
              badge: 'Autentikasi (RBAC)',
              fields: '9 Kolom (username, email, password_hash, role)',
              desc: 'Manajemen hak akses pengelola (Superadmin, Editor) dengan kata sandi terenkripsi.',
              color: 'border-rose-800/40 bg-rose-950/20 text-rose-400',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${item.color} flex flex-col justify-between hover:border-slate-600 transition-all`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-sm text-white">`{item.name}`</span>
                  <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-slate-900 border border-slate-700 text-slate-300">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{item.desc}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{item.fields}</span>
                <span className="text-cyan-400 font-mono">1NF-3NF OK</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic & Production Scorecard */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          Evaluasi Kualitas Desain Skema Database (Scorecard Audit)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-400">Tingkat Normalisasi</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">3NF</div>
            <div className="text-xs text-slate-400 mt-1">Bebas anomali pembaruan (update/insert/delete anomaly).</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-400">Integritas Relasional</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">100% Valid</div>
            <div className="text-xs text-slate-400 mt-1">Foreign Key Constraints dengan ON DELETE CASCADE & RESTRICT.</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-400">Keamanan Data (Security)</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">Tinggi</div>
            <div className="text-xs text-slate-400 mt-1">Hash Bcrypt untuk password, pemisahan role admin RBAC.</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-xs text-slate-400">Dukungan Platform</div>
            <div className="text-2xl font-bold text-violet-400 mt-1">Multi-Dialek</div>
            <div className="text-xs text-slate-400 mt-1">MySQL, PostgreSQL, Prisma ORM, dan Firebase Firestore.</div>
          </div>
        </div>
      </div>

      {/* Suggested Architecture Roadmap for Student/Owner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-900 to-indigo-950/30 border border-blue-900/40 space-y-4">
        <div className="flex items-center gap-2 text-blue-300">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white text-base">3 Langkah Termudah Mengaktifkan Database di Website Tugas-CP Ini</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 flex items-center justify-center text-xs">1</span>
              Jalur Tanpa Server (Firebase)
            </div>
            <p className="text-slate-300">
              Jika ingin tetap di-hosting gratis di GitHub Pages, pasang <strong>Firebase Firestore</strong> di file JavaScript frontend Anda. Formulir kontak langsung tersimpan ke database cloud tanpa perlu backend server!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-xs">2</span>
              Jalur XAMPP / MySQL Lokal
            </div>
            <p className="text-slate-300">
              Jika untuk presentasi tugas dosen, buat database di <strong>phpMyAdmin</strong> menggunakan skrip SQL MySQL yang kami sediakan, lalu hubungkan dengan PHP atau Node.js Express.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 flex items-center justify-center text-xs">3</span>
              Jalur Modern (Supabase & Next.js)
            </div>
            <p className="text-slate-300">
              Gunakan <strong>PostgreSQL di Supabase</strong> yang memiliki REST API instan dan panel UI visual untuk mengelola katalog produk, formulir kontak, dan otentikasi admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
