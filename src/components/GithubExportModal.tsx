import React, { useState } from 'react';
import { X, Copy, Check, Download, Github, Code, CheckCircle2, ArrowRight } from 'lucide-react';
import { GITHUB_PAGES_INDEX_HTML } from '../data/githubExportCode';

interface GithubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GithubExportModal({ isOpen, onClose }: GithubExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(GITHUB_PAGES_INDEX_HTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([GITHUB_PAGES_INDEX_HTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Pembaruan index.html untuk GitHub Pages (Tugas-CP)
              </h3>
              <p className="text-xs text-slate-400">
                Tampilan web tetap terjaga, namun semua konten & fitur telah diubah menjadi Pengelolaan Stok Sembako.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Instructions */}
        <div className="px-6 py-3 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/40 border-b border-slate-800 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Cara Pasang ke GitHub:
              </span>
              <p className="text-slate-300">
                Buka file <code className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">index.html</code> di repository GitHub Anda (<span className="text-white font-mono">www-projectku/Tugas-CP</span>), lalu timpa seluruh isinya dengan kode di bawah ini.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Semua Kode'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Unduh index.html</span>
              </button>
            </div>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-900">
            <span>Standar Web: HTML5 + Tailwind CSS CDN + Pure JavaScript (Zero Build, Langsung Jalan di GitHub Pages)</span>
            <span>{GITHUB_PAGES_INDEX_HTML.split('\n').length} baris kode</span>
          </div>
          <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] leading-relaxed overflow-x-auto text-emerald-300/90 selection:bg-emerald-500 selection:text-black">
            <code>{GITHUB_PAGES_INDEX_HTML}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>File ini kompatibel 100% dengan GitHub Pages tanpa perlu build tool (npm/vite).</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
