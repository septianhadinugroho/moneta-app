'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Wallet as WalletIcon, Calendar, FileText, AlertCircle, Check, Building2, Smartphone, Radio, Banknote, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import CustomDropdown from '@/components/ui/CustomDropdown';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: any[];
  onSuccess: () => void;
}

const getWalletTypeBadge = (type?: string) => {
  switch (String(type || '').toUpperCase()) {
    case 'BANK': return { icon: Building2, iconBg: 'bg-sky-500/20 text-sky-400' };
    case 'E_WALLET': return { icon: Smartphone, iconBg: 'bg-purple-500/20 text-purple-400' };
    case 'E_MONEY': return { icon: Radio, iconBg: 'bg-lime-500/20 text-lime-400' };
    case 'CASH': return { icon: Banknote, iconBg: 'bg-emerald-500/20 text-emerald-400' };
    default: return { icon: WalletIcon, iconBg: 'bg-slate-500/20 text-slate-400' };
  }
};

export default function TransferModal({ isOpen, onClose, wallets, onSuccess }: TransferModalProps) {
  const [sourceWalletId, setSourceWalletId] = useState<string>('');
  const [destinationWalletId, setDestinationWalletId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isDestOpen, setIsDestOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (wallets.length >= 2) {
      if (!sourceWalletId) setSourceWalletId(String(wallets[0].id));
      if (!destinationWalletId) setDestinationWalletId(String(wallets[1].id));
    } else if (wallets.length === 1 && !sourceWalletId) {
      setSourceWalletId(String(wallets[0].id));
    }
  }, [wallets, isOpen]);

  if (!isOpen) return null;

  const walletOptions = wallets.map((w) => ({
    id: w.id,
    name: `${w.name} (${formatRupiah(w.balance)})`,
    ...getWalletTypeBadge(w.type),
  }));

  const selectedSourceWallet = wallets.find((w) => String(w.id) === String(sourceWalletId));
  const selectedDestWallet = wallets.find((w) => String(w.id) === String(destinationWalletId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!sourceWalletId || !destinationWalletId) {
      setError('Pilih dompet asal dan dompet tujuan');
      return;
    }

    if (sourceWalletId === destinationWalletId) {
      setError('Dompet asal dan dompet tujuan tidak boleh sama');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError('Masukkan nominal transfer yang valid');
      return;
    }

    if (selectedSourceWallet && Number(selectedSourceWallet.balance) < numericAmount) {
      setError(`Saldo ${selectedSourceWallet.name} tidak mencukupi (${formatRupiah(selectedSourceWallet.balance)})`);
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const [year, month, day] = date.split('-').map(Number);
      const combinedDate = new Date(
        year,
        month - 1,
        day,
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      );

      await api.post('/transactions', {
        walletId: Number(sourceWalletId),
        destinationWalletId: Number(destinationWalletId),
        amount: numericAmount,
        type: 'TRANSFER',
        description: description.trim() || 'Transfer Antar Dompet',
        date: combinedDate.toISOString(),
      });

      setAmount('');
      setDescription('');
      setError('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memproses transfer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 font-sans text-slate-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-200 transition-colors">
        
        {/* HEADER MODAL */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded-xl">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Transfer Antar Dompet</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ALUR TRANSFER VISUAL (DOMPET ASAL -> DOMPET TUJUAN) */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold">
          <div className="text-center truncate flex-1 px-1">
            <span className="text-[9px] text-slate-400 uppercase font-black block">Dari</span>
            <span className="text-slate-800 dark:text-slate-200 truncate block">
              {selectedSourceWallet ? selectedSourceWallet.name : 'Pilih Asal'}
            </span>
          </div>

          <div className="p-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full shrink-0 shadow-2xs">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="text-center truncate flex-1 px-1">
            <span className="text-[9px] text-slate-400 uppercase font-black block">Ke</span>
            <span className="text-slate-800 dark:text-slate-200 truncate block">
              {selectedDestWallet ? selectedDestWallet.name : 'Pilih Tujuan'}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 text-xs rounded-xl font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <CustomDropdown
            label="Dari Dompet (Asal)"
            required
            isOpen={isSourceOpen}
            onToggle={() => {
              setIsSourceOpen(!isSourceOpen);
              setIsDestOpen(false);
            }}
            selectedOption={walletOptions.find((w) => String(w.id) === sourceWalletId)}
            options={walletOptions}
            onSelect={(id) => {
              setSourceWalletId(id);
              setIsSourceOpen(false);
              if (error) setError('');
            }}
            placeholder="-- Pilih Dompet Asal --"
            defaultIcon={WalletIcon}
          />

          <CustomDropdown
            label="Ke Dompet (Tujuan)"
            required
            isOpen={isDestOpen}
            onToggle={() => {
              setIsDestOpen(!isDestOpen);
              setIsSourceOpen(false);
            }}
            selectedOption={walletOptions.find((w) => String(w.id) === destinationWalletId)}
            options={walletOptions.filter((w) => String(w.id) !== sourceWalletId)}
            onSelect={(id) => {
              setDestinationWalletId(id);
              setIsDestOpen(false);
              if (error) setError('');
            }}
            placeholder="-- Pilih Dompet Tujuan --"
            defaultIcon={WalletIcon}
          />

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nominal Transfer (Rp)</label>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-extrabold text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white dark:focus:bg-slate-800 transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal Transfer</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white dark:focus:bg-slate-800 transition scheme-light dark:scheme-dark"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Catatan / Keterangan (Opsional)</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Misal: Top up GoPay dari BCA"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white dark:focus:bg-slate-800 transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition cursor-pointer active:scale-95 border border-slate-200/60 dark:border-slate-700/60"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold rounded-xl transition shadow-md shadow-slate-900/10 cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              <span>{loading ? 'Memproses...' : 'Kirim Transfer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}