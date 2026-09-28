'use client';

import { useState, useEffect } from 'react';
import { X, Tag, Palette } from 'lucide-react';
import api from '@/lib/api';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: any;
  onSuccess: () => void;
}

// 1. TAMBAH PILIHAN WARNA PRESET
const PRESET_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#2563eb', // Blue
  '#6366f1', // Indigo
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#0f172a', // Slate / Dark
];

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
            
            {/* CONTAINER BISA DIGESER HORIZONTAL */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 no-scrollbar scroll-smooth">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full shrink-0 border-2 transition ${
                    color.toLowerCase() === c.toLowerCase() ? 'scale-110 border-slate-900' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}

              {/* TOMBOL WARNA BEBAS (PALETTE) DI UJUNG */}
              <label
                className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center cursor-pointer transition-transform relative overflow-hidden bg-linear-to-tr from-indigo-500 via-rose-500 to-amber-400 ${
                  !PRESET_COLORS.includes(color.toLowerCase())
                    ? 'scale-110 ring-2 ring-slate-900 ring-offset-1'
                    : 'opacity-90'
                }`}
                title="Pilih Warna Bebas"
              >
                <Palette className="w-3 h-3 text-white drop-shadow-xs" />
                <input
                  type="color"
                  value={color || '#ef4444'}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </label>
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