'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { X, Plus } from 'lucide-react';
import CategoryModal from '@/components/modals/CategoryModal';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onSuccess,
}: AddTransactionModalProps) {
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [walletId, setWalletId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');

  const [wallets, setWallets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // State untuk Modal Quick Create Kategori
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // 1. Fetch Wallets
  const fetchWallets = async () => {
    try {
      const res = await api.get('/wallets');
      const data = res.data.data || [];
      setWallets(data);
      if (data.length > 0 && !walletId) {
        setWalletId(String(data[0].id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Fetch Categories berdasarkan Tipe (EXPENSE / INCOME)
  const fetchCategories = async (selectedType: 'EXPENSE' | 'INCOME') => {
    try {
      const res = await api.get(`/categories?type=${selectedType}`);
      const data = res.data.data || [];
      setCategories(data);
      if (data.length > 0) {
        setCategoryId(String(data[0].id));
      } else {
        setCategoryId('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchWallets();
      fetchCategories(type);
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return alert('Nominal harus lebih dari 0');
    if (!walletId) return alert('Pilih dompet terlebih dahulu');

    setLoading(true);
    try {
      await api.post('/transactions', {
        walletId: Number(walletId),
        categoryId: categoryId ? Number(categoryId) : null,
        amount: parseFloat(amount),
        type,
        description,
        date: new Date().toISOString(),
      });

      onSuccess();
      onClose();
      setAmount('');
      setDescription('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan transaksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 border border-slate-100 shadow-2xl relative animate-in fade-in zoom-in duration-150">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-slate-900">Catat Transaksi</h3>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TOGGLE TIPE TRANSAKSI */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-extrabold">
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={`py-2 rounded-lg transition ${
                type === 'EXPENSE' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={`py-2 rounded-lg transition ${
                type === 'INCOME' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Pemasukan
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* NOMINAL */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">Nominal (Rp)</label>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 text-base focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* DOMPET / REKENING */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">Dompet / Rekening</label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              >
                {wallets.length === 0 ? (
                  <option value="">-- Belum ada dompet --</option>
                ) : (
                  wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* KATEGORI + TOMBOL MIKRO "+ BARU" */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-slate-600 font-bold">Kategori</label>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition"
                >
                  <Plus className="w-3 h-3 stroke-3" />
                  <span>Kategori Baru</span>
                </button>
              </div>

              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* CATATAN */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">Catatan (Opsional)</label>
              <input
                type="text"
                placeholder="Contoh: Makan Siang / Gaji Bulan Ini"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* SUBMIT BUTTONS */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl transition hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-2.5 bg-slate-900 text-white font-extrabold rounded-xl transition hover:bg-slate-800"
              >
                {loading ? 'Simpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* QUICK MODAL BUAT KATEGORI BARU */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={() => fetchCategories(type)}
      />
    </>
  );
}