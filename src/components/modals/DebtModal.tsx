'use client';

import { useState, useEffect } from 'react';
import { X, HandCoins, Wallet, Check, Building2, Smartphone, Radio, Banknote } from 'lucide-react';
import api from '@/lib/api';
import CustomDropdown from '@/components/ui/CustomDropdown';

interface DebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  debtToEdit?: any;
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

export default function DebtModal({ isOpen, onClose, debtToEdit, onSuccess }: DebtModalProps) {
  const [type, setType] = useState<'LOAN' | 'DEBT'>('LOAN');
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [walletId, setWalletId] = useState('');
  const [notes, setNotes] = useState('');

  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');

    const initData = async () => {
      try {
        const res = await api.get('/wallets');
        const list = res.data.data || [];
        setWallets(list);

        if (debtToEdit) {
          setType(debtToEdit.type || 'LOAN');
          setPersonName(debtToEdit.personName || '');
          setAmount(debtToEdit.amount?.toString() || '');
          setDueDate(debtToEdit.dueDate ? debtToEdit.dueDate.split('T')[0] : '');
          setWalletId(debtToEdit.walletId ? String(debtToEdit.walletId) : '');
          setNotes(debtToEdit.notes || '');
        } else {
          setType('LOAN');
          setPersonName('');
          setAmount('');
          setDueDate('');
          setNotes('');
          if (list.length > 0) {
            setWalletId(String(list[0].id));
          }
        }
      } catch (err) {
        console.error('Gagal memuat wallet:', err);
      }
    };

    initData();
  }, [isOpen, debtToEdit]);

  if (!isOpen) return null;

  const walletOptions = wallets.map((w) => ({
    id: w.id,
    name: w.name,
    ...getWalletTypeBadge(w.type),
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!personName.trim()) return setError('Nama pihak terkait wajib diisi');
    if (!amount || parseFloat(amount) <= 0) return setError('Nominal harus lebih dari 0');
    if (!walletId) return setError('Dompet wajib dipilih');

    setLoading(true);
    try {
      const payload = {
        type,
        personName,
        amount: parseFloat(amount),
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        walletId: Number(walletId),
        notes,
      };

      if (debtToEdit) {
        await api.put(`/debts/${debtToEdit.id}`, payload);
      } else {
        await api.post('/debts', payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan data utang/piutang');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans text-slate-900 dark:text-slate-100 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-100 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 rounded-xl">
              <HandCoins className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {debtToEdit ? 'Edit Catatan' : 'Tambah Utang / Piutang'}
            </h2>
          </div>
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
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setType('LOAN')}
              className={`py-2 rounded-lg font-extrabold transition cursor-pointer ${
                type === 'LOAN' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-white'
              }`}
            >
              Piutang (Dia Utang)
            </button>
            <button
              type="button"
              onClick={() => setType('DEBT')}
              className={`py-2 rounded-lg font-extrabold transition cursor-pointer ${
                type === 'DEBT' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 hover:text-white'
              }`}
            >
              Utang (Saya Utang)
            </button>
          </div>

          <div>
            <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Nama Kontak / Pihak Terkait <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={type === 'LOAN' ? 'Misal: Budi (Teman)' : 'Misal: Budi (Teman)'}
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Nominal (Rp) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
            />
          </div>

          <CustomDropdown
            label="Dompet Terkait"
            required
            isOpen={isWalletOpen}
            onToggle={() => setIsWalletOpen(!isWalletOpen)}
            selectedOption={walletOptions.find((w) => String(w.id) === String(walletId))}
            options={walletOptions}
            onSelect={(id) => { setWalletId(id); setIsWalletOpen(false); }}
            placeholder="-- Pilih Dompet --"
            defaultIcon={Wallet}
          />

          <div>
            <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Jatuh Tempo Pengembalian (Opsional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">Catatan</label>
            <input
              type="text"
              placeholder="Catatan tambahan..."
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
              className="py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              <span>{loading ? 'Menyimpan...' : 'Simpan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}