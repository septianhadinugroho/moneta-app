'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { Tag, Plus, Edit2, Trash2, ArrowDownLeft, ArrowUpRight, AlertTriangle, X } from 'lucide-react';
import CategoryModal from '@/components/modals/CategoryModal';
import CategoryIcon from '@/components/ui/CategoryIcon';

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

  // STATE UNTUK MODAL HAPUS + LIST TRANSAKSI TERKAIT
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [relatedTransactions, setRelatedTransactions] = useState<any[]>([]);
  const [fetchingTx, setFetchingTx] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // FETCH TRANSAKSI TERKAIT SAAT KATEGORI DIKLIK HAPUS
  const handleInitiateDelete = async (category: any) => {
    setDeleteTarget(category);
    setFetchingTx(true);
    try {
      const res = await api.get('/transactions', { params: { categoryId: category.id } });
      setRelatedTransactions(res.data.data || []);
    } catch (err) {
      console.error('Gagal mengambil transaksi terkait', err);
      setRelatedTransactions([]);
    } finally {
      setFetchingTx(false);
    }
  };

  // EKSEKUSI HAPUS KATEGORI + TRANSAKSINYA
  const confirmDeleteCategory = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await api.delete(`/categories/${deleteTarget.id}`);
      setDeleteTarget(null);
      setRelatedTransactions([]);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus kategori');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      {/* HEADER */}
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-0.5">
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Kelola Kategori
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
            Atur pengelompokan transaksi pemasukan & pengeluaranmu
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-3" />
          <span>Kategori Baru</span>
        </button>
      </div>

      {/* SWITCHER TAB */}
      <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl text-xs font-extrabold transition-colors">
        <button
          type="button"
          onClick={() => setActiveTab('EXPENSE')}
          className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
            activeTab === 'EXPENSE'
              ? 'bg-rose-600 dark:bg-rose-600 text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>Pengeluaran ({categories.filter((c) => String(c.type).toUpperCase() === 'EXPENSE').length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('INCOME')}
          className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
            activeTab === 'INCOME'
              ? 'bg-emerald-600 dark:bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Pemasukan ({categories.filter((c) => String(c.type).toUpperCase() === 'INCOME').length})</span>
        </button>
      </div>

      {/* DAFTAR KATEGORI */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-2 transition-colors">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
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
                className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex justify-between items-center hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {/* BADGE IKON BERWARNA */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                    style={{ backgroundColor: catColor }}
                  >
                    <CategoryIcon name={cat.icon} className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {cat.name}
                  </span>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit({ ...cat, color: catColor })}
                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition active:scale-95 cursor-pointer"
                    title="Edit Kategori"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInitiateDelete(cat)}
                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition active:scale-95 cursor-pointer"
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

      {/* MODAL KONFIRMASI HAPUS */}
      {deleteTarget && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 font-sans text-slate-900 dark:text-slate-100">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-2xl shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">Hapus Kategori "{deleteTarget.name}"?</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
                  Menghapus kategori ini akan membuang kategori dan <span className="font-bold text-rose-600 dark:text-rose-400">seluruh transaksi di dalamnya secara permanen</span>.
                </p>
              </div>
            </div>

            {/* PREVIEW DAFTAR TRANSAKSI YANG AKAN TERHAPUS */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                <span>Transaksi Terdampak:</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-700 dark:text-slate-300">
                  {relatedTransactions.length} Transaksi
                </span>
              </div>

              {fetchingTx ? (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center text-xs text-slate-400 dark:text-slate-500 font-medium animate-pulse">
                  Memuat transaksi terkait...
                </div>
              ) : relatedTransactions.length === 0 ? (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                  Tidak ada transaksi di kategori ini. Aman dihapus.
                </div>
              ) : (
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 border border-slate-100 dark:border-slate-800 rounded-2xl p-2 bg-slate-50/50 dark:bg-slate-800/20">
                  {relatedTransactions.map((tx) => (
                    <div key={tx.id} className="p-2 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700/60 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        {tx.type === 'INCOME' ? (
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                        )}
                        <div className="truncate">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{tx.description || 'Tanpa Catatan'}</p>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500">{tx.wallet?.name || 'Dompet'}</p>
                        </div>
                      </div>
                      <span className={`font-black text-xs shrink-0 ${tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'}{formatRupiah(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => { setDeleteTarget(null); setRelatedTransactions([]); }}
                className="py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition active:scale-95 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteCategory}
                className="py-2.5 bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Hapus...' : 'Ya, Hapus Semua'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}