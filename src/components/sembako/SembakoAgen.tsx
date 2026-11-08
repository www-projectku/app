import React, { useState } from 'react';
import { DistributorAgen } from '../../data/sembakoMasterData';
import { UserRole } from '../../types/auth';
import { Truck, Plus, Phone, MapPin, Package, X, Lock } from 'lucide-react';

interface SembakoAgenProps {
  distributors: DistributorAgen[];
  currentUserRole?: UserRole;
  onAddDistributor: (distributor: Omit<DistributorAgen, 'id'>) => void;
}

export const SembakoAgen: React.FC<SembakoAgenProps> = ({
  distributors,
  currentUserRole = 'admin',
  onAddDistributor,
}) => {
  const isAdmin = currentUserRole === 'admin';
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [nama, setNama] = useState<string>('');
  const [kode, setKode] = useState<string>('AGEN-06');
  const [kontakSales, setKontakSales] = useState<string>('');
  const [telepon, setTelepon] = useState<string>('');
  const [alamat, setAlamat] = useState<string>('');
  const [komoditasSuplai, setKomoditasSuplai] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !telepon) return;

    onAddDistributor({
      kode,
      nama,
      kontak_sales: kontakSales,
      telepon,
      alamat,
      komoditas_suplai: komoditasSuplai,
    });

    setIsAddOpen(false);
    setNama('');
    setTelepon('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            Master Rekanan Agen & Distributor Grosir Sembako
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar supplier kulakan resmi toko sembako untuk pemesanan beras bulog, kartonan minyak goreng, peti telur, dan terigu.
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-md shadow-emerald-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Agen Baru</span>
          </button>
        ) : (
          <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-amber-900/40 text-xs text-amber-300 flex items-center gap-2 self-start md:self-auto">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Kelola Kontrak Agen: <strong>Khusus Admin</strong></span>
          </div>
        )}
      </div>

      {/* Grid of Distributors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {distributors.map((d) => (
          <div
            key={d.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4 shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 font-bold">
                  {d.kode}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  Supplier Aktif
                </span>
              </div>

              <h3 className="font-bold text-white text-base">{d.nama}</h3>
              <div className="text-xs text-slate-400 mt-1">Sales: {d.kontak_sales}</div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-cyan-300 font-mono">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{d.telepon}</span>
                </div>

                <div className="flex items-start gap-2 text-slate-400 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500 mt-0.5" />
                  <span>{d.alamat}</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-amber-300 flex items-start gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>Komoditas: {d.komoditas_suplai}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Agen */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Tambah Distributor / Agen Sembako Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Perusahaan / Agen:</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="cth: CV Subur Pangan Nusantara"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Sales / Kontak Person:</label>
                  <input
                    type="text"
                    value={kontakSales}
                    onChange={(e) => setKontakSales(e.target.value)}
                    placeholder="Bapak Hermawan"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor Telepon / WhatsApp:</label>
                  <input
                    type="text"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    placeholder="0812-3456-7890"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Komoditas yang Disuplai:</label>
                <input
                  type="text"
                  value={komoditasSuplai}
                  onChange={(e) => setKomoditasSuplai(e.target.value)}
                  placeholder="Beras Rojo Lele, Gula Pasir GMP, Minyakita"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Alamat Gudang / Depo:</label>
                <input
                  type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Jl. Raya Pasar Induk No. 12"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Simpan Agen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
