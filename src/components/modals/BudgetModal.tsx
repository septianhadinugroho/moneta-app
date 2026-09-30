'use client';

import { useState, useEffect } from 'react';
import { X, Target, Check, AlertCircle, Tag } from 'lucide-react';
import api from '@/lib/api';
import CustomDropdown from '@/components/ui/CustomDropdown';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetToEdit?: any;
  month: number;
  year: number;
  onSuccess: () => void;
}

export default function BudgetModal({
  isOpen,
  onClose,
  budgetToEdit,
  month,
  year,
  onSuccess,
}: BudgetModalProps) {
  const [categoryId, setCategoryId] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');

    // Fetch kategori EXPENSE saja
    api.get('/categories')
      .then((res) => {
        const expenseCategories = (res.data.data || []).filter(
          (c: any) => String(c.type).toUpperCase() === 'EXPENSE'
        );
        setCategories(expenseCategories);
      })
      .catch((err) => console.error(err));

    if (budgetToEdit) {
      setCategoryId(String(budgetToEdit.category?.id || budgetToEdit.categoryId || ''));
      setLimitAmount(String(budgetToEdit.limitAmount || ''));
    } else {
      setCategoryId('');
      setLimitAmount('');
    }
  }, [isOpen, budgetToEdit]);

  if (!isOpen) return null;

  const categoryOptions = categories.map((c) => ({
    id: c.id,
    name: c.name,
    color: c.color || '#64748b',
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!categoryId) {
      setError('Pilih kategori pengeluaran terlebih dahulu');
      return;
    }

    const numericLimit = parseFloat(limitAmount);
    if (!limitAmount || isNaN(numericLimit) || numericLimit <= 0) {
      setError('Masukkan nominal limit anggaran yang valid');
      return;
    }

    setLoading(true);
    try {
      await api.post('/budgets', {
        categoryId: Number(categoryId),
        limitAmount: numericLimit,
        month,
        year,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan anggaran');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans text-slate-900">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
        
        {/* HEADER MODAL */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              {budgetToEdit ? 'Edit Anggaran Bulanan' : 'Atur Anggaran Baru'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* DROPDOWN KATEGORI */}
          <CustomDropdown
            label="Kategori Pengeluaran"
            required
            isOpen={isCategoryOpen}
            onToggle={() => setIsCategoryOpen(!isCategoryOpen)}
            selectedOption={categoryOptions.find((c) => String(c.id) === categoryId)}
            options={categoryOptions}
            onSelect={(id) => {
              setCategoryId(id);
              setIsCategoryOpen(false);
            }}
            placeholder="-- Pilih Kategori --"
            defaultIcon={Tag}
          />

          {/* INPUT LIMIT */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Batas Maksimal Pengeluaran (Rp) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Misal: 1500000"
              value={limitAmount}
              onChange={(e) => {
                setLimitAmount(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition active:scale-95 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition shadow-md shadow-slate-900/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{loading ? 'Menyimpan...' : 'Simpan Limit'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}