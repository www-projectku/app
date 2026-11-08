import React, { useState } from 'react';
import { UserSession, UserRole, ROLE_PERMISSIONS } from '../../types/auth';
import { 
  Settings, 
  ShieldCheck, 
  User, 
  Lock, 
  FileText, 
  Github, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Database,
  Layers,
  ArrowRight,
  LogOut
} from 'lucide-react';

interface SembakoSettingsProps {
  currentUser: UserSession;
  onLogout?: () => void;
  onOpenLoginModal: () => void;
  onOpenGithubModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const SembakoSettings: React.FC<SembakoSettingsProps> = ({
  currentUser,
  onLogout,
  onOpenLoginModal,
  onOpenGithubModal,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'rbac' | 'system'>('profile');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Pengaturan & Otorisasi Sistem</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi profil pengguna, manajemen hak akses (RBAC), otorisasi operasional toko, dan sinkronisasi GitHub Pages.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSubTab === 'profile'
                ? 'bg-white text-slate-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profil Akun
          </button>
          <button
            onClick={() => setActiveSubTab('rbac')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSubTab === 'rbac'
                ? 'bg-white text-slate-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Matriks Hak Akses (RBAC)
          </button>
          <button
            onClick={() => setActiveSubTab('system')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSubTab === 'system'
                ? 'bg-white text-slate-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sistem & GitHub
          </button>
        </div>
      </div>

      {/* SUBTAB 1: PROFIL AKUN */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl shadow-xs">
                {currentUser.avatar}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">{currentUser.nama}</h3>
                <p className="text-xs text-slate-500">{currentUser.jabatan}</p>
                <div className="mt-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      currentUser.role === 'admin'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {currentUser.role === 'admin' ? 'Super Administrator' : 'Petugas Operasional'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Alamat Email:</span>
                <span className="font-mono text-slate-800 font-medium">{currentUser.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Status Akun:</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Sesi Login:</span>
                <span className="text-slate-700">Toko Sembako Berkah Jaya</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  else onOpenLoginModal();
                }}
                className="w-full py-2.5 px-3 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout / Ganti Akun Pengguna</span>
              </button>
            </div>
          </div>

          {/* Role Privilege Summary */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Wewenang Operasional Akun Saat Ini ({currentUser.role.toUpperCase()})
            </h3>
            <p className="text-xs text-slate-500">
              Berikut adalah daftar hak akses sistem berdasarkan prinsip keamanan data dan pemisahan tugas operasional di Toko Sembako Berkah Jaya:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {ROLE_PERMISSIONS.map((perm, idx) => {
                const hasAccess = currentUser.role === 'admin' ? perm.adminAccess : perm.petugasAccess;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                      hasAccess
                        ? 'bg-emerald-50/50 border-emerald-200/80 text-slate-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {hasAccess ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                    </span>
                    <div>
                      <div className={`font-semibold ${hasAccess ? 'text-slate-800' : 'text-slate-500'}`}>
                        {perm.featureName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{perm.petugasNotes}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: RBAC MATRIX */}
      {activeSubTab === 'rbac' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Matriks Hak Akses Lengkap (Role-Based Access Control)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tabel perbandingan wewenang antara Administrator (Pemilik Toko) dan Petugas Gudang untuk dokumentasi Bab III Skripsi.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="py-3 px-4">Fitur & Modul Sistem</th>
                  <th className="py-3 px-4">Deskripsi Batasan</th>
                  <th className="py-3 px-4 text-center w-32 bg-amber-50/50">Admin (Pemilik)</th>
                  <th className="py-3 px-4 text-center w-32 bg-blue-50/50">Petugas Gudang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ROLE_PERMISSIONS.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-slate-800">{p.featureName}</td>
                    <td className="py-2.5 px-4 text-slate-600">{p.petugasNotes}</td>
                    <td className="py-2.5 px-4 text-center bg-amber-50/20">
                      {p.adminAccess ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                          <CheckCircle2 className="w-4 h-4" /> Boleh
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                          <Lock className="w-3.5 h-3.5" /> Terkunci
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center bg-blue-50/20">
                      {p.petugasAccess ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                          <CheckCircle2 className="w-4 h-4" /> Boleh
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-500 font-semibold text-xs">
                          <Lock className="w-3.5 h-3.5" /> Dilarang
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: SISTEM & GITHUB */}
      {activeSubTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-slate-900 text-white">
                <Github className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Sinkronisasi GitHub Pages</h3>
                <p className="text-xs text-slate-500">Repository: www-projectku / Tugas-CP</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Dapatkan file <code className="px-1 py-0.5 rounded bg-slate-100 font-mono text-slate-800">index.html</code> tunggal siap pakai yang sudah menerapkan desain terang Tugas-CP ini untuk langsung dipasang di repositori GitHub Anda.
            </p>

            <button
              onClick={onOpenGithubModal}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Github className="w-4 h-4" />
              <span>Buka Modal Ekspor Kode GitHub</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Dokumentasi Skripsi & SDLC</h3>
                <p className="text-xs text-slate-500">Metode Waterfall & Pembuktian Judul</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Akses panduan komprehensif Bab III dan IV skripsi, termasuk justifikasi mengapa kasir POS ditiadakan dan dialihkan ke Stock Opname Audit komoditas sembako.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onNavigateTab('metode_sdlc')}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Metode SDLC (Bab III)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigateTab('audit_judul')}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Koreksi Judul Skripsi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
