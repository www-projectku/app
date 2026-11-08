import React, { useState } from 'react';
import { Code, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Copy, Check, RefreshCw } from 'lucide-react';

const SAMPLE_HTML_FORM = `<form id="contact-form" action="#" method="POST" class="space-y-4">
  <div class="form-group">
    <label for="nama_lengkap">Nama Lengkap</label>
    <input type="text" id="nama_lengkap" name="nama_lengkap" placeholder="Masukkan nama Anda..." required />
  </div>

  <div class="form-group">
    <label for="email_pengirim">Alamat Email</label>
    <input type="email" id="email_pengirim" name="email" placeholder="nama@email.com" required />
  </div>

  <div class="form-group">
    <label for="nomor_whatsapp">Nomor WhatsApp / HP</label>
    <input type="tel" id="nomor_whatsapp" name="telepon" placeholder="08123456789" />
  </div>

  <div class="form-group">
    <label for="perihal">Perihal Pesan</label>
    <input type="text" id="perihal" name="subjek" placeholder="Konsultasi Proyek" required />
  </div>

  <div class="form-group">
    <label for="pesan_detail">Pesan Anda</label>
    <textarea id="pesan_detail" name="pesan" rows="4" placeholder="Tuliskan kebutuhan Anda secara detail..." required></textarea>
  </div>

  <button type="submit" class="btn btn-primary">Kirim Pesan</button>
</form>`;

interface ExtractedField {
  tag: string;
  name: string;
  type: string;
  required: boolean;
  matchedDbColumn: string;
  matchedDbType: string;
}

export const FormInspector: React.FC = () => {
  const [htmlInput, setHtmlInput] = useState<string>(SAMPLE_HTML_FORM);
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);
  const [copiedInsert, setCopiedInsert] = useState<boolean>(false);

  const analyzeHtml = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlInput, 'text/html');
    const inputs = Array.from(doc.querySelectorAll('input, textarea, select'));

    const fields: ExtractedField[] = inputs.map((el) => {
      const tag = el.tagName.toLowerCase();
      const name = el.getAttribute('name') || el.getAttribute('id') || 'unnamed_field';
      const type = el.getAttribute('type') || (tag === 'textarea' ? 'text' : 'text');
      const required = el.hasAttribute('required');

      // Intelligent mapping to DB column
      let matchedDbColumn = 'custom_note';
      let matchedDbType = 'VARCHAR(255)';

      const lowerName = name.toLowerCase();
      if (lowerName.includes('nama') || lowerName.includes('name')) {
        matchedDbColumn = 'sender_name';
        matchedDbType = 'VARCHAR(100)';
      } else if (lowerName.includes('mail')) {
        matchedDbColumn = 'sender_email';
        matchedDbType = 'VARCHAR(120)';
      } else if (lowerName.includes('telp') || lowerName.includes('phone') || lowerName.includes('wa') || lowerName.includes('hp')) {
        matchedDbColumn = 'sender_phone';
        matchedDbType = 'VARCHAR(30)';
      } else if (lowerName.includes('subjek') || lowerName.includes('subject') || lowerName.includes('judul') || lowerName.includes('hal')) {
        matchedDbColumn = 'subject';
        matchedDbType = 'VARCHAR(200)';
      } else if (lowerName.includes('pesan') || lowerName.includes('message') || tag === 'textarea') {
        matchedDbColumn = 'message';
        matchedDbType = 'TEXT';
      }

      return {
        tag,
        name,
        type,
        required,
        matchedDbColumn,
        matchedDbType,
      };
    });

    setExtractedFields(fields);
    setHasAnalyzed(true);
  };

  // Run initial parse on mount
  React.useEffect(() => {
    analyzeHtml();
  }, []);

  const generatedInsertSql = `INSERT INTO contact_messages 
  (${extractedFields.map((f) => f.matchedDbColumn).join(', ')}, status) 
VALUES 
  (${extractedFields.map((f) => `'[Nilai_${f.name}]'`).join(', ')}, 'unread');`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            Ekstraktor & Pemetaan Form HTML ke Kolom Database
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tempelkan potongan kode HTML formulir dari web Tugas-CP Anda untuk secara otomatis memetakan nama atribut HTML ke kolom tabel database.
          </p>
        </div>

        <button
          onClick={analyzeHtml}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-md shadow-blue-600/30"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Analisis Ulang Kode Form</span>
        </button>
      </div>

      {/* Two Column Layout: HTML Input and Extracted Mapping */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: HTML Code Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <span>Kode HTML Formulir Kontak (Tugas-CP):</span>
            </label>
            <button
              onClick={() => {
                setHtmlInput(SAMPLE_HTML_FORM);
                analyzeHtml();
              }}
              className="text-cyan-400 hover:text-cyan-300 text-[11px]"
            >
              Reset ke Contoh Standar
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              rows={14}
              className="w-full p-4 bg-slate-950 font-mono text-xs text-slate-300 focus:outline-none resize-none leading-relaxed"
              placeholder="<form>...</form>"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right: Extracted Elements & Mapped DB Columns */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">
              Hasil Pemetaan: {extractedFields.length} Elemen Input Terdeteksi
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[10px]">
              Tabel Target: `contact_messages`
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {extractedFields.map((field, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white font-semibold">name="{field.name}"</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 font-mono">
                      &lt;{field.tag} type="{field.type}"&gt;
                    </span>
                    {field.required && (
                      <span className="text-[10px] text-rose-400 font-semibold">required</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">Atribut formulir di file HTML</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  <div className="text-right">
                    <div className="font-mono text-cyan-300 font-bold">{field.matchedDbColumn}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{field.matchedDbType}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Generated INSERT Statement for this form */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Query INSERT SQL Otomatis untuk Form Ini:
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedInsertSql);
                  setCopiedInsert(true);
                  setTimeout(() => setCopiedInsert(false), 2000);
                }}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copiedInsert ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedInsert ? 'Tersalin' : 'Salin SQL'}</span>
              </button>
            </div>
            <pre className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-cyan-300 overflow-x-auto">
              {generatedInsertSql}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
