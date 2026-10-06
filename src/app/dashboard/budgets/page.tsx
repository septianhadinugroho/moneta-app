'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { Target, Plus, Edit2, Trash2, AlertCircle, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import BudgetModal from '@/components/modals/BudgetModal';
import ConfirmModal from '@/components/modals/ConfirmModal';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);

  // State untuk Confirm Modal Hapus
  const [budgetToDelete, setBudgetToDelete] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/budgets', { params: { month, year } });
      setBudgets(res.data.data || []);
    } catch (err) {
      console.error('Gagal mengambil data anggaran:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const openDeleteModal = (budget: any) => {
    setBudgetToDelete(budget);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!budgetToDelete?.id) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/budgets/${budgetToDelete.id}`);
      fetchBudgets();
      setIsDeleteModalOpen(false);
      setBudgetToDelete(null);
    } catch (err) {
      alert('Gagal menghapus anggaran');
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalBudgetLimit = budgets.reduce((acc, curr) => acc + Number(curr.limitAmount || 0), 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + Number(curr.spentAmount || 0), 0);
  const overallPercentage = totalBudgetLimit > 0 ? Math.min(Math.round((totalSpent / totalBudgetLimit) * 100), 100) : 0;

  return (
    <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900 dark:text-slate-100 transition-colors pb-24">
      {/* HEADER PERIODE & NAVIGASI BULAN */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-xl">
            <Target className="w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Anggaran Bulanan</h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
              {MONTH_NAMES[month - 1]} {year}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer active:scale-95"
            title="Bulan Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 px-1">
            {MONTH_NAMES[month - 1].slice(0, 3)} {year}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer active:scale-95"
            title="Bulan Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SUMMARY TOTAL ANGGARAN */}
      <div className="bg-slate-900 dark:bg-slate-900 border border-transparent dark:border-slate-800 text-white p-5 rounded-3xl shadow-lg space-y-3 transition-colors">
        <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
          <span>RINGKASAN ANGGARAN</span>
          <span className="bg-slate-800 dark:bg-slate-800/80 text-emerald-400 px-2.5 py-1 rounded-full border border-slate-700">
            {budgets.length} Kategori Dibatasi
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
          <div>
            <p className="text-[10px] text-slate-400 font-bold">Total Limit</p>
            <p className="text-lg sm:text-xl font-black text-white">{formatRupiah(totalBudgetLimit)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold">Terpakai</p>
            <p className={`text-lg sm:text-xl font-black ${totalSpent > totalBudgetLimit && totalBudgetLimit > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatRupiah(totalSpent)}
            </p>
          </div>
        </div>

        {totalBudgetLimit > 0 && (
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>Total Pemakaian</span>
              <span>{overallPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  overallPercentage > 90 ? 'bg-rose-500' : overallPercentage > 70 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* DAFTAR ANGGARAN PER KATEGORI */}
      <div className="space-y-3 pt-1">
        <div className="flex justify-between items-center px-0.5">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
            Detail Limit Kategori
          </h3>
          <button
            type="button"
            onClick={() => {
              setSelectedBudget(null);
              setIsModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1 shadow-xs active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-3" />
            <span>Atur Anggaran</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center min-h-[30vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
          </div>
        ) : budgets.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-2 transition-colors">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Belum ada anggaran yang diatur untuk bulan ini.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedBudget(null);
                setIsModalOpen(true);
              }}
              className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              + Buat Batas Anggaran Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {budgets.map((b) => {
              const spent = Number(b.spentAmount || 0);
              const limit = Number(b.limitAmount || 0);
              const percentage = Number(b.percentage || 0);
              const isOver = b.isOverBudget || spent > limit;
              const catColor = b.category?.color || '#3b82f6';

              let barColor = 'bg-emerald-500 dark:bg-emerald-400';
              let badgeBg = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60';
              let statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
              let statusText = 'Aman';

              if (isOver) {
                barColor = 'bg-rose-600 dark:bg-rose-500';
                badgeBg = 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60';
                statusIcon = <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
                statusText = 'Melebihi Limit!';
              } else if (percentage > 70) {
                barColor = 'bg-amber-500 dark:bg-amber-400';
                badgeBg = 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60';
                statusIcon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
                statusText = 'Mendekati Limit';
              }

              return (
                <div
                  key={b.id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* IKON KATEGORI DENGAN BACKGROUND TEMA */}
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: catColor }}
                      >
                        <CategoryIcon name={b.category?.icon || 'Tag'} className="w-4 h-4" />
                      </div>

                      <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {b.category?.name || 'Kategori'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badgeBg}`}>
                        {statusIcon}
                        <span>{statusText}</span>
                      </span>
                      
                      {/* TOMBOL EDIT */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBudget(b);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer active:scale-95"
                        title="Edit Anggaran"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* TOMBOL TRASH / HAPUS */}
                      <button
                        type="button"
                        onClick={() => openDeleteModal(b)}
                        className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer active:scale-95"
                        title="Hapus Anggaran"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline text-xs font-extrabold">
                    <span className="text-slate-900 dark:text-white font-black">
                      {formatRupiah(spent)} <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">/ {formatRupiah(limit)}</span>
                    </span>
                    <span className={isOver ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}>
                      {percentage}%
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium text-right">
                    {isOver ? (
                      <span className="text-rose-600 dark:text-rose-400 font-bold">
                        Over budget sebesar {formatRupiah(spent - limit)}
                      </span>
                    ) : (
                      <span>Sisa anggaran: <strong className="text-slate-700 dark:text-slate-300">{formatRupiah(limit - spent)}</strong></span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL SET ANGGARAN */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        budgetToEdit={selectedBudget}
        month={month}
        year={year}
        onSuccess={fetchBudgets}
      />

      {/* MODAL KONFIRMASI HAPUS */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setBudgetToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="Hapus Anggaran?"
        description={`Apakah kamu yakin ingin menghapus batas anggaran untuk kategori "${budgetToDelete?.category?.name || ''}"?`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}