'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { X, Calendar, DollarSign, Wallet, Tag, Building2, Smartphone, Radio, Banknote, ArrowRightLeft } from 'lucide-react';
import CustomDropdown from '@/components/ui/CustomDropdown';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
  onSuccess?: () => void;
}

const formatDateString = (dateInput?: string | Date) => {
  const d = dateInput ? new Date(dateInput) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCombinedDateTime = (selectedDateStr: string) => {
  const now = new Date();
  if (!selectedDateStr) return now.toISOString();

  const [year, month, day] = selectedDateStr.split('-').map(Number);
  const combinedDate = new Date(
    year,
    month - 1,
    day,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  );

  return combinedDate.toISOString();
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

export default function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
  onSuccess,
}: EditTransactionModalProps) {
  const [type, setType] = useState<'EXPENSE' | 'INCOME' | 'TRANSFER'>('EXPENSE');
  const [walletId, setWalletId] = useState('');
  const [destinationWalletId, setDestinationWalletId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(formatDateString());

  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isDestWalletOpen, setIsDestWalletOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [wallets, setWallets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && transaction) {
      const txType = String(transaction.type || '').toUpperCase() as 'EXPENSE' | 'INCOME' | 'TRANSFER';
      setType(txType);
      setWalletId(String(transaction.walletId || transaction.wallet?.id || ''));
      setDestinationWalletId(String(transaction.destinationWalletId || transaction.destinationWallet?.id || ''));
      setCategoryId(String(transaction.categoryId || transaction.category?.id || ''));
      setAmount(String(transaction.amount || ''));
      setDescription(transaction.description || transaction.notes || '');
      setDate(formatDateString(transaction.date || transaction.createdAt));

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
    }
  }, [isOpen, transaction]);

  if (!isOpen || !transaction) return null;

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
    if (!walletId) return alert('Pilih dompet terlebih dahulu');
    if (type === 'TRANSFER' && !destinationWalletId) return alert('Pilih dompet tujuan transfer');
    if (type === 'TRANSFER' && walletId === destinationWalletId) return alert('Dompet asal dan tujuan tidak boleh sama');
    if (!amount || parseFloat(amount) <= 0) return alert('Nominal harus lebih dari 0');

    setLoading(true);
    try {
      await api.put(`/transactions/${transaction.id}`, {
        walletId: Number(walletId),
        destinationWalletId: type === 'TRANSFER' ? Number(destinationWalletId) : null,
        categoryId: type === 'TRANSFER' ? null : (categoryId ? Number(categoryId) : null),
        amount: parseFloat(amount),
        type,
        description,
        notes: description,
        date: getCombinedDateTime(date),
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal memperbarui transaksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-100 font-sans text-slate-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 space-y-4 border border-slate-100 dark:border-slate-800 shadow-2xl relative animate-in fade-in zoom-in duration-150 transition-colors">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {type === 'TRANSFER' ? (
              <ArrowRightLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            ) : (
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {type === 'TRANSFER' ? 'Edit Transfer' : 'Edit Transaksi'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TIPE SWITCHER (JIKA BUKAN TRANSFER) */}
        {type !== 'TRANSFER' ? (
          <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-extrabold">
            <button
              type="button"
              onClick={() => {
                setType('EXPENSE');
                setCategoryId('');
              }}
              className={`py-1.5 rounded-lg transition cursor-pointer ${
                type === 'EXPENSE' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => {
                setType('INCOME');
                setCategoryId('');
              }}
              className={`py-1.5 rounded-lg transition cursor-pointer ${
                type === 'INCOME' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pemasukan
            </button>
          </div>
        ) : (
          <div className="p-2 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 text-center border dark:border-slate-800">
            Transfer Antar Dompet
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Nominal (Rp)</label>
            <input
              type="number"
              required
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-black text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition"
            />
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-bold mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Tanggal Transaksi
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition scheme-light dark:scheme-dark"
            />
          </div>

          {/* DOMPET ASAL */}
          <CustomDropdown
            label={type === 'TRANSFER' ? 'Dari Dompet (Asal)' : 'Dompet / Rekening'}
            required
            isOpen={isWalletOpen}
            onToggle={() => {
              setIsWalletOpen(!isWalletOpen);
              setIsDestWalletOpen(false);
              setIsCategoryOpen(false);
            }}
            selectedOption={walletOptions.find((w) => String(w.id) === walletId)}
            options={walletOptions}
            onSelect={(id) => {
              setWalletId(id);
              setIsWalletOpen(false);
            }}
            placeholder="-- Pilih Dompet --"
            defaultIcon={Wallet}
          />

          {/* JIKA TRANSFER: TAMPILKAN DOMPET TUJUAN */}
          {type === 'TRANSFER' ? (
            <CustomDropdown
              label="Ke Dompet (Tujuan)"
              required
              isOpen={isDestWalletOpen}
              onToggle={() => {
                setIsDestWalletOpen(!isDestWalletOpen);
                setIsWalletOpen(false);
                setIsCategoryOpen(false);
              }}
              selectedOption={walletOptions.find((w) => String(w.id) === destinationWalletId)}
              options={walletOptions.filter((w) => String(w.id) !== walletId)}
              onSelect={(id) => {
                setDestinationWalletId(id);
                setIsDestWalletOpen(false);
              }}
              placeholder="-- Pilih Dompet Tujuan --"
              defaultIcon={Wallet}
            />
          ) : (
            /* JIKA INCOME/EXPENSE: TAMPILKAN KATEGORI */
            <CustomDropdown
              label="Kategori"
              required
              isOpen={isCategoryOpen}
              onToggle={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsWalletOpen(false);
              }}
              selectedOption={categoryOptions.find((c) => String(c.id) === categoryId)}
              options={categoryOptions}
              onSelect={(id) => {
                setCategoryId(id);
                setIsCategoryOpen(false);
              }}
              placeholder="-- Pilih Kategori --"
              defaultIcon={Tag}
            />
          )}

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Catatan (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: Beli Kopi / Top Up E-Wallet"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-extrabold rounded-xl transition disabled:opacity-50 cursor-pointer active:scale-95 shadow-xs"
            >
              {loading ? 'Menyimpan...' : 'Perbarui'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}