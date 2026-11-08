import React, { useState } from 'react';
import { PREBUILT_QUERIES, MOCK_DATABASE_ROWS } from '../data/databaseSchemaData';
import { PrebuiltQuery } from '../types/database';
import { Play, RotateCcw, Send, CheckCircle2, Database, Terminal, Sparkles, Filter } from 'lucide-react';

export const QuerySimulator: React.FC = () => {
  const [selectedQueryId, setSelectedQueryId] = useState<string>('q1');
  const [activeSql, setActiveSql] = useState<string>(PREBUILT_QUERIES[0].sql);
  const [queryResult, setQueryResult] = useState<any[]>(MOCK_DATABASE_ROWS.services);
  const [executionMessage, setExecutionMessage] = useState<string>('Query berhasil dieksekusi dalam 4.2 ms. Menampilkan 5 baris data.');
  const [activeTableTab, setActiveTableTab] = useState<string>('services');

  // Form simulation state
  const [formSender, setFormSender] = useState<string>('Budi Kurniawan');
  const [formEmail, setFormEmail] = useState<string>('budi.kurniawan@startup.id');
  const [formSubject, setFormSubject] = useState<string>('Konsultasi Redesign Web');
  const [formMessage, setFormMessage] = useState<string>('Halo, saya ingin menanyakan biaya pembuatan company profile seperti di web tugas ini.');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Dynamic state for simulated messages
  const [mockMessages, setMockMessages] = useState<any[]>([...MOCK_DATABASE_ROWS.contact_messages]);

  const handleSelectPrebuilt = (query: PrebuiltQuery) => {
    setSelectedQueryId(query.id);
    setActiveSql(query.sql);

    // Provide appropriate result based on query
    if (query.id === 'q1') {
      setQueryResult(MOCK_DATABASE_ROWS.services);
      setExecutionMessage('Query JOIN sukses: Menghubungkan services dan categories (5 baris).');
      setActiveTableTab('services');
    } else if (query.id === 'q2') {
      setQueryResult([
        {
          id: mockMessages.length + 1,
          sender_name: 'Anisa Rahmawati',
          sender_email: 'anisa.rahma@perusahaan.com',
          subject: 'Permintaan Demo Web',
          status: 'unread',
          created_at: '2026-11-05 18:40:12',
        },
      ]);
      setExecutionMessage('INSERT sukses: 1 baris baru tersimpan di tabel contact_messages (ID: ' + (mockMessages.length + 1) + ').');
      setActiveTableTab('contact_messages');
    } else if (query.id === 'q3') {
      setQueryResult(MOCK_DATABASE_ROWS.testimonials.filter((t) => t.rating === 5));
      setExecutionMessage('Query WHERE sukses: 2 testimoni bintang 5 berhasil dimuat.');
      setActiveTableTab('testimonials');
    } else if (query.id === 'q4') {
      setQueryResult([
        { nama_kategori: 'Web Development', total_layanan: 2, rata_rata_harga: 'Rp 1.850.000' },
        { nama_kategori: 'UI/UX Design', total_layanan: 1, rata_rata_harga: 'Rp 3.000.000' },
        { nama_kategori: 'Branding & Identitas', total_layanan: 1, rata_rata_harga: 'Rp 1.800.000' },
        { nama_kategori: 'SEO & Marketing', total_layanan: 1, rata_rata_harga: 'Rp 1.500.000' },
      ]);
      setExecutionMessage('Query AGREGASI (GROUP BY) sukses: Menampilkan rangkuman 4 kategori.');
      setActiveTableTab('categories');
    } else if (query.id === 'q5') {
      setQueryResult([
        { id: 1, sender_name: 'Rendra Kusuma', status: 'replied', updated_at: 'Baru Saja' },
      ]);
      setExecutionMessage('UPDATE sukses: 1 baris berhasil diperbarui statusnya menjadi "replied".');
      setActiveTableTab('contact_messages');
    }
  };

  const handleRunQuery = () => {
    setExecutionMessage(`Query SQL kustom dieksekusi pada ${new Date().toLocaleTimeString()} (0.002s).`);
  };

  const handleSimulateFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSender || !formEmail || !formMessage) return;

    const newMessage = {
      id: mockMessages.length + 1,
      sender_name: formSender,
      sender_email: formEmail,
      subject: formSubject,
      message: formMessage,
      status: 'unread',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setMockMessages([newMessage, ...mockMessages]);
    setFormSubmitted(true);
    setQueryResult([newMessage, ...mockMessages]);
    setActiveTableTab('contact_messages');
    setExecutionMessage(`Data formulir web berhasil masuk ke tabel contact_messages via SQL INSERT! Total data pesan sekarang: ${mockMessages.length + 1}`);

    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            Simulasi Query SQL & Pengujian CRUD Interaktif
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Uji bagaimana data website Tugas-CP diproses oleh database relasional (SELECT, INSERT, UPDATE, JOIN, dan GROUP BY).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            Engine: SQLite/MySQL Virtual In-Memory
          </span>
        </div>
      </div>

      {/* Pre-built Queries Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Pilih Studi Kasus Query Web Tugas-CP:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PREBUILT_QUERIES.map((q) => {
            const isSelected = selectedQueryId === q.id;
            return (
              <button
                key={q.id}
                onClick={() => handleSelectPrebuilt(q)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white mb-1">{q.title}</div>
                  <div className="text-[11px] text-slate-400 leading-snug">{q.description}</div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-mono">Tabel: {q.targetTable}</span>
                  <span className={isSelected ? 'text-cyan-400 font-semibold' : 'text-slate-500'}>
                    {isSelected ? 'Sedang Aktif' : 'Klik untuk Uji'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive SQL Editor & Action Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-300 font-semibold">SQL Query Console</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunQuery}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Jalankan Query</span>
            </button>
          </div>
        </div>

        <textarea
          value={activeSql}
          onChange={(e) => setActiveSql(e.target.value)}
          rows={6}
          className="w-full p-4 bg-slate-950 font-mono text-xs sm:text-sm text-cyan-300 focus:outline-none resize-none leading-relaxed border-b border-slate-800/80"
          spellCheck={false}
        />

        {/* Execution Output Status */}
        <div className="p-3 bg-slate-900/80 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{executionMessage}</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Status: 200 OK</span>
        </div>
      </div>

      {/* Query Result Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Hasil Eksekusi Query (Data Table View)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {queryResult.length} Baris Ditemukan
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden overflow-x-auto shadow-md">
          {queryResult.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono">
                  {Object.keys(queryResult[0]).map((colName) => (
                    <th key={colName} className="py-2.5 px-4 font-semibold uppercase text-[10px] tracking-wider">
                      {colName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {queryResult.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-800/40 transition-colors text-slate-200 font-mono text-xs">
                    {Object.values(row).map((val: any, valIdx: number) => {
                      const displayVal = typeof val === 'boolean' 
                        ? (val ? 'TRUE' : 'FALSE') 
                        : typeof val === 'object' 
                        ? JSON.stringify(val) 
                        : String(val);

                      return (
                        <td key={valIdx} className="py-2.5 px-4 text-slate-300">
                          {displayVal}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">Tidak ada baris data.</div>
          )}
        </div>
      </div>

      {/* Interactive Form Submission Simulator */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/30 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              Simulasi Interaktif: Uji Pengiriman Formulir Kontak Tugas-CP
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ketikkan data di formulir bawah ini dan klik "Kirim Pesan". Sistem akan menjalankan query INSERT ke database dan langsung menampilkannya pada tabel!
            </p>
          </div>
          {formSubmitted && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 animate-bounce">
              <CheckCircle2 className="w-3.5 h-3.5" /> Berhasil Disimpan!
            </span>
          )}
        </div>

        <form onSubmit={handleSimulateFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Nama Pengirim:</label>
            <input
              type="text"
              value={formSender}
              onChange={(e) => setFormSender(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Email Pengirim:</label>
            <input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Subjek Pesan:</label>
            <input
              type="text"
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulasikan Kirim (INSERT)</span>
            </button>
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block text-slate-400 mb-1 font-medium">Isi Pesan:</label>
            <input
              type="text"
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
};
