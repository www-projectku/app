import React, { useState } from 'react';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_OPNAME_ITEMS 
} from '../data/inventorySchemaData';
import { ProductItem, StockTransactionRecord, StockOpnameItem } from '../types/database';
import { 
  PackagePlus, 
  PackageMinus, 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  History, 
  TrendingDown, 
  TrendingUp, 
  Search, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const StockOpnameSimulator: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'inbound' | 'outbound' | 'opname' | 'ledger'>('opname');

  // Working inventory state
  const [products, setProducts] = useState<ProductItem[]>([...INITIAL_PRODUCTS]);
  const [transactions, setTransactions] = useState<StockTransactionRecord[]>([...INITIAL_TRANSACTIONS]);
  const [opnameItems, setOpnameItems] = useState<StockOpnameItem[]>([...INITIAL_OPNAME_ITEMS]);

  // Inbound Form state
  const [inProductId, setInProductId] = useState<number>(1);
  const [inQty, setInQty] = useState<number>(10);
  const [inPartner, setInPartner] = useState<string>('PT Sinar Niaga Mandiri (Supplier)');
  const [inNotes, setInNotes] = useState<string>('Surat Jalan SJ-2026-9921');
  const [inSuccessMsg, setInSuccessMsg] = useState<string | null>(null);

  // Outbound Form state
  const [outProductId, setOutProductId] = useState<number>(2);
  const [outQty, setOutQty] = useState<number>(5);
  const [outPartner, setOutPartner] = useState<string>('Divisi Operasional & IT');
  const [outNotes, setOutNotes] = useState<string>('Permintaan perlengkapan kantor');
  const [outErrorMsg, setOutErrorMsg] = useState<string | null>(null);
  const [outSuccessMsg, setOutSuccessMsg] = useState<string | null>(null);

  // Selected product for Ledger
  const [selectedLedgerProductId, setSelectedLedgerProductId] = useState<number>(1);

  // Handle Barang Masuk
  const handleInboundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inQty <= 0) return;

    const targetProduct = products.find((p) => p.id === inProductId);
    if (!targetProduct) return;

    // Update product stock
    const updatedProducts = products.map((p) => {
      if (p.id === inProductId) {
        return { ...p, current_stock: p.current_stock + inQty };
      }
      return p;
    });

    const newTrx: StockTransactionRecord = {
      id: transactions.length + 1,
      trx_number: `TRX-IN-${Date.now().toString().slice(-6)}`,
      type: 'IN',
      product_id: inProductId,
      product_name: targetProduct.name,
      quantity: inQty,
      partner_name: inPartner,
      notes: inNotes,
      date: new Date().toISOString().slice(0, 10),
    };

    setProducts(updatedProducts);
    setTransactions([newTrx, ...transactions]);

    // Also update opname system stock
    setOpnameItems((prev) =>
      prev.map((item) =>
        item.product_id === inProductId
          ? {
              ...item,
              system_stock: item.system_stock + inQty,
              difference: item.physical_stock - (item.system_stock + inQty),
            }
          : item
      )
    );

    setInSuccessMsg(`Berhasil! +${inQty} ${targetProduct.unit} ditambahkan ke ${targetProduct.name}. Stok sekarang: ${targetProduct.current_stock + inQty} ${targetProduct.unit}.`);
    setTimeout(() => setInSuccessMsg(null), 4000);
  };

  // Handle Barang Keluar
  const handleOutboundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOutErrorMsg(null);
    setOutSuccessMsg(null);

    const targetProduct = products.find((p) => p.id === outProductId);
    if (!targetProduct) return;

    if (outQty <= 0) {
      setOutErrorMsg('Kuantitas keluar harus lebih dari 0.');
      return;
    }

    // Validation: Stock cannot be negative!
    if (outQty > targetProduct.current_stock) {
      setOutErrorMsg(
        `PERINGATAN GUDANG: Pengeluaran ditolak! Stok ${targetProduct.name} hanya tersisa ${targetProduct.current_stock} ${targetProduct.unit}. Kuantitas diminta: ${outQty} ${targetProduct.unit}.`
      );
      return;
    }

    const updatedProducts = products.map((p) => {
      if (p.id === outProductId) {
        return { ...p, current_stock: p.current_stock - outQty };
      }
      return p;
    });

    const newTrx: StockTransactionRecord = {
      id: transactions.length + 1,
      trx_number: `TRX-OUT-${Date.now().toString().slice(-6)}`,
      type: 'OUT',
      product_id: outProductId,
      product_name: targetProduct.name,
      quantity: outQty,
      partner_name: outPartner,
      notes: outNotes,
      date: new Date().toISOString().slice(0, 10),
    };

    setProducts(updatedProducts);
    setTransactions([newTrx, ...transactions]);

    // Also update opname system stock
    setOpnameItems((prev) =>
      prev.map((item) =>
        item.product_id === outProductId
          ? {
              ...item,
              system_stock: item.system_stock - outQty,
              difference: item.physical_stock - (item.system_stock - outQty),
            }
          : item
      )
    );

    setOutSuccessMsg(`Berhasil! -${outQty} ${targetProduct.unit} dikeluarkan untuk ${outPartner}. Sisa stok: ${targetProduct.current_stock - outQty} ${targetProduct.unit}.`);
    setTimeout(() => setOutSuccessMsg(null), 4000);
  };

  // Handle Physical Stock Edit in Stock Opname
  const handlePhysicalStockChange = (productId: number, newPhysicalVal: number) => {
    setOpnameItems((prev) =>
      prev.map((item) => {
        if (item.product_id === productId) {
          const safeVal = Math.max(0, newPhysicalVal || 0);
          const diff = safeVal - item.system_stock;
          let status: 'matched' | 'deficit' | 'surplus' = 'matched';
          let reason = item.reason;

          if (diff < 0) {
            status = 'deficit';
            if (reason === 'sesuai') reason = 'hilang';
          } else if (diff > 0) {
            status = 'surplus';
            if (reason === 'sesuai') reason = 'belum_tercatat_keluar';
          } else {
            status = 'matched';
            reason = 'sesuai';
          }

          return {
            ...item,
            physical_stock: safeVal,
            difference: diff,
            status,
            reason,
          };
        }
        return item;
      })
    );
  };

  // Execute Stock Adjustment
  const handleApplyAdjustment = () => {
    const updated = products.map((p) => {
      const op = opnameItems.find((o) => o.product_id === p.id);
      if (op) {
        return { ...p, current_stock: op.physical_stock };
      }
      return p;
    });

    setProducts(updated);
    setOpnameItems((prev) =>
      prev.map((o) => ({
        ...o,
        system_stock: o.physical_stock,
        difference: 0,
        status: 'matched',
        reason: 'sesuai',
      }))
    );

    alert('Penyesuaian Berhasil: Saldo stok di Master Barang telah disinkronkan sesuai hasil hitungan fisik stock opname!');
  };

  // Calculations for Opname Summary
  const totalAuditItems = opnameItems.length;
  const matchedCount = opnameItems.filter((i) => i.difference === 0).length;
  const deficitCount = opnameItems.filter((i) => i.difference < 0).length;
  const surplusCount = opnameItems.filter((i) => i.difference > 0).length;
  const accuracyRate = Math.round((matchedCount / totalAuditItems) * 100);

  const selectedProduct = products.find((p) => p.id === selectedLedgerProductId) || products[0];

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tab Navigation */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-cyan-400" />
            Simulasi Operasional Stock Opname & Mutasi Barang
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Uji alur nyata sistem pergudangan: input barang masuk, barang keluar dengan proteksi stok minus, serta sesi penghitungan fisik stock opname.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto no-scrollbar">
          {[
            { id: 'opname', label: '1. Sesi Stock Opname', icon: ClipboardCheck },
            { id: 'inbound', label: '2. Barang Masuk (+IN)', icon: PackagePlus },
            { id: 'outbound', label: '3. Barang Keluar (-OUT)', icon: PackageMinus },
            { id: 'inventory', label: '4. Master Stok Barang', icon: CheckCircle2 },
            { id: 'ledger', label: '5. Riwayat Mutasi', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: SESI STOCK OPNAME */}
      {activeSubTab === 'opname' && (
        <div className="space-y-6">
          {/* Opname KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Tingkat Akurasi Stok</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{accuracyRate}%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{matchedCount} dari {totalAuditItems} barang sesuai</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Barang Defisit (Hilang/Kurang)</div>
              <div className="text-2xl font-bold text-rose-400 mt-1">{deficitCount} SKU</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Stok fisik &lt; stok sistem</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Barang Surplus (Lebih)</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">{surplusCount} SKU</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Stok fisik &gt; stok sistem</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div className="text-[11px] text-slate-400">Aksi Penyesuaian</div>
              <button
                onClick={handleApplyAdjustment}
                className="mt-2 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Adjust Stok Master</span>
              </button>
            </div>
          </div>

          {/* Interactive Opname Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-sm">
                  Lembar Hitung Fisik Stock Opname: No. Sesi <code className="text-cyan-400 font-mono">OPN-2026-11-01</code>
                </h3>
                <p className="text-xs text-slate-400">
                  Ubah angka pada kolom <strong>"Stok Fisik Nyata (Hitung Manual)"</strong> untuk melihat simulasi kalkulasi selisih secara otomatis!
                </p>
              </div>

              <div className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Auditor: Staff Gudang 01 | Tanggal: Hari Ini
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                    <th className="py-3 px-4">Kode SKU</th>
                    <th className="py-3 px-4">Nama Barang</th>
                    <th className="py-3 px-3 text-center">Stok Sistem (Buku)</th>
                    <th className="py-3 px-3 text-center w-36">Stok Fisik Nyata</th>
                    <th className="py-3 px-3 text-center">Selisih (Diff)</th>
                    <th className="py-3 px-3">Status Audit</th>
                    <th className="py-3 px-4">Alasan Deviasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 font-sans text-xs">
                  {opnameItems.map((item) => {
                    const isDeficit = item.difference < 0;
                    const isSurplus = item.difference > 0;
                    const isMatched = item.difference === 0;

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors text-slate-200">
                        <td className="py-3 px-4 font-mono text-cyan-300 font-semibold">{item.sku}</td>
                        <td className="py-3 px-4 font-medium text-white">{item.product_name}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-300">
                          {item.system_stock}
                        </td>

                        {/* Editable Physical Stock Input */}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={item.physical_stock}
                            onChange={(e) =>
                              handlePhysicalStockChange(item.product_id, parseInt(e.target.value) || 0)
                            }
                            className="w-24 text-center py-1 px-2 rounded-lg bg-slate-950 border border-cyan-500/50 text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                        </td>

                        {/* Calculated Difference */}
                        <td className="py-3 px-3 text-center font-mono font-bold">
                          {isMatched && <span className="text-slate-400">0</span>}
                          {isDeficit && <span className="text-rose-400 font-bold">{item.difference}</span>}
                          {isSurplus && <span className="text-amber-400 font-bold">+{item.difference}</span>}
                        </td>

                        {/* Status badge */}
                        <td className="py-3 px-3">
                          {isMatched && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              ✓ Sesuai (Match)
                            </span>
                          )}
                          {isDeficit && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                              ✕ Defisit / Kurang
                            </span>
                          )}
                          {isSurplus && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                              ▲ Surplus / Lebih
                            </span>
                          )}
                        </td>

                        {/* Reason */}
                        <td className="py-3 px-4 text-slate-400">
                          <span className="capitalize">{item.reason.replace(/_/g, ' ')}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FORM BARANG MASUK (+IN) */}
      {activeSubTab === 'inbound' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <PackagePlus className="w-5 h-5" />
              <h3>Penerimaan Barang Masuk (Inbound Logistics)</h3>
            </div>
            <p className="text-xs text-slate-400">
              Setiap kali supplier mengirim barang atau ada pengembalian (retur), catat di form ini. Saldo stok di master barang akan otomatis bertambah.
            </p>

            {inSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{inSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleInboundSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pilih Item Barang:</label>
                  <select
                    value={inProductId}
                    onChange={(e) => setInProductId(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.sku} - {p.name} (Sisa: {p.current_stock} {p.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kuantitas Masuk:</label>
                  <input
                    type="number"
                    min="1"
                    value={inQty}
                    onChange={(e) => setInQty(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Pemasok (Supplier):</label>
                  <input
                    type="text"
                    value={inPartner}
                    onChange={(e) => setInPartner(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor Surat Jalan / PO:</label>
                  <input
                    type="text"
                    value={inNotes}
                    onChange={(e) => setInNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <PackagePlus className="w-4 h-4" />
                <span>Simpan Transaksi Barang Masuk (+Stok)</span>
              </button>
            </form>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Aturan Logika Database (Barang Masuk)
            </h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400">
              UPDATE products<br />
              SET current_stock = current_stock + NEW.quantity<br />
              WHERE id = NEW.product_id;
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transaksi ini mengeksekusi operasi aritmatika penambahan stok secara atomik, kemudian mencatat histori ke tabel <code className="text-cyan-300 font-mono">stock_cards</code>.
            </p>
          </div>
        </div>
      )}

      {/* VIEW 3: FORM BARANG KELUAR (-OUT) */}
      {activeSubTab === 'outbound' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
              <PackageMinus className="w-5 h-5" />
              <h3>Pengeluaran Barang (Outbound Logistics)</h3>
            </div>
            <p className="text-xs text-slate-400">
              Gunakan form ini untuk mencatat barang keluar ke konsumen, divisi internal kantor, atau pengiriman antar-cabang. Sistem akan memvalidasi agar stok tidak menjadi minus.
            </p>

            {outErrorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{outErrorMsg}</span>
              </div>
            )}

            {outSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{outSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleOutboundSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pilih Item Barang:</label>
                  <select
                    value={outProductId}
                    onChange={(e) => setOutProductId(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.sku} - {p.name} (Tersedia: {p.current_stock} {p.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kuantitas Dikeluarkan:</label>
                  <input
                    type="number"
                    min="1"
                    value={outQty}
                    onChange={(e) => setOutQty(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tujuan / Divisi Pemohon:</label>
                  <input
                    type="text"
                    value={outPartner}
                    onChange={(e) => setOutPartner(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Keperluan / Keterangan:</label>
                  <input
                    type="text"
                    value={outNotes}
                    onChange={(e) => setOutNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
              >
                <PackageMinus className="w-4 h-4" />
                <span>Simpan Transaksi Barang Keluar (-Stok)</span>
              </button>
            </form>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Proteksi Integritas Stok Minus
            </h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-rose-400">
              IF current_stock &lt; NEW.quantity THEN<br />
              &nbsp;&nbsp;SIGNAL SQLSTATE '45000'<br />
              &nbsp;&nbsp;SET MESSAGE_TEXT = 'Stok tidak cukup!';<br />
              END IF;
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fitur krusial yang dinilai dosen: sistem wajib menolak dan melempar error jika ada yang mencoba mengeluarkan barang melampaui sisa fisik di gudang.
            </p>
          </div>
        </div>
      )}

      {/* VIEW 4: MASTER STOK BARANG */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Daftar Master Stok Gudang Saat Ini</h3>
            <span className="text-xs text-slate-400 font-mono">{products.length} SKU Terdaftar</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Nama Barang</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3 text-center">Rak</th>
                  <th className="py-3 px-3 text-center">Stok Min</th>
                  <th className="py-3 px-3 text-center">Stok Riil</th>
                  <th className="py-3 px-4 text-right">Harga HPP</th>
                  <th className="py-3 px-3 text-center">Status Stok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 font-sans text-xs">
                {products.map((p) => {
                  const isCritical = p.current_stock <= p.min_stock;
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors text-slate-200">
                      <td className="py-3 px-4 font-mono font-semibold text-cyan-300">{p.sku}</td>
                      <td className="py-3 px-4 font-medium text-white">{p.name}</td>
                      <td className="py-3 px-3 text-slate-400">{p.category}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-400">{p.location_rack}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-400">{p.min_stock} {p.unit}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-base text-white">
                        {p.current_stock} <span className="text-xs font-normal text-slate-400">{p.unit}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        Rp {p.purchase_price.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isCritical ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse">
                            ⚠ Stok Menipis!
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Aman
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 5: RIWAYAT MUTASI & KARTU STOK */}
      {activeSubTab === 'ledger' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Riwayat Mutasi Transaksi Barang Masuk & Keluar</h3>
            <span className="text-xs text-slate-400 font-mono">{transactions.length} Transaksi Terakhir</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                  <th className="py-3 px-4">No Transaksi</th>
                  <th className="py-3 px-3 text-center">Arah Mutasi</th>
                  <th className="py-3 px-4">Nama Barang</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-4">Rekanan / Pemasok / Divisi</th>
                  <th className="py-3 px-4">Keterangan Dokumen</th>
                  <th className="py-3 px-3 text-center">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 font-sans text-xs">
                {transactions.map((t) => {
                  const isIN = t.type === 'IN';
                  return (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition-colors text-slate-200">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-300">{t.trx_number}</td>
                      <td className="py-3 px-3 text-center">
                        {isIN ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            + IN (Masuk)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                            - OUT (Keluar)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">{t.product_name}</td>
                      <td className={`py-3 px-3 text-center font-mono font-bold ${isIN ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isIN ? `+${t.quantity}` : `-${t.quantity}`}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{t.partner_name}</td>
                      <td className="py-3 px-4 text-slate-400">{t.notes}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-400">{t.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
