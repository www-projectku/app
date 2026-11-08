import React, { useState } from 'react';
import { Server, Cloud, Flame, Zap, Check, Copy, ExternalLink, Code2, ShieldCheck } from 'lucide-react';

export const BackendGuide: React.FC = () => {
  const [activeSolution, setActiveSolution] = useState<'firebase' | 'supabase' | 'formspree' | 'express'>('firebase');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const firebaseSnippet = `<!-- 1. Masukkan SDK Firebase di file index.html Tugas-CP -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
  import { getFirestore, collection, addDoc, serverTimestamp } 
    from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

  // Konfigurasi dari Firebase Console Anda
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "tugas-cp-app.firebaseapp.com",
    projectId: "tugas-cp-app",
    storageBucket: "tugas-cp-app.appspot.com",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // 2. Hubungkan event submit formulir kontak
  const contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const senderName = document.getElementById("name").value;
    const senderEmail = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
      // Simpan ke Firestore langsung dari GitHub Pages!
      await addDoc(collection(db, "contact_messages"), {
        senderName: senderName,
        senderEmail: senderEmail,
        message: message,
        status: "unread",
        createdAt: serverTimestamp()
      });

      alert("Pesan Anda berhasil terkirim dan tersimpan ke database!");
      contactForm.reset();
    } catch (err) {
      console.error("Gagal menyimpan ke database:", err);
      alert("Terjadi kendala saat mengirim pesan.");
    }
  });
</script>`;

  const supabaseSnippet = `<!-- 1. Pasang Supabase JS Client di index.html Tugas-CP -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
  // Hubungkan ke PostgreSQL Database di Supabase
  const SUPABASE_URL = "https://your-project.supabase.co";
  const SUPABASE_ANON_KEY = "your-public-anon-key";
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Fungsi mengambil daftar layanan dari database
  async function loadServices() {
    const { data: services, error } = await supabase
      .from('services')
      .select('*, categories(name)')
      .eq('is_active', true);

    if (error) console.error("Error loading services:", error);
    else renderServicesToHTML(services);
  }

  // Fungsi menyimpan pesan kontak ke PostgreSQL
  async function submitContactMessage(formData) {
    const { error } = await supabase
      .from('contact_messages')
      .insert([{
        sender_name: formData.name,
        sender_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: 'unread'
      }]);

    if (!error) alert("Pesan berhasil tersimpan di PostgreSQL!");
  }

  loadServices();
</script>`;

  const formspreeSnippet = `<!-- Solusi Paling Cepat Tanpa Menulis Javascript Backend -->
<!-- Cukup ganti tag <form> di halaman kontak Tugas-CP Anda: -->

<form 
  action="https://formspree.io/f/YOUR_FORM_ID" 
  method="POST" 
  class="contact-form"
>
  <label for="name">Nama Lengkap:</label>
  <input type="text" id="name" name="name" required />

  <label for="email">Alamat Email:</label>
  <input type="email" id="email" name="_replyto" required />

  <label for="subject">Subjek:</label>
  <input type="text" id="subject" name="subject" required />

  <label for="message">Pesan Anda:</label>
  <textarea id="message" name="message" rows="4" required></textarea>

  <button type="submit">Kirim Pesan</button>
</form>
<!-- Formspree akan otomatis menyimpan pesan di dashboard & mengirim email notifikasi! -->`;

  const expressSnippet = `// REST API Backend (server.js) menggunakan Node.js Express + MySQL
// Dapat di-deploy gratis di Render.com atau Railway.app
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors()); // Izinkan request dari https://www-projectku.github.io
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'tugas_cp_db'
});

// Endpoint untuk mengambil layanan
app.get('/api/services', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM services WHERE is_active = TRUE');
  res.json(rows);
});

// Endpoint untuk menerima pesan dari GitHub Pages
app.post('/api/contact', async (req, res) => {
  const { sender_name, sender_email, subject, message } = req.body;
  await pool.query(
    'INSERT INTO contact_messages (sender_name, sender_email, subject, message) VALUES (?, ?, ?, ?)',
    [sender_name, sender_email, subject, message]
  );
  res.status(201).json({ message: 'Pesan berhasil disimpan ke MySQL!' });
});

app.listen(5000, () => console.log('Backend berjalan di port 5000'));`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950/40 border border-slate-800 space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-cyan-400" />
          Panduan Integrasi Database untuk Web di GitHub Pages
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
          Karena GitHub Pages (seperti URL <code className="text-cyan-300 font-mono text-xs">www-projectku.github.io/Tugas-CP/</code>) adalah hosting berkas statis, Anda tidak bisa menjalankan kode PHP atau Node.js server langsung di dalam GitHub Pages. Berikut adalah 4 metode terbaik yang biasa digunakan oleh developer dan mahasiswa:
        </p>
      </div>

      {/* Solution Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            id: 'firebase',
            name: '1. Firebase Firestore',
            badge: 'Paling Populer',
            desc: 'Database Cloud NoSQL langsung diakses dari browser dengan JavaScript SDK tanpa sewa server backend.',
            icon: Flame,
            color: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
          },
          {
            id: 'supabase',
            name: '2. Supabase PostgreSQL',
            badge: 'Standar Industri',
            desc: 'Database relasional SQL sesungguhnya (PostgreSQL) dengan auto-generated REST API & SDK gratis.',
            icon: Zap,
            color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
          },
          {
            id: 'formspree',
            name: '3. Formspree / Web3Forms',
            badge: 'Instan 2 Menit',
            desc: 'Solusi tanpa koding database: form HTML di GitHub Pages langsung mengirim email & tersimpan di dashboard.',
            icon: Cloud,
            color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
          },
          {
            id: 'express',
            name: '4. Node.js REST API + MySQL',
            badge: 'Tugas Kuliah Lengkap',
            desc: 'Arsitektur Client-Server terpisah: Frontend di GitHub Pages, Backend di Render/Railway + MySQL di Aiven.',
            icon: Server,
            color: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
          },
        ].map((sol) => {
          const Icon = sol.icon;
          const isSelected = activeSolution === sol.id;
          return (
            <button
              key={sol.id}
              onClick={() => setActiveSolution(sol.id as any)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 shadow-lg ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-sm text-white">{sol.name}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{sol.desc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-medium">
                  {sol.badge}
                </span>
                <span className="text-xs font-semibold text-cyan-400">
                  {isSelected ? 'Aktif' : 'Pilih Solusi'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Code Snippet & Implementation Tutorial */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs sm:text-sm font-semibold text-white">
              Langkah Implementasi Kode pada Halaman Tugas-CP
            </span>
          </div>

          <button
            onClick={() => {
              const code = activeSolution === 'firebase'
                ? firebaseSnippet
                : activeSolution === 'supabase'
                ? supabaseSnippet
                : activeSolution === 'formspree'
                ? formspreeSnippet
                : expressSnippet;
              handleCopy(code, activeSolution);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            {copiedSnippet === activeSolution ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Contoh Kode</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200 select-all whitespace-pre overflow-x-auto bg-slate-950">
          {activeSolution === 'firebase' && firebaseSnippet}
          {activeSolution === 'supabase' && supabaseSnippet}
          {activeSolution === 'formspree' && formspreeSnippet}
          {activeSolution === 'express' && expressSnippet}
        </div>
      </div>
    </div>
  );
};
