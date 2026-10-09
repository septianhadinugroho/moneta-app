'use client';

import { useState, useEffect, useMemo } from 'react';
import { X, Tag, Search } from 'lucide-react';
import api from '@/lib/api';
import ColorPicker from '@/components/ui/ColorPicker';
import CategoryIcon, { ICON_GROUPS, ICON_TAGS } from '@/components/ui/CategoryIcon';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: any;
  defaultType?: 'EXPENSE' | 'INCOME';
  onSuccess: (newCategory?: any) => void;
}

export default function CategoryModal({
  isOpen,
  onClose,
  categoryToEdit,
  defaultType,
  onSuccess,
}: CategoryModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [color, setColor] = useState('#ef4444');
  const [icon, setIcon] = useState('Tag');
  const [searchIcon, setSearchIcon] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || '');
      setType(categoryToEdit.type || 'EXPENSE');
      setColor(categoryToEdit.color || '#ef4444');
      setIcon(categoryToEdit.icon || 'Tag');
    } else {
      setName('');
      setType(defaultType || 'EXPENSE');
      setColor(defaultType === 'INCOME' ? '#10b981' : '#ef4444');
      setIcon(defaultType === 'INCOME' ? 'Briefcase' : 'ShoppingBag');
    }
    setSearchIcon('');
  }, [categoryToEdit, defaultType, isOpen]);

  const handleTypeChange = (newType: 'EXPENSE' | 'INCOME') => {
    setType(newType);
    if (!categoryToEdit) {
      setColor(newType === 'EXPENSE' ? '#ef4444' : '#10b981');
      setIcon(newType === 'EXPENSE' ? 'ShoppingBag' : 'Briefcase');
    }
  };

  const filteredIconGroups = useMemo(() => {
    if (!searchIcon.trim()) return ICON_GROUPS;

    const query = searchIcon.toLowerCase();

    return ICON_GROUPS.map((group) => ({
      ...group,
      icons: group.icons.filter((iconName) => {
        const matchesName = iconName.toLowerCase().includes(query);
        const tags = ICON_TAGS[iconName] || [];
        const matchesTag = tags.some((tag) => tag.toLowerCase().includes(query));
        return matchesName || matchesTag;
      }),
    })).filter((group) => group.icons.length > 0);
  }, [searchIcon]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Nama kategori wajib diisi');

    setLoading(true);
    try {
      let createdOrUpdatedCategory = null;
      if (categoryToEdit) {
        const res = await api.put(`/categories/${categoryToEdit.id}`, { name, type, color, icon });
        createdOrUpdatedCategory = res.data.data;
      } else {
        const res = await api.post('/categories', { name, type, color, icon });
        createdOrUpdatedCategory = res.data.data;
      }
      onSuccess(createdOrUpdatedCategory);
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan kategori');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-100 font-sans text-slate-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 space-y-4 border border-slate-100 dark:border-slate-800 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col transition-colors">
        
        {/* HEADER */}
        <div className="flex justify-between items-center shrink-0 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            {categoryToEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs overflow-y-auto pr-1 flex-1 custom-scrollbar">
          {/* TIPE KATEGORI */}
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Tipe Kategori</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
              <button
                type="button"
                onClick={() => handleTypeChange('EXPENSE')}
                className={`py-1.5 rounded-lg font-extrabold transition cursor-pointer active:scale-95 ${
                  type === 'EXPENSE' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('INCOME')}
                className={`py-1.5 rounded-lg font-extrabold transition cursor-pointer active:scale-95 ${
                  type === 'INCOME' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Pemasukan
              </button>
            </div>
          </div>

          {/* INPUT NAMA & LIVE PREVIEW IKON */}
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Nama Kategori</label>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs transition-all duration-200 transform scale-105"
                style={{ backgroundColor: color }}
              >
                <CategoryIcon name={icon} className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Misal: Jajan, Servis Motor, Bonus"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl font-extrabold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition"
              />
            </div>
          </div>

          {/* COLOR PICKER */}
          <ColorPicker
            label="Warna Label"
            selectedColor={color}
            onChange={(newColor) => setColor(newColor)}
          />

          {/* ICON PICKER GRID WITH SEARCH */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center">
              <label className="block text-slate-600 dark:text-slate-300 font-bold">Pilih Ikon</label>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ikon (misal: coffee, car, cat)..."
                value={searchIcon}
                onChange={(e) => setSearchIcon(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-[11px] font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition"
              />
            </div>

            <div className="space-y-2.5 pt-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {filteredIconGroups.length === 0 ? (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center py-3 font-medium">
                  Ikon "{searchIcon}" tidak ditemukan.
                </p>
              ) : (
                filteredIconGroups.map((group) => (
                  <div key={group.category} className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{group.category}</p>
                    <div className="grid grid-cols-6 gap-1.5">
                      {group.icons.map((iconName) => {
                        const isSelected = icon === iconName;
                        return (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => setIcon(iconName)}
                            className={`p-2 rounded-xl flex items-center justify-center transition cursor-pointer active:scale-95 ${
                              isSelected
                                ? 'text-white shadow-xs'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700/60'
                            }`}
                            style={{ backgroundColor: isSelected ? color : undefined }}
                          >
                            <CategoryIcon name={iconName} className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2 sticky bottom-0 bg-white dark:bg-slate-900 pb-1 transition-colors">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold rounded-xl transition text-xs shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : categoryToEdit ? 'Perbarui Kategori' : 'Simpan Kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}