'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { Target, Plus, Edit2, Trash2, Calendar, Wallet as WalletIcon, CheckCircle2 } from 'lucide-react';
import GoalModal from '@/components/modals/GoalModal';
import ConfirmModal from '@/components/modals/ConfirmModal';

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);

  // State untuk Confirm Delete Modal
  const [goalToDelete, setGoalToDelete] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [goalsRes, walletsRes] = await Promise.all([
        api.get('/goals'),
        api.get('/wallets'),
      ]);
      setGoals(goalsRes.data.data || []);
      setWallets(walletsRes.data.data || []);
    } catch (err) {
      console.error('Gagal mengambil data impian:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDeleteModal = (goal: any) => {
    setGoalToDelete(goal);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!goalToDelete) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/goals/${goalToDelete.id}`);
      fetchData();
      setIsDeleteModalOpen(false);
      setGoalToDelete(null);
    } catch (err) {
      alert('Gagal menghapus impian');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900 dark:text-slate-100 pb-28 transition-colors">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Target Impian & Tabungan</h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">Rencanakan Masa Depan Finansialmu</p>
        </div>
        <button
          type="button"
          onClick={() => { setSelectedGoal(null); setIsModalOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-extrabold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-3" />
          <span>Tambah Impian</span>
        </button>
      </div>

      {/* LIST IMPIAN */}
      {loading ? (
        <div className="py-12 flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-2 transition-colors">
          <Target className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Belum ada target impian yang dibuat.</p>
          <button
            onClick={() => { setSelectedGoal(null); setIsModalOpen(true); }}
            className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            + Buat Target Tabungan Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {goals.map((g) => {
            const currentWalletBalance = g.wallet ? Number(g.wallet.balance || 0) : 0;
            const targetAmt = Number(g.targetAmount || 0);
            const percentage = targetAmt > 0 ? Math.min(Math.round((currentWalletBalance / targetAmt) * 100), 100) : 0;
            const isReached = percentage >= 100;

            return (
              <div key={g.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white">{g.name}</h3>
                    {g.wallet && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                        <WalletIcon className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span>Alokasi: {g.wallet.name}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => { setSelectedGoal(g); setIsModalOpen(true); }}
                      className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer transition"
                      title="Edit Target"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(g)}
                      className="p-1 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg cursor-pointer transition"
                      title="Hapus Target"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline text-xs font-black">
                    <span className="text-slate-900 dark:text-white">
                      {formatRupiah(currentWalletBalance)}
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium"> / {formatRupiah(targetAmt)}</span>
                    </span>
                    <span className={isReached ? 'text-emerald-600 dark:text-emerald-400 flex items-center gap-1' : 'text-slate-500 dark:text-slate-400'}>
                      {isReached && <CheckCircle2 className="w-3 h-3 inline" />}
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${isReached ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-slate-900 dark:bg-slate-100'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {g.targetDate && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Tenggat: {new Date(g.targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL INPUT / EDIT GOAL */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goalToEdit={selectedGoal}
        wallets={wallets}
        onSuccess={fetchData}
      />

      {/* MODAL KONFIRMASI HAPUS */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setGoalToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="Hapus Target Impian?"
        description={`Apakah kamu yakin ingin menghapus target impian "${goalToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}