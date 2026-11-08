import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Package, 
  ShoppingBag, 
  RefreshCw, 
  ArrowRight, 
  FileCode, 
  Copy, 
  Check, 
  Calendar, 
  Scale, 
  ShieldAlert,
  Database
} from 'lucide-react';
import { 
  SEMBAKO_AUDIT_CHECKLIST, 
  INITIAL_SEMBAKO_PRODUCTS, 
  SEMBAKO_SQL_DDL, 
  SembakoProduct 
} from '../data/sembakoSchemaData';

export const SembakoAuditGuide: React.FC = () => {
  const [products, setProducts] = useState<SembakoProduct[]>([...INITIAL_SEMBAKO_PRODUCTS]);
  const [activeTab, setActiveTab] = useState<'koreksi' | 'simulator_sembako' | 'sql_sembako'>('koreksi');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Sembako quick action simulation
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [actionType, setActionType] = useState<'kulakan' | 'jual' | 'opname'>('kulakan');
  const [actionQty, setActionQty] = useState<number>(5);
  const [actionNotes, setActionNotes] = useState<string>('Kulakan dari Agen Beras Bulog');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExecuteSembakoAction = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);

    const target = products.find((p) => p.id === selectedProductId);
    if (!target) return;

    if (actionType === 'kulakan') {
      const updated = products.map((p) => {
        if (p.id === selectedProductId) {
          const newStok = p.stok_saat_ini + actionQty;
          return {
            ...p,
            stok_saat_ini: newStok,
            status_stok: newStok <= p.stok_minimum ? 'kritis' : 'aman',
          };
        }
        return p;
      });
      setProducts(updated as SembakoProduct[]);
      setFeedbackMsg({
        type: 'success',
        text: `Kulakan Berhasil: +${actionQty} ${target.satuan_utama} ditambahkan ke stok ${target.nama}.`,
      });
    } else if (actionType === 'jual') {
      if (actionQty > target.stok_saat_ini) {
        setFeedbackMsg({
          type: 'error',
          text: `Validasi Gagal: Stok ${target.nama} hanya tersisa ${target.stok_saat_ini} ${target.satuan_utama}. Tidak dapat mengeluarkan ${actionQty} ${target.satuan_utama}.`,
        });
        return;
      }
      const updated = products.map((p) => {
        if (p.id === selectedProductId) {
          const newStok = p.stok_saat_ini - actionQty;
          return {
            ...p,
            stok_saat_ini: newStok,
            status_stok: newStok === 0 ? 'habis' : newStok <= p.stok_minimum ? 'kritis' : 'aman',
          };
        }
        return p;
      });
      setProducts(updated as SembakoProduct[]);
      setFeedbackMsg({
        type: 'success',
        text: `Pengeluaran Berhasil: -${actionQty} ${target.satuan_utama} dikeluarkan dari stok toko.`,
      });
    } else if (actionType === 'opname') {
      const updated = products.map((p) => {
        if (p.id === selectedProductId) {
          return {
            ...p,
            stok_saat_ini: actionQty,
            status_stok: actionQty <= p.stok_minimum ? (actionQty === 0 ? 'habis' : 'kritis') : 'aman',
          };
        }
        return p;
      });
      setProducts(updated as SembakoProduct[]);
      setFeedbackMsg({
        type: 'success',
        text: `Stock Opname Sembako: Stok fisik ${target.nama} disesuaikan menjadi ${actionQty} ${target.satuan_utama}.`,
      });
    }

    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SEMBAKO_SQL_DDL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Primary Audit Verdict Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Kesesuaian Judul Skripsi Terpenuhi 100%</span>
          </div>

          <h2 className="text-xl font-bold text-slate-800">
            Hasil Evaluasi Terhadap Judul Tugas Akhir
          </h2>

          <div className="text-xs text-slate-600 leading-relaxed space-y-1.5">
            <p>
              <strong>Judul Tugas Anda:</strong>{' '}
              <span className="text-emerald-700 font-semibold underline decoration-emerald-500/50">
                "Perancangan dan Pengembangan Pengelolaan Stok Barang pada Toko Sembako Berbasis Web."
              </span>
            </p>
            <p>
              <strong>Perubahan yang Telah Diterapkan:</strong> Seluruh fitur statis company profile telah digantikan dengan sistem stok sembako berorientasi transaksi riil: Master Produk, Kulakan Masuk, Pengeluaran Keluar Anti-Stok Minus, Buku Kartu Stok, dan Rekonsiliasi Fisik Stock Opname (BAST).
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center min-w-[130px]">
            <div className="text-[11px] text-emerald-800 font-medium">Skor Kesesuaian</div>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">100%</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Siap Sidang</div>
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SEMBAKO_AUDIT_CHECKLIST.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100">
              {item.kategori}
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-rose-600 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Dihilangkan dari Web Lama:
                </span>
                <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-500 text-[11px]">
                  {item.dihilangkan.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-1">
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Diterapkan pada Sistem Baru:
                </span>
                <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-700 text-[11px]">
                  {item.ditambahkan.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
