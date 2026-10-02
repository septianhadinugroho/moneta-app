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
      if (budgetToEdit?.id) {
        // UPDATE VIA PUT ID
        await api.put(`/budgets/${budgetToEdit.id}`, {
          categoryId: Number(categoryId),
          limitAmount: numericLimit,
        });
      } else {
        // CREATE / UPSERT VIA POST
        await api.post('/budgets', {
          categoryId: Number(categoryId),
          limitAmount: numericLimit,
          month,
          year,
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan anggaran');
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
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-xl">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {budgetToEdit ? 'Edit Anggaran Bulanan' : 'Atur Anggaran Baru'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs rounded-xl font-bold flex items-center gap-2 animate-in fade-in duration-200">
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
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
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
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-extrabold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition active:scale-95 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
            >
              Batal
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold rounded-xl transition shadow-md shadow-slate-900/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              <span>{loading ? 'Menyimpan...' : 'Simpan Limit'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}