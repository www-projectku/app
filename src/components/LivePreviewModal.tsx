import React, { useState } from 'react';
import { TARGET_WEBSITE } from '../data/databaseSchemaData';
import { X, ExternalLink, RefreshCw, AlertCircle, ShieldAlert, Monitor, Smartphone } from 'lucide-react';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({ isOpen, onClose }) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [iframeError, setIframeError] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                Live Iframe Inspector: Tugas-CP
              </div>
              <div className="text-xs text-slate-400 font-mono truncate max-w-md">
                {TARGET_WEBSITE.url}
              </div>
            </div>
          </div>

          {/* Device toggle & Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                  deviceMode === 'desktop' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                  deviceMode === 'mobile' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
            </div>

            <button
              onClick={() => {
                setIframeKey((prev) => prev + 1);
                setIframeError(false);
              }}
              title="Refresh Iframe"
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <a
              href={TARGET_WEBSITE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Buka di Tab Baru</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice for GitHub Pages Iframe Security */}
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Jika browser memblokir tampilan iframe (karena kebijakan Content Security Policy GitHub), silakan gunakan tombol <strong>"Buka di Tab Baru"</strong> untuk melihat halaman aslinya.
            </span>
          </div>
        </div>

        {/* Iframe View Area */}
        <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
          <div
            className={`h-full transition-all duration-300 bg-white rounded-xl shadow-2xl overflow-hidden ${
              deviceMode === 'desktop' ? 'w-full' : 'w-[375px] max-w-full'
            }`}
          >
            <iframe
              key={iframeKey}
              src={TARGET_WEBSITE.url}
              title="Tugas-CP Live Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms"
              onError={() => setIframeError(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
