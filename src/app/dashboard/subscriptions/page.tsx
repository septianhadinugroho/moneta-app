'use client';

import { useEffect, useState, useMemo } from 'react';
import { CreditCard, Plus, Loader2, CheckCircle2, Trash2, Edit3, ShieldAlert, Check } from 'lucide-react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import SubscriptionModal from '@/components/modals/SubscriptionModal';
import ConfirmModal from '@/components/modals/ConfirmModal';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subToEdit, setSubToEdit] = useState<any>(null);
  const [payingId, setPayingId] = useState<number | null>(null);

  // ConfirmModal States
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'primary';
    confirmLabel?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'primary',
  });

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/subscriptions');
      setSubscriptions(res.data.data || []);
    } catch (err) {
      console.error('Gagal mengambil daftar tagihan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const totalMonthlyCommitment = useMemo(() => {
    return subscriptions
      .filter((s) => s.status === 'ACTIVE')
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [subscriptions]);

  const paidCount = useMemo(() => {
    return subscriptions.filter((s) => s.isPaidThisMonth).length;
  }, [subscriptions]);

  const handlePay = (sub: any) => {
    if (sub.isPaidThisMonth) return;

    if (!sub.walletId) {
      setConfirmConfig({
        isOpen: true,
        title: 'Dompet Belum Diatur',
        message: `Tagihan "${sub.name}" belum memiliki dompet pembayaran default. Silakan edit tagihan untuk memilih dompet.`,
        onConfirm: () => setConfirmConfig((prev) => ({ ...prev, isOpen: false })),
        variant: 'warning',
        confirmLabel: 'Mengerti',
      });
      return;
    }

    setConfirmConfig({
      isOpen: true,
      title: 'Konfirmasi Pembayaran',
      message: `Bayar tagihan ${sub.name} sebesar ${formatRupiah(Number(sub.amount))}? Saldo dompet "${sub.wallet?.name || ''}" akan dipotong.`,
      variant: 'primary',
      confirmLabel: 'Ya, Bayar',
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        setPayingId(sub.id);
        try {
          await api.post(`/subscriptions/${sub.id}/pay`, { targetWalletId: sub.walletId });
          fetchSubscriptions();
        } catch (err: any) {
          setConfirmConfig({
            isOpen: true,
            title: 'Gagal Membayar',
            message: err.response?.data?.message || 'Gagal memproses pembayaran tagihan',
            onConfirm: () => setConfirmConfig((prev) => ({ ...prev, isOpen: false })),
            variant: 'danger',
            confirmLabel: 'Tutup',
          });
        } finally {
          setPayingId(null);
        }
      },
    });
  };

  const handleDelete = (sub: any) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Hapus Tagihan Rutin',
      message: `Apakah kamu yakin ingin menghapus tagihan "${sub.name}"?`,
      variant: 'danger',
      confirmLabel: 'Ya, Hapus',
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          await api.delete(`/subscriptions/${sub.id}`);
          fetchSubscriptions();
        } catch (err) {
          console.error('Gagal menghapus tagihan:', err);
        }
      },
    });
  };

  return (
    <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Tagihan & Langganan</h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">Kelola Pengeluaran Rutin Bulanan</p>
        </div>
        <button
          type="button"
          onClick={() => { setSubToEdit(null); setIsModalOpen(true); }}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah Tagihan</span>
        </button>
      </div>

      {/* SUMMARY CARD KOMITMEN */}
      <div className="bg-linear-to-br from-indigo-900 via-slate-900 to-slate-950 p-4 rounded-2xl border border-indigo-900/50 shadow-md text-white space-y-1">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
          <CreditCard className="w-4 h-4" />
          <span>Total Komitmen Tagihan Bulanan</span>
        </div>
        <p className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight pt-1">
          {formatRupiah(totalMonthlyCommitment)}
        </p>
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium pt-1">
          <span>{subscriptions.filter((s) => s.status === 'ACTIVE').length} Tagihan Terdaftar</span>
          <span className="text-emerald-400 font-bold">{paidCount} dari {subscriptions.length} Lunas Bulan Ini</span>
        </div>
      </div>

      {/* LIST TAGIHAN */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          <span className="text-xs font-bold">Memuat tagihan...</span>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center space-y-2">
          <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs font-black text-slate-700 dark:text-slate-300">Belum Ada Tagihan Rutin</p>
          <p className="text-[11px] text-slate-400 font-medium max-w-xs mx-auto">
            Tambahkan tagihan seperti Wi-Fi, Listrik, Kost, atau Spotify agar tidak kelupaan bayar.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {subscriptions.map((sub) => {
            const todayDay = new Date().getDate();
            const daysLeft = sub.dueDate - todayDay;
            const isDueSoon = !sub.isPaidThisMonth && daysLeft >= 0 && daysLeft <= (sub.reminderDays || 3);
            const isPaid = sub.isPaidThisMonth;

            return (
              <div
                key={sub.id}
                className={`p-3.5 bg-white dark:bg-slate-900 rounded-2xl border transition-all flex justify-between items-center gap-3 ${
                  isPaid
                    ? 'border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 opacity-85'
                    : isDueSoon
                    ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/30 dark:bg-amber-950/20'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${
                    isPaid 
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {isPaid ? <Check className="w-5 h-5" /> : `Tgl ${sub.dueDate}`}
                  </div>
                  <div className="truncate text-xs">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-slate-900 dark:text-white truncate">{sub.name}</p>
                      {isPaid && (
                        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 rounded-md text-[9px] font-extrabold border border-emerald-200/50 dark:border-emerald-800/50">
                          LUNAS
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 truncate">
                      {sub.wallet?.name ? `Dompet: ${sub.wallet.name}` : 'Belum atur dompet'} • {sub.category?.name || 'Umum'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-black font-mono text-slate-900 dark:text-white">
                      {formatRupiah(Number(sub.amount))}
                    </p>
                    <span className={`text-[9px] font-extrabold ${
                      isPaid 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : isDueSoon 
                        ? 'text-amber-600 dark:text-amber-400' 
                        : 'text-slate-400'
                    }`}>
                      {isPaid ? 'Sudah Dibayar' : daysLeft === 0 ? 'Hari Ini' : daysLeft > 0 ? `${daysLeft} hari lagi` : 'Jatuh Tempo'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {isPaid ? (
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl cursor-not-allowed border border-emerald-200/40 dark:border-emerald-900/40" title="Sudah Dibayar Bulan Ini">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePay(sub)}
                        disabled={payingId === sub.id}
                        title="Bayar & Catat Transaksi"
                        className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition cursor-pointer active:scale-95 shadow-xs"
                      >
                        {payingId === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => { setSubToEdit(sub); setIsModalOpen(true); }}
                      className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl transition cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(sub)}
                      className="p-2 text-rose-400 hover:text-rose-600 rounded-xl transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBSCRIPTION FORM MODAL */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subscriptionToEdit={subToEdit}
        onSuccess={fetchSubscriptions}
      />

      {/* CONFIRMATION / ALERT MODAL */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
        confirmLabel={confirmConfig.confirmLabel}
      />
    </div>
  );
}