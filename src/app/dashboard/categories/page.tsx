'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { Tag, Plus, Edit2, Trash2, ArrowDownLeft, ArrowUpRight, AlertTriangle } from 'lucide-react';
import CategoryModal from '@/components/modals/CategoryModal';

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
      <div className="py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900">
      {/* HEADER */}
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

        <button
          onClick={handleOpenCreate}
          className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-3" />
          <span>Kategori Baru</span>
        </button>
      </div>

      {/* SWITCHER TAB */}
      <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('EXPENSE')}
          className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95 ${
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
          className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95 ${
            activeTab === 'INCOME'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Pemasukan ({categories.filter((c) => String(c.type).toUpperCase() === 'INCOME').length})</span>
        </button>
      </div>

      {/* DAFTAR KATEGORI */}
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
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex justify-between items-center hover:border-slate-300 transition"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: catColor }}
                  ></span>
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {cat.name}
                  </span>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit({ ...cat, color: catColor })}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition active:scale-95"
                    title="Edit Kategori"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleInitiateDelete(cat)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition active:scale-95"
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

      {/* MODAL KONFIRMASI HAPUS KATEGORI + LIST TRANSAKSI */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-100 text-rose-600 rounded-2xl shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Hapus Kategori "{deleteTarget.name}"?</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                  Menghapus kategori ini akan membuang kategori dan <span className="font-bold text-rose-600">seluruh transaksi di dalamnya secara permanen</span>.
                </p>
              </div>
            </div>

            {/* PREVIEW DAFTAR TRANSAKSI YANG AKAN TERHAPUS */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-500">
                <span>Transaksi Terdampak:</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded-full">{relatedTransactions.length} Transaksi</span>
              </div>

              {fetchingTx ? (
                <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-400 font-medium animate-pulse">
                  Memuat transaksi terkait...
                </div>
              ) : relatedTransactions.length === 0 ? (
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center text-xs text-slate-400 font-medium">
                  Tidak ada transaksi di kategori ini. Aman dihapus.
                </div>
              ) : (
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
                  {relatedTransactions.map((tx) => (
                    <div key={tx.id} className="p-2 bg-white rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        {tx.type === 'INCOME' ? (
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        )}
                        <div className="truncate">
                          <p className="font-bold text-slate-900 truncate">{tx.description || 'Tanpa Catatan'}</p>
                          <p className="text-[9px] text-slate-400">{tx.wallet?.name || 'Dompet'}</p>
                        </div>
                      </div>
                      <span className={`font-black text-xs shrink-0 ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}>
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
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition active:scale-95"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteCategory}
                className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-xs active:scale-95 disabled:opacity-50"
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