'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Wallet,
  Tag,
  CreditCard,
  Bell,
  Check,
  Building2,
  Smartphone,
  Radio,
  Banknote,
} from 'lucide-react';
import api from '@/lib/api';
import CustomDropdown from '@/components/ui/CustomDropdown';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionToEdit?: any;
  onSuccess: () => void;
  wallets?: any[];
  categories?: any[];
}

// Helper untuk mengambil ikon dan warna badge sesuai tipe dompet
const getWalletTypeBadge = (type?: string) => {
  switch (String(type || '').toUpperCase()) {
    case 'BANK':
      return { icon: Building2, iconBg: 'bg-sky-500/20 text-sky-400' };
    case 'E_WALLET':
      return { icon: Smartphone, iconBg: 'bg-purple-500/20 text-purple-400' };
    case 'E_MONEY':
      return { icon: Radio, iconBg: 'bg-lime-500/20 text-lime-400' };
    case 'CASH':
      return { icon: Banknote, iconBg: 'bg-emerald-500/20 text-emerald-400' };
    default:
      return { icon: Wallet, iconBg: 'bg-slate-500/20 text-slate-400' };
  }
};

export default function SubscriptionModal({
  isOpen,
  onClose,
  subscriptionToEdit,
  onSuccess,
  wallets: initialWallets,
  categories: initialCategories,
}: SubscriptionModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('1');
  const [frequency, setFrequency] = useState('MONTHLY');
  const [walletId, setWalletId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [reminderDays, setReminderDays] = useState('3');
  const [notes, setNotes] = useState('');

  // Dropdown Open States
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const [wallets, setWallets] = useState<any[]>(initialWallets || []);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pilihan Pengingat H-
  const reminderOptions = [
    { id: '1', name: 'H-1 Hari Sebelum' },
    { id: '3', name: 'H-3 Hari Sebelum' },
    { id: '5', name: 'H-5 Hari Sebelum' },
    { id: '7', name: 'H-7 Hari Sebelum' },
  ];

  useEffect(() => {
    if (!isOpen) return;
    setError('');

    const fetchData = async () => {
      try {
        const [wRes, cRes] = await Promise.all([
          api.get('/wallets'),
          api.get('/categories'),
        ]);
        setWallets(wRes.data.data || []);
        const expCats = (cRes.data.data || []).filter(
          (c: any) => String(c.type).toUpperCase() === 'EXPENSE'
        );
        setCategories(expCats);
      } catch (err) {
        console.error('Gagal memuat wallet/kategori:', err);
      }
    };

    fetchData();

    if (subscriptionToEdit) {
      setName(subscriptionToEdit.name || '');
      setAmount(subscriptionToEdit.amount?.toString() || '');
      setDueDate(subscriptionToEdit.dueDate?.toString() || '1');
      setFrequency(subscriptionToEdit.frequency || 'MONTHLY');
      setWalletId(subscriptionToEdit.walletId?.toString() || '');
      setCategoryId(subscriptionToEdit.categoryId?.toString() || '');
      setReminderDays(subscriptionToEdit.reminderDays?.toString() || '3');
      setNotes(subscriptionToEdit.notes || '');
    } else {
      setName('');
      setAmount('');
      setDueDate('1');
      setFrequency('MONTHLY');
      setWalletId('');
      setCategoryId('');
      setReminderDays('3');
      setNotes('');
    }
  }, [isOpen, subscriptionToEdit]);

  if (!isOpen) return null;

  // Hapus properti `color` agar tidak memicu titik lingkaran warna bawaan CustomDropdown
  const walletOptions = wallets.map((w) => ({
    id: w.id,
    name: w.name,
    ...getWalletTypeBadge(w.type),
  }));

  const categoryOptions = categories.map((c) => ({
    id: c.id,
    name: c.name,
    color: c.color || '#64748b',
  }));

  const closeAllDropdowns = () => {
    setIsWalletOpen(false);
    setIsCategoryOpen(false);
    setIsReminderOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Nama tagihan wajib diisi');
    if (!amount || parseFloat(amount) <= 0) return setError('Nominal tagihan harus lebih dari 0');
    const dayNum = parseInt(dueDate);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) return setError('Tanggal jatuh tempo harus antara 1-31');

    setLoading(true);
    try {
      const payload = {
        name,
        amount: parseFloat(amount),
        dueDate: dayNum,
        frequency,
        walletId: walletId ? Number(walletId) : null,
        categoryId: categoryId ? Number(categoryId) : null,
        reminderDays: Number(reminderDays),
        notes,
      };

      if (subscriptionToEdit) {
        await api.put(`/subscriptions/${subscriptionToEdit.id}`, payload);
      } else {
        await api.post('/subscriptions', payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan tagihan rutin');
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
              <CreditCard className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {subscriptionToEdit ? 'Edit Tagihan Rutin' : 'Tambah Tagihan Rutin'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs rounded-xl font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Nama Tagihan / Layanan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Indihome, Netflix, Kost"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Nominal Tagihan (Rp) <span className="text-rose-500">*</span>
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

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Jatuh Tempo (Tgl) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="31"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
              />
            </div>

            <CustomDropdown
              label="Ingatkan (H-)"
              isOpen={isReminderOpen}
              onToggle={() => { closeAllDropdowns(); setIsReminderOpen(!isReminderOpen); }}
              selectedOption={reminderOptions.find((r) => r.id === reminderDays)}
              options={reminderOptions}
              onSelect={(id) => { setReminderDays(id); setIsReminderOpen(false); }}
              placeholder="Pilih Peringatan"
              defaultIcon={Bell}
            />
          </div>

          <CustomDropdown
            label="Dompet Pembayaran (Opsional)"
            isOpen={isWalletOpen}
            onToggle={() => { closeAllDropdowns(); setIsWalletOpen(!isWalletOpen); }}
            selectedOption={walletOptions.find((w) => String(w.id) === walletId)}
            options={walletOptions}
            onSelect={(id) => { setWalletId(id); setIsWalletOpen(false); }}
            placeholder="-- Default Dompet --"
            defaultIcon={Wallet}
          />

          <CustomDropdown
            label="Kategori (Opsional)"
            isOpen={isCategoryOpen}
            onToggle={() => { closeAllDropdowns(); setIsCategoryOpen(!isCategoryOpen); }}
            selectedOption={categoryOptions.find((c) => String(c.id) === categoryId)}
            options={categoryOptions}
            onSelect={(id) => { setCategoryId(id); setIsCategoryOpen(false); }}
            placeholder="-- Pilih Kategori --"
            defaultIcon={Tag}
          />

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