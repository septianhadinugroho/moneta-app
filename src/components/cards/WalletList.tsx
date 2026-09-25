'use client';

import { useState } from 'react';
import { formatRupiah } from '@/lib/utils';
import api from '@/lib/api';
import ConfirmModal from '@/components/ConfirmModal';
import { Wallet, Plus, Trash2, Landmark, Coins, CreditCard } from 'lucide-react';

export default function WalletList({
  wallets,
  onOpenModal,
  onRefresh,
}: {
  wallets: any[];
  onOpenModal: () => void;
  onRefresh: () => void;
}) {
  const [targetWallet, setTargetWallet] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteWallet = async () => {
    if (!targetWallet) return;
    setLoading(true);
    try {
      await api.delete(`/wallets/${targetWallet.id}`);
      setTargetWallet(null);
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus dompet');
    } finally {
      setLoading(false);
    }
  };

  const getWalletBadgeStyle = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'BANK':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'CASH':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'EWALLET':
      case 'E-WALLET':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getWalletIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'BANK':
        return <Landmark className="w-3.5 h-3.5 text-blue-600" />;
      case 'CASH':
        return <Coins className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <CreditCard className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <Wallet className="w-4 h-4" />
          </div>
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-900">Dompet & Rekening</h2>
          <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100/80 text-emerald-800 rounded-full">
            {wallets?.length || 0}
          </span>
        </div>
        <button
          onClick={onOpenModal}
          className="flex items-center space-x-1 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-xl transition shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-3" />
          <span>Tambah</span>
        </button>
      </div>

      {/* HORIZONTAL CAROUSEL */}
      <div className="flex space-x-3 overflow-x-auto pb-2 pt-1 scrollbar-none -mx-1 px-1">
        {!wallets || wallets.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 w-full text-center">Belum ada dompet ditambahkan.</p>
        ) : (
          wallets.map((w) => (
            <div
              key={w.id}
              className="shrink-0 w-48 p-3.5 rounded-xl border border-slate-200/80 bg-linear-to-b from-slate-50/50 to-white flex flex-col justify-between space-y-3 relative shadow-xs hover:border-slate-300 transition group"
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-[9px] tracking-wider font-extrabold px-2 py-0.5 border rounded-md uppercase flex items-center gap-1 ${getWalletBadgeStyle(
                    w.type
                  )}`}
                >
                  {getWalletIcon(w.type)}
                  {w.type}
                </span>

                {/* TOMBOL TRASH MERAH */}
                <button
                  onClick={() => setTargetWallet(w)}
                  className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Hapus Dompet"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-500 truncate">{w.name}</p>
                <p className="text-sm font-black text-slate-900 mt-0.5 tracking-tight">
                  {formatRupiah(w.balance)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(targetWallet)}
        onClose={() => setTargetWallet(null)}
        onConfirm={handleDeleteWallet}
        title={`Hapus Dompet ${targetWallet?.name}?`}
        description="Semua catatan transaksi yang terikat pada dompet ini akan terhapus secara permanen."
        confirmLabel="Hapus Dompet"
        variant="danger"
        loading={loading}
      />
    </div>
  );
}