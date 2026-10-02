'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Wallet, Tag, Building2, Smartphone, Radio, Banknote } from 'lucide-react';
import api from '@/lib/api';
import CustomDropdown from '@/components/ui/CustomDropdown';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: any;
  onSuccess: () => void;
  wallets?: any[];
}

const getTodayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const getCombinedDateTime = (selectedDateStr: string) => {
  const now = new Date();
  if (!selectedDateStr) return now.toISOString();
  const [year, month, day] = selectedDateStr.split('-').map(Number);
  return new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()).toISOString();
};

const getWalletTypeBadge = (type?: string) => {
  switch (String(type || '').toUpperCase()) {
    case 'BANK': return { icon: Building2, iconBg: 'bg-sky-500/20 text-sky-400' };
    case 'E_WALLET': return { icon: Smartphone, iconBg: 'bg-purple-500/20 text-purple-400' };
    case 'E_MONEY': return { icon: Radio, iconBg: 'bg-lime-500/20 text-lime-400' };
    case 'CASH': return { icon: Banknote, iconBg: 'bg-emerald-500/20 text-emerald-400' };
    default: return { icon: Wallet, iconBg: 'bg-slate-500/20 text-slate-400' };
  }
};

export default function TransactionModal({
  isOpen,
  onClose,
  transactionToEdit,
  onSuccess,
  wallets: initialWallets,
}: TransactionModalProps) {
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [walletId, setWalletId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(getTodayString());

  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [wallets, setWallets] = useState<any[]>(initialWallets || []);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // KUNCI SCROLL BODY SAAT MODAL TERBUKA
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setFormErrors({});
    setServerError(null);

    Promise.all([api.get('/wallets'), api.get('/categories')])
      .then(([wRes, cRes]) => {
        setWallets(wRes.data.data || []);
        setCategories(cRes.data.data || []);
      })
      .catch((err) => console.error(err));

    if (transactionToEdit) {
      setType(transactionToEdit.type || 'EXPENSE');
      setAmount(transactionToEdit.amount?.toString() || '');
      setWalletId(transactionToEdit.walletId?.toString() || '');
      setCategoryId(transactionToEdit.categoryId?.toString() || '');
      setNotes(transactionToEdit.notes || transactionToEdit.description || '');
      setDate(transactionToEdit.date ? transactionToEdit.date.split('T')[0] : getTodayString());
    } else {
      setType('EXPENSE'); setAmount(''); setWalletId(''); setCategoryId(''); setNotes(''); setDate(getTodayString());
    }
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const walletOptions = wallets.map((w) => ({
    id: w.id,
    name: w.name,
    ...getWalletTypeBadge(w.type),
  }));

  const categoryOptions = categories
    .filter((c) => String(c.type).toUpperCase() === type)
    .map((c) => ({ id: c.id, name: c.name, color: c.color || '#64748b' }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const errors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) errors.amount = 'Nominal wajib diisi';
    if (!date) errors.date = 'Tanggal wajib diisi';
    if (!walletId) errors.walletId = 'Dompet wajib dipilih';
    if (!categoryId) errors.categoryId = 'Kategori wajib dipilih';

    if (Object.keys(errors).length > 0) return setFormErrors(errors);

    setLoading(true);
    try {
      const payload = {
        type,
        amount: parseFloat(amount),
        walletId: Number(walletId),
        categoryId: Number(categoryId),
        notes,
        description: notes,
        date: getCombinedDateTime(date),
      };

      if (transactionToEdit) await api.put(`/transactions/${transactionToEdit.id}`, payload);
      else await api.post('/transactions', payload);

      onSuccess();
      onClose();
    } catch {
      setServerError('Gagal menyimpan transaksi. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-100 font-sans text-slate-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 space-y-4 border border-slate-100 dark:border-slate-800 shadow-2xl relative animate-in fade-in zoom-in duration-150 transition-colors">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            {transactionToEdit ? 'Edit Transaksi' : 'Tambah Transaksi'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {serverError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-900/60">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => { setType('EXPENSE'); setCategoryId(''); }}
              className={`py-1.5 rounded-lg font-extrabold transition cursor-pointer ${
                type === 'EXPENSE' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => { setType('INCOME'); setCategoryId(''); }}
              className={`py-1.5 rounded-lg font-extrabold transition cursor-pointer ${
                type === 'INCOME' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pemasukan
            </button>
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-bold mb-1 block">
              Nominal (Rp) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setFormErrors((p) => ({ ...p, amount: '' })); }}
              className={`w-full px-3.5 py-2.5 rounded-xl font-black text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition ${
                formErrors.amount
                  ? 'bg-rose-50/60 dark:bg-rose-950/40 border border-rose-500 ring-1 ring-rose-500'
                  : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80'
              }`}
            />
            {formErrors.amount && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-extrabold mt-1">{formErrors.amount}</p>}
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-bold mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Tanggal Transaksi <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setFormErrors((p) => ({ ...p, date: '' })); }}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition [color-scheme:light] dark:[color-scheme:dark] ${
                formErrors.date
                  ? 'bg-rose-50/60 dark:bg-rose-950/40 border border-rose-500 ring-1 ring-rose-500'
                  : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80'
              }`}
            />
          </div>

          <CustomDropdown
            label="Dompet / Rekening"
            required
            isOpen={isWalletOpen}
            onToggle={() => { setIsWalletOpen(!isWalletOpen); setIsCategoryOpen(false); }}
            selectedOption={walletOptions.find((w) => String(w.id) === walletId)}
            options={walletOptions}
            onSelect={(id) => { setWalletId(id); setIsWalletOpen(false); setFormErrors((p) => ({ ...p, walletId: '' })); }}
            placeholder="-- Pilih Dompet --"
            error={formErrors.walletId}
            defaultIcon={Wallet}
          />

          <CustomDropdown
            label="Kategori"
            required
            isOpen={isCategoryOpen}
            onToggle={() => { setIsCategoryOpen(!isCategoryOpen); setIsWalletOpen(false); }}
            selectedOption={categoryOptions.find((c) => String(c.id) === categoryId)}
            options={categoryOptions}
            onSelect={(id) => { setCategoryId(id); setIsCategoryOpen(false); setFormErrors((p) => ({ ...p, categoryId: '' })); }}
            placeholder="-- Pilih Kategori --"
            error={formErrors.categoryId}
            defaultIcon={Tag}
          />

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Catatan (Opsional)</label>
            <input
              type="text"
              placeholder="Misal: Beli Kopi"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold rounded-xl transition text-xs shadow-xs disabled:opacity-50 mt-2 cursor-pointer active:scale-95"
          >
            {loading ? 'Menyimpan...' : transactionToEdit ? 'Perbarui Transaksi' : 'Simpan Transaksi'}
          </button>
        </form>
      </div>
    </div>
  );
}