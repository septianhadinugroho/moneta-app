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
      className={`p-3 sm:p-3.5 rounded-2xl border font-sans animate-in fade-in duration-200 flex items-center justify-between gap-3 ${
        isOverBudget
          ? 'bg-rose-50 border-rose-200 text-rose-900'
          : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`p-2 rounded-xl shrink-0 ${
            isOverBudget ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
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
        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black shrink-0 flex items-center gap-1 transition ${
          isOverBudget
            ? 'bg-rose-600 text-white hover:bg-rose-700'
            : 'bg-amber-600 text-white hover:bg-amber-700'
        }`}
      >
        <span>Cek Budget</span>
        <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  );
}