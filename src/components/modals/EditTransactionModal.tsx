'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { X } from 'lucide-react';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
  onSuccess?: () => void;
}

export default function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
  onSuccess,
}: EditTransactionModalProps) {
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [walletId, setWalletId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [wallets, setWallets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Wallets & Categories
  useEffect(() => {
    if (isOpen && transaction) {
      setType(String(transaction.type).toUpperCase() as 'EXPENSE' | 'INCOME');
      setWalletId(String(transaction.walletId || transaction.wallet?.id || ''));
      setCategoryId(String(transaction.categoryId || transaction.category?.id || ''));
      setAmount(String(transaction.amount || ''));
      setDescription(transaction.description || '');

      api.get('/wallets').then((res) => setWallets(res.data.data || []));
      api.get('/categories').then((res) => setCategories(res.data.data || []));
    }
  }, [isOpen, transaction]);

  if (!isOpen || !transaction) return null;

  const filteredCategories = categories.filter(
    (c) => String(c.type).toUpperCase() === type
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletId) return alert('Pilih dompet terlebih dahulu');
    if (!amount || parseFloat(amount) <= 0) return alert('Nominal harus lebih dari 0');

    setLoading(true);
    try {
      await api.put(`/transactions/${transaction.id}`, {
        walletId: Number(walletId),
        categoryId: categoryId ? Number(categoryId) : null,
        amount: parseFloat(amount),
        type,
        description,
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-100 relative animate-in fade-in zoom-in duration-150">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-slate-900">Edit Transaksi</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TOGGLE INCOME / EXPENSE */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setType('EXPENSE');
              setCategoryId('');
            }}
            className={`py-1.5 text-xs font-extrabold rounded-lg transition ${
              type === 'EXPENSE' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'
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
            className={`py-1.5 text-xs font-extrabold rounded-lg transition ${
              type === 'INCOME' ? 'bg-[#16A085] text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Pemasukan
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nominal (Rp)</label>
            <input
              type="number"
              required
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#16A085]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dompet / Rekening</label>
            <select
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#16A085]"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#16A085]"
            >
              <option value="">-- Pilih Kategori --</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Catatan (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: Makan Siang / Gaji Bulan Ini"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#16A085]"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-[#0F3D34] text-white text-xs font-bold rounded-xl hover:bg-[#16A085] transition disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Perbarui'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}