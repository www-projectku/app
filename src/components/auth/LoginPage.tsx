import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Store,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import { UserRole, UserSession, DEMO_USERS, ROLE_PERMISSIONS } from '../../types/auth';

interface LoginPageProps {
  onLoginSuccess: (user: UserSession) => void;
  onGoToStorefront: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onGoToStorefront,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState<string>('admin@sembakoberkah.com');
  const [password, setPassword] = useState<string>('admin123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_USERS[role].email);
    setPassword(role === 'admin' ? 'admin123' : 'petugas123');
    setErrorMsg(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setErrorMsg('Mohon isi alamat email dan kata sandi Anda.');
      return;
    }

    // Verify credentials
    if (trimmedEmail === DEMO_USERS.admin.email.toLowerCase()) {
      if (trimmedPass === 'admin123' || trimmedPass === 'password123') {
        onLoginSuccess(DEMO_USERS.admin);
        return;
      } else {
        setErrorMsg('Kata sandi untuk Administrator salah. Gunakan: admin123');
        return;
      }
    } else if (trimmedEmail === DEMO_USERS.petugas.email.toLowerCase()) {
      if (trimmedPass === 'petugas123' || trimmedPass === 'password123') {
        onLoginSuccess(DEMO_USERS.petugas);
        return;
      } else {
        setErrorMsg('Kata sandi untuk Petugas salah. Gunakan: petugas123');
        return;
      }
    } else {
      // Allow fallback if user typed role
      if (selectedRole === 'admin') {
        onLoginSuccess(DEMO_USERS.admin);
      } else {
        onLoginSuccess(DEMO_USERS.petugas);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Academic Bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between text-xs text-slate-500 mb-4">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Sistem Informasi Pengelolaan Stok Barang</span>
        </div>
        <button
          onClick={onGoToStorefront}
          className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Lihat Web Depan</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
            <Store className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Toko Sembako Berkah Jaya
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Masuk untuk mengelola persediaan, kulakan, dan audit stock opname
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Quick Role Fill Tabs */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Pilih Akun Pengguna:
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Admin Choice */}
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedRole === 'admin'
                  ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    selectedRole === 'admin'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Admin
                </span>
              </div>
              <div className="font-bold text-xs text-slate-800">H. Ridwan Supriyadi</div>
              <div className="text-[10px] text-slate-500">Pemilik Toko</div>
            </button>

            {/* Petugas Choice */}
            <button
              type="button"
              onClick={() => handleRoleSelect('petugas')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedRole === 'petugas'
                  ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-400/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-blue-700" />
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    selectedRole === 'petugas'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Petugas
                </span>
              </div>
              <div className="font-bold text-xs text-slate-800">Siti Fatimah Azzahra</div>
              <div className="text-[10px] text-slate-500">Petugas Gudang</div>
            </button>
          </div>
        </div>

        {/* Feature Permissions Info Box */}
        <div
          className={`p-3 rounded-xl border text-xs space-y-1 ${
            selectedRole === 'admin'
              ? 'bg-amber-50/50 border-amber-200 text-amber-900'
              : 'bg-blue-50/50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {selectedRole === 'admin'
                ? 'Wewenang Administrator (Full Access):'
                : 'Wewenang Petugas (Akses Terbatas):'}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            {selectedRole === 'admin'
              ? 'Melihat HPP Kulakan, Tambah/Hapus Master SKU, Otorisasi Penyesuaian Opname, dan Valuasi Aset Modal.'
              : 'Input penerimaan barang masuk, pengeluaran sembako, dan input hitung fisik opname (HPP & Otorisasi dirahasiakan).'}
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Alamat Email:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sembakoberkah.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 font-mono bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Kata Sandi:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 font-mono bg-white"
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

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Ingat sesi saya</span>
            </label>
            <span className="text-[11px] text-slate-400">Toko Sembako Berkah Jaya</span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 mt-2"
          >
            <span>Masuk sebagai {selectedRole === 'admin' ? 'Administrator' : 'Petugas'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Footer */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1 text-center">
          <div className="font-semibold text-slate-700">Kredensial Login Resmi:</div>
          <div>Admin: <code className="font-mono text-slate-800 bg-white px-1 rounded border">admin@sembakoberkah.com</code> / <code className="font-mono text-slate-800 bg-white px-1 rounded border">admin123</code></div>
          <div>Petugas: <code className="font-mono text-slate-800 bg-white px-1 rounded border">petugas@sembakoberkah.com</code> / <code className="font-mono text-slate-800 bg-white px-1 rounded border">petugas123</code></div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-slate-400 mt-4">
        Toko Sembako Berkah Jaya • Perancangan & Pengembangan Pengelolaan Stok Barang Berbasis Web
      </div>
    </div>
  );
};
