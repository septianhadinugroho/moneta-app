'use client';

import { useState, useEffect } from 'react';
import { X, Tag } from 'lucide-react';
import api from '@/lib/api';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: any;
  onSuccess: () => void;
}

const PRESET_COLORS = ['#ef4444', '#f97316', '#a855f7', '#6366f1', '#10b981', '#06b6d4'];

export default function CategoryModal({
  isOpen,
  onClose,
  categoryToEdit,
  onSuccess,
}: CategoryModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [color, setColor] = useState('#ef4444');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || '');
      setType(categoryToEdit.type || 'EXPENSE');
      setColor(categoryToEdit.color || '#ef4444');
    } else {
      setName('');
      setType('EXPENSE');
      setColor('#ef4444');
    }
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Nama kategori wajib diisi');

    setLoading(true);
    try {
      if (categoryToEdit) {
        await api.put(`/categories/${categoryToEdit.id}`, { name, type, color });
      } else {
        await api.post('/categories', { name, type, color });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan kategori');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 border border-slate-100 shadow-2xl relative animate-in fade-in zoom-in duration-150">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-purple-600" />
            {categoryToEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-600 font-bold mb-1">Tipe Kategori</label>
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
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Nama Kategori</label>
            <input
              type="text"
              placeholder="Misal: Servis Motor, Skincare, Bonus"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1.5">Warna Label</label>
            <div className="flex gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition ${
                    color === c ? 'scale-110 border-slate-900' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition text-xs shadow-xs"
          >
            {loading ? 'Menyimpan...' : categoryToEdit ? 'Perbarui Kategori' : 'Simpan Kategori'}
          </button>
        </form>
      </div>
    </div>
  );
}