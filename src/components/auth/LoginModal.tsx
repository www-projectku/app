import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  UserCheck, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  Package,
  Layers,
  KeyRound
} from 'lucide-react';
import { UserRole, UserSession, DEMO_USERS, ROLE_PERMISSIONS } from '../../types/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserSession) => void;
  currentRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentRole = 'admin',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [email, setEmail] = useState<string>(DEMO_USERS[currentRole].email);
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPermissionsGuide, setShowPermissionsGuide] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_USERS[role].email);
    setPassword(role === 'admin' ? 'admin123' : 'petugas123');
    setErrorMsg(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Simple validation
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Mohon isi alamat email dan kata sandi.');
      return;
    }

    const targetUser = DEMO_USERS[selectedRole];
    onLoginSuccess(targetUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="relative p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
              🌾
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Masuk Sistem Pengelolaan Stok
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-normal">
                  Toko Sembako Berkah Jaya
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Autentikasi Hak Akses Multi-Level: Administrator & Petugas Operasional
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Role Chooser Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Pilih Peran Akun untuk Masuk:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* ADMIN CARD */}
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`p-4 rounded-2xl text-left border transition-all relative ${
                  selectedRole === 'admin'
                    ? 'bg-amber-950/40 border-amber-500/60 ring-2 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {selectedRole === 'admin' && (
                  <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-black text-xs font-bold">
                    ✓
                  </span>
                )}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-base">
                    👨‍💼
                  </div>
                  <div>
                    <div className="text-sm font-bold text-amber-300">ADMINISTRATOR</div>
                    <div className="text-[10px] text-slate-400">Pemilik Toko / Super Admin</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Check className="w-3 h-3 shrink-0" /> Full Akses Master Sembako & HPP
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Check className="w-3 h-3 shrink-0" /> Otorisasi Selisih Stock Opname
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Check className="w-3 h-3 shrink-0" /> Laporan Valuasi Aset & Agen
                  </div>
                </div>
              </button>

              {/* PETUGAS CARD */}
              <button
                type="button"
                onClick={() => handleRoleSelect('petugas')}
                className={`p-4 rounded-2xl text-left border transition-all relative ${
                  selectedRole === 'petugas'
                    ? 'bg-cyan-950/40 border-cyan-500/60 ring-2 ring-cyan-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {selectedRole === 'petugas' && (
                  <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-black text-xs font-bold">
                    ✓
                  </span>
                )}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-base">
                    👩‍💼
                  </div>
                  <div>
                    <div className="text-sm font-bold text-cyan-300">PETUGAS GUDANG</div>
                    <div className="text-[10px] text-slate-400">Kasir & Staf Operasional</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Check className="w-3 h-3 shrink-0" /> Catat Kulakan & Penjualan Kasir
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Check className="w-3 h-3 shrink-0" /> Input Hitung Fisik Stock Opname
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="text-rose-400 font-bold shrink-0">✕</span> Tanpa Akses HPP & Otorisasi
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Alamat Email Pengguna:
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nama@sembakoberkah.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kata Sandi (Password):
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white pr-10 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Account Profile Preview */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{DEMO_USERS[selectedRole].avatar}</span>
                <div>
                  <div className="font-semibold text-white">
                    {DEMO_USERS[selectedRole].nama}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {DEMO_USERS[selectedRole].jabatan} ({DEMO_USERS[selectedRole].telepon})
                  </div>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  selectedRole === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}
              >
                Role: {selectedRole}
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                  selectedRole === 'admin'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-amber-500/20'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-cyan-500/20'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Masuk Sekarang sebagai {selectedRole === 'admin' ? 'ADMINISTRATOR' : 'PETUGAS'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Toggle Role Permission Matrix Drawer */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowPermissionsGuide(!showPermissionsGuide)}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {showPermissionsGuide
                  ? 'Sembunyikan Matriks Perbedaan Hak Akses Petugas vs Admin'
                  : 'Lihat Matriks Perbedaan Hak Akses Petugas vs Admin (RBAC)'}
              </span>
            </button>

            {showPermissionsGuide && (
              <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Matriks Otorisasi Pengguna (Role-Based Access Control)</span>
                  <span className="text-[11px] text-slate-400">Untuk Pengujian Dosen & Sidang</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-1.5">Fitur Sistem</th>
                        <th className="py-1.5 text-center text-cyan-300">Petugas</th>
                        <th className="py-1.5 text-center text-amber-300">Admin</th>
                        <th className="py-1.5">Keterangan Batasan Petugas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {ROLE_PERMISSIONS.map((p) => (
                        <tr key={p.featureId}>
                          <td className="py-1.5 font-medium">{p.featureName}</td>
                          <td className="py-1.5 text-center">
                            {p.petugasAccess ? (
                              <span className="text-emerald-400 font-bold">✓ Ya</span>
                            ) : (
                              <span className="text-rose-400 font-bold">✕ Tidak</span>
                            )}
                          </td>
                          <td className="py-1.5 text-center">
                            <span className="text-emerald-400 font-bold">✓ Ya</span>
                          </td>
                          <td className="py-1.5 text-slate-400 text-[10px]">{p.petugasNotes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Toko Sembako Berkah Jaya • Keamanan Berbasis Peran</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
