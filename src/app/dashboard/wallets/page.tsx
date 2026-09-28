'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { Wallet, Plus, Edit2, Trash2, Landmark, CreditCard, Banknote } from 'lucide-react';
import WalletModal from '@/components/modals/WalletModal';

export default function WalletsPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);

  const fetchWallets = async () => {
    try {
      const res = await api.get('/wallets');
      setWallets(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const totalBalance = wallets.reduce((acc, curr) => acc + Number(curr.balance || 0), 0);

  const handleOpenCreate = () => {
    setSelectedWallet(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (wallet: any) => {
    setSelectedWallet(wallet);
    setIsModalOpen(true);
  };

  const handleDeleteWallet = async (id: number, name: string) => {
    if (!confirm(`Apakah kamu yakin ingin menghapus dompet "${name}"? Seluruh riwayat transaksi di dompet ini juga akan terhapus.`)) {
      return;
    }

    try {
      await api.delete(`/wallets/${id}`);
      fetchWallets();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus dompet');
    }
  };

  const getWalletIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'BANK':
        return <Landmark className="w-5 h-5" />;
      case 'E_WALLET':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <Banknote className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* HEADER & TOTAL NET WORTH */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden space-y-3">
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Kekayaan (Net Worth)
          </span>
          <span className="text-xs font-extrabold bg-slate-800 text-emerald-400 px-3 py-1 rounded-full border border-slate-700">
            {wallets.length} Akun Terhubung
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight relative z-10">
          {formatRupiah(totalBalance)}
        </h2>

        <div className="pt-2 flex justify-end relative z-10">
          <button
            onClick={handleOpenCreate}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs transition flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Dompet</span>
          </button>
        </div>
      </div>

      {/* DAFTAR DOMPET */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 px-1">
          <Wallet className="w-4 h-4 text-slate-700" />
          Daftar Rekening & Dompet
        </h3>

        {wallets.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center space-y-2">
            <p className="text-xs text-slate-400 font-medium">Belum ada dompet atau akun terhubung.</p>
            <button
              onClick={handleOpenCreate}
              className="text-xs font-extrabold text-emerald-600 hover:underline"
            >
              + Tambah Dompet Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {wallets.map((w) => (
              <div
                key={w.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-center hover:border-slate-300 transition"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className="p-3 rounded-2xl shrink-0 text-white shadow-xs"
                    style={{ backgroundColor: w.color || '#0f172a' }}
                  >
                    {getWalletIcon(w.type)}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{w.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">
                      {w.type || 'CASH'}
                    </p>
                    <p className="text-sm font-black text-slate-900 mt-1">
                      {formatRupiah(w.balance)}
                    </p>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center space-x-1 shrink-0 pl-2">
                  <button
                    onClick={() => handleOpenEdit(w)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                    title="Edit Dompet"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteWallet(w.id, w.name)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Hapus Dompet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL TAMBAH/EDIT DOMPET */}
      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        walletToEdit={selectedWallet}
        onSuccess={fetchWallets}
      />
    </div>
  );
}