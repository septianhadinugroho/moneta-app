'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Tag, Plus, Edit2, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import CategoryModal from '@/components/modals/CategoryModal';

// Generator Warna Unik Dinamis (HSL)
const generateDynamicColor = (index: number, total: number, isIncome: boolean) => {
  const baseHue = isIncome ? 140 : 10;
  const hue = (index * (360 / Math.max(total, 1)) + baseHue) % 360;
  return `hsl(${hue}, 75%, 45%)`;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (c) => String(c.type).toUpperCase() === activeTab
  );

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: any) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (
      !confirm(
        `Apakah kamu yakin ingin menghapus kategori "${name}"? Transaksi terkait akan diubah menjadi "Lain-lain".`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus kategori');
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* HEADER PRESISI TANPA TABRAKAN */}
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-0.5">
          <h1 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-purple-600" />
            Kelola Kategori
          </h1>
          <p className="text-[11px] text-slate-500 font-medium leading-tight">
            Atur pengelompokan transaksi pemasukan & pengeluaranmu
          </p>
        </div>

        {/* TOMBOL KATEGORI BARU DI HEADER ATAS */}
        <button
          onClick={handleOpenCreate}
          className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shrink-0 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-3" />
          <span>Kategori Baru</span>
        </button>
      </div>

      {/* SWITCHER TAB */}
      <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('EXPENSE')}
          className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'EXPENSE'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>Pengeluaran ({categories.filter((c) => String(c.type).toUpperCase() === 'EXPENSE').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('INCOME')}
          className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'INCOME'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Pemasukan ({categories.filter((c) => String(c.type).toUpperCase() === 'INCOME').length})</span>
        </button>
      </div>

      {/* DAFTAR KATEGORI DENGAN WARNA DINAMIS */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center space-y-2">
          <p className="text-xs text-slate-400 font-medium">
            Belum ada kategori {activeTab === 'EXPENSE' ? 'pengeluaran' : 'pemasukan'}.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredCategories.map((cat, idx) => {
            const isDefaultColor = !cat.color || cat.color === '#64748b';
            const catColor = isDefaultColor
              ? generateDynamicColor(idx, filteredCategories.length, activeTab === 'INCOME')
              : cat.color;

            return (
              <div
                key={cat.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-center hover:border-slate-300 transition"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: catColor }}
                  ></span>
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {cat.name}
                  </span>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit({ ...cat, color: catColor })}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                    title="Edit Kategori"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL EDIT / CREATION */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={selectedCategory}
        onSuccess={fetchCategories}
      />
    </div>
  );
}