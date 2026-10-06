'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  CreditCard,
  Plus,
  Loader2,
  CheckCircle2,
  Trash2,
  Edit3,
  ShieldAlert,
  Calendar,
  AlertCircle,
  Building2,
  Smartphone,
  Radio,
  Banknote,
  Wallet,
} from 'lucide-react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import CategoryIcon from '@/components/ui/CategoryIcon';
import SubscriptionModal from '@/components/modals/SubscriptionModal';
import ConfirmModal from '@/components/modals/ConfirmModal';

const MONTH_NAMES_INDONESIA = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Helper untuk mengambil ikon dan class warna latar ikon dompet
const getWalletTypeBadge = (type?: string) => {
  switch (String(type || '').toUpperCase()) {
    case 'BANK':
      return { icon: Building2, iconBg: 'bg-sky-500/20 text-sky-400' };
    case 'E_WALLET':
      return { icon: Smartphone, iconBg: 'bg-purple-500/20 text-purple-400' };
    case 'E_MONEY':
      return { icon: Radio, iconBg: 'bg-lime-500/20 text-lime-400' };
    case 'CASH':
      return { icon: Banknote, iconBg: 'bg-emerald-500/20 text-emerald-400' };
    default:
      return { icon: Wallet, iconBg: 'bg-slate-500/20 text-slate-400' };
  }
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subToEdit, setSubToEdit] = useState<any>(null);
  const [payingId, setPayingId] = useState<number | null>(null);

  // Dapatkan Nama Bulan Saat Ini Secara Dinamis (misal: Oktober, November)
  const currentMonthName = useMemo(() => {
    const currentMonthIndex = new Date().getMonth();
    return MONTH_NAMES_INDONESIA[currentMonthIndex];
  }, []);

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
    <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900 dark:text-slate-100 transition-colors pb-24">
      {/* 1. HEADER HALAMAN */}
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
          <span className="hidden sm:inline">Tambah</span>
        </button>
      </div>

      {/* 2. RINGKASAN KOMITMEN */}
      <div className="bg-linear-to-br from-indigo-900 via-slate-900 to-slate-950 p-4.5 rounded-2xl border border-indigo-900/50 shadow-md text-white space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-300 text-[11px] font-bold">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Total Komitmen Bulanan</span>
            </div>
            <p className="text-2xl font-black text-white tracking-tight mt-1">
              {formatRupiah(totalMonthlyCommitment)}
            </p>
          </div>
        </div>

        {/* STATS BAR DENGAN NAMA BULAN DINAMIS */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-800/40 text-[11px]">
          <div className="bg-indigo-950/60 p-2 rounded-xl border border-indigo-800/30">
            <span className="text-slate-400 text-[10px] block font-medium">Terdaftar</span>
            <span className="font-extrabold text-white">{subscriptions.length} Tagihan</span>
          </div>
          <div className="bg-indigo-950/60 p-2 rounded-xl border border-indigo-800/30">
            {/* Dinamis menunjukkan bulan berjalan */}
            <span className="text-slate-400 text-[10px] block font-medium">Status {currentMonthName}</span>
            <span className="font-extrabold text-emerald-400">{paidCount} / {subscriptions.length} Lunas</span>
          </div>
        </div>
      </div>

      {/* 3. LIST TAGIHAN CLEAN LAYOUT */}
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
        <div className="space-y-3">
          {subscriptions.map((sub) => {
            const todayDay = new Date().getDate();
            const daysLeft = sub.dueDate - todayDay;
            const isDueSoon = !sub.isPaidThisMonth && daysLeft >= 0 && daysLeft <= (sub.reminderDays || 3);
            const isPaid = sub.isPaidThisMonth;
            const catColor = sub.category?.color || '#4f46e5';

            const walletBadge = getWalletTypeBadge(sub.wallet?.type);
            const WalletIcon = walletBadge.icon;

            return (
              <div
                key={sub.id}
                className={`p-4 bg-white dark:bg-slate-900 rounded-2xl border transition-all space-y-3.5 ${
                  isPaid
                    ? 'border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/10 dark:bg-emerald-950/10'
                    : isDueSoon
                    ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/20'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* BARIS ATAS: IKON, NAMA, AKSI EDIT/HAPUS, NOMINAL & BADGE STATUS */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: catColor }}
                    >
                      <CategoryIcon name={sub.category?.icon || 'Tag'} className="w-5 h-5" />
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-sm text-slate-900 dark:text-white truncate">{sub.name}</h3>
                        
                        {/* TOMBOL EDIT & HAPUS RINGKAS DI SEBELAH NAMA */}
                        <button
                          type="button"
                          onClick={() => { setSubToEdit(sub); setIsModalOpen(true); }}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                          title="Edit Tagihan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(sub)}
                          className="p-1 text-rose-400 hover:text-rose-600 transition cursor-pointer"
                          title="Hapus Tagihan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {/* Tulisan 'tanggal' diperjelas (tidak disingkat tgl) */}
                        <span>Jatuh tempo tanggal {sub.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* NOMINAL & BADGE STATUS DENGAN BULAN DINAMIS */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      {formatRupiah(Number(sub.amount))}
                    </p>

                    <div className="mt-1 flex justify-end">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 rounded-md text-[9px] font-black border border-emerald-200/60 dark:border-emerald-800/60">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>LUNAS {currentMonthName.toUpperCase()}</span>
                        </span>
                      ) : isDueSoon ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 rounded-md text-[9px] font-black border border-amber-200/60 dark:border-amber-800/60">
                          <AlertCircle className="w-3 h-3" />
                          <span>{daysLeft === 0 ? 'Hari ini' : `${daysLeft} hari lagi`}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold text-slate-400">
                          {daysLeft < 0 ? 'Belum dibayar' : `${daysLeft} hari lagi`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* BARIS BAWAH: METADATA PILLS BERDAMPINGAN 1 BARIS & TOMBOL BAYAR */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 gap-2">
                  {/* BADGES BERDAMPINGAN SEJAJAR HORIZONTAL */}
                  <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto no-scrollbar">
                    {/* BADGE DOMPET */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-extrabold border border-slate-200/50 dark:border-slate-700/50 shrink-0">
                      <div className={`p-0.5 rounded-md flex items-center justify-center shrink-0 ${walletBadge.iconBg}`}>
                        <WalletIcon className="w-3 h-3" />
                      </div>
                      <span className="truncate max-w-22.5">{sub.wallet?.name || 'Belum Atur'}</span>
                    </span>

                    {/* BADGE KATEGORI */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-extrabold border border-slate-200/50 dark:border-slate-700/50 shrink-0">
                      <div
                        className="p-0.5 rounded-md flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: catColor }}
                      >
                        <CategoryIcon name={sub.category?.icon || 'Tag'} className="w-3 h-3" />
                      </div>
                      <span className="truncate max-w-22.5">{sub.category?.name || 'Umum'}</span>
                    </span>
                  </div>

                  {/* TOMBOL BAYAR */}
                  {!isPaid && (
                    <button
                      type="button"
                      onClick={() => handlePay(sub)}
                      disabled={payingId === sub.id}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-[11px] rounded-xl transition flex items-center gap-1 shadow-2xs cursor-pointer disabled:opacity-50 shrink-0 ml-auto"
                    >
                      {payingId === sub.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Bayar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL FORM & CONFIRMATION */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subscriptionToEdit={subToEdit}
        onSuccess={fetchSubscriptions}
      />

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