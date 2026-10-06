'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';

export default function SubscriptionWarningBanner({ onRefresh }: { onRefresh?: () => void }) {
  const [upcomingSubs, setUpcomingSubs] = useState<any[]>([]);
  const [payingId, setPayingId] = useState<number | null>(null);

  const fetchUpcomingSubscriptions = async () => {
    try {
      const res = await api.get('/subscriptions');
      const allSubs = res.data.data || [];
      const todayDay = new Date().getDate();

      // HANYA ambil tagihan yang BELUM DIBAYAR bulan ini dan mendekati jatuh tempo
      const dueSoon = allSubs.filter((sub: any) => {
        if (sub.status !== 'ACTIVE' || sub.isPaidThisMonth) return false;
        const diff = sub.dueDate - todayDay;
        return diff >= 0 && diff <= (sub.reminderDays || 3);
      });

      setUpcomingSubs(dueSoon);
    } catch (err) {
      console.error('Gagal mengambil tagihan:', err);
    }
  };

  useEffect(() => {
    fetchUpcomingSubscriptions();
  }, []);

  const handleQuickPay = async (sub: any) => {
    if (!sub.walletId) {
      alert('Tagihan ini belum memiliki dompet default. Silakan atur dompet di menu Tagihan.');
      return;
    }

    setPayingId(sub.id);
    try {
      await api.post(`/subscriptions/${sub.id}/pay`, { targetWalletId: sub.walletId });
      fetchUpcomingSubscriptions();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal memproses pembayaran');
    } finally {
      setPayingId(null);
    }
  };

  if (upcomingSubs.length === 0) return null;

  // JIKA TAGIHAN ADA LEBIH DARI 1: Tampilkan 1 Banner Ringkasan (Biar tidak numpuk)
  if (upcomingSubs.length > 1) {
    const totalAmount = upcomingSubs.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    return (
      <div className="p-3.5 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 rounded-2xl flex items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-300">
        <div className="flex items-center gap-2.5 min-w-0 text-xs">
          <div className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="truncate">
            <p className="font-black text-amber-950 dark:text-amber-100 truncate">
              {upcomingSubs.length} Tagihan Jatuh Tempo Minggu Ini!
            </p>
            <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80 font-bold mt-0.5">
              Total tagihan: <span className="font-mono">{formatRupiah(totalAmount)}</span>
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/subscriptions"
          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-[10px] rounded-xl shrink-0 transition active:scale-95 flex items-center gap-1 shadow-xs"
        >
          <span>Cek Semua</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  // JIKA HANYA 1 TAGIHAN: Tampilkan detail tunggal
  const sub = upcomingSubs[0];
  const todayDay = new Date().getDate();
  const daysLeft = sub.dueDate - todayDay;

  return (
    <div className="p-3.5 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 rounded-2xl flex items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-300">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="truncate text-xs">
          <p className="font-black text-amber-950 dark:text-amber-100 truncate">
            {sub.name} — <span className="font-mono">{formatRupiah(Number(sub.amount))}</span>
          </p>
          <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80 font-bold mt-0.5">
            {daysLeft === 0 ? 'Jatuh tempo HARI INI!' : `Jatuh tempo dalam ${daysLeft} hari (Tgl ${sub.dueDate})`}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => handleQuickPay(sub)}
        disabled={payingId === sub.id}
        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-[10px] rounded-xl shrink-0 transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1 shadow-xs"
      >
        {payingId === sub.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
        <span>Bayar</span>
      </button>
    </div>
  );
}