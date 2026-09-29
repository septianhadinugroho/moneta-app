'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, DollarSign } from 'lucide-react';
import api from '@/lib/api';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: any;
  onSuccess: () => void;
}

const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// HELPER GABUNGAN TANGGAL + JAM SEKARANG
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

export default function TransactionModal({
  isOpen,
  onClose,
  transactionToEdit,
  onSuccess,
}: TransactionModalProps) {
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [walletId, setWalletId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(getTodayString());

  const [wallets, setWallets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [walletsRes, categoriesRes] = await Promise.all([
          api.get('/wallets'),
          api.get('/categories'),
        ]);
        setWallets(walletsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
      } catch (err) {
        console.error('Gagal mengambil data pendukung:', err);
      }
    };

    fetchData();

    if (transactionToEdit) {
      setType(transactionToEdit.type || 'EXPENSE');
      setAmount(transactionToEdit.amount?.toString() || '');
      setWalletId(transactionToEdit.walletId?.toString() || '');
      setCategoryId(transactionToEdit.categoryId?.toString() || '');
      setNotes(transactionToEdit.notes || transactionToEdit.description || '');
      
      if (transactionToEdit.date) {
        const txDate = new Date(transactionToEdit.date);
        const yyyy = txDate.getFullYear();
        const mm = String(txDate.getMonth() + 1).padStart(2, '0');
        const dd = String(txDate.getDate()).padStart(2, '0');
        setDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setDate(getTodayString());
      }
    } else {
      setType('EXPENSE');
      setAmount('');
      setWalletId('');
      setCategoryId('');
      setNotes('');
      setDate(getTodayString());
    }
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !walletId) {
      return alert('Nominal dan Dompet wajib diisi');
    }

    setLoading(true);
    try {
      const payload = {
        type,
        amount: parseFloat(amount),
        walletId: Number(walletId),
        categoryId: categoryId ? Number(categoryId) : null,
        notes,
        description: notes,
        date: getCombinedDateTime(date), // 👈 MENGGUNAKAN HELPER JAM PRESISI
      };

      if (transactionToEdit) {
        await api.put(`/transactions/${transactionToEdit.id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan transaksi');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(
    (c) => String(c.type).toUpperCase() === type
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 border border-slate-100 shadow-2xl relative animate-in fade-in zoom-in duration-150">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            {transactionToEdit ? 'Edit Transaksi' : 'Tambah Transaksi'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={`py-1.5 rounded-lg font-extrabold transition ${
                type === 'EXPENSE' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={`py-1.5 rounded-lg font-extrabold transition ${
                type === 'INCOME' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Pemasukan
            </button>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Nominal (Rp)</label>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Tanggal Transaksi
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Dompet / Rekening</label>
            <select
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              <option value="">-- Pilih Dompet --</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Kategori</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              <option value="">-- Tanpa Kategori --</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Catatan (Opsional)</label>
            <input
              type="text"
              placeholder="Misal: Beli Kopi, Transfer Antar Rekening"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition text-xs shadow-xs"
          >
            {loading ? 'Menyimpan...' : transactionToEdit ? 'Perbarui Transaksi' : 'Simpan Transaksi'}
          </button>
        </form>
      </div>
    </div>
  );
}