'use client';

import { useState, useEffect } from 'react';
import { X, Check, Wallet, Building2, Smartphone, Radio, Banknote } from 'lucide-react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import CustomDropdown from '@/components/ui/CustomDropdown';

interface PayDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  debt: any;
  onSuccess: () => void;
}

const getWalletTypeBadge = (type?: string) => {
  switch (String(type || '').toUpperCase()) {
    case 'BANK': return { icon: Building2, iconBg: 'bg-sky-500/20 text-sky-400' };
    case 'E_WALLET': return { icon: Smartphone, iconBg: 'bg-purple-500/20 text-purple-400' };
    case 'E_MONEY': return { icon: Radio, iconBg: 'bg-lime-500/20 text-lime-400' };
    case 'CASH': return { icon: Banknote, iconBg: 'bg-emerald-500/20 text-emerald-400' };
    default: return { icon: Wallet, iconBg: 'bg-slate-500/20 text-slate-400' };
  }
};

export default function PayDebtModal({ isOpen, onClose, debt, onSuccess }: PayDebtModalProps) {
  const [amount, setAmount] = useState('');
  const [walletId, setWalletId] = useState('');
  const [notes, setNotes] = useState('');
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const remaining = debt ? Number(debt.amount) - Number(debt.paidAmount || 0) : 0;

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setAmount(remaining.toString());
    setNotes('');

    const fetchWallets = async () => {
      try {
        const res = await api.get('/wallets');
        const list = res.data.data || [];
        setWallets(list);
        if (debt?.walletId) setWalletId(debt.walletId.toString());
        else if (list.length > 0) setWalletId(list[0].id.toString());
      } catch (err) {
        console.error('Gagal mengambil dompet:', err);
      }
    };

    fetchWallets();
  }, [isOpen, debt, remaining]);

  if (!isOpen || !debt) return null;

  const walletOptions = wallets.map((w) => ({
    id: w.id,
    name: w.name,
    ...getWalletTypeBadge(w.type),
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const payVal = parseFloat(amount);
    if (isNaN(payVal) || payVal <= 0) return setError('Nominal pembayaran harus lebih dari 0');
    if (payVal > remaining) return setError(`Nominal melebihi sisa utang (${formatRupiah(remaining)})`);
    if (!walletId) return setError('Dompet wajib dipilih');

    setLoading(true);
    try {
      await api.post(`/debts/${debt.id}/pay`, {
        amount: payVal,
        walletId: Number(walletId),
        notes,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memproses pelunasan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans text-slate-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-100 dark:border-slate-800 shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-black text-slate-900 dark:text-white">
            {debt.type === 'LOAN' ? 'Terima Pelunasan / Cicilan' : 'Bayar Utang / Cicilan'}
          </h2>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs rounded-xl font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Pihak Terkait: {debt.personName}</p>
            <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
              Sisa Tagihan: <span className="text-emerald-600 dark:text-emerald-400 font-black">{formatRupiah(remaining)}</span>
            </p>
          </div>

          <div>
            <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Nominal Bayar (Rp) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-black text-slate-900 dark:text-white"
            />
          </div>

          <CustomDropdown
            label={debt.type === 'LOAN' ? 'Masuk ke Dompet' : 'Potong dari Dompet'}
            isOpen={isWalletOpen}
            onToggle={() => setIsWalletOpen(!isWalletOpen)}
            selectedOption={walletOptions.find((w) => String(w.id) === walletId)}
            options={walletOptions}
            onSelect={(id) => { setWalletId(id); setIsWalletOpen(false); }}
            placeholder="-- Pilih Dompet --"
            defaultIcon={Wallet}
          />

          <div>
            <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">Catatan (Opsional)</label>
            <input
              type="text"
              placeholder="Misal: Cicilan ke-1"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Memproses...' : 'Proses Pembayaran'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}