'use client';

import { useState, useEffect } from 'react';
import { X, DollarSign, Wallet, Building2, Smartphone, Radio, Banknote } from 'lucide-react';
import api from '@/lib/api';
import CustomDropdown from '@/components/ui/CustomDropdown';
import QuickAmountChips from './transaction-fields/QuickAmountChips';
import CategoryGridSelector from './transaction-fields/CategoryGridSelector';
import QuickDatePicker from './transaction-fields/QuickDatePicker';
import CategoryModal from '@/components/modals/CategoryModal';

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

const getYesterdayString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
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
  const [categorySearch, setCategorySearch] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [dateType, setDateType] = useState<'today' | 'yesterday' | 'custom'>('today');

  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false); // Modal Tambah Kategori
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [wallets, setWallets] = useState<any[]>(initialWallets || []);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const cRes = await api.get('/categories');
      setCategories(cRes.data.data || []);
      return cRes.data.data || [];
    } catch (err) {
      console.error('Gagal mengambil data kategori:', err);
      return [];
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setFormErrors({});
    setServerError(null);
    setCategorySearch('');

    const fetchModalData = async () => {
      try {
        const [wRes, cRes] = await Promise.all([
          api.get('/wallets'),
          api.get('/categories')
        ]);
        setWallets(wRes.data.data || []);
        setCategories(cRes.data.data || []);
      } catch (err) {
        console.error('Gagal mengambil data wallet/kategori:', err);
      }
    };

    fetchModalData();

    if (transactionToEdit) {
      setType(transactionToEdit.type || 'EXPENSE');
      setAmount(transactionToEdit.amount?.toString() || '');
      setWalletId(transactionToEdit.walletId?.toString() || '');
      setCategoryId(transactionToEdit.categoryId?.toString() || '');
      setNotes(transactionToEdit.notes || transactionToEdit.description || '');
      
      const txDateStr = transactionToEdit.date ? transactionToEdit.date.split('T')[0] : getTodayString();
      setDate(txDateStr);
      if (txDateStr === getTodayString()) setDateType('today');
      else if (txDateStr === getYesterdayString()) setDateType('yesterday');
      else setDateType('custom');
    } else {
      setType('EXPENSE'); setAmount(''); setWalletId(''); setCategoryId(''); setNotes('');
      setDate(getTodayString()); setDateType('today');
    }
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const walletOptions = wallets.map((w) => ({
    id: w.id,
    name: w.name,
    ...getWalletTypeBadge(w.type),
  }));

  const filteredCategories = categories.filter(
    (c) => String(c.type).toUpperCase() === type
  );

  // Auto Select Kategori Baru Setelah Dibuat
  const handleCategoryCreated = async (newCat?: any) => {
    const updatedList = await fetchCategories();
    if (newCat?.id) {
      setCategoryId(String(newCat.id));
      setFormErrors((p) => ({ ...p, categoryId: '' }));
    } else if (updatedList.length > 0) {
      setCategoryId(String(updatedList[updatedList.length - 1].id));
      setFormErrors((p) => ({ ...p, categoryId: '' }));
    }
  };

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
    <>
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-100 font-sans text-slate-900 dark:text-slate-100">
        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 space-y-3.5 border border-slate-100 dark:border-slate-800 shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar transition-colors">
          
          {/* HEADER MODAL */}
          <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 pt-0.5 pb-2 z-10 border-b border-slate-100 dark:border-slate-800">
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

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* TYPE SWITCHER */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => { setType('EXPENSE'); setCategoryId(''); setCategorySearch(''); }}
                className={`py-2 rounded-lg font-extrabold transition cursor-pointer ${
                  type === 'EXPENSE' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => { setType('INCOME'); setCategoryId(''); setCategorySearch(''); }}
                className={`py-2 rounded-lg font-extrabold transition cursor-pointer ${
                  type === 'INCOME' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Pemasukan
              </button>
            </div>

            {/* INPUT NOMINAL + QUICK CHIPS */}
            <div className="space-y-1.5">
              <label className="text-slate-700 dark:text-slate-300 font-bold block">
                Nominal (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setFormErrors((p) => ({ ...p, amount: '' })); }}
                className={`w-full px-3.5 py-2.5 rounded-xl font-black text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition ${
                  formErrors.amount
                    ? 'bg-rose-50/60 dark:bg-rose-950/40 border border-rose-500 ring-1 ring-rose-500'
                    : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80'
                }`}
              />
              {formErrors.amount && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-extrabold">{formErrors.amount}</p>}

              <QuickAmountChips
                onAddAmount={(val) => {
                  const current = parseFloat(amount) || 0;
                  setAmount((current + val).toString());
                  setFormErrors((p) => ({ ...p, amount: '' }));
                }}
                onReset={() => setAmount('')}
              />
            </div>

            {/* SELECTOR KATEGORI SUB-COMPONENT (BERSIH DARI DUPLIKASI LABEL) */}
            <CategoryGridSelector
              categories={filteredCategories}
              selectedCategoryId={categoryId}
              categorySearch={categorySearch}
              onSearchChange={setCategorySearch}
              onSelectCategory={(id) => {
                setCategoryId(id);
                setFormErrors((p) => ({ ...p, categoryId: '' }));
              }}
              onOpenCreateCategory={() => setIsCreateCategoryOpen(true)}
              error={formErrors.categoryId}
            />

            {/* DROPDOWN DOMPET */}
            <CustomDropdown
              label="Dompet / Rekening"
              required
              isOpen={isWalletOpen}
              onToggle={() => setIsWalletOpen(!isWalletOpen)}
              selectedOption={walletOptions.find((w) => String(w.id) === walletId)}
              options={walletOptions}
              onSelect={(id) => { setWalletId(id); setIsWalletOpen(false); setFormErrors((p) => ({ ...p, walletId: '' })); }}
              placeholder="-- Pilih Dompet --"
              error={formErrors.walletId}
              defaultIcon={Wallet}
            />

            {/* QUICK DATE PICKER */}
            <QuickDatePicker
              date={date}
              dateType={dateType}
              onQuickSelect={(mode) => {
                setDateType(mode);
                if (mode === 'today') setDate(getTodayString());
                if (mode === 'yesterday') setDate(getYesterdayString());
                setFormErrors((p) => ({ ...p, date: '' }));
              }}
              onCustomDateChange={(val) => {
                setDate(val);
                setFormErrors((p) => ({ ...p, date: '' }));
              }}
              error={formErrors.date}
            />

            {/* CATATAN */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Catatan (Opsional)</label>
              <input
                type="text"
                placeholder="Misal: Kopi Kenangan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition"
              />
            </div>

            {/* SUBMIT BUTTON */}
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

      {/* SUB-MODAL TAMBAH KATEGORI LANGSUNG */}
      <CategoryModal
        isOpen={isCreateCategoryOpen}
        onClose={() => setIsCreateCategoryOpen(false)}
        defaultType={type}
        onSuccess={(newCat: any) => {
          handleCategoryCreated(newCat);
        }}
      />
    </>
  );
}