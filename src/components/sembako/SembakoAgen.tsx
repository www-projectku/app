import React, { useState } from 'react';
import { DistributorAgen } from '../../data/sembakoMasterData';
import { UserRole } from '../../types/auth';
import { 
  Truck, 
  Plus, 
  Phone, 
  MapPin, 
  Package, 
  X, 
  Lock, 
  Building2, 
  CheckCircle2, 
  UserCheck 
} from 'lucide-react';

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
  const [kode, setKode] = useState<string>(`AGEN-0${distributors.length + 1}`);
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
    setKode(`AGEN-0${distributors.length + 2}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Truck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Master Data Rekanan Pemasok (Agen)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Daftar distributor resmi sembako rekanan toko untuk pengadaan beras BULOG, minyak goreng pabrikan, telur peternak Blitar, dan mie instan.
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Pemasok Baru</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-500 text-xs shrink-0">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Kelola Agen: Khusus Admin</span>
          </div>
        )}
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {distributors.map((d) => (
          <div
            key={d.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  {d.kode}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ✓ Rekanan Aktif
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-sm">{d.nama}</h3>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sales: {d.kontak_sales}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-mono">{d.telepon}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-500 line-clamp-2">{d.alamat}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Komoditas Disuplai:
              </div>
              <div className="text-xs text-slate-700 font-medium bg-slate-50 p-2 rounded-lg">
                {d.komoditas_suplai}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Supplier Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Daftar Kontrak & Kontak Distributor</h3>
          <span className="text-xs text-slate-500">{distributors.length} Agen Terdaftar</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3 px-4">Kode Agen</th>
                <th className="py-3 px-4">Nama Perusahaan Distributor</th>
                <th className="py-3 px-4">Kontak Sales Representatif</th>
                <th className="py-3 px-4">Nomor Telepon / WhatsApp</th>
                <th className="py-3 px-4">Alamat Kantor / Depo</th>
                <th className="py-3 px-4">Komoditas Suplai</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {distributors.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{d.kode}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{d.nama}</td>
                  <td className="py-3 px-4 text-slate-700">{d.kontak_sales}</td>
                  <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">{d.telepon}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs">{d.alamat}</td>
                  <td className="py-3 px-4 text-slate-800 font-medium">{d.komoditas_suplai}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Aktif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal (Admin Only) */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <Plus className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-800 text-base">Tambah Pemasok Baru</h3>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Agen / Distributor:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Bogasari Flour Mills"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Pemasok:</label>
                  <input
                    type="text"
                    required
                    value={kode}
                    onChange={(e) => setKode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kontak Sales:</label>
                  <input
                    type="text"
                    placeholder="Nama Sales"
                    value={kontakSales}
                    onChange={(e) => setKontakSales(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon / WA:</label>
                <input
                  type="text"
                  required
                  placeholder="0812-xxxx-xxxx"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Kantor / Depo:</label>
                <textarea
                  rows={2}
                  placeholder="Alamat pergudangan..."
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Komoditas yang Disuplai:</label>
                <input
                  type="text"
                  placeholder="Contoh: Tepung Segitiga Biru, Kunci Biru"
                  value={komoditasSuplai}
                  onChange={(e) => setKomoditasSuplai(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  Simpan Pemasok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
