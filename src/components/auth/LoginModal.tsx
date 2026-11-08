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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Masuk Sistem Stok Sembako
              </h3>
              <p className="text-xs text-slate-500">
                Pilih peran akun untuk menguji perbedaan hak akses (RBAC).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Role Selection Tabs */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Pilih Akun Pengguna:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Admin Button */}
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      selectedRole === 'admin'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Admin Penuh
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-800">H. Ridwan Supriyadi</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Pemilik Toko</div>
              </button>

              {/* Petugas Button */}
              <button
                type="button"
                onClick={() => handleRoleSelect('petugas')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedRole === 'petugas'
                    ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-400/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-blue-700" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      selectedRole === 'petugas'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Petugas
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-800">Siti Fatimah Azzahra</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Petugas Gudang</div>
              </button>
            </div>
          </div>

          {/* Privilege Explanation Box */}
          <div
            className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
              selectedRole === 'admin'
                ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                : 'bg-blue-50/50 border-blue-200 text-blue-900'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {selectedRole === 'admin'
                  ? 'Karakteristik Administrator (Pemilik Usaha):'
                  : 'Karakteristik Petugas Toko & Gudang:'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {selectedRole === 'admin'
                ? 'Dapat melihat harga modal beli (HPP), mengelola master produk, menyetujui rekonsiliasi opname, dan laporan keuangan.'
                : 'Hanya mencatat transaksi fisik (masuk/keluar/hitung opname). Harga modal kulakan (HPP) dan otorisasi saldo dirahasiakan.'}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat Email Pengguna:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono text-slate-800 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kata Sandi:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono text-slate-800 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Masuk Sekarang ({selectedRole.toUpperCase()})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Toko Sembako Berkah Jaya</span>
          <button
            onClick={() => {
              setEmail(DEMO_USERS[selectedRole].email);
              setPassword(selectedRole === 'admin' ? 'admin123' : 'petugas123');
            }}
            className="text-emerald-600 hover:underline font-semibold"
          >
            Pulihkan Kredensial Default
          </button>
        </div>
      </div>
    </div>
  );
};
