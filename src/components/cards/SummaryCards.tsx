'use client';

import { useState } from 'react';
import { formatRupiah } from '@/lib/utils';
import { Eye, EyeOff, Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

interface SummaryCardsProps {
  totalNetWorth?: number;
  monthlySummary?: { income: number; expense: number };
  period?: { month: number; year: number };
  monthName?: string;
}

export default function SummaryCards({
  totalNetWorth = 0,
  monthlySummary,
  period,
  monthName,
}: SummaryCardsProps) {
  const [showBalance, setShowBalance] = useState(false);

  const income = monthlySummary?.income || 0;
  const expense = monthlySummary?.expense || 0;

  const localDate = new Date();
  const activeMonthIndex = period?.month ? period.month - 1 : localDate.getMonth();
  const activeYear = period?.year || localDate.getFullYear();

  const activePeriodLabel = monthName || `${MONTH_NAMES[activeMonthIndex]} ${activeYear}`;

  return (
    <div className="space-y-3 font-sans">
      {/* TOTAL NET WORTH CARD */}
      <div className="bg-slate-900 dark:bg-slate-900 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden space-y-2 border border-slate-800 transition-colors">
        <div className="flex justify-between items-center relative z-10">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            TOTAL NET WORTH
            <button
              type="button"
              onClick={() => setShowBalance(!showBalance)}
              className="text-slate-400 hover:text-white transition p-1 rounded-lg cursor-pointer"
              title={showBalance ? 'Sembunyikan Saldo' : 'Tampilkan Saldo'}
            >
              {showBalance ? (
                <Eye className="w-4 h-4 text-emerald-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </span>

          <div className="p-2 bg-slate-800/80 text-emerald-400 rounded-2xl border border-slate-700">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight relative z-10">
          {showBalance ? formatRupiah(totalNetWorth) : '••••••••'}
        </h2>
        <p className="text-[10px] text-slate-400 font-medium">Total akumulasi seluruh akun</p>
      </div>

      {/* CARDS PEMASUKAN & PENGELUARAN */}
      <div className="grid grid-cols-1 gap-3">
        {/* PEMASUKAN */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex justify-between items-center transition-colors">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-400 block">
              Pemasukan ({activePeriodLabel})
            </span>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100 truncate">
              {showBalance ? formatRupiah(income) : '••••••••'}
            </p>
            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Akumulasi Bulan Ini
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* PENGELUARAN */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex justify-between items-center transition-colors">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-400 block">
              Pengeluaran ({activePeriodLabel})
            </span>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100 truncate">
              {showBalance ? formatRupiah(expense) : '••••••••'}
            </p>
            <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> Akumulasi Bulan Ini
            </p>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-2xl shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}