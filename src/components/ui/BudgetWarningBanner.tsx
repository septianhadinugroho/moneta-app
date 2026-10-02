'use client';

import { AlertTriangle, ShieldAlert, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface BudgetWarningBannerProps {
  budgets: any[];
}

export default function BudgetWarningBanner({ budgets }: BudgetWarningBannerProps) {
  // Evaluasi budget over / mendekati limit
  const alertBudgets = budgets
    .map((b) => {
      const limit = Number(b.limitAmount || 0);
      const used = Number(b.usedAmount || 0);
      const percentage = limit > 0 ? (used / limit) * 100 : 0;
      return { ...b, percentage, limit, used };
    })
    .filter((b) => b.percentage >= 80)
    .sort((a, b) => b.percentage - a.percentage);

  if (alertBudgets.length === 0) return null;

  const topAlert = alertBudgets[0];
  const isOverBudget = topAlert.percentage >= 100;

  return (
    <div
      className={`p-3 sm:p-3.5 rounded-2xl border font-sans animate-in fade-in duration-200 flex items-center justify-between gap-3 transition-colors ${
        isOverBudget
          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`p-2 rounded-xl shrink-0 ${
            isOverBudget
              ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400'
              : 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400'
          }`}
        >
          {isOverBudget ? <ShieldAlert className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
        </div>
        <div className="truncate text-xs">
          <p className="font-black truncate">
            {isOverBudget ? 'DANGER ZONE: Over Budget!' : 'Peringatan Anggaran!'}
          </p>
          <p className="text-[10px] font-bold opacity-80 truncate mt-0.5">
            Kategori <span className="underline">{topAlert.category?.name || 'Umum'}</span> sudah terpakai{' '}
            <strong>{topAlert.percentage.toFixed(0)}%</strong>
            {alertBudgets.length > 1 && ` (+${alertBudgets.length - 1} kategori lainnya)`}
          </p>
        </div>
      </div>

      <Link
        href="/dashboard/budgets"
        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black shrink-0 flex items-center gap-1 transition cursor-pointer active:scale-95 ${
          isOverBudget
            ? 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 text-white'
            : 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500 text-white'
        }`}
      >
        <span>Cek Budget</span>
        <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  );
}