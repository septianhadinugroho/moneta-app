'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { Wallet, Plus, Edit2, Trash2, Landmark, CreditCard, Banknote, Nfc, Eye, EyeOff } from 'lucide-react';
import WalletModal from '@/components/modals/WalletModal';

export default function WalletsPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);

  // Default: Tersembunyi (false)
  const [showBalance, setShowBalance] = useState(false);

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
      case 'E_MONEY':
        return <Nfc className="w-5 h-5" />;
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
      {/* HEADER TOTAL NET WORTH DENGAN TOMBOL MATA KONTROL */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden space-y-2">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider truncate">
              TOTAL KEKAYAAN (NET WORTH)
            </span>
            <button
              type="button"
              onClick={() => setShowBalance(!showBalance)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg transition shrink-0 border border-slate-700/80"
              title={showBalance ? 'Sembunyikan Saldo' : 'Tampilkan Saldo'}
            >
              {showBalance ? (
                <Eye className="w-4 h-4 text-emerald-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>

          <span className="text-[10px] font-extrabold bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-full border border-slate-700 whitespace-nowrap shrink-0">
            {wallets.length} Akun Terhubung
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          {showBalance ? formatRupiah(totalBalance) : '••••••••'}
        </h2>
      </div>

      {/* DAFTAR REKENING */}
      <div className="space-y-3 pt-1">
        <div className="flex justify-between items-center">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-slate-700" />
            Daftar Rekening & Dompet
          </h3>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-3" />
            <span>Tambah</span>
          </button>
        </div>

        {wallets.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center space-y-2">
            <p className="text-xs text-slate-400 font-medium">Belum ada dompet atau akun terhubung.</p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="text-xs font-extrabold text-emerald-600 hover:underline"
            >
              + Tambah Dompet Pertama
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {wallets.map((w) => (
              <div
                key={w.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-center hover:border-slate-300 transition"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <div
                    className="p-2.5 rounded-2xl shrink-0 text-white shadow-xs"
                    style={{ backgroundColor: w.color || '#0f172a' }}
                  >
                    {getWalletIcon(w.type)}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{w.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase">
                      {w.type || 'CASH'}
                    </p>
                    <p className="text-xs font-black text-slate-900 mt-0.5">
                      {showBalance ? formatRupiah(w.balance) : '••••••••'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(w)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                    title="Edit Dompet"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteWallet(w.id, w.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
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

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        walletToEdit={selectedWallet}
        onSuccess={fetchWallets}
      />
    </div>
  );
}